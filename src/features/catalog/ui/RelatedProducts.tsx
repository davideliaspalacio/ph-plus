"use client";

import type { Product } from "@/app/lib/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/src/shared/lib/cn";

export interface RelatedProductsProps {
  current: Product;
  all: Product[];
  /** Cuántos mostrar como máximo (default 4). */
  max?: number;
  title?: string;
  onAdd?: (product: Product) => void;
  className?: string;
}

/**
 * Lista productos de la misma categoría (excluyendo el actual), slice(0, max).
 * Si no hay coincidencias, no renderiza nada.
 */
export function RelatedProducts({
  current,
  all,
  max = 4,
  title = "Otros productos",
  onAdd,
  className,
}: RelatedProductsProps) {
  const related = all
    .filter((p) => p.category === current.category && p.slug !== current.slug)
    .slice(0, max);

  if (related.length === 0) return null;

  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <h2 className="text-[18px] font-extrabold uppercase tracking-[0.04em] text-brand sm:text-[22px] lg:text-[24px]">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p) => (
          <ProductCard key={p.slug} product={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
