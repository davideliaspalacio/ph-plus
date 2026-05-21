-- =============================================================================
-- PH PLUS — Initial schema
-- =============================================================================
-- Defines the full domain in Postgres mirroring the Zod schemas of the
-- corresponding `src/features/*` modules. RLS is set up in a later migration.
--
-- Conventions:
--   * Lower-case snake_case tables and columns
--   * UUID primary keys (default gen_random_uuid())
--   * created_at / updated_at on every mutable row, with auto-update trigger
--   * Money values stored as bigint (centavos COP — Colombian peso has no cents
--     in practice; using bigint keeps room for currency changes later)
--   * No money types or numerics — keeps math simple in the app layer
--   * Soft deletes via is_active flags rather than DELETE
-- =============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- ENUM types
-- -----------------------------------------------------------------------------

create type user_role as enum (
  'customer',
  'read_only',
  'staff',
  'super_admin'
);

create type product_category as enum (
  'botellon',
  'garrafa',
  'recarga',
  'kit',
  'promocion'
);

create type product_size as enum (
  '1L',
  '1.5L',
  '5L',
  '19L',
  'kit'
);

create type product_visual_key as enum (
  'kit',
  'garrafas',
  'recargas'
);

create type order_status as enum (
  'draft',
  'pending_payment',
  'paid',
  'preparing',
  'shipped',
  'delivered',
  'closed',
  'cancelled',
  'refunded'
);

create type payment_method as enum (
  'credit_card',
  'pse',
  'nequi',
  'cash_on_delivery',
  'mock'
);

create type coupon_type as enum (
  'percent',
  'fixed',
  'free_shipping'
);

create type review_status as enum (
  'pending',
  'approved',
  'rejected'
);

create type stock_movement_type as enum (
  'in',
  'out',
  'adjustment',
  'return'
);

create type stock_movement_reason as enum (
  'purchase',
  'sale',
  'loss',
  'return',
  'manual'
);

create type email_template as enum (
  'order_confirmation',
  'order_shipped',
  'password_recover',
  'welcome',
  'review_approved',
  'low_stock_alert',
  'custom'
);

create type email_status as enum (
  'queued',
  'sent',
  'failed'
);

-- -----------------------------------------------------------------------------
-- Helper: trigger function to keep updated_at fresh
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- profiles
-- -----------------------------------------------------------------------------
-- Each row mirrors an entry in auth.users (Supabase Auth) and stores domain
-- attributes that don't belong in auth.users (display name, role, etc).
--
-- Convention: profiles.id == auth.users.id, so we never expose another id.
-- A trigger in 20260520000003_functions_triggers.sql auto-creates a profile
-- row on auth.user creation.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  name text not null default '',
  role user_role not null default 'customer',
  is_vip boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profiles_role_idx on public.profiles (role);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- addresses
-- -----------------------------------------------------------------------------

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null default 'Casa',
  name text not null,
  line1 text not null,
  line2 text not null default '',
  city text not null,
  department text not null,
  postal_code text not null default '',
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index addresses_user_id_idx on public.addresses (user_id);

create unique index addresses_one_default_per_user_idx
  on public.addresses (user_id) where is_default;

create trigger addresses_set_updated_at
  before update on public.addresses
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------
-- Storefront catalog. Visual metadata (gallery, visualKey, longDescription,
-- features, includes, usage) lives in JSON columns to keep the schema compact
-- and aligned with the legacy Product shape used by the UI.

create table public.products (
  slug text primary key,
  title text not null,
  short_title text not null,
  tagline text not null,
  description text not null default '',
  long_description jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  includes jsonb not null default '[]'::jsonb,
  price_value bigint not null check (price_value >= 0),
  prev_price_value bigint check (prev_price_value > 0),
  category product_category not null,
  size product_size not null,
  visual_key product_visual_key not null,
  popularity integer not null default 0,
  highlight boolean not null default false,
  badge jsonb,
  gallery jsonb not null default '[]'::jsonb,
  specs jsonb not null default '[]'::jsonb,
  usage jsonb not null default '[]'::jsonb,
  rating_average numeric(2, 1) not null default 0,
  rating_count integer not null default 0,
  is_active boolean not null default true,
  in_stock boolean not null default true,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index products_category_idx on public.products (category);
create index products_is_active_idx on public.products (is_active);
create index products_popularity_idx on public.products (popularity desc);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- coupons
-- -----------------------------------------------------------------------------

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type coupon_type not null,
  value integer not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  min_subtotal bigint not null default 0,
  max_uses integer not null default 0,
  max_uses_per_customer integer not null default 0,
  used_count integer not null default 0,
  is_active boolean not null default true,
  product_slugs jsonb,
  category_slugs jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index coupons_code_idx on public.coupons (code);
create index coupons_active_idx on public.coupons (is_active);

create trigger coupons_set_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- shipping_zones
-- -----------------------------------------------------------------------------

create table public.shipping_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  regions jsonb not null default '[]'::jsonb,
  cost bigint not null check (cost >= 0),
  lead_time_days_min integer not null check (lead_time_days_min >= 1),
  lead_time_days_max integer not null,
  free_shipping_threshold bigint,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint shipping_zones_lead_time_chk
    check (lead_time_days_max >= lead_time_days_min)
);

