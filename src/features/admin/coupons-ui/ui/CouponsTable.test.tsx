import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Coupon } from "@/src/features/coupons";
import { CouponsTable } from "./CouponsTable";

const sample = (overrides: Partial<Coupon> = {}): Coupon => ({
  id: "c1",
  code: "WELCOME10",
  type: "percent",
  value: 10,
  startsAt: "2026-01-01T00:00:00.000Z",
  endsAt: "2026-12-31T00:00:00.000Z",
  minSubtotal: 0,
  maxUses: 100,
  maxUsesPerCustomer: 1,
  usedCount: 5,
  isActive: true,
  ...overrides,
});

describe("CouponsTable", () => {
  it("renderiza una fila por cupón con código, valor y usos", () => {
    render(
      <CouponsTable
        coupons={[
          sample({ id: "c1", code: "WELCOME10", value: 10, usedCount: 5, maxUses: 100 }),
          sample({ id: "c2", code: "SUMMER", type: "fixed", value: 5000, usedCount: 0, maxUses: 50 }),
        ]}
      />,
    );
    expect(screen.getByText("WELCOME10")).toBeInTheDocument();
    expect(screen.getByText("SUMMER")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("5/100")).toBeInTheDocument();
    expect(screen.getByText("0/50")).toBeInTheDocument();
  });

  it("muestra badge Inactivo cuando isActive=false y Activo cuando true", () => {
    render(
      <CouponsTable
        coupons={[
          sample({ id: "c1", code: "ACTIVE", isActive: true }),
          sample({ id: "c2", code: "ARCHIVED", isActive: false }),
        ]}
      />,
    );
    expect(screen.getByText(/^activo$/i)).toBeInTheDocument();
    expect(screen.getByText(/^inactivo$/i)).toBeInTheDocument();
  });

  it("formatea valor según tipo: percent=%, fixed=$, free_shipping= —", () => {
    render(
      <CouponsTable
        coupons={[
          sample({ id: "c1", code: "P", type: "percent", value: 15 }),
          sample({ id: "c2", code: "F", type: "fixed", value: 2500 }),
          sample({ id: "c3", code: "S", type: "free_shipping", value: 0 }),
        ]}
      />,
    );
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText(/\$2\.500|\$2,500/)).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("dispara onEdit con el cupón al click en Editar", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    const c = sample({ id: "c1", code: "WELCOME10" });
    render(<CouponsTable coupons={[c]} onEdit={onEdit} />);
    const row = screen.getByTestId("coupon-row-c1");
    await user.click(within(row).getByRole("button", { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(c);
  });

  it("dispara onArchive con el cupón al click en Archivar", async () => {
    const onArchive = vi.fn();
    const user = userEvent.setup();
    const c = sample({ id: "c1" });
    render(<CouponsTable coupons={[c]} onArchive={onArchive} />);
    const row = screen.getByTestId("coupon-row-c1");
    await user.click(within(row).getByRole("button", { name: /archivar/i }));
    expect(onArchive).toHaveBeenCalledWith(c);
  });

  it("renderiza estado vacío cuando no hay cupones", () => {
    render(<CouponsTable coupons={[]} />);
    expect(screen.getByText(/no hay cupones/i)).toBeInTheDocument();
  });
});
