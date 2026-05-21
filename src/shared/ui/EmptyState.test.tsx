import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renderiza title y description", () => {
    render(
      <EmptyState title="Sin resultados" description="Probá otros filtros." />,
    );
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
    expect(screen.getByText("Probá otros filtros.")).toBeInTheDocument();
  });

  it("renderiza un action cuando se pasa", () => {
    render(
      <EmptyState
        title="Tu carrito está vacío"
        action={<button>Ver productos</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Ver productos" }),
    ).toBeInTheDocument();
  });
});
