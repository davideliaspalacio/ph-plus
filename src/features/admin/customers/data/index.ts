import { MockCustomerAdminRepo } from "./mock.repo";
import { SupabaseCustomerAdminRepo } from "./supabase.repo";
import type { CustomerAdminRepository } from "./ports";

/**
 * Singleton del CustomerAdminRepository. Hoy mock por defecto; con
 * `NEXT_PUBLIC_DATA_BACKEND=supabase` usa `SupabaseCustomerAdminRepo`.
 */
const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const customerAdminRepo: CustomerAdminRepository =
  backend === "supabase"
    ? new SupabaseCustomerAdminRepo()
    : new MockCustomerAdminRepo();

export type { CustomerAdminRepository } from "./ports";
