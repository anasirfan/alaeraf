-- Al Aeraf — 0010: Hair Oil orders should never be blocked by RO-plant
-- delivery radius
--
-- Bug: create_order() (0003_functions.sql) required EVERY order — even a
-- cart containing only Hair Oil — to have an address with coordinates that
-- fall inside an active RO Plant's delivery radius. That radius check only
-- makes sense for RO Water (it's shipped from a physical plant, so it can
-- only reach addresses near one); Hair Oil ships by courier and was never
-- meant to be geography-limited. The result: customers ordering Hair Oil
-- only, from an address outside the plant's ~7km radius (or with no
-- coordinates saved at all), got "Delivery is not available for this
-- address yet." even though nothing about their order actually depended on
-- the RO plant.
--
-- Fix: create_order() now only requires address coordinates + RO-plant
-- eligibility when the order actually contains at least one 'ro_water'
-- product. A Hair-Oil-only order skips that check entirely — any address
-- (with or without coordinates) is accepted, and assigned_ro_plant_id is
-- left null (the column has always allowed null — see 0002_tables.sql).
-- An order that mixes Hair Oil and RO Water in the same cart is still
-- treated as needing the RO-plant check, since the water item does.
--
-- Run after 0009_site_settings.sql, in the Supabase SQL editor (same
-- process as every other migration in this project — there is no linked
-- CLI/DB connection to apply this automatically).

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
  v_needs_ro_plant boolean;
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

  -- Only Hair Oil, or a mix that includes RO Water? Checked directly
  -- against the current catalog (never trusting anything the client sent
  -- beyond product_id), same as the pricing pass below.
  select exists (
    select 1
    from jsonb_array_elements(p_items) as item
    join public.products p on p.id = (item ->> 'product_id')::uuid
    where p.product_type = 'ro_water'
  ) into v_needs_ro_plant;

  if v_needs_ro_plant then
    if v_address.latitude is null or v_address.longitude is null then
      raise exception 'Address is missing coordinates — cannot verify delivery eligibility.';
    end if;

    select * into v_plant
    from public.nearest_eligible_ro_plant(v_address.latitude, v_address.longitude);

    if not found then
      raise exception 'Delivery is not available for this address yet.';
    end if;
  else
    -- Hair Oil only: no plant involved, no coordinate requirement.
    v_plant := null;
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

-- Ownership/grants are unchanged from 0003_functions.sql — CREATE OR REPLACE
-- keeps them, but re-stating is harmless and keeps this migration
-- self-contained.
revoke all on function public.create_order(uuid, jsonb, text) from public;
grant execute on function public.create_order(uuid, jsonb, text) to authenticated;
