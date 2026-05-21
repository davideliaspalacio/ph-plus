import { MockReviewRepo } from "./mock.repo";
import type { ReviewRepository } from "./ports";

/**
 * Singleton del repositorio de reviews. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * podrá enrutar a `SupabaseReviewRepo` cuando exista.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const reviewRepo: ReviewRepository =
  backend === "supabase" ? new MockReviewRepo() : new MockReviewRepo();
