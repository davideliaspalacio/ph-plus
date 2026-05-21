import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrdersTable } from "./OrdersTable";
import type { Order } from "@/src/features/orders";

const baseOrder = (overrides: Partial<Order> = {}): Order => ({
  id: "ORD-0001",
  status: "paid",
  lines: [
    {
      slug: "agua-19l",
      title: "Botellón 19L",
      quantity: 1,
      unitPrice: 36_000,
      lineTotal: 36_000,
    },
  ],
  totals: {
    subtotal: 36_000,
    discount: 0,
    shipping: 0,
    total: 36_000,
  },
  contact: {
    name: "Ana Pérez",
    email: "ana@example.com",
    phone: "+573001112222",
  },
  shipping: {
    address: "Calle 1",
    city: "Bogotá",
    department: "Cundinamarca",
  },
  payment: { method: "credit_card" },
  notes: [],
  createdAt: "2026-05-10T10:00:00Z",
  updatedAt: "2026-05-10T10:00:00Z",
  ...overrides,
});

const orders: Order[] = [
  baseOrder({
    id: "ORD-0001",
    status: "paid",
    contact: {
      name: "Ana Pérez",
      email: "ana@example.com",
      phone: "+573001112222",
    },
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
    payment: { method: "credit_card" },
    totals: { subtotal: 36_000, discount: 0, shipping: 0, total: 36_000 },
  }),
  baseOrder({
    id: "ORD-0002",
    status: "pending_payment",
    contact: {
      name: "Beto Sosa",
      email: "beto@example.com",
      phone: "+573002223333",
    },
    createdAt: "2026-05-12T11:00:00Z",
    updatedAt: "2026-05-12T11:00:00Z",
    payment: { method: "pse" },
    totals: { subtotal: 50_000, discount: 0, shipping: 0, total: 50_000 },
  }),
  baseOrder({
    id: "ORD-0003",
    status: "shipped",
    contact: {
      name: "Carla Díaz",
      email: "carla@example.com",
      phone: "+573003334444",
    },
    createdAt: "2026-05-15T09:00:00Z",
    updatedAt: "2026-05-15T09:00:00Z",
    payment: { method: "nequi" },
    totals: { subtotal: 80_000, discount: 0, shipping: 0, total: 80_000 },
  }),
];

describe("OrdersTable", () => {
  it("renderiza todas las filas con id, total y status", () => {
    render(<OrdersTable orders={orders} />);
    expect(screen.getByText("ORD-0001")).toBeInTheDocument();
    expect(screen.getByText("ORD-0002")).toBeInTheDocument();
    expect(screen.getByText("ORD-0003")).toBeInTheDocument();
    expect(screen.getByText(/ana@example\.com/i)).toBeInTheDocument();
  });

  it("filtra por search (orderId o email)", async () => {
    const user = userEvent.setup();
    render(<OrdersTable orders={orders} />);
    const search = screen.getByPlaceholderText(/buscar/i);
    await user.type(search, "beto");
    expect(screen.queryByText("ORD-0001")).not.toBeInTheDocument();
    expect(screen.getByText("ORD-0002")).toBeInTheDocument();
    expect(screen.queryByText("ORD-0003")).not.toBeInTheDocument();
  });

  it("filtra por status", async () => {
    const user = userEvent.setup();
    render(<OrdersTable orders={orders} />);
    const statusSelect = screen.getByLabelText(/estado/i);
    await user.selectOptions(statusSelect, "shipped");
    expect(screen.queryByText("ORD-0001")).not.toBeInTheDocument();
    expect(screen.queryByText("ORD-0002")).not.toBeInTheDocument();
    expect(screen.getByText("ORD-0003")).toBeInTheDocument();
  });

  it("filtra por rango de fechas", async () => {
    const user = userEvent.setup();
    render(<OrdersTable orders={orders} />);
    const from = screen.getByLabelText(/desde/i);
    const to = screen.getByLabelText(/hasta/i);
    await user.type(from, "2026-05-12");
    await user.type(to, "2026-05-13");
    expect(screen.queryByText("ORD-0001")).not.toBeInTheDocument();
    expect(screen.getByText("ORD-0002")).toBeInTheDocument();
    expect(screen.queryByText("ORD-0003")).not.toBeInTheDocument();
  });

  it("dispara onSelect al hacer click en una fila", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<OrdersTable orders={orders} onSelect={onSelect} />);
    const row = screen.getByText("ORD-0002").closest("tr");
    expect(row).not.toBeNull();
    await user.click(row!);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ORD-0002" }),
    );
  });

  it("muestra empty state cuando no hay órdenes que coincidan", async () => {
    const user = userEvent.setup();
    render(<OrdersTable orders={orders} />);
    await user.type(screen.getByPlaceholderText(/buscar/i), "noexiste");
    expect(screen.getByText(/sin pedidos/i)).toBeInTheDocument();
  });

  it("pinta el badge según el status", () => {
    render(<OrdersTable orders={orders} />);
    const row = screen.getByText("ORD-0001").closest("tr");
    expect(within(row!).getByText(/paid|pagado/i)).toBeInTheDocument();
  });
});
