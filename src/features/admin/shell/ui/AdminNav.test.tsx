import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminNav, ADMIN_NAV_ITEMS } from "./AdminNav";

describe("AdminNav", () => {
  it("renderiza todos los items de navegación", () => {
    render(<AdminNav currentPath="/admin" />);
    for (const item of ADMIN_NAV_ITEMS) {
      expect(
        screen.getByRole("link", { name: item.label }),
      ).toBeInTheDocument();
    }
  });

  it("expone exactamente los 10 items del spec", () => {
    const labels = ADMIN_NAV_ITEMS.map((i) => i.label);
    expect(labels).toEqual([
      "Dashboard",
      "Productos",
      "Pedidos",
      "Inventario",
      "Clientes",
      "Cupones",
      "Envíos",
      "Reseñas",
      "Contenido",
      "Ajustes",
    ]);
  });

  it("marca el link activo con aria-current=page", () => {
    render(<AdminNav currentPath="/admin/pedidos" />);
    const active = screen.getByRole("link", { name: "Pedidos" });
    expect(active).toHaveAttribute("aria-current", "page");
  });

  it("considera /admin como ruta activa solo para Dashboard exacta", () => {
    render(<AdminNav currentPath="/admin" />);
    const dashboard = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboard).toHaveAttribute("aria-current", "page");
    const productos = screen.getByRole("link", { name: "Productos" });
    expect(productos).not.toHaveAttribute("aria-current");
  });
});
