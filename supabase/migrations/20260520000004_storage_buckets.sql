-- =============================================================================
-- PH PLUS — Storage buckets
-- =============================================================================
-- Two public buckets:
--   * product-images — uploaded from the admin
--   * review-photos  — uploaded by customers
--
-- Policies are kept simple: public read, authenticated/admin write.
-- =============================================================================

insert into storage.buckets (id, name, public)
values
  ('product-images', 'product-images', true),
  ('review-photos', 'review-photos', true)
on conflict (id) do nothing;

-- product-images: public read, admin write
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

create policy "product_images_admin_update"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());

-- review-photos: public read, authenticated write (own files only)
create policy "review_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'review-photos');

create policy "review_photos_authenticated_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'review-photos'
    and auth.uid() is not null
    -- The file path must start with the user's id: <uid>/<filename>
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "review_photos_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'review-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "review_photos_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'review-photos'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_admin()
    )
  );
