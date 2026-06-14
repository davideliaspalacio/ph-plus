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
