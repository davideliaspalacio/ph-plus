import { MockCustomerAdminRepo } from "./mock.repo";
import type { CustomerAdminRepository } from "./ports";

/**
 * Singleton del CustomerAdminRepository. Hoy siempre mock; mañana branch a
 * Supabase según `NEXT_PUBLIC_DATA_BACKEND` (igual que el resto de repos).
 */
const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const customerAdminRepo: CustomerAdminRepository =
  backend === "supabase" ? new MockCustomerAdminRepo() : new MockCustomerAdminRepo();

export type { CustomerAdminRepository } from "./ports";
