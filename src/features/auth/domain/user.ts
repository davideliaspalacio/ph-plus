/**
 * Schemas y tipos del modelo de usuario.
 *
 * Mantenemos `passwordHash` dentro del User (el repo es mock + localStorage).
 * Cuando migremos a Supabase el hash vive en `auth.users` y este schema sólo
 * describe los datos públicos del perfil.
 */

import { z } from "zod";

export const ROLES = ["customer", "read_only", "staff", "super_admin"] as const;

export const RoleSchema = z.enum(ROLES);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  role: RoleSchema,
  passwordHash: z.string().min(1),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

/** User sin el hash, seguro de exponer a la UI. */
export type PublicUser = Omit<User, "passwordHash">;

export function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  void _passwordHash;
  return publicUser;
}
