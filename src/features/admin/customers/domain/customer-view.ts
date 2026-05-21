/**
 * Vista derivada de un cliente para el admin.
 *
 * No es una entidad persistida: se construye combinando un `User` con sus
 * pedidos (`Order[]`) en `buildCustomerView`. La fuente de verdad sigue siendo
 * `userRepo` + `orderRepo`.
 */

import type { Role } from "@/src/features/auth";

/** Umbral en COP a partir del cual marcamos al cliente como VIP. */
export const VIP_THRESHOLD_COP = 500_000;

export interface CustomerView {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  /** Lifetime value. Por ahora simplificado: igual a totalSpent. */
  lifetimeValue: number;
  lastOrderAt?: string;
  isVip: boolean;
}
