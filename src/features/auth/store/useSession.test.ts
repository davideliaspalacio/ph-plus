import { beforeEach, describe, expect, it } from "vitest";
import { useSession, SESSION_STORAGE_KEY } from "./useSession";

describe("useSession", () => {
  beforeEach(() => {
    useSession.getState().clearSession();
    localStorage.removeItem(SESSION_STORAGE_KEY);
  });

  it("arranca sin sesión (session === null)", () => {
    expect(useSession.getState().session).toBeNull();
    expect(useSession.getState().isAuthenticated()).toBe(false);
  });

  it("setSession guarda los datos y marca autenticado", () => {
    useSession.getState().setSession({
      userId: "u_1",
      role: "customer",
      expiresAt: Date.now() + 60_000,
    });
    expect(useSession.getState().session?.userId).toBe("u_1");
    expect(useSession.getState().isAuthenticated()).toBe(true);
  });

  it("clearSession borra la sesión", () => {
    useSession.getState().setSession({
      userId: "u_1",
      role: "customer",
      expiresAt: Date.now() + 60_000,
    });
    useSession.getState().clearSession();
    expect(useSession.getState().session).toBeNull();
    expect(useSession.getState().isAuthenticated()).toBe(false);
  });

  it("isAuthenticated() devuelve false si la sesión está expirada", () => {
    useSession.getState().setSession({
      userId: "u_1",
      role: "customer",
      expiresAt: Date.now() - 1_000, // ya venció
    });
    expect(useSession.getState().isAuthenticated()).toBe(false);
  });

  it("persistencia: la sesión queda en localStorage bajo la llave correcta", () => {
    useSession.getState().setSession({
      userId: "u_persist",
      role: "staff",
      expiresAt: Date.now() + 60_000,
    });
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(raw).toContain("u_persist");
  });
});
