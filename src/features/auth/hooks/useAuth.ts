"use client";

import { useCallback } from "react";
import {
  login as loginService,
  signup as signupService,
  logout as logoutService,
  recoverPassword as recoverPasswordService,
} from "../service";
import type { LoginCredentials, SignupInput } from "../domain/credentials";
import { useSession } from "../store/useSession";

/**
 * Hook de fachada para usar en la UI. Combina la sesión actual con las
 * acciones del servicio. Cada acción re-lanza errores (`INVALID_CREDENTIALS`,
 * `EMAIL_TAKEN`) para que el componente decida cómo mostrarlos.
 */
export function useAuth() {
  const session = useSession((s) => s.session);
  const isAuthenticated = useSession((s) => s.isAuthenticated());

  const login = useCallback(
    (credentials: LoginCredentials) => loginService(credentials),
    [],
  );

  const signup = useCallback(
    (input: SignupInput) => signupService(input),
    [],
  );

  const logout = useCallback(() => {
    logoutService();
  }, []);

  const recoverPassword = useCallback(
    (email: string) => recoverPasswordService(email),
    [],
  );

  return {
    session,
    isAuthenticated,
    login,
    signup,
    logout,
    recoverPassword,
  };
}
