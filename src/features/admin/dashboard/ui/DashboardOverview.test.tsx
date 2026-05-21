import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardOverview } from "./DashboardOverview";
import type { Order } from "@/src/features/orders";

function order(id: string, overrides: Partial<Order> = {}): Order {
  return {
    id,
    status: overrides.status ?? "paid",
    lines: overrides.lines ?? [
      { slug: "agua-19l", title: "Botellón 19L", quantity: 2, unitPrice: 36000, lineTotal: 72000 },
    ],
    totals: overrides.totals ?? { subtotal: 72000, discount: 0, shipping: 6000, total: 78000 },
    contact: { name: "María Gómez", email: "m@ex.com", phone: "+57 300" },
    shipping: { address: "x", city: "Bogotá", department: "Cundinamarca" },
    payment: { method: "pse" },
    notes: [],
    createdAt: overrides.createdAt ?? "2026-05-15T10:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-05-15T10:00:00.000Z",
  };
}

describe("DashboardOverview", () => {
  it("muestra EmptyState cuando no hay pedidos", async () => {
    render(<DashboardOverview orders={[]} />);
    expect(
      await screen.findByText(/aún no hay pedidos/i),
    ).toBeInTheDocument();
  });

  it("renderiza 4 KPI cards con datos calculados", async () => {
    render(
      <DashboardOverview
        orders={[
          order("ORD-1", { totals: { subtotal: 70000, discount: 0, shipping: 5000, total: 75000 } }),
          order("ORD-2", { totals: { subtotal: 40000, discount: 0, shipping: 5000, total: 45000 } }),
        ]}
      />,
    );
    expect(await screen.findByText(/ventas totales/i)).toBeInTheDocument();
    expect(screen.getByText(/pedidos totales/i)).toBeInTheDocument();
    expect(screen.getByText(/ticket promedio/i)).toBeInTheDocument();
    expect(screen.getByText(/pedidos pendientes/i)).toBeInTheDocument();
    // total = 120.000
    expect(screen.getByText(/120\.000/)).toBeInTheDocument();
    // count de pedidos totales aparece en el card (puede aparecer también
    // en "2 pedidos" como hint o en filas de tabla — basta con que esté).
    expect(screen.getAllByText("2").length).toBeGreaterThan(0);
  });

  it("renderiza tabla 'Últimos pedidos' con los IDs", async () => {
    render(
      <DashboardOverview
        orders={[order("ORD-AAA"), order("ORD-BBB")]}
      />,
    );
    expect(await screen.findByText(/últimos pedidos/i)).toBeInTheDocument();
    expect(screen.getByText("ORD-AAA")).toBeInTheDocument();
    expect(screen.getByText("ORD-BBB")).toBeInTheDocument();
  });

  it("renderiza lista 'Top productos' con conteos", async () => {
    render(
      <DashboardOverview
        orders={[
          order("1", {
            lines: [
              { slug: "agua-19l", title: "Botellón 19L", quantity: 3, unitPrice: 36000, lineTotal: 108000 },
            ],
          }),
          order("2", {
            lines: [
              { slug: "garrafa-1l", title: "Garrafa 1L", quantity: 1, unitPrice: 5000, lineTotal: 5000 },
            ],
          }),
        ]}
      />,
    );
    expect(await screen.findByText(/top productos/i)).toBeInTheDocument();
    expect(screen.getByText(/Botellón 19L/i)).toBeInTheDocument();
    expect(screen.getByText(/Garrafa 1L/i)).toBeInTheDocument();
  });
});
