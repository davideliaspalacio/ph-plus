import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import { ReviewSchema, type Review, type ReviewStatus } from "../domain/review";
import {
  REVIEW_ERRORS,
  type NewReviewInput,
  type ReviewRepository,
} from "./ports";

/**
 * Implementación mock del ReviewRepository.
 *
 * Persiste en `localStorage` bajo el namespace `phplus.db.reviews.v1`. A
 * diferencia del repo de cupones, no siembra datos: la PDP arranca vacía
 * y los reviews los crea el usuario desde el form (Sprint 12).
 *
 * Cualquier acción de moderación (`approve`, `reject`, `respond`) actualiza
 * `updatedAt` y vuelve a parsear con Zod para mantener invariantes del schema.
 */

export const REVIEWS_NAMESPACE = "phplus.db.reviews.v1";

const ns = makeNamespacedStorage<Review>(REVIEWS_NAMESPACE);

function nowIso(): string {
  return new Date().toISOString();
}

function notFound(): Error {
  return new Error(REVIEW_ERRORS.NOT_FOUND);
}

export class MockReviewRepo implements ReviewRepository {
  async create(input: NewReviewInput): Promise<Review> {
    const now = nowIso();
    const review = ReviewSchema.parse({
      ...input,
      id: newId(),
      status: input.status ?? "pending",
      createdAt: now,
      updatedAt: now,
    });
    ns.set(review.id, review);
    return review;
  }

  async listByProduct(slug: string, status?: ReviewStatus): Promise<Review[]> {
    return ns
      .list()
      .filter((r) => r.productSlug === slug)
      .filter((r) => (status ? r.status === status : true))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async listForModeration(status: ReviewStatus = "pending"): Promise<Review[]> {
    return ns
      .list()
      .filter((r) => r.status === status)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  async approve(id: string): Promise<Review> {
    const current = ns.get(id);
    if (!current) throw notFound();
    const next = ReviewSchema.parse({
      ...current,
      status: "approved",
      rejectionReason: undefined,
      updatedAt: nowIso(),
    });
    ns.set(id, next);
    return next;
  }

  async reject(id: string, reason: string): Promise<Review> {
    const current = ns.get(id);
    if (!current) throw notFound();
    const next = ReviewSchema.parse({
      ...current,
      status: "rejected",
      rejectionReason: reason,
      updatedAt: nowIso(),
    });
    ns.set(id, next);
    return next;
  }

  async respond(id: string, text: string): Promise<Review> {
    const current = ns.get(id);
    if (!current) throw notFound();
    const next = ReviewSchema.parse({
      ...current,
      adminResponse: text,
      updatedAt: nowIso(),
    });
    ns.set(id, next);
    return next;
  }
}
