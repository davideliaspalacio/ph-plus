import { MockContentRepo } from "./mock.repo";
import type { ContentRepository } from "./ports";

/**
 * Singleton del repositorio de contenido. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * podrá enrutar a `SupabaseContentRepo` cuando exista.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const contentRepo: ContentRepository =
  backend === "supabase" ? new MockContentRepo() : new MockContentRepo();
