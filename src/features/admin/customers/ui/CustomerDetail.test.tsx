import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerDetail } from "./CustomerDetail";
import type { CustomerView } from "../domain/customer-view";
import type { Order } from "@/src/features/orders";

const customer: CustomerView = {
  id: "u-1",
  name: "Ana Pérez",
  email: "ana@example.com",
  role: "customer",
  createdAt: "2026-01-01T00:00:00.000Z",
  ordersCount: 2,
  totalSpent: 600_000,
  lifetimeValue: 600_000,
  lastOrderAt: "2026-05-01T00:00:00.000Z",
  isVip: true,
};

const orders: Order[] = [
  {
    id: "ORD-0001",
    userId: "u-1",
    status: "paid",
    lines: [{ slug: "x", title: "X", quantity: 1, unitPrice: 100_000, lineTotal: 100_000 }],
    totals: { subtotal: 100_000, discount: 0, shipping: 0, total: 100_000 },
    contact: { name: "Ana", email: "ana@example.com", phone: "+57300" },
    shipping: { address: "Cll 1", city: "Bogotá", department: "Cundinamarca" },
    payment: { method: "mock" },
    notes: [],
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "ORD-0002",
    userId: "u-1",
    status: "delivered",
    lines: [{ slug: "y", title: "Y", quantity: 1, unitPrice: 500_000, lineTotal: 500_000 }],
    totals: { subtotal: 500_000, discount: 0, shipping: 0, total: 500_000 },
    contact: { name: "Ana", email: "ana@example.com", phone: "+57300" },
    shipping: { address: "Cll 1", city: "Bogotá", department: "Cundinamarca" },
    payment: { method: "mock" },
    notes: [],
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-01T10:00:00.000Z",
  },
];

describe("CustomerDetail", () => {
  it("renderiza header con nombre, email, rol y badge VIP", () => {
    render(<CustomerDetail customer={customer} orders={orders} />);
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText(/customer/i)).toBeInTheDocument();
    expect(screen.getByText(/vip/i)).toBeInTheDocument();
  });

  it("muestra stats con # de pedidos y total gastado", () => {
    render(<CustomerDetail customer={customer} orders={orders} />);
    // 2 pedidos
    expect(screen.getByText("2")).toBeInTheDocument();
    // total gastado y LTV se imprimen como "$ 600.000": esperamos ambos.
    const amounts = screen.getAllByText(/600\.000/);
    expect(amounts.length).toBeGreaterThanOrEqual(2);
  });

  it("lista los pedidos del cliente en el tab Pedidos", () => {
    render(<CustomerDetail customer={customer} orders={orders} />);
    expect(screen.getByText("ORD-0001")).toBeInTheDocument();
    expect(screen.getByText("ORD-0002")).toBeInTheDocument();
  });

  it("muestra placeholder de notas internas al cambiar de tab", async () => {
    const user = userEvent.setup();
    render(<CustomerDetail customer={customer} orders={orders} />);
    const notesTab = screen.getByRole("tab", { name: /notas/i });
    await user.click(notesTab);
    expect(screen.getByText(/próximamente/i)).toBeInTheDocument();
  });
});
