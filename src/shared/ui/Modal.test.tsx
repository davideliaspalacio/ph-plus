import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("no renderiza cuando isOpen=false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="t">
        c
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renderiza con title accesible", () => {
    render(
      <Modal isOpen onClose={() => {}} title="Confirmar">
        cuerpo
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Confirmar");
    expect(screen.getByText("cuerpo")).toBeInTheDocument();
  });

  it("cierra con Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} title="t">
        c
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("cierra con click en backdrop sólo si closeOnBackdrop !== false", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Modal isOpen onClose={onClose} title="t">
        c
      </Modal>,
    );
    await user.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).toHaveBeenCalledTimes(1);

    onClose.mockClear();
    rerender(
      <Modal isOpen onClose={onClose} title="t" closeOnBackdrop={false}>
        c
      </Modal>,
    );
    await user.click(screen.getByTestId("modal-backdrop"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
