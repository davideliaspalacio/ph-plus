"use client";

import { CouponInput } from "./CouponInput";
import type { CombinedCheckoutSnapshot } from "../domain/totals";
import type { ProductLike } from "@/src/features/cart";
import type { CouponRepository } from "@/src/features/coupons";

export interface CheckoutSummaryProps<P extends ProductLike = ProductLike> {
  snapshot: CombinedCheckoutSnapshot<P>;
  /** Inyectable (tests). */
  couponRepo?: CouponRepository;
  /** Renderiza imagen / visual del producto (caller decide). */
  renderProduct?: (line: CombinedCheckoutSnapshot<P>["lines"][number]) => React.ReactNode;
  /** Formato monetario. Default: COP simple. */
  formatMoney?: (n: number) => string;
}

function defaultFormatMoney(n: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function CheckoutSummary<P extends ProductLike = ProductLike>({
  snapshot,
  couponRepo,
  renderProduct,
  formatMoney = defaultFormatMoney,
}: CheckoutSummaryProps<P>) {
  const { totals, lines } = snapshot;

  return (
    <aside
      aria-label="Resumen del pedido"
      className="rounded-2xl border border-card-border bg-[#fafbfd] p-5 lg:sticky lg:top-24"
    >
      <h2 className="text-[16px] font-extrabold text-brand">
        Resumen del pedido
      </h2>

      <ul className="mt-4 space-y-3" data-testid="summary-lines">
        {lines.map((l) => {
          const title =
            (l.product as ProductLike & { title?: string }).title ??
            l.product.slug;
          return (
            <li key={l.product.slug} className="flex items-center gap-3">
              {renderProduct ? (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white">
                  {renderProduct(l)}
                </div>
              ) : null}
              <div className="flex-1 text-[12px]">
                <p className="font-semibold text-ink">{title}</p>
                <p className="text-ink-muted">× {l.item.quantity}</p>
              </div>
              <p className="text-[13px] font-bold text-brand">
                {formatMoney(l.lineTotal)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 border-t border-card-border pt-5">
        <CouponInput subtotal={totals.subtotal} couponRepo={couponRepo} />
      </div>

      <dl className="mt-5 space-y-2 border-t border-card-border pt-4 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-ink-muted">Subtotal</dt>
          <dd className="text-ink" data-testid="summary-subtotal">
            {formatMoney(totals.subtotal)}
          </dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between">
            <dt className="text-ink-muted">Descuento</dt>
            <dd
              className="text-whatsapp-dark"
              data-testid="summary-discount"
            >
              − {formatMoney(totals.discount)}
            </dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink-muted">Envío</dt>
          <dd className="text-ink" data-testid="summary-shipping">
            {formatMoney(totals.shipping)}
          </dd>
        </div>
      </dl>
      <div className="mt-3 flex items-baseline justify-between border-t border-card-border pt-3">
        <span className="text-[14px] font-semibold">Total</span>
        <span
          className="text-[20px] font-extrabold text-brand"
          data-testid="summary-total"
        >
          {formatMoney(totals.total)}
        </span>
      </div>
    </aside>
  );
}
