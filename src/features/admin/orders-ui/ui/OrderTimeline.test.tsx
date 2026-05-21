import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OrderTimeline } from "./OrderTimeline";
import type { OrderStatus } from "@/src/features/orders";

describe("OrderTimeline", () => {
  it("marca como completados los pasos previos al status actual y deja por hacer los siguientes", () => {
    render(<OrderTimeline currentStatus="paid" />);
    const paid = screen.getByTestId("timeline-step-paid");
    expect(paid).toHaveAttribute("data-state", "current");
    const shipped = screen.getByTestId("timeline-step-shipped");
    expect(shipped).toHaveAttribute("data-state", "pending");
  });

  it("muestra solo botones de transiciones válidas para el status actual", () => {
    render(<OrderTimeline currentStatus="paid" />);
    // paid → preparing, cancelled, refunded
    expect(
      screen.getByRole("button", { name: /marcar como preparando/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /cancelar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reembolsar/i }),
    ).toBeInTheDocument();
    // no debe mostrar "marcar como entregado" desde paid
    expect(
      screen.queryByRole("button", { name: /marcar como entregado/i }),
    ).not.toBeInTheDocument();
  });

  it("dispara onTransition con el nuevo status al hacer click en una transición válida", async () => {
    const onTransition = vi.fn();
    const user = userEvent.setup();
    render(<OrderTimeline currentStatus="paid" onTransition={onTransition} />);
    await user.click(
      screen.getByRole("button", { name: /marcar como preparando/i }),
    );
    expect(onTransition).toHaveBeenCalledWith("preparing", undefined);
  });

  it("al elegir 'shipped' pide trackingNumber via modal y lo pasa al callback", async () => {
    const onTransition = vi.fn();
    const user = userEvent.setup();
    render(
      <OrderTimeline currentStatus="preparing" onTransition={onTransition} />,
    );
    await user.click(
      screen.getByRole("button", { name: /marcar como enviado/i }),
    );
    // modal aparece
    const input = await screen.findByLabelText(/número de guía|tracking/i);
    await user.type(input, "ABC123");
    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    expect(onTransition).toHaveBeenCalledWith("shipped", {
      trackingNumber: "ABC123",
    });
  });

  it("no muestra acciones cuando el estado es terminal", () => {
    const terminals: OrderStatus[] = ["closed", "cancelled", "refunded"];
    for (const t of terminals) {
      const { unmount } = render(<OrderTimeline currentStatus={t} />);
      expect(
        screen.queryByRole("button", { name: /marcar como/i }),
      ).not.toBeInTheDocument();
      unmount();
    }
  });
});
