-- Al Aeraf — 0009: site-wide contact settings
--
-- Adds a single-row "site_settings" table holding the business contact
-- details (phone, WhatsApp/call number, email, address/service-area text)
-- that used to be hard-coded in data/content.ts across the Contact page,
-- the Footer, and the Hair Oil/RO Water hero "Call to Order" buttons.
-- Admins can now edit these from /admin/settings and the public site reads
-- them live, instead of a value only changeable by editing code and
-- redeploying.
--
-- Deliberately a single fixed row (id is a `boolean` that must be `true`,
-- so at most one row can ever exist) rather than a generic key/value table
-- — there is exactly one business, so there is exactly one settings row.
-- No new enums, no changes to any existing table.

create table if not exists public.site_settings (
  id boolean primary key default true,
  constraint site_settings_singleton check (id),
  business_phone_display text,
  business_phone_dial text,
  business_email text,
  business_address text,
  updated_at timestamptz not null default now()
);

-- Seed the one row with today's real, already-published values (from
-- data/content.ts) so switching the site over to read from this table is a
-- pure no-op for visitors until an admin actually changes something.
insert into public.site_settings (id, business_phone_display, business_phone_dial, business_email, business_address)
values (true, '0347 2249475', '+923472249475', null, 'Karachi — Nazimabad & nearby')
on conflict (id) do nothing;

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- Readable by anyone (it's the phone number/address shown on public
-- marketing pages), writable only by admins — same shape as
-- categories/products/subscription_plans.
create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_write"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());
