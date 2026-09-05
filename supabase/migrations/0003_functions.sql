-- Al Aeraf — 0003: functions, triggers, and the 5km delivery-eligibility RPCs
--
-- Run after 0002_tables.sql.

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- is_admin() — the one place role checks live, so RLS policies elsewhere
-- don't each re-implement it. security definer + a fixed search_path lets
-- it read profiles even from inside a profiles RLS policy without
-- recursing into that same policy.
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Belt-and-suspenders against privilege escalation: even if an RLS policy
-- ever let a customer update their own profile row, this blocks changing
-- the role column unless the caller is already an admin.
-- ---------------------------------------------------------------------------
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an admin can change a profile role.';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_role_self_escalation on public.profiles;
create trigger prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ---------------------------------------------------------------------------
-- Human-friendly order numbers (AL-000001, AL-000002, ...) generated
-- server-side so nothing client-supplied ever becomes the order number.
-- ---------------------------------------------------------------------------
create sequence if not exists public.orders_order_number_seq;

create or replace function public.set_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := 'AL-' || lpad(nextval('public.orders_order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists set_orders_order_number on public.orders;
create trigger set_orders_order_number
  before insert on public.orders
  for each row execute function public.set_order_number();

-- ---------------------------------------------------------------------------
-- 5km (configurable per plant) delivery-radius check.
--
-- ro_plants is not exposed to anon/authenticated via table SELECT (see
-- 0004_rls_policies.sql) — the only way to learn anything about plant
-- locations is through these two functions, which return just enough to
-- answer "can you deliver here", never the full plant list.
-- ---------------------------------------------------------------------------
create or replace function public.nearest_eligible_ro_plant(lat double precision, lng double precision)
returns table (plant_id uuid, plant_name text, distance_m double precision)
language sql
security definer
set search_path = public
stable
as $$
  select
    id as plant_id,
    name as plant_name,
    ST_Distance(location, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography) as distance_m
  from public.ro_plants
  where is_active
    and ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      delivery_radius_km * 1000
    )
  order by distance_m asc
  limit 1;
$$;

create or replace function public.is_delivery_available(lat double precision, lng double precision)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.nearest_eligible_ro_plant(lat, lng));
$$;

revoke all on function public.nearest_eligible_ro_plant(double precision, double precision) from public;
grant execute on function public.nearest_eligible_ro_plant(double precision, double precision)
  to anon, authenticated;

revoke all on function public.is_delivery_available(double precision, double precision) from public;
grant execute on function public.is_delivery_available(double precision, double precision)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- create_order() — the only supported way to place an order.
--
-- Not called from any page yet (no checkout UI exists), but the RPC is
-- part of the foundation: it re-prices every item from the current catalog
-- (never trusts a client-submitted price), re-checks delivery eligibility
-- server-side, and writes the order + order_items atomically.
--
-- p_items shape: [{ "product_id": "<uuid>", "quantity": 2 }, ...]
-- ---------------------------------------------------------------------------
create or replace function public.create_order(
  p_address_id uuid,
  p_items jsonb,
  p_notes text default null
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_address record;
  v_plant record;
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(10, 2) := 0;
  v_delivery_fee numeric(10, 2) := 0;
  v_item jsonb;
  v_product record;
begin
  if v_customer_id is null then
    raise exception 'Authentication required.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item.';
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

  -- Pass 1: validate every line and total it up, pricing strictly from the
  -- current catalog.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select id, name, price into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
      and is_active
      and stock_status = 'in_stock';

    if not found then
      raise exception 'Product % is not available.', v_item ->> 'product_id';
    end if;

    if coalesce((v_item ->> 'quantity')::int, 0) <= 0 then
      raise exception 'Invalid quantity for product %.', v_product.name;
    end if;

    v_subtotal := v_subtotal + v_product.price * (v_item ->> 'quantity')::int;
  end loop;

  insert into public.orders (
    customer_id, address_id, assigned_ro_plant_id,
    subtotal, delivery_fee, total, notes
  )
  values (
    v_customer_id, p_address_id, v_plant.plant_id,
    v_subtotal, v_delivery_fee, v_subtotal + v_delivery_fee, p_notes
  )
  returning id, orders.order_number into v_order_id, v_order_number;

  -- Pass 2: write the line items now that the order row (and its id) exists.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select id, name, price into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid;

    insert into public.order_items (
      order_id, product_id, product_name, unit_price, quantity, subtotal
    )
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_product.price,
      (v_item ->> 'quantity')::int,
      v_product.price * (v_item ->> 'quantity')::int
    );
  end loop;

  return query select v_order_id, v_order_number;
end;
$$;

revoke all on function public.create_order(uuid, jsonb, text) from public;
grant execute on function public.create_order(uuid, jsonb, text) to authenticated;
