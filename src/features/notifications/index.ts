/**
 * API pública de la feature `notifications`.
 *
 * Cualquier consumidor externo (otras features, app/) debe importar SIEMPRE
 * desde acá y nunca desde subpaths internos.
 */

export {
  EmailMessageSchema,
  EmailTemplateSchema,
  EmailStatusSchema,
  type EmailMessage,
  type EmailTemplate,
  type EmailStatus,
} from "./domain/email";

export {
  renderTemplate,
  type RenderedEmail,
  type TemplateRenderer,
} from "./domain/templates";

export { outboxRepo } from "./data";
export type {
  OutboxRepository,
  EnqueueEmailInput,
} from "./data/ports";

export {
  sendEmail,
  DEFAULT_FAILURE_RATE,
  type SendEmailInput,
  type SendEmailOptions,
} from "./service";
