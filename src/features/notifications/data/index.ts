import { MockOutboxRepo } from "./mock.repo";
import { SupabaseOutboxRepo } from "./supabase.repo";
import type { OutboxRepository } from "./ports";

/**
 * Singleton del repositorio del outbox. Switch por `NEXT_PUBLIC_DATA_BACKEND`:
 *  - "supabase" → `SupabaseOutboxRepo` (tabla `notifications_outbox`)
 *  - cualquier otro → `MockOutboxRepo` (localStorage)
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const outboxRepo: OutboxRepository =
  backend === "supabase" ? new SupabaseOutboxRepo() : new MockOutboxRepo();
