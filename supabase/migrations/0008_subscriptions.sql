-- Al Aeraf — 0008: subscription security + RPCs
--
-- The subscriptions/subscription_plans/subscription_items tables and their
-- enums already existed (0001/0002) but were never wired to any UI. Two
-- things were missing before a real subscribe flow could be built safely:
--
-- 1. RLS gap: subscriptions_owner_insert and subscriptions_owner_update
--    (0004_rls_policies.sql) let a customer INSERT or UPDATE their own
--    subscription row directly through the Supabase client — including its
--    `status`. subscription_items_owner_write similarly let a customer
--    insert/update/delete their own subscription's line items, including
--    `unit_price`. Nothing stopped a customer from setting their own
--    subscription back to 'active' after an admin cancelled it, or editing
--    unit_price to anything they liked. orders/order_items never had this
--    problem — they only ever allow admin writes plus the security-definer
--    create_order() RPC. This migration brings subscriptions/
--    subscription_items to that same model: customers can only ever SELECT
--    their own rows directly; every write goes through one of the RPCs
--    below (security definer, own validation), or through an admin.
--
-- 2. No RPCs existed at all for creating a subscription, changing its
--    status, or generating a subscription's monthly delivery order — this
--    migration adds exactly those three, modeled directly on create_order()
--    (0003_functions.sql): never trust a client-submitted price, product
--    name, or total; always re-fetch from the live catalog; always
--    re-verify address ownership and delivery eligibility server-side.
--
-- No new tables or columns. Safe to run once against the existing schema.

-- ---------------------------------------------------------------------------
-- 1. Tighten RLS: subscriptions/subscription_items become select-only for
--    customers; every write is admin-only or via a security-definer RPC.
-- ---------------------------------------------------------------------------
drop policy if exists "subscriptions_owner_insert" on public.subscriptions;
drop policy if exists "subscriptions_owner_update" on public.subscriptions;
drop policy if exists "subscriptions_admin_delete" on public.subscriptions;

create policy "subscriptions_admin_write"
  on public.subscriptions for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "subscription_items_owner_write" on public.subscription_items;

create policy "subscription_items_admin_write"
  on public.subscription_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- subscriptions_owner_select / subscription_items_owner_select
-- (0004_rls_policies.sql) are untouched — customers keep full read access
-- to their own subscriptions and items, they just can no longer write them
-- directly.

