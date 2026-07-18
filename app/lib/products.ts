export type ProductVisualKey = "kit" | "garrafas" | "recargas";

export type ProductCategory =
  | "botellon"
  | "garrafa"
  | "recarga"
  | "kit"
  | "promocion";

export type ProductSize = "1L" | "1.5L" | "5L" | "19L" | "kit";

export type GalleryImage = {
  visualKey: ProductVisualKey;
  bg: string;
  caption: string;
  /** URL de foto real (subida desde el admin). Si está, se muestra en lugar
   *  de la ilustración `visualKey`. */
  src?: string;
};

export type SpecRow = { label: string; value: string };

export type Review = {
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type Product = {
  slug: string;
  visualKey: ProductVisualKey;
  title: string;
  shortTitle: string;
  price: string;
  priceValue: number;
  prevPrice?: string;
  prevPriceValue?: number;
  highlight?: boolean;
  badge?: { title: string; sub: string };
  tagline: string;
  description: string;
  longDescription: string[];
  features: string[];
  includes: string[];
  category: ProductCategory;
  size: ProductSize;
  popularity: number;
  inStock?: boolean;
  gallery: GalleryImage[];
  specs: SpecRow[];
  usage: string[];
  reviews: Review[];
  rating: { average: number; count: number };
};

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  botellon: "Botellones",
  garrafa: "Garrafas",
  recarga: "Recargas",
  kit: "Kits y dispensadores",
  promocion: "Promociones",
};

export const SIZE_LABEL: Record<ProductSize, string> = {
  "1L": "1 litro",
  "1.5L": "1,5 litros",
  "5L": "5 litros",
  "19L": "19 litros",
  kit: "Kit / Accesorio",
};

const COMMON_SPECS: SpecRow[] = [
  { label: "pH del agua", value: "9.0 ± 0.3 (alcalina)" },
  { label: "Origen", value: "Manantial Cundinamarca" },
  { label: "Tratamiento", value: "14 procesos de filtración" },
  { label: "Certificación", value: "INVIMA RSA 0030646-2024" },
  { label: "Conservación", value: "Lugar fresco, lejos del sol directo" },
];

const COMMON_USAGE = [
  "Conserva el producto en un lugar fresco y seco, lejos de la luz directa.",
  "Una vez abierto, refrigéralo y consúmelo idealmente en menos de 7 días.",
  "Lava el dispensador/recipiente con agua limpia antes del primer uso.",
];

const COMMON_REVIEWS: Review[] = [
  {
    author: "María Fernanda R.",
    rating: 5,
    date: "Hace 2 semanas",
    text: "Llevo varios meses con PH PLUS y noto que me hidrato mejor durante el día. La entrega es muy puntual y el equipo es súper amable.",
  },
  {
    author: "Carlos A.",
    rating: 5,
    date: "Hace 1 mes",
    text: "Excelente calidad, sabe muy suave. Lo recomiendo para toda la familia, sobre todo si entrenan.",
  },
  {
    author: "Diana M.",
    rating: 4,
    date: "Hace 1 mes",
    text: "Buen producto y buen servicio. A veces se demoran un poco más de lo esperado en zonas alejadas pero siempre cumplen.",
  },
];

function makeGallery(visualKey: ProductVisualKey): GalleryImage[] {
  return [
    { visualKey, bg: "#f4f6fb", caption: "Vista principal" },
    { visualKey, bg: "#eef0ff", caption: "Vista lateral" },
    { visualKey, bg: "#e8f4fb", caption: "Detalle" },
    { visualKey, bg: "#fafbfd", caption: "En contexto" },
  ];
}

type ListingProductInput = {
  slug: string;
  title: string;
  priceValue: number;
  visualKey: ProductVisualKey;
  size: ProductSize;
  prevPriceValue?: number;
};

