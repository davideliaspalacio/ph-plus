/**
 * API pública de la feature `admin/products`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export { toSlug } from "./domain/slug";
export {
  ProductFormSchema,
  PRODUCT_FORM_DEFAULTS,
  type ProductFormValues,
} from "./domain/product-form";

export { adminProductRepo } from "./data";
export type { AdminProductRepository } from "./data/ports";

export { ProductsTable, type ProductsTableProps } from "./ui/ProductsTable";
export { ProductForm, type ProductFormProps } from "./ui/ProductForm";
