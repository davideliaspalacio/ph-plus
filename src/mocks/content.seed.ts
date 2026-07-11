/**
 * Seed inicial de contenido editable de storefront (FUNCTIONAL-SPEC §24).
 *
 * Cubre lo que se administra desde `/admin/contenido/*`: hero del home,
 * productos destacados, banners y FAQ. Los `featuredSlugs` referencian
 * productos reales de `app/lib/products.ts`.
 *
 * Aligns with `features/admin/content` (cuando se cree).
 */

export type SeedHomeHero = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export type SeedBanner = {
  id: string;
  title: string;
  /** Ruta del asset o URL. Mock: paths bajo `/public`. */
  image: string;
  href: string;
};

export type SeedFaqEntry = {
  q: string;
  a: string;
};

export type SeedContent = {
  homeHero: SeedHomeHero;
  featuredSlugs: string[];
  banners: SeedBanner[];
  faq: SeedFaqEntry[];
};

export const CONTENT_SEED: SeedContent = {
  homeHero: {
    title: "Hidratación alcalina, directo a tu puerta",
    subtitle:
      "Agua PH 9 con 14 procesos de filtración. Entrega a domicilio en Bogotá y zonas aledañas.",
    ctaLabel: "Comprar ahora",
    ctaHref: "/productos",
  },
  featuredSlugs: [
    "kit-inicial-botellon-19lts",
    "promocion-garrafas",
    "suscripcion-mensual-4-botellones",
  ],
  banners: [
    {
      id: "ban_promo_garrafas",
      title: "Pague 3, lleve 5 garrafas",
      image: "/banners/promo-garrafas.svg",
      href: "/productos",
    },
    {
      id: "ban_suscripcion",
      title: "Suscripción mensual: ahorra y olvídate de pedir",
      image: "/banners/suscripcion.svg",
      href: "/productos",
    },
    {
      id: "ban_kit_inicial",
      title: "Kit inicial: botellón + dispensador, listo para usar",
      image: "/banners/kit-inicial.svg",
      href: "/productos",
    },
  ],
  faq: [
    {
      q: "¿Qué hace especial al agua PH PLUS?",
      a: "Es agua alcalina con pH 9.0 ± 0.3, enriquecida con calcio y magnesio. Pasa por 14 procesos de filtración y mantiene su estabilidad gracias a un envasado el mismo día del despacho.",
    },
    {
      q: "¿En qué zonas hacen entrega?",
      a: "Cubrimos toda Bogotá urbana y municipios aledaños (Chía, Cota, Funza, La Calera, Soacha). Para otras ciudades de Cundinamarca, consulta disponibilidad en checkout o por WhatsApp.",
    },
    {
      q: "¿Cómo funcionan los botellones retornables?",
      a: "Al pedir tu próxima recarga, nuestro equipo recoge sin costo el botellón vacío. Así reutilizamos el envase y reducimos residuos plásticos.",
    },
    {
      q: "¿Puedo cancelar la suscripción mensual?",
      a: "Sí. La suscripción no tiene cláusula de permanencia ni penalización. La cancelas, pausas o ajustas cuando quieras desde tu cuenta o por WhatsApp.",
    },
    {
      q: "¿Cuánto tarda mi pedido?",
      a: "En zona urbana de Bogotá entregamos en menos de 24 horas hábiles. En municipios aledaños el rango es 24–48 horas, dependiendo de la franja seleccionada.",
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos tarjeta de crédito, PSE, Nequi y pago contra entrega en zonas habilitadas. Todos los pagos en línea pasan por pasarela cifrada.",
    },
  ],
};
