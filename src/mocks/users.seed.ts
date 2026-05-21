/**
 * Seed inicial de usuarios para los repos mock.
 *
 * Los repos hidratan su namespace en `localStorage` con este array la primera
 * vez que arrancan (o cuando el namespace está vacío). El `passwordHash`
 * usa el placeholder `"$seed$"`: el `service.signup` / un seeder de auth
 * deben re-hashear la password real antes de persistir, o el repo puede
 * rotar el hash en runtime usando `crypto.subtle`.
 *
 * No importamos `User` de `features/auth` para evitar acoplar los mocks al
 * shape vivo (y prevenir ciclos cuando los repos consuman estos seeds).
 * `SeedUser` debe permanecer shape-compatible con `auth.User`.
 */

/**
 * Aligns with `auth/User` (src/features/auth/domain/user.ts).
 * Los valores válidos de role son: "customer" | "read_only" | "staff" | "super_admin".
 */
export type SeedUser = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "read_only" | "staff" | "super_admin";
  /** Placeholder; debe re-hashearse antes de persistirse en producción del mock. */
  passwordHash: string;
  /** ISO datetime. */
  createdAt: string;
};

/** Hash placeholder. Los repos lo reemplazan al usar `service.signup`. */
const SEED_PASSWORD_HASH = "$seed$";

export const USERS_SEED: SeedUser[] = [
  {
    id: "usr_customer_001",
    email: "maria.gomez@example.com",
    name: "María Gómez",
    role: "customer",
    passwordHash: SEED_PASSWORD_HASH,
    createdAt: "2025-01-15T10:24:00.000Z",
  },
  {
    id: "usr_customer_002",
    email: "carlos.rodriguez@example.com",
    name: "Carlos Rodríguez",
    role: "customer",
    passwordHash: SEED_PASSWORD_HASH,
    createdAt: "2025-02-03T16:10:00.000Z",
  },
  {
    id: "usr_readonly_001",
    email: "consulta@phplus.co",
    name: "Consulta PH PLUS",
    role: "read_only",
    passwordHash: SEED_PASSWORD_HASH,
    createdAt: "2025-01-05T09:00:00.000Z",
  },
  {
    id: "usr_staff_001",
    email: "operaciones@phplus.co",
    name: "Andrés Ramírez",
    role: "staff",
    passwordHash: SEED_PASSWORD_HASH,
    createdAt: "2024-12-12T08:30:00.000Z",
  },
  {
    id: "usr_super_admin_001",
    email: "admin@phplus.co",
    name: "Laura Torres",
    role: "super_admin",
    passwordHash: SEED_PASSWORD_HASH,
    createdAt: "2024-10-01T07:00:00.000Z",
  },
];

/** Helper: usuario `customer` principal — referenciado por las órdenes seed. */
export const SEED_PRIMARY_CUSTOMER_ID = USERS_SEED[0]!.id;
