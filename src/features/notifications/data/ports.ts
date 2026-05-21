import type { EmailMessage, EmailStatus, EmailTemplate } from "../domain/email";

/**
 * Puerto del repositorio del outbox de emails.
 *
 * `enqueue` recibe los datos crudos (to + template + payload), renderiza el
 * template internamente y deja el registro en `status="queued"`. El servicio
 * (`sendEmail`) luego llama a `markSent` o `markFailed` según el resultado
 * del envío simulado.
 *
 * El día que migremos a un proveedor real (Resend, Postmark, etc.), una
 * implementación distinta de esta interfaz hace el envío real y el resto del
 * código (servicio, UI admin) no cambia.
 */

export type EnqueueEmailInput = {
  to: string;
  template: EmailTemplate;
  payload?: Record<string, unknown>;
};

export interface OutboxRepository {
  enqueue(input: EnqueueEmailInput): Promise<EmailMessage>;
  list(status?: EmailStatus): Promise<EmailMessage[]>;
  markSent(id: string): Promise<EmailMessage>;
  markFailed(id: string, error: string): Promise<EmailMessage>;
  clear(): Promise<void>;
}
