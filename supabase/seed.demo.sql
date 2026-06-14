-- ==========================================================
-- PH PLUS — Demo seed (auto-generado)
-- Generado: 2026-05-20 23:20:56
-- Origen:    supabase/seeds-demo/*.sql concatenados
-- Idempotente: re-correr es seguro (on conflict do nothing)
-- ==========================================================


-- ────────────────────────────────────────────────────────
-- 01_products_extra.sql
-- ────────────────────────────────────────────────────────
-- =============================================================================
-- PH PLUS — Seed demo: catálogo extendido (22 productos adicionales)
-- =============================================================================
-- Idempotente: usa `on conflict (slug) do nothing`, se puede re-aplicar sin
-- duplicar filas. Llena el catálogo a 33+ productos para demos de cliente.
--
-- Nota sobre enums:
--   product_size soporta: '1L' | '1.5L' | '5L' | '19L' | 'kit'
--   Los "botellones" de 10/15/20 L se mapean al enum válido más cercano
--   (19L para botellones grandes, 5L para medianos, 'kit' para accesorios).
--   El tamaño "real" se refleja en el título, specs y description.
-- =============================================================================

insert into public.products (
  slug, title, short_title, tagline, description, long_description,
  features, includes, price_value, prev_price_value,
  category, size, visual_key, popularity, highlight, badge,
  gallery, specs, usage, rating_average, rating_count,
  is_active, in_stock, meta_title, meta_description
) values
  -- ---------------------------------------------------------------------------
  -- 1. BOTELLONES (5)
  -- ---------------------------------------------------------------------------
  (
    'botellon-10l',
    'Botellón 10 litros retornable',
    'Botellón 10L',
    'El intermedio perfecto entre 5L y 19L',
    'Botellón retornable de 10 litros con asa ergonómica, ideal para hogares pequeños o oficinas con poco espacio.',
    '["Botellón retornable de 10 litros con agua alcalina pH 9.0.", "Diseño ergonómico con asa reforzada para fácil transporte.", "Tapa hermética con sello de seguridad.", "Reutilizable hasta 50 veces — más ecológico que las botellas individuales."]'::jsonb,
    '["Asa ergonómica reforzada", "Tapa hermética con sello", "Plástico BPA-free", "Retornable y reutilizable"]'::jsonb,
    '["1 botellón de 10 litros", "Sello de garantía PH PLUS"]'::jsonb,
    24000, null,
    'botellon', '5L', 'kit', 58, false,
    null,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"10 litros"},{"label":"pH","value":"9.0"},{"label":"Material","value":"PET BPA-free"},{"label":"Peso vacío","value":"380 g"}]'::jsonb,
    '["Ideal para apartamentos pequeños.","Perfecto para oficinas con 2-3 personas.","Más fácil de cargar que el 19L."]'::jsonb,
    4.5, 7, true, true,
    'Botellón 10 litros agua alcalina pH 9.0 | PH PLUS',
    'Botellón retornable de 10 litros con agua alcalina pH 9.0. Asa ergonómica, BPA-free. Envío en Bogotá en 1-2 días.'
  ),
  (
    'botellon-15l-empresarial',
    'Botellón 15 litros empresarial',
    'Botellón 15L empresa',
    'La hidratación de tu equipo, sin interrupciones',
    'Botellón de 15 litros pensado para oficinas medianas. Compatible con todos los dispensadores estándar del mercado.',
    '["Diseñado para empresas con consumo medio-alto de agua.","Ahorra hasta 30% frente al consumo individual de botellas.","Compatible con dispensadores Top Loading universales.","Servicio empresarial con facturación electrónica DIAN."]'::jsonb,
    '["Cuello universal para dispensadores","Plástico reforzado de larga vida","Etiqueta con lote y fecha de envasado","Facturación electrónica disponible"]'::jsonb,
    '["1 botellón de 15 litros", "Etiqueta de lote y trazabilidad"]'::jsonb,
    34000, null,
    'botellon', '19L', 'kit', 62, false,
    null,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"15 litros"},{"label":"pH","value":"9.0"},{"label":"Cuello","value":"55 mm universal"},{"label":"Vida útil","value":"40 ciclos"}]'::jsonb,
    '["Recomendado para oficinas de 5-10 personas.","Cambia el botellón aproximadamente cada 7-10 días.","Solicita factura electrónica al hacer el pedido."]'::jsonb,
    4.6, 11, true, true,
    'Botellón 15L empresarial agua alcalina | PH PLUS',
    'Botellón empresarial de 15 litros con agua alcalina pH 9.0. Facturación electrónica DIAN. Ideal para oficinas.'
  ),
  (
    'botellon-20l-premium',
    'Botellón 20 litros Premium Oro',
    'Botellón 20L Premium',
    'Nuestro botellón más grande, con tapa dorada de edición especial',
    'Botellón premium de 20 litros con tapa dorada antifugas y certificación de mineralización extendida. Pensado para amantes del agua de alta gama.',
    '["Edición especial con tapa metalizada dorada antifugas.","Agua alcalina pH 9.2 con magnesio y calcio adicional.","Botellón fabricado en Tritan™ libre de microplásticos.","Incluye certificado de análisis fisicoquímico por lote."]'::jsonb,
    '["Tapa dorada antifugas premium","Mineralización extendida (Mg + Ca)","Material Tritan™ ultra resistente","Certificado de análisis por lote"]'::jsonb,
    '["1 botellón Premium de 20 litros","Tapa dorada de edición especial","Certificado de análisis fisicoquímico"]'::jsonb,
    58000, 72000,
    'botellon', '19L', 'kit', 70, true,
    '{"title":"EDICIÓN PREMIUM","sub":"Tapa dorada incluida"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"20 litros"},{"label":"pH","value":"9.2"},{"label":"Material","value":"Tritan™"},{"label":"Tapa","value":"Dorada antifugas"}]'::jsonb,
    '["Servir frío para realzar minerales.","Ideal como regalo corporativo.","Conservar el certificado para auditorías de calidad."]'::jsonb,
    4.9, 14, true, true,
    'Botellón 20L Premium Oro pH 9.2 | PH PLUS',
    'Botellón Premium 20 litros con tapa dorada y mineralización extendida. pH 9.2. Edición especial PH PLUS.'
  ),
  (
    'botellon-19l-sabor-frutal',
    'Botellón 19L sabor frutal (mango / maracuyá)',
    'Botellón 19L frutal',
    'Hidratación con un toque de sabor natural',
    'Botellón de 19 litros con infusión natural de fruta tropical. Endulzado únicamente con estevia, sin azúcares añadidos.',
    '["Infusión 100% natural de mango y maracuyá colombianos.","Endulzado sólo con estevia — 0 calorías añadidas.","Mantiene los beneficios alcalinos del agua base pH 9.0.","Disponible mientras dure la temporada de cosecha."]'::jsonb,
    '["Infusión natural de fruta","Endulzado con estevia","0 azúcares añadidos","Temporada limitada"]'::jsonb,
    '["1 botellón de 19 litros sabor frutal", "Etiqueta de edición limitada"]'::jsonb,
    52000, null,
    'botellon', '19L', 'kit', 48, false,
    '{"title":"TEMPORADA","sub":"Edición limitada"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"19 litros"},{"label":"pH","value":"9.0"},{"label":"Sabor","value":"Mango / Maracuyá"},{"label":"Endulzante","value":"Estevia natural"}]'::jsonb,
    '["Servir bien frío.","Agitar suavemente antes de usar.","Consumir en máximo 14 días después de abrir."]'::jsonb,
    4.4, 19, true, false,
    'Botellón 19L sabor frutal estevia | PH PLUS',
    'Botellón de 19 litros con infusión natural de mango y maracuyá. Endulzado con estevia. Temporada limitada.'
  ),
  (
    'kit-19l-kids',
    'Kit 19L Kids con dispensador infantil',
    'Kit 19L Kids',
    'Hidratación divertida y segura para los más pequeños',
    'Kit completo con botellón de 19 litros, dispensador infantil de colores con grifo a baja altura y vasos reutilizables.',
    '["Dispensador diseñado a altura de niños (40 cm).","Grifo de seguridad antigoteo y antiquemaduras (solo frío).","Botellón 19L con agua alcalina pH 9.0 ideal para crecimiento.","Incluye 4 vasos reutilizables con tapa antiderrame."]'::jsonb,
    '["Dispensador a baja altura","Grifo de seguridad antigoteo","Vasos antiderrame incluidos","Solo agua fría (sin riesgo de quemaduras)"]'::jsonb,
    '["1 botellón 19L","1 dispensador infantil de colores","4 vasos antiderrame 250 ml","Stickers decorativos"]'::jsonb,
    135000, 155000,
    'kit', '19L', 'kit', 67, true,
    '{"title":"FAVORITO FAMILIAS","sub":"Diseño infantil"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Altura dispensador","value":"40 cm"},{"label":"Capacidad botellón","value":"19 litros"},{"label":"Vasos","value":"4 x 250 ml"},{"label":"Edad recomendada","value":"+3 años"}]'::jsonb,
    '["Supervisar a niños menores de 5 años.","Lavar vasos con agua tibia y jabón neutro.","Recargar el botellón cuando llegue a 1/4 de capacidad."]'::jsonb,
    4.8, 22, true, true,
    'Kit 19L Kids dispensador infantil | PH PLUS',
    'Kit familiar con botellón 19L, dispensador infantil de seguridad y 4 vasos antiderrame. Para niños desde 3 años.'
  ),
  -- ---------------------------------------------------------------------------
  -- 2. GARRAFAS PREMIUM (4)
  -- ---------------------------------------------------------------------------
  (
    'garrafa-pepino-1l',
    'Garrafa 1L infusión de pepino',
    'Garrafa pepino 1L',
    'Frescura natural en cada sorbo',
    'Garrafa de 1 litro con infusión real de pepino orgánico. Refrescante, hidratante y con propiedades detox.',
    '["Pepino orgánico cultivado en Boyacá.","Sin azúcares ni conservantes.","Ideal post-entreno o para días calurosos.","Botella reutilizable de vidrio templado."]'::jsonb,
    '["Pepino orgánico de Boyacá","Sin azúcares ni conservantes","Botella de vidrio templado","Tapa de bambú natural"]'::jsonb,
    '["1 garrafa de vidrio 1L con infusión"]'::jsonb,
    14500, null,
    'garrafa', '1L', 'garrafas', 42, false,
    null,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"1 litro"},{"label":"Infusión","value":"Pepino orgánico"},{"label":"Material","value":"Vidrio templado"},{"label":"Origen","value":"Boyacá"}]'::jsonb,
    '["Mantener refrigerado.","Consumir en 7 días tras abrir.","Recargar con agua filtrada para una segunda infusión."]'::jsonb,
    4.6, 9, true, true,
    'Garrafa 1L pepino orgánico detox | PH PLUS',
    'Garrafa de vidrio 1L con infusión de pepino orgánico de Boyacá. Sin azúcares, ideal detox post-entreno.'
  ),
  (
    'garrafa-limon-1l',
    'Garrafa 1L infusión de limón Tahití',
    'Garrafa limón 1L',
    'Cítrico, brillante, con todas las vitaminas',
    'Garrafa de 1 litro con infusión de limón Tahití fresco. Aporta vitamina C natural y un toque ácido refrescante.',
    '["Limón Tahití cultivado en el Tolima.","Rica en vitamina C natural.","Sin endulzantes — el sabor ácido lo aporta la fruta.","Botella reutilizable y reciclable."]'::jsonb,
    '["Limón Tahití del Tolima","Vitamina C natural","Sin endulzantes añadidos","Vidrio templado reutilizable"]'::jsonb,
    '["1 garrafa de vidrio 1L con infusión de limón"]'::jsonb,
    14500, null,
    'garrafa', '1L', 'garrafas', 44, false,
    null,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"1 litro"},{"label":"Infusión","value":"Limón Tahití"},{"label":"Vitamina C","value":"~30 mg/L"},{"label":"Origen","value":"Tolima"}]'::jsonb,
    '["Ideal en ayunas para activar el metabolismo.","Servir con hielo y hojas de menta.","Consumir en 5 días tras abrir."]'::jsonb,
    4.7, 13, true, true,
    'Garrafa 1L limón Tahití vitamina C | PH PLUS',
    'Garrafa de vidrio 1L con infusión de limón Tahití del Tolima. Vitamina C natural, sin endulzantes.'
  ),
  (
    'garrafa-jengibre-1l',
    'Garrafa 1L infusión de jengibre',
    'Garrafa jengibre 1L',
    'Energía y digestión en una sola botella',
    'Garrafa de 1 litro con jengibre fresco rallado. Apoya la digestión, da energía y refuerza las defensas.',
    '["Jengibre fresco del Quindío.","Beneficios digestivos y antiinflamatorios.","Toque levemente picante natural.","Botella reutilizable de vidrio."]'::jsonb,
    '["Jengibre fresco del Quindío","Apoya la digestión","Antiinflamatorio natural","Vidrio templado premium"]'::jsonb,
    '["1 garrafa de vidrio 1L con infusión de jengibre"]'::jsonb,
    16000, null,
    'garrafa', '1L', 'garrafas', 38, false,
    null,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"1 litro"},{"label":"Infusión","value":"Jengibre fresco"},{"label":"Sabor","value":"Levemente picante"},{"label":"Origen","value":"Quindío"}]'::jsonb,
    '["Tomar 1 vaso antes de las comidas.","No recomendado para mujeres embarazadas sin consulta médica.","Mantener refrigerado."]'::jsonb,
    4.5, 8, true, true,
    'Garrafa 1L jengibre digestión natural | PH PLUS',
    'Garrafa de vidrio 1L con infusión de jengibre fresco del Quindío. Apoya la digestión y las defensas.'
  ),
  (
    'garrafa-menta-1l',
    'Garrafa 1.5L infusión de menta',
    'Garrafa menta 1.5L',
    'Refrescante, relajante, perfecta para el verano',
    'Garrafa de 1.5 litros con hojas frescas de menta colombiana. Sabor refrescante con propiedades digestivas y relajantes.',
    '["Menta orgánica cultivada en Cundinamarca.","Efecto refrescante natural.","Apoya la digestión y reduce el estrés.","Tamaño familiar 1.5L."]'::jsonb,
    '["Menta orgánica de Cundinamarca","Sabor refrescante natural","Tamaño familiar 1.5L","Tapa hermética de bambú"]'::jsonb,
    '["1 garrafa de vidrio 1.5L con infusión de menta"]'::jsonb,
    19000, 22000,
    'garrafa', '1.5L', 'garrafas', 46, true,
    null,
    '[]'::jsonb,
    '[{"label":"Capacidad","value":"1.5 litros"},{"label":"Infusión","value":"Menta fresca"},{"label":"Origen","value":"Cundinamarca"},{"label":"Tapa","value":"Bambú natural"}]'::jsonb,
    '["Servir muy fría con hielo.","Excelente acompañante de comidas pesadas.","Reutilizar la botella con agua filtrada."]'::jsonb,
    4.8, 17, true, true,
    'Garrafa 1.5L menta fresca colombiana | PH PLUS',
    'Garrafa de vidrio 1.5L con infusión de menta orgánica de Cundinamarca. Refrescante y digestiva.'
  ),
  -- ---------------------------------------------------------------------------
  -- 3. RECARGAS EN PACK (3)
  -- ---------------------------------------------------------------------------
  (
    'pack-4-recargas',
    'Pack 4 recargas de botellón 19L',
    'Pack 4 recargas',
    'Cuatro botellones al mejor precio',
    'Cuatro recargas de botellón 19L. Ideal para hogares de 2 personas durante un mes.',
    '["4 recargas de 19 litros (76 L totales).","Precio por recarga ~15% menor que individual.","Programa la entrega cada 7 días.","Requiere botellón retornable PH PLUS."]'::jsonb,
    '["15% de descuento por volumen","Programación de entregas","Botellones retornables","Agua alcalina pH 9.0"]'::jsonb,
    '["4 botellones de 19L (sólo agua, requiere envase)"]'::jsonb,
    132000, 144000,
    'recarga', '19L', 'recargas', 75, true,
    '{"title":"AHORRA 15%","sub":"Pack mensual"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Total litros","value":"76 L"},{"label":"Recargas","value":"4"},{"label":"Ahorro","value":"~15%"},{"label":"Frecuencia sugerida","value":"Cada 7 días"}]'::jsonb,
    '["Tener al menos 1 botellón retornable disponible.","Coordinar entregas cada 7-10 días.","Lavar el dispensador entre cambios."]'::jsonb,
    4.7, 24, true, true,
    'Pack 4 recargas 19L ahorro mensual | PH PLUS',
    'Pack mensual de 4 recargas de botellón 19L con 15% de descuento. Programación de entregas en Bogotá.'
  ),
  (
    'pack-8-recargas',
    'Pack 8 recargas de botellón 19L',
    'Pack 8 recargas',
    'Dos meses de agua alcalina sin pensar',
    'Ocho recargas de botellón 19L con descuento progresivo. Perfecto para familias de 3-4 personas.',
    '["8 recargas de 19 litros (152 L totales).","Descuento del 20% frente al precio individual.","Programa hasta 2 meses de entregas.","Soporte preferente vía WhatsApp."]'::jsonb,
    '["20% de descuento por volumen","Hasta 2 meses programados","Soporte WhatsApp preferente","Cambio de botellón en cada entrega"]'::jsonb,
    '["8 botellones de 19L (sólo agua)"]'::jsonb,
    248000, 288000,
    'recarga', '19L', 'recargas', 78, true,
    '{"title":"AHORRA 20%","sub":"Pack bimestral"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Total litros","value":"152 L"},{"label":"Recargas","value":"8"},{"label":"Ahorro","value":"~20%"},{"label":"Duración estimada","value":"2 meses"}]'::jsonb,
    '["Recomendado para 3-4 personas.","Programar entregas cada 7-8 días.","Conservar botellones en lugar fresco."]'::jsonb,
    4.8, 31, true, true,
    'Pack 8 recargas 19L bimestral | PH PLUS',
    'Pack bimestral de 8 recargas de botellón 19L con 20% de descuento. Soporte preferente PH PLUS.'
  ),
  (
    'pack-12-recargas',
    'Pack 12 recargas de botellón 19L',
    'Pack 12 recargas',
    'Tres meses cubiertos al mejor precio del año',
    'Doce recargas de botellón 19L con el máximo descuento. Ideal para familias grandes u oficinas pequeñas.',
    '["12 recargas de 19 litros (228 L totales).","Descuento del 25% — el más alto del catálogo.","Programa hasta 3 meses de entregas.","Acceso a cupón exclusivo para próximas compras."]'::jsonb,
    '["25% de descuento máximo","Hasta 3 meses programados","Cupón exclusivo posventa","Cambio de botellón en cada entrega"]'::jsonb,
    '["12 botellones de 19L (sólo agua)","Cupón PHPLUS5K para tu próxima compra"]'::jsonb,
    324000, 432000,
    'recarga', '19L', 'recargas', 82, true,
    '{"title":"MEJOR PRECIO","sub":"Ahorra 25%"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Total litros","value":"228 L"},{"label":"Recargas","value":"12"},{"label":"Ahorro","value":"~25%"},{"label":"Duración estimada","value":"3 meses"}]'::jsonb,
    '["Recomendado para 4-5 personas u oficinas pequeñas.","Programar entregas semanales.","Conservar el cupón PHPLUS5K para próxima compra."]'::jsonb,
    4.9, 38, true, true,
    'Pack 12 recargas 19L trimestral | PH PLUS',
    'Pack trimestral de 12 recargas de botellón 19L con 25% de descuento y cupón exclusivo PH PLUS.'
  ),
  -- ---------------------------------------------------------------------------
  -- 4. KITS Y ACCESORIOS (5)
  -- ---------------------------------------------------------------------------
  (
    'kit-oficina-completo',
    'Kit oficina completo (dispensador + 2 botellones + vasos)',
    'Kit oficina',
    'Todo lo que tu oficina necesita para hidratarse',
    'Kit empresarial con dispensador eléctrico, 2 botellones de 19L y 20 vasos reutilizables. Listo para instalar.',
    '["Dispensador eléctrico frío/caliente con compresor silencioso.","2 botellones de 19L con agua alcalina pH 9.0.","20 vasos reutilizables de 200 ml con logo PH PLUS.","Garantía de 12 meses en dispensador."]'::jsonb,
    '["Dispensador eléctrico silencioso","Frío y caliente programable","20 vasos con logo","Garantía 12 meses"]'::jsonb,
    '["1 dispensador eléctrico","2 botellones 19L","20 vasos reutilizables","Manual + factura DIAN"]'::jsonb,
    489000, 545000,
    'kit', 'kit', 'kit', 56, true,
    '{"title":"AHORRO EMPRESARIAL","sub":"Listo para instalar"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Dispensador","value":"Eléctrico frío/caliente"},{"label":"Botellones","value":"2 x 19L"},{"label":"Vasos","value":"20 unidades"},{"label":"Garantía","value":"12 meses"}]'::jsonb,
    '["Instalación incluida en Bogotá.","Conectar a corriente 110V.","Programar mantenimiento cada 6 meses."]'::jsonb,
    4.8, 9, true, true,
    'Kit oficina dispensador + 2 botellones | PH PLUS',
    'Kit empresarial completo con dispensador eléctrico frío/caliente, 2 botellones 19L y 20 vasos. Garantía 12 meses.'
  ),
  (
    'kit-gym-deportistas',
    'Kit gym para deportistas (shaker + 4 garrafas)',
    'Kit gym',
    'Hidratación pensada para tu rutina de entrenamiento',
    'Kit deportivo con shaker de 700 ml, 4 garrafas de 1L y una toalla microfibra. Diseñado para gymers y runners.',
    '["Shaker con malla mezcladora interna.","4 garrafas de 1L con tapa deportiva.","Toalla microfibra de secado rápido.","Bolsa de transporte impermeable."]'::jsonb,
    '["Shaker con malla mezcladora","Garrafas con tapa deportiva","Toalla microfibra incluida","Bolsa impermeable"]'::jsonb,
    '["1 shaker 700ml","4 garrafas 1L","1 toalla microfibra","1 bolsa impermeable"]'::jsonb,
    72000, null,
    'kit', '1L', 'garrafas', 51, false,
    null,
    '[]'::jsonb,
    '[{"label":"Shaker","value":"700 ml con malla"},{"label":"Garrafas","value":"4 x 1L"},{"label":"Toalla","value":"Microfibra 40x80 cm"},{"label":"Bolsa","value":"Impermeable"}]'::jsonb,
    '["Lavar shaker tras cada uso.","Ideal para llevar al gym o trote matutino.","Usar agua alcalina PH PLUS para optimizar recuperación."]'::jsonb,
    4.6, 12, true, true,
    'Kit gym shaker + 4 garrafas | PH PLUS',
    'Kit deportivo PH PLUS: shaker 700ml, 4 garrafas 1L, toalla microfibra y bolsa impermeable.'
  ),
  (
    'kit-familia-mensual',
    'Kit familia mensual (dispensador + 4 recargas)',
    'Kit familia mensual',
    'Un mes completo de hidratación familiar',
    'Kit ideal para familias de 4-5 personas: dispensador manual de alta presión + 4 recargas de botellón 19L.',
    '["Dispensador manual de alta presión.","4 recargas de 19L (76 L totales).","Cobertura aproximada de 1 mes para familia de 4.","Programación de entregas incluida."]'::jsonb,
    '["Dispensador manual sin electricidad","4 recargas programadas","Cobertura mensual familiar","Sin compromiso de permanencia"]'::jsonb,
    '["1 dispensador manual","4 recargas 19L","Cronograma de entregas"]'::jsonb,
    178000, 198000,
    'kit', '19L', 'kit', 64, true,
    '{"title":"PLAN FAMILIA","sub":"30 días de agua"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Dispensador","value":"Manual de alta presión"},{"label":"Recargas","value":"4 x 19L"},{"label":"Duración","value":"~30 días"},{"label":"Personas","value":"4-5"}]'::jsonb,
    '["Lavar el dispensador semanalmente.","Programar entregas cada 7 días.","Mantener botellones en lugar fresco y oscuro."]'::jsonb,
    4.7, 16, true, true,
    'Kit familia mensual dispensador + 4 recargas | PH PLUS',
    'Kit mensual familiar con dispensador manual y 4 recargas 19L. Cobertura para 4-5 personas durante 30 días.'
  ),
  (
    'bomba-electrica-usb',
    'Bomba eléctrica USB para botellón',
    'Bomba USB',
    'Sirve agua con un botón, carga por USB',
    'Bomba eléctrica recargable por USB-C. Compatible con botellones de 5L, 10L, 15L y 19L. Hasta 30 días de uso por carga.',
    '["Carga USB-C completa en 3 horas.","Hasta 30 días de uso por carga (3-4 servidas/día).","Compatible con cualquier botellón estándar.","Silenciosa: 45 dB en operación."]'::jsonb,
    '["Recargable USB-C","Hasta 30 días por carga","Compatible 5L a 19L","Operación silenciosa"]'::jsonb,
    '["1 bomba eléctrica","Cable USB-C","Tubo extensible","Instructivo"]'::jsonb,
    48000, null,
    'kit', 'kit', 'kit', 53, false,
    null,
    '[]'::jsonb,
    '[{"label":"Carga","value":"USB-C 3h"},{"label":"Autonomía","value":"~30 días"},{"label":"Ruido","value":"45 dB"},{"label":"Compatibilidad","value":"Botellones 5L-19L"}]'::jsonb,
    '["Cargar completamente antes del primer uso.","Limpiar el tubo extensible mensualmente.","No sumergir la bomba en agua."]'::jsonb,
    4.5, 18, true, true,
    'Bomba eléctrica USB para botellón | PH PLUS',
    'Bomba recargable USB-C para botellones 5L a 19L. Hasta 30 días de uso por carga. Operación silenciosa.'
  ),
  (
    'soporte-botellon-acero',
    'Soporte de acero inoxidable para botellón',
    'Soporte acero',
    'Eleva tu botellón con estilo y estabilidad',
    'Soporte de acero inoxidable cepillado, compatible con botellones de 5L a 19L. Diseño minimalista para cocinas modernas.',
    '["Acero inoxidable 304 grado alimenticio.","Base antideslizante con tope de goma.","Soporta hasta 25 kg.","Diseño minimalista que combina con cualquier cocina."]'::jsonb,
    '["Acero inoxidable 304","Base antideslizante","Capacidad 25 kg","Diseño minimalista"]'::jsonb,
    '["1 soporte de acero","4 patas antideslizantes"]'::jsonb,
    38000, null,
    'kit', 'kit', 'kit', 41, false,
    null,
    '[]'::jsonb,
    '[{"label":"Material","value":"Acero inoxidable 304"},{"label":"Capacidad","value":"25 kg máx"},{"label":"Altura","value":"35 cm"},{"label":"Diámetro","value":"28 cm"}]'::jsonb,
    '["Ubicar sobre superficie nivelada.","Limpiar con paño húmedo y secar.","No usar productos abrasivos."]'::jsonb,
    4.4, 6, true, false,
    'Soporte acero inoxidable para botellón | PH PLUS',
    'Soporte minimalista de acero inoxidable 304 para botellones de 5L a 19L. Capacidad 25 kg.'
  ),
  -- ---------------------------------------------------------------------------
  -- 5. PROMOS DE TEMPORADA (3)
  -- ---------------------------------------------------------------------------
  (
    'promo-dia-del-padre',
    'Promo Día del Padre — Botellón Premium + dispensador',
    'Promo Día del Padre',
    'El regalo perfecto para los papás conscientes',
    'Combo de edición especial Día del Padre: 1 botellón Premium 20L tapa dorada + dispensador eléctrico + tarjeta dedicatoria.',
    '["Botellón Premium 20L con tapa dorada.","Dispensador eléctrico frío/caliente.","Empaque de regalo con cinta dorada.","Tarjeta de dedicatoria personalizable."]'::jsonb,
    '["Empaque de regalo incluido","Tarjeta personalizable","Edición limitada","Disponible hasta agotar"]'::jsonb,
    '["1 botellón Premium 20L","1 dispensador eléctrico","1 empaque regalo","1 tarjeta personalizable"]'::jsonb,
    349000, 399000,
    'promocion', 'kit', 'kit', 35, true,
    '{"title":"DÍA DEL PADRE","sub":"Edición especial"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Botellón","value":"Premium 20L dorado"},{"label":"Dispensador","value":"Eléctrico frío/caliente"},{"label":"Empaque","value":"Regalo premium"},{"label":"Vigencia","value":"Hasta junio 21"}]'::jsonb,
    '["Pedir con 5 días de anticipación para empaque personalizado.","Incluir mensaje de dedicatoria al hacer el pedido.","Promoción no acumulable con otros cupones."]'::jsonb,
    4.7, 5, true, true,
    'Promo Día del Padre botellón Premium + dispensador | PH PLUS',
    'Combo Día del Padre: botellón Premium 20L tapa dorada + dispensador eléctrico + empaque regalo personalizable.'
  ),
  (
    'promo-dia-de-la-madre',
    'Promo Día de la Madre — Garrafas infusión x4 + flores',
    'Promo Día de la Madre',
    'Hidratación con cariño para la mejor mamá',
    'Combo especial Día de la Madre: 4 garrafas con infusiones premium (pepino, limón, jengibre, menta) + arreglo floral fresco.',
    '["4 garrafas con infusiones naturales premium.","Arreglo floral fresco coordinado con artesano local.","Empaque sustentable con tarjeta de dedicatoria.","Entrega coordinada para llegar el día exacto."]'::jsonb,
    '["4 infusiones premium","Arreglo floral fresco","Empaque sustentable","Entrega en fecha solicitada"]'::jsonb,
    '["4 garrafas con infusión","1 arreglo floral","1 tarjeta personalizable","Empaque sustentable"]'::jsonb,
    159000, 189000,
    'promocion', '1L', 'garrafas', 37, true,
    '{"title":"DÍA DE LA MADRE","sub":"Con flores incluidas"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Garrafas","value":"4 infusiones"},{"label":"Flores","value":"Arreglo fresco local"},{"label":"Empaque","value":"Sustentable"},{"label":"Vigencia","value":"Hasta mayo 15"}]'::jsonb,
    '["Pedir con 3 días de anticipación.","Especificar dirección de entrega y fecha exacta.","Las flores varían según disponibilidad de temporada."]'::jsonb,
    4.9, 11, true, true,
    'Promo Día de la Madre garrafas + flores | PH PLUS',
    'Combo especial Día de la Madre: 4 garrafas con infusión premium + arreglo floral fresco con dedicatoria.'
  ),
  (
    'promo-pack-navideno',
    'Promo Pack Navideño — Kit familia + sorpresas',
    'Pack Navideño',
    'La hidratación más cálida de la temporada',
    'Pack navideño con dispensador manual, 6 recargas 19L, 2 garrafas premium y caja de chocolates artesanales colombianos.',
    '["6 recargas 19L para todo diciembre.","Dispensador manual de alta presión.","2 garrafas con infusión (menta + limón).","Caja de chocolates artesanales del Cauca."]'::jsonb,
    '["Pack navideño completo","Chocolates artesanales incluidos","Empaque festivo","Edición de temporada"]'::jsonb,
    '["1 dispensador manual","6 recargas 19L","2 garrafas infusión","1 caja chocolates artesanales"]'::jsonb,
    289000, 359000,
    'promocion', '19L', 'kit', 49, true,
    '{"title":"NAVIDAD PH PLUS","sub":"Pack festivo"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Recargas","value":"6 x 19L"},{"label":"Garrafas","value":"2 infusión premium"},{"label":"Chocolates","value":"Caja artesanal Cauca"},{"label":"Vigencia","value":"1-23 diciembre"}]'::jsonb,
    '["Pedir antes del 18 de diciembre para entrega navideña.","Empaque festivo de regalo incluido.","Promoción no acumulable con suscripciones activas."]'::jsonb,
    4.8, 7, true, true,
    'Promo Pack Navideño kit familia + chocolates | PH PLUS',
    'Pack navideño con dispensador manual, 6 recargas 19L, garrafas premium y chocolates artesanales colombianos.'
  ),
  -- ---------------------------------------------------------------------------
  -- 6. SUSCRIPCIONES (2)
  -- ---------------------------------------------------------------------------
  (
    'suscripcion-semanal',
    'Suscripción semanal — 1 botellón 19L cada 7 días',
    'Suscripción semanal',
    'Hidratación constante, cobro automático cada semana',
    'Recibe 1 botellón de 19L cada 7 días con 10% de descuento permanente. Pausa o cancela cuando quieras.',
    '["1 botellón 19L cada semana, sin pensar.","10% de descuento permanente.","Pausa o cancela desde Mi Cuenta.","Cargo automático cada lunes."]'::jsonb,
    '["10% descuento permanente","Entrega semanal automática","Pausa flexible","Sin permanencia mínima"]'::jsonb,
    '["1 botellón 19L semanal","Acceso al panel de suscripciones"]'::jsonb,
    37800, null,
    'promocion', '19L', 'recargas', 58, false,
    '{"title":"SUSCRIPCIÓN","sub":"-10% siempre"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Frecuencia","value":"Cada 7 días"},{"label":"Descuento","value":"10% permanente"},{"label":"Cobro","value":"Lunes automático"},{"label":"Permanencia","value":"Ninguna"}]'::jsonb,
    '["Activar pago automático con tarjeta o PSE.","Pausar desde Mi Cuenta antes del lunes para saltar una entrega.","Cancelación inmediata sin penalidad."]'::jsonb,
    4.7, 14, true, true,
    'Suscripción semanal botellón 19L | PH PLUS',
    'Suscripción semanal de botellón 19L con 10% de descuento permanente. Pausa o cancela cuando quieras.'
  ),
  (
    'suscripcion-trimestral',
    'Suscripción trimestral — 12 botellones programados',
    'Suscripción trimestral',
    'Tres meses cubiertos con el descuento más alto',
    'Recibe 12 botellones 19L distribuidos en 3 meses con 22% de descuento. La opción más ahorrativa del catálogo.',
    '["12 botellones 19L (228 L) distribuidos en 3 meses.","22% de descuento — la suscripción con mayor ahorro.","Frecuencia ajustable cada 7-10 días.","Cargo automático al inicio del trimestre o en 3 cuotas."]'::jsonb,
    '["22% descuento total","Frecuencia ajustable","Pago en 1 o 3 cuotas","Cancelable sin penalidad"]'::jsonb,
    '["12 botellones 19L","Acceso al panel de suscripciones","Soporte preferente"]'::jsonb,
    378000, 484000,
    'promocion', '19L', 'recargas', 53, true,
    '{"title":"MAYOR AHORRO","sub":"-22% trimestre"}'::jsonb,
    '[]'::jsonb,
    '[{"label":"Total botellones","value":"12 x 19L"},{"label":"Duración","value":"3 meses"},{"label":"Descuento","value":"22%"},{"label":"Pago","value":"1 o 3 cuotas"}]'::jsonb,
    '["Elegir frecuencia al activar la suscripción.","Pausar entregas si te vas de viaje.","Renovación automática al final del trimestre (avisamos 7 días antes)."]'::jsonb,
    4.8, 9, true, true,
    'Suscripción trimestral 12 botellones | PH PLUS',
    'Suscripción trimestral de 12 botellones 19L con 22% de descuento. La opción más ahorrativa de PH PLUS.'
  )
on conflict (slug) do nothing;


-- ────────────────────────────────────────────────────────
-- 02_reviews.sql
-- ────────────────────────────────────────────────────────
-- =============================================================================
-- PH PLUS — Seed demo: reviews (35 reseñas realistas)
-- =============================================================================
-- Idempotente: cada review usa un UUID determinístico
-- ('aaaaaaaa-aaaa-aaaa-aaaa-XXXXXXXXXXXX') + `on conflict (id) do nothing`,
-- por lo que se puede re-aplicar sin duplicar.
--
-- Distribución:
--   25 approved (variadas, rating mayormente 4-5)
--   5 pending (recientes, sin admin_response)
--   5 rejected (con rejection_reason corta)
--   3 con admin_response
--   2 con rating 3, 1 con rating 2
--   user_id repartido entre ada@ph-plus.co, linus@ph-plus.co y NULL (guests)
--   product_slug cubriendo el catálogo, con mayor peso en kit-inicial y suscripciones
--
-- Requiere que existan los productos del seed.sql original + 01_products_extra.sql.
-- =============================================================================

insert into public.reviews (
  id, product_slug, user_id, author_name, rating, title, text,
  photo, recommends, status, rejection_reason, admin_response, created_at
) values
  -- ---------------------------------------------------------------------------
  -- APPROVED (25)
  -- ---------------------------------------------------------------------------
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
    'kit-inicial-botellon-19lts',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Ana María Rodríguez',
    5, 'Excelente compra',
    'Pedí el kit inicial y llegó al día siguiente en Bogotá. El agua tiene un sabor muy suave y el botellón se siente firme. Súper recomendado para arrancar.',
    null, true, 'approved', null,
    '¡Gracias Ana María! Nos alegra que hayas tenido buena experiencia desde el primer pedido.',
    timezone('utc', now()) - interval '85 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000002',
    'kit-inicial-botellon-19lts',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Carlos Felipe Gutiérrez',
    5, 'Cumple lo que promete',
    'Llevo tres semanas con el kit y la diferencia con el agua del grifo es notoria. El servicio de entrega fue muy puntual y el repartidor súper amable.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '78 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000003',
    'suscripcion-mensual-4-botellones',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Laura Sofía Vélez',
    5, 'La mejor decisión',
    'Suscribirme me cambió la rutina. Ya no pienso en el agua, simplemente llega. El descuento del 15% también ayuda mucho a fin de mes.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '72 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000004',
    'promocion-garrafas',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Diego Alejandro Mendoza',
    5, 'Pague 3 lleve 5, increíble',
    'La promo de garrafas es buenísima. Las 5 garrafas alcanzan más de un mes en mi casa y el precio por litro queda inmejorable.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '65 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000005',
    'recargas-19lts',
    null,
    'María Camila Restrepo',
    5, 'Recargas puntuales',
    'Pedí dos recargas y llegaron en el horario acordado. El intercambio del botellón fue rapidísimo, sin contratiempos. Volveré a pedir.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '60 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000006',
    'dispensador-electrico',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Juan Sebastián Cárdenas',
    5, 'Funciona perfecto',
    'El dispensador eléctrico es silencioso y el agua sale bien fría. Lo uso en la oficina y todos quedaron felices. Bien empacado al llegar.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '58 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000007',
    'kit-19l-kids',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Valentina Ospina Hoyos',
    5, 'A mis hijos les encanta',
    'El dispensador infantil es ideal, mis dos peques de 4 y 6 años se sirven solos sin regar nada. Los vasos antiderrame son una maravilla.',
    null, true, 'approved', null,
    '¡Qué alegría leer esto Valentina! Nos encanta cuando los más pequeños se vuelven autónomos con la hidratación.',
    timezone('utc', now()) - interval '55 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000008',
    'pack-12-recargas',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Andrés Felipe Quintero',
    5, 'Tres meses tranquilo',
    'El pack de 12 recargas es la mejor relación precio-calidad. Coordinaron las entregas semanales sin que tuviera que hacer nada. Excelente.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '52 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000009',
    'botellon-20l-premium',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Daniela Andrea Pineda',
    5, 'La tapa dorada es hermosa',
    'Compré el botellón Premium para regalo y quedaron encantados. El certificado de análisis le da un toque muy profesional al producto.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '48 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000010',
    'garrafa-menta-1l',
    null,
    'Santiago Eduardo Lozano',
    5, 'Súper refrescante',
    'La infusión de menta es muy natural, se nota que las hojas son frescas. Perfecta para los días calurosos de Bogotá cuando sale el sol.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '45 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000011',
    'garrafa-limon-1l',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Mariana Isabel Cortés',
    4, 'Rica pero algo ácida',
    'El sabor del limón es muy real, eso me encantó. Solo que me resultó un poco ácida para tomarla sola, prefiero mezclarla con agua adicional.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '42 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000012',
    'kit-oficina-completo',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Roberto Javier Acosta',
    5, 'Instalación impecable',
    'Lo pedí para la oficina y el equipo de instalación fue súper profesional. Los vasos con logo son un detalle muy bonito que valoraron mucho.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '40 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000013',
    'pack-8-recargas',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Isabella Martínez Ríos',
    5, 'Dos meses sin pensar',
    'El pack bimestral me alcanza perfecto para mi familia de 3. Pedimos por WhatsApp y la atención preferente realmente se nota.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '38 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000014',
    'bomba-electrica-usb',
    null,
    'Felipe Antonio Henao',
    4, 'Muy práctica',
    'La bomba USB es comodísima, ya no me peleo con la manual. Le quito una estrella porque el cable USB-C es un poco corto, pero funciona perfecto.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '35 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000015',
    'kit-familia-mensual',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Catalina Andrea Bermúdez',
    5, 'Ideal para mi familia',
    'Somos cuatro en casa y el plan mensual nos cubre justo. El dispensador manual funciona perfecto y no necesita corriente, lo cual es un plus.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '32 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000016',
    'suscripcion-trimestral',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Nicolás Esteban Páez',
    5, 'El mejor ahorro del año',
    'Pagué el trimestre completo y el descuento del 22% se sintió fuerte. Las entregas vienen como reloj, cada lunes puntuales sin falta.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '30 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000017',
    'garrafa-pepino-1l',
    null,
    'Paula Andrea Suárez',
    5, 'Detox real',
    'La infusión de pepino es muy suave y limpia. La tomo en la mañana en ayunas y me siento mucho más liviana durante el día. Recomendadísima.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '28 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000018',
    'garrafa-jengibre-1l',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Tomás Esteban Vargas',
    4, 'Buen sabor a jengibre',
    'Se nota que usan jengibre real, no esencia. El picor es leve y agradable. Solo me hubiera gustado un toque de miel para suavizarlo más.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '25 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000019',
    'botellon-19lts',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Lucía Fernanda Cano',
    5, 'Cumplen sin falla',
    'Llevo cuatro pedidos del botellón clásico y siempre llega impecable y en hora. La calidad del agua es consistente, sin variaciones de sabor.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '22 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000020',
    'kit-gym-deportistas',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Esteban Mauricio Riaño',
    5, 'Perfecto para mi rutina',
    'El shaker funciona muy bien, no se hacen grumos con la proteína. Las garrafas también son resistentes, ya las he llevado a varios entrenamientos.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '20 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000021',
    'promo-pack-navideno',
    null,
    'Camila Valentina Soto',
    5, 'Regalo navideño espectacular',
    'Lo pedí para mi mamá en diciembre y los chocolates artesanales fueron un golazo. Llegó con empaque festivo precioso y tarjeta personalizada.',
    null, true, 'approved', null,
    '¡Mil gracias Camila! Nos encanta saber que el detalle navideño llegó con tanto cariño.',
    timezone('utc', now()) - interval '18 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000022',
    'pack-4-recargas',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Sebastián Camilo Tovar',
    4, 'Buen pack mensual',
    'Es la opción ideal para empezar a programar entregas sin comprometerse demasiado. El 15% de descuento se agradece bastante mes a mes.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '15 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000023',
    'suscripcion-semanal',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Mariangel Ortiz Vélez',
    5, 'Perfecta para una persona',
    'Vivo sola y un botellón semanal me alcanza justo. La pausa flexible me salvó cuando me fui de viaje, no tuve que cancelar nada.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '12 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000024',
    'botellon-15l-empresarial',
    null,
    'Hernán Darío Patiño',
    5, 'Para mi oficina pequeña',
    'Somos 6 en la oficina y el botellón de 15L nos rinde una semana exacta. La facturación electrónica llega rápido y sin problemas para deducir.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '10 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000025',
    'recarga-19lts-individual',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Adriana Lorena Mosquera',
    5, 'Rápida y sin compromiso',
    'A veces solo necesito una recarga puntual y siempre llega el mismo día si pido antes de las 11am. Excelente servicio express en Bogotá.',
    null, true, 'approved', null, null,
    timezone('utc', now()) - interval '8 days'
  ),
  -- ---------------------------------------------------------------------------
  -- PENDING (5) — recientes, sin admin_response
  -- ---------------------------------------------------------------------------
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000026',
    'garrafa-1l-pack6',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Manuela Gómez Aristizábal',
    4, 'Garrafas resistentes',
    'Las llevo al gym y han aguantado bastante. Mi única queja es que la tapa a veces gotea un poco si no la cierro perfectamente, pero por lo demás bien.',
    null, true, 'pending', null, null,
    timezone('utc', now()) - interval '5 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000027',
    'botellon-5l',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Óscar Iván Bedoya',
    5, 'Tamaño práctico',
    'Perfecto para llevar de paseo o tener en la nevera sin que ocupe demasiado. La manija es cómoda y resistente, no se siente endeble para nada.',
    null, true, 'pending', null, null,
    timezone('utc', now()) - interval '4 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000028',
    'promo-dia-de-la-madre',
    null,
    'Juliana Patricia Escobar',
    5, 'Mi mamá quedó encantada',
    'Las garrafas con infusión y el arreglo floral combinaron perfecto. Llegó el día exacto que pedí y la tarjeta personalizada fue el toque final.',
    null, true, 'pending', null, null,
    timezone('utc', now()) - interval '3 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000029',
    'botellon-10l',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'David Mauricio Rincón',
    4, 'Buen tamaño intermedio',
    'El 10L es justo lo que necesitaba para mi apartamento, ni tan grande ni tan chico. El asa ergonómica realmente facilita cargarlo a diario.',
    null, true, 'pending', null, null,
    timezone('utc', now()) - interval '2 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000030',
    'soporte-botellon-acero',
    (select id from public.profiles where email = 'linus@ph-plus.co'),
    'Carolina Andrea Pulido',
    5, 'Combina con todo',
    'El soporte queda muy bonito en mi cocina, se ve muy elegante. El acero es de buena calidad y la base antideslizante mantiene todo súper firme.',
    null, true, 'pending', null, null,
    timezone('utc', now()) - interval '1 days'
  ),
  -- ---------------------------------------------------------------------------
  -- REJECTED (5)
  -- ---------------------------------------------------------------------------
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000031',
    'kit-inicial-botellon-19lts',
    null,
    'Anónimo Sospechoso',
    1, 'PRODUCTO HORRIBLE',
    'COMPREN MEJOR EN AGUAMARKETXYZ DOT COM ES MUCHO MEJOR Y MAS BARATO CONTACTEN POR WHATSAPP 555-0000',
    null, false, 'rejected', 'Spam', null,
    timezone('utc', now()) - interval '20 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000032',
    'promocion-garrafas',
    null,
    'Usuario Molesto',
    1, 'Lo peor',
    'Esta empresa es una porquería completa y todos los que trabajan ahí son unos *********** que no saben hacer nada bien, terrible servicio.',
    null, false, 'rejected', 'Contenido inapropiado', null,
    timezone('utc', now()) - interval '17 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000033',
    'dispensador-electrico',
    null,
    'Comentario Off Topic',
    3, 'Sobre otro producto',
    'En realidad estoy hablando del filtro que compré en otra tienda, no de este dispensador. Me equivoqué de página al escribir la reseña.',
    null, false, 'rejected', 'No corresponde al producto', null,
    timezone('utc', now()) - interval '14 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000034',
    'botellon-19l-sabor-frutal',
    null,
    'Reseña Duplicada',
    5, 'Buen producto',
    'Buen producto buen producto buen producto buen producto buen producto buen producto buen producto buen producto.',
    null, true, 'rejected', 'Spam', null,
    timezone('utc', now()) - interval '11 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000035',
    'suscripcion-mensual-4-botellones',
    null,
    'Promoción Externa',
    5, 'Mejor opción',
    'Hola amigos visiten mi canal de youtube para ver review de productos similares mas baratos suscribanse y denle like al video.',
    null, true, 'rejected', 'Spam', null,
    timezone('utc', now()) - interval '9 days'
  ),
  -- ---------------------------------------------------------------------------
  -- EXTRA: rating bajo aprobado (mixed/negative feedback con admin_response)
  -- ---------------------------------------------------------------------------
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000036',
    'recargas-19lts',
    (select id from public.profiles where email = 'ada@ph-plus.co'),
    'Gabriel Andrés Morales',
    3, 'Llegó tarde pero bien',
    'El agua está perfecta como siempre, pero la entrega se retrasó dos días sin avisarme. Cuando llamé al soporte me ayudaron rápido a coordinar.',
    null, true, 'approved', null,
    'Hola Gabriel, lamentamos el retraso. Coordinamos con logística para que no vuelva a pasar y te dejamos un cupón en tu cuenta.',
    timezone('utc', now()) - interval '50 days'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000037',
    'botellon-19lts',
    null,
    'Verónica Lucía Mejía',
    2, 'Botellón llegó rajado',
    'El botellón llegó con una fisura pequeña en la base y empezó a gotear a las pocas horas. Tuve que llamar para que lo reemplazaran al día siguiente.',
    null, false, 'approved', null,
    'Verónica, lamentamos muchísimo lo sucedido. Ya identificamos el lote afectado y te contactamos por WhatsApp para reponer y compensar.',
    timezone('utc', now()) - interval '47 days'
  )
on conflict (id) do nothing;


-- ────────────────────────────────────────────────────────
-- 03_addresses.sql
-- ────────────────────────────────────────────────────────
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


-- ────────────────────────────────────────────────────────
-- 04_orders.sql
-- ────────────────────────────────────────────────────────
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


-- ────────────────────────────────────────────────────────
-- 05_order_lines_and_notes.sql
-- ────────────────────────────────────────────────────────
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


-- ────────────────────────────────────────────────────────
-- 06_stock_movements.sql
-- ────────────────────────────────────────────────────────
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


-- ────────────────────────────────────────────────────────
-- 07_outbox_emails.sql
-- ────────────────────────────────────────────────────────
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


-- ────────────────────────────────────────────────────────
-- 08_coupons_extra.sql
-- ────────────────────────────────────────────────────────
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

