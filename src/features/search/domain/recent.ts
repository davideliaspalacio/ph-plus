/**
 * Lógica pura del historial de búsquedas recientes.
 *
 * No toca React ni storage. El store en `store/useSearchHistory` es quien
 * persiste; este módulo sólo describe la transformación inmutable.
 */

const DEFAULT_MAX = 5;

/**
 * Devuelve una nueva lista con `q` colocada al inicio.
 *
 * - Si `q` ya existía (comparación case-insensitive + trim), lo "mueve" al inicio
 *   eliminando la ocurrencia anterior. La nueva entrada conserva el casing
 *   recibido en la llamada (lo más reciente sobreescribe).
 * - Capa la lista a `max` elementos.
 * - Si `q` es vacía o sólo whitespace, devuelve la lista original (misma referencia).
 * - Nunca muta `list`.
 */
export function addRecent(
  list: readonly string[],
  q: string,
  max: number = DEFAULT_MAX,
): string[] {
  const trimmed = q.trim();
  if (!trimmed) return list as string[];

  const keyOf = (s: string) => s.trim().toLowerCase();
  const newKey = keyOf(trimmed);

  const filtered = list.filter((item) => keyOf(item) !== newKey);
  const next = [trimmed, ...filtered];
  return next.slice(0, Math.max(0, max));
}
