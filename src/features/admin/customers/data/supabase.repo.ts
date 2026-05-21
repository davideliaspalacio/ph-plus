import type { Role, User } from "@/src/features/auth";
import type { Order, OrderStatus } from "@/src/features/orders";
import { buildCustomerView } from "../domain/compute";
import type { CustomerView } from "../domain/customer-view";
import type { CustomerAdminRepository } from "./ports";

/**
 * Repo de la vista de clientes contra Supabase.
 *
 * No hay tabla `customers`: la vista se compone a partir de
 * - `public.profiles` (id, email, name, role, created_at)
 * - `public.orders`   (user_id, status, totals, created_at)
 *
 * `buildCustomerView(user, orders)` hace el cálculo puro (totalSpent, VIP,
 * lastOrderAt, etc). Acá traemos profiles + sus orders y se lo pasamos.
 *
 * Para `list()` traemos todos los profiles y luego TODOS los orders en una
 * sola query, y agrupamos del lado del cliente. Es O(profiles + orders) en
 * red en vez de O(profiles) round-trips.
 */

interface ProfileDbRow {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_vip: boolean;
  created_at: string;
  updated_at: string;
}

interface OrderDbRow {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  totals: Order["totals"];
  created_at: string;
}

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

/**
 * `buildCustomerView` sólo lee `id, name, email, role, createdAt` del User —
 * nunca el `passwordHash`. Construimos un objeto con la forma de `User` para
 * satisfacer al tipo sin tener que romper el contrato del dominio.
 */
function profileToUser(row: ProfileDbRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    passwordHash: "", // no lo expone Supabase; buildCustomerView no lo usa.
    createdAt: row.created_at,
  };
}

/**
 * `buildCustomerView` sólo lee `status, totals.total, createdAt`. Construimos
 * un objeto con la forma estructural de `Order` mínima necesaria — los demás
 * campos no se tocan en el cálculo.
 */
function orderRowToOrder(row: OrderDbRow): Order {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    status: row.status,
    lines: [
      {
        slug: "_",
        title: "_",
        quantity: 1,
        unitPrice: 0,
        lineTotal: 0,
      },
    ],
    totals: row.totals,
    contact: { name: "", email: "noop@example.com", phone: "0000000" },
    shipping: { address: "", city: "", department: "", postalCode: "", notes: "" },
    payment: { method: "mock" },
    notes: [],
    createdAt: row.created_at,
    updatedAt: row.created_at,
  } as unknown as Order;
}

export class SupabaseCustomerAdminRepo implements CustomerAdminRepository {
  async list(): Promise<CustomerView[]> {
    const supabase = await getClient();

    const [{ data: profilesData, error: profilesErr }, { data: ordersData, error: ordersErr }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, email, name, role, is_vip, created_at, updated_at")
          .order("created_at", { ascending: true }),
        supabase
          .from("orders")
          .select("id, user_id, status, totals, created_at"),
      ]);

    if (profilesErr) {
      throw new Error(
        `SupabaseCustomerAdminRepo.list (profiles): ${profilesErr.message}`,
      );
    }
    if (ordersErr) {
      throw new Error(
        `SupabaseCustomerAdminRepo.list (orders): ${ordersErr.message}`,
      );
    }

    const profiles = (profilesData ?? []) as unknown as ProfileDbRow[];
    const orders = (ordersData ?? []) as unknown as OrderDbRow[];

    // Agrupamos órdenes por user_id.
    const ordersByUser = new Map<string, Order[]>();
    for (const row of orders) {
      if (!row.user_id) continue;
      const list = ordersByUser.get(row.user_id) ?? [];
      list.push(orderRowToOrder(row));
      ordersByUser.set(row.user_id, list);
    }

    return profiles.map((p) =>
      buildCustomerView(profileToUser(p), ordersByUser.get(p.id) ?? []),
    );
  }

  async byId(userId: string): Promise<CustomerView | null> {
    const supabase = await getClient();

    const { data: profileData, error: profileErr } = await supabase
      .from("profiles")
      .select("id, email, name, role, is_vip, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr) {
      throw new Error(
        `SupabaseCustomerAdminRepo.byId (profile): ${profileErr.message}`,
      );
    }
    if (!profileData) return null;

    const { data: ordersData, error: ordersErr } = await supabase
      .from("orders")
      .select("id, user_id, status, totals, created_at")
      .eq("user_id", userId);

    if (ordersErr) {
      throw new Error(
        `SupabaseCustomerAdminRepo.byId (orders): ${ordersErr.message}`,
      );
    }

    const orders = ((ordersData ?? []) as unknown as OrderDbRow[]).map(
      orderRowToOrder,
    );
    return buildCustomerView(
      profileToUser(profileData as unknown as ProfileDbRow),
      orders,
    );
  }
}
