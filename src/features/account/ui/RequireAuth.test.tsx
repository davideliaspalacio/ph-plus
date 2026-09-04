import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireAuth } from "./RequireAuth";
import { useSession } from "@/src/features/auth";

afterEach(() => {
  useSession.getState().clearSession();
  useSession.setState({ hasHydrated: false });
});

describe("RequireAuth", () => {
  it("muestra un estado de carga mientras el store no hidrató", () => {
    useSession.setState({ hasHydrated: false });
    render(
      <RequireAuth>
        <div>secreto</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("secreto")).not.toBeInTheDocument();
    expect(screen.queryByText(/inicia sesión/i)).not.toBeInTheDocument();
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("muestra fallback cuando ya hidrató y no hay sesión", () => {
    useSession.setState({ hasHydrated: true });
    render(
      <RequireAuth>
        <div>secreto</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("secreto")).not.toBeInTheDocument();
    expect(screen.getByText(/inicia sesión/i)).toBeInTheDocument();
  });

  it("renderiza children cuando ya hidrató y hay sesión activa", () => {
    useSession.getState().setSession({
      userId: "u1",
      role: "customer",
      expiresAt: Date.now() + 60_000,
    });
    useSession.setState({ hasHydrated: true });
    render(
      <RequireAuth>
        <div>secreto</div>
      </RequireAuth>,
    );
    expect(screen.getByText("secreto")).toBeInTheDocument();
  });
});
