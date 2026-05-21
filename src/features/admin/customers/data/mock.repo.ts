/**
 * Implementación mock del `CustomerAdminRepository`.
 *
 * No persistimos nada nuevo: la vista de clientes se deriva de:
 * - usuarios persistidos por `features/auth` (namespace `phplus.db.users.v1`)
 * - pedidos persistidos por `features/orders` (vía `orderRepo`)
 *
 * Como `userRepo` no expone hoy un `list()` (solo lookup por email/id), leemos
 * directo del namespace usando `makeNamespacedStorage`. El día que `auth`
 * exponga `list()` reemplazamos ese fetch y borramos esta ventana interna.
 */

import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import type { User } from "@/src/features/auth";
import { orderRepo } from "@/src/features/orders";
import type { Order } from "@/src/features/orders";
import { buildCustomerView } from "../domain/compute";
import type { CustomerView } from "../domain/customer-view";
import type { CustomerAdminRepository } from "./ports";

/** Mismo prefijo que usa `features/auth/data/mock.repo.ts`. */
export const USERS_STORAGE_PREFIX = "phplus.db.users.v1";

const usersTable = makeNamespacedStorage<User>(USERS_STORAGE_PREFIX);

function ordersForUser(orders: Order[], userId: string): Order[] {
  return orders.filter((o) => o.userId === userId);
}

export class MockCustomerAdminRepo implements CustomerAdminRepository {
  async list(): Promise<CustomerView[]> {
    const users = usersTable.list();
    const orders = await orderRepo.list();
    return users.map((u) => buildCustomerView(u, ordersForUser(orders, u.id)));
  }

  async byId(userId: string): Promise<CustomerView | null> {
    const user = usersTable.get(userId);
    if (!user) return null;
    const orders = await orderRepo.byUser(userId);
    return buildCustomerView(user, orders);
  }
}
