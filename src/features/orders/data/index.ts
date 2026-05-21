import { MockOrderRepo } from "./mock.repo";
import type { OrderRepository } from "./ports";

/**
 * Singleton del repositorio de pedidos. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * podrá enrutar a `SupabaseOrderRepo` cuando exista.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const orderRepo: OrderRepository =
  backend === "supabase" ? new MockOrderRepo() : new MockOrderRepo();
