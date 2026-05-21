/**
 * Reglas puras del dominio Wishlist.
 *
 * No depende de React, ni de Next, ni de browser APIs. Todas las funciones
 * son inmutables: nunca mutan el array de entrada.
 *
 * El `now` se inyecta para mantener los tests deterministas. El default usa
 * `new Date().toISOString()`.
 */

export type WishlistItem = {
  slug: string;
  /** ISO string del momento en que se agregó a la wishlist. */
  addedAt: string;
};

export type NowFn = () => string;

const defaultNow: NowFn = () => new Date().toISOString();

export function contains(list: WishlistItem[], slug: string): boolean {
  return list.some((i) => i.slug === slug);
}

export function count(list: WishlistItem[]): number {
  return list.length;
}

export function add(
  list: WishlistItem[],
  slug: string,
  now: NowFn = defaultNow,
): WishlistItem[] {
  if (contains(list, slug)) {
    // Idempotente: no duplicamos ni actualizamos addedAt.
    return list.slice();
  }
  return [...list, { slug, addedAt: now() }];
}

export function remove(list: WishlistItem[], slug: string): WishlistItem[] {
  return list.filter((i) => i.slug !== slug);
}

export function toggle(
  list: WishlistItem[],
  slug: string,
  now: NowFn = defaultNow,
): WishlistItem[] {
  return contains(list, slug) ? remove(list, slug) : add(list, slug, now);
}
