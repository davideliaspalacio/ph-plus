/**
 * Seed inicial de reviews para el repo mock de `features/reviews` (cuando
 * exista). El shape de `SeedReview` debe permanecer compatible con el dominio
 * de reviews — se define inline porque la feature aún no expone un tipo
 * público y queremos evitar acoplamientos prematuros.
 *
 * Aligns with `features/reviews` (cuando se cree). Estados de moderación
 * según FUNCTIONAL-SPEC §12 / §23: pending → approved | rejected.
 */

export type SeedReviewStatus = "pending" | "approved" | "rejected";

export type SeedReview = {
  id: string;
  productSlug: string;
  userId?: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  text: string;
  recommends: boolean;
  status: SeedReviewStatus;
  /** ISO datetime de creación. */
  createdAt: string;
  /** Motivo de rechazo (sólo para `status === "rejected"`). */
  rejectionReason?: string;
};

export const REVIEWS_SEED: SeedReview[] = [
  // ---------- 6 approved ----------
  {
    id: "rev_0001",
    productSlug: "kit-inicial-botellon-19lts",
    userId: "usr_customer_001",
    author: "María Gómez",
    rating: 5,
    title: "El mejor cambio para mi familia",
    text: "El kit llegó muy bien empacado. El dispensador es práctico y el agua se siente muy suave. Los niños ahora toman más agua.",
    recommends: true,
    status: "approved",
    createdAt: "2026-04-12T09:15:00.000Z",
  },
  {
    id: "rev_0002",
    productSlug: "recargas-19lts",
    userId: "usr_customer_002",
    author: "Carlos Rodríguez",
    rating: 5,
    title: "Cumplen siempre",
    text: "Llevo 4 meses pidiendo las dos recargas y nunca han fallado con la entrega. Buen sabor y atención impecable.",
    recommends: true,
    status: "approved",
    createdAt: "2026-04-20T17:42:00.000Z",
  },
  {
    id: "rev_0003",
    productSlug: "promocion-garrafas",
    author: "Diana Martínez",
    rating: 4,
    title: "Buena promo, ideal para la oficina",
    text: "Las 5 garrafas alcanzan para toda la semana en la oficina. Solo le bajo una estrella porque la entrega tardó un día más de lo prometido.",
    recommends: true,
    status: "approved",
    createdAt: "2026-04-25T11:00:00.000Z",
  },
  {
    id: "rev_0004",
    productSlug: "dispensador-electrico",
    userId: "usr_customer_001",
    author: "María Gómez",
    rating: 5,
    title: "Vale cada peso",
    text: "El dispensador eléctrico es silencioso, enfría rápido y el agua caliente sirve perfecto para mi té de la mañana. Excelente diseño.",
    recommends: true,
    status: "approved",
    createdAt: "2026-05-02T07:30:00.000Z",
  },
  {
    id: "rev_0005",
    productSlug: "garrafa-1l-pack6",
    author: "Jorge Vélez",
    rating: 4,
    title: "Cómodas para el gym",
    text: "Las llevo al entrenamiento y caben perfecto en el morral. El cierre es seguro, no he tenido derrames.",
    recommends: true,
    status: "approved",
    createdAt: "2026-05-04T18:22:00.000Z",
  },
  {
    id: "rev_0006",
    productSlug: "suscripcion-mensual-4-botellones",
    userId: "usr_customer_001",
    author: "María Gómez",
    rating: 5,
    title: "No tengo que pensar en pedir agua",
    text: "La suscripción es lo mejor: llega sola, recogen los vacíos y puedo pausar si me voy de viaje. Recomendadísima.",
    recommends: true,
    status: "approved",
    createdAt: "2026-05-10T13:05:00.000Z",
  },

  // ---------- 2 pending ----------
  {
    id: "rev_0007",
    productSlug: "botellon-5l",
    userId: "usr_customer_002",
    author: "Carlos Rodríguez",
    rating: 4,
    title: "Práctico para llevar a paseos",
    text: "Lo usé en un picnic familiar y fue perfecto. El asa es resistente y es más fácil de manejar que el botellón grande.",
    recommends: true,
    status: "pending",
    createdAt: "2026-05-18T20:11:00.000Z",
  },
  {
    id: "rev_0008",
    productSlug: "dispensador-manual",
    author: "Andrea Quintero",
    rating: 3,
    title: "Funciona pero hay que purgar mucho aire",
    text: "Sirve para lo que es. El primer uso costó un poco hacer que saliera el agua, hubo que accionar varias veces la bomba. Después funcionó bien.",
    recommends: true,
    status: "pending",
    createdAt: "2026-05-19T15:48:00.000Z",
  },

  // ---------- 2 rejected ----------
  {
    id: "rev_0009",
    productSlug: "garrafa-1-5l-pack6",
    author: "Anónimo 88",
    rating: 3,
    title: "Comentario fuera de contexto",
    text: "Aprovecho para vender mi propio producto en este espacio.",
    recommends: false,
    status: "rejected",
    rejectionReason: "Spam / contenido promocional de terceros.",
    createdAt: "2026-04-30T22:14:00.000Z",
  },
  {
    id: "rev_0010",
    productSlug: "recarga-19lts-individual",
    author: "Usuario molesto",
    rating: 3,
    title: "Demora en entrega",
    text: "Contenido con lenguaje ofensivo dirigido al repartidor.",
    recommends: false,
    status: "rejected",
    rejectionReason: "Lenguaje inapropiado contra el equipo de entrega.",
    createdAt: "2026-05-06T10:02:00.000Z",
  },
];
