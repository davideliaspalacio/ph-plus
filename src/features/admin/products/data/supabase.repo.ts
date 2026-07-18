import {
  formatCOP,
  type Product,
  type ProductCategory,
  type ProductSize,
  type ProductVisualKey,
  type GalleryImage,
  type SpecRow,
  type Review,
} from "@/app/lib/products";
import type { AdminProductRepository } from "./ports";

/**
 * Implementación Supabase del AdminProductRepository.
 *
 * A diferencia del mock (que mergea seeds + overrides en localStorage), acá
 * la tabla `products` YA tiene los seeds insertados desde `supabase/seed.sql`.
 * Por lo tanto `list()` simplemente devuelve los rows tal cual.
 *
 * Conversiones:
 *  - snake_case ↔ camelCase
 *  - `price` (string formateado) se reconstruye desde `price_value` con `formatCOP`
 *  - `reviews` no se persiste en DB: se devuelve `[]` (las reviews reales viven
 *    en la tabla `reviews`, no acá)
 */

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

type ProductRow = {
  slug: string;
  title: string;
  short_title: string;
  tagline: string;
  description: string;
  long_description: unknown;
  features: unknown;
  includes: unknown;
  price_value: number;
  prev_price_value: number | null;
  category: ProductCategory;
  size: ProductSize;
  visual_key: ProductVisualKey;
  popularity: number;
  highlight: boolean;
  badge: unknown;
  gallery: unknown;
  specs: unknown;
  usage: unknown;
  rating_average: number;
  rating_count: number;
  is_active: boolean;
  in_stock: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
};

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function asGallery(v: unknown): GalleryImage[] {
  return Array.isArray(v) ? (v as GalleryImage[]) : [];
}

function asSpecs(v: unknown): SpecRow[] {
  return Array.isArray(v) ? (v as SpecRow[]) : [];
}

function asBadge(v: unknown): { title: string; sub: string } | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  if (typeof o.title === "string" && typeof o.sub === "string") {
    return { title: o.title, sub: o.sub };
  }
  return undefined;
}

function mapRow(row: ProductRow): Product {
  const product: Product = {
    slug: row.slug,
    visualKey: row.visual_key,
    title: row.title,
    shortTitle: row.short_title,
    price: formatCOP(row.price_value),
    priceValue: row.price_value,
    tagline: row.tagline,
    description: row.description,
    longDescription: asStringArray(row.long_description),
    features: asStringArray(row.features),
    includes: asStringArray(row.includes),
    category: row.category,
    size: row.size,
    popularity: row.popularity,
    inStock: row.in_stock,
    gallery: asGallery(row.gallery),
    specs: asSpecs(row.specs),
    usage: asStringArray(row.usage),
    reviews: [] as Review[],
    rating: { average: row.rating_average, count: row.rating_count },
  };

  if (row.prev_price_value != null) {
    product.prevPrice = formatCOP(row.prev_price_value);
    product.prevPriceValue = row.prev_price_value;
  }
  if (row.highlight) {
    product.highlight = true;
  }
  const badge = asBadge(row.badge);
  if (badge) {
    product.badge = badge;
  }

  return product;
}

type ProductPatchDb = Partial<{
  title: string;
  short_title: string;
  tagline: string;
  description: string;
  long_description: string[];
  features: string[];
  includes: string[];
  price_value: number;
  prev_price_value: number | null;
  category: ProductCategory;
  size: ProductSize;
  visual_key: ProductVisualKey;
  popularity: number;
  highlight: boolean;
  badge: { title: string; sub: string } | null;
  gallery: GalleryImage[];
  specs: SpecRow[];
  usage: string[];
  rating_average: number;
  rating_count: number;
  is_active: boolean;
  in_stock: boolean;
  meta_title: string | null;
  meta_description: string | null;
}>;

