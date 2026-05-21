import { MockOrderRepo } from "./mock.repo";
import { SupabaseOrderRepo } from "./supabase.repo";
import type { OrderRepository } from "./ports";

/**
 * Singleton del repositorio de pedidos. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * enruta a `SupabaseOrderRepo` cuando vale "supabase"; default `mock`.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const orderRepo: OrderRepository =
  backend === "supabase" ? new SupabaseOrderRepo() : new MockOrderRepo();
