import { MockAdminProductRepo } from "./mock.repo";
import { SupabaseAdminProductRepo } from "./supabase.repo";
import type { AdminProductRepository } from "./ports";

/**
 * Singleton del AdminProductRepository. Switch por `NEXT_PUBLIC_DATA_BACKEND`:
 *  - "supabase" → `SupabaseAdminProductRepo` (tabla `products`)
 *  - cualquier otro → `MockAdminProductRepo` (localStorage + seeds)
 */
const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const adminProductRepo: AdminProductRepository =
  backend === "supabase"
    ? new SupabaseAdminProductRepo()
    : new MockAdminProductRepo();
