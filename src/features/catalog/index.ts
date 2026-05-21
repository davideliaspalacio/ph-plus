/**
 * API pública de la feature `catalog`.
 */

export {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
  ProductCategoryEnum,
  ProductSizeEnum,
  VisualKeyEnum,
  type ProductCategory,
  type ProductSize,
  type ProductVisualKey,
  type ProductCore,
  type ProductLike,
} from "./domain/product";

export {
  applyFilters,
  applySort,
  type ProductFilters,
  type ProductSort,
} from "./domain/filters";

export { productRepo } from "./data";
export type {
  ProductRepository,
  ProductListInput,
  ProductListResult,
} from "./data/ports";

export { useCatalogStore, type CatalogState } from "./store/useCatalogStore";

export { ProductCard, type ProductCardProps } from "./ui/ProductCard";
export {
  ProductDetail,
  type ProductDetailProps,
} from "./ui/ProductDetail";
export {
  ProductGalleryFeature,
  type ProductGalleryFeatureProps,
  type GalleryItem,
} from "./ui/ProductGalleryFeature";
export { ProductInfo, type ProductInfoProps } from "./ui/ProductInfo";
export {
  RelatedProducts,
  type RelatedProductsProps,
} from "./ui/RelatedProducts";
