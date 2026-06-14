-- =====================================================================
-- 06_stock_movements.sql
-- Movimientos de stock realistas para los 11 SKUs existentes.
-- Idempotente vía uuid determinístico: '11111111-1111-1111-1111-' || lpad(N,12,'0')
-- Tipos válidos: in | out | adjustment | return
-- Razones válidas: purchase | sale | loss | return | manual
-- =====================================================================

insert into stock_movements (id, sku, type, quantity, reason, note, author, created_at) values
-- ---------------------------------------------------------------------
-- (A) Compras iniciales — una por SKU (11 movimientos). Hace ~85-90 días.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000001', 'SKU-KIT-INICIAL-19LTS',     'in', 150, 'purchase', 'Compra inicial proveedor — lote A', 'Admin',         now() - interval '88 days'),
('11111111-1111-1111-1111-000000000002', 'SKU-PROMO-GARRAFAS',        'in', 120, 'purchase', 'Compra inicial proveedor — lote A', 'Admin',         now() - interval '88 days'),
('11111111-1111-1111-1111-000000000003', 'SKU-RECARGAS-19LTS-X2',     'in', 200, 'purchase', 'Compra inicial proveedor — lote A', 'Admin',         now() - interval '88 days'),
('11111111-1111-1111-1111-000000000004', 'SKU-RECARGA-19LTS-IND',     'in', 180, 'purchase', 'Compra inicial proveedor — lote A', 'Admin',         now() - interval '88 days'),
('11111111-1111-1111-1111-000000000005', 'SKU-BOTELLON-19LTS',        'in', 100, 'purchase', 'Compra inicial proveedor — lote B', 'Admin',         now() - interval '87 days'),
('11111111-1111-1111-1111-000000000006', 'SKU-GARRAFA-1L-X6',         'in', 140, 'purchase', 'Compra inicial proveedor — lote B', 'Admin',         now() - interval '87 days'),
('11111111-1111-1111-1111-000000000007', 'SKU-GARRAFA-15L-X6',        'in', 110, 'purchase', 'Compra inicial proveedor — lote B', 'Admin',         now() - interval '87 days'),
('11111111-1111-1111-1111-000000000008', 'SKU-BOTELLON-5L',           'in',  80, 'purchase', 'Compra inicial proveedor — lote B', 'Admin',         now() - interval '87 days'),
('11111111-1111-1111-1111-000000000009', 'SKU-DISPENSADOR-MANUAL',    'in',  60, 'purchase', 'Compra inicial proveedor — lote C', 'María Admin',   now() - interval '86 days'),
('11111111-1111-1111-1111-000000000010', 'SKU-DISPENSADOR-ELECTRICO', 'in',  50, 'purchase', 'Compra inicial proveedor — lote C', 'María Admin',   now() - interval '86 days'),
('11111111-1111-1111-1111-000000000011', 'SKU-SUSCRIPCION-4',         'in',  90, 'purchase', 'Compra inicial proveedor — lote C', 'María Admin',   now() - interval '86 days'),

