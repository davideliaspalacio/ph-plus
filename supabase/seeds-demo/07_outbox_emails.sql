-- =====================================================================
-- 07_outbox_emails.sql
-- Notificaciones (outbox) realistas para demo.
-- Idempotente vía uuid determinístico: '22222222-2222-2222-2222-' || lpad(N,12,'0')
-- Templates: order_confirmation | order_shipped | password_recover |
--            welcome | review_approved | low_stock_alert | custom
-- Status: queued | sent | failed
-- =====================================================================

insert into notifications_outbox (id, to_email, subject, html, template, payload, status, error, created_at, sent_at) values
-- ---------------------------------------------------------------------
-- (A) Welcome — 5 emails sent a los 5 usuarios demo
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000001', 'ada@ph-plus.co',    '¡Bienvenido a PH PLUS!', '<h1>¡Hola Ada!</h1><p>Gracias por unirte a PH PLUS. Disfrutá un 10% off con BIENVENIDA10.</p>',     'welcome', '{"firstName":"Ada"}'::jsonb,    'sent', null, now() - interval '58 days', now() - interval '58 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000002', 'linus@ph-plus.co',  '¡Bienvenido a PH PLUS!', '<h1>¡Hola Linus!</h1><p>Gracias por unirte a PH PLUS. Disfrutá un 10% off con BIENVENIDA10.</p>',   'welcome', '{"firstName":"Linus"}'::jsonb,  'sent', null, now() - interval '56 days', now() - interval '56 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000003', 'admin@ph-plus.co',  '¡Bienvenido a PH PLUS!', '<h1>¡Hola Admin!</h1><p>Cuenta administrador creada exitosamente.</p>',                            'welcome', '{"firstName":"Admin"}'::jsonb,  'sent', null, now() - interval '55 days', now() - interval '55 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000004', 'staff@ph-plus.co',  '¡Bienvenido a PH PLUS!', '<h1>¡Hola Staff!</h1><p>Cuenta de equipo creada exitosamente.</p>',                                'welcome', '{"firstName":"Staff"}'::jsonb,  'sent', null, now() - interval '54 days', now() - interval '54 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000005', 'reader@ph-plus.co', '¡Bienvenido a PH PLUS!', '<h1>¡Hola Reader!</h1><p>Cuenta de lectura creada exitosamente.</p>',                              'welcome', '{"firstName":"Reader"}'::jsonb, 'sent', null, now() - interval '52 days', now() - interval '52 days' + interval '2 seconds'),

-- ---------------------------------------------------------------------
-- (B) Order confirmation — 10 emails (8 sent, 2 failed)
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000006', 'ada@ph-plus.co',           'Pedido ORD-DEMO0003 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0003 está en proceso. Total: $52.000</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0003","total":52000}'::jsonb,  'sent',   null,                                now() - interval '50 days', now() - interval '50 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000007', 'linus@ph-plus.co',         'Pedido ORD-DEMO0007 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0007 está en proceso. Total: $98.500</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0007","total":98500}'::jsonb,  'sent',   null,                                now() - interval '46 days', now() - interval '46 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000008', 'maria.gomez@gmail.com',    'Pedido ORD-DEMO0011 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0011 está en proceso. Total: $34.000</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0011","total":34000}'::jsonb,  'sent',   null,                                now() - interval '41 days', now() - interval '41 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000009', 'juan.perez@hotmail.com',   'Pedido ORD-DEMO0014 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0014 está en proceso. Total: $76.300</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0014","total":76300}'::jsonb,  'sent',   null,                                now() - interval '37 days', now() - interval '37 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000010', 'ada@ph-plus.co',           'Pedido ORD-DEMO0018 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0018 está en proceso. Total: $129.000</p>', 'order_confirmation', '{"orderId":"ORD-DEMO0018","total":129000}'::jsonb, 'sent',   null,                                now() - interval '33 days', now() - interval '33 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000011', 'carla.lopez@gmail.com',    'Pedido ORD-DEMO0022 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0022 está en proceso. Total: $44.800</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0022","total":44800}'::jsonb,  'failed', 'Email rejected by recipient',       now() - interval '29 days', null),
('22222222-2222-2222-2222-000000000012', 'linus@ph-plus.co',         'Pedido ORD-DEMO0027 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0027 está en proceso. Total: $87.000</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0027","total":87000}'::jsonb,  'sent',   null,                                now() - interval '24 days', now() - interval '24 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000013', 'roberto.diaz@hotmail.com', 'Pedido ORD-DEMO0033 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0033 está en proceso. Total: $61.500</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0033","total":61500}'::jsonb,  'sent',   null,                                now() - interval '19 days', now() - interval '19 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000014', 'sofia.ruiz@gmail.com',     'Pedido ORD-DEMO0041 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0041 está en proceso. Total: $112.200</p>', 'order_confirmation', '{"orderId":"ORD-DEMO0041","total":112200}'::jsonb, 'failed', 'Email rejected by recipient',       now() - interval '13 days', null),
('22222222-2222-2222-2222-000000000015', 'ada@ph-plus.co',           'Pedido ORD-DEMO0052 confirmado', '<h1>Pedido confirmado</h1><p>Tu pedido ORD-DEMO0052 está en proceso. Total: $58.700</p>',  'order_confirmation', '{"orderId":"ORD-DEMO0052","total":58700}'::jsonb,  'sent',   null,                                now() - interval '7 days',  now() - interval '7 days' + interval '2 seconds'),

