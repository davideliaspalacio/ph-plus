import { MockInventoryRepo } from "./mock.repo";
import type { InventoryRepository } from "./ports";

/**
 * Singleton del repositorio de inventario. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * podrá enrutar a `SupabaseInventoryRepo` cuando exista.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const inventoryRepo: InventoryRepository =
  backend === "supabase" ? new MockInventoryRepo() : new MockInventoryRepo();
