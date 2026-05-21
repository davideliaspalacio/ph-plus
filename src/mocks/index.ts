/**
 * Barrel de los seeds de mocks.
 *
 * Los repos mock de cada feature importan **desde acá**, no de subpaths.
 * Cada seed describe el contenido inicial que se carga en `localStorage` la
 * primera vez que el namespace está vacío.
 *
 * Convención: el seed se publica como constante `UPPER_SNAKE_CASE` y, cuando
 * el shape no proviene de una feature pública, también se exporta el tipo
 * inline (`SeedUser`, `SeedReview`, `SeedStoreSettings`, `SeedContent`).
 */

export { USERS_SEED, SEED_PRIMARY_CUSTOMER_ID, type SeedUser } from "./users.seed";
export { ORDERS_SEED } from "./orders.seed";
export {
  REVIEWS_SEED,
  type SeedReview,
  type SeedReviewStatus,
} from "./reviews.seed";
export {
  SETTINGS_SEED,
  type SeedStoreSettings,
  type SeedPaymentMethod,
} from "./settings.seed";
export {
  CONTENT_SEED,
  type SeedContent,
  type SeedHomeHero,
  type SeedBanner,
  type SeedFaqEntry,
} from "./content.seed";
