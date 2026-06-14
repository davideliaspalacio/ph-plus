-- =============================================================
-- 03_addresses.sql
-- Direcciones demo para usuarios PH PLUS.
-- Idempotente: usa IDs hardcoded + on conflict do nothing.
-- =============================================================

-- Ada Lovelace (3 direcciones — Casa default, Trabajo, Mamá)
insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  (select id from profiles where email = 'ada@ph-plus.co'),
  'Casa', 'Ada Lovelace',
  'Carrera 13 # 93-45', 'Apto 502, Edificio Los Cedros',
  'Bogotá', 'Cundinamarca', '110221',
  '+57 3014567890', true,
  now() - interval '120 days', now() - interval '120 days'
where exists (select 1 from profiles where email = 'ada@ph-plus.co')
on conflict (id) do nothing;

insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000002'::uuid,
  (select id from profiles where email = 'ada@ph-plus.co'),
  'Trabajo', 'Ada Lovelace',
  'Calle 100 # 8A-49', 'Torre B, Piso 12, Oficina 1204',
  'Bogotá', 'Cundinamarca', '110111',
  '+57 3014567890', false,
  now() - interval '90 days', now() - interval '90 days'
where exists (select 1 from profiles where email = 'ada@ph-plus.co')
on conflict (id) do nothing;

insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000003'::uuid,
  (select id from profiles where email = 'ada@ph-plus.co'),
  'Mamá', 'Beatriz Lovelace',
  'Calle 140 # 19-22', 'Casa 14, Conjunto Las Acacias',
  'Bogotá', 'Cundinamarca', '110131',
  '+57 3107778899', false,
  now() - interval '60 days', now() - interval '60 days'
where exists (select 1 from profiles where email = 'ada@ph-plus.co')
on conflict (id) do nothing;

-- Linus Torvalds (3 direcciones — Casa default, Oficina, Finca)
insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000001'::uuid,
  (select id from profiles where email = 'linus@ph-plus.co'),
  'Casa', 'Linus Torvalds',
  'Carrera 43A # 7-50', 'Apto 1801, Torre Norte',
  'Medellín', 'Antioquia', '050021',
  '+57 3209998877', true,
  now() - interval '150 days', now() - interval '150 days'
where exists (select 1 from profiles where email = 'linus@ph-plus.co')
on conflict (id) do nothing;

insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000002'::uuid,
  (select id from profiles where email = 'linus@ph-plus.co'),
  'Oficina', 'Linus Torvalds',
  'Carrera 11 # 93-46', 'Piso 7, Coworking Chicó',
  'Bogotá', 'Cundinamarca', '110221',
  '+57 3209998877', false,
  now() - interval '100 days', now() - interval '100 days'
where exists (select 1 from profiles where email = 'linus@ph-plus.co')
on conflict (id) do nothing;

insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000003'::uuid,
  (select id from profiles where email = 'linus@ph-plus.co'),
  'Finca fin de semana', 'Linus Torvalds',
  'Vereda Fagua, Km 3 vía Cota', 'Casa pintura azul, portón blanco',
  'Chía', 'Cundinamarca', '250001',
  '+57 3209998877', false,
  now() - interval '45 days', now() - interval '45 days'
where exists (select 1 from profiles where email = 'linus@ph-plus.co')
on conflict (id) do nothing;

-- Admin (2 direcciones — Casa default, Bodega)
insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'cccccccc-cccc-cccc-cccc-000000000001'::uuid,
  (select id from profiles where email = 'admin@ph-plus.co'),
  'Casa', 'Admin PH PLUS',
  'Calle 152 # 58-30', 'Apto 401, Edificio Cedritos Park',
  'Bogotá', 'Cundinamarca', '111156',
  '+57 3001112233', true,
  now() - interval '200 days', now() - interval '200 days'
where exists (select 1 from profiles where email = 'admin@ph-plus.co')
on conflict (id) do nothing;

insert into addresses (id, user_id, label, name, line1, line2, city, department, postal_code, phone, is_default, created_at, updated_at)
select
  'cccccccc-cccc-cccc-cccc-000000000002'::uuid,
  (select id from profiles where email = 'admin@ph-plus.co'),
  'Bodega', 'Bodega PH PLUS Salitre',
  'Avenida El Dorado # 68B-31', 'Bodega 12, Zona Industrial Salitre',
  'Bogotá', 'Cundinamarca', '111071',
  '+57 3001112233', false,
  now() - interval '180 days', now() - interval '180 days'
where exists (select 1 from profiles where email = 'admin@ph-plus.co')
on conflict (id) do nothing;
