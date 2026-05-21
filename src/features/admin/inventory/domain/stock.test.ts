import { describe, expect, it } from "vitest";
import {
  StockItemSchema,
  StockMovementSchema,
} from "./stock";

describe("StockItemSchema", () => {
  it("acepta un StockItem válido con location opcional", () => {
    const item = StockItemSchema.parse({
      sku: "SKU-001",
      productSlug: "perfume-rosa",
      current: 25,
      low: 5,
      location: "Bodega A",
    });
    expect(item.sku).toBe("SKU-001");
    expect(item.location).toBe("Bodega A");
  });

  it("location es opcional", () => {
    const item = StockItemSchema.parse({
      sku: "SKU-002",
      productSlug: "perfume-azul",
      current: 0,
      low: 3,
    });
    expect(item.location).toBeUndefined();
    expect(item.current).toBe(0);
  });

  it("rechaza `low` negativo y `current` negativo", () => {
    expect(() =>
      StockItemSchema.parse({
        sku: "SKU-X",
        productSlug: "x",
        current: 10,
        low: -1,
      }),
    ).toThrow();
    expect(() =>
      StockItemSchema.parse({
        sku: "SKU-X",
        productSlug: "x",
        current: -5,
        low: 1,
      }),
    ).toThrow();
  });
});

describe("StockMovementSchema", () => {
  it("acepta un movimiento válido tipo `in` con motivo `purchase`", () => {
    const mv = StockMovementSchema.parse({
      id: "mv-1",
      sku: "SKU-001",
      type: "in",
      quantity: 10,
      reason: "purchase",
      note: "Llegó pedido al proveedor",
      createdAt: "2026-05-20T10:00:00.000Z",
      author: "admin@phplus.test",
    });
    expect(mv.type).toBe("in");
    expect(mv.reason).toBe("purchase");
  });

  it("rechaza tipo desconocido", () => {
    expect(() =>
      StockMovementSchema.parse({
        id: "mv-2",
        sku: "SKU-001",
        type: "wat",
        quantity: 1,
        reason: "manual",
        createdAt: "2026-05-20T10:00:00.000Z",
        author: "admin",
      }),
    ).toThrow();
  });
});
