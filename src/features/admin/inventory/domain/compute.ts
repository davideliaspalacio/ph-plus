import type { StockMovement } from "./stock";

/**
 * Reglas puras para aplicar un movimiento de stock a la cantidad actual.
 *
 * - `in` y `return` SUMAN.
 * - `out` y los movimientos con razón `loss` RESTAN.
 * - `adjustment` es un SET absoluto: `current` queda igual a `quantity`.
 *
 * Si la operación dejaría el stock < 0 (o si un `adjustment` recibe `quantity`
 * negativa) se lanza `Error("INSUFFICIENT_STOCK")`.
 *
 * Este módulo es **puro**: no depende de React, ni del repo, ni de IO. Sólo
 * recibe números y devuelve un número.
 */

export const INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK";

export function applyMovement(
  currentStock: number,
  movement: Pick<StockMovement, "type" | "quantity" | "reason">,
): number {
  const { type, quantity, reason } = movement;

  switch (type) {
    case "in":
    case "return": {
      return currentStock + quantity;
    }
    case "out": {
      const next = currentStock - quantity;
      if (next < 0) throw new Error(INSUFFICIENT_STOCK);
      return next;
    }
    case "adjustment": {
      if (quantity < 0) throw new Error(INSUFFICIENT_STOCK);
      return quantity;
    }
    default: {
      // Cobertura de exhaustividad si se agrega un tipo nuevo.
      const _exhaustive: never = type;
      // Razón es ignorada en la rama default; queda referenciada para evitar warnings.
      void reason;
      void _exhaustive;
      throw new Error("UNKNOWN_MOVEMENT_TYPE");
    }
  }
}
