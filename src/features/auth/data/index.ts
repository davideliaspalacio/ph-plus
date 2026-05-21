/**
 * Factory del repo de usuarios. Hoy siempre mock; mañana branch a Supabase
 * según `NEXT_PUBLIC_DATA_BACKEND` (ver `docs/ARCHITECTURE.md` §4.2).
 */

import { MockUserRepo } from "./mock.repo";
import type { UserRepository } from "./ports";

export const userRepo: UserRepository = new MockUserRepo();

export type { UserRepository, NewUserInput } from "./ports";
