import { MockAdminProductRepo } from "./mock.repo";
import type { AdminProductRepository } from "./ports";

/**
 * Singleton del AdminProductRepository. El día de mañana se enruta a
 * `SupabaseAdminProductRepo` con la misma interfaz.
 */
const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const adminProductRepo: AdminProductRepository =
  backend === "supabase" ? new MockAdminProductRepo() : new MockAdminProductRepo();
