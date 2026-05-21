import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const items = [
  { id: "desc", label: "Descripción", content: <p>Contenido descripción</p> },
  { id: "specs", label: "Specs", content: <p>Contenido specs</p> },
  { id: "rev", label: "Reseñas", content: <p>Contenido reseñas</p> },
];

describe("Tabs", () => {
  it("renderiza todas las pestañas con role=tab", () => {
    render(<Tabs items={items} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
  });

  it("muestra contenido del primer tab por default", () => {
    render(<Tabs items={items} />);
    expect(screen.getByText("Contenido descripción")).toBeInTheDocument();
    expect(screen.queryByText("Contenido specs")).not.toBeInTheDocument();
  });

  it("cambia de tab al hacer click", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);
    await user.click(screen.getByRole("tab", { name: "Specs" }));
    expect(screen.getByText("Contenido specs")).toBeInTheDocument();
    expect(screen.queryByText("Contenido descripción")).not.toBeInTheDocument();
  });

  it("marca aria-selected en el tab activo", async () => {
    const user = userEvent.setup();
    render(<Tabs items={items} />);
    await user.click(screen.getByRole("tab", { name: "Reseñas" }));
    expect(screen.getByRole("tab", { name: "Reseñas" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Specs" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("respeta defaultActiveId", () => {
    render(<Tabs items={items} defaultActiveId="specs" />);
    expect(screen.getByText("Contenido specs")).toBeInTheDocument();
  });
});
