/**
 * Servicio de autenticación contra **Supabase Auth**.
 *
 * Misma API pública que `./service.mock` para que el router de `./service.ts`
 * pueda intercambiar implementaciones según `NEXT_PUBLIC_DATA_BACKEND`.
 *
 * Errores estandarizados (compatibles con el mock):
 *  - `INVALID_CREDENTIALS` — login fallido
 *  - `EMAIL_TAKEN`         — signup con email ya registrado
 *
 * El cliente Supabase se importa **lazy** dentro de cada función para que el
 * archivo no falle al cargarse cuando el backend está en "mock" y las env
 * vars de Supabase no están definidas.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LoginCredentialsSchema,
  SignupInputSchema,
  type LoginCredentials,
  type SignupInput,
} from "./domain/credentials";
import {
  type PublicUser,
  type Role,
  RoleSchema,
} from "./domain/user";
import { useSession, SESSION_TTL_MS } from "./store/useSession";
import type { Database } from "@/src/shared/supabase/types";

type DbClient = SupabaseClient<Database>;

async function getClient(): Promise<DbClient> {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

function openSessionFor(userId: string, role: Role): void {
  useSession.getState().setSession({
    userId,
    role,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
}

/**
 * Lee la profile del usuario por id. Como el trigger `handle_new_user` corre
 * justo después del insert en auth.users, en signup puede haber una pequeña
 * ventana de race — reintentamos `attempts` veces con `delayMs` entre cada uno.
 */
async function readProfile(
  client: DbClient,
  userId: string,
  { attempts = 1, delayMs = 200 }: { attempts?: number; delayMs?: number } = {},
): Promise<{ id: string; name: string; role: Role; email: string } | null> {
  for (let i = 0; i < attempts; i++) {
    const { data, error } = await client
      .from("profiles")
      .select("id, name, role, email")
      .eq("id", userId)
      .maybeSingle();

    const row = data as unknown as {
      id: string;
      name: string;
      role: string;
      email: string;
    } | null;

    if (!error && row) {
      const parsedRole = RoleSchema.safeParse(row.role);
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: parsedRole.success ? parsedRole.data : "customer",
      };
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
}

export async function login(input: LoginCredentials): Promise<PublicUser> {
  const data = LoginCredentialsSchema.parse(input);
  const client = await getClient();

  const { data: authData, error } = await client.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error || !authData.user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const profile = await readProfile(client, authData.user.id);
  const role: Role = profile?.role ?? "customer";
  const name = profile?.name ?? authData.user.email?.split("@")[0] ?? "";
  const email = profile?.email ?? authData.user.email ?? data.email;

  openSessionFor(authData.user.id, role);

  return {
    id: authData.user.id,
    email,
    name,
    role,
    createdAt: authData.user.created_at ?? new Date().toISOString(),
  };
}

export async function signup(input: SignupInput): Promise<PublicUser> {
  const data = SignupInputSchema.parse(input);
  const client = await getClient();

  const { data: authData, error } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { name: data.name },
    },
  });

  if (error) {
    // Supabase devuelve mensajes tipo "User already registered" cuando el
    // email ya existe. Normalizamos al error que la UI ya conoce.
    const msg = (error.message || "").toLowerCase();
    if (
      msg.includes("already registered") ||
      msg.includes("already exists") ||
      msg.includes("user already")
    ) {
      throw new Error("EMAIL_TAKEN");
    }
    throw new Error(error.message || "SIGNUP_FAILED");
  }
  if (!authData.user) {
    throw new Error("SIGNUP_FAILED");
  }

  // El trigger DB crea la profile — puede tardar un cachito.
  const profile = await readProfile(client, authData.user.id, {
    attempts: 3,
    delayMs: 200,
  });
  const role: Role = profile?.role ?? "customer";
  const name = profile?.name ?? data.name;
  const email = profile?.email ?? authData.user.email ?? data.email;

  openSessionFor(authData.user.id, role);

  return {
    id: authData.user.id,
    email,
    name,
    role,
    createdAt: authData.user.created_at ?? new Date().toISOString(),
  };
}

export async function logout(): Promise<void> {
  try {
    const client = await getClient();
    await client.auth.signOut();
  } finally {
    useSession.getState().clearSession();
  }
}

/**
 * Dispara el email de recuperación. Siempre devuelve `{ sent: true }` aunque
 * el email no exista, para evitar user enumeration (mismo contrato que el mock).
 */
export async function recoverPassword(
  email: string,
): Promise<{ sent: true }> {
  try {
    const client = await getClient();
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=/cuenta`
        : undefined;
    await client.auth.resetPasswordForEmail(email, { redirectTo });
  } catch {
    // Tragamos el error a propósito — no queremos filtrar nada al cliente.
  }
  return { sent: true };
}
