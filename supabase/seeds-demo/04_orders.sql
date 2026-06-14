-- =============================================================
-- 04_orders.sql
-- 65 órdenes demo PH PLUS distribuidas en todos los estados.
-- IDs determinísticos ORD-DEMO0001..0065.
-- Idempotente: on conflict (id) do nothing.
--
-- Distribución por estado:
--   draft:            5 (0001-0005)
--   pending_payment: 12 (0006-0017)
--   paid:             8 (0018-0025)
--   preparing:       10 (0026-0035)
--   shipped:          8 (0036-0043)
--   delivered:       12 (0044-0055)
--   closed:           5 (0056-0060)
--   cancelled:        3 (0061-0063)
--   refunded:         2 (0064-0065)
-- =============================================================

-- helper: resolver ids de usuarios una sola vez
with u as (
  select
    (select id from profiles where email = 'ada@ph-plus.co')   as ada_id,
    (select id from profiles where email = 'linus@ph-plus.co') as linus_id
)
insert into orders (
  id, user_id, status, contact, shipping, payment, totals, coupon_code, tracking_number, created_at, updated_at
)
select * from (values
  -- ============ DRAFT (5) — recientes, sin shipping completo ============
  ('ORD-DEMO0001'::text, (select ada_id from u), 'draft'::order_status,
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"","city":"","department":"","postalCode":"","notes":""}'::jsonb,
    '{"method":"credit_card"}'::jsonb,
    '{"subtotal":85000,"discount":0,"shipping":0,"total":85000}'::jsonb,
    null::text, null::text, now() - interval '2 hours', now() - interval '2 hours'),

  ('ORD-DEMO0002', (select linus_id from u), 'draft',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"","city":"","department":"","postalCode":"","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":42000,"discount":0,"shipping":0,"total":42000}'::jsonb,
    null, null, now() - interval '5 hours', now() - interval '5 hours'),

  ('ORD-DEMO0003', (select ada_id from u), 'draft',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":156000,"discount":0,"shipping":0,"total":156000}'::jsonb,
    null, null, now() - interval '1 day', now() - interval '1 day'),

  ('ORD-DEMO0004', (select linus_id from u), 'draft',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"","city":"","department":"","postalCode":"","notes":""}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":28000,"discount":0,"shipping":0,"total":28000}'::jsonb,
    null, null, now() - interval '8 hours', now() - interval '8 hours'),

  ('ORD-DEMO0005', (select ada_id from u), 'draft',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":""}'::jsonb,
    '{"method":"credit_card"}'::jsonb,
    '{"subtotal":68000,"discount":0,"shipping":0,"total":68000}'::jsonb,
    null, null, now() - interval '12 hours', now() - interval '12 hours'),

  -- ============ PENDING_PAYMENT (12) ============
  ('ORD-DEMO0006', (select ada_id from u), 'pending_payment',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Apto 502, Edificio Los Cedros"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":120000,"discount":12000,"shipping":12000,"total":120000}'::jsonb,
    'BIENVENIDA10', null, now() - interval '1 day', now() - interval '1 day'),

  ('ORD-DEMO0007', null, 'pending_payment',
    '{"name":"Carolina Restrepo","email":"caro.restrepo@gmail.com","phone":"+57 3158889911"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"4521"}'::jsonb,
    '{"subtotal":225000,"discount":0,"shipping":15000,"total":240000}'::jsonb,
    null, null, now() - interval '2 days', now() - interval '2 days'),

  ('ORD-DEMO0008', (select linus_id from u), 'pending_payment',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":"Torre Norte Apt 1801"}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":48000,"discount":0,"shipping":12000,"total":60000}'::jsonb,
    null, null, now() - interval '3 days', now() - interval '3 days'),

  ('ORD-DEMO0009', null, 'pending_payment',
    '{"name":"Juan Esteban Gómez","email":"jegomez@hotmail.com","phone":"+57 3024567788"}'::jsonb,
    '{"address":"Calle 70 # 11-50","city":"Bogotá","department":"Cundinamarca","postalCode":"110231","notes":"Casa esquinera"}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":68000,"discount":0,"shipping":10000,"total":78000}'::jsonb,
    null, null, now() - interval '4 days', now() - interval '4 days'),

  ('ORD-DEMO0010', (select ada_id from u), 'pending_payment',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":"Oficina 1204"}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":340000,"discount":34000,"shipping":0,"total":306000}'::jsonb,
    'BIENVENIDA10', null, now() - interval '5 days', now() - interval '5 days'),

  ('ORD-DEMO0011', null, 'pending_payment',
    '{"name":"María Fernanda Ruiz","email":"mafe.ruiz@outlook.com","phone":"+57 3112224455"}'::jsonb,
    '{"address":"Avenida 6N # 23-45","city":"Cali","department":"Valle del Cauca","postalCode":"760046","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":95000,"discount":0,"shipping":18000,"total":113000}'::jsonb,
    null, null, now() - interval '6 days', now() - interval '6 days'),

  ('ORD-DEMO0012', (select linus_id from u), 'pending_payment',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 11 # 93-46","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Piso 7, Coworking Chicó"}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":180000,"discount":0,"shipping":0,"total":180000}'::jsonb,
    'ENVIOGRATIS', null, now() - interval '6 days', now() - interval '6 days'),

  ('ORD-DEMO0013', (select ada_id from u), 'pending_payment',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":56000,"discount":0,"shipping":10000,"total":66000}'::jsonb,
    null, null, now() - interval '6 days 6 hours', now() - interval '6 days 6 hours'),

  ('ORD-DEMO0014', null, 'pending_payment',
    '{"name":"Diego Hernández","email":"diegohzm@gmail.com","phone":"+57 3145556677"}'::jsonb,
    '{"address":"Carrera 50 # 80-21","city":"Barranquilla","department":"Atlántico","postalCode":"080020","notes":"Conjunto Brisas"}'::jsonb,
    '{"method":"credit_card","last4":"3344"}'::jsonb,
    '{"subtotal":135000,"discount":5000,"shipping":20000,"total":150000}'::jsonb,
    'PHPLUS5K', null, now() - interval '5 days', now() - interval '5 days'),

  ('ORD-DEMO0015', (select linus_id from u), 'pending_payment',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Vereda Fagua, Km 3 vía Cota","city":"Chía","department":"Cundinamarca","postalCode":"250001","notes":"Casa pintura azul"}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":78000,"discount":0,"shipping":15000,"total":93000}'::jsonb,
    null, null, now() - interval '4 days', now() - interval '4 days'),

  ('ORD-DEMO0016', null, 'pending_payment',
    '{"name":"Laura Sofía Mejía","email":"lsmejia@gmail.com","phone":"+57 3187776655"}'::jsonb,
    '{"address":"Calle 10 Sur # 50-23","city":"Medellín","department":"Antioquia","postalCode":"050022","notes":"El Poblado"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":210000,"discount":21000,"shipping":0,"total":189000}'::jsonb,
    'BIENVENIDA10', null, now() - interval '3 days', now() - interval '3 days'),

  ('ORD-DEMO0017', (select ada_id from u), 'pending_payment',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"7710"}'::jsonb,
    '{"subtotal":35000,"discount":0,"shipping":8000,"total":43000}'::jsonb,
    null, null, now() - interval '1 day 4 hours', now() - interval '1 day 4 hours'),

  -- ============ PAID (8) ============
  ('ORD-DEMO0018', (select ada_id from u), 'paid',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Apto 502, Edificio Los Cedros"}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":92000,"discount":9200,"shipping":10000,"total":92800}'::jsonb,
    'BIENVENIDA10', null, now() - interval '2 days', now() - interval '1 day 18 hours'),

  ('ORD-DEMO0019', null, 'paid',
    '{"name":"Andrés Felipe Quintero","email":"afquintero@yahoo.com","phone":"+57 3023334455"}'::jsonb,
    '{"address":"Carrera 70 # 5-21","city":"Cali","department":"Valle del Cauca","postalCode":"760032","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":165000,"discount":0,"shipping":18000,"total":183000}'::jsonb,
    null, null, now() - interval '3 days', now() - interval '2 days 12 hours'),

  ('ORD-DEMO0020', (select linus_id from u), 'paid',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":48000,"discount":0,"shipping":12000,"total":60000}'::jsonb,
    null, null, now() - interval '5 days', now() - interval '4 days 20 hours'),

  ('ORD-DEMO0021', (select ada_id from u), 'paid',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":"Oficina 1204"}'::jsonb,
    '{"method":"credit_card","last4":"7710"}'::jsonb,
    '{"subtotal":278000,"discount":0,"shipping":0,"total":278000}'::jsonb,
    'ENVIOGRATIS', null, now() - interval '7 days', now() - interval '6 days 14 hours'),

  ('ORD-DEMO0022', null, 'paid',
    '{"name":"Camilo Pardo","email":"camilo.pardo@gmail.com","phone":"+57 3175558899"}'::jsonb,
    '{"address":"Calle 19 # 4-71","city":"Bogotá","department":"Cundinamarca","postalCode":"110311","notes":""}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":72000,"discount":0,"shipping":10000,"total":82000}'::jsonb,
    null, null, now() - interval '9 days', now() - interval '8 days 20 hours'),

  ('ORD-DEMO0023', (select linus_id from u), 'paid',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 11 # 93-46","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Piso 7"}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":145000,"discount":5000,"shipping":0,"total":140000}'::jsonb,
    'PHPLUS5K', null, now() - interval '11 days', now() - interval '10 days 18 hours'),

  ('ORD-DEMO0024', (select ada_id from u), 'paid',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 140 # 19-22","city":"Bogotá","department":"Cundinamarca","postalCode":"110131","notes":"Casa 14 Conjunto Las Acacias"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":58000,"discount":0,"shipping":8000,"total":66000}'::jsonb,
    null, null, now() - interval '13 days', now() - interval '12 days 22 hours'),

  ('ORD-DEMO0025', null, 'paid',
    '{"name":"Valentina Rojas","email":"valerojas@gmail.com","phone":"+57 3134445566"}'::jsonb,
    '{"address":"Carrera 24 # 39-21","city":"Bucaramanga","department":"Santander","postalCode":"680003","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":195000,"discount":19500,"shipping":15000,"total":190500}'::jsonb,
    'BIENVENIDA10', null, now() - interval '14 days', now() - interval '13 days 18 hours'),

  -- ============ PREPARING (10) ============
  ('ORD-DEMO0026', (select ada_id from u), 'preparing',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Apto 502 — dejar en portería"}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":420000,"discount":42000,"shipping":0,"total":378000}'::jsonb,
    'BIENVENIDA10', null, now() - interval '3 days', now() - interval '1 day 12 hours'),

  ('ORD-DEMO0027', null, 'preparing',
    '{"name":"Sebastián Marín","email":"sebasmarin@gmail.com","phone":"+57 3026667788"}'::jsonb,
    '{"address":"Calle 80 # 11-42","city":"Bogotá","department":"Cundinamarca","postalCode":"110231","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":98000,"discount":0,"shipping":12000,"total":110000}'::jsonb,
    null, null, now() - interval '4 days', now() - interval '2 days'),

  ('ORD-DEMO0028', (select linus_id from u), 'preparing',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":"Torre Norte Apt 1801"}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":156000,"discount":0,"shipping":0,"total":156000}'::jsonb,
    'ENVIOGRATIS', null, now() - interval '5 days', now() - interval '2 days 6 hours'),

  ('ORD-DEMO0029', (select ada_id from u), 'preparing',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"7710"}'::jsonb,
    '{"subtotal":62000,"discount":0,"shipping":10000,"total":72000}'::jsonb,
    null, null, now() - interval '6 days', now() - interval '3 days'),

  ('ORD-DEMO0030', null, 'preparing',
    '{"name":"Paula Castaño","email":"paulacasta@hotmail.com","phone":"+57 3198887766"}'::jsonb,
    '{"address":"Carrera 7 # 116-50","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":"Apto 1203"}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":85000,"discount":0,"shipping":10000,"total":95000}'::jsonb,
    null, null, now() - interval '7 days', now() - interval '3 days 8 hours'),

  ('ORD-DEMO0031', (select linus_id from u), 'preparing',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Vereda Fagua, Km 3 vía Cota","city":"Chía","department":"Cundinamarca","postalCode":"250001","notes":"Casa pintura azul, portón blanco"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":189000,"discount":5000,"shipping":15000,"total":199000}'::jsonb,
    'PHPLUS5K', null, now() - interval '8 days', now() - interval '4 days'),

  ('ORD-DEMO0032', (select ada_id from u), 'preparing',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":48000,"discount":0,"shipping":8000,"total":56000}'::jsonb,
    null, null, now() - interval '8 days', now() - interval '4 days 6 hours'),

  ('ORD-DEMO0033', null, 'preparing',
    '{"name":"Felipe Acosta","email":"facosta@gmail.com","phone":"+57 3014445566"}'::jsonb,
    '{"address":"Calle 32 # 80-15","city":"Medellín","department":"Antioquia","postalCode":"050031","notes":"Laureles"}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":124000,"discount":0,"shipping":12000,"total":136000}'::jsonb,
    null, null, now() - interval '9 days', now() - interval '5 days'),

  ('ORD-DEMO0034', (select linus_id from u), 'preparing',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 11 # 93-46","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":76000,"discount":0,"shipping":0,"total":76000}'::jsonb,
    'ENVIOGRATIS', null, now() - interval '9 days 6 hours', now() - interval '5 days 12 hours'),

  ('ORD-DEMO0035', null, 'preparing',
    '{"name":"Manuela Ortiz","email":"manuortiz@gmail.com","phone":"+57 3201112299"}'::jsonb,
    '{"address":"Avenida Pasoancho # 65-15","city":"Cali","department":"Valle del Cauca","postalCode":"760045","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":215000,"discount":21500,"shipping":18000,"total":211500}'::jsonb,
    'BIENVENIDA10', null, now() - interval '10 days', now() - interval '6 days'),

  -- ============ SHIPPED (8) ============
  ('ORD-DEMO0036', (select ada_id from u), 'shipped',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Apto 502"}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":175000,"discount":0,"shipping":0,"total":175000}'::jsonb,
    'ENVIOGRATIS', 'CO-BG-3491025', now() - interval '6 days', now() - interval '3 days'),

  ('ORD-DEMO0037', null, 'shipped',
    '{"name":"Catalina Vélez","email":"cativelez@gmail.com","phone":"+57 3148889977"}'::jsonb,
    '{"address":"Carrera 80 # 23-15","city":"Medellín","department":"Antioquia","postalCode":"050035","notes":"Belén"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":98000,"discount":0,"shipping":12000,"total":110000}'::jsonb,
    null, 'CO-MD-1820471', now() - interval '8 days', now() - interval '4 days'),

  ('ORD-DEMO0038', (select linus_id from u), 'shipped',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":68000,"discount":0,"shipping":12000,"total":80000}'::jsonb,
    null, 'CO-MD-7711204', now() - interval '10 days', now() - interval '5 days'),

  ('ORD-DEMO0039', (select ada_id from u), 'shipped',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":"Oficina 1204"}'::jsonb,
    '{"method":"credit_card","last4":"7710"}'::jsonb,
    '{"subtotal":315000,"discount":31500,"shipping":0,"total":283500}'::jsonb,
    'BIENVENIDA10', 'CO-BG-5582019', now() - interval '12 days', now() - interval '6 days'),

  ('ORD-DEMO0040', null, 'shipped',
    '{"name":"Mateo Salazar","email":"mateosalz@hotmail.com","phone":"+57 3022226677"}'::jsonb,
    '{"address":"Carrera 50 # 14-22","city":"Barranquilla","department":"Atlántico","postalCode":"080020","notes":""}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":58000,"discount":0,"shipping":22000,"total":80000}'::jsonb,
    null, 'CO-BQ-2284910', now() - interval '14 days', now() - interval '7 days'),

  ('ORD-DEMO0041', (select linus_id from u), 'shipped',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 11 # 93-46","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Piso 7"}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":225000,"discount":5000,"shipping":0,"total":220000}'::jsonb,
    'PHPLUS5K', 'CO-BG-9921047', now() - interval '15 days', now() - interval '8 days'),

  ('ORD-DEMO0042', (select ada_id from u), 'shipped',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 140 # 19-22","city":"Bogotá","department":"Cundinamarca","postalCode":"110131","notes":"Casa 14"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":42000,"discount":0,"shipping":8000,"total":50000}'::jsonb,
    null, 'CO-BG-1145502', now() - interval '17 days', now() - interval '10 days'),

  ('ORD-DEMO0043', null, 'shipped',
    '{"name":"Natalia Cardona","email":"natcardona@gmail.com","phone":"+57 3175552288"}'::jsonb,
    '{"address":"Calle 50 # 38-22","city":"Bucaramanga","department":"Santander","postalCode":"680003","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":138000,"discount":0,"shipping":15000,"total":153000}'::jsonb,
    null, 'CO-BU-3398240', now() - interval '19 days', now() - interval '11 days'),

  -- ============ DELIVERED (12) ============
  ('ORD-DEMO0044', (select ada_id from u), 'delivered',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":85000,"discount":8500,"shipping":10000,"total":86500}'::jsonb,
    'BIENVENIDA10', 'CO-BG-8820013', now() - interval '9 days', now() - interval '5 days'),

  ('ORD-DEMO0045', null, 'delivered',
    '{"name":"Tomás Aguirre","email":"tomas.aguirre@gmail.com","phone":"+57 3024441199"}'::jsonb,
    '{"address":"Carrera 70 # 5-21","city":"Cali","department":"Valle del Cauca","postalCode":"760032","notes":"Conjunto El Mirador"}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":118000,"discount":0,"shipping":18000,"total":136000}'::jsonb,
    null, 'CO-CL-7732014', now() - interval '12 days', now() - interval '7 days'),

  ('ORD-DEMO0046', (select linus_id from u), 'delivered',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":52000,"discount":0,"shipping":12000,"total":64000}'::jsonb,
    null, 'CO-MD-4490211', now() - interval '15 days', now() - interval '10 days'),

  ('ORD-DEMO0047', (select ada_id from u), 'delivered',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":"Oficina 1204"}'::jsonb,
    '{"method":"credit_card","last4":"7710"}'::jsonb,
    '{"subtotal":268000,"discount":0,"shipping":0,"total":268000}'::jsonb,
    'ENVIOGRATIS', 'CO-BG-6612340', now() - interval '18 days', now() - interval '12 days'),

  ('ORD-DEMO0048', null, 'delivered',
    '{"name":"Isabella Pérez","email":"isaperez@hotmail.com","phone":"+57 3013335577"}'::jsonb,
    '{"address":"Calle 19 # 4-71","city":"Bogotá","department":"Cundinamarca","postalCode":"110311","notes":""}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":68000,"discount":0,"shipping":10000,"total":78000}'::jsonb,
    null, 'CO-BG-9920114', now() - interval '20 days', now() - interval '14 days'),

  ('ORD-DEMO0049', (select linus_id from u), 'delivered',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 11 # 93-46","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":195000,"discount":5000,"shipping":0,"total":190000}'::jsonb,
    'PHPLUS5K', 'CO-BG-2204910', now() - interval '23 days', now() - interval '17 days'),

  ('ORD-DEMO0050', (select ada_id from u), 'delivered',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":42000,"discount":0,"shipping":8000,"total":50000}'::jsonb,
    null, 'CO-BG-3318092', now() - interval '26 days', now() - interval '20 days'),

  ('ORD-DEMO0051', null, 'delivered',
    '{"name":"Ricardo Salgado","email":"rsalgado@gmail.com","phone":"+57 3194446611"}'::jsonb,
    '{"address":"Calle 32 # 80-15","city":"Medellín","department":"Antioquia","postalCode":"050031","notes":"Laureles"}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":138000,"discount":0,"shipping":12000,"total":150000}'::jsonb,
    null, 'CO-MD-7745013', now() - interval '29 days', now() - interval '23 days'),

  ('ORD-DEMO0052', (select linus_id from u), 'delivered',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Vereda Fagua, Km 3 vía Cota","city":"Chía","department":"Cundinamarca","postalCode":"250001","notes":"Casa pintura azul"}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":96000,"discount":0,"shipping":15000,"total":111000}'::jsonb,
    null, 'CO-CH-2204901', now() - interval '32 days', now() - interval '26 days'),

  ('ORD-DEMO0053', (select ada_id from u), 'delivered',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 140 # 19-22","city":"Bogotá","department":"Cundinamarca","postalCode":"110131","notes":"Casa 14"}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":380000,"discount":38000,"shipping":0,"total":342000}'::jsonb,
    'BIENVENIDA10', 'CO-BG-4459302', now() - interval '36 days', now() - interval '30 days'),

  ('ORD-DEMO0054', null, 'delivered',
    '{"name":"Daniela Pineda","email":"dpineda@gmail.com","phone":"+57 3145559922"}'::jsonb,
    '{"address":"Avenida Pasoancho # 65-15","city":"Cali","department":"Valle del Cauca","postalCode":"760045","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":89000,"discount":0,"shipping":18000,"total":107000}'::jsonb,
    null, 'CO-CL-2284010', now() - interval '40 days', now() - interval '34 days'),

  ('ORD-DEMO0055', (select linus_id from u), 'delivered',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":58000,"discount":0,"shipping":12000,"total":70000}'::jsonb,
    null, 'CO-MD-5582410', now() - interval '43 days', now() - interval '38 days'),

  -- ============ CLOSED (5) ============
  ('ORD-DEMO0056', (select ada_id from u), 'closed',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":120000,"discount":12000,"shipping":10000,"total":118000}'::jsonb,
    'BIENVENIDA10', 'CO-BG-1129044', now() - interval '35 days', now() - interval '20 days'),

  ('ORD-DEMO0057', null, 'closed',
    '{"name":"Javier Torres","email":"javitorres@gmail.com","phone":"+57 3023338899"}'::jsonb,
    '{"address":"Calle 70 # 11-50","city":"Bogotá","department":"Cundinamarca","postalCode":"110231","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":205000,"discount":0,"shipping":12000,"total":217000}'::jsonb,
    null, 'CO-BG-2294012', now() - interval '50 days', now() - interval '30 days'),

  ('ORD-DEMO0058', (select linus_id from u), 'closed',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 11 # 93-46","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":"Piso 7"}'::jsonb,
    '{"method":"credit_card","last4":"9988"}'::jsonb,
    '{"subtotal":312000,"discount":0,"shipping":0,"total":312000}'::jsonb,
    'ENVIOGRATIS', 'CO-BG-7820901', now() - interval '65 days', now() - interval '45 days'),

  ('ORD-DEMO0059', null, 'closed',
    '{"name":"Sandra Bermúdez","email":"sandraber@hotmail.com","phone":"+57 3148882233"}'::jsonb,
    '{"address":"Carrera 50 # 14-22","city":"Barranquilla","department":"Atlántico","postalCode":"080020","notes":""}'::jsonb,
    '{"method":"cash_on_delivery"}'::jsonb,
    '{"subtotal":78000,"discount":0,"shipping":22000,"total":100000}'::jsonb,
    null, 'CO-BQ-3349910', now() - interval '78 days', now() - interval '60 days'),

  ('ORD-DEMO0060', (select ada_id from u), 'closed',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":165000,"discount":5000,"shipping":0,"total":160000}'::jsonb,
    'PHPLUS5K', 'CO-BG-1029384', now() - interval '88 days', now() - interval '72 days'),

  -- ============ CANCELLED (3) ============
  ('ORD-DEMO0061', (select ada_id from u), 'cancelled',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Carrera 13 # 93-45","city":"Bogotá","department":"Cundinamarca","postalCode":"110221","notes":""}'::jsonb,
    '{"method":"credit_card","last4":"1182"}'::jsonb,
    '{"subtotal":48000,"discount":0,"shipping":10000,"total":58000}'::jsonb,
    null, null, now() - interval '10 days', now() - interval '9 days'),

  ('ORD-DEMO0062', null, 'cancelled',
    '{"name":"Andrea Beltrán","email":"andreabel@gmail.com","phone":"+57 3175552244"}'::jsonb,
    '{"address":"Carrera 80 # 23-15","city":"Medellín","department":"Antioquia","postalCode":"050035","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":92000,"discount":0,"shipping":12000,"total":104000}'::jsonb,
    null, null, now() - interval '22 days', now() - interval '21 days'),

  ('ORD-DEMO0063', (select linus_id from u), 'cancelled',
    '{"name":"Linus Torvalds","email":"linus@ph-plus.co","phone":"+57 3209998877"}'::jsonb,
    '{"address":"Carrera 43A # 7-50","city":"Medellín","department":"Antioquia","postalCode":"050021","notes":""}'::jsonb,
    '{"method":"nequi"}'::jsonb,
    '{"subtotal":140000,"discount":0,"shipping":12000,"total":152000}'::jsonb,
    null, null, now() - interval '48 days', now() - interval '47 days'),

  -- ============ REFUNDED (2) ============
  ('ORD-DEMO0064', (select ada_id from u), 'refunded',
    '{"name":"Ada Lovelace","email":"ada@ph-plus.co","phone":"+57 3014567890"}'::jsonb,
    '{"address":"Calle 100 # 8A-49","city":"Bogotá","department":"Cundinamarca","postalCode":"110111","notes":"Oficina 1204"}'::jsonb,
    '{"method":"credit_card","last4":"7710"}'::jsonb,
    '{"subtotal":225000,"discount":22500,"shipping":0,"total":202500}'::jsonb,
    'BIENVENIDA10', 'CO-BG-9981023', now() - interval '40 days', now() - interval '32 days'),

  ('ORD-DEMO0065', null, 'refunded',
    '{"name":"Esteban Quiroga","email":"equiroga@gmail.com","phone":"+57 3014442288"}'::jsonb,
    '{"address":"Calle 50 # 38-22","city":"Bucaramanga","department":"Santander","postalCode":"680003","notes":""}'::jsonb,
    '{"method":"pse"}'::jsonb,
    '{"subtotal":86000,"discount":5000,"shipping":15000,"total":96000}'::jsonb,
    'PHPLUS5K', 'CO-BU-2294003', now() - interval '55 days', now() - interval '48 days')
) as v(id, user_id, status, contact, shipping, payment, totals, coupon_code, tracking_number, created_at, updated_at)
on conflict (id) do nothing;
