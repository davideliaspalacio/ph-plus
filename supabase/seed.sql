-- =============================================================================
-- PH PLUS — Seed data
-- =============================================================================
-- Idempotent: every insert uses on conflict do nothing so this file can be
-- re-applied safely. After `supabase db reset` you get a fully populated demo
-- store with 11 products, 4 shipping zones, 3 coupons, content + settings.
--
-- Test users (created via Supabase Auth in a separate step, not here):
--   admin@ph-plus.co      / Admin1234!     (super_admin)
--   staff@ph-plus.co      / Staff1234!     (staff)
--   reader@ph-plus.co     / Reader1234!    (read_only)
--   ada@ph-plus.co        / Ada12345!      (customer)
--   linus@ph-plus.co      / Linus12345!    (customer)
--
-- See `docs/SUPABASE-MIGRATION.md` → "How to create the test users" for the
-- exact CLI snippet (uses supabase admin generateLink + service role key).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- products
-- -----------------------------------------------------------------------------

insert into public.products (
  slug, title, short_title, tagline, description, price_value, prev_price_value,
  category, size, visual_key, popularity, highlight, badge, rating_average,
  rating_count, in_stock, is_active
) values
  (
    'kit-inicial-botellon-19lts',
    'Kit inicial de botellón 19 lts',
    'Kit 19L',
    'Empieza a hidratarte mejor desde el primer día',
    'Incluye el botellón retornable de 19 litros + envase BPA-free + servicio de entrega gratis dentro de Bogotá la primera vez.',
    85000, null,
    'kit', '19L', 'kit', 95, true,
    null,
    4.8, 12, true, true
  ),
  (
    'promocion-garrafas',
    'Promoción Garrafas — ¡Pague 3, lleve 5!',
    'Promo garrafas',
    'El plan más conveniente para mantener tu casa siempre hidratada',
    'Lleva 5 garrafas pagando sólo 3. Ideal para familias que consumen agua alcalina a diario.',
    73470, 102000,
    'promocion', '1.5L', 'garrafas', 90, true,
    '{"title": "PROMOCIÓN GARRAFAS", "sub": "¡Pague 3, lleve 5!"}'::jsonb,
    4.7, 8, true, true
  ),
  (
    'recargas-19lts',
    '2 recargas de botellón 19 lts',
    '2 recargas 19L',
    'Mantén tu dispensador siempre lleno',
    'Dos recargas de agua alcalina filtrada. Sólo necesitas tener el botellón retornable.',
    69000, null,
    'recarga', '19L', 'recargas', 80, false,
    null,
    4.9, 21, true, true
  ),
  (
    'recarga-19lts-individual',
    'Recarga individual 19 lts',
    'Recarga 19L',
    'Una recarga cuando la necesites',
    'Recarga puntual sin compromiso. Se requiere botellón retornable PH PLUS.',
    36000, null,
    'recarga', '19L', 'recargas', 70, false,
    null,
    4.8, 15, true, true
  ),
  (
    'botellon-19lts',
    'Botellón 19 lts (solo envase + agua)',
    'Botellón 19L',
    'El clásico de PH PLUS para tu dispensador',
    'Botellón retornable de 19 litros con agua alcalina de pH 9.0.',
    42000, null,
    'botellon', '19L', 'kit', 65, false,
    null,
    4.6, 9, true, true
  ),
  (
    'garrafa-1l-pack6',
    'Pack 6 garrafas de 1 litro',
    'Garrafas 1L x6',
    'Perfectas para llevar al gym, la oficina o la universidad',
    'Seis garrafas de 1 litro con tapa hermética, BPA-free.',
    24000, null,
    'garrafa', '1L', 'garrafas', 55, false,
    null,
    4.7, 11, true, true
  ),
  (
    'garrafa-1-5l-pack6',
    'Pack 6 garrafas de 1,5 litros',
    'Garrafas 1.5L x6',
    'Más agua, mismo precio cómodo',
    'Seis garrafas de 1,5 litros — el formato ideal para sobremesa familiar.',
    32000, null,
    'garrafa', '1.5L', 'garrafas', 60, false,
    null,
    4.8, 6, true, true
  ),
  (
    'botellon-5l',
    'Botellón 5 litros',
    'Botellón 5L',
    'El tamaño ideal para neveras y picnics',
    'Botellón cómodo de 5 litros con manija reforzada.',
    12000, null,
    'botellon', '5L', 'kit', 50, false,
    null,
    4.5, 4, true, true
  ),
  (
    'dispensador-manual',
    'Dispensador manual para botellón',
    'Dispensador manual',
    'Sirve tu agua sin esfuerzo',
    'Bomba manual de alta presión, compatible con botellones de 19 litros.',
    35000, null,
    'kit', 'kit', 'kit', 45, false,
    null,
    4.6, 7, true, true
  ),
  (
    'dispensador-electrico',
    'Dispensador eléctrico frío / caliente',
    'Dispensador eléctrico',
    'Agua a la temperatura ideal en cualquier momento',
    'Dispensador con compresor frío y resistencia para agua caliente. Garantía 12 meses.',
    280000, null,
    'kit', 'kit', 'kit', 40, false,
    null,
    4.9, 5, true, true
  ),
  (
    'suscripcion-mensual-4-botellones',
    'Suscripción mensual — 4 botellones de 19 L',
    'Suscripción 4 x mes',
    'Cuatro botellones al mes, hidratación sin pensar',
    'Recibe 4 botellones de 19 litros al mes con 15% off. Cancela cuando quieras.',
    148000, null,
    'promocion', '19L', 'recargas', 35, false,
    null,
    4.8, 3, true, true
  )
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- shipping_zones
-- -----------------------------------------------------------------------------

