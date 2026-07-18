import { z } from "zod";
import {
  ProductCategoryEnum,
  ProductSizeEnum,
  VisualKeyEnum,
} from "@/src/features/catalog";
import { toSlug } from "./slug";

/**
 * Schema del formulario de productos del admin.
 *
 * Es un dominio aparte del `ProductCoreSchema` del catálogo:
 * - Acá vivimos los campos editables por el admin (que pueden estar vacíos
 *   mientras se rellena el form).
 * - El slug se normaliza automáticamente a kebab-case si viene "raw" (con
 *   espacios, acentos, etc.). Si después de normalizar queda vacío, falla.
 * - `prevPriceValue` (precio anterior / "compareAt"), si se provee, debe ser
 *   mayor que `priceValue` — si no, no tiene sentido marcarlo como rebaja.
 */

export const ProductFormSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug requerido")
      .transform((s) => toSlug(s))
      .refine((s) => s.length > 0, "Slug inválido"),
    title: z.string().min(3, "Mínimo 3 caracteres"),
    shortTitle: z.string().min(1, "Título corto requerido"),
    tagline: z.string().min(1, "Tagline requerida"),
    description: z.string().min(1, "Descripción requerida"),
    priceValue: z
      .number()
      .int("Debe ser entero")
      .nonnegative("No puede ser negativo"),
    prevPriceValue: z
      .number()
      .int()
      .positive()
      .optional(),
    category: ProductCategoryEnum,
    size: ProductSizeEnum,
    visualKey: VisualKeyEnum,
    popularity: z
      .number()
      .int("Debe ser entero")
      .min(0, "Mín 0")
      .max(100, "Máx 100"),
    isActive: z.boolean(),
    // Galería: fotos subidas al Storage (`src`) y/o ilustraciones legacy.
    gallery: z
      .array(
        z.object({
          visualKey: VisualKeyEnum,
          bg: z.string(),
          caption: z.string(),
          src: z.string().url().optional(),
        }),
      )
      .default([]),
    // Campos opcionales de SEO.
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (
      typeof val.prevPriceValue === "number" &&
      val.prevPriceValue <= val.priceValue
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["prevPriceValue"],
        message: "Debe ser mayor al precio actual",
      });
    }
  });

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

/** Valores por defecto para un producto nuevo. */
export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  slug: "",
  title: "",
  shortTitle: "",
  tagline: "",
  description: "",
  priceValue: 0,
  prevPriceValue: undefined,
  category: "botellon",
  size: "19L",
  visualKey: "garrafas",
  popularity: 50,
  isActive: true,
  gallery: [],
  metaTitle: undefined,
  metaDescription: undefined,
};
