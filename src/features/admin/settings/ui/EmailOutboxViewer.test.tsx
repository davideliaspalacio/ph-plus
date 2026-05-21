import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailOutboxViewer } from "./EmailOutboxViewer";
import type { EmailMessage } from "@/src/features/notifications";

const baseEmail: Omit<EmailMessage, "id" | "to" | "subject" | "status"> = {
  html: "<p>hola</p>",
  template: "order_confirmation",
  createdAt: "2026-05-20T10:00:00.000Z",
};

const emails: EmailMessage[] = [
  {
    ...baseEmail,
    id: "e1",
    to: "ana@ph.test",
    subject: "Confirmación de pedido",
    status: "sent",
    sentAt: "2026-05-20T10:00:01.000Z",
  },
  {
    ...baseEmail,
    id: "e2",
    to: "luis@ph.test",
    subject: "Bienvenida",
    status: "queued",
  },
  {
    ...baseEmail,
    id: "e3",
    to: "mara@ph.test",
    subject: "Recuperación de password",
    status: "failed",
    error: "Bounce",
  },
];

describe("EmailOutboxViewer", () => {
  it("renderiza todos los emails con to, subject y status", () => {
    render(<EmailOutboxViewer emails={emails} />);
    expect(screen.getByText("Confirmación de pedido")).toBeInTheDocument();
    expect(screen.getByText("ana@ph.test")).toBeInTheDocument();
    expect(screen.getByText("Bienvenida")).toBeInTheDocument();
    expect(screen.getByText("Recuperación de password")).toBeInTheDocument();
    expect(screen.getAllByTestId("outbox-row")).toHaveLength(3);
  });

  it("filtra por tab `sent` y solo muestra los emails enviados", async () => {
    const user = userEvent.setup();
    render(<EmailOutboxViewer emails={emails} />);
    await user.click(screen.getByRole("tab", { name: /enviados/i }));
    const panel = screen.getByRole("tabpanel");
    expect(within(panel).getByText("Confirmación de pedido")).toBeInTheDocument();
    expect(within(panel).queryByText("Bienvenida")).not.toBeInTheDocument();
    expect(within(panel).getAllByTestId("outbox-row")).toHaveLength(1);
  });

  it("muestra EmptyState cuando no hay emails en el filtro activo", async () => {
    const user = userEvent.setup();
    render(<EmailOutboxViewer emails={[emails[0]]} />);
    await user.click(screen.getByRole("tab", { name: /fallidos/i }));
    expect(screen.getByText(/no hay emails/i)).toBeInTheDocument();
  });
});
