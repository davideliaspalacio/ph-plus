import Image from "next/image";

import ProductVisual from "./ProductVisual";
import type { Product } from "../lib/products";

type ProductThumbProps = {
  product: Pick<Product, "gallery" | "title" | "visualKey">;
  className?: string;
  sizes?: string;
};

export default function ProductThumb({
  product,
  className = "h-full w-full",
  sizes = "96px",
}: ProductThumbProps) {
  const image = product.gallery.find((item) => item.src);

  if (image?.src) {
    return (
      <Image
        src={image.src}
        alt={image.caption || product.title}
        width={220}
        height={220}
        sizes={sizes}
        className={`object-contain ${className}`}
      />
    );
  }

  return <ProductVisual visualKey={product.visualKey} className={className} />;
}
