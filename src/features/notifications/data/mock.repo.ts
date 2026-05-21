import { makeNamespacedStorage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import { EmailMessageSchema, type EmailMessage, type EmailStatus } from "../domain/email";
import { renderTemplate } from "../domain/templates";
import type { EnqueueEmailInput, OutboxRepository } from "./ports";

/**
 * Implementación mock del OutboxRepository.
 *
 * Persiste en `localStorage` bajo el namespace `phplus.db.notifications.outbox.v1`.
 * Cada email es una llave separada (gracias a `makeNamespacedStorage`) — eso
 * facilita listar / clear, e impone un orden estable por `createdAt`.
 */

export const OUTBOX_NAMESPACE = "phplus.db.notifications.outbox.v1";

const ns = makeNamespacedStorage<EmailMessage>(OUTBOX_NAMESPACE);

function sortByCreatedAtDesc(a: EmailMessage, b: EmailMessage): number {
  return b.createdAt.localeCompare(a.createdAt);
}

export class MockOutboxRepo implements OutboxRepository {
  async enqueue(input: EnqueueEmailInput): Promise<EmailMessage> {
    const { subject, html } = renderTemplate(input.template, input.payload ?? {});
    const message = EmailMessageSchema.parse({
      id: newId(),
      to: input.to,
      subject,
      html,
      template: input.template,
      payload: input.payload,
      status: "queued",
      createdAt: new Date().toISOString(),
    });
    ns.set(message.id, message);
    return message;
  }

  async list(status?: EmailStatus): Promise<EmailMessage[]> {
    const all = ns.list().sort(sortByCreatedAtDesc);
    if (!status) return all;
    return all.filter((m) => m.status === status);
  }

  async markSent(id: string): Promise<EmailMessage> {
    const current = ns.get(id);
    if (!current) throw new Error(`Email ${id} not found`);
    const next = EmailMessageSchema.parse({
      ...current,
      status: "sent",
      sentAt: new Date().toISOString(),
      error: undefined,
    });
    ns.set(id, next);
    return next;
  }

  async markFailed(id: string, error: string): Promise<EmailMessage> {
    const current = ns.get(id);
    if (!current) throw new Error(`Email ${id} not found`);
    const next = EmailMessageSchema.parse({
      ...current,
      status: "failed",
      error,
    });
    ns.set(id, next);
    return next;
  }

  async clear(): Promise<void> {
    ns.clear();
  }
}
