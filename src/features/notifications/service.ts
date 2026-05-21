import { z } from "zod";
import { sleep } from "@/src/shared/lib/async";
import { EmailTemplateSchema, type EmailMessage } from "./domain/email";
import { outboxRepo as defaultOutboxRepo } from "./data";
import type { OutboxRepository } from "./data/ports";

/**
 * Servicio de envío de emails.
 *
 * `sendEmail` valida la entrada, encola en el outbox (renderiza el template),
 * simula el envío con un `sleep` corto y marca el mensaje como `sent` o
 * `failed` según un `random()`. Por default ~10% falla; los tests inyectan
 * un random determinista para reproducir cada rama.
 *
 * El día que esto sea real, el adapter del provider reemplaza la rama
 * "simulada" sin cambiar la firma pública.
 */

const SendEmailInputSchema = z.object({
  to: z.string().email(),
  template: EmailTemplateSchema,
  payload: z.record(z.string(), z.unknown()).optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export type SendEmailOptions = {
  /** Inyectable para tests deterministas. Default: `Math.random`. */
  random?: () => number;
  /** Inyectable para tests / DI. Default: `outboxRepo` singleton. */
  repo?: OutboxRepository;
  /** Latencia simulada antes de marcar el envío. Default: 0. */
  delayMs?: number;
  /** Umbral de falla. Si `random() >= 1 - failureRate`, falla. Default: 0.1. */
  failureRate?: number;
};

export const DEFAULT_FAILURE_RATE = 0.1;

export async function sendEmail(
  input: SendEmailInput,
  options: SendEmailOptions = {},
): Promise<EmailMessage> {
  const parsed = SendEmailInputSchema.parse(input);

  const repo = options.repo ?? defaultOutboxRepo;
  const random = options.random ?? Math.random;
  const failureRate = options.failureRate ?? DEFAULT_FAILURE_RATE;

  const queued = await repo.enqueue(parsed);

  if (options.delayMs && options.delayMs > 0) {
    await sleep(options.delayMs);
  }

  const shouldFail = random() >= 1 - failureRate;
  if (shouldFail) {
    return repo.markFailed(queued.id, "simulated provider failure");
  }
  return repo.markSent(queued.id);
}
