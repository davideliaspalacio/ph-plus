import { z } from "zod";

/**
 * Schemas del dominio de inventario.
 *
 * - `StockItem` representa el estado actual de un SKU en stock: cuántas unidades
 *   hay, cuál es su umbral de "low stock" para alertas, y opcionalmente la
 *   ubicación física (depósito, estante, etc.).
 * - `StockMovement` es la bitácora: cada entrada/salida/ajuste/devolución se
 *   registra como un movimiento inmutable con autor y timestamp.
 *
 * El SKU es la llave funcional; el `productSlug` permite linkear de vuelta al
 * catálogo sin acoplar este dominio al schema de Product.
 */

export const StockItemSchema = z.object({
  sku: z.string().min(1),
  productSlug: z.string().min(1),
  current: z.number().int().nonnegative(),
  /** Umbral de low stock: cuando `current <= low`, el SKU se considera bajo. */
  low: z.number().int().nonnegative(),
  location: z.string().optional(),
});

export type StockItem = z.infer<typeof StockItemSchema>;

export const StockMovementTypeSchema = z.enum([
  "in",
  "out",
  "adjustment",
  "return",
]);
export type StockMovementType = z.infer<typeof StockMovementTypeSchema>;

export const StockMovementReasonSchema = z.enum([
  "purchase",
  "sale",
  "loss",
  "return",
  "manual",
]);
export type StockMovementReason = z.infer<typeof StockMovementReasonSchema>;

export const StockMovementSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  type: StockMovementTypeSchema,
  quantity: z.number().int(),
  reason: StockMovementReasonSchema,
  note: z.string().optional(),
  createdAt: z.string().min(1),
  author: z.string().min(1),
});

export type StockMovement = z.infer<typeof StockMovementSchema>;
