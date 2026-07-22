import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CheckoutSummary } from "./CheckoutSummary";
import { useCheckout } from "../store/useCheckout";
import type { CombinedCheckoutSnapshot } from "../domain/totals";
import type { CouponRepository } from "@/src/features/coupons";

type P = { slug: string; priceValue: number; title: string };

function makeSnapshot(overrides: Partial<CombinedCheckoutSnapshot<P>["totals"]> = {}) {
  const snap: CombinedCheckoutSnapshot<P> = {
    totals: {
      subtotal: 100_000,
      discount: 0,
      shipping: 8_000,
      total: 108_000,
      couponReason: "NO_COUPON",
      shippingFreeApplied: false,
      shippingZoneId: null,
      totalItems: 2,
      ...overrides,
    },
    lines: [
      {
        item: { slug: "agua-1l", quantity: 2 },
        product: { slug: "agua-1l", priceValue: 50_000, title: "Agua 1L" },
        lineTotal: 100_000,
      },
    ],
    qualifiesForFreeShipping: false,
  };
  return snap;
}

const emptyRepo: CouponRepository = {
  findByCode: vi.fn(async () => null),
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  archive: vi.fn(),
  incrementUsage: vi.fn(),
};

describe("CheckoutSummary", () => {
  beforeEach(() => {
    useCheckout.getState().reset();
  });

  it("muestra subtotal, envío y total", () => {
    render(<CheckoutSummary snapshot={makeSnapshot()} couponRepo={emptyRepo} />);
    expect(screen.getByTestId("summary-subtotal").textContent).toContain(
      "100",
    );
    expect(screen.getByTestId("summary-shipping").textContent).toContain(
      "8",
    );
    expect(screen.getByTestId("summary-total").textContent).toContain("108");
  });

  it("renderiza valor monetario cuando shipping = 0", () => {
    render(
      <CheckoutSummary
        snapshot={makeSnapshot({ shipping: 0, total: 100_000 })}
        couponRepo={emptyRepo}
      />,
    );
    expect(screen.getByTestId("summary-shipping").textContent).toContain("0");
  });

  it("muestra descuento sólo si discount > 0", () => {
    const { rerender } = render(
      <CheckoutSummary snapshot={makeSnapshot()} couponRepo={emptyRepo} />,
    );
    expect(screen.queryByTestId("summary-discount")).toBeNull();

    rerender(
      <CheckoutSummary
        snapshot={makeSnapshot({
          discount: 10_000,
          total: 98_000,
          couponReason: "OK",
        })}
        couponRepo={emptyRepo}
      />,
    );
    expect(screen.getByTestId("summary-discount").textContent).toContain(
      "10",
    );
  });

  it("renderiza los items del carrito", () => {
    render(<CheckoutSummary snapshot={makeSnapshot()} couponRepo={emptyRepo} />);
    expect(screen.getByText("Agua 1L")).toBeInTheDocument();
    expect(screen.getByText(/× 2/)).toBeInTheDocument();
  });
});
