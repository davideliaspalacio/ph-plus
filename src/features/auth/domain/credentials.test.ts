import { describe, expect, it } from "vitest";
import {
  EmailSchema,
  PasswordSchema,
  LoginCredentialsSchema,
  SignupInputSchema,
} from "./credentials";

describe("EmailSchema", () => {
  it("acepta un email válido", () => {
    const r = EmailSchema.safeParse("user@example.com");
    expect(r.success).toBe(true);
  });

  it("rechaza un email sin arroba", () => {
    const r = EmailSchema.safeParse("not-an-email");
    expect(r.success).toBe(false);
  });
});

describe("PasswordSchema", () => {
  it("rechaza password de menos de 8 caracteres", () => {
    const r = PasswordSchema.safeParse("ab1");
    expect(r.success).toBe(false);
  });

  it("rechaza password sin al menos un número", () => {
    const r = PasswordSchema.safeParse("abcdefgh");
    expect(r.success).toBe(false);
  });

  it("acepta password con 8+ chars y un número", () => {
    const r = PasswordSchema.safeParse("abcdefg1");
    expect(r.success).toBe(true);
  });
});

describe("LoginCredentialsSchema", () => {
  it("valida email + password no vacío", () => {
    const r = LoginCredentialsSchema.safeParse({
      email: "user@example.com",
      password: "anything",
    });
    expect(r.success).toBe(true);
  });

  it("rechaza email inválido en login", () => {
    const r = LoginCredentialsSchema.safeParse({
      email: "no",
      password: "anything",
    });
    expect(r.success).toBe(false);
  });
});

describe("SignupInputSchema", () => {
  it("acepta signup válido", () => {
    const r = SignupInputSchema.safeParse({
      email: "new@example.com",
      password: "secret123",
      name: "New User",
      acceptsTerms: true,
    });
    expect(r.success).toBe(true);
  });

  it("rechaza signup sin aceptar TyC", () => {
    const r = SignupInputSchema.safeParse({
      email: "new@example.com",
      password: "secret123",
      name: "New User",
      acceptsTerms: false,
    });
    expect(r.success).toBe(false);
  });
});
