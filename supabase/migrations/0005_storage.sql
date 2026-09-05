-- Al Aeraf — 0005: Storage bucket for product images
--
-- Run after 0004_rls_policies.sql.
--
-- Foundation only: the storefront still renders static files from /public
-- today (see data/content.ts). This bucket exists so the admin side can
-- start uploading real product photos to Supabase Storage without any
-- frontend page depending on it yet.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Public read: product photos are meant to be visible on the storefront,
-- same as any other public catalog data.
create policy "product_images_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only admins may upload/replace/delete files in this bucket.
create policy "product_images_bucket_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_bucket_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
