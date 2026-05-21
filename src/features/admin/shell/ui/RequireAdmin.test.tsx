import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireAdmin } from "./RequireAdmin";
import { useSession, SESSION_TTL_MS } from "@/src/features/auth";

afterEach(() => {
  useSession.getState().clearSession();
});

describe("RequireAdmin", () => {
  it("muestra 'No autorizado' cuando no hay sesión", () => {
    render(
      <RequireAdmin>
        <div>contenido secreto</div>
      </RequireAdmin>,
    );
    expect(screen.getByText(/no autorizado/i)).toBeInTheDocument();
    expect(screen.queryByText("contenido secreto")).not.toBeInTheDocument();
  });

  it("muestra 'No autorizado' cuando el rol es customer", () => {
    useSession.getState().setSession({
      userId: "u_1",
      role: "customer",
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    render(
      <RequireAdmin>
        <div>contenido secreto</div>
      </RequireAdmin>,
    );
    expect(screen.getByText(/no autorizado/i)).toBeInTheDocument();
    expect(screen.queryByText("contenido secreto")).not.toBeInTheDocument();
  });

  it("renderiza children cuando el rol es staff", () => {
    useSession.getState().setSession({
      userId: "u_staff",
      role: "staff",
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    render(
      <RequireAdmin>
        <div>contenido secreto</div>
      </RequireAdmin>,
    );
    expect(screen.getByText("contenido secreto")).toBeInTheDocument();
  });

  it("renderiza children para super_admin y read_only", () => {
    useSession.getState().setSession({
      userId: "u_super",
      role: "super_admin",
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    const { rerender } = render(
      <RequireAdmin>
        <div data-testid="ok">ok</div>
      </RequireAdmin>,
    );
    expect(screen.getByTestId("ok")).toBeInTheDocument();

    useSession.getState().setSession({
      userId: "u_ro",
      role: "read_only",
      expiresAt: Date.now() + SESSION_TTL_MS,
    });
    rerender(
      <RequireAdmin>
        <div data-testid="ok2">ok2</div>
      </RequireAdmin>,
    );
    expect(screen.getByTestId("ok2")).toBeInTheDocument();
  });

  it("incluye CTA a /admin/login en el estado no autorizado", () => {
    render(
      <RequireAdmin>
        <div>x</div>
      </RequireAdmin>,
    );
    const cta = screen.getByRole("link", { name: /ir a login admin/i });
    expect(cta).toHaveAttribute("href", "/admin/login");
  });
});
