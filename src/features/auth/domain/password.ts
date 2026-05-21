/**
 * Hashing de passwords con `crypto.subtle` (SHA-256 + salt).
 *
 * Formato del hash devuelto: `"<salt_hex>:<digest_hex>"` (16 bytes salt, 32 bytes digest).
 *
 * No es bcrypt/argon2 — esto es un mock para el frontend. Cuando migremos a
 * Supabase, el hashing lo hace `auth.users` server-side.
 */

const SALT_BYTES = 16;
const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const b of bytes) {
    out += b.toString(16).padStart(2, "0");
  }
  return out;
}

function fromHex(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("invalid hex");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function digestWithSalt(
  saltHex: string,
  plain: string,
): Promise<string> {
  const data = encoder.encode(`${saltHex}:${plain}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(new Uint8Array(digest));
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(salt);
  const saltHex = toHex(salt);
  const digestHex = await digestWithSalt(saltHex, plain);
  return `${saltHex}:${digestHex}`;
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  if (typeof stored !== "string" || !stored.includes(":")) return false;
  const [saltHex, expectedHex] = stored.split(":");
  if (!saltHex || !expectedHex) return false;
  try {
    // sanity check: salt y digest deben ser hex válido.
    fromHex(saltHex);
    fromHex(expectedHex);
  } catch {
    return false;
  }
  const actualHex = await digestWithSalt(saltHex, plain);
  return timingSafeEqualHex(actualHex, expectedHex);
}

/** Comparación constante en tiempo sobre strings hex de igual longitud esperada. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
