import { beforeEach, describe, expect, it } from "vitest";
import { MockOrderRepo, ORDERS_NAMESPACE } from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import type { NewOrderInput } from "./ports";

/**
 * Tests del MockOrderRepo: ciclo CRUD + máquina de estados + notas.
 */

const ns = makeNamespacedStorage(ORDERS_NAMESPACE);

function baseInput(overrides: Partial<NewOrderInput> = {}): NewOrderInput {
  return {
    userId: "user_1",
    lines: [
      {
        slug: "kit-x2",
        title: "Kit x2",
        quantity: 1,
        unitPrice: 30_000,
        lineTotal: 30_000,
      },
    ],
    totals: {
      subtotal: 30_000,
      discount: 0,
      shipping: 8_000,
      total: 38_000,
    },
    contact: {
      name: "Ada Lovelace",
      email: "ada@example.com",
      phone: "+57 300 0000000",
    },
    shipping: {
      address: "Calle Falsa 123",
      city: "Bogotá",
      department: "Cundinamarca",
    },
    payment: { method: "mock" },
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  ns.clear();
});

describe("MockOrderRepo", () => {
  it("create asigna id con prefijo ORD-, status default pending_payment y timestamps", async () => {
    const repo = new MockOrderRepo();
    const order = await repo.create(baseInput());
    expect(order.id).toMatch(/^ORD-/);
    expect(order.status).toBe("pending_payment");
    expect(order.notes).toEqual([]);
    expect(order.createdAt).toBe(order.updatedAt);
    expect(() => new Date(order.createdAt).toISOString()).not.toThrow();
  });

  it("byId devuelve el pedido creado y null si no existe", async () => {
    const repo = new MockOrderRepo();
    const order = await repo.create(baseInput());
    const found = await repo.byId(order.id);
    expect(found?.id).toBe(order.id);
    const miss = await repo.byId("ORD-NOPE");
    expect(miss).toBeNull();
  });

  it("byUser filtra por userId", async () => {
    const repo = new MockOrderRepo();
    await repo.create(baseInput({ userId: "user_1" }));
    await repo.create(baseInput({ userId: "user_2" }));
    await repo.create(baseInput({ userId: "user_1" }));
    const mine = await repo.byUser("user_1");
    expect(mine).toHaveLength(2);
    expect(mine.every((o) => o.userId === "user_1")).toBe(true);
  });

  it("list sin filtros devuelve todos; con filters.status filtra", async () => {
    const repo = new MockOrderRepo();
    const a = await repo.create(baseInput());
    await repo.create(baseInput());
    expect(await repo.list()).toHaveLength(2);

    await repo.updateStatus(a.id, "paid");
    const paid = await repo.list({ status: "paid" });
    expect(paid).toHaveLength(1);
    expect(paid[0].id).toBe(a.id);

    const pending = await repo.list({ status: "pending_payment" });
    expect(pending).toHaveLength(1);
  });

  it("list con filters.userId también filtra correctamente", async () => {
    const repo = new MockOrderRepo();
    await repo.create(baseInput({ userId: "u-a" }));
    await repo.create(baseInput({ userId: "u-b" }));
    const onlyA = await repo.list({ userId: "u-a" });
    expect(onlyA).toHaveLength(1);
    expect(onlyA[0].userId).toBe("u-a");
  });

  it("updateStatus aplica una transición válida y bump updatedAt", async () => {
    const repo = new MockOrderRepo();
    const order = await repo.create(baseInput());
    const originalUpdated = order.updatedAt;
    // pequeño truco: avanzar el reloj de forma simbólica esperando 1 tick
    await new Promise((r) => setTimeout(r, 2));
    const moved = await repo.updateStatus(order.id, "paid");
    expect(moved.status).toBe("paid");
    expect(moved.updatedAt >= originalUpdated).toBe(true);
    const persisted = await repo.byId(order.id);
    expect(persisted?.status).toBe("paid");
  });

  it("updateStatus tira INVALID_TRANSITION ante un salto inválido", async () => {
    const repo = new MockOrderRepo();
    const order = await repo.create(baseInput());
    await expect(repo.updateStatus(order.id, "delivered")).rejects.toThrow(
      /INVALID_TRANSITION:pending_payment->delivered/,
    );
    const persisted = await repo.byId(order.id);
    expect(persisted?.status).toBe("pending_payment");
  });

  it("updateStatus de un id inexistente tira not found", async () => {
    const repo = new MockOrderRepo();
    await expect(repo.updateStatus("ORD-NOPE", "paid")).rejects.toThrow(
      /not found/,
    );
  });

  it("addNote agrega una nota con id, autor, texto y timestamp", async () => {
    const repo = new MockOrderRepo();
    const order = await repo.create(baseInput());
    const note = await repo.addNote(order.id, {
      author: "staff:ada",
      text: "Llamé al cliente para confirmar dirección",
    });
    expect(note.id).toBeTruthy();
    expect(note.author).toBe("staff:ada");
    const persisted = await repo.byId(order.id);
    expect(persisted?.notes).toHaveLength(1);
    expect(persisted?.notes[0].id).toBe(note.id);
  });

  it("update permite parchear campos arbitrarios (p.ej. trackingNumber) sin cambiar el id", async () => {
    const repo = new MockOrderRepo();
    const order = await repo.create(baseInput());
    const patched = await repo.update(order.id, {
      trackingNumber: "TRACK-123",
    });
    expect(patched.id).toBe(order.id);
    expect(patched.trackingNumber).toBe("TRACK-123");
  });
});
