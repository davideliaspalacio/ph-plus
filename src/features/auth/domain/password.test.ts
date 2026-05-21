import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("produce un string con formato '<salt_hex>:<hash_hex>'", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    const [salt, digest] = hash.split(":");
    // 16 bytes salt → 32 hex chars; SHA-256 → 64 hex chars.
    expect(salt.length).toBe(32);
    expect(digest.length).toBe(64);
  });

  it("genera hashes distintos para la misma password (salt aleatorio)", async () => {
    const a = await hashPassword("secret123");
    const b = await hashPassword("secret123");
    expect(a).not.toBe(b);
  });
});

describe("verifyPassword", () => {
  it("devuelve true cuando la password coincide", async () => {
    const hash = await hashPassword("correct-horse-battery-staple-1");
    const ok = await verifyPassword("correct-horse-battery-staple-1", hash);
    expect(ok).toBe(true);
  });

  it("devuelve false cuando la password no coincide", async () => {
    const hash = await hashPassword("secret123");
    const ok = await verifyPassword("nope", hash);
    expect(ok).toBe(false);
  });

  it("devuelve false ante un hash mal formado", async () => {
    const ok = await verifyPassword("secret123", "garbage");
    expect(ok).toBe(false);
  });
});
