import { describe, expect, it } from "vitest";
import { applyMovement, INSUFFICIENT_STOCK } from "./compute";

describe("applyMovement", () => {
  it("`in` suma al stock actual", () => {
    const next = applyMovement(10, {
      type: "in",
      quantity: 5,
      reason: "purchase",
    });
    expect(next).toBe(15);
  });

  it("`return` suma al stock actual", () => {
    const next = applyMovement(8, {
      type: "return",
      quantity: 2,
      reason: "return",
    });
    expect(next).toBe(10);
  });

  it("`out` resta del stock actual", () => {
    const next = applyMovement(10, {
      type: "out",
      quantity: 4,
      reason: "sale",
    });
    expect(next).toBe(6);
  });

  it("`out` con razón `loss` también resta", () => {
    const next = applyMovement(10, {
      type: "out",
      quantity: 3,
      reason: "loss",
    });
    expect(next).toBe(7);
  });

  it("`adjustment` SETEA en el valor absoluto", () => {
    const next = applyMovement(50, {
      type: "adjustment",
      quantity: 12,
      reason: "manual",
    });
    expect(next).toBe(12);
  });

  it("`adjustment` a 0 es válido", () => {
    const next = applyMovement(50, {
      type: "adjustment",
      quantity: 0,
      reason: "manual",
    });
    expect(next).toBe(0);
  });

  it("`out` que dejaría stock < 0 lanza INSUFFICIENT_STOCK", () => {
    expect(() =>
      applyMovement(3, {
        type: "out",
        quantity: 10,
        reason: "sale",
      }),
    ).toThrow(INSUFFICIENT_STOCK);
  });

  it("`adjustment` con quantity negativa lanza INSUFFICIENT_STOCK", () => {
    expect(() =>
      applyMovement(10, {
        type: "adjustment",
        quantity: -1,
        reason: "manual",
      }),
    ).toThrow(INSUFFICIENT_STOCK);
  });
});
