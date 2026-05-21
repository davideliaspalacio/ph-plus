import type { Product } from "@/app/lib/products";

/**
 * Puerto del repositorio de productos del admin.
 *
 * - `list()` devuelve el catálogo "efectivo": seeds + productos custom (con
 *   override por slug si coinciden).
 * - `byId(slug)` busca por slug.
 * - `create(patch)` crea un Product nuevo y lo persiste.
 * - `update(slug, patch)` aplica patch parcial y persiste.
 * - `archive(slug)` marca `inStock = false` y, si existe la flag, `isActive`
 *   en el patch del admin (soft delete).
 * - `bulkUpdate(slugs, patch)` aplica el mismo patch a múltiples productos.
 *
 * Mañana, cuando esto vaya a Supabase, este puerto sigue intacto.
 */
export interface AdminProductRepository {
  list(): Promise<Product[]>;
  byId(slug: string): Promise<Product | null>;
  create(input: Product): Promise<Product>;
  update(slug: string, patch: Partial<Product>): Promise<Product>;
  archive(slug: string): Promise<Product>;
  bulkUpdate(slugs: string[], patch: Partial<Product>): Promise<Product[]>;
}
