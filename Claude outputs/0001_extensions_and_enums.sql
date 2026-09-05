-- Al Aeraf — 0001: extensions and enums
--
-- Run this first. postgis powers the 5km delivery-radius check (see
-- 0003_functions.sql); pgcrypto provides gen_random_uuid() for primary
-- keys and is enabled by default on Supabase, but declared here so this
-- migration is self-contained.

create extension if not exists pgcrypto with schema public;
create extension if not exists postgis with schema public;

-- Roles -----------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'admin');
exception when duplicate_object then null;
end $$;

-- Catalog -----------------------------------------------------------------
do $$ begin
  create type public.product_type as enum ('hair_oil', 'ro_water');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.stock_status as enum ('in_stock', 'out_of_stock', 'preorder');
exception when duplicate_object then null;
end $$;

-- Orders ------------------------------------------------------------------
do $$ begin
  create type public.order_status as enum (
    'pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  -- 'manual' covers any non-COD arrangement handled outside the app
  -- (bank transfer, in-person, etc.) until a payment gateway exists.
  create type public.payment_method as enum ('cod', 'manual');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('unpaid', 'paid', 'refunded');
exception when duplicate_object then null;
end $$;

-- Subscriptions -------------------------------------------------------------
do $$ begin
  create type public.subscription_status as enum ('active', 'paused', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.subscription_frequency as enum ('weekly', 'fortnightly', 'monthly');
exception when duplicate_object then null;
end $$;
