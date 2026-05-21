import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrderDetail } from "./OrderDetail";
import type { Order } from "@/src/features/orders";

const order: Order = {
  id: "ORD-1234",
  status: "paid",
  lines: [
    {
      slug: "agua-19l",
      title: "Botellón 19L",
      quantity: 2,
      unitPrice: 36_000,
      lineTotal: 72_000,
    },
  ],
  totals: {
    subtotal: 72_000,
    discount: 0,
    shipping: 8_000,
    total: 80_000,
  },
  contact: {
    name: "Ana Pérez",
    email: "ana@example.com",
    phone: "+573001112222",
  },
  shipping: {
    address: "Calle 1 # 23-45",
    city: "Bogotá",
    department: "Cundinamarca",
  },
  payment: { method: "credit_card", last4: "4242" },
  notes: [
    {
      id: "n1",
      author: "admin",
      text: "Cliente VIP",
      createdAt: "2026-05-10T10:00:00Z",
    },
  ],
  createdAt: "2026-05-10T10:00:00Z",
  updatedAt: "2026-05-10T10:00:00Z",
};

describe("OrderDetail", () => {
  it("renderiza header con # y status", () => {
    render(<OrderDetail order={order} />);
    expect(screen.getByText(/ORD-1234/)).toBeInTheDocument();
    // Hay múltiples "Pagado" (badge header + step del timeline). Ambos presentes.
    expect(screen.getAllByText(/pagado/i).length).toBeGreaterThan(0);
  });

  it("muestra líneas, totales, contacto y shipping", () => {
    render(<OrderDetail order={order} />);
    expect(screen.getByText(/Botellón 19L/)).toBeInTheDocument();
    expect(screen.getByText(/Ana Pérez/)).toBeInTheDocument();
    expect(screen.getByText(/ana@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/Calle 1 # 23-45/)).toBeInTheDocument();
    expect(screen.getByText(/Cundinamarca/)).toBeInTheDocument();
  });

  it("construye el href de WhatsApp con el teléfono y plantilla", () => {
    render(<OrderDetail order={order} />);
    const wa = screen.getByRole("link", { name: /whatsapp/i });
    const href = wa.getAttribute("href") ?? "";
    expect(href).toContain("https://wa.me/");
    expect(href).toContain("573001112222");
    expect(href).toContain("text=");
    expect(href).toContain("ORD-1234");
  });

  it("delega la transición al callback onUpdateStatus", async () => {
    const onUpdateStatus = vi.fn();
    const userEventMod = await import("@testing-library/user-event");
    const user = userEventMod.default.setup();
    render(<OrderDetail order={order} onUpdateStatus={onUpdateStatus} />);
    await user.click(
      screen.getByRole("button", { name: /marcar como preparando/i }),
    );
    expect(onUpdateStatus).toHaveBeenCalledWith("preparing", undefined);
  });
});
