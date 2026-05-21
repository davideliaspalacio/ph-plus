import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "./KpiCard";

describe("KpiCard", () => {
  it("renderiza label y value", () => {
    render(<KpiCard label="Ventas totales" value="$ 120.000" />);
    expect(screen.getByText("Ventas totales")).toBeInTheDocument();
    expect(screen.getByText("$ 120.000")).toBeInTheDocument();
  });

  it("muestra hint cuando viene", () => {
    render(<KpiCard label="Pedidos" value={12} hint="últimos 30 días" />);
    expect(screen.getByText("últimos 30 días")).toBeInTheDocument();
  });

  it("aplica tono brand por defecto y soporta tono whatsapp", () => {
    const { container, rerender } = render(
      <KpiCard label="A" value={1} />,
    );
    expect(container.firstChild).toHaveClass("border-brand/20");

    rerender(<KpiCard label="A" value={1} tone="whatsapp" />);
    expect(container.firstChild).toHaveClass("border-whatsapp/30");
  });
});
