-- ─────────────────────────────────────────────────────────────────────────────
-- newsletter_subscribers
--
-- Respaldo propio de las suscripciones del formulario del footer. Hasta ahora
-- el alta sólo viajaba a HubSpot: si HubSpot no estaba configurado (o fallaba),
-- el suscriptor se perdía. Con esta tabla el dato queda siempre nuestro y
-- `hubspot_synced` permite reintentar los que no llegaron al CRM.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.newsletter_subscribers (
  email text primary key,
  name text,
  -- De dónde vino el alta (hoy sólo 'footer'; deja lugar a landings/popups).
  source text not null default 'footer',
  -- false ⇒ no llegó a HubSpot todavía (token ausente o error): reintentable.
  hubspot_synced boolean not null default false,
  hubspot_contact_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

-- Los pendientes de sincronizar, para el reintento.
create index if not exists newsletter_subscribers_pending_idx
  on public.newsletter_subscribers (hubspot_synced)
  where hubspot_synced = false;

-- Postgres no soporta "create trigger if not exists", así que dropeamos antes
-- de crear. Esto mantiene la migración re-ejecutable sin romper.
drop trigger if exists newsletter_subscribers_set_updated_at
  on public.newsletter_subscribers;
create trigger newsletter_subscribers_set_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_updated_at();

alter table public.newsletter_subscribers enable row level security;

-- Sin policies para anon/customer a propósito: el alta la hace el route handler
-- con la service_role key (que bypassea RLS). Así la tabla no queda expuesta a
-- inserts masivos desde el browser ni a cosecha de emails.
-- (Las policies tampoco aceptan "if not exists": mismo patrón drop + create.)
drop policy if exists "newsletter_subscribers_staff_read"
  on public.newsletter_subscribers;
create policy "newsletter_subscribers_staff_read" on public.newsletter_subscribers
  for select using (public.is_staff_or_ro());

drop policy if exists "newsletter_subscribers_admin_write"
  on public.newsletter_subscribers;
create policy "newsletter_subscribers_admin_write" on public.newsletter_subscribers
  for all using (public.is_admin()) with check (public.is_admin());
