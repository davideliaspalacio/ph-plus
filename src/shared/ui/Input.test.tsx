import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renderiza con label visible y asociado al input", () => {
    render(<Input label="Email" name="email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "email");
  });

  it("acepta typing del usuario", async () => {
    const user = userEvent.setup();
    render(<Input label="Nombre" />);
    const input = screen.getByLabelText("Nombre");
    await user.type(input, "Ada");
    expect(input).toHaveValue("Ada");
  });

  it("muestra hint debajo del input cuando no hay error", () => {
    render(<Input label="Email" hint="Te enviaremos la confirmación." />);
    expect(
      screen.getByText("Te enviaremos la confirmación."),
    ).toBeInTheDocument();
  });

  it("muestra error y lo asocia al input vía aria-describedby + aria-invalid", () => {
    render(<Input label="Email" error="Email inválido" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Email inválido")).toBeInTheDocument();
  });

  it("oculta el hint cuando hay error", () => {
    render(<Input label="Email" hint="Hint" error="Boom" />);
    expect(screen.queryByText("Hint")).not.toBeInTheDocument();
    expect(screen.getByText("Boom")).toBeInTheDocument();
  });

  it("marca required en el label", () => {
    render(<Input label="Email" required />);
    expect(screen.getByText(/Email/)).toHaveTextContent("Email *");
  });

  it("aplica inputMode y type al elemento nativo", () => {
    render(
      <Input
        label="Teléfono"
        type="tel"
        inputMode="numeric"
        defaultValue="123"
      />,
    );
    const input = screen.getByLabelText("Teléfono");
    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveAttribute("inputMode", "numeric");
  });
});
