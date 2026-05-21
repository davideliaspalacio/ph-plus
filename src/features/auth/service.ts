/**
 * Router del servicio de autenticación.
 *
 * Selecciona la implementación (`./service.mock` vs `./service.supabase`)
 * según `NEXT_PUBLIC_DATA_BACKEND`. La API pública (login, signup, logout,
 * recoverPassword) se mantiene igual para que `useAuth` y las pages no
 * tengan que cambiar.
 *
 * Importar el módulo `./service.supabase` es seguro incluso en modo mock:
 * sus dependencias de Supabase (browser/server client) se cargan lazy dentro
 * de cada función.
 */

import type { LoginCredentials, SignupInput } from "./domain/credentials";
import type { PublicUser } from "./domain/user";
import * as mockService from "./service.mock";
import * as supabaseService from "./service.supabase";

type AuthService = {
  login: (input: LoginCredentials) => Promise<PublicUser>;
  signup: (input: SignupInput) => Promise<PublicUser>;
  logout: () => void | Promise<void>;
  recoverPassword: (email: string) => Promise<{ sent: true }>;
};

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

const impl: AuthService =
  backend === "supabase" ? supabaseService : mockService;

export const login = impl.login;
export const signup = impl.signup;
export const logout = impl.logout;
export const recoverPassword = impl.recoverPassword;
