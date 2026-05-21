import { beforeEach, describe, expect, it } from "vitest";
import { login, logout, signup, recoverPassword } from "./service.mock";
import { useSession, SESSION_STORAGE_KEY } from "./store/useSession";
import { userRepo } from "./data";
import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { USERS_STORAGE_PREFIX } from "./data/mock.repo";

const usersTable = makeNamespacedStorage(USERS_STORAGE_PREFIX);

describe("auth service", () => {
  beforeEach(() => {
    usersTable.clear();
    useSession.getState().clearSession();
    localStorage.removeItem(SESSION_STORAGE_KEY);
  });

  it("signup crea un usuario, devuelve el PublicUser y abre sesión", async () => {
    const user = await signup({
      email: "ana@example.com",
      password: "secret123",
      name: "Ana",
      acceptsTerms: true,
    });
    expect(user.email).toBe("ana@example.com");
    expect("passwordHash" in user).toBe(false);
    expect(useSession.getState().isAuthenticated()).toBe(true);
    expect(useSession.getState().session?.userId).toBe(user.id);
  });

  it("signup tira EMAIL_TAKEN si el email ya existe", async () => {
    await signup({
      email: "ana@example.com",
      password: "secret123",
      name: "Ana",
      acceptsTerms: true,
    });
    await expect(
      signup({
        email: "ANA@example.com",
        password: "other1234",
        name: "Otra",
        acceptsTerms: true,
      }),
    ).rejects.toThrow("EMAIL_TAKEN");
  });

  it("login con credenciales válidas abre sesión", async () => {
    await signup({
      email: "leo@example.com",
      password: "secret123",
      name: "Leo",
      acceptsTerms: true,
    });
    useSession.getState().clearSession();

    const user = await login({
      email: "Leo@example.com",
      password: "secret123",
    });
    expect(user.email).toBe("leo@example.com");
    expect(useSession.getState().isAuthenticated()).toBe(true);
  });

  it("login con password incorrecta tira INVALID_CREDENTIALS y no abre sesión", async () => {
    await signup({
      email: "x@example.com",
      password: "secret123",
      name: "X",
      acceptsTerms: true,
    });
    useSession.getState().clearSession();

    await expect(
      login({ email: "x@example.com", password: "wrong-pass" }),
    ).rejects.toThrow("INVALID_CREDENTIALS");
    expect(useSession.getState().isAuthenticated()).toBe(false);
  });

  it("login con email inexistente tira INVALID_CREDENTIALS", async () => {
    await expect(
      login({ email: "ghost@example.com", password: "secret123" }),
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it("logout limpia la sesión", async () => {
    await signup({
      email: "z@example.com",
      password: "secret123",
      name: "Z",
      acceptsTerms: true,
    });
    expect(useSession.getState().isAuthenticated()).toBe(true);
    logout();
    expect(useSession.getState().session).toBeNull();
  });

  it("recoverPassword devuelve { sent: true } aunque el email no exista (no leak)", async () => {
    const r1 = await recoverPassword("nadie@example.com");
    expect(r1).toEqual({ sent: true });

    await signup({
      email: "real@example.com",
      password: "secret123",
      name: "Real",
      acceptsTerms: true,
    });
    const r2 = await recoverPassword("real@example.com");
    expect(r2).toEqual({ sent: true });
  });

  it("el userRepo singleton ve al usuario creado por signup", async () => {
    const u = await signup({
      email: "check@example.com",
      password: "secret123",
      name: "Check",
      acceptsTerms: true,
    });
    const found = await userRepo.findById(u.id);
    expect(found?.email).toBe("check@example.com");
  });
});
