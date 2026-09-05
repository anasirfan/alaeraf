-- Al Aeraf — 0002: tables, indexes, updated_at triggers
--
-- Run after 0001_extensions_and_enums.sql.

-- Shared helper: keeps updated_at current on every UPDATE. Applied to every
-- table below that has an updated_at column.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles ------------------------------------------------------------------
-- One row per auth user (id is also the FK to auth.users). Created
-- automatically by the handle_new_user() trigger in 0003_functions.sql —
-- never insert into this table directly from the app.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- categories ------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

create index if not exists categories_is_active_idx on public.categories (is_active);

-- products ------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  product_type public.product_type not null,
  size_label text,
  stock_status public.stock_status not null default 'in_stock',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists products_is_active_idx on public.products (is_active);
create index if not exists products_product_type_idx on public.products (product_type);

-- product_images ------------------------------------------------------------------
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on public.product_images (product_id);

-- ro_plants ------------------------------------------------------------------
create table if not exists public.ro_plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  -- Generated PostGIS point, kept in sync with latitude/longitude
  -- automatically. Indexed below for fast "nearest plant" queries.
  location geography(point, 4326)
    generated always as (
      ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
    ) stored,
  delivery_radius_km numeric(5, 2) not null default 5 check (delivery_radius_km > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_ro_plants_updated_at on public.ro_plants;
create trigger set_ro_plants_updated_at
  before update on public.ro_plants
  for each row execute function public.set_updated_at();

create index if not exists ro_plants_location_idx on public.ro_plants using gist (location);
create index if not exists ro_plants_is_active_idx on public.ro_plants (is_active);

-- addresses ------------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  area text,
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  location geography(point, 4326)
    generated always as (
      case
        when latitude is not null and longitude is not null
          then ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        else null
      end
    ) stored,
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

create index if not exists addresses_customer_id_idx on public.addresses (customer_id);
create index if not exists addresses_location_idx on public.addresses using gist (location);

-- orders ------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid not null references public.profiles (id) on delete restrict,
  address_id uuid not null references public.addresses (id) on delete restrict,
  status public.order_status not null default 'pending',
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  payment_method public.payment_method not null default 'cod',
  payment_status public.payment_status not null default 'unpaid',
  notes text,
  assigned_ro_plant_id uuid references public.ro_plants (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_assigned_ro_plant_id_idx on public.orders (assigned_ro_plant_id);

-- order_items ------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  -- kept nullable + on delete set null: a discontinued product shouldn't
  -- delete history from a past order. product_name/unit_price below are
  -- snapshots for exactly this reason.
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_product_id_idx on public.order_items (product_id);

-- subscription_plans ------------------------------------------------------------------
-- Lookup table for the Essential / Family / Custom plans shown on the
-- marketing site today (data/content.ts) — not wired to the frontend yet,
-- but gives subscriptions a real FK instead of a free-text plan name.
create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  default_frequency public.subscription_frequency not null default 'monthly',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_subscription_plans_updated_at on public.subscription_plans;
create trigger set_subscription_plans_updated_at
  before update on public.subscription_plans
  for each row execute function public.set_updated_at();

-- subscriptions ------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  address_id uuid not null references public.addresses (id) on delete restrict,
  plan_id uuid not null references public.subscription_plans (id) on delete restrict,
  frequency public.subscription_frequency not null,
  status public.subscription_status not null default 'active',
  quantity int not null default 1 check (quantity > 0),
  next_delivery_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

create index if not exists subscriptions_customer_id_idx on public.subscriptions (customer_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

-- subscription_items ------------------------------------------------------------------
create table if not exists public.subscription_items (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0)
);

create index if not exists subscription_items_subscription_id_idx
  on public.subscription_items (subscription_id);