function toDbPatch(patch: Partial<Product>): ProductPatchDb {
  const out: ProductPatchDb = {};
  if (patch.title !== undefined) out.title = patch.title;
  if (patch.shortTitle !== undefined) out.short_title = patch.shortTitle;
  if (patch.tagline !== undefined) out.tagline = patch.tagline;
  if (patch.description !== undefined) out.description = patch.description;
  if (patch.longDescription !== undefined) out.long_description = patch.longDescription;
  if (patch.features !== undefined) out.features = patch.features;
  if (patch.includes !== undefined) out.includes = patch.includes;
  if (patch.priceValue !== undefined) out.price_value = patch.priceValue;
  if (patch.prevPriceValue !== undefined) out.prev_price_value = patch.prevPriceValue;
  if (patch.category !== undefined) out.category = patch.category;
  if (patch.size !== undefined) out.size = patch.size;
  if (patch.visualKey !== undefined) out.visual_key = patch.visualKey;
  if (patch.popularity !== undefined) out.popularity = patch.popularity;
  if (patch.highlight !== undefined) out.highlight = patch.highlight;
  if (patch.badge !== undefined) out.badge = patch.badge ?? null;
  if (patch.gallery !== undefined) out.gallery = patch.gallery;
  if (patch.specs !== undefined) out.specs = patch.specs;
  if (patch.usage !== undefined) out.usage = patch.usage;
  if (patch.rating !== undefined) {
    out.rating_average = patch.rating.average;
    out.rating_count = patch.rating.count;
  }
  if (patch.inStock !== undefined) out.in_stock = patch.inStock;

  // El form del admin manda estos campos fuera del shape de `Product` (vía el
  // `values as Partial<Product>` de la page). Sin este mapeo, el checkbox
  // "Activo" y la pestaña SEO se descartaban en silencio.
  const extra = patch as Partial<Product> & {
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
  };
  if (extra.isActive !== undefined) out.is_active = extra.isActive;
  if (extra.metaTitle !== undefined) out.meta_title = extra.metaTitle || null;
  if (extra.metaDescription !== undefined) {
    out.meta_description = extra.metaDescription || null;
  }
  return out;
}

function toDbInsert(input: Product): Record<string, unknown> {
  return {
    slug: input.slug,
    title: input.title,
    short_title: input.shortTitle,
    tagline: input.tagline,
    description: input.description,
    long_description: input.longDescription,
    features: input.features,
    includes: input.includes,
    price_value: input.priceValue,
    prev_price_value: input.prevPriceValue ?? null,
    category: input.category,
    size: input.size,
    visual_key: input.visualKey,
    popularity: input.popularity,
    highlight: input.highlight ?? false,
    badge: input.badge ?? null,
    gallery: input.gallery,
    specs: input.specs,
    usage: input.usage,
    rating_average: input.rating.average,
    rating_count: input.rating.count,
    is_active: true,
    in_stock: input.inStock ?? true,
  };
}

export class SupabaseAdminProductRepo implements AdminProductRepository {
  async list(): Promise<Product[]> {
    const client = await getClient();
    const { data, error } = await client
      .from("products")
      .select("*")
      .order("popularity", { ascending: false });
    if (error) throw new Error(`products.list: ${error.message}`);
    return ((data ?? []) as unknown as ProductRow[]).map(mapRow);
  }

  async byId(slug: string): Promise<Product | null> {
    const client = await getClient();
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw new Error(`products.byId: ${error.message}`);
    return data ? mapRow(data as unknown as ProductRow) : null;
  }

  async create(input: Product): Promise<Product> {
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("products") as any;
    const { data, error } = await table
      .insert(toDbInsert(input))
      .select("*")
      .single();
    if (error) throw new Error(`products.create: ${error.message}`);
    return mapRow(data as unknown as ProductRow);
  }

  async update(slug: string, patch: Partial<Product>): Promise<Product> {
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("products") as any;
    const { data, error } = await table
      .update(toDbPatch(patch))
      .eq("slug", slug)
      .select("*")
      .single();
    if (error) throw new Error(`products.update: ${error.message}`);
    if (!data) throw new Error(`Product "${slug}" not found`);
    return mapRow(data as unknown as ProductRow);
  }

  async archive(slug: string): Promise<Product> {
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("products") as any;
    const { data, error } = await table
      .update({ is_active: false, in_stock: false })
      .eq("slug", slug)
      .select("*")
      .single();
    if (error) throw new Error(`products.archive: ${error.message}`);
    if (!data) throw new Error(`Product "${slug}" not found`);
    return mapRow(data as unknown as ProductRow);
  }

  async bulkUpdate(slugs: string[], patch: Partial<Product>): Promise<Product[]> {
    if (slugs.length === 0) return [];
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("products") as any;
    const { data, error } = await table
      .update(toDbPatch(patch))
      .in("slug", slugs)
      .select("*");
    if (error) throw new Error(`products.bulkUpdate: ${error.message}`);
    return ((data ?? []) as unknown as ProductRow[]).map(mapRow);
  }
}
