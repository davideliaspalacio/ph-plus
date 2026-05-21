import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renderiza children", () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
  });

  it("aplica clases distintas según tone", () => {
    const { rerender } = render(<Badge tone="success">x</Badge>);
    const a = screen.getByText("x").className;
    rerender(<Badge tone="danger">x</Badge>);
    expect(screen.getByText("x").className).not.toBe(a);
  });

  it("merge de className personalizada", () => {
    render(<Badge className="px-4">x</Badge>);
    expect(screen.getByText("x").className).toContain("px-4");
  });
});
