import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CouponInput } from "./CouponInput";
import { useCheckout } from "../store/useCheckout";
import type { Coupon, CouponRepository } from "@/src/features/coupons";

function makeRepo(coupon: Coupon | null): CouponRepository {
  return {
    findByCode: vi.fn(async () => coupon),
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    archive: vi.fn(),
    incrementUsage: vi.fn(),
  };
}

const VALID_COUPON: Coupon = {
  id: "c1",
  code: "DESC10",
  type: "percent",
  value: 10,
  startsAt: "2020-01-01T00:00:00Z",
  endsAt: "2099-01-01T00:00:00Z",
  minSubtotal: 0,
  maxUses: 100,
  maxUsesPerCustomer: 10,
  usedCount: 0,
  isActive: true,
};

describe("CouponInput", () => {
  beforeEach(() => {
    useCheckout.getState().reset();
  });

  it("uppercase automático al teclear", async () => {
    const user = userEvent.setup();
    render(<CouponInput subtotal={50_000} couponRepo={makeRepo(null)} />);
    const input = screen.getByLabelText(/código de cupón/i);
    await user.type(input, "desc10");
    expect((input as HTMLInputElement).value).toBe("DESC10");
  });

  it("al aplicar OK persiste el cupón en el store", async () => {
    const user = userEvent.setup();
    render(
      <CouponInput
        subtotal={50_000}
        couponRepo={makeRepo(VALID_COUPON)}
        now={new Date("2025-01-01T00:00:00Z")}
      />,
    );
    await user.type(screen.getByLabelText(/código de cupón/i), "desc10");
    await user.click(screen.getByRole("button", { name: /aplicar/i }));
    await waitFor(() => {
      expect(useCheckout.getState().couponCode).toBe("DESC10");
    });
  });

  it("muestra mensaje 'Cupón vencido' cuando reason=EXPIRED", async () => {
    const user = userEvent.setup();
    const expired: Coupon = { ...VALID_COUPON, endsAt: "2021-01-01T00:00:00Z" };
    render(
      <CouponInput
        subtotal={50_000}
        couponRepo={makeRepo(expired)}
        now={new Date("2025-01-01T00:00:00Z")}
      />,
    );
    await user.type(screen.getByLabelText(/código de cupón/i), "DESC10");
    await user.click(screen.getByRole("button", { name: /aplicar/i }));
    expect(await screen.findByText(/cupón vencido/i)).toBeInTheDocument();
    expect(useCheckout.getState().couponCode).toBeNull();
  });

  it("muestra 'No alcanza el mínimo' cuando subtotal < minSubtotal", async () => {
    const user = userEvent.setup();
    const min: Coupon = { ...VALID_COUPON, minSubtotal: 100_000 };
    render(
      <CouponInput
        subtotal={10_000}
        couponRepo={makeRepo(min)}
        now={new Date("2025-01-01T00:00:00Z")}
      />,
    );
    await user.type(screen.getByLabelText(/código de cupón/i), "DESC10");
    await user.click(screen.getByRole("button", { name: /aplicar/i }));
    expect(
      await screen.findByText(/no alcanza el mínimo/i),
    ).toBeInTheDocument();
  });

  it("muestra 'Cupón no encontrado' cuando el repo devuelve null", async () => {
    const user = userEvent.setup();
    render(<CouponInput subtotal={50_000} couponRepo={makeRepo(null)} />);
    await user.type(screen.getByLabelText(/código de cupón/i), "XXXXX");
    await user.click(screen.getByRole("button", { name: /aplicar/i }));
    expect(
      await screen.findByText(/cupón no encontrado/i),
    ).toBeInTheDocument();
  });

  it("permite quitar un cupón aplicado", async () => {
    const user = userEvent.setup();
    useCheckout.getState().setCoupon("DESC10");
    render(<CouponInput subtotal={50_000} couponRepo={makeRepo(VALID_COUPON)} />);
    expect(screen.getByText("DESC10")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /quitar/i }));
    expect(useCheckout.getState().couponCode).toBeNull();
  });
});