-- ---------------------------------------------------------------------
-- (C) Order shipped — 5 emails sent con tracking
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000016', 'ada@ph-plus.co',         'Tu pedido ORD-DEMO0003 fue despachado', '<h1>¡En camino!</h1><p>Tu pedido ORD-DEMO0003 fue despachado. Tracking: TBA1234567.</p>',  'order_shipped', '{"orderId":"ORD-DEMO0003","trackingNumber":"TBA1234567"}'::jsonb, 'sent', null, now() - interval '48 days', now() - interval '48 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000017', 'linus@ph-plus.co',       'Tu pedido ORD-DEMO0007 fue despachado', '<h1>¡En camino!</h1><p>Tu pedido ORD-DEMO0007 fue despachado. Tracking: TBA2345678.</p>',  'order_shipped', '{"orderId":"ORD-DEMO0007","trackingNumber":"TBA2345678"}'::jsonb, 'sent', null, now() - interval '44 days', now() - interval '44 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000018', 'maria.gomez@gmail.com',  'Tu pedido ORD-DEMO0011 fue despachado', '<h1>¡En camino!</h1><p>Tu pedido ORD-DEMO0011 fue despachado. Tracking: TBA3456789.</p>',  'order_shipped', '{"orderId":"ORD-DEMO0011","trackingNumber":"TBA3456789"}'::jsonb, 'sent', null, now() - interval '39 days', now() - interval '39 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000019', 'ada@ph-plus.co',         'Tu pedido ORD-DEMO0018 fue despachado', '<h1>¡En camino!</h1><p>Tu pedido ORD-DEMO0018 fue despachado. Tracking: TBA4567890.</p>',  'order_shipped', '{"orderId":"ORD-DEMO0018","trackingNumber":"TBA4567890"}'::jsonb, 'sent', null, now() - interval '31 days', now() - interval '31 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000020', 'linus@ph-plus.co',       'Tu pedido ORD-DEMO0027 fue despachado', '<h1>¡En camino!</h1><p>Tu pedido ORD-DEMO0027 fue despachado. Tracking: TBA5678901.</p>',  'order_shipped', '{"orderId":"ORD-DEMO0027","trackingNumber":"TBA5678901"}'::jsonb, 'sent', null, now() - interval '22 days', now() - interval '22 days' + interval '2 seconds'),

-- ---------------------------------------------------------------------
-- (D) Password recover — 3 emails (2 sent, 1 failed)
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000021', 'ada@ph-plus.co',          'Recuperación de contraseña — PH PLUS', '<h1>Restablece tu contraseña</h1><p>Haz click en el enlace para crear una nueva contraseña.</p>', 'password_recover', '{"resetToken":"tok_abc123"}'::jsonb, 'sent',   null,                                now() - interval '40 days', now() - interval '40 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000022', 'linus@ph-plus.co',        'Recuperación de contraseña — PH PLUS', '<h1>Restablece tu contraseña</h1><p>Haz click en el enlace para crear una nueva contraseña.</p>', 'password_recover', '{"resetToken":"tok_def456"}'::jsonb, 'sent',   null,                                now() - interval '17 days', now() - interval '17 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000023', 'desconocido@invalid.tld', 'Recuperación de contraseña — PH PLUS', '<h1>Restablece tu contraseña</h1><p>Haz click en el enlace para crear una nueva contraseña.</p>', 'password_recover', '{"resetToken":"tok_ghi789"}'::jsonb, 'failed', 'SMTP 550: mailbox not found',       now() - interval '6 days',  null),

-- ---------------------------------------------------------------------
-- (E) Review approved — 2 emails sent
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000024', 'ada@ph-plus.co',         'Tu reseña fue aprobada', '<h1>¡Gracias por tu reseña!</h1><p>Tu opinión sobre el producto ya está publicada.</p>', 'review_approved', '{"productSlug":"kit-inicial-19lts","rating":5}'::jsonb,    'sent', null, now() - interval '21 days', now() - interval '21 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000025', 'linus@ph-plus.co',       'Tu reseña fue aprobada', '<h1>¡Gracias por tu reseña!</h1><p>Tu opinión sobre el producto ya está publicada.</p>', 'review_approved', '{"productSlug":"botellon-19lts","rating":4}'::jsonb,        'sent', null, now() - interval '11 days', now() - interval '11 days' + interval '2 seconds'),

-- ---------------------------------------------------------------------
-- (F) Low stock alert — 2 emails sent al admin
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000026', 'admin@ph-plus.co', 'ALERTA stock bajo — SKU-DISPENSADOR-ELECTRICO', '<h1>Stock bajo</h1><p>SKU-DISPENSADOR-ELECTRICO: actual 5, umbral 10.</p>', 'low_stock_alert', '{"sku":"SKU-DISPENSADOR-ELECTRICO","current":5,"low":10}'::jsonb, 'sent', null, now() - interval '9 days', now() - interval '9 days' + interval '2 seconds'),
('22222222-2222-2222-2222-000000000027', 'admin@ph-plus.co', 'ALERTA stock bajo — SKU-BOTELLON-5L',           '<h1>Stock bajo</h1><p>SKU-BOTELLON-5L: actual 8, umbral 10.</p>',         'low_stock_alert', '{"sku":"SKU-BOTELLON-5L","current":8,"low":10}'::jsonb,           'sent', null, now() - interval '3 days', now() - interval '3 days' + interval '2 seconds'),

-- ---------------------------------------------------------------------
-- (G) Custom — 1 email queued (campaña)
-- ---------------------------------------------------------------------
('22222222-2222-2222-2222-000000000028', 'ada@ph-plus.co', 'Promoción exclusiva Día del padre', '<h1>Día del padre PH PLUS</h1><p>20% off en kits seleccionados. Usá el código PAPA20.</p>', 'custom', '{"campaign":"diadelpadre","discount":20}'::jsonb, 'queued', null, now() - interval '1 days', null)
on conflict (id) do nothing;
