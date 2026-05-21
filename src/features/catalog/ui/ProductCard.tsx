"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/app/lib/products";
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
        <Link
          href={`/productos/${product.slug}`}
          className="block aspect-square w-full overflow-hidden bg-gradient-to-b from-accent-cyan/15 to-white"
        >
          <Image
            src={`/products/${product.slug}.png`}
            alt={product.title}
            width={400}
            height={400}
            className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
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

        <Link
          href={`/productos/${product.slug}`}
          className="text-[15px] font-extrabold leading-tight text-brand transition-colors hover:text-brand-dark"
        >
          <h3>{product.title}</h3>
        </Link>

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
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Añadir al carrito
          </button>
        )}
      </div>
    </article>
  );
}
