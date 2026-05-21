/**
 * Puerto del repositorio de clientes (vista admin).
 *
 * Implementaciones: `mock.repo.ts` (combina userRepo + orderRepo sobre
 * localStorage), `supabase.repo.ts` (futuro).
 */

import type { CustomerView } from "../domain/customer-view";

export interface CustomerAdminRepository {
  list(): Promise<CustomerView[]>;
  byId(userId: string): Promise<CustomerView | null>;
}
