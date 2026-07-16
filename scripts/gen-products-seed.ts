/**
 * Genera `supabase/seed.products.sql` a partir del catálogo real que vive en
 * `app/lib/products.ts`.
 *
 * Correr:  npx tsx scripts/gen-products-seed.ts
 *
 * El SQL resultante es idempotente (upsert por slug), así que se puede correr
 * cuantas veces haga falta: cuando cambien precios o se agreguen productos,
 * regenerá y volvé a correrlo.
 */

import { writeFileSync } from "node:fs";
import { PRODUCTS } from "../app/lib/products";

/** Escapa comillas simples para literales SQL. */
function q(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/** Serializa a jsonb. */
function j(value: unknown): string {
  return `${q(JSON.stringify(value))}::jsonb`;
}

const COLUMNS = [
  "slug",
  "title",
  "short_title",
  "tagline",
  "description",
  "long_description",
  "features",
  "includes",
  "price_value",
  "prev_price_value",
  "category",
  "size",
  "visual_key",
  "popularity",
  "highlight",
  "badge",
  "gallery",
  "specs",
  "usage",
  "rating_average",
  "rating_count",
  "is_active",
  "in_stock",
];

/** Columnas que se refrescan en el upsert (todas menos la PK). */
const UPDATABLE = COLUMNS.filter((c) => c !== "slug");

const rows = PRODUCTS.map((p) =>
  [
    "  (",
    `    ${q(p.slug)},`,
    `    ${q(p.title)},`,
    `    ${q(p.shortTitle)},`,
    `    ${q(p.tagline)},`,
    `    ${q(p.description)},`,
    `    ${j(p.longDescription)},`,
    `    ${j(p.features)},`,
    `    ${j(p.includes)},`,
    `    ${p.priceValue}, ${p.prevPriceValue ?? "null"},`,
    `    ${q(p.category)}, ${q(p.size)}, ${q(p.visualKey)},`,
    `    ${p.popularity}, ${p.highlight ? "true" : "false"},`,
    `    ${p.badge ? j(p.badge) : "null"},`,
    `    ${j(p.gallery)},`,
    `    ${j(p.specs)},`,
    `    ${j(p.usage)},`,
    `    ${p.rating.average}, ${p.rating.count},`,
    `    true, ${p.inStock === false ? "false" : "true"}`,
    "  )",
  ].join("\n"),
).join(",\n");

const sql = `-- ─────────────────────────────────────────────────────────────────────────────
-- Catálogo REAL de PH PLUS (${PRODUCTS.length} productos).
--
-- GENERADO AUTOMÁTICAMENTE — no editar a mano.
-- Fuente: app/lib/products.ts
-- Regenerar: npx tsx scripts/gen-products-seed.ts
--
-- Idempotente: upsert por slug. Se puede correr las veces que haga falta.
-- ─────────────────────────────────────────────────────────────────────────────

insert into public.products (
  ${COLUMNS.join(", ")}
) values
${rows}
on conflict (slug) do update set
${UPDATABLE.map((c) => `  ${c} = excluded.${c}`).join(",\n")},
  updated_at = timezone('utc', now());

-- Inventario inicial SÓLO para productos que todavía no tienen SKU asignado.
-- No toca los SKUs curados a mano en seed.sql.
insert into public.stock_items (sku, product_slug, current, low)
select 'SKU-' || upper(p.slug), p.slug, 50, 10
from public.products p
where not exists (
  select 1 from public.stock_items s where s.product_slug = p.slug
)
on conflict (sku) do nothing;
`;

const out = new URL("../supabase/seed.products.sql", import.meta.url);
writeFileSync(out, sql, "utf8");
console.log(
  `✔ ${PRODUCTS.length} productos → supabase/seed.products.sql (${sql.length} bytes)`,
);
