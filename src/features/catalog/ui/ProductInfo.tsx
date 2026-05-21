"use client";

import { useState, type FormEvent } from "react";
import type { Product } from "@/app/lib/products";
import { Badge, Button, Input } from "@/src/shared/ui";
import { formatCOP } from "@/src/shared/lib/format";
import { cn } from "@/src/shared/lib/cn";
import { useCart } from "@/src/features/cart/store/useCart";

export interface ProductInfoProps {
  product: Product;
  /** Si se provee, se usa en lugar del store de carrito. */
  onAdd?: (product: Product, qty: number) => void;
  /** Renderiza el bloque sticky-CTA-mobile envuelto en `lg:hidden`. */
  showStickyCta?: boolean;
  className?: string;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} de 5 estrellas`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < Math.round(rating) ? "#f6c84a" : "#e5e6ea"}
          aria-hidden
        >
          <path d="M12 2.5l3 6 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.9 2.7 1.1-6.5L2.5 9.4 9 8.5z" />
        </svg>
      ))}
    </div>
  );
}

export function ProductInfo({
  product,
  onAdd,
  showStickyCta = true,
  className,
}: ProductInfoProps) {
  const [qty, setQty] = useState(1);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyDone, setNotifyDone] = useState<string | null>(null);
  const addItem = useCart((s) => s.addItem);

  const inStock = product.inStock !== false;
  const promo = Boolean(product.prevPriceValue);

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    if (onAdd) {
      onAdd(product, qty);
      return;
    }
    addItem(product.slug, qty);
  };

  const handleNotify = (e: FormEvent) => {
    e.preventDefault();
    if (notifyEmail.trim()) {
      setNotifyDone(notifyEmail.trim());
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        {promo && inStock && <Badge tone="warning">Promo</Badge>}
        {!inStock && <Badge tone="danger">Agotado</Badge>}
        {product.highlight && inStock && <Badge tone="brand">Top ventas</Badge>}
      </div>

      <h1 className="text-[26px] font-extrabold leading-tight text-brand sm:text-[32px] lg:text-[38px]">
        {product.title}
      </h1>

      {product.rating && (
        <div className="flex flex-wrap items-center gap-3">
          <StarRow rating={product.rating.average} />
          <span className="text-[13px] font-semibold text-ink">
            {product.rating.average.toFixed(1)}
          </span>
          <a
            href="#tab-reviews"
            className="text-[12px] text-ink-muted hover:underline"
          >
            ({product.rating.count} reseñas)
          </a>
        </div>
      )}

      <p className="text-[15px] text-ink-muted sm:text-[16px]">
        {product.tagline}
      </p>

      <div className="mt-2 flex items-baseline gap-3">
        <span
          data-testid="product-price"
          className="text-[30px] font-extrabold text-brand sm:text-[34px]"
        >
          {product.price ?? formatCOP(product.priceValue)}
        </span>
        {promo && product.prevPriceValue && (
          <span className="text-[14px] text-ink-muted line-through">
            {product.prevPrice ?? formatCOP(product.prevPriceValue)}
          </span>
        )}
      </div>

      {product.description && (
        <p className="mt-2 text-[14px] leading-[1.6] text-ink sm:text-[15px]">
          {product.description}
        </p>
      )}

      {inStock ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div
              className="inline-flex h-12 items-center rounded-full border border-card-border bg-white"
              role="group"
              aria-label="Selector de cantidad"
            >
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={dec}
                disabled={qty <= 1}
                className="grid h-12 w-12 place-items-center rounded-l-full text-[18px] font-bold text-brand transition-colors hover:bg-brand/5 disabled:opacity-40"
              >
                −
              </button>
              <span
                data-testid="qty-value"
                aria-live="polite"
                className="w-10 text-center text-[16px] font-bold text-ink"
              >
                {qty}
              </span>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={inc}
                className="grid h-12 w-12 place-items-center rounded-r-full text-[18px] font-bold text-brand transition-colors hover:bg-brand/5"
              >
                +
              </button>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleAdd}
              data-testid="add-to-cart"
            >
              Añadir al carrito
            </Button>
          </div>

          {showStickyCta && (
            <div className="sticky bottom-0 z-30 -mx-5 mt-6 border-t border-card-border bg-white/95 p-4 backdrop-blur lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-[12px] text-ink-muted">
                    {product.shortTitle}
                  </span>
                  <span className="text-[16px] font-extrabold text-brand">
                    {product.price ?? formatCOP(product.priceValue)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleAdd}
                  data-testid="sticky-add-to-cart"
                >
                  Añadir ({qty})
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <form
          onSubmit={handleNotify}
          className="mt-4 flex flex-col gap-3 rounded-2xl border border-card-border bg-[#fafbfd] p-4"
          aria-label="Notifícame cuando llegue"
        >
          <p className="text-[14px] font-semibold text-brand">
            Notifícame cuando llegue
          </p>
          <Input
            type="email"
            label="Correo electrónico"
            placeholder="tucorreo@ejemplo.com"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" size="md">
            Avísame
          </Button>
          {notifyDone && (
            <p className="text-[13px] text-whatsapp-dark" role="status">
              Te avisaremos a {notifyDone}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
