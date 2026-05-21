import { beforeEach, describe, expect, it } from "vitest";
import {
  MockInventoryRepo,
  INVENTORY_STOCK_NAMESPACE,
  INVENTORY_MOVEMENTS_NAMESPACE,
} from "./mock.repo";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import type { StockItem, StockMovement } from "../domain/stock";

const stockNs = makeNamespacedStorage<StockItem>(INVENTORY_STOCK_NAMESPACE);
const movementsNs = makeNamespacedStorage<StockMovement>(
  INVENTORY_MOVEMENTS_NAMESPACE,
);

beforeEach(() => {
  localStorage.clear();
  stockNs.clear();
  movementsNs.clear();
});

describe("MockInventoryRepo", () => {
  it("seedFromProducts crea un StockItem por slug con stock entre 5 y 50", async () => {
    const repo = new MockInventoryRepo();
    const items = await repo.seedFromProducts([
      "perfume-rosa",
      "perfume-azul",
    ]);
    expect(items).toHaveLength(2);
    for (const it of items) {
      expect(it.current).toBeGreaterThanOrEqual(5);
      expect(it.current).toBeLessThanOrEqual(50);
      expect(it.low).toBe(5);
      expect(it.productSlug).toMatch(/^perfume-(rosa|azul)$/);
    }
    const slugs = items.map((i) => i.productSlug).sort();
    expect(slugs).toEqual(["perfume-azul", "perfume-rosa"]);
  });

  it("seedFromProducts es idempotente: no pisa items existentes", async () => {
    const repo = new MockInventoryRepo();
    const [first] = await repo.seedFromProducts(["perfume-rosa"]);
    // Mutamos el current del primero a un valor improbable de random.
    const sku = first.sku;
    await repo.adjustStock(sku, {
      sku,
      type: "adjustment",
      quantity: 999,
      reason: "manual",
      author: "tester",
    });
    const reseeded = await repo.seedFromProducts(["perfume-rosa"]);
    expect(reseeded[0].current).toBe(999);
  });

  it("getStock devuelve null para SKU inexistente y el item si existe", async () => {
    const repo = new MockInventoryRepo();
    expect(await repo.getStock("SKU-NADA")).toBeNull();
    const [seeded] = await repo.seedFromProducts(["perfume-rosa"]);
    const got = await repo.getStock(seeded.sku);
    expect(got).not.toBeNull();
    expect(got?.sku).toBe(seeded.sku);
  });

  it("adjustStock tipo `in` suma y persiste el nuevo stock + un movimiento", async () => {
    const repo = new MockInventoryRepo();
    const [seeded] = await repo.seedFromProducts(["perfume-rosa"]);
    const before = seeded.current;
    const { stock, movement } = await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "in",
      quantity: 10,
      reason: "purchase",
      author: "admin",
    });
    expect(stock.current).toBe(before + 10);
    expect(movement.id).toBeTruthy();
    expect(movement.createdAt).toBeTruthy();
    expect(movement.type).toBe("in");
    const reloaded = await repo.getStock(seeded.sku);
    expect(reloaded?.current).toBe(before + 10);
  });

  it("adjustStock tipo `out` que cabe en stock se aplica y persiste", async () => {
    const repo = new MockInventoryRepo();
    const [seeded] = await repo.seedFromProducts(["perfume-rosa"]);
    // Forzamos un valor conocido para no depender del random.
    await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "adjustment",
      quantity: 20,
      reason: "manual",
      author: "admin",
    });
    const { stock } = await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "out",
      quantity: 7,
      reason: "sale",
      author: "admin",
    });
    expect(stock.current).toBe(13);
  });

  it("adjustStock tipo `out` que no cabe tira y NO persiste ni stock ni movimiento", async () => {
    const repo = new MockInventoryRepo();
    const [seeded] = await repo.seedFromProducts(["perfume-rosa"]);
    await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "adjustment",
      quantity: 3,
      reason: "manual",
      author: "admin",
    });
    const movementsBefore = (await repo.listMovements(seeded.sku)).length;
    await expect(
      repo.adjustStock(seeded.sku, {
        sku: seeded.sku,
        type: "out",
        quantity: 10,
        reason: "sale",
        author: "admin",
      }),
    ).rejects.toThrow("INSUFFICIENT_STOCK");
    const after = await repo.getStock(seeded.sku);
    expect(after?.current).toBe(3);
    const movementsAfter = (await repo.listMovements(seeded.sku)).length;
    expect(movementsAfter).toBe(movementsBefore);
  });

  it("adjustStock sobre SKU inexistente tira", async () => {
    const repo = new MockInventoryRepo();
    await expect(
      repo.adjustStock("SKU-NADA", {
        sku: "SKU-NADA",
        type: "in",
        quantity: 1,
        reason: "purchase",
        author: "admin",
      }),
    ).rejects.toThrow(/SKU-NADA/);
  });

  it("listMovements filtra por sku cuando se pasa el argumento", async () => {
    const repo = new MockInventoryRepo();
    const [a, b] = await repo.seedFromProducts([
      "perfume-rosa",
      "perfume-azul",
    ]);
    await repo.adjustStock(a.sku, {
      sku: a.sku,
      type: "in",
      quantity: 1,
      reason: "purchase",
      author: "admin",
    });
    await repo.adjustStock(b.sku, {
      sku: b.sku,
      type: "in",
      quantity: 2,
      reason: "purchase",
      author: "admin",
    });
    await repo.adjustStock(a.sku, {
      sku: a.sku,
      type: "in",
      quantity: 3,
      reason: "purchase",
      author: "admin",
    });
    const onlyA = await repo.listMovements(a.sku);
    expect(onlyA).toHaveLength(2);
    expect(onlyA.every((m) => m.sku === a.sku)).toBe(true);
    const all = await repo.listMovements();
    expect(all).toHaveLength(3);
  });

  it("listMovements devuelve los movimientos ordenados por createdAt desc", async () => {
    const repo = new MockInventoryRepo();
    const [seeded] = await repo.seedFromProducts(["perfume-rosa"]);
    // Tres movimientos seguidos: el orden temporal real puede colapsar dentro
    // de un mismo ms; aseguramos al menos avance separando con await + delay
    // micro vía Promise.resolve no alcanza, así que esperamos 2ms entre cada uno.
    const wait = (ms: number) =>
      new Promise((r) => setTimeout(r, ms));
    const first = await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "in",
      quantity: 1,
      reason: "purchase",
      author: "admin",
    });
    await wait(2);
    const second = await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "in",
      quantity: 1,
      reason: "purchase",
      author: "admin",
    });
    await wait(2);
    const third = await repo.adjustStock(seeded.sku, {
      sku: seeded.sku,
      type: "in",
      quantity: 1,
      reason: "purchase",
      author: "admin",
    });
    const list = await repo.listMovements(seeded.sku);
    expect(list.map((m) => m.id)).toEqual([
      third.movement.id,
      second.movement.id,
      first.movement.id,
    ]);
  });
});
