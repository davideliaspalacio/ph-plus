import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderNotes } from "./OrderNotes";
import type { OrderInternalNote } from "@/src/features/orders";

const notes: OrderInternalNote[] = [
  {
    id: "n1",
    author: "admin",
    text: "Cliente contactado por WhatsApp",
    createdAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "n2",
    author: "staff",
    text: "Pago confirmado en pasarela",
    createdAt: "2026-05-11T08:30:00Z",
  },
];

describe("OrderNotes", () => {
  it("lista las notas con autor y texto", () => {
    render(<OrderNotes notes={notes} />);
    expect(screen.getByText("Cliente contactado por WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Pago confirmado en pasarela")).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
  });

  it("dispara onAddNote con el texto del textarea y limpia el campo", async () => {
    const onAddNote = vi.fn();
    const user = userEvent.setup();
    render(<OrderNotes notes={notes} onAddNote={onAddNote} />);
    const ta = screen.getByPlaceholderText(/escribir nota/i);
    await user.type(ta, "Nueva nota interna");
    await user.click(screen.getByRole("button", { name: /agregar nota/i }));
    expect(onAddNote).toHaveBeenCalledWith("Nueva nota interna");
    expect((ta as HTMLTextAreaElement).value).toBe("");
  });

  it("no dispara onAddNote si el textarea está vacío", async () => {
    const onAddNote = vi.fn();
    const user = userEvent.setup();
    render(<OrderNotes notes={notes} onAddNote={onAddNote} />);
    await user.click(screen.getByRole("button", { name: /agregar nota/i }));
    expect(onAddNote).not.toHaveBeenCalled();
  });
});
