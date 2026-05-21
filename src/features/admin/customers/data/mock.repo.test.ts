import { beforeEach, describe, expect, it } from "vitest";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { MockCustomerAdminRepo, USERS_STORAGE_PREFIX } from "./mock.repo";
import { userRepo } from "@/src/features/auth";
import { orderRepo } from "@/src/features/orders";
import type { User } from "@/src/features/auth";
import type { Order } from "@/src/features/orders";

const usersTable = makeNamespacedStorage<User>(USERS_STORAGE_PREFIX);
const ordersTable = makeNamespacedStorage<Order>("phplus.db.orders.v1");

async function seedUser(email: string, name: string): Promise<User> {
  return await userRepo.create({
    email,
    name,
    passwordHash: "salt:hash",
  });
}

async function seedOrder(userId: string, total: number, status: Order["status"] = "paid"): Promise<Order> {
  return await orderRepo.create({
    userId,
    status,
    lines: [
      { slug: "x", title: "X", quantity: 1, unitPrice: total, lineTotal: total },
    ],
    totals: { subtotal: total, discount: 0, shipping: 0, total },
    contact: { name: "Buyer", email: "buyer@example.com", phone: "+57300" },
    shipping: { address: "Cll 1", city: "Bogotá", department: "Cundinamarca" },
    payment: { method: "mock" },
  });
}

describe("MockCustomerAdminRepo", () => {
  beforeEach(() => {
    usersTable.clear();
    ordersTable.clear();
  });

  it("list() devuelve un CustomerView por usuario con ordersCount y totalSpent", async () => {
    const ana = await seedUser("ana@example.com", "Ana");
    const beto = await seedUser("beto@example.com", "Beto");
    await seedOrder(ana.id, 100_000, "paid");
    await seedOrder(ana.id, 200_000, "delivered");
    await seedOrder(beto.id, 50_000, "cancelled"); // no cuenta

    const repo = new MockCustomerAdminRepo();
    const list = await repo.list();

    const anaView = list.find((c) => c.id === ana.id);
    const betoView = list.find((c) => c.id === beto.id);

    expect(list).toHaveLength(2);
    expect(anaView).toMatchObject({
      ordersCount: 2,
      totalSpent: 300_000,
      lifetimeValue: 300_000,
    });
    expect(betoView).toMatchObject({
      ordersCount: 0,
      totalSpent: 0,
    });
  });

  it("byId() devuelve el CustomerView del usuario o null si no existe", async () => {
    const ana = await seedUser("ana@example.com", "Ana");
    await seedOrder(ana.id, 600_000, "paid");

    const repo = new MockCustomerAdminRepo();
    const view = await repo.byId(ana.id);
    expect(view).not.toBeNull();
    expect(view?.email).toBe("ana@example.com");
    expect(view?.isVip).toBe(true);

    const missing = await repo.byId("does-not-exist");
    expect(missing).toBeNull();
  });
});
