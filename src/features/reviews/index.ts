/**
 * API pública de la feature `reviews`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  ReviewSchema,
  ReviewStatusSchema,
  type Review,
  type ReviewStatus,
} from "./domain/review";

export {
  summarizeReviews,
  type ReviewsSummary,
  type RatingBucket,
} from "./domain/aggregate";

export { reviewRepo } from "./data";
export {
  REVIEW_ERRORS,
  type ReviewRepository,
  type NewReviewInput,
} from "./data/ports";
