import { describe, expect, it } from "vitest";
import { ORDER_STATUS_FLOW, isValidTransition } from "./status";
import type { OrderStatus } from "./order";

/**
 * Tests de la máquina de estados. Cada transición válida del Apéndice B se
 * cubre explícitamente, junto con un par de transiciones inválidas para
 * dejar fija la dirección del grafo.
 */

describe("ORDER_STATUS_FLOW", () => {
  it("estados terminales no tienen transiciones salientes", () => {
    expect(ORDER_STATUS_FLOW.closed).toEqual([]);
    expect(ORDER_STATUS_FLOW.cancelled).toEqual([]);
    expect(ORDER_STATUS_FLOW.refunded).toEqual([]);
  });
});

describe("isValidTransition — transiciones válidas", () => {
  it("draft → pending_payment", () => {
    expect(isValidTransition("draft", "pending_payment")).toBe(true);
  });

  it("draft → cancelled", () => {
    expect(isValidTransition("draft", "cancelled")).toBe(true);
  });

  it("pending_payment → paid", () => {
    expect(isValidTransition("pending_payment", "paid")).toBe(true);
  });

  it("pending_payment → cancelled", () => {
    expect(isValidTransition("pending_payment", "cancelled")).toBe(true);
  });

  it("paid → preparing", () => {
    expect(isValidTransition("paid", "preparing")).toBe(true);
  });

  it("paid → cancelled", () => {
    expect(isValidTransition("paid", "cancelled")).toBe(true);
  });

  it("paid → refunded", () => {
    expect(isValidTransition("paid", "refunded")).toBe(true);
  });

  it("preparing → shipped", () => {
    expect(isValidTransition("preparing", "shipped")).toBe(true);
  });

  it("preparing → refunded", () => {
    expect(isValidTransition("preparing", "refunded")).toBe(true);
  });

  it("shipped → delivered", () => {
    expect(isValidTransition("shipped", "delivered")).toBe(true);
  });

  it("shipped → refunded", () => {
    expect(isValidTransition("shipped", "refunded")).toBe(true);
  });

  it("delivered → closed", () => {
    expect(isValidTransition("delivered", "closed")).toBe(true);
  });

  it("delivered → refunded", () => {
    expect(isValidTransition("delivered", "refunded")).toBe(true);
  });
});

describe("isValidTransition — transiciones inválidas", () => {
  it("pending_payment → delivered (salto prohibido)", () => {
    expect(isValidTransition("pending_payment", "delivered")).toBe(false);
  });

  it("paid → shipped (no se puede saltar preparing)", () => {
    expect(isValidTransition("paid", "shipped")).toBe(false);
  });

  it("shipped → preparing (no se puede retroceder)", () => {
    expect(isValidTransition("shipped", "preparing")).toBe(false);
  });

  it("closed → cualquier estado es inválido (terminal)", () => {
    const all: OrderStatus[] = [
      "draft",
      "pending_payment",
      "paid",
      "preparing",
      "shipped",
      "delivered",
      "closed",
      "cancelled",
      "refunded",
    ];
    for (const to of all) {
      expect(isValidTransition("closed", to)).toBe(false);
    }
  });

  it("cancelled → paid es inválido", () => {
    expect(isValidTransition("cancelled", "paid")).toBe(false);
  });

  it("refunded → paid es inválido", () => {
    expect(isValidTransition("refunded", "paid")).toBe(false);
  });
});
