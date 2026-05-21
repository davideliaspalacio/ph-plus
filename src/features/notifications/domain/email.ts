import { z } from "zod";

/**
 * Schema de un email en el outbox.
 *
 * Representa un mensaje encolado / enviado por el sistema. Sirve como audit
 * log que admin puede inspeccionar en `/admin/ajustes` → Email outbox.
 *
 * - `status` arranca en `queued` cuando se enqueue, pasa a `sent` o `failed`
 *   tras el "envío" simulado.
 * - `template` identifica el template usado (ver `templates.ts`).
 * - `payload` son los datos variables pasados al template.
 */

export const EmailTemplateSchema = z.enum([
  "order_confirmation",
  "order_shipped",
  "password_recover",
  "welcome",
  "review_approved",
  "low_stock_alert",
  "custom",
]);
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>;

export const EmailStatusSchema = z.enum(["queued", "sent", "failed"]);
export type EmailStatus = z.infer<typeof EmailStatusSchema>;

export const EmailMessageSchema = z.object({
  id: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  template: EmailTemplateSchema,
  payload: z.record(z.string(), z.unknown()).optional(),
  status: EmailStatusSchema,
  error: z.string().optional(),
  createdAt: z.string(),
  sentAt: z.string().optional(),
});

export type EmailMessage = z.infer<typeof EmailMessageSchema>;
