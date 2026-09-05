-- Al Aeraf — 0006: profile signup metadata + default-address flag
--
-- Run after 0005_storage.sql. Written for the customer auth/profile/address
-- phase: two small, additive changes, nothing destructive.
--
-- 1. handle_new_user() now copies full_name/phone out of the signup form's
--    auth metadata into the new profiles row immediately, instead of the
--    customer seeing a blank name until they visit /account and edit it.
-- 2. addresses gets an is_default flag so a customer can mark one saved
--    address as their default. A partial unique index guarantees at most
--    one default per customer at the database level — the application
--    still does two sequential updates (clear old default, then set the
--    new one) so the constraint is never violated mid-request.

alter table public.addresses
  add column if not exists is_default boolean not null default false;

create unique index if not exists addresses_one_default_per_customer
  on public.addresses (customer_id)
  where is_default;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
