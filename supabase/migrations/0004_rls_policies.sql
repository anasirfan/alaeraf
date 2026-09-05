-- Al Aeraf — 0004: Row Level Security
--
-- Run after 0003_functions.sql.
--
-- General shape used throughout:
--   * Public catalog data (categories/products/product_images/subscription_plans)
--     is readable by anyone, writable only by admins.
--   * Private customer data (addresses/orders/order_items/subscriptions/
--     subscription_items) is readable/writable only by its owner
--     (customer_id = auth.uid()), with admins granted full access.
--   * ro_plants has NO public SELECT at all — proximity is only ever
--     revealed through the nearest_eligible_ro_plant()/is_delivery_available()
--     security-definer functions from 0003, so a customer can learn
--     "delivery is available here" without ever seeing the plant list.
--   * profiles: a user can read/update their own row; role changes are
--     blocked for non-admins by the prevent_role_self_escalation trigger
--     regardless of what RLS allows.
--   * is_admin() (from 0003) is security definer + a fixed search_path,
--     so it can safely read profiles from inside a profiles policy
--     without recursing into that same policy.

-- profiles ------------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- No insert/delete policy: rows are created only by the handle_new_user()
-- trigger (which runs as security definer and so bypasses RLS) and are
-- never deleted directly.

create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- categories ------------------------------------------------------------------
alter table public.categories enable row level security;

create policy "categories_public_read_active"
  on public.categories for select
  using (is_active or public.is_admin());

create policy "categories_admin_write"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- products ------------------------------------------------------------------
alter table public.products enable row level security;

create policy "products_public_read_active"
  on public.products for select
  using (is_active or public.is_admin());

create policy "products_admin_write"
  on public.products for all
  using (public.is_admin())
  with check (public.is_admin());

-- product_images ------------------------------------------------------------------
alter table public.product_images enable row level security;

create policy "product_images_public_read"
  on public.product_images for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.is_active
    )
  );

create policy "product_images_admin_write"
  on public.product_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ro_plants ------------------------------------------------------------------
-- Deliberately no select policy for anon/authenticated: this table stays
-- admin-only. Distance checks go through the security-definer functions in
-- 0003_functions.sql instead.
alter table public.ro_plants enable row level security;

create policy "ro_plants_admin_all"
  on public.ro_plants for all
  using (public.is_admin())
  with check (public.is_admin());

-- addresses ------------------------------------------------------------------
alter table public.addresses enable row level security;

create policy "addresses_owner_select"
  on public.addresses for select
  using (customer_id = auth.uid() or public.is_admin());

create policy "addresses_owner_insert"
  on public.addresses for insert
  with check (customer_id = auth.uid() or public.is_admin());

create policy "addresses_owner_update"
  on public.addresses for update
  using (customer_id = auth.uid() or public.is_admin())
  with check (customer_id = auth.uid() or public.is_admin());

create policy "addresses_owner_delete"
  on public.addresses for delete
  using (customer_id = auth.uid() or public.is_admin());

-- orders ------------------------------------------------------------------
-- Customers can see their own orders but never update/delete them directly
-- (order placement goes through create_order(), status changes are an
-- admin-only operation) — this keeps order history tamper-proof.
alter table public.orders enable row level security;

create policy "orders_owner_select"
  on public.orders for select
  using (customer_id = auth.uid() or public.is_admin());

create policy "orders_admin_write"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- order_items ------------------------------------------------------------------
alter table public.order_items enable row level security;

create policy "order_items_owner_select"
  on public.order_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.customer_id = auth.uid()
    )
  );

create policy "order_items_admin_write"
  on public.order_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- subscription_plans ------------------------------------------------------------------
alter table public.subscription_plans enable row level security;

create policy "subscription_plans_public_read_active"
  on public.subscription_plans for select
  using (is_active or public.is_admin());

create policy "subscription_plans_admin_write"
  on public.subscription_plans for all
  using (public.is_admin())
  with check (public.is_admin());

-- subscriptions ------------------------------------------------------------------
alter table public.subscriptions enable row level security;

create policy "subscriptions_owner_select"
  on public.subscriptions for select
  using (customer_id = auth.uid() or public.is_admin());

create policy "subscriptions_owner_insert"
  on public.subscriptions for insert
  with check (customer_id = auth.uid() or public.is_admin());

create policy "subscriptions_owner_update"
  on public.subscriptions for update
  using (customer_id = auth.uid() or public.is_admin())
  with check (customer_id = auth.uid() or public.is_admin());

create policy "subscriptions_admin_delete"
  on public.subscriptions for delete
  using (public.is_admin());

-- subscription_items ------------------------------------------------------------------
alter table public.subscription_items enable row level security;

create policy "subscription_items_owner_select"
  on public.subscription_items for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.subscriptions s
      where s.id = subscription_items.subscription_id and s.customer_id = auth.uid()
    )
  );

create policy "subscription_items_owner_write"
  on public.subscription_items for all
  using (
    public.is_admin()
    or exists (
      select 1 from public.subscriptions s
      where s.id = subscription_items.subscription_id and s.customer_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1 from public.subscriptions s
      where s.id = subscription_items.subscription_id and s.customer_id = auth.uid()
    )
  );
