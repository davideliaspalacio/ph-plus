import { MockContentRepo } from "./mock.repo";
import { SupabaseContentRepo } from "./supabase.repo";
import type { ContentRepository } from "./ports";

/**
 * Singleton del repositorio de contenido. Switch por `NEXT_PUBLIC_DATA_BACKEND`:
 *  - "supabase" → `SupabaseContentRepo` (tabla `content`, id='main')
 *  - cualquier otro → `MockContentRepo` (localStorage)
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const contentRepo: ContentRepository =
  backend === "supabase" ? new SupabaseContentRepo() : new MockContentRepo();
