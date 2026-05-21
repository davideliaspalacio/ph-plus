import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RequireAuth } from "./RequireAuth";
import { useSession } from "@/src/features/auth";

afterEach(() => {
  useSession.getState().clearSession();
});

describe("RequireAuth", () => {
  it("muestra fallback cuando no hay sesión", () => {
    render(
      <RequireAuth>
        <div>secreto</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("secreto")).not.toBeInTheDocument();
    expect(screen.getByText(/iniciá sesión/i)).toBeInTheDocument();
  });

  it("renderiza children cuando hay sesión activa", () => {
    useSession.getState().setSession({
      userId: "u1",
      role: "customer",
      expiresAt: Date.now() + 60_000,
    });
    render(
      <RequireAuth>
        <div>secreto</div>
      </RequireAuth>,
    );
    expect(screen.getByText("secreto")).toBeInTheDocument();
  });
});
