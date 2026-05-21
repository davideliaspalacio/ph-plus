import type { Product } from "@/app/lib/products";
import { applyFilters, applySort } from "../domain/filters";
import type {
  ProductCategory,
  ProductSize,
  ProductVisualKey,
} from "../domain/product";
import type {
  ProductListInput,
  ProductListResult,
  ProductRepository,
} from "./ports";

/**
 * Repo de productos contra Supabase.
 *
 * La tabla `public.products` usa snake_case (price_value, prev_price_value,
 * visual_key, etc.) mientras que el shape `Product` legacy que consume la UI
 * está en camelCase con algunos campos derivados (price string, prevPrice,
 * reviews array, rating object). Acá hacemos el mapeo en memoria.
 *
 * Filtros/orden/paginado: por ahora se aplican EN MEMORIA después de traer
 * todo del DB. El catálogo es pequeño (~12 productos). Cuando crezca lo
 * movemos a SQL.
 */

interface ProductDbRow {
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
  badge: { title: string; sub: string } | null;
  gallery: unknown;
  specs: unknown;
  usage: unknown;
  rating_average: number | string;
  rating_count: number;
  is_active: boolean;
  in_stock: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

function formatPrice(value: number): string {
  // Formato COP estilo "$85.000"
  return `$${value.toLocaleString("es-CO")}`;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toSpecArray(value: unknown): Product["specs"] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is Product["specs"][number] =>
      typeof v === "object" &&
      v !== null &&
      typeof (v as { label?: unknown }).label === "string" &&
      typeof (v as { value?: unknown }).value === "string",
  );
}

function toGallery(value: unknown): Product["gallery"] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is Product["gallery"][number] =>
      typeof v === "object" &&
      v !== null &&
      typeof (v as { visualKey?: unknown }).visualKey === "string" &&
      typeof (v as { bg?: unknown }).bg === "string" &&
      typeof (v as { caption?: unknown }).caption === "string",
  );
}

function mapRow(row: ProductDbRow): Product {
  const priceValue = Number(row.price_value);
  const prevPriceValue =
    row.prev_price_value != null ? Number(row.prev_price_value) : undefined;

  const product: Product = {
    slug: row.slug,
    visualKey: row.visual_key,
    title: row.title,
    shortTitle: row.short_title,
    price: formatPrice(priceValue),
    priceValue,
    tagline: row.tagline,
    description: row.description,
    longDescription: toStringArray(row.long_description),
    features: toStringArray(row.features),
    includes: toStringArray(row.includes),
    category: row.category,
    size: row.size,
    popularity: row.popularity,
    gallery: toGallery(row.gallery),
    specs: toSpecArray(row.specs),
    usage: toStringArray(row.usage),
    // En el legacy Product, `reviews` es un array de "testimonios" estáticos
    // (no la entidad Review de moderación). Hasta que tengamos esa columna,
    // dejamos vacío — la PDP ya soporta el caso vacío.
    reviews: [],
    rating: {
      average: Number(row.rating_average) || 0,
      count: row.rating_count,
    },
  };

  if (prevPriceValue != null) {
    product.prevPrice = formatPrice(prevPriceValue);
    product.prevPriceValue = prevPriceValue;
  }
  if (row.highlight) product.highlight = true;
  if (row.badge) product.badge = row.badge;
  product.inStock = row.in_stock;

  return product;
}

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

async function fetchAll(): Promise<Product[]> {
  const supabase = await getClient();
  // Cast: el `Database` skeleton declara Row=Product (camelCase) pero la tabla
  // real es snake_case. Vamos por `unknown` y reinterpretamos.
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (error) {
    throw new Error(`SupabaseProductRepo: ${error.message}`);
  }
  const rows = (data ?? []) as unknown as ProductDbRow[];
  return rows.map(mapRow);
}

export class SupabaseProductRepo implements ProductRepository<Product> {
  async list(
    input: ProductListInput = {},
  ): Promise<ProductListResult<Product>> {
    const all = await fetchAll();
    const filtered = applyFilters(all, input.filters ?? {});
    const sorted = applySort(filtered, input.sort);

    const perPage = input.perPage ?? sorted.length;
    const page = Math.max(1, input.page ?? 1);
    const start = (page - 1) * perPage;
    const items = sorted.slice(start, start + perPage);

    return {
      items,
      total: sorted.length,
      page,
      perPage,
      totalPages: Math.max(1, Math.ceil(sorted.length / perPage)),
    };
  }

  async bySlug(slug: string): Promise<Product | null> {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      throw new Error(`SupabaseProductRepo.bySlug: ${error.message}`);
    }
    if (!data) return null;
    return mapRow(data as unknown as ProductDbRow);
  }

  async search(q: string): Promise<Product[]> {
    const all = await fetchAll();
    return applyFilters(all, { q });
  }
}
