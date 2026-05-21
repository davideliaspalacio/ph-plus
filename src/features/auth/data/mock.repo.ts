/**
 * Implementación mock de `UserRepository` sobre `localStorage`.
 *
 * Cada usuario vive en una llave separada bajo el prefijo `phplus.db.users.v1`.
 * El email se normaliza a minúsculas para garantizar lookup case-insensitive.
 */

import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import type { User } from "../domain/user";
import type { NewUserInput, UserRepository } from "./ports";

export const USERS_STORAGE_PREFIX = "phplus.db.users.v1";

const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export class MockUserRepo implements UserRepository {
  private readonly table = makeNamespacedStorage<User>(USERS_STORAGE_PREFIX);

  async findById(id: string): Promise<User | null> {
    return this.table.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const target = normalizeEmail(email);
    const list = this.table.list();
    return list.find((u) => u.email === target) ?? null;
  }

  async create(input: NewUserInput): Promise<User> {
    const email = normalizeEmail(input.email);
    const existing = await this.findByEmail(email);
    if (existing) throw new Error("EMAIL_TAKEN");

    const user: User = {
      id: newId(),
      email,
      name: input.name.trim(),
      role: input.role ?? "customer",
      passwordHash: input.passwordHash,
      createdAt: new Date().toISOString(),
    };
    this.table.set(user.id, user);
    return user;
  }

  async update(
    id: string,
    patch: Partial<Omit<User, "id">>,
  ): Promise<User> {
    const current = await this.findById(id);
    if (!current) throw new Error("USER_NOT_FOUND");

    const next: User = {
      ...current,
      ...patch,
      // si nos cambian el email, normalizamos.
      email: patch.email ? normalizeEmail(patch.email) : current.email,
      id: current.id,
    };
    this.table.set(id, next);
    return next;
  }
}
