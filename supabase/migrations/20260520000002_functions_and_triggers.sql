-- =============================================================================
-- PH PLUS — Functions and triggers
-- =============================================================================
-- Business logic that lives in the database:
--   * handle_new_user — auto-create profiles row when auth.users gets a row
--   * enforce_order_status_transition — block invalid status changes
--   * recompute_product_rating — keep products.rating_* in sync with reviews
--   * apply_stock_movement — atomic stock update (validates against
--     INSUFFICIENT_STOCK; mirrors the domain rule in admin/inventory)
--   * order_id helper (ORD-XXXXXXX)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Auto-create profiles row on signup
-- -----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_name text;
begin
  default_name := coalesce(
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, default_name, 'customer')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2) Validate order status transitions
-- -----------------------------------------------------------------------------
-- Mirrors features/orders/domain/status.ts:isValidTransition().
-- Throws if a forbidden transition is attempted.

create or replace function public.is_valid_order_transition(
  from_status order_status,
  to_status order_status
)
returns boolean
language sql
immutable
as $$
  select case
    when from_status = to_status then true
    when from_status = 'draft' then
      to_status in ('pending_payment', 'cancelled')
    when from_status = 'pending_payment' then
      to_status in ('paid', 'cancelled')
    when from_status = 'paid' then
      to_status in ('preparing', 'cancelled', 'refunded')
    when from_status = 'preparing' then
      to_status in ('shipped', 'cancelled', 'refunded')
    when from_status = 'shipped' then
      to_status in ('delivered', 'refunded')
    when from_status = 'delivered' then
      to_status in ('closed', 'refunded')
    else false
  end;
$$;

create or replace function public.enforce_order_status_transition()
returns trigger
language plpgsql
as $$
begin
  if old.status is distinct from new.status
     and not public.is_valid_order_transition(old.status, new.status) then
    raise exception 'INVALID_TRANSITION:%->%', old.status, new.status
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists orders_enforce_transition on public.orders;
create trigger orders_enforce_transition
  before update of status on public.orders
  for each row execute function public.enforce_order_status_transition();

-- -----------------------------------------------------------------------------
-- 3) Recompute product.rating_average + rating_count from approved reviews
-- -----------------------------------------------------------------------------

create or replace function public.recompute_product_rating(slug_to_update text)
returns void
language plpgsql
as $$
declare
  avg_rating numeric;
  cnt integer;
begin
  select coalesce(avg(rating), 0)::numeric(2, 1), count(*)
    into avg_rating, cnt
    from public.reviews
   where product_slug = slug_to_update
     and status = 'approved';

  update public.products
     set rating_average = avg_rating,
         rating_count = cnt
   where slug = slug_to_update;
end;
$$;

create or replace function public.on_review_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recompute_product_rating(old.product_slug);
    return old;
  end if;

  perform public.recompute_product_rating(new.product_slug);

  -- If product_slug changed, refresh the previous one too.
  if tg_op = 'UPDATE' and old.product_slug is distinct from new.product_slug then
    perform public.recompute_product_rating(old.product_slug);
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_recompute_rating on public.reviews;
create trigger reviews_recompute_rating
  after insert or update or delete on public.reviews
  for each row execute function public.on_review_change();

-- -----------------------------------------------------------------------------
-- 4) Apply stock movement atomically
-- -----------------------------------------------------------------------------
-- Returns the new stock level. Throws INSUFFICIENT_STOCK when an "out"
-- movement would push current below zero. "adjustment" sets the absolute
-- value; everything else is additive.

create or replace function public.apply_stock_movement(
  p_sku text,
  p_type stock_movement_type,
  p_quantity integer,
  p_reason stock_movement_reason,
  p_author text,
  p_note text default null
)
returns public.stock_items
language plpgsql
as $$
declare
  current_qty integer;
  next_qty integer;
  result public.stock_items;
begin
  if p_quantity <= 0 then
    raise exception 'INVALID_QUANTITY'
      using errcode = 'P0001';
  end if;

  select current into current_qty
    from public.stock_items
   where sku = p_sku
   for update;

  if current_qty is null then
    raise exception 'SKU_NOT_FOUND:%', p_sku
      using errcode = 'P0001';
  end if;

  next_qty := case p_type
    when 'in' then current_qty + p_quantity
    when 'return' then current_qty + p_quantity
    when 'out' then current_qty - p_quantity
    when 'adjustment' then p_quantity
  end;

  if next_qty < 0 then
    raise exception 'INSUFFICIENT_STOCK'
      using errcode = 'P0001';
  end if;

  insert into public.stock_movements (sku, type, quantity, reason, author, note)
  values (p_sku, p_type, p_quantity, p_reason, p_author, p_note);

  update public.stock_items
     set current = next_qty,
         updated_at = timezone('utc', now())
   where sku = p_sku
   returning * into result;

  return result;
end;
$$;

-- -----------------------------------------------------------------------------
-- 5) Generate an order id with the ORD- prefix
-- -----------------------------------------------------------------------------
-- Mirrors src/shared/lib/id.ts:newOrderId(). Used as a default value when the
-- client doesn't pre-compute it.

create or replace function public.new_order_id()
returns text
language plpgsql
volatile
as $$
declare
  candidate text;
  exists_already boolean;
  attempts integer := 0;
begin
  loop
    candidate := 'ORD-' || upper(replace(
      encode(gen_random_bytes(6), 'base64'),
      '/', '0'
    ));
    candidate := regexp_replace(candidate, '[^A-Z0-9]', '0', 'g');
    candidate := substring(candidate from 1 for 12); -- ORD-XXXXXXXX

    select exists(select 1 from public.orders where id = candidate)
      into exists_already;

    exit when not exists_already;
    attempts := attempts + 1;
    if attempts > 5 then
      raise exception 'COULD_NOT_GENERATE_ORDER_ID';
    end if;
  end loop;

  return candidate;
end;
$$;
