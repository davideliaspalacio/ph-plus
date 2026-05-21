import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomersTable } from "./CustomersTable";
import type { CustomerView } from "../domain/customer-view";

const make = (overrides: Partial<CustomerView> = {}): CustomerView => ({
  id: "u-1",
  name: "Ana Pérez",
  email: "ana@example.com",
  role: "customer",
  createdAt: "2026-01-01T00:00:00.000Z",
  ordersCount: 2,
  totalSpent: 200_000,
  lifetimeValue: 200_000,
  lastOrderAt: "2026-05-01T00:00:00.000Z",
  isVip: false,
  ...overrides,
});

const customers: CustomerView[] = [
  make({ id: "u-1", name: "Ana Pérez", email: "ana@example.com" }),
  make({
    id: "u-2",
    name: "Beto Sosa",
    email: "beto@example.com",
    totalSpent: 600_000,
    lifetimeValue: 600_000,
    isVip: true,
  }),
];

describe("CustomersTable", () => {
  it("renderiza una fila por cliente con nombre, email y # de pedidos", () => {
    render(<CustomersTable customers={customers} />);
    expect(screen.getByText("Ana Pérez")).toBeInTheDocument();
    expect(screen.getByText("Beto Sosa")).toBeInTheDocument();
    expect(screen.getByText("ana@example.com")).toBeInTheDocument();
    expect(screen.getByText("beto@example.com")).toBeInTheDocument();
  });

  it("muestra un badge VIP cuando isVip es true", () => {
    render(<CustomersTable customers={customers} />);
    const betoRow = screen.getByText("Beto Sosa").closest("tr");
    expect(betoRow).not.toBeNull();
    expect(within(betoRow!).getByText(/vip/i)).toBeInTheDocument();

    const anaRow = screen.getByText("Ana Pérez").closest("tr");
    expect(within(anaRow!).queryByText(/vip/i)).toBeNull();
  });

  it("dispara onSelect al hacer click en una fila", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CustomersTable customers={customers} onSelect={onSelect} />);
    const row = screen.getByText("Beto Sosa").closest("tr");
    await user.click(row!);
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "u-2" }),
    );
  });

  it("muestra empty state cuando la lista llega vacía", () => {
    render(<CustomersTable customers={[]} />);
    expect(screen.getByText(/sin clientes/i)).toBeInTheDocument();
  });
});