insert into public.shipping_zones (
  name, regions, cost, lead_time_days_min, lead_time_days_max,
  free_shipping_threshold, is_active
) values
  (
    'Bogotá D.C.',
    '["bogota", "bogotá", "bogota d.c.", "bogotá d.c."]'::jsonb,
    8000, 1, 2, 120000, true
  ),
  (
    'Cundinamarca cercana',
    '["chia", "chía", "cota", "funza", "mosquera", "soacha", "cajica", "cajicá", "la calera"]'::jsonb,
    12000, 2, 3, null, true
  ),
  (
    'Ciudades principales',
    '["medellin", "medellín", "cali", "barranquilla", "bucaramanga", "manizales", "pereira", "armenia"]'::jsonb,
    18000, 3, 5, null, true
  ),
  (
    'Resto del país',
    '["resto del pais", "resto del país"]'::jsonb,
    22000, 4, 7, null, true
  );

-- -----------------------------------------------------------------------------
-- coupons
-- -----------------------------------------------------------------------------

insert into public.coupons (
  code, type, value, starts_at, ends_at, min_subtotal,
  max_uses, max_uses_per_customer, used_count, is_active
) values
  (
    'BIENVENIDA10', 'percent', 10,
    timezone('utc', now()) - interval '7 days',
    timezone('utc', now()) + interval '90 days',
    0, 1000, 1, 0, true
  ),
  (
    'ENVIOGRATIS', 'free_shipping', 0,
    timezone('utc', now()) - interval '30 days',
    timezone('utc', now()) + interval '60 days',
    60000, 500, 0, 0, true
  ),
  (
    'PHPLUS5K', 'fixed', 5000,
    timezone('utc', now()) - interval '14 days',
    timezone('utc', now()) + interval '30 days',
    25000, 200, 2, 0, true
  )
on conflict (code) do nothing;

-- -----------------------------------------------------------------------------
-- stock_items — initial inventory for the 11 products
-- -----------------------------------------------------------------------------

insert into public.stock_items (sku, product_slug, current, low) values
  ('SKU-KIT-INICIAL-19LTS', 'kit-inicial-botellon-19lts', 35, 10),
  ('SKU-PROMO-GARRAFAS', 'promocion-garrafas', 20, 8),
  ('SKU-RECARGAS-19LTS-X2', 'recargas-19lts', 80, 20),
  ('SKU-RECARGA-19LTS-IND', 'recarga-19lts-individual', 120, 30),
  ('SKU-BOTELLON-19LTS', 'botellon-19lts', 60, 15),
  ('SKU-GARRAFA-1L-X6', 'garrafa-1l-pack6', 45, 10),
  ('SKU-GARRAFA-15L-X6', 'garrafa-1-5l-pack6', 40, 10),
  ('SKU-BOTELLON-5L', 'botellon-5l', 30, 10),
  ('SKU-DISPENSADOR-MANUAL', 'dispensador-manual', 18, 5),
  ('SKU-DISPENSADOR-ELECTRICO', 'dispensador-electrico', 7, 3),
  ('SKU-SUSCRIPCION-4', 'suscripcion-mensual-4-botellones', 9999, 0)