function makeListingProduct(input: ListingProductInput): Product {
  return {
    slug: input.slug,
    visualKey: input.visualKey,
    title: input.title,
    shortTitle: input.title,
    price: formatCOP(input.priceValue),
    priceValue: input.priceValue,
    prevPrice: input.prevPriceValue
      ? formatCOP(input.prevPriceValue)
      : undefined,
    prevPriceValue: input.prevPriceValue,
    tagline: "Hidratación PH PLUS para todos los días",
    description: `${input.title}, disponible para compra directa y entrega a domicilio.`,
    longDescription: [
      `${input.title} con agua PH PLUS alcalina y filtrada, lista para disfrutar.`,
    ],
    features: [
      "Agua alcalina PH 9",
      "14 procesos de filtración",
      "Envase libre de BPA",
    ],
    includes: [input.title],
    category: "garrafa",
    size: input.size,
    popularity: 50,
    inStock: true,
    gallery: makeGallery(input.visualKey),
    specs: COMMON_SPECS,
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.8, count: 24 },
  };
}

export const PRODUCTS: Product[] = [
  {
    slug: "kit-inicial-botellon-19lts",
    visualKey: "kit",
    title: "Kit inicial de botellón 19 lts",
    shortTitle: "Kit inicial de\nbotellón 19 lts",
    price: "$85.000",
    priceValue: 85000,
    tagline: "Empieza a hidratarte mejor desde el primer día",
    description:
      "Kit completo con botellón de 19 litros más dispensador manual. Ideal para hogares y oficinas que quieren empezar con PH PLUS. Agua alcalina PH 9, lista para servir.",
    longDescription: [
      "El Kit inicial PH PLUS es la forma más cómoda de empezar a tomar agua alcalina en casa. Incluye un botellón de 19 litros sellado y un dispensador manual de presión, listos para usar desde el primer minuto.",
      "Nuestra agua pasa por 14 procesos de filtración que la enriquecen con calcio y magnesio, manteniendo un pH estable de 9.0 para ayudarte a equilibrar tu cuerpo, mejorar la digestión y favorecer tu rendimiento durante el día.",
      "Todos los envases son retornables y libres de BPA. Al pedir tu próxima recarga, recogemos el botellón vacío para reutilizarlo.",
    ],
    features: [
      "Agua alcalina PH 9",
      "Libre de BPA",
      "Calcio y magnesio para tu bienestar",
      "Dispensador manual incluido",
    ],
    includes: [
      "1 botellón de 19 litros",
      "1 dispensador manual",
      "Guía de uso y mantenimiento",
    ],
    category: "kit",
    size: "19L",
    popularity: 95,
    inStock: true,
    gallery: makeGallery("kit"),
    specs: [
      { label: "Contenido", value: "19 litros + dispensador" },
      { label: "Material del envase", value: "PET grado alimenticio, libre de BPA" },
      { label: "Compatibilidad", value: "Cualquier dispensador estándar" },
      ...COMMON_SPECS,
    ],
    usage: [
      "Retira el sello del botellón y voltea con cuidado sobre el dispensador.",
      "Acciona la bomba manual unas veces para purgar el aire.",
      "Sirve y disfruta. Reemplaza la recarga cuando se acabe.",
      ...COMMON_USAGE,
    ],
    reviews: COMMON_REVIEWS,
    rating: { average: 4.8, count: 124 },
  },
  {
    slug: "promocion-garrafas",
    visualKey: "garrafas",
    title: "Promoción Garrafas — ¡Pague 3, lleve 5!",
    shortTitle: "",
    price: "$73.470",
    priceValue: 73470,
    prevPrice: "$122.450",
    prevPriceValue: 122450,
    highlight: true,
    badge: { title: "PROMOCIÓN GARRAFAS", sub: "¡Pague 3, lleve 5!" },
    tagline: "El plan más conveniente para mantener tu casa siempre hidratada",
    description:
      "Pagas 3 garrafas de PH PLUS y te llevas 5. Perfecto para familias que disfrutan agua alcalina todos los días, sin tener que pedir recargas tan seguido.",
    longDescription: [
      "Con esta promoción consigues 5 garrafas selladas pagando solo 3. Un ahorro de más del 35% frente al precio individual, ideal para tener reservas en casa, en la oficina o para llevar al gimnasio.",
      "Cada garrafa contiene agua PH PLUS con un pH estable de 9.0, embotellada el mismo día del despacho. El sellado garantiza la frescura hasta el momento de abrir.",
      "Promoción por tiempo limitado. Sujeta a disponibilidad de inventario.",
    ],
    features: [
      "5 garrafas selladas",
      "PH 9 estable en cada garrafa",
      "Ahorro de más del 35%",
      "Disponible por tiempo limitado",
    ],
    includes: ["5 garrafas PH PLUS", "Envío incluido en zonas habilitadas"],
    category: "promocion",
    size: "1.5L",
    popularity: 90,
    inStock: true,
    gallery: makeGallery("garrafas"),
    specs: [
      { label: "Cantidad", value: "5 garrafas" },
      { label: "Tamaño individual", value: "1,5 litros" },
      { label: "Total de agua", value: "7,5 litros" },
      ...COMMON_SPECS,
    ],
    usage: [
      "Conserva las garrafas selladas en lugar fresco.",
      "Una vez abierta, mantén la garrafa refrigerada y consúmela en máximo 7 días.",
      ...COMMON_USAGE,
    ],
    reviews: COMMON_REVIEWS,
    rating: { average: 4.7, count: 89 },
  },
  {
    slug: "recargas-19lts",
    visualKey: "recargas",
    title: "2 recargas de botellón 19 lts",
    shortTitle: "2 recargas\ncada una de 19 lts",
    price: "$69.000",
    priceValue: 69000,
    tagline: "Mantén tu dispensador siempre lleno",
    description:
      "Dos recargas de 19 litros para clientes que ya tienen su botellón. Programación de entrega rápida en tu zona.",
    longDescription: [
      "Diseñado para clientes que ya cuentan con un botellón y solo necesitan reponer su agua. Recibirás dos botellones de 19 litros sellados con agua alcalina PH 9.",
      "Al momento de entregar las recargas, nuestro equipo recoge sin costo los botellones vacíos. Así contribuyes a reutilizar y reducir residuos plásticos.",
      "Si quieres asegurar recepción periódica, puedes pasarte a la suscripción mensual con descuento adicional.",
    ],
    features: [
      "2 botellones de 19 litros",
      "Agua alcalina PH 9",
      "Envío a domicilio",
      "Programa recurrente disponible",
    ],
    includes: ["2 recargas de 19 litros", "Recolección de botellón vacío"],
    category: "recarga",
    size: "19L",
    popularity: 80,
    inStock: true,
    gallery: makeGallery("recargas"),
    specs: [
      { label: "Cantidad", value: "2 botellones de 19 L" },
      { label: "Total de agua", value: "38 litros" },
      ...COMMON_SPECS,
    ],
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.9, count: 156 },
  },
  {
    slug: "recarga-19lts-individual",
    visualKey: "recargas",
    title: "1 recarga de 19 lts",
    shortTitle: "1 recarga de 19 lts",
    price: "$50.000",
    priceValue: 50000,
    tagline: "Una recarga cuando la necesites",
    description:
      "Recarga individual de 19 litros para reponer tu botellón. Ideal para hogares pequeños o pedidos puntuales.",
    longDescription: [
      "Pide una sola recarga cuando la necesites, sin compromisos. Llega sellada el mismo día en zona urbana de Bogotá.",
      "Nos llevamos el botellón vacío sin costo adicional al momento de entregar el nuevo.",
    ],
    features: [
      "1 recarga de 19 litros",
      "Agua alcalina PH 9",
      "Entrega en menos de 24 h",
      "Sin compromiso de suscripción",
    ],
    includes: ["1 botellón sellado 19 lts", "Recolección del vacío"],
    category: "recarga",
    size: "19L",
    popularity: 70,
    inStock: true,
    gallery: makeGallery("recargas"),
    specs: [
      { label: "Contenido", value: "19 litros" },
      { label: "Tipo", value: "Recarga retornable" },
      ...COMMON_SPECS,
    ],
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.7, count: 64 },
  },
  {
    slug: "botellon-19lts",
    visualKey: "kit",
    title: "Botellón 19 lts (solo envase + agua)",
    shortTitle: "Botellón 19 lts",
    price: "$42.000",
    priceValue: 42000,
    tagline: "El clásico de PH PLUS para tu dispensador",
    description:
      "Botellón retornable de 19 litros con agua alcalina PH 9. Para clientes que ya tienen dispensador en casa u oficina.",
    longDescription: [
      "Botellón sellado de 19 litros, listo para tu dispensador. Diseñado para soportar el uso continuo en casa u oficina.",
      "Forma parte de nuestro programa retornable: cuando pidas tu próxima recarga, recogemos sin costo el envase vacío.",
    ],
    features: [
      "Envase reutilizable y certificado",
      "Agua alcalina PH 9",
      "Libre de BPA",
      "Sellado al vacío",
    ],
    includes: ["1 botellón de 19 litros sellado"],
    category: "botellon",
    size: "19L",
    popularity: 65,
    inStock: true,
    gallery: makeGallery("kit"),
    specs: [
      { label: "Contenido", value: "19 litros" },
      { label: "Material", value: "Policarbonato retornable" },
      ...COMMON_SPECS,
    ],
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.6, count: 42 },
  },
  {
    slug: "garrafa-1l-pack6",
    visualKey: "garrafas",
    title: "Pack 6 garrafas de 1 litro",
    shortTitle: "Pack 6 × 1 L",
    price: "$24.000",
    priceValue: 24000,
    tagline: "Perfectas para llevar al gym, la oficina o la universidad",
    description:
      "Seis garrafas individuales de 1 litro, cómodas de transportar. Ideales para mantenerte hidratado fuera de casa.",
    longDescription: [
      "Diseñadas para quienes están en movimiento: van al gimnasio, oficina, universidad o entrenamientos al aire libre.",
      "Cada garrafa de 1 litro mantiene el sello hermético hasta abrirla, garantizando frescura. Material reciclable, libre de BPA.",
    ],
    features: [
      "6 garrafas de 1 litro",
      "Tapa hermética",
      "Agua alcalina PH 9",
      "Material reciclable",
    ],
    includes: ["6 garrafas PH PLUS de 1 litro"],
    category: "garrafa",
    size: "1L",
    popularity: 55,
    inStock: true,
    gallery: makeGallery("garrafas"),
    specs: [
      { label: "Cantidad", value: "6 garrafas" },
      { label: "Tamaño", value: "1 litro c/u" },
      { label: "Total", value: "6 litros" },
      ...COMMON_SPECS,
    ],
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.7, count: 38 },
  },
  {
    slug: "garrafa-1-5l-pack6",
    visualKey: "garrafas",
    title: "Pack 6 garrafas de 1,5 litros",
    shortTitle: "Pack 6 × 1,5 L",
    price: "$32.000",
    priceValue: 32000,
    tagline: "Más agua, mismo precio cómodo",
    description:
      "Seis garrafas de 1,5 litros para el día a día. La presentación favorita de quienes necesitan más hidratación.",
    longDescription: [
      "Pack ideal para quienes consumen 2 litros o más al día. Cada garrafa de 1,5 litros viene sellada y lista para guardar en la nevera.",
      "Diseño compacto pensado para caber en cualquier mochila o cooler.",
    ],
    features: [
      "6 garrafas de 1,5 litros",
      "Agua alcalina PH 9",
      "Tapa de seguridad",
      "Etiqueta minimalista",
    ],
    includes: ["6 garrafas PH PLUS de 1,5 litros"],
    category: "garrafa",
    size: "1.5L",
    popularity: 60,
    inStock: true,
    gallery: makeGallery("garrafas"),
    specs: [
      { label: "Cantidad", value: "6 garrafas" },
      { label: "Tamaño", value: "1,5 litros c/u" },
      { label: "Total", value: "9 litros" },
      ...COMMON_SPECS,
    ],
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.8, count: 47 },
  },
  {
    slug: "botellon-5l",
    visualKey: "kit",
    title: "Botellón 5 litros",
    shortTitle: "Botellón 5 L",
    price: "$12.000",
    priceValue: 12000,
    tagline: "El tamaño ideal para neveras y picnics",
    description:
      "Botellón de 5 litros, fácil de almacenar en la nevera o llevar a paseos. Listo para servir.",
    longDescription: [
      "El formato 5 litros es perfecto cuando no necesitas un botellón grande pero quieres tener PH PLUS siempre a mano.",
      "Lleva el agua a paseos, almuerzos familiares o tenla en la nevera del trabajo. Su asa integrada facilita el transporte.",
    ],
    features: [
      "Envase de 5 litros",
      "Tapa con asa",
      "Agua alcalina PH 9",
      "Caja troquelada para llevar",
    ],
    includes: ["1 botellón sellado de 5 litros"],
    category: "botellon",
    size: "5L",
    popularity: 50,
    inStock: true,
    gallery: makeGallery("kit"),
    specs: [
      { label: "Contenido", value: "5 litros" },
      { label: "Asa", value: "Integrada en el envase" },
      ...COMMON_SPECS,
    ],
    usage: COMMON_USAGE,
    reviews: COMMON_REVIEWS,
    rating: { average: 4.6, count: 29 },
  },
  {
    slug: "dispensador-manual",
    visualKey: "kit",
    title: "Dispensador manual para botellón",
    shortTitle: "Dispensador manual",
    price: "$35.000",
    priceValue: 35000,
    tagline: "Sirve tu agua sin esfuerzo",
    description:
      "Dispensador manual con bomba de presión, compatible con cualquier botellón de 19 litros. No requiere electricidad.",
    longDescription: [
      "Dispensador con bomba de presión manual. No requiere electricidad, así que puedes usarlo en cualquier rincón de tu casa u oficina.",
      "Tubo sumergible flexible, compatible con botellones estándar de 19 litros del mercado. Materiales libres de BPA.",
    ],
    features: [
      "Bomba de presión manual",
      "Compatible con botellones estándar",
      "Sin electricidad",
      "Materiales libres de BPA",
    ],
    includes: ["1 dispensador manual", "Manual de instalación"],
    category: "kit",
    size: "kit",
    popularity: 45,
    inStock: true,
    gallery: makeGallery("kit"),
    specs: [
      { label: "Tipo", value: "Bomba manual de presión" },
      { label: "Materiales", value: "Plásticos libres de BPA" },
      { label: "Compatibilidad", value: "Botellones 19 L estándar" },
    ],
    usage: [
      "Inserta el tubo sumergible dentro del botellón sellado.",
      "Aprieta firmemente la rosca o el seguro al cuello del botellón.",
      "Acciona la bomba para purgar el aire y empezar a servir.",
    ],
    reviews: COMMON_REVIEWS,
    rating: { average: 4.5, count: 31 },
  },
  {
    slug: "dispensador-electrico",
    visualKey: "kit",
    title: "Dispensador eléctrico frío / caliente",
    shortTitle: "Dispensador eléctrico",
    price: "$280.000",
    priceValue: 280000,
    tagline: "Agua a la temperatura ideal en cualquier momento",
    description:
      "Dispensador eléctrico con doble grifería para agua fría y caliente. Diseño moderno, compatible con botellones de 19 litros.",
    longDescription: [
      "Dispensador eléctrico premium con doble grifería: agua fría hasta 8°C y agua caliente hasta 90°C, ideal para té o café instantáneo.",
      "Diseño compacto en blanco mate, encaja en cocinas y oficinas modernas. Garantía oficial de 12 meses.",
    ],
    features: [
      "Agua fría y caliente",
      "Compatible con botellones de 19 L",
      "Indicadores LED",
      "Garantía de 12 meses",
    ],
    includes: ["1 dispensador eléctrico", "Cable de alimentación", "Manual"],
    category: "kit",
    size: "kit",
    popularity: 40,
    inStock: true,
    gallery: makeGallery("kit"),
    specs: [
      { label: "Voltaje", value: "110 V — 60 Hz" },
      { label: "Potencia frío", value: "70 W" },
      { label: "Potencia calor", value: "420 W" },
      { label: "Capacidad", value: "Botellones 19 L estándar" },
      { label: "Garantía", value: "12 meses" },
    ],
    usage: [
      "Conecta a un tomacorriente con polo a tierra.",
      "Coloca el botellón boca abajo sobre el receptáculo superior.",
      "Espera 10 minutos antes del primer uso para que la temperatura se estabilice.",
    ],
    reviews: COMMON_REVIEWS,
    rating: { average: 4.6, count: 22 },
  },
  {
    slug: "suscripcion-mensual-4-botellones",
    visualKey: "recargas",
    title: "Suscripción mensual — 4 botellones de 19 L",
    shortTitle: "Suscripción mensual",
    price: "$148.000",
    priceValue: 148000,
    prevPrice: "$168.000",
    prevPriceValue: 168000,
    highlight: false,
    tagline: "Cuatro botellones al mes, hidratación sin pensar",
    description:
      "Recibe automáticamente 4 botellones de 19 litros cada mes en tu casa u oficina. Cancela cuando quieras.",
    longDescription: [
      "El plan favorito de familias y oficinas: cuatro botellones de 19 litros al mes con entrega programada. Te ahorras llamadas, pedidos y olvidos.",
      "Recogemos los envases vacíos en cada entrega. Si necesitas más o menos botellones algún mes, puedes ajustarlo desde WhatsApp.",
      "Cancela cuando quieras, sin penalización ni cláusula de permanencia.",
    ],
    features: [
      "4 botellones cada mes",
      "Ahorro frente a precio individual",
      "Entrega programada",
      "Sin cláusula de permanencia",
    ],
    includes: ["4 recargas mensuales", "Soporte prioritario"],
    category: "promocion",
    size: "19L",
    popularity: 75,
    inStock: true,
    gallery: makeGallery("recargas"),
    specs: [
      { label: "Frecuencia", value: "Mensual (4 botellones)" },
      { label: "Total agua", value: "76 litros al mes" },
      { label: "Permanencia", value: "Ninguna, cancela cuando quieras" },
      ...COMMON_SPECS,
    ],
    usage: [
      "Define la fecha preferida de entrega al activar la suscripción.",
      "Recogemos los envases vacíos en cada entrega siguiente.",
      "Ajusta cantidades o pausa el plan desde WhatsApp.",
    ],
    reviews: COMMON_REVIEWS,
    rating: { average: 4.9, count: 51 },
  },
  makeListingProduct({
    slug: "agua-ph-plus-kids-300ml-x24",
    title: "Agua PH PLUS KIDS 300 ml x 24 ud",
    priceValue: 57_600,
    visualKey: "garrafas",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-300ml-x24",
    title: "Agua PH PLUS 300 ml x 24 ud",
    priceValue: 57_600,
    visualKey: "garrafas",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-sport-500ml-x12",
    title: "Agua PH PLUS Sport 500 ml x 12 ud",
    priceValue: 50_160,
    visualKey: "kit",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-500ml-x12",
    title: "Agua PH PLUS 500 ml x 12 ud",
    priceValue: 48_480,
    visualKey: "kit",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-fit-1l-x6",
    title: "Agua PH PLUS FIT 1 L x 6 ud",
    priceValue: 35_376,
    prevPriceValue: 44_220,
    visualKey: "garrafas",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-1l-x6",
    title: "Agua PH PLUS 1 L x 6 ud",
    priceValue: 50_160,
    visualKey: "kit",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-5l-x1",
    title: "Agua PH PLUS 5 L x 1 ud",
    priceValue: 24_490,
    visualKey: "kit",
    size: "5L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-vidrio-280ml-x24",
    title: "Agua PH PLUS vidrio 280 ml x 24 ud",
    priceValue: 108_000,
    visualKey: "kit",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-vidrio-477ml-x24",
    title: "Agua PH PLUS vidrio 477 ml x 24 ud",
    priceValue: 132_000,
    visualKey: "kit",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-hierbabuena-500ml-x12",
    title: "Agua PH PLUS hierbabuena 500 ml x 12 ud",
    priceValue: 63_600,
    visualKey: "garrafas",
    size: "1L",
  }),
  makeListingProduct({
    slug: "agua-ph-plus-limonaria-500ml-x12",
    title: "Agua PH PLUS limonaria 500 ml x 12 ud",
    priceValue: 63_600,
    visualKey: "garrafas",
    size: "1L",
  }),
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatCOP(value: number): string {
  return `$${value.toLocaleString("es-CO")}`;
}
