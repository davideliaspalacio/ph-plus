import type { ProductCategory, ProductCore, ProductSize } from "./product";

export type ProductSort = "popular" | "price-asc" | "price-desc" | "newest";

export interface ProductFilters {
  q?: string;
  category?: ProductCategory;
  size?: ProductSize;
  promo?: boolean;
  minPrice?: number;
  maxPrice?: number;
  onlyInStock?: boolean;
  minRating?: number;
}

const normalize = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export function applyFilters<P extends ProductCore>(
  list: P[],
  f: ProductFilters,
): P[] {
  const q = f.q ? normalize(f.q) : null;
  return list.filter((p) => {
    if (q && !normalize(p.title).includes(q)) return false;
    if (f.category && p.category !== f.category) return false;
    if (f.size && p.size !== f.size) return false;
    if (f.promo && !p.prevPriceValue) return false;
    if (f.minPrice != null && p.priceValue < f.minPrice) return false;
    if (f.maxPrice != null && p.priceValue > f.maxPrice) return false;
    if (f.onlyInStock && p.inStock === false) return false;
    return true;
  });
}

export function applySort<P extends ProductCore>(
  list: P[],
  sort: ProductSort | undefined,
): P[] {
  if (!sort) return list;
  const arr = [...list];
  switch (sort) {
    case "popular":
      return arr.sort((a, b) => b.popularity - a.popularity);
    case "price-asc":
      return arr.sort((a, b) => a.priceValue - b.priceValue);
    case "price-desc":
      return arr.sort((a, b) => b.priceValue - a.priceValue);
    case "newest":
      // No tenemos createdAt en ProductCore todavía; se mantiene estable.
      return arr;
    default:
      return arr;
  }
}
