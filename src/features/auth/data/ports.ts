/**
 * Puerto del repositorio de usuarios.
 *
 * Implementaciones: `mock.repo.ts` (localStorage), `supabase.repo.ts` (futuro).
 */

import type { Role, User } from "../domain/user";

export type NewUserInput = {
  email: string;
  name: string;
  passwordHash: string;
  role?: Role;
};

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(input: NewUserInput): Promise<User>;
  update(id: string, patch: Partial<Omit<User, "id">>): Promise<User>;
}
