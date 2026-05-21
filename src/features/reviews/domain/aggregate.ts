import type { Review } from "./review";

/**
 * Resumen estadístico de reviews de un producto.
 *
 * - Solo cuenta reviews con `status === "approved"`: pending y rejected
 *   no afectan al promedio ni a la distribución que ve el comprador.
 * - `average` está redondeado a 1 decimal (suficiente para mostrar "4.3").
 * - `distribution` siempre devuelve las 5 keys (5..1) inicializadas en 0.
 */

export type RatingBucket = 1 | 2 | 3 | 4 | 5;

export type ReviewsSummary = {
  average: number;
  count: number;
  distribution: Record<RatingBucket, number>;
};

const emptyDistribution = (): Record<RatingBucket, number> => ({
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
});

export function summarizeReviews(reviews: readonly Review[]): ReviewsSummary {
  const approved = reviews.filter((r) => r.status === "approved");
  const distribution = emptyDistribution();

  if (approved.length === 0) {
    return { average: 0, count: 0, distribution };
  }

  let sum = 0;
  for (const r of approved) {
    sum += r.rating;
    const bucket = r.rating as RatingBucket;
    distribution[bucket] += 1;
  }

  const average = Math.round((sum / approved.length) * 10) / 10;

  return { average, count: approved.length, distribution };
}
