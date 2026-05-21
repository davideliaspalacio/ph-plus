-- =============================================================================
-- PH PLUS — Row Level Security
-- =============================================================================
-- Roles enforced:
--   anon              → can read public catalog, content, settings, public reviews;
--                       can create orders + reviews as guest (limited).
--   authenticated     → above + read own profile/addresses/orders, write reviews
--                       linked to themselves, manage own addresses.
--   staff/super_admin → full access via is_admin() helper.
--   read_only         → admin-readable everything but no writes.
--
-- Helpers (security definer to avoid recursion on profiles):
--   * public.current_role()  → role of the currently authenticated user
--   * public.is_admin()      → role in (staff, super_admin)
--   * public.is_staff_or_ro()→ role in (staff, super_admin, read_only)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper functions
-- -----------------------------------------------------------------------------

create or replace function public.current_role()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select role in ('staff', 'super_admin')
    from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff_or_ro()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select role in ('staff', 'super_admin', 'read_only')
    from public.profiles where id = auth.uid();
$$;

-- -----------------------------------------------------------------------------
-- Enable RLS everywhere
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.orders enable row level security;
alter table public.order_lines enable row level security;
alter table public.order_notes enable row level security;
alter table public.reviews enable row level security;
alter table public.stock_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.content enable row level security;
alter table public.settings enable row level security;
alter table public.notifications_outbox enable row level security;
alter table public.keep_alive enable row level security;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------

create policy "profiles_select_self_or_staff_ro"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.is_staff_or_ro()
  );

create policy "profiles_update_self_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (
    -- Role can only be changed by admins
    (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()))
    or public.is_admin()
  );

-- Insert handled by trigger (handle_new_user). No client insert policy.

-- -----------------------------------------------------------------------------
-- addresses — owner-only + admin full access
-- -----------------------------------------------------------------------------

create policy "addresses_owner_select" on public.addresses
  for select using (user_id = auth.uid() or public.is_staff_or_ro());

create policy "addresses_owner_insert" on public.addresses
  for insert with check (user_id = auth.uid());

create policy "addresses_owner_update" on public.addresses
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "addresses_owner_delete" on public.addresses
  for delete using (user_id = auth.uid());

create policy "addresses_admin_all" on public.addresses
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- products — public read; write only admin
-- -----------------------------------------------------------------------------

create policy "products_public_select"
  on public.products for select
  using (is_active or public.is_staff_or_ro());

create policy "products_admin_write"
  on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- coupons — public read of code (storefront validates by code), write admin
-- -----------------------------------------------------------------------------

create policy "coupons_public_select"
  on public.coupons for select
  using (is_active or public.is_staff_or_ro());

create policy "coupons_admin_write"
  on public.coupons for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- shipping_zones — public read; write admin
-- -----------------------------------------------------------------------------

create policy "shipping_zones_public_select"
  on public.shipping_zones for select
  using (is_active or public.is_staff_or_ro());

create policy "shipping_zones_admin_write"
  on public.shipping_zones for all
  using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- orders + lines + notes
-- -----------------------------------------------------------------------------

create policy "orders_owner_or_guest_select" on public.orders
  for select using (
    user_id = auth.uid()                  -- propio
    or (user_id is null)                  -- guest checkout: caller will scope by id
    or public.is_staff_or_ro()
  );

create policy "orders_create_any" on public.orders
  for insert with check (
    -- Guest checkout: user_id NULL allowed
    -- Logged user: must be themselves
    user_id is null or user_id = auth.uid()
  );

create policy "orders_admin_update" on public.orders
  for update using (public.is_admin())
  with check (public.is_admin());

create policy "orders_admin_delete" on public.orders
  for delete using (public.is_admin());

-- order_lines piggyback on parent order
create policy "order_lines_select_via_order" on public.order_lines
  for select using (
    exists (
      select 1 from public.orders o
       where o.id = order_lines.order_id
         and (o.user_id = auth.uid()
              or o.user_id is null
              or public.is_staff_or_ro())
    )
  );

create policy "order_lines_insert_with_order" on public.order_lines
  for insert with check (
    exists (
      select 1 from public.orders o
       where o.id = order_lines.order_id
         and (o.user_id is null or o.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "order_lines_admin_write" on public.order_lines
  for all using (public.is_admin()) with check (public.is_admin());

-- order_notes are admin-only
create policy "order_notes_admin_only" on public.order_notes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order_notes_staff_ro_read" on public.order_notes
  for select using (public.is_staff_or_ro());

-- -----------------------------------------------------------------------------
-- reviews — anyone reads approved; writes require sesión, status='pending'
-- -----------------------------------------------------------------------------

create policy "reviews_public_select"
  on public.reviews for select
  using (status = 'approved' or user_id = auth.uid() or public.is_staff_or_ro());

create policy "reviews_authenticated_insert"
  on public.reviews for insert
  with check (
    auth.uid() is not null
    and user_id = auth.uid()
    and status = 'pending'
  );

create policy "reviews_admin_update"
  on public.reviews for update
  using (public.is_admin()) with check (public.is_admin());

create policy "reviews_admin_delete"
  on public.reviews for delete
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- inventory — admin only
-- -----------------------------------------------------------------------------

create policy "stock_items_admin" on public.stock_items
  for all using (public.is_admin()) with check (public.is_admin());

create policy "stock_items_staff_ro_read" on public.stock_items
  for select using (public.is_staff_or_ro());

create policy "stock_movements_admin" on public.stock_movements
  for all using (public.is_admin()) with check (public.is_admin());

create policy "stock_movements_staff_ro_read" on public.stock_movements
  for select using (public.is_staff_or_ro());

-- -----------------------------------------------------------------------------
-- content + settings — public read; write admin
-- -----------------------------------------------------------------------------

create policy "content_public_select" on public.content
  for select using (true);

create policy "content_admin_write" on public.content
  for all using (public.is_admin()) with check (public.is_admin());

create policy "settings_public_select" on public.settings
  for select using (true);

create policy "settings_admin_write" on public.settings
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- notifications_outbox — admin only (it's an audit log of emails sent)
-- -----------------------------------------------------------------------------

create policy "notifications_outbox_admin" on public.notifications_outbox
  for all using (public.is_admin()) with check (public.is_admin());

create policy "notifications_outbox_staff_ro_read" on public.notifications_outbox
  for select using (public.is_staff_or_ro());

-- -----------------------------------------------------------------------------
-- keep_alive — anon can insert/read so the GitHub Action cron job can ping it
-- -----------------------------------------------------------------------------

create policy "keep_alive_anyone_insert" on public.keep_alive
  for insert with check (true);

create policy "keep_alive_anyone_select" on public.keep_alive
  for select using (true);
