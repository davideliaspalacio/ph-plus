import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Coupon } from "@/src/features/coupons";
import { CouponForm } from "./CouponForm";

const existing: Coupon = {
  id: "c1",
  code: "WELCOME10",
  type: "percent",
  value: 10,
  startsAt: "2026-01-01T00:00:00.000Z",
  endsAt: "2026-12-31T23:59:59.000Z",
  minSubtotal: 0,
  maxUses: 100,
  maxUsesPerCustomer: 1,
  usedCount: 5,
  isActive: true,
};

describe("CouponForm", () => {
  it("precarga los valores del cupón cuando se pasa en `coupon`", () => {
    render(
      <CouponForm coupon={existing} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );
    const code = screen.getByLabelText(/código/i) as HTMLInputElement;
    expect(code.value).toBe("WELCOME10");
    const value = screen.getByLabelText(/^valor/i) as HTMLInputElement;
    expect(value.value).toBe("10");
    expect(screen.getByRole("button", { name: /guardar cambios/i })).toBeInTheDocument();
  });

  it("muestra sufijo '%' cuando type=percent", () => {
    render(<CouponForm coupon={existing} onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("muestra sufijo '$' cuando type=fixed", async () => {
    const user = userEvent.setup();
    render(<CouponForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText(/tipo/i), "fixed");
    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("oculta el campo Valor cuando type=free_shipping", async () => {
    const user = userEvent.setup();
    render(<CouponForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await user.selectOptions(screen.getByLabelText(/tipo/i), "free_shipping");
    expect(screen.queryByLabelText(/^valor/i)).not.toBeInTheDocument();
  });

  it("onCancel se dispara al click en Cancelar", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<CouponForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("submit con valores válidos llama a onSubmit con datos normalizados (code en mayúsculas)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CouponForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/código/i), "verano20");
    await user.clear(screen.getByLabelText(/^valor/i));
    await user.type(screen.getByLabelText(/^valor/i), "20");
    await user.type(screen.getByLabelText(/inicia/i), "2026-06-01");
    await user.type(screen.getByLabelText(/finaliza/i), "2026-08-31");

    await user.click(screen.getByRole("button", { name: /crear cupón/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0];
    expect(values.code).toBe("VERANO20");
    expect(values.type).toBe("percent");
    expect(values.value).toBe(20);
    expect(values.startsAt).toBe("2026-06-01T00:00:00.000Z");
    expect(values.endsAt).toBe("2026-08-31T23:59:59.000Z");
    expect(values.isActive).toBe(true);
  });

  it("muestra error si endsAt < startsAt", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CouponForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/código/i), "BAD");
    await user.clear(screen.getByLabelText(/^valor/i));
    await user.type(screen.getByLabelText(/^valor/i), "5");
    await user.type(screen.getByLabelText(/inicia/i), "2026-12-01");
    await user.type(screen.getByLabelText(/finaliza/i), "2026-06-01");

    await user.click(screen.getByRole("button", { name: /crear cupón/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/fecha de fin/i)).toBeInTheDocument();
  });

  it("free_shipping envía value=0 sin requerir el campo", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<CouponForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/código/i), "FREESHIP");
    await user.selectOptions(screen.getByLabelText(/tipo/i), "free_shipping");
    await user.type(screen.getByLabelText(/inicia/i), "2026-01-01");
    await user.type(screen.getByLabelText(/finaliza/i), "2026-12-31");

    await user.click(screen.getByRole("button", { name: /crear cupón/i }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0];
    expect(values.type).toBe("free_shipping");
    expect(values.value).toBe(0);
  });
});
