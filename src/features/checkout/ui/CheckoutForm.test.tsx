import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CheckoutForm } from "./CheckoutForm";
import { useCheckout } from "../store/useCheckout";
import type { CouponRepository } from "@/src/features/coupons";
import type { Order, OrderRepository } from "@/src/features/orders";

type P = { slug: string; priceValue: number; title: string };

const PRODUCTS: Record<string, P> = {
  "agua-1l": { slug: "agua-1l", priceValue: 50_000, title: "Agua 1L" },
};
const lookup = (slug: string) => PRODUCTS[slug];

function makeOrderRepo(): OrderRepository {
  return {
    list: vi.fn(),
    byId: vi.fn(),
    byUser: vi.fn(),
    create: vi.fn(async (input) => {
      return {
        id: "ORD-1",
        status: input.status ?? "pending_payment",
        lines: input.lines,
        totals: input.totals,
        contact: input.contact,
        shipping: input.shipping,
        payment: input.payment,
        couponCode: input.couponCode,
        notes: [],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      } as Order;
    }),
    updateStatus: vi.fn(),
    addNote: vi.fn(),
    update: vi.fn(),
  };
}

const noopCouponRepo: CouponRepository = {
  findByCode: vi.fn(async () => null),
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  archive: vi.fn(),
  incrementUsage: vi.fn(),
};

describe("CheckoutForm", () => {
  beforeEach(() => {
    useCheckout.getState().reset();
  });

  it("CTA disabled cuando el form está incompleto", () => {
    render(
      <CheckoutForm
        items={[{ slug: "agua-1l", quantity: 2 }]}
        lookup={lookup}
        orderRepo={makeOrderRepo()}
        couponRepo={noopCouponRepo}
      />,
    );
    const buttons = screen.getAllByRole("button", { name: /pagar/i });
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((b) => expect(b).toBeDisabled());
  });

  it("muestra error en blur si el email es inválido", async () => {
    const user = userEvent.setup();
    render(
      <CheckoutForm
        items={[{ slug: "agua-1l", quantity: 1 }]}
        lookup={lookup}
        orderRepo={makeOrderRepo()}
        couponRepo={noopCouponRepo}
      />,
    );
    const email = screen.getByLabelText(/^email/i);
    await user.type(email, "noesemail");
    await user.tab();
    expect(await screen.findByText(/email no válido/i)).toBeInTheDocument();
  });

  it("habilita el CTA cuando los campos requeridos son válidos", async () => {
    const user = userEvent.setup();
    render(
      <CheckoutForm
        items={[{ slug: "agua-1l", quantity: 1 }]}
        lookup={lookup}
        orderRepo={makeOrderRepo()}
        couponRepo={noopCouponRepo}
      />,
    );
    await user.type(screen.getByLabelText(/nombre completo/i), "Ana");
    await user.type(screen.getByLabelText(/^email/i), "ana@y.com");
    await user.type(screen.getByLabelText(/teléfono/i), "3001234567");
    await user.type(screen.getByLabelText("Dirección *"), "Calle 1");
    await user.type(screen.getByLabelText(/ciudad/i), "Bogotá");
    // pick payment method
    await user.click(screen.getByLabelText(/pago contra entrega/i));

    await waitFor(() => {
      const buttons = screen.getAllByRole("button", { name: /pagar/i });
      buttons.forEach((b) => expect(b).not.toBeDisabled());
    });
  });

  it("crea el pedido y llama onSubmitted al hacer submit", async () => {
    const user = userEvent.setup();
    const repo = makeOrderRepo();
    const onSubmitted = vi.fn();
    render(
      <CheckoutForm
        items={[{ slug: "agua-1l", quantity: 1 }]}
        lookup={lookup}
        orderRepo={repo}
        couponRepo={noopCouponRepo}
        onSubmitted={onSubmitted}
      />,
    );
    await user.type(screen.getByLabelText(/nombre completo/i), "Ana");
    await user.type(screen.getByLabelText(/^email/i), "ana@y.com");
    await user.type(screen.getByLabelText(/teléfono/i), "3001234567");
    await user.type(screen.getByLabelText("Dirección *"), "Calle 1");
    await user.type(screen.getByLabelText(/ciudad/i), "Bogotá");
    await user.click(screen.getByLabelText(/pago contra entrega/i));

    // Hay 2 CTAs (desktop + mobile sticky). Tomamos el primero habilitado.
    const buttons = screen.getAllByRole("button", { name: /pagar/i });
    const enabled = buttons.find((b) => !(b as HTMLButtonElement).disabled);
    expect(enabled).toBeTruthy();
    await user.click(enabled!);

    await waitFor(() => {
      expect(repo.create).toHaveBeenCalledOnce();
      expect(onSubmitted).toHaveBeenCalledOnce();
    });
    expect(useCheckout.getState().contact).toEqual({});
  });

  it("muestra el total recalculado en el CTA cuando cambia city → zona", async () => {
    const user = userEvent.setup();
    const zones = [
      {
        id: "z-bog",
        name: "Bogotá",
        regions: ["Bogotá"],
        cost: 12_000,
        leadTimeDaysMin: 1,
        leadTimeDaysMax: 2,
        isActive: true,
      },
    ];
    render(
      <CheckoutForm
        items={[{ slug: "agua-1l", quantity: 1 }]}
        lookup={lookup}
        shippingZones={zones}
        orderRepo={makeOrderRepo()}
        couponRepo={noopCouponRepo}
      />,
    );

    // Sin city: shipping default (flat 8.000 o free según subtotal).
    // Subtotal = 50_000, no califica free shipping (umbral 120_000), shipping = 8_000.
    expect(
      screen.getAllByRole("button", { name: /pagar/i })[0],
    ).toHaveTextContent(/58/);

    await user.type(screen.getByLabelText(/ciudad/i), "Bogotá");

    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: /pagar/i })[0],
      ).toHaveTextContent(/62/); // 50_000 + 12_000
    });
  });
});
