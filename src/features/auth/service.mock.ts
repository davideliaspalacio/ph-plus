/**
 * Servicio de autenticación.
 *
 * Orquesta el `userRepo` (data) + `hashPassword/verifyPassword` (domain) +
 * `useSession` (store). Las pantallas y hooks consumen estas funciones,
 * no tocan el repo directamente.
 *
 * Errores estandarizados:
 *  - `EMAIL_TAKEN`         — signup con email ya registrado
 *  - `INVALID_CREDENTIALS` — login con email inexistente o password mala
 */

import { userRepo } from "./data";
import {
  LoginCredentialsSchema,
  SignupInputSchema,
  type LoginCredentials,
  type SignupInput,
} from "./domain/credentials";
import { hashPassword, verifyPassword } from "./domain/password";
import { toPublicUser, type PublicUser } from "./domain/user";
import { useSession, SESSION_TTL_MS } from "./store/useSession";

function openSessionFor(user: PublicUser): void {
  useSession.getState().setSession({
    userId: user.id,
    role: user.role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
}

export async function signup(input: SignupInput): Promise<PublicUser> {
  const data = SignupInputSchema.parse(input);
  const passwordHash = await hashPassword(data.password);
  const user = await userRepo.create({
    email: data.email,
    name: data.name,
    passwordHash,
  });
  const publicUser = toPublicUser(user);
  openSessionFor(publicUser);
  return publicUser;
}

export async function login(input: LoginCredentials): Promise<PublicUser> {
  const data = LoginCredentialsSchema.parse(input);
  const user = await userRepo.findByEmail(data.email);
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const ok = await verifyPassword(data.password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");
  const publicUser = toPublicUser(user);
  openSessionFor(publicUser);
  return publicUser;
}

export function logout(): void {
  useSession.getState().clearSession();
}

/**
 * Recuperación de password (mock). Siempre devuelve `{ sent: true }` aunque
 * el email no exista para no filtrar qué cuentas existen.
 * Cuando exista el outbox del admin (FUNCTIONAL-SPEC §8) se enchufa acá.
 */
export async function recoverPassword(
  email: string,
): Promise<{ sent: true }> {
  // Lookup defensivo (sin lanzar): si existe podemos en el futuro encolar el email.
  await userRepo.findByEmail(email).catch(() => null);
  return { sent: true };
}
