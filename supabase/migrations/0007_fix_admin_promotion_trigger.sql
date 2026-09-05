-- Al Aeraf — 0007: fix prevent_role_self_escalation to allow admin promotion
--
-- Discovered while verifying the products/categories admin CRUD phase:
-- prevent_role_self_escalation() (0003_functions.sql) blocks a role change
-- whenever is_admin() is false — and is_admin() reads auth.uid(), which is
-- NULL for any request with no logged-in app session. That includes the
-- Supabase SQL Editor and a service-role script — i.e. every sanctioned way
-- to create the first admin account, since there is deliberately no
-- "become admin" option anywhere in the app itself.
--
-- Net effect before this fix: the documented manual promotion step —
--   update public.profiles set role = 'admin' where email = '...';
-- run in the SQL Editor — actually FAILS with "Only an admin can change a
-- profile role." No admin account could ever be created.
--
-- Fix: only block a role change made BY an authenticated, non-admin app
-- session (auth.uid() is not null and that session isn't already an
-- admin). A request with no auth.uid() at all was never the customer
-- self-escalation path this trigger exists to stop — it's the SQL Editor,
-- a service-role script, or a migration. The real protection is
-- unchanged: a logged-in customer can never flip their own or anyone
-- else's role through the app, because auth.uid() is not null for them
-- and is_admin() is false.
--
-- Safe to run any number of times (create or replace).

create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only an admin can change a profile role.';
  end if;
  return new;
end;
$$;
