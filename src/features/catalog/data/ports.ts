import type { ProductLike } from "../domain/product";
import type { ProductFilters, ProductSort } from "../domain/filters";

export interface ProductListInput {
  filters?: ProductFilters;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
}

export interface ProductListResult<P extends ProductLike = ProductLike> {
  items: P[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ProductRepository<P extends ProductLike = ProductLike> {
  list(input?: ProductListInput): Promise<ProductListResult<P>>;
  bySlug(slug: string): Promise<P | null>;
  search(q: string): Promise<P[]>;
}
