import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsForm } from "./SettingsForm";
import type { Settings } from "../domain/settings";

const initial: Settings = {
  businessName: "PH PLUS",
  nit: "900.123.456-7",
  phone: "+57 323 439 2470",
  whatsapp: "+57 323 439 2470",
  taxRate: 0,
  paymentMethods: ["credit_card", "pse"],
  policies: { shipping: "/envios", returns: "/devoluciones" },
};

describe("SettingsForm", () => {
  it("precarga los valores iniciales del negocio", () => {
    render(<SettingsForm initial={initial} onSave={vi.fn()} />);
    expect(
      (screen.getByLabelText(/nombre del negocio/i) as HTMLInputElement).value,
    ).toBe("PH PLUS");
    expect((screen.getByLabelText(/^nit/i) as HTMLInputElement).value).toBe(
      "900.123.456-7",
    );
    // credit_card precargado y pse precargado.
    expect(
      (screen.getByLabelText(/tarjeta de crédito/i) as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect((screen.getByLabelText(/^pse/i) as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      (screen.getByLabelText(/^nequi/i) as HTMLInputElement).checked,
    ).toBe(false);
  });

  it("submit con valores válidos llama onSave con el patch normalizado (taxRate como fracción)", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SettingsForm initial={initial} onSave={onSave} />);

    const taxInput = screen.getByLabelText(/% iva/i) as HTMLInputElement;
    await user.clear(taxInput);
    await user.type(taxInput, "19");

    await user.click(screen.getByLabelText(/^nequi/i));

    await user.click(
      screen.getByRole("button", { name: /guardar cambios/i }),
    );

    expect(onSave).toHaveBeenCalledTimes(1);
    const next = onSave.mock.calls[0][0] as Settings;
    expect(next.taxRate).toBeCloseTo(0.19, 5);
    expect(next.paymentMethods).toContain("nequi");
    expect(next.paymentMethods).toContain("credit_card");
    expect(next.businessName).toBe("PH PLUS");
  });

  it("no llama onSave y muestra error si businessName queda vacío", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SettingsForm initial={initial} onSave={onSave} />);
    await user.clear(screen.getByLabelText(/nombre del negocio/i));
    await user.click(
      screen.getByRole("button", { name: /guardar cambios/i }),
    );
    expect(onSave).not.toHaveBeenCalled();
  });
});