-- ---------------------------------------------------------------------
-- (B) Ventas — ~40 movimientos type='out' reason='sale' en SKUs populares.
-- Distribuidos en últimos 60 días, los más recientes al final.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000012', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', 'Venta orden ORD-DEMO0003', 'Staff Pedidos',  now() - interval '58 days'),
('11111111-1111-1111-1111-000000000013', 'SKU-RECARGAS-19LTS-X2',     'out', 2, 'sale', 'Venta orden ORD-DEMO0005', 'Staff Pedidos',  now() - interval '57 days'),
('11111111-1111-1111-1111-000000000014', 'SKU-BOTELLON-19LTS',        'out', 1, 'sale', 'Venta orden ORD-DEMO0007', 'Sistema (auto)', now() - interval '55 days'),
('11111111-1111-1111-1111-000000000015', 'SKU-RECARGA-19LTS-IND',     'out', 3, 'sale', null,                       'Sistema (auto)', now() - interval '54 days'),
('11111111-1111-1111-1111-000000000016', 'SKU-GARRAFA-1L-X6',         'out', 1, 'sale', 'Venta orden ORD-DEMO0010', 'Staff Pedidos',  now() - interval '52 days'),
('11111111-1111-1111-1111-000000000017', 'SKU-KIT-INICIAL-19LTS',     'out', 2, 'sale', null,                       'Sistema (auto)', now() - interval '51 days'),
('11111111-1111-1111-1111-000000000018', 'SKU-RECARGAS-19LTS-X2',     'out', 1, 'sale', 'Venta orden ORD-DEMO0013', 'Staff Pedidos',  now() - interval '49 days'),
('11111111-1111-1111-1111-000000000019', 'SKU-BOTELLON-19LTS',        'out', 4, 'sale', null,                       'Sistema (auto)', now() - interval '48 days'),
('11111111-1111-1111-1111-000000000020', 'SKU-GARRAFA-15L-X6',        'out', 1, 'sale', 'Venta orden ORD-DEMO0015', 'Staff Pedidos',  now() - interval '47 days'),
('11111111-1111-1111-1111-000000000021', 'SKU-RECARGA-19LTS-IND',     'out', 2, 'sale', null,                       'Sistema (auto)', now() - interval '45 days'),
('11111111-1111-1111-1111-000000000022', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', 'Venta orden ORD-DEMO0018', 'Staff Pedidos',  now() - interval '44 days'),
('11111111-1111-1111-1111-000000000023', 'SKU-PROMO-GARRAFAS',        'out', 2, 'sale', null,                       'Sistema (auto)', now() - interval '42 days'),
('11111111-1111-1111-1111-000000000024', 'SKU-RECARGAS-19LTS-X2',     'out', 3, 'sale', 'Venta orden ORD-DEMO0021', 'Staff Pedidos',  now() - interval '41 days'),
('11111111-1111-1111-1111-000000000025', 'SKU-BOTELLON-19LTS',        'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '39 days'),
('11111111-1111-1111-1111-000000000026', 'SKU-GARRAFA-1L-X6',         'out', 2, 'sale', 'Venta orden ORD-DEMO0024', 'Staff Pedidos',  now() - interval '38 days'),
('11111111-1111-1111-1111-000000000027', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '36 days'),
('11111111-1111-1111-1111-000000000028', 'SKU-RECARGA-19LTS-IND',     'out', 5, 'sale', 'Venta orden ORD-DEMO0027', 'Staff Pedidos',  now() - interval '35 days'),
('11111111-1111-1111-1111-000000000029', 'SKU-RECARGAS-19LTS-X2',     'out', 2, 'sale', null,                       'Sistema (auto)', now() - interval '34 days'),
('11111111-1111-1111-1111-000000000030', 'SKU-BOTELLON-19LTS',        'out', 1, 'sale', 'Venta orden ORD-DEMO0030', 'Staff Pedidos',  now() - interval '32 days'),
('11111111-1111-1111-1111-000000000031', 'SKU-GARRAFA-15L-X6',        'out', 3, 'sale', null,                       'Sistema (auto)', now() - interval '31 days'),
('11111111-1111-1111-1111-000000000032', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', 'Venta orden ORD-DEMO0033', 'Staff Pedidos',  now() - interval '29 days'),
('11111111-1111-1111-1111-000000000033', 'SKU-PROMO-GARRAFAS',        'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '28 days'),
('11111111-1111-1111-1111-000000000034', 'SKU-RECARGA-19LTS-IND',     'out', 2, 'sale', 'Venta orden ORD-DEMO0036', 'Staff Pedidos',  now() - interval '26 days'),
('11111111-1111-1111-1111-000000000035', 'SKU-RECARGAS-19LTS-X2',     'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '25 days'),
('11111111-1111-1111-1111-000000000036', 'SKU-BOTELLON-19LTS',        'out', 2, 'sale', 'Venta orden ORD-DEMO0039', 'Staff Pedidos',  now() - interval '23 days'),
('11111111-1111-1111-1111-000000000037', 'SKU-GARRAFA-1L-X6',         'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '22 days'),
('11111111-1111-1111-1111-000000000038', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', 'Venta orden ORD-DEMO0042', 'Staff Pedidos',  now() - interval '20 days'),
('11111111-1111-1111-1111-000000000039', 'SKU-RECARGAS-19LTS-X2',     'out', 4, 'sale', null,                       'Sistema (auto)', now() - interval '19 days'),
('11111111-1111-1111-1111-000000000040', 'SKU-RECARGA-19LTS-IND',     'out', 3, 'sale', 'Venta orden ORD-DEMO0045', 'Staff Pedidos',  now() - interval '17 days'),
('11111111-1111-1111-1111-000000000041', 'SKU-BOTELLON-19LTS',        'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '16 days'),
('11111111-1111-1111-1111-000000000042', 'SKU-GARRAFA-15L-X6',        'out', 2, 'sale', 'Venta orden ORD-DEMO0048', 'Staff Pedidos',  now() - interval '14 days'),
('11111111-1111-1111-1111-000000000043', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '13 days'),
('11111111-1111-1111-1111-000000000044', 'SKU-PROMO-GARRAFAS',        'out', 1, 'sale', 'Venta orden ORD-DEMO0051', 'Staff Pedidos',  now() - interval '11 days'),
('11111111-1111-1111-1111-000000000045', 'SKU-RECARGAS-19LTS-X2',     'out', 2, 'sale', null,                       'Sistema (auto)', now() - interval '10 days'),
('11111111-1111-1111-1111-000000000046', 'SKU-BOTELLON-19LTS',        'out', 1, 'sale', 'Venta orden ORD-DEMO0054', 'Staff Pedidos',  now() - interval '8 days'),
('11111111-1111-1111-1111-000000000047', 'SKU-RECARGA-19LTS-IND',     'out', 2, 'sale', null,                       'Sistema (auto)', now() - interval '7 days'),
('11111111-1111-1111-1111-000000000048', 'SKU-GARRAFA-1L-X6',         'out', 1, 'sale', 'Venta orden ORD-DEMO0057', 'Staff Pedidos',  now() - interval '5 days'),
('11111111-1111-1111-1111-000000000049', 'SKU-KIT-INICIAL-19LTS',     'out', 1, 'sale', null,                       'Sistema (auto)', now() - interval '4 days'),
('11111111-1111-1111-1111-000000000050', 'SKU-RECARGAS-19LTS-X2',     'out', 3, 'sale', 'Venta orden ORD-DEMO0060', 'Staff Pedidos',  now() - interval '2 days'),
('11111111-1111-1111-1111-000000000051', 'SKU-BOTELLON-19LTS',        'out', 1, 'sale', 'Venta orden ORD-DEMO0063', 'Staff Pedidos',  now() - interval '1 days'),

-- ---------------------------------------------------------------------
-- (C) Reposiciones periódicas — 10 movimientos type='in' reason='purchase'.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000052', 'SKU-RECARGAS-19LTS-X2',     'in', 80, 'purchase', 'Reposición proveedor semanal',    'Admin',         now() - interval '60 days'),
('11111111-1111-1111-1111-000000000053', 'SKU-BOTELLON-19LTS',        'in', 50, 'purchase', 'Reposición proveedor',            'Admin',         now() - interval '50 days'),
('11111111-1111-1111-1111-000000000054', 'SKU-KIT-INICIAL-19LTS',     'in', 60, 'purchase', 'Reposición proveedor mensual',    'María Admin',   now() - interval '45 days'),
('11111111-1111-1111-1111-000000000055', 'SKU-RECARGA-19LTS-IND',     'in', 70, 'purchase', 'Reposición proveedor',            'Admin',         now() - interval '40 days'),
('11111111-1111-1111-1111-000000000056', 'SKU-GARRAFA-1L-X6',         'in', 40, 'purchase', 'Reposición proveedor',            'María Admin',   now() - interval '35 days'),
('11111111-1111-1111-1111-000000000057', 'SKU-GARRAFA-15L-X6',        'in', 30, 'purchase', null,                              'Admin',         now() - interval '30 days'),
('11111111-1111-1111-1111-000000000058', 'SKU-BOTELLON-5L',           'in', 35, 'purchase', 'Reposición proveedor',            'Admin',         now() - interval '25 days'),
('11111111-1111-1111-1111-000000000059', 'SKU-RECARGAS-19LTS-X2',     'in', 75, 'purchase', 'Reposición proveedor semanal',    'María Admin',   now() - interval '18 days'),
('11111111-1111-1111-1111-000000000060', 'SKU-BOTELLON-19LTS',        'in', 55, 'purchase', null,                              'Admin',         now() - interval '12 days'),
('11111111-1111-1111-1111-000000000061', 'SKU-RECARGA-19LTS-IND',     'in', 65, 'purchase', 'Reposición proveedor',            'María Admin',   now() - interval '6 days'),

-- ---------------------------------------------------------------------
-- (D) Mermas — 5 movimientos type='out' reason='loss'.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000062', 'SKU-BOTELLON-19LTS',        'out', 2, 'loss', 'Botellón roto en bodega',              'Staff Pedidos', now() - interval '46 days'),
('11111111-1111-1111-1111-000000000063', 'SKU-GARRAFA-1L-X6',         'out', 1, 'loss', 'Merma por daño en transporte',         'Staff Pedidos', now() - interval '37 days'),
('11111111-1111-1111-1111-000000000064', 'SKU-BOTELLON-5L',           'out', 1, 'loss', 'Devolución por defecto, descartado',   'María Admin',   now() - interval '27 days'),
('11111111-1111-1111-1111-000000000065', 'SKU-DISPENSADOR-MANUAL',    'out', 1, 'loss', 'Daño durante exhibición',              'Staff Pedidos', now() - interval '15 days'),
('11111111-1111-1111-1111-000000000066', 'SKU-GARRAFA-15L-X6',        'out', 2, 'loss', 'Merma por daño en transporte',         'Staff Pedidos', now() - interval '9 days'),

-- ---------------------------------------------------------------------
-- (E) Devoluciones — 5 movimientos type='return' reason='return'.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000067', 'SKU-BOTELLON-19LTS',        'return', 1, 'return', 'Cliente devolvió por defecto en tapa',  'Staff Pedidos', now() - interval '43 days'),
('11111111-1111-1111-1111-000000000068', 'SKU-KIT-INICIAL-19LTS',     'return', 1, 'return', 'Devolución por arrepentimiento',        'María Admin',   now() - interval '33 days'),
('11111111-1111-1111-1111-000000000069', 'SKU-GARRAFA-1L-X6',         'return', 2, 'return', 'Devolución cliente — sello roto',       'Staff Pedidos', now() - interval '21 days'),
('11111111-1111-1111-1111-000000000070', 'SKU-RECARGA-19LTS-IND',     'return', 1, 'return', 'Devolución parcial orden ORD-DEMO0040', 'Staff Pedidos', now() - interval '12 days'),
('11111111-1111-1111-1111-000000000071', 'SKU-DISPENSADOR-ELECTRICO', 'return', 1, 'return', 'Devolución por falla eléctrica',        'María Admin',   now() - interval '3 days'),

-- ---------------------------------------------------------------------
-- (F) Ajustes por conteo físico — 5 movimientos type='adjustment' reason='manual'.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000072', 'SKU-KIT-INICIAL-19LTS',     'adjustment', 145, 'manual', 'Conteo físico semanal — ajuste',     'Conteo físico Q4', now() - interval '40 days'),
('11111111-1111-1111-1111-000000000073', 'SKU-RECARGAS-19LTS-X2',     'adjustment', 130, 'manual', 'Conteo físico mensual',              'Conteo físico Q4', now() - interval '30 days'),
('11111111-1111-1111-1111-000000000074', 'SKU-BOTELLON-19LTS',        'adjustment',  95, 'manual', 'Conteo físico mensual',              'Conteo físico Q4', now() - interval '20 days'),
('11111111-1111-1111-1111-000000000075', 'SKU-GARRAFA-15L-X6',        'adjustment',  85, 'manual', 'Ajuste por diferencia en conteo',    'Conteo físico Q4', now() - interval '14 days'),
('11111111-1111-1111-1111-000000000076', 'SKU-BOTELLON-5L',           'adjustment',  60, 'manual', 'Conteo físico semanal',              'Conteo físico Q4', now() - interval '5 days'),

-- ---------------------------------------------------------------------
-- (G) Restock urgente — 4 movimientos type='in' reason='purchase'.
-- ---------------------------------------------------------------------
('11111111-1111-1111-1111-000000000077', 'SKU-DISPENSADOR-ELECTRICO', 'in', 40, 'purchase', 'Restock urgente',                'Admin',         now() - interval '8 days'),
('11111111-1111-1111-1111-000000000078', 'SKU-DISPENSADOR-MANUAL',    'in', 35, 'purchase', 'Restock urgente',                'Admin',         now() - interval '6 days'),
('11111111-1111-1111-1111-000000000079', 'SKU-SUSCRIPCION-4',         'in', 45, 'purchase', 'Restock urgente',                'María Admin',   now() - interval '4 days'),
('11111111-1111-1111-1111-000000000080', 'SKU-PROMO-GARRAFAS',        'in', 50, 'purchase', 'Restock urgente proveedor B',    'Admin',         now() - interval '2 days')
on conflict (id) do nothing;
