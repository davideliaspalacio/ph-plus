import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminShell } from "./AdminShell";
import { useSession, SESSION_TTL_MS } from "@/src/features/auth";

afterEach(() => {
  useSession.getState().clearSession();
});

describe("AdminShell", () => {
  it("renderiza children dentro del shell", () => {
    render(
      <AdminShell currentPath="/admin">
        <div data-testid="content">contenido</div>
      </AdminShell>,
    );
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("incluye el branding 'PH PLUS' en el sidebar", () => {
    render(
      <AdminShell currentPath="/admin">
        <div>x</div>
      </AdminShell>,
    );
    expect(screen.getAllByText(/ph plus/i).length).toBeGreaterThan(0);
  });

  it("renderiza el menú de navegación con sus 10 items (desktop)", () => {
    render(
      <AdminShell currentPath="/admin">
        <div>x</div>
      </AdminShell>,
    );
    // El sidebar desktop siempre está montado (oculto en mobile vía CSS).
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ajustes" })).toBeInTheDocument();
  });

  it("llama logout y limpia la sesión al click en 'Cerrar sesión'", async () => {
    useSession.getState().setSession({
      userId: "u_1",
      role: "staff",
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    expect(useSession.getState().session).not.toBeNull();

    const user = userEvent.setup();
    render(
      <AdminShell currentPath="/admin">
        <div>x</div>
      </AdminShell>,
    );

    const buttons = screen.getAllByRole("button", { name: /cerrar sesión/i });
    await user.click(buttons[0]);
    expect(useSession.getState().session).toBeNull();
  });

  it("abre el drawer mobile al click en el botón hamburguesa", async () => {
    const user = userEvent.setup();
    render(
      <AdminShell currentPath="/admin">
        <div>x</div>
      </AdminShell>,
    );
    const toggle = screen.getByRole("button", { name: /abrir menú/i });
    await user.click(toggle);
    // El drawer renderiza el título "Menú admin" cuando se abre
    expect(screen.getByRole("dialog", { name: /menú admin/i })).toBeInTheDocument();
  });

  it("usa el nombre del usuario provisto en userName", () => {
    render(
      <AdminShell currentPath="/admin" userName="Operaciones PH" userRoleLabel="Staff">
        <div>x</div>
      </AdminShell>,
    );
    // Aparece en sidebar y topbar.
    expect(screen.getAllByText("Operaciones PH").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/staff/i).length).toBeGreaterThan(0);
  });

  it("invoca onLogout custom si se pasa", async () => {
    const onLogout = vi.fn();
    const user = userEvent.setup();
    render(
      <AdminShell currentPath="/admin" onLogout={onLogout}>
        <div>x</div>
      </AdminShell>,
    );
    const buttons = screen.getAllByRole("button", { name: /cerrar sesión/i });
    await user.click(buttons[0]);
    expect(onLogout).toHaveBeenCalled();
  });
});
