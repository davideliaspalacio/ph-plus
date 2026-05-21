import type { ProductLike } from "@/src/features/catalog";

/**
 * Resultado scored del ranking. Score más alto = mejor match.
 */
export interface RankedProduct<P extends ProductLike = ProductLike> {
  product: P;
  score: number;
}

const DEFAULT_TOP_N = 10;

/**
 * Normaliza un string para comparación: lowercase, sin acentos, trim.
 *
 * Acompaña el mismo criterio que `applyFilters` en catalog.
 */
const normalize = (s: string): string =>
  s
    .normalize("NFD")
    // eslint-disable-next-line no-misleading-character-class
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/**
 * Calcula un score relevancia para un producto contra una query.
 *
 * Reglas:
 * - +5 si el title (normalizado) === query
 * - +3 si el title (normalizado) starts-with query
 * - +2 si el title (normalizado) includes query
 * - +1 si el tagline (normalizado) includes query
 *
 * Sólo cuenta el ranking más fuerte del title (no sumamos exact + starts + includes
 * a la vez). El tagline suma además del title si aplica.
 */
function scoreFor<P extends ProductLike>(product: P, q: string): number {
  const title = normalize(product.title);
  const tagline =
    typeof product.tagline === "string" ? normalize(product.tagline) : "";

  let titleScore = 0;
  if (title === q) {
    titleScore = 5;
  } else if (title.startsWith(q)) {
    titleScore = 3;
  } else if (title.includes(q)) {
    titleScore = 2;
  }

  const taglineScore = tagline.includes(q) ? 1 : 0;

  // Si no hay match en title, devolvemos sólo el de tagline (puede ser 0).
  // Si hay match en title fuerte, no necesitamos sumar el tagline para no
  // empujar artificialmente starts-with por encima de exact.
  if (titleScore > 0) return titleScore;
  return taglineScore;
}

/**
 * Rankea productos contra una query. Devuelve sólo los que matchean (score > 0),
 * ordenados desc por score, limitados a `topN`.
 *
 * Pura: no muta input, no toca React ni storage.
 */
export function rankProducts<P extends ProductLike>(
  products: P[],
  query: string,
  topN: number = DEFAULT_TOP_N,
): RankedProduct<P>[] {
  const q = normalize(query);
  if (!q) return [];

  const scored: RankedProduct<P>[] = [];
  for (const product of products) {
    const score = scoreFor(product, q);
    if (score > 0) scored.push({ product, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}
