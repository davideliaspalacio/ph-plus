import type { StockItem, StockMovement } from "../domain/stock";

/**
 * Puerto del repositorio de inventario.
 *
 * Misma estrategia que el resto de las features: la UI / hooks consumen este
 * contrato, y mañana una `SupabaseInventoryRepo` lo cumple sin tocar nada más.
 */

/** Input para `adjustStock`: el movimiento sin `id` ni `createdAt` (el repo los completa). */
export type NewStockMovementInput = Omit<StockMovement, "id" | "createdAt">;

export interface AdjustStockResult {
  stock: StockItem;
  movement: StockMovement;
}

export interface InventoryRepository {
  /** Lista todos los SKUs en stock. */
  listStock(): Promise<StockItem[]>;
  /** Obtiene un SKU puntual; `null` si no existe. */
  getStock(sku: string): Promise<StockItem | null>;
  /**
   * Aplica un movimiento al SKU indicado.
   * - Lee el stock actual, recalcula con `applyMovement`, persiste el nuevo `current`.
   * - Appendea el movimiento (asignando `id` + `createdAt`).
   * - Lanza si el SKU no existe o si el movimiento dejaría stock inválido.
   */
  adjustStock(
    sku: string,
    movement: NewStockMovementInput,
  ): Promise<AdjustStockResult>;
  /**
   * Lista movimientos.
   * - Si se pasa `sku`, filtra a ese SKU.
   * - Ordena por `createdAt` desc.
   */
  listMovements(sku?: string): Promise<StockMovement[]>;
  /**
   * Crea StockItems iniciales para los slugs dados con stock random 5..50.
   * Idempotente: si ya existe un item para ese slug, lo respeta.
   */
  seedFromProducts(slugs: string[]): Promise<StockItem[]>;
}