create index shipping_zones_active_idx on public.shipping_zones (is_active);

create trigger shipping_zones_set_updated_at
  before update on public.shipping_zones
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- orders
-- -----------------------------------------------------------------------------

create table public.orders (
  id text primary key,  -- ORD-XXXXXXX prefix is meaningful for support
  user_id uuid references public.profiles (id) on delete set null,
  status order_status not null default 'pending_payment',
  -- denormalized snapshot for permanence / audit
  contact jsonb not null,
  shipping jsonb not null,
  payment jsonb not null,
  totals jsonb not null,
  coupon_code text,
  tracking_number text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index orders_created_at_idx on public.orders (created_at desc);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- order lines (one row per product in the order)
create table public.order_lines (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders (id) on delete cascade,
  slug text not null,
  title text not null,
  quantity integer not null check (quantity > 0),
  unit_price bigint not null check (unit_price >= 0),
  line_total bigint not null check (line_total >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create index order_lines_order_id_idx on public.order_lines (order_id);
create index order_lines_slug_idx on public.order_lines (slug);

-- order internal notes
create table public.order_notes (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders (id) on delete cascade,
  author text not null,
  text text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index order_notes_order_id_idx on public.order_notes (order_id);

-- -----------------------------------------------------------------------------
-- reviews
-- -----------------------------------------------------------------------------

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null references public.products (slug) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text not null,
  text text not null check (length(text) >= 10),
  photo text,
  recommends boolean not null default true,
  status review_status not null default 'pending',
  rejection_reason text,
  admin_response text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index reviews_product_slug_idx on public.reviews (product_slug);
create index reviews_status_idx on public.reviews (status);
create index reviews_user_id_idx on public.reviews (user_id);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- inventory
-- -----------------------------------------------------------------------------

create table public.stock_items (
  sku text primary key,
  product_slug text not null references public.products (slug) on delete cascade,
  current integer not null default 0,
  low integer not null default 5,
  location text,
  updated_at timestamptz not null default timezone('utc', now())
);

create index stock_items_product_slug_idx on public.stock_items (product_slug);
create index stock_items_low_idx on public.stock_items (current) where current <= low;

create trigger stock_items_set_updated_at
  before update on public.stock_items
  for each row execute function public.set_updated_at();

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  sku text not null references public.stock_items (sku) on delete cascade,
  type stock_movement_type not null,
  quantity integer not null check (quantity > 0),
  reason stock_movement_reason not null,
  note text,
  author text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index stock_movements_sku_idx on public.stock_movements (sku);
create index stock_movements_created_at_idx on public.stock_movements (created_at desc);

-- -----------------------------------------------------------------------------
-- content (single document — store ID = 'main')
-- -----------------------------------------------------------------------------

create table public.content (
  id text primary key,
  home_hero jsonb not null,
  featured_slugs jsonb not null default '[]'::jsonb,
  banners jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger content_set_updated_at
  before update on public.content
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- settings (single document — store ID = 'main')
-- -----------------------------------------------------------------------------

create table public.settings (
  id text primary key,
  business_name text not null,
  nit text not null,
  phone text not null,
  whatsapp text not null,
  address text,
  tax_rate numeric(5, 4) not null default 0,
  payment_methods jsonb not null default '[]'::jsonb,
  policies jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- notifications outbox
-- -----------------------------------------------------------------------------

create table public.notifications_outbox (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  html text not null,
  template email_template not null,
  payload jsonb,
  status email_status not null default 'queued',
  error text,
  created_at timestamptz not null default timezone('utc', now()),
  sent_at timestamptz
);

create index notifications_outbox_status_idx on public.notifications_outbox (status);
create index notifications_outbox_created_at_idx on public.notifications_outbox (created_at desc);

-- -----------------------------------------------------------------------------
-- keep-alive helper table
-- -----------------------------------------------------------------------------
-- Used by .github/workflows/supabase-keepalive.yml to write a row every few
-- days and prevent the project from being paused on the free tier.

create table public.keep_alive (
  id uuid primary key default gen_random_uuid(),
  pinged_at timestamptz not null default timezone('utc', now())
);
