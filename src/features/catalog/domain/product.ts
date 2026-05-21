import { z } from "zod";

/**
 * Schemas y tipos del dominio de catálogo.
 *
 * Compatible con el shape existente en `app/lib/products.ts` (que sigue como
 * seed). Una vez que migremos a Supabase, este será el contrato canónico.
 */

export const PRODUCT_CATEGORIES = [
  "botellon",
  "garrafa",
  "recarga",
  "kit",
  "promocion",
] as const;
export const ProductCategoryEnum = z.enum(PRODUCT_CATEGORIES);
export type ProductCategory = z.infer<typeof ProductCategoryEnum>;

export const PRODUCT_SIZES = ["1L", "1.5L", "5L", "19L", "kit"] as const;
export const ProductSizeEnum = z.enum(PRODUCT_SIZES);
export type ProductSize = z.infer<typeof ProductSizeEnum>;

export const VisualKeyEnum = z.enum(["kit", "garrafas", "recargas"]);
export type ProductVisualKey = z.infer<typeof VisualKeyEnum>;

export const ProductCoreSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  priceValue: z.number().int().nonnegative(),
  prevPriceValue: z.number().int().positive().optional(),
  category: ProductCategoryEnum,
  size: ProductSizeEnum,
  popularity: z.number().int().nonnegative(),
  inStock: z.boolean().optional(),
  highlight: z.boolean().optional(),
  tagline: z.string().min(1),
  visualKey: VisualKeyEnum,
});

export type ProductCore = z.infer<typeof ProductCoreSchema>;

/**
 * Para mantener compat con el resto de la app (PRODUCTS de app/lib/products.ts
 * tiene campos extra: gallery, specs, usage, reviews, rating, badge,
 * description, longDescription, features, includes, price string).
 * Por eso usamos un type genérico abierto a esos campos extra.
 */
export type ProductLike = ProductCore & Record<string, unknown>;
