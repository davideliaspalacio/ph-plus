import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./Drawer";

describe("Drawer", () => {
  it("no renderiza nada cuando isOpen=false", () => {
    render(
      <Drawer isOpen={false} onClose={() => {}} title="Carrito">
        contenido
      </Drawer>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renderiza dialog con título cuando isOpen=true", () => {
    render(
      <Drawer isOpen onClose={() => {}} title="Carrito">
        contenido
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAccessibleName("Carrito");
    expect(screen.getByText("contenido")).toBeInTheDocument();
  });

  it("llama onClose al hacer click en el backdrop", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="x">
        c
      </Drawer>,
    );
    await user.click(screen.getByTestId("drawer-backdrop"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al apretar Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="x">
        c
      </Drawer>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("llama onClose al hacer click en el botón cerrar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer isOpen onClose={onClose} title="x">
        c
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("acepta side='left' y side='right' aplicando clases distintas", () => {
    const { rerender } = render(
      <Drawer isOpen onClose={() => {}} title="x" side="right">
        c
      </Drawer>,
    );
    const right = screen.getByRole("dialog").className;
    rerender(
      <Drawer isOpen onClose={() => {}} title="x" side="left">
        c
      </Drawer>,
    );
    expect(screen.getByRole("dialog").className).not.toBe(right);
  });
});
