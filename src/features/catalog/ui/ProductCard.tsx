"use client";

import type { Product } from "@/app/lib/products";
import ProductVisual from "@/app/components/ProductVisual";
import { Badge } from "@/src/shared/ui";
import { formatCOP } from "@/src/shared/lib/format";
import { cn } from "@/src/shared/lib/cn";
import { WishlistButton } from "@/src/features/account/ui/WishlistButton";

export interface ProductCardProps {
  product: Product;
  onAdd?: (product: Product) => void;
  className?: string;
}

export function ProductCard({ product, onAdd, className }: ProductCardProps) {
  const inStock = product.inStock !== false;
  const promo = Boolean(product.prevPriceValue);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-card-border bg-white transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative">
        <div className="grid aspect-square w-full place-items-center overflow-hidden bg-gradient-to-b from-accent-cyan/15 to-white p-6">
          <ProductVisual
            visualKey={product.visualKey}
            className="h-full w-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton slug={product.slug} size="md" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <div className="flex items-start gap-2">
          {promo && inStock && <Badge tone="warning">Promo</Badge>}
          {!inStock && <Badge tone="danger">Agotado</Badge>}
          {product.highlight && inStock && (
            <Badge tone="brand">Top ventas</Badge>
          )}
          {product.rating && (
            <span className="ml-auto inline-flex items-center gap-1 text-[12px] text-ink-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M12 2l2.9 6.3 6.9.8-5.2 4.6 1.6 6.8L12 16.8 5.8 20.5l1.6-6.8L2.2 9.1l6.9-.8L12 2z"
                  fill="#f5b50a"
                />
              </svg>
              {product.rating.average.toFixed(1)} ({product.rating.count})
            </span>
          )}
        </div>

        <div className="text-[15px] font-extrabold leading-tight text-brand">
          <h3>{product.title}</h3>
        </div>

        <p className="line-clamp-2 text-[13px] text-ink-muted">
          {product.tagline}
        </p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[18px] font-extrabold text-brand">
            {product.price ?? formatCOP(product.priceValue)}
          </span>
          {promo && product.prevPriceValue && (
            <span className="text-[13px] text-ink-muted line-through">
              {product.prevPrice ?? formatCOP(product.prevPriceValue)}
            </span>
          )}
        </div>

        {inStock && onAdd && (
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-4 text-center text-[13px] font-semibold leading-none text-white transition-colors hover:bg-brand-dark"
          >
            <span className="block leading-none">Comprar ahora</span>
          </button>
        )}
      </div>
    </article>
  );
}
