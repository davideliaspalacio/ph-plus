"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useWishlist } from "@/src/features/wishlist";
import { Button, EmptyState } from "@/src/shared/ui";
import { ProductCard } from "@/src/features/catalog";
import { PRODUCTS } from "@/app/lib/products";
import { useCart } from "@/src/features/cart/store/useCart";

export function WishlistList() {
  const items = useWishlist((s) => s.items);
  const addItemToCart = useCart((s) => s.addItem);

  const products = useMemo(
    () =>
      items
        .map((it) => PRODUCTS.find((p) => p.slug === it.slug))
        .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p)),
    [items],
  );

  if (products.length === 0) {
    return (
      <EmptyState
        title="Tu lista de favoritos está vacía"
        description="Tocá el corazón en cualquier producto para guardarlo."
        action={
          <Link href="/productos">
            <Button>Ver productos</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard
          key={p.slug}
          product={p}
          onAdd={(prod) => addItemToCart(prod.slug, 1)}
        />
      ))}
    </div>
  );
}
