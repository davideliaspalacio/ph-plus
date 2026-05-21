/**
 * Helpers para normalizar slugs en kebab-case ASCII.
 *
 * `toSlug` se usa tanto en el form (cuando el admin tipea el slug) como en
 * cualquier "generar slug a partir del título". No depende de runtime de Next.
 */

// Rango Unicode "Combining Diacritical Marks" U+0300..U+036F (acentos, tildes,
// diéresis, etc.) que quedan separados tras `normalize("NFD")`.
const COMBINING_MARKS = /[̀-ͯ]/g;

export function toSlug(input: string): string {
  if (input == null) return "";
  const decomposed = input.normalize("NFD");
  const stripped = decomposed.replace(COMBINING_MARKS, "");
  const lower = stripped.toLowerCase();
  const dashed = lower.replace(/[^a-z0-9]+/g, "-");
  return dashed.replace(/-+/g, "-").replace(/^-|-$/g, "");
}
