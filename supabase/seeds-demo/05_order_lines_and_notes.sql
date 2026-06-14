-- =============================================================
-- 05_order_lines_and_notes.sql
-- Líneas de pedido + notas internas para las 65 órdenes demo.
-- IDs UUID determinísticos para idempotencia.
-- La suma de line_total por orden = subtotal del header.
-- =============================================================

-- ----------- ORDER LINES (≈140 filas) -----------
insert into order_lines (id, order_id, slug, title, quantity, unit_price, line_total) values
  -- ORD-DEMO0001 — subtotal 85000
  ('00000000-0000-0000-0000-000000000001'::uuid, 'ORD-DEMO0001', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),

  -- ORD-DEMO0002 — subtotal 42000
  ('00000000-0000-0000-0000-000000000002'::uuid, 'ORD-DEMO0002', 'botellon-19lts', 'Botellón 19L', 2, 21000, 42000),

  -- ORD-DEMO0003 — subtotal 156000
  ('00000000-0000-0000-0000-000000000003'::uuid, 'ORD-DEMO0003', 'dispensador-manual', 'Dispensador manual', 1, 86000, 86000),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'ORD-DEMO0003', 'botellon-19lts', 'Botellón 19L', 2, 35000, 70000),

  -- ORD-DEMO0004 — subtotal 28000
  ('00000000-0000-0000-0000-000000000005'::uuid, 'ORD-DEMO0004', 'garrafa-1l-pack6', 'Garrafa 1L Pack x6', 2, 14000, 28000),

  -- ORD-DEMO0005 — subtotal 68000
  ('00000000-0000-0000-0000-000000000006'::uuid, 'ORD-DEMO0005', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 34000, 68000),

  -- ORD-DEMO0006 — subtotal 120000
  ('00000000-0000-0000-0000-000000000007'::uuid, 'ORD-DEMO0006', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000008'::uuid, 'ORD-DEMO0006', 'botellon-19lts', 'Botellón 19L', 1, 35000, 35000),

  -- ORD-DEMO0007 — subtotal 225000
  ('00000000-0000-0000-0000-000000000009'::uuid, 'ORD-DEMO0007', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000010'::uuid, 'ORD-DEMO0007', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 2, 45000, 90000),
  ('00000000-0000-0000-0000-000000000011'::uuid, 'ORD-DEMO0007', 'dispensador-manual', 'Dispensador manual', 1, 50000, 50000),

  -- ORD-DEMO0008 — subtotal 48000
  ('00000000-0000-0000-0000-000000000012'::uuid, 'ORD-DEMO0008', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 24000, 48000),

  -- ORD-DEMO0009 — subtotal 68000
  ('00000000-0000-0000-0000-000000000013'::uuid, 'ORD-DEMO0009', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 34000, 68000),

  -- ORD-DEMO0010 — subtotal 340000
  ('00000000-0000-0000-0000-000000000014'::uuid, 'ORD-DEMO0010', 'kit-oficina-completo', 'Kit oficina completo', 2, 120000, 240000),
  ('00000000-0000-0000-0000-000000000015'::uuid, 'ORD-DEMO0010', 'dispensador-manual', 'Dispensador manual', 2, 50000, 100000),

  -- ORD-DEMO0011 — subtotal 95000
  ('00000000-0000-0000-0000-000000000016'::uuid, 'ORD-DEMO0011', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 75000, 75000),
  ('00000000-0000-0000-0000-000000000017'::uuid, 'ORD-DEMO0011', 'botellon-19lts', 'Botellón 19L recarga', 1, 20000, 20000),

  -- ORD-DEMO0012 — subtotal 180000
  ('00000000-0000-0000-0000-000000000018'::uuid, 'ORD-DEMO0012', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000019'::uuid, 'ORD-DEMO0012', 'dispensador-electrico', 'Dispensador eléctrico', 1, 60000, 60000),

  -- ORD-DEMO0013 — subtotal 56000
  ('00000000-0000-0000-0000-000000000020'::uuid, 'ORD-DEMO0013', 'botellon-19lts', 'Botellón 19L', 2, 28000, 56000),

  -- ORD-DEMO0014 — subtotal 135000
  ('00000000-0000-0000-0000-000000000021'::uuid, 'ORD-DEMO0014', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000022'::uuid, 'ORD-DEMO0014', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 2, 25000, 50000),

  -- ORD-DEMO0015 — subtotal 78000
  ('00000000-0000-0000-0000-000000000023'::uuid, 'ORD-DEMO0015', 'botellon-19lts', 'Botellón 19L', 1, 42000, 42000),
  ('00000000-0000-0000-0000-000000000024'::uuid, 'ORD-DEMO0015', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 18000, 36000),

  -- ORD-DEMO0016 — subtotal 210000
  ('00000000-0000-0000-0000-000000000025'::uuid, 'ORD-DEMO0016', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 2, 85000, 170000),
  ('00000000-0000-0000-0000-000000000026'::uuid, 'ORD-DEMO0016', 'garrafa-1l-pack6', 'Garrafa 1L Pack x6', 2, 20000, 40000),

  -- ORD-DEMO0017 — subtotal 35000
  ('00000000-0000-0000-0000-000000000027'::uuid, 'ORD-DEMO0017', 'botellon-19lts', 'Botellón 19L', 1, 35000, 35000),

  -- ORD-DEMO0018 — subtotal 92000
  ('00000000-0000-0000-0000-000000000028'::uuid, 'ORD-DEMO0018', 'dispensador-electrico', 'Dispensador eléctrico', 1, 62000, 62000),
  ('00000000-0000-0000-0000-000000000029'::uuid, 'ORD-DEMO0018', 'botellon-19lts', 'Botellón 19L', 1, 30000, 30000),

  -- ORD-DEMO0019 — subtotal 165000
  ('00000000-0000-0000-0000-000000000030'::uuid, 'ORD-DEMO0019', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000031'::uuid, 'ORD-DEMO0019', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 2, 40000, 80000),

  -- ORD-DEMO0020 — subtotal 48000
  ('00000000-0000-0000-0000-000000000032'::uuid, 'ORD-DEMO0020', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 24000, 48000),

  -- ORD-DEMO0021 — subtotal 278000
  ('00000000-0000-0000-0000-000000000033'::uuid, 'ORD-DEMO0021', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000034'::uuid, 'ORD-DEMO0021', 'dispensador-electrico', 'Dispensador eléctrico premium', 2, 79000, 158000),

  -- ORD-DEMO0022 — subtotal 72000
  ('00000000-0000-0000-0000-000000000035'::uuid, 'ORD-DEMO0022', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 3, 24000, 72000),

  -- ORD-DEMO0023 — subtotal 145000
  ('00000000-0000-0000-0000-000000000036'::uuid, 'ORD-DEMO0023', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000037'::uuid, 'ORD-DEMO0023', 'dispensador-electrico', 'Dispensador eléctrico', 1, 60000, 60000),

  -- ORD-DEMO0024 — subtotal 58000
  ('00000000-0000-0000-0000-000000000038'::uuid, 'ORD-DEMO0024', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 29000, 58000),

  -- ORD-DEMO0025 — subtotal 195000
  ('00000000-0000-0000-0000-000000000039'::uuid, 'ORD-DEMO0025', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000040'::uuid, 'ORD-DEMO0025', 'dispensador-electrico', 'Dispensador eléctrico', 1, 60000, 60000),
  ('00000000-0000-0000-0000-000000000041'::uuid, 'ORD-DEMO0025', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 2, 25000, 50000),

  -- ORD-DEMO0026 — subtotal 420000
  ('00000000-0000-0000-0000-000000000042'::uuid, 'ORD-DEMO0026', 'kit-oficina-completo', 'Kit oficina completo', 2, 120000, 240000),
  ('00000000-0000-0000-0000-000000000043'::uuid, 'ORD-DEMO0026', 'dispensador-electrico', 'Dispensador eléctrico', 3, 60000, 180000),

  -- ORD-DEMO0027 — subtotal 98000
  ('00000000-0000-0000-0000-000000000044'::uuid, 'ORD-DEMO0027', 'dispensador-electrico', 'Dispensador eléctrico', 1, 62000, 62000),
  ('00000000-0000-0000-0000-000000000045'::uuid, 'ORD-DEMO0027', 'botellon-19lts', 'Botellón 19L', 1, 36000, 36000),

  -- ORD-DEMO0028 — subtotal 156000
  ('00000000-0000-0000-0000-000000000046'::uuid, 'ORD-DEMO0028', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000047'::uuid, 'ORD-DEMO0028', 'botellon-19lts', 'Botellón 19L', 1, 36000, 36000),

  -- ORD-DEMO0029 — subtotal 62000
  ('00000000-0000-0000-0000-000000000048'::uuid, 'ORD-DEMO0029', 'dispensador-electrico', 'Dispensador eléctrico', 1, 62000, 62000),

  -- ORD-DEMO0030 — subtotal 85000
  ('00000000-0000-0000-0000-000000000049'::uuid, 'ORD-DEMO0030', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),

  -- ORD-DEMO0031 — subtotal 189000
  ('00000000-0000-0000-0000-000000000050'::uuid, 'ORD-DEMO0031', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000051'::uuid, 'ORD-DEMO0031', 'dispensador-electrico', 'Dispensador eléctrico', 2, 52000, 104000),

  -- ORD-DEMO0032 — subtotal 48000
  ('00000000-0000-0000-0000-000000000052'::uuid, 'ORD-DEMO0032', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 24000, 48000),

  -- ORD-DEMO0033 — subtotal 124000
  ('00000000-0000-0000-0000-000000000053'::uuid, 'ORD-DEMO0033', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000054'::uuid, 'ORD-DEMO0033', 'botellon-19lts', 'Botellón 19L', 1, 39000, 39000),

  -- ORD-DEMO0034 — subtotal 76000
  ('00000000-0000-0000-0000-000000000055'::uuid, 'ORD-DEMO0034', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 38000, 76000),

  -- ORD-DEMO0035 — subtotal 215000
  ('00000000-0000-0000-0000-000000000056'::uuid, 'ORD-DEMO0035', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000057'::uuid, 'ORD-DEMO0035', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 60000, 60000),
  ('00000000-0000-0000-0000-000000000058'::uuid, 'ORD-DEMO0035', 'botellon-19lts', 'Botellón 19L', 1, 35000, 35000),

  -- ORD-DEMO0036 — subtotal 175000
  ('00000000-0000-0000-0000-000000000059'::uuid, 'ORD-DEMO0036', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000060'::uuid, 'ORD-DEMO0036', 'dispensador-electrico', 'Dispensador eléctrico', 1, 50000, 50000),
  ('00000000-0000-0000-0000-000000000061'::uuid, 'ORD-DEMO0036', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 1, 40000, 40000),

  -- ORD-DEMO0037 — subtotal 98000
  ('00000000-0000-0000-0000-000000000062'::uuid, 'ORD-DEMO0037', 'botellon-19lts', 'Botellón 19L', 2, 49000, 98000),

  -- ORD-DEMO0038 — subtotal 68000
  ('00000000-0000-0000-0000-000000000063'::uuid, 'ORD-DEMO0038', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 34000, 68000),

  -- ORD-DEMO0039 — subtotal 315000
  ('00000000-0000-0000-0000-000000000064'::uuid, 'ORD-DEMO0039', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 3, 85000, 255000),
  ('00000000-0000-0000-0000-000000000065'::uuid, 'ORD-DEMO0039', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 2, 30000, 60000),

  -- ORD-DEMO0040 — subtotal 58000
  ('00000000-0000-0000-0000-000000000066'::uuid, 'ORD-DEMO0040', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 29000, 58000),

  -- ORD-DEMO0041 — subtotal 225000
  ('00000000-0000-0000-0000-000000000067'::uuid, 'ORD-DEMO0041', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000068'::uuid, 'ORD-DEMO0041', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000069'::uuid, 'ORD-DEMO0041', 'garrafa-1l-pack6', 'Garrafa 1L Pack x6', 1, 20000, 20000),

  -- ORD-DEMO0042 — subtotal 42000
  ('00000000-0000-0000-0000-000000000070'::uuid, 'ORD-DEMO0042', 'botellon-19lts', 'Botellón 19L', 2, 21000, 42000),

  -- ORD-DEMO0043 — subtotal 138000
  ('00000000-0000-0000-0000-000000000071'::uuid, 'ORD-DEMO0043', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000072'::uuid, 'ORD-DEMO0043', 'dispensador-electrico', 'Dispensador eléctrico', 1, 53000, 53000),

  -- ORD-DEMO0044 — subtotal 85000
  ('00000000-0000-0000-0000-000000000073'::uuid, 'ORD-DEMO0044', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),

  -- ORD-DEMO0045 — subtotal 118000
  ('00000000-0000-0000-0000-000000000074'::uuid, 'ORD-DEMO0045', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000075'::uuid, 'ORD-DEMO0045', 'botellon-19lts', 'Botellón 19L', 1, 33000, 33000),

  -- ORD-DEMO0046 — subtotal 52000
  ('00000000-0000-0000-0000-000000000076'::uuid, 'ORD-DEMO0046', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 26000, 52000),

  -- ORD-DEMO0047 — subtotal 268000
  ('00000000-0000-0000-0000-000000000077'::uuid, 'ORD-DEMO0047', 'kit-oficina-completo', 'Kit oficina completo', 2, 120000, 240000),
  ('00000000-0000-0000-0000-000000000078'::uuid, 'ORD-DEMO0047', 'botellon-19lts', 'Botellón 19L', 1, 28000, 28000),

  -- ORD-DEMO0048 — subtotal 68000
  ('00000000-0000-0000-0000-000000000079'::uuid, 'ORD-DEMO0048', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 34000, 68000),

  -- ORD-DEMO0049 — subtotal 195000
  ('00000000-0000-0000-0000-000000000080'::uuid, 'ORD-DEMO0049', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000081'::uuid, 'ORD-DEMO0049', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 75000, 75000),

  -- ORD-DEMO0050 — subtotal 42000
  ('00000000-0000-0000-0000-000000000082'::uuid, 'ORD-DEMO0050', 'botellon-19lts', 'Botellón 19L', 2, 21000, 42000),

  -- ORD-DEMO0051 — subtotal 138000
  ('00000000-0000-0000-0000-000000000083'::uuid, 'ORD-DEMO0051', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000084'::uuid, 'ORD-DEMO0051', 'dispensador-electrico', 'Dispensador eléctrico', 1, 53000, 53000),

  -- ORD-DEMO0052 — subtotal 96000
  ('00000000-0000-0000-0000-000000000085'::uuid, 'ORD-DEMO0052', 'botellon-19lts', 'Botellón 19L', 2, 48000, 96000),

  -- ORD-DEMO0053 — subtotal 380000
  ('00000000-0000-0000-0000-000000000086'::uuid, 'ORD-DEMO0053', 'kit-oficina-completo', 'Kit oficina completo', 2, 120000, 240000),
  ('00000000-0000-0000-0000-000000000087'::uuid, 'ORD-DEMO0053', 'dispensador-electrico', 'Dispensador eléctrico premium', 2, 70000, 140000),

  -- ORD-DEMO0054 — subtotal 89000
  ('00000000-0000-0000-0000-000000000088'::uuid, 'ORD-DEMO0054', 'dispensador-electrico', 'Dispensador eléctrico', 1, 60000, 60000),
  ('00000000-0000-0000-0000-000000000089'::uuid, 'ORD-DEMO0054', 'botellon-19lts', 'Botellón 19L', 1, 29000, 29000),

  -- ORD-DEMO0055 — subtotal 58000
  ('00000000-0000-0000-0000-000000000090'::uuid, 'ORD-DEMO0055', 'filtros-repuesto-x2', 'Filtros repuesto x2', 2, 29000, 58000),

  -- ORD-DEMO0056 — subtotal 120000
  ('00000000-0000-0000-0000-000000000091'::uuid, 'ORD-DEMO0056', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),

  -- ORD-DEMO0057 — subtotal 205000
  ('00000000-0000-0000-0000-000000000092'::uuid, 'ORD-DEMO0057', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000093'::uuid, 'ORD-DEMO0057', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),

  -- ORD-DEMO0058 — subtotal 312000
  ('00000000-0000-0000-0000-000000000094'::uuid, 'ORD-DEMO0058', 'kit-oficina-completo', 'Kit oficina completo', 2, 120000, 240000),
  ('00000000-0000-0000-0000-000000000095'::uuid, 'ORD-DEMO0058', 'botellon-19lts', 'Botellón 19L', 2, 36000, 72000),

  -- ORD-DEMO0059 — subtotal 78000
  ('00000000-0000-0000-0000-000000000096'::uuid, 'ORD-DEMO0059', 'botellon-19lts', 'Botellón 19L', 1, 42000, 42000),
  ('00000000-0000-0000-0000-000000000097'::uuid, 'ORD-DEMO0059', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 18000, 36000),

  -- ORD-DEMO0060 — subtotal 165000
  ('00000000-0000-0000-0000-000000000098'::uuid, 'ORD-DEMO0060', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000099'::uuid, 'ORD-DEMO0060', 'botella-vidrio-750ml', 'Botella vidrio 750ml', 2, 40000, 80000),

  -- ORD-DEMO0061 — subtotal 48000
  ('00000000-0000-0000-0000-000000000100'::uuid, 'ORD-DEMO0061', 'ampollas-alcalinas', 'Ampollas alcalinizantes', 2, 24000, 48000),

  -- ORD-DEMO0062 — subtotal 92000
  ('00000000-0000-0000-0000-000000000101'::uuid, 'ORD-DEMO0062', 'dispensador-electrico', 'Dispensador eléctrico', 1, 62000, 62000),
  ('00000000-0000-0000-0000-000000000102'::uuid, 'ORD-DEMO0062', 'botellon-19lts', 'Botellón 19L', 1, 30000, 30000),

  -- ORD-DEMO0063 — subtotal 140000
  ('00000000-0000-0000-0000-000000000103'::uuid, 'ORD-DEMO0063', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000104'::uuid, 'ORD-DEMO0063', 'dispensador-electrico', 'Dispensador eléctrico', 1, 55000, 55000),

  -- ORD-DEMO0064 — subtotal 225000
  ('00000000-0000-0000-0000-000000000105'::uuid, 'ORD-DEMO0064', 'kit-oficina-completo', 'Kit oficina completo', 1, 120000, 120000),
  ('00000000-0000-0000-0000-000000000106'::uuid, 'ORD-DEMO0064', 'kit-inicial-botellon-19lts', 'Kit inicial Botellón 19L', 1, 85000, 85000),
  ('00000000-0000-0000-0000-000000000107'::uuid, 'ORD-DEMO0064', 'garrafa-1l-pack6', 'Garrafa 1L Pack x6', 1, 20000, 20000),

  -- ORD-DEMO0065 — subtotal 86000
  ('00000000-0000-0000-0000-000000000108'::uuid, 'ORD-DEMO0065', 'botellon-19lts', 'Botellón 19L', 2, 43000, 86000)
on conflict (id) do nothing;


-- ----------- ORDER NOTES (≈45 filas distribuidas en ~30 órdenes) -----------
insert into order_notes (id, order_id, author, text, created_at) values
  -- 0006
  ('10000000-0000-0000-0000-000000000001'::uuid, 'ORD-DEMO0006', 'Staff Pedidos', 'Cliente solicitó entrega antes del mediodía.', now() - interval '23 hours'),
  -- 0007
  ('10000000-0000-0000-0000-000000000002'::uuid, 'ORD-DEMO0007', 'Admin', 'Esperando confirmación de pago por Wompi.', now() - interval '1 day 22 hours'),
  -- 0010
  ('10000000-0000-0000-0000-000000000003'::uuid, 'ORD-DEMO0010', 'María Admin', 'Cliente VIP — priorizar despacho.', now() - interval '4 days 20 hours'),
  ('10000000-0000-0000-0000-000000000004'::uuid, 'ORD-DEMO0010', 'Staff Pedidos', 'Coupon BIENVENIDA10 validado.', now() - interval '4 days 18 hours'),
  -- 0012
  ('10000000-0000-0000-0000-000000000005'::uuid, 'ORD-DEMO0012', 'Admin', 'Coupon ENVIOGRATIS aplicado correctamente.', now() - interval '5 days 22 hours'),
  -- 0014
  ('10000000-0000-0000-0000-000000000006'::uuid, 'ORD-DEMO0014', 'Staff Pedidos', 'Cliente nuevo — enviar instructivo de uso del filtro.', now() - interval '4 days 22 hours'),
  -- 0016
  ('10000000-0000-0000-0000-000000000007'::uuid, 'ORD-DEMO0016', 'Admin', 'Pago verificado vía Wompi.', now() - interval '2 days 22 hours'),
  -- 0018
  ('10000000-0000-0000-0000-000000000008'::uuid, 'ORD-DEMO0018', 'Staff Pedidos', 'Pago aprobado, se prepara despacho mañana.', now() - interval '1 day 20 hours'),
  -- 0019
  ('10000000-0000-0000-0000-000000000009'::uuid, 'ORD-DEMO0019', 'María Admin', 'Cliente solicitó factura electrónica.', now() - interval '2 days 14 hours'),
  -- 0021
  ('10000000-0000-0000-0000-000000000010'::uuid, 'ORD-DEMO0021', 'Admin', 'Pedido grande — coordinar con bodega Salitre.', now() - interval '6 days 18 hours'),
  ('10000000-0000-0000-0000-000000000011'::uuid, 'ORD-DEMO0021', 'Staff Pedidos', 'Cliente recurrente, ofrecer programa de fidelidad.', now() - interval '6 days 16 hours'),
  -- 0023
  ('10000000-0000-0000-0000-000000000012'::uuid, 'ORD-DEMO0023', 'Admin', 'Coupon PHPLUS5K aplicado.', now() - interval '10 days 22 hours'),
  -- 0025
  ('10000000-0000-0000-0000-000000000013'::uuid, 'ORD-DEMO0025', 'Staff Pedidos', 'Envío programado para mañana vía Coordinadora.', now() - interval '13 days 20 hours'),
  -- 0026
  ('10000000-0000-0000-0000-000000000014'::uuid, 'ORD-DEMO0026', 'María Admin', 'Cliente VIP — empacar con bolsa premium.', now() - interval '2 days 12 hours'),
  ('10000000-0000-0000-0000-000000000015'::uuid, 'ORD-DEMO0026', 'Staff Pedidos', 'Faltaba un dispensador, se reemplazó con dispensador-manual de stock.', now() - interval '1 day 18 hours'),
  -- 0028
  ('10000000-0000-0000-0000-000000000016'::uuid, 'ORD-DEMO0028', 'Admin', 'Envío a Medellín — usar transportadora Servientrega.', now() - interval '2 days 12 hours'),
  -- 0031
  ('10000000-0000-0000-0000-000000000017'::uuid, 'ORD-DEMO0031', 'Staff Pedidos', 'Cliente avisó que estará en la finca solo los fines de semana.', now() - interval '5 days 10 hours'),
  -- 0033
  ('10000000-0000-0000-0000-000000000018'::uuid, 'ORD-DEMO0033', 'Admin', 'Verificar dirección — Laureles tiene varios sectores.', now() - interval '6 days 8 hours'),
  -- 0035
  ('10000000-0000-0000-0000-000000000019'::uuid, 'ORD-DEMO0035', 'María Admin', 'Coupon BIENVENIDA10 validado, primera compra.', now() - interval '8 days 22 hours'),
  -- 0036
  ('10000000-0000-0000-0000-000000000020'::uuid, 'ORD-DEMO0036', 'Staff Pedidos', 'Tracking enviado por WhatsApp al cliente.', now() - interval '3 days 12 hours'),
  -- 0037
  ('10000000-0000-0000-0000-000000000021'::uuid, 'ORD-DEMO0037', 'Admin', 'Despachado vía Servientrega — guía CO-MD-1820471.', now() - interval '4 days 14 hours'),
  -- 0039
  ('10000000-0000-0000-0000-000000000022'::uuid, 'ORD-DEMO0039', 'María Admin', 'Pedido corporativo — coordinar entrega en oficina.', now() - interval '11 days 14 hours'),
  ('10000000-0000-0000-0000-000000000023'::uuid, 'ORD-DEMO0039', 'Staff Pedidos', 'Tracking enviado por WhatsApp.', now() - interval '6 days 10 hours'),
  -- 0041
  ('10000000-0000-0000-0000-000000000024'::uuid, 'ORD-DEMO0041', 'Admin', 'Despacho confirmado, llegada estimada en 2 días.', now() - interval '8 days 12 hours'),
  -- 0043
  ('10000000-0000-0000-0000-000000000025'::uuid, 'ORD-DEMO0043', 'Staff Pedidos', 'Cliente nuevo en Bucaramanga — confirmar dirección antes de despachar.', now() - interval '14 days 10 hours'),
  -- 0044
  ('10000000-0000-0000-0000-000000000026'::uuid, 'ORD-DEMO0044', 'Admin', 'Entrega confirmada por portería del edificio.', now() - interval '5 days 8 hours'),
  -- 0045
  ('10000000-0000-0000-0000-000000000027'::uuid, 'ORD-DEMO0045', 'María Admin', 'Cliente satisfecho, dejó reseña 5 estrellas.', now() - interval '7 days 4 hours'),
  -- 0047
  ('10000000-0000-0000-0000-000000000028'::uuid, 'ORD-DEMO0047', 'Staff Pedidos', 'Cliente VIP — incluir muestra de ampollas alcalinas como cortesía.', now() - interval '17 days 12 hours'),
  ('10000000-0000-0000-0000-000000000029'::uuid, 'ORD-DEMO0047', 'Admin', 'Entrega confirmada en recepción de oficina.', now() - interval '12 days 6 hours'),
  -- 0049
  ('10000000-0000-0000-0000-000000000030'::uuid, 'ORD-DEMO0049', 'Admin', 'Coupon PHPLUS5K aplicado correctamente.', now() - interval '22 days 14 hours'),
  -- 0053
  ('10000000-0000-0000-0000-000000000031'::uuid, 'ORD-DEMO0053', 'María Admin', 'Pedido grande — coordinar transporte propio.', now() - interval '35 days 8 hours'),
  ('10000000-0000-0000-0000-000000000032'::uuid, 'ORD-DEMO0053', 'Staff Pedidos', 'Entrega exitosa, cliente solicitó programar recurrencia mensual.', now() - interval '30 days 4 hours'),
  -- 0055
  ('10000000-0000-0000-0000-000000000033'::uuid, 'ORD-DEMO0055', 'Admin', 'Entrega completada en Medellín sin novedad.', now() - interval '38 days 6 hours'),
  -- 0056
  ('10000000-0000-0000-0000-000000000034'::uuid, 'ORD-DEMO0056', 'Staff Pedidos', 'Orden cerrada — cliente confirmó recepción y satisfacción.', now() - interval '20 days 4 hours'),
  -- 0058
  ('10000000-0000-0000-0000-000000000035'::uuid, 'ORD-DEMO0058', 'María Admin', 'Pedido corporativo cerrado — factura enviada al área contable.', now() - interval '45 days 6 hours'),
  -- 0060
  ('10000000-0000-0000-0000-000000000036'::uuid, 'ORD-DEMO0060', 'Admin', 'Orden cerrada hace más de 60 días — archivada.', now() - interval '72 days 2 hours'),
  -- 0061 — cancelled
  ('10000000-0000-0000-0000-000000000037'::uuid, 'ORD-DEMO0061', 'Staff Pedidos', 'Cliente canceló — no completó pago en 24h.', now() - interval '9 days 12 hours'),
  -- 0062 — cancelled
  ('10000000-0000-0000-0000-000000000038'::uuid, 'ORD-DEMO0062', 'Admin', 'Cancelado por solicitud del cliente, pago no aprobado por banco.', now() - interval '21 days 8 hours'),
  -- 0063 — cancelled
  ('10000000-0000-0000-0000-000000000039'::uuid, 'ORD-DEMO0063', 'María Admin', 'Cliente arrepentido tras hacer pedido, cancelación inmediata.', now() - interval '47 days 12 hours'),
  -- 0064 — refunded
  ('10000000-0000-0000-0000-000000000040'::uuid, 'ORD-DEMO0064', 'Admin', 'Producto llegó con daño — devolución autorizada por gerencia.', now() - interval '34 days 4 hours'),
  ('10000000-0000-0000-0000-000000000041'::uuid, 'ORD-DEMO0064', 'Staff Pedidos', 'Reembolso procesado vía Wompi, plazo 5-10 días hábiles.', now() - interval '32 days 6 hours'),
  -- 0065 — refunded
  ('10000000-0000-0000-0000-000000000042'::uuid, 'ORD-DEMO0065', 'María Admin', 'Cliente solicitó reembolso por insatisfacción con sabor.', now() - interval '50 days 8 hours'),
  ('10000000-0000-0000-0000-000000000043'::uuid, 'ORD-DEMO0065', 'Admin', 'Reembolso aprobado y procesado.', now() - interval '48 days 4 hours')
on conflict (id) do nothing;
