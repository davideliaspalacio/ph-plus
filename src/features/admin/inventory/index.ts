/**
 * API pública de la feature `admin/inventory`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  StockItemSchema,
  StockMovementSchema,
  StockMovementTypeSchema,
  StockMovementReasonSchema,
  type StockItem,
  type StockMovement,
  type StockMovementType,
  type StockMovementReason,
} from "./domain/stock";

export { applyMovement, INSUFFICIENT_STOCK } from "./domain/compute";

export { inventoryRepo } from "./data";
export type {
  InventoryRepository,
  NewStockMovementInput,
  AdjustStockResult,
} from "./data/ports";
