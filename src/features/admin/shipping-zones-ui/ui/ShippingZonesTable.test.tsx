import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShippingZonesTable } from "./ShippingZonesTable";
import type { ShippingZone } from "@/src/features/shipping";

const zone = (overrides: Partial<ShippingZone> = {}): ShippingZone =>
  ({
    id: "z1",
    name: "Bogotá",
    regions: ["Bogotá", "Soacha", "Chía", "Cota", "Funza"],
    cost: 8000,
    leadTimeDaysMin: 1,
    leadTimeDaysMax: 2,
    freeShippingThreshold: 80000,
    isActive: true,
    ...overrides,
  }) as ShippingZone;

describe("ShippingZonesTable", () => {
  it("renderiza una fila por zona con nombre, costo y lead time", () => {
    const zones = [
      zone({
        id: "z1",
        name: "Zona Norte",
        regions: ["Bogotá", "Chía"],
        cost: 8000,
      }),
      zone({
        id: "z2",
        name: "Zona Antioquia",
        cost: 12000,
        regions: ["Medellín"],
        leadTimeDaysMin: 2,
        leadTimeDaysMax: 4,
      }),
    ];
    render(<ShippingZonesTable zones={zones} />);
    expect(screen.getByText("Zona Norte")).toBeInTheDocument();
    expect(screen.getByText("Zona Antioquia")).toBeInTheDocument();
    const row2 = screen.getByTestId("zone-row-z2");
    expect(within(row2).getByText(/2\s*-\s*4/)).toBeInTheDocument();
  });

  it("muestra los primeros 3 regions como chips y un +N para el resto", () => {
    render(
      <ShippingZonesTable
        zones={[
          zone({
            id: "z1",
            regions: ["A", "B", "C", "D", "E"],
          }),
        ]}
      />,
    );
    const row = screen.getByTestId("zone-row-z1");
    expect(within(row).getByText("A")).toBeInTheDocument();
    expect(within(row).getByText("B")).toBeInTheDocument();
    expect(within(row).getByText("C")).toBeInTheDocument();
    expect(within(row).queryByText("D")).not.toBeInTheDocument();
    expect(within(row).getByText("+2")).toBeInTheDocument();
  });

  it("muestra badge Inactivo cuando isActive=false", () => {
    render(
      <ShippingZonesTable zones={[zone({ id: "z1", isActive: false })]} />,
    );
    expect(screen.getByText(/inactiva/i)).toBeInTheDocument();
  });

  it("muestra el freeShippingThreshold cuando existe y '—' si no", () => {
    render(
      <ShippingZonesTable
        zones={[
          zone({ id: "z1", freeShippingThreshold: 80000 }),
          zone({ id: "z2", freeShippingThreshold: undefined }),
        ]}
      />,
    );
    const row1 = screen.getByTestId("zone-row-z1");
    expect(within(row1).getByText(/80\.000/)).toBeInTheDocument();
    const row2 = screen.getByTestId("zone-row-z2");
    expect(within(row2).getByText("—")).toBeInTheDocument();
  });

  it("dispara onEdit al click en Editar de una fila", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    const z = zone({ id: "z1" });
    render(<ShippingZonesTable zones={[z]} onEdit={onEdit} />);
    const row = screen.getByTestId("zone-row-z1");
    await user.click(within(row).getByRole("button", { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(z);
  });

  it("renderiza estado vacío cuando no hay zonas", () => {
    render(<ShippingZonesTable zones={[]} />);
    expect(screen.getByText(/no hay zonas/i)).toBeInTheDocument();
  });
});
