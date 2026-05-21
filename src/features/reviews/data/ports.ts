import type { Review, ReviewStatus } from "../domain/review";

/**
 * Puerto del repositorio de reviews.
 *
 * El día que migremos a Supabase, una nueva implementación (SupabaseReviewRepo)
 * reemplaza al mock sin tocar dominio ni UI.
 */

export type NewReviewInput = Omit<
  Review,
  "id" | "status" | "createdAt" | "updatedAt" | "rejectionReason" | "adminResponse"
> & {
  status?: ReviewStatus;
};

export const REVIEW_ERRORS = {
  NOT_FOUND: "NOT_FOUND",
} as const;

export interface ReviewRepository {
  listByProduct(slug: string, status?: ReviewStatus): Promise<Review[]>;
  listForModeration(status?: ReviewStatus): Promise<Review[]>;
  create(input: NewReviewInput): Promise<Review>;
  approve(id: string): Promise<Review>;
  reject(id: string, reason: string): Promise<Review>;
  respond(id: string, text: string): Promise<Review>;
}
