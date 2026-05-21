import { MockReviewRepo } from "./mock.repo";
import { SupabaseReviewRepo } from "./supabase.repo";
import type { ReviewRepository } from "./ports";

/**
 * Singleton del repositorio de reviews. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * enruta a `SupabaseReviewRepo` cuando esté en "supabase".
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const reviewRepo: ReviewRepository =
  backend === "supabase" ? new SupabaseReviewRepo() : new MockReviewRepo();