-- ---------------------------------------------------------------------------
-- 2. create_subscription() — the only supported way for a customer to
--    start a subscription. Mirrors create_order()'s security model exactly:
--    auth.uid() (never a client-supplied id), address ownership, delivery
--    eligibility via the existing nearest_eligible_ro_plant(), and a fresh
--    re-fetch of price/name/active-status for every item from the live
--    products table. Subscriptions are RO-water-only by business rule, so
--    each item's product must be product_type = 'ro_water'.
--
-- p_items shape: [{ "product_id": "<uuid>", "quantity": 2 }, ...]
-- ---------------------------------------------------------------------------
create or replace function public.create_subscription(
  p_plan_id uuid,
  p_address_id uuid,
  p_items jsonb,
  p_notes text default null
)
returns table (subscription_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_address record;
  v_plant record;
  v_plan record;
  v_subscription_id uuid;
  v_total_quantity int := 0;
  v_item jsonb;
  v_product record;
  v_next_delivery date;
begin
  if v_customer_id is null then
    raise exception 'Authentication required.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Subscription must contain at least one item.';
  end if;

  select * into v_plan
  from public.subscription_plans
  where id = p_plan_id and is_active;

  if not found then
    raise exception 'Selected plan is not available.';
  end if;

  select * into v_address
  from public.addresses
  where id = p_address_id and customer_id = v_customer_id;

  if not found then
    raise exception 'Address not found for this customer.';
  end if;

  if v_address.latitude is null or v_address.longitude is null then
    raise exception 'Address is missing coordinates — cannot verify delivery eligibility.';
  end if;

  select * into v_plant
  from public.nearest_eligible_ro_plant(v_address.latitude, v_address.longitude);

  if not found then
    raise exception 'Delivery is not available for this address yet.';
  end if;

  -- Pass 1: validate every line against the live, RO-water-only catalog.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select id, name, price into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
      and is_active
      and stock_status = 'in_stock'
      and product_type = 'ro_water';

    if not found then
      raise exception 'Product % is not available for subscription.', v_item ->> 'product_id';
    end if;

    if coalesce((v_item ->> 'quantity')::int, 0) <= 0 then
      raise exception 'Invalid quantity for product %.', v_product.name;
    end if;

    v_total_quantity := v_total_quantity + (v_item ->> 'quantity')::int;
  end loop;

  v_next_delivery := current_date + case v_plan.default_frequency
    when 'weekly' then interval '7 days'
    when 'fortnightly' then interval '14 days'
    else interval '1 month'
  end;

  insert into public.subscriptions (
    customer_id, address_id, plan_id, frequency, status, quantity, next_delivery_date, notes
  )
  values (
    v_customer_id, p_address_id, p_plan_id, v_plan.default_frequency, 'active',
    v_total_quantity, v_next_delivery, p_notes
  )
  returning id into v_subscription_id;

  -- Pass 2: write the line items now that the subscription row exists,
  -- re-reading price fresh (a price change mid-request always resolves to
  -- what this second read sees, exactly like create_order()).
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select id, price into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid;

    insert into public.subscription_items (subscription_id, product_id, quantity, unit_price)
    values (v_subscription_id, v_product.id, (v_item ->> 'quantity')::int, v_product.price);
  end loop;

  return query select v_subscription_id;
end;
$$;

revoke all on function public.create_subscription(uuid, uuid, jsonb, text) from public;
grant execute on function public.create_subscription(uuid, uuid, jsonb, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. update_subscription_status() — the only supported way to change a
--    subscription's status. An admin may set any of the real
--    subscription_status enum values. A customer may only pause an active
--    subscription, resume a paused one, or cancel either — never touch
--    anything else about the row, and never reach a subscription that
--    isn't theirs (reported as "not found" rather than "forbidden", so a
--    customer can't use this to probe which subscription ids exist).
-- ---------------------------------------------------------------------------
create or replace function public.update_subscription_status(
  p_subscription_id uuid,
  p_status public.subscription_status
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub record;
  v_caller_is_admin boolean := public.is_admin();
begin
  select * into v_sub from public.subscriptions where id = p_subscription_id;

  if not found then
    raise exception 'Subscription not found.';
  end if;

  if not v_caller_is_admin then
    if v_sub.customer_id is distinct from auth.uid() then
      raise exception 'Subscription not found.';
    end if;

    if not (
      (v_sub.status = 'active' and p_status in ('paused', 'cancelled'))
      or (v_sub.status = 'paused' and p_status in ('active', 'cancelled'))
    ) then
      raise exception 'That status change is not allowed.';
    end if;
  end if;

  update public.subscriptions set status = p_status where id = p_subscription_id;
end;
$$;

revoke all on function public.update_subscription_status(uuid, public.subscription_status) from public;
grant execute on function public.update_subscription_status(uuid, public.subscription_status) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. create_subscription_delivery_order() — admin-only. Generates this
--    month's real order (in the existing orders/order_items tables — no
--    new tables) for one active subscription: re-verifies delivery
--    eligibility, re-fetches current pricing for every subscribed item, and
--    then advances the subscription's next_delivery_date by its frequency.
--
--    Deliberately NOT automatic/cron-driven: there is no payment gateway,
--    so every monthly delivery is an explicit admin action (a button in
--    the admin subscription screen), never a background job silently
--    creating orders and charging nobody for them.
-- ---------------------------------------------------------------------------
create or replace function public.create_subscription_delivery_order(
  p_subscription_id uuid
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub record;
  v_address record;
  v_plant record;
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(10, 2) := 0;
  v_item record;
  v_product record;
begin
  if not public.is_admin() then
    raise exception 'Admin access required.';
  end if;

  select * into v_sub from public.subscriptions where id = p_subscription_id;
  if not found then
    raise exception 'Subscription not found.';
  end if;

  if v_sub.status <> 'active' then
    raise exception 'Subscription is not active.';
  end if;

  select * into v_address from public.addresses where id = v_sub.address_id;
  if v_address.latitude is null or v_address.longitude is null then
    raise exception 'Address is missing coordinates — cannot verify delivery eligibility.';
  end if;

  select * into v_plant
  from public.nearest_eligible_ro_plant(v_address.latitude, v_address.longitude);

  if not found then
    raise exception 'Delivery is not available for this address yet.';
  end if;

  if not exists (select 1 from public.subscription_items where subscription_id = p_subscription_id) then
    raise exception 'Subscription has no items.';
  end if;

  insert into public.orders (
    customer_id, address_id, assigned_ro_plant_id, status, payment_method, payment_status,
    subtotal, delivery_fee, total, notes
  )
  values (
    v_sub.customer_id, v_sub.address_id, v_plant.plant_id, 'pending', 'cod', 'unpaid',
    0, 0, 0, 'Subscription delivery'
  )
  returning id, orders.order_number into v_order_id, v_order_number;

  for v_item in select * from public.subscription_items where subscription_id = p_subscription_id
  loop
    select id, name, price into v_product
    from public.products
    where id = v_item.product_id and is_active and stock_status = 'in_stock';

    if not found then
      raise exception 'Product % is not available.', v_item.product_id;
    end if;

    insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
    values (v_order_id, v_product.id, v_product.name, v_product.price, v_item.quantity, v_product.price * v_item.quantity);

    v_subtotal := v_subtotal + v_product.price * v_item.quantity;
  end loop;

  update public.orders set subtotal = v_subtotal, total = v_subtotal where id = v_order_id;

  update public.subscriptions
  set next_delivery_date = coalesce(next_delivery_date, current_date) + case frequency
    when 'weekly' then interval '7 days'
    when 'fortnightly' then interval '14 days'
    else interval '1 month'
  end
  where id = p_subscription_id;

  return query select v_order_id, v_order_number;
end;
$$;

revoke all on function public.create_subscription_delivery_order(uuid) from public;
grant execute on function public.create_subscription_delivery_order(uuid) to authenticated;
