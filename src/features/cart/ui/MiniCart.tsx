"use client";

import Link from "next/link";
import { useMemo } from "react";
import ProductVisual from "@/app/components/ProductVisual";
import { Drawer, Button, EmptyState } from "@/src/shared/ui";
import { formatCOP } from "@/src/shared/lib/format";
import { useCart } from "@/src/features/cart/store/useCart";
import { buildCartSummary } from "@/src/features/cart/domain/pricing";
import { PRODUCTS } from "@/app/lib/products";

export interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const summary = useMemo(
    () => buildCartSummary(items, (slug) => PRODUCTS.find((p) => p.slug === slug)),
    [items],
  );

  const empty = summary.lines.length === 0;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Tu carrito${summary.totalItems > 0 ? ` (${summary.totalItems})` : ""}`}
      side="right"
      footer={
        !empty ? (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between text-[14px]">
              <span className="text-ink-muted">Subtotal</span>
              <span className="text-[18px] font-extrabold text-brand">
                {formatCOP(summary.subtotal)}
              </span>
            </div>
            {!summary.qualifiesForFreeShipping && (
              <p className="rounded-2xl bg-brand/5 px-3 py-2 text-[12px] text-brand">
                Te faltan{" "}
                <strong>{formatCOP(summary.amountToFreeShipping)}</strong>{" "}
                para envío gratis.
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Link href="/carrito" onClick={onClose}>
                <Button variant="outline" fullWidth>
                  Ver carrito
                </Button>
              </Link>
              <Link href="/checkout" onClick={onClose}>
                <Button fullWidth>Pagar</Button>
              </Link>
            </div>
          </div>
        ) : null
      }
    >
      {empty ? (
        <EmptyState
          title="Tu carrito está vacío"
          description="Agregá productos PH PLUS para empezar."
          action={
            <Link href="/productos" onClick={onClose}>
              <Button>Ver productos</Button>
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-card-border">
          {summary.lines.map((line) => (
            <li
              key={line.product.slug}
              className="flex items-start gap-3 py-4"
            >
              {/* Ilustración por visualKey, igual que /carrito. Antes se
                  armaba `/products/${slug}.png`, pero esos archivos no existen
                  para casi ningún slug → miniatura rota en todo el carrito. */}
              <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-card-border/30">
                <ProductVisual
                  visualKey={line.product.visualKey}
                  className="h-14 w-auto"
                />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold text-brand">
                  {line.product.shortTitle}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-muted">
                  {formatCOP(line.product.priceValue)}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Disminuir cantidad"
                    onClick={() =>
                      setQuantity(line.product.slug, line.item.quantity - 1)
                    }
                    className="grid h-7 w-7 place-items-center rounded-full border border-card-border text-ink transition hover:bg-card-border/40"
                  >
                    −
                  </button>
                  <span className="min-w-[20px] text-center text-[13px] font-semibold">
                    {line.item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar cantidad"
                    onClick={() =>
                      setQuantity(line.product.slug, line.item.quantity + 1)
                    }
                    className="grid h-7 w-7 place-items-center rounded-full border border-card-border text-ink transition hover:bg-card-border/40"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(line.product.slug)}
                    className="ml-auto text-[12px] font-semibold text-red-600 transition hover:text-red-700"
                  >
                    Quitar
                  </button>
                </div>
              </div>
              <div className="text-[13px] font-extrabold text-brand">
                {formatCOP(line.lineTotal)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