on conflict (sku) do nothing;

-- -----------------------------------------------------------------------------
-- content (home hero + featured + banners + FAQ)
-- -----------------------------------------------------------------------------

insert into public.content (id, home_hero, featured_slugs, banners, faq) values (
  'main',
  jsonb_build_object(
    'title', 'Hidratación consciente',
    'subtitle', 'Agua alcalina de pH 9.0 con minerales esenciales — directo a tu casa.',
    'ctaLabel', 'Ver productos',
    'ctaHref', '/productos'
  ),
  '["kit-inicial-botellon-19lts", "promocion-garrafas", "suscripcion-mensual-4-botellones"]'::jsonb,
  jsonb_build_array(
    jsonb_build_object(
      'id', 'banner-bienvenida',
      'title', '10% en tu primera compra con BIENVENIDA10',
      'image', '/hero/banner-1.png',
      'href', '/productos'
    ),
    jsonb_build_object(
      'id', 'banner-suscripcion',
      'title', 'Suscribite y olvidate del agua',
      'image', '/hero/banner-2.png',
      'href', '/productos/suscripcion-mensual-4-botellones'
    ),
    jsonb_build_object(
      'id', 'banner-envio',
      'title', 'Envío gratis en Bogotá desde $120.000',
      'image', '/hero/banner-3.png',
      'href', '/envios'
    )
  ),
  jsonb_build_array(
    jsonb_build_object('id', 'faq-1', 'q', '¿En qué zonas hacen envíos?',
      'a', 'Llegamos a Bogotá y municipios cercanos en 1–3 días, y al resto de Colombia en 4–7 días hábiles. Consultá la página de Envíos para tu ciudad puntual.'),
    jsonb_build_object('id', 'faq-2', 'q', '¿Los botellones son retornables?',
      'a', 'Sí. El envase del botellón de 19 lts es retornable. Cuando pedís recargas te los cambiamos por uno limpio y lleno.'),
    jsonb_build_object('id', 'faq-3', 'q', '¿Puedo suscribirme y cancelar cuando quiera?',
      'a', 'Sí, la suscripción mensual se puede pausar o cancelar en cualquier momento desde tu panel de Mi cuenta.'),
    jsonb_build_object('id', 'faq-4', 'q', '¿Cuánto tardan en entregar?',
      'a', 'Bogotá: 1–2 días hábiles. Cundinamarca cercana: 2–3. Ciudades principales: 3–5. Resto del país: 4–7.'),
    jsonb_build_object('id', 'faq-5', 'q', '¿Qué métodos de pago aceptan?',
      'a', 'Tarjeta de crédito, PSE, Nequi y pago contra entrega en Bogotá.'),
    jsonb_build_object('id', 'faq-6', 'q', '¿Ofrecen factura electrónica?',
      'a', 'Sí, emitimos factura electrónica DIAN. Pedíla durante el checkout o desde tu cuenta.')
  )
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- settings (single row id = 'main')
-- -----------------------------------------------------------------------------

insert into public.settings (
  id, business_name, nit, phone, whatsapp, address, tax_rate,
  payment_methods, policies
) values (
  'main',
  'PH PLUS',
  '900.123.456-7',
  '+57 323 439 2470',
  '+57 323 439 2470',
  'Calle 100 #15-20, Bogotá D.C.',
  0,
  '["credit_card", "pse", "nequi", "cash_on_delivery"]'::jsonb,
  '{"shipping": "/envios", "returns": "/devoluciones"}'::jsonb
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- keep_alive seed row
-- -----------------------------------------------------------------------------

insert into public.keep_alive (pinged_at)
select timezone('utc', now())
where not exists (select 1 from public.keep_alive);
