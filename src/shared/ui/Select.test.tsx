import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

describe("Select", () => {
  it("renderiza con label, options y permite seleccionar", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Departamento"
        name="dept"
        options={[
          { value: "co", label: "Colombia" },
          { value: "mx", label: "México" },
        ]}
      />,
    );
    const select = screen.getByLabelText("Departamento");
    await user.selectOptions(select, "mx");
    expect(select).toHaveValue("mx");
  });

  it("muestra error y asocia aria-invalid", () => {
    render(
      <Select
        label="País"
        options={[{ value: "x", label: "X" }]}
        error="requerido"
      />,
    );
    expect(screen.getByLabelText("País")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText("requerido")).toBeInTheDocument();
  });

  it("muestra placeholder como primera opción deshabilitada", () => {
    render(
      <Select
        label="Ciudad"
        placeholder="Selecciona…"
        options={[{ value: "bog", label: "Bogotá" }]}
      />,
    );
    const select = screen.getByLabelText("Ciudad") as HTMLSelectElement;
    const first = select.options[0];
    expect(first.text).toBe("Selecciona…");
    expect(first.disabled).toBe(true);
  });
});
