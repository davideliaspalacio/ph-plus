import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ToastProvider,
  useToast,
  __resetToastsForTests,
} from "./Toast";

function Harness({
  message = "Hola",
  tone = "success",
}: {
  message?: string;
  tone?: "success" | "error";
}) {
  const { notify } = useToast();
  return (
    <button
      type="button"
      onClick={() => (tone === "success" ? notify.success(message) : notify.error(message))}
    >
      go
    </button>
  );
}

describe("Toast", () => {
  it("muestra un toast cuando se llama notify.success", async () => {
    __resetToastsForTests();
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "go" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Hola");
  });

  it("auto-dismiss después del duration", async () => {
    __resetToastsForTests();
    const user = userEvent.setup();
    render(
      <ToastProvider defaultDuration={120}>
        <Harness message="Bye" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "go" }));
    expect(screen.getByRole("status")).toHaveTextContent("Bye");
    await waitFor(
      () => expect(screen.queryByRole("status")).not.toBeInTheDocument(),
      { timeout: 1500 },
    );
  });

  it("se puede cerrar manualmente con el botón cerrar", async () => {
    __resetToastsForTests();
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Harness />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "go" }));
    await user.click(
      screen.getByRole("button", { name: "Cerrar notificación" }),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
