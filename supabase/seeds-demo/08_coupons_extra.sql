-- =====================================================================
-- 08_coupons_extra.sql
-- 7 cupones adicionales cubriendo casos límite (vencido, futuro,
-- agotado, mínimo, por cliente, inactivo, free shipping).
-- Idempotente vía `on conflict (code) do nothing`.
-- Fechas dinámicas con now() ± interval.
--
-- max_uses y max_uses_per_customer son NOT NULL con default 0
-- (0 = sin límite). Igual los seteamos explícitos para que el seed
-- sea predecible.
-- =====================================================================

insert into coupons (
  id, code, type, value,
  starts_at, ends_at,
  min_subtotal, max_uses, max_uses_per_customer, used_count,
  is_active, product_slugs, category_slugs
) values
-- (1) Vencido: terminó hace 30 días, sigue marcado activo (debería mostrar como expirado)
(gen_random_uuid(), 'VERANO20',       'percent',       20,
 now() - interval '120 days', now() - interval '30 days',
 0,      0,    0,    47,
 true,   null, null),

-- (2) Futuro: arranca dentro de 30 días
(gen_random_uuid(), 'NAVIDAD15',      'percent',       15,
 now() + interval '30 days',  now() + interval '90 days',
 0,      0,    0,    0,
 true,   null, null),

-- (3) Agotado: alcanzó max_uses
(gen_random_uuid(), 'AGOTADO50',      'percent',       50,
 now() - interval '60 days',  now() + interval '60 days',
 0,      10,   0,    10,
 true,   null, null),

-- (4) VIP: mínimo alto + tope global de usos
(gen_random_uuid(), 'VIP30',          'percent',       30,
 now() - interval '15 days',  now() + interval '180 days',
 150000, 5,    0,    1,
 true,   null, null),

-- (5) Primera compra: 1 uso por cliente
(gen_random_uuid(), 'PRIMERAVEZ',     'fixed',         10000,
 now() - interval '90 days',  now() + interval '365 days',
 0,      0,    1,    23,
 true,   null, null),

-- (6) Desactivado manualmente
(gen_random_uuid(), 'INACTIVO',       'fixed',         5000,
 now() - interval '45 days',  now() + interval '45 days',
 0,      0,    0,    0,
 false,  null, null),

-- (7) Envío gratis con mínimo
(gen_random_uuid(), 'ENVIOGRATIS50K', 'free_shipping', 0,
 now() - interval '20 days',  now() + interval '120 days',
 50000,  0,    0,    12,
 true,   null, null)
on conflict (code) do nothing;
