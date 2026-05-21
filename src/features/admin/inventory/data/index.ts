import { MockInventoryRepo } from "./mock.repo";
import { SupabaseInventoryRepo } from "./supabase.repo";
import type { InventoryRepository } from "./ports";

/**
 * Singleton del repositorio de inventario. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * enruta a `SupabaseInventoryRepo` cuando esté en "supabase".
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const inventoryRepo: InventoryRepository =
  backend === "supabase" ? new SupabaseInventoryRepo() : new MockInventoryRepo();
