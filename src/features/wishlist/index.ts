/**
 * API pública de la feature `wishlist`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  useWishlist,
  WISHLIST_STORAGE_KEY,
  type WishlistState,
} from "./store/useWishlist";

export {
  add,
  contains,
  count,
  remove,
  toggle,
  type NowFn,
  type WishlistItem,
} from "./domain/wishlist";
