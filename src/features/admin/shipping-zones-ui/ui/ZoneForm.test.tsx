import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ZoneForm } from "./ZoneForm";
import type { ShippingZone } from "@/src/features/shipping";

const existing: ShippingZone = {
  id: "z1",
  name: "Bogotá",
  regions: ["Bogotá", "Soacha"],
  cost: 8000,
  leadTimeDaysMin: 1,
  leadTimeDaysMax: 2,
  freeShippingThreshold: 80000,
  isActive: true,
};

describe("ZoneForm", () => {
  it("precarga los valores cuando se pasa una zona", () => {
    render(
      <ZoneForm zone={existing} onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );
    const name = screen.getByLabelText(/nombre/i) as HTMLInputElement;
    expect(name.value).toBe("Bogotá");
    const regions = screen.getByLabelText(/regiones/i) as HTMLTextAreaElement;
    expect(regions.value).toContain("Bogotá");
    expect(regions.value).toContain("Soacha");
    const cost = screen.getByLabelText(/costo/i) as HTMLInputElement;
    expect(cost.value).toBe("8000");
  });

  it("onCancel se dispara al click en Cancelar", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<ZoneForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("submit válido llama a onSubmit con regiones parseadas (coma y nueva línea)", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ZoneForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/nombre/i), "Norte");
    await user.type(
      screen.getByLabelText(/regiones/i),
      "Bogotá, Chía{enter}Cota",
    );
    await user.clear(screen.getByLabelText(/costo/i));
    await user.type(screen.getByLabelText(/costo/i), "9000");
    await user.clear(screen.getByLabelText(/lead time mín/i));
    await user.type(screen.getByLabelText(/lead time mín/i), "1");
    await user.clear(screen.getByLabelText(/lead time máx/i));
    await user.type(screen.getByLabelText(/lead time máx/i), "3");

    await user.click(screen.getByRole("button", { name: /crear zona/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0];
    expect(values.name).toBe("Norte");
    expect(values.regions).toEqual(["Bogotá", "Chía", "Cota"]);
    expect(values.cost).toBe(9000);
    expect(values.leadTimeDaysMin).toBe(1);
    expect(values.leadTimeDaysMax).toBe(3);
    expect(values.isActive).toBe(true);
  });

  it("muestra error si leadTimeDaysMin < 1", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ZoneForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/nombre/i), "X");
    await user.type(screen.getByLabelText(/regiones/i), "A");
    await user.clear(screen.getByLabelText(/lead time mín/i));
    await user.type(screen.getByLabelText(/lead time mín/i), "0");
    await user.clear(screen.getByLabelText(/lead time máx/i));
    await user.type(screen.getByLabelText(/lead time máx/i), "2");

    await user.click(screen.getByRole("button", { name: /crear zona/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/mín.*>=?\s*1|al menos 1/i)).toBeInTheDocument();
  });

  it("muestra error si leadTimeDaysMax < leadTimeDaysMin", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ZoneForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/nombre/i), "X");
    await user.type(screen.getByLabelText(/regiones/i), "A");
    await user.clear(screen.getByLabelText(/lead time mín/i));
    await user.type(screen.getByLabelText(/lead time mín/i), "5");
    await user.clear(screen.getByLabelText(/lead time máx/i));
    await user.type(screen.getByLabelText(/lead time máx/i), "3");

    await user.click(screen.getByRole("button", { name: /crear zona/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/máx.*>=?\s*mín/i)).toBeInTheDocument();
  });

  it("freeShippingThreshold vacío se envía como undefined", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ZoneForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/nombre/i), "Sur");
    await user.type(screen.getByLabelText(/regiones/i), "Cali");
    await user.clear(screen.getByLabelText(/lead time mín/i));
    await user.type(screen.getByLabelText(/lead time mín/i), "2");
    await user.clear(screen.getByLabelText(/lead time máx/i));
    await user.type(screen.getByLabelText(/lead time máx/i), "4");
    await user.click(screen.getByRole("button", { name: /crear zona/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].freeShippingThreshold).toBeUndefined();
  });
});
