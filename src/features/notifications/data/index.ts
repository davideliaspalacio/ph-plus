import { MockOutboxRepo } from "./mock.repo";
import type { OutboxRepository } from "./ports";

/**
 * Singleton del repositorio del outbox. El flag `NEXT_PUBLIC_DATA_BACKEND`
 * podrá enrutar a un proveedor real (Resend, Postmark...) cuando exista.
 */

const backend = process.env.NEXT_PUBLIC_DATA_BACKEND ?? "mock";

export const outboxRepo: OutboxRepository =
  backend === "supabase" ? new MockOutboxRepo() : new MockOutboxRepo();
