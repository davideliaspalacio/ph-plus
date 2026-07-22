import "server-only";

import { buildCartSummary as buildLegacySummary } from "@/app/lib/cart-summary";
import {
  buildCartSummary as buildSummaryDomain,
  type CartSummaryOptions,
  type CartItemInput,
} from "@/src/features/cart/domain/pricing";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

/**
 * Resolución de precios del lado del servidor.
 *
 * El total que se le cobra al cliente (y que viaja firmado a PayU) no puede
 * salir del catálogo hardcodeado de `app/lib/products.ts`: ese array y la tabla
 * `products` divergen apenas alguien toca un precio en el admin, y un producto
 * creado desde el admin ni siquiera existe en el array — quedaría sin precio.
 *
 * Con Supabase activo resolvemos contra la DB, que es la fuente de verdad. Sin
 * Supabase (modo mock) caemos al catálogo del código, que ahí sí es la fuente.
 *
 * Los productos inactivos o inexistentes se descartan: `buildCartSummary` omite
 * las líneas sin producto, así que el pedido termina en 0 y la ruta responde
 * "carrito sin productos válidos" en vez de cobrar un importe inventado.
 */

export type ServerCartLineProduct = {
  slug: string;
  title: string;
  priceValue: number;
};

export type ServerCartSummary = {
  lines: Array<{
    item: CartItemInput;
    product: ServerCartLineProduct;
    lineTotal: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
};

function isSupabaseEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase" &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

type ProductPriceRow = {
  slug: string;
  title: string;
  price_value: number | string;
  is_active: boolean;
};

/** Trae precio y título desde la DB para los slugs del carrito. */
async function fetchPricesFromDb(
  slugs: string[],
): Promise<Map<string, ServerCartLineProduct>> {
  const supabase = await createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug, title, price_value, is_active")
    .in("slug", slugs);

  if (error) {
    throw new Error(`No se pudieron leer los precios: ${error.message}`);
  }

  const byslug = new Map<string, ServerCartLineProduct>();
  for (const row of (data ?? []) as unknown as ProductPriceRow[]) {
    // Un producto desactivado no se vende, aunque siga en el carrito.
    if (!row.is_active) continue;
    byslug.set(row.slug, {
      slug: row.slug,
      title: row.title,
      priceValue: Number(row.price_value),
    });
  }
  return byslug;
}

/**
 * Arma el resumen del carrito con precios confiables. Úsalo en cualquier ruta
 * que cobre o persista un pedido — nunca `buildCartSummary` a secas.
 */
export async function buildCartSummaryServer(
  items: CartItemInput[],
  options: CartSummaryOptions = {},
): Promise<ServerCartSummary> {
  if (!isSupabaseEnabled()) {
    const legacy = buildLegacySummary(items, options);
    return {
      lines: legacy.lines.map((line) => ({
        item: line.item,
        product: {
          slug: line.product.slug,
          title: line.product.title,
          priceValue: line.product.priceValue,
        },
        lineTotal: line.lineTotal,
      })),
      subtotal: legacy.subtotal,
      shipping: legacy.shipping,
      total: legacy.total,
    };
  }

  const slugs = [...new Set(items.map((i) => i.slug))];
  const prices = await fetchPricesFromDb(slugs);
  const summary = buildSummaryDomain<ServerCartLineProduct>(
    items,
    (slug) => prices.get(slug),
    options,
  );

  return {
    lines: summary.lines,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total,
  };
}
