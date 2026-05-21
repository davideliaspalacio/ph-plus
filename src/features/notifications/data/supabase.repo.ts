import {
  EmailMessageSchema,
  type EmailMessage,
  type EmailStatus,
  type EmailTemplate,
} from "../domain/email";
import { renderTemplate } from "../domain/templates";
import type { EnqueueEmailInput, OutboxRepository } from "./ports";

/**
 * Implementación Supabase del OutboxRepository.
 *
 * Tabla `notifications_outbox`. La columna en DB es `to_email` (porque `to`
 * es palabra reservada en Postgres). En el dominio el campo se llama `to`,
 * así que el mapper convierte en ambos sentidos.
 *
 * `clear()` borra TODAS las filas — mismo contrato que el mock (`ns.clear()`).
 */

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

type OutboxRow = {
  id: string;
  to_email: string;
  subject: string;
  html: string;
  template: EmailTemplate;
  payload: unknown;
  status: EmailStatus;
  error: string | null;
  created_at: string;
  sent_at: string | null;
};

function mapRow(row: OutboxRow): EmailMessage {
  const base: Record<string, unknown> = {
    id: row.id,
    to: row.to_email,
    subject: row.subject,
    html: row.html,
    template: row.template,
    status: row.status,
    createdAt: row.created_at,
  };
  if (row.payload != null && typeof row.payload === "object") {
    base.payload = row.payload as Record<string, unknown>;
  }
  if (row.error != null) {
    base.error = row.error;
  }
  if (row.sent_at != null) {
    base.sentAt = row.sent_at;
  }
  return EmailMessageSchema.parse(base);
}

export class SupabaseOutboxRepo implements OutboxRepository {
  async enqueue(input: EnqueueEmailInput): Promise<EmailMessage> {
    const { subject, html } = renderTemplate(input.template, input.payload ?? {});
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("notifications_outbox") as any;
    const { data, error } = await table
      .insert({
        to_email: input.to,
        subject,
        html,
        template: input.template,
        payload: input.payload ?? null,
        status: "queued",
      })
      .select("*")
      .single();
    if (error) throw new Error(`outbox.enqueue: ${error.message}`);
    return mapRow(data as unknown as OutboxRow);
  }

  async list(status?: EmailStatus): Promise<EmailMessage[]> {
    const client = await getClient();
    let query = client
      .from("notifications_outbox")
      .select("*")
      .order("created_at", { ascending: false });
    if (status) {
      query = query.eq("status", status);
    }
    const { data, error } = await query;
    if (error) throw new Error(`outbox.list: ${error.message}`);
    return ((data ?? []) as unknown as OutboxRow[]).map(mapRow);
  }

  async markSent(id: string): Promise<EmailMessage> {
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("notifications_outbox") as any;
    const { data, error } = await table
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`outbox.markSent: ${error.message}`);
    if (!data) throw new Error(`Email ${id} not found`);
    return mapRow(data as unknown as OutboxRow);
  }

  async markFailed(id: string, errorMessage: string): Promise<EmailMessage> {
    const client = await getClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = client.from("notifications_outbox") as any;
    const { data, error } = await table
      .update({
        status: "failed",
        error: errorMessage,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(`outbox.markFailed: ${error.message}`);
    if (!data) throw new Error(`Email ${id} not found`);
    return mapRow(data as unknown as OutboxRow);
  }

  async clear(): Promise<void> {
    const client = await getClient();
    // Delete-all requires a WHERE clause in PostgREST; usar un filtro siempre
    // verdadero para borrar todas las filas.
    const { error } = await client
      .from("notifications_outbox")
      .delete()
      .not("id", "is", null);
    if (error) throw new Error(`outbox.clear: ${error.message}`);
  }
}
