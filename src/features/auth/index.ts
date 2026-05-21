/**
 * API pública de la feature `auth`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  useSession,
  SESSION_STORAGE_KEY,
  SESSION_TTL_MS,
  type SessionData,
  type SessionState,
} from "./store/useSession";

export { useAuth } from "./hooks/useAuth";

export {
  login,
  logout,
  signup,
  recoverPassword,
} from "./service";

export {
  EmailSchema,
  PasswordSchema,
  LoginCredentialsSchema,
  SignupInputSchema,
  type LoginCredentials,
  type SignupInput,
} from "./domain/credentials";

export {
  RoleSchema,
  UserSchema,
  ROLES,
  toPublicUser,
  type Role,
  type User,
  type PublicUser,
} from "./domain/user";

export { userRepo, type UserRepository, type NewUserInput } from "./data";
