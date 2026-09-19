import "server-only";

/**
 * Envío de correo transaccional. Dos proveedores, elegidos por env:
 *
 * 1. ZeptoMail (Zoho) — el definitivo. Se usa si están `ZEPTOMAIL_API_KEY` y
 *    `CORREO_REMITENTE`. Exige un dominio verificado (DKIM + bounce CNAME):
 *    el remitente tiene que ser de ese dominio; con un Gmail o con
 *    `*.vercel.app`, Zoho rechaza.
 * 2. Resend — puente mientras no hay dominio. Se usa si sólo está
 *    `RESEND_API_KEY`. Sin dominio verificado manda desde
 *    `onboarding@resend.dev` y SÓLO al correo dueño de la cuenta de Resend.
 *
 * FAIL-SAFE, igual que HubSpot: sin llaves o si la API falla, no se tira —
 * se devuelve `{ sent: false, reason }` y se loguea. Un correo que no sale
 * nunca debe romper el webhook de pagos.
 *
 * Env opcional: CORREO_RESPUESTA (reply-to), RESEND_FROM_EMAIL (remitente
 * de Resend una vez verificado un dominio ahí).
 */

const ZEPTOMAIL_URL = "https://api.zeptomail.com/v1.1/email";
const RESEND_URL = "https://api.resend.com/emails";
const RESEND_DEFAULT_FROM = "PH PLUS <onboarding@resend.dev>";
const REQUEST_TIMEOUT_MS = 8000;

export type EnviarCorreoInput = {
  to: string | string[];
  subject: string;
  html: string;
  /** Viaja en `client_reference`; ZeptoMail lo devuelve en sus webhooks. */
  reference?: string;
};

export type EnviarCorreoResult =
  | { sent: true; provider: "zeptomail" | "resend"; requestId?: string }
  | { sent: false; reason: string };

/** Acepta el token pelado o con el prefijo que muestra el panel de Zoho. */
export function normalizeZeptoToken(raw: string): string {
  return raw.trim().replace(/^Zoho-enczapikey\s+/i, "");
}

/** `Nombre <correo@dominio>` → `{ name, address }`. Acepta también sólo el correo. */
export function parseAddress(value: string): { name?: string; address: string } {
  const match = value.trim().match(/^(.*)<([^>]+)>$/);
  if (!match) return { address: value.trim() };
  const name = match[1].trim().replace(/^"|"$/g, "");
  return name ? { name, address: match[2].trim() } : { address: match[2].trim() };
}

export async function enviarCorreo(input: EnviarCorreoInput): Promise<EnviarCorreoResult> {
  const zeptoToken = process.env.ZEPTOMAIL_API_KEY?.trim();
  const remitente = process.env.CORREO_REMITENTE?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();

  if (zeptoToken && remitente) return sendWithZeptoMail(input, zeptoToken, remitente);
  if (resendKey) return sendWithResend(input, resendKey);

  const reason = "Sin proveedor de correo: falta ZEPTOMAIL_API_KEY + CORREO_REMITENTE o RESEND_API_KEY";
  console.warn(`[correos] No enviado "${input.subject}": ${reason}`);
  return { sent: false, reason };
}

function recipientsOf(input: EnviarCorreoInput): string[] {
  return Array.isArray(input.to) ? input.to : [input.to];
}

async function sendWithZeptoMail(
  input: EnviarCorreoInput,
  rawToken: string,
  remitente: string,
): Promise<EnviarCorreoResult> {
  const replyTo = process.env.CORREO_RESPUESTA?.trim();
  const body = {
    from: parseAddress(remitente),
    to: recipientsOf(input).map((address) => ({ email_address: parseAddress(address) })),
    ...(replyTo ? { reply_to: [parseAddress(replyTo)] } : {}),
    subject: input.subject,
    htmlbody: input.html,
    ...(input.reference ? { client_reference: input.reference } : {}),
  };

  return post(input.subject, "zeptomail", ZEPTOMAIL_URL, body, {
    Authorization: `Zoho-enczapikey ${normalizeZeptoToken(rawToken)}`,
  });
}

async function sendWithResend(input: EnviarCorreoInput, apiKey: string): Promise<EnviarCorreoResult> {
  const replyTo = process.env.CORREO_RESPUESTA?.trim();
  const body = {
    from: process.env.RESEND_FROM_EMAIL?.trim() || RESEND_DEFAULT_FROM,
    to: recipientsOf(input),
    ...(replyTo ? { reply_to: replyTo } : {}),
    subject: input.subject,
    html: input.html,
    ...(input.reference
      ? { tags: [{ name: "reference", value: input.reference.replace(/[^A-Za-z0-9_-]/g, "_") }] }
      : {}),
  };

  return post(input.subject, "resend", RESEND_URL, body, {
    Authorization: `Bearer ${apiKey}`,
  });
}

async function post(
  subject: string,
  provider: "zeptomail" | "resend",
  url: string,
  body: unknown,
  headers: Record<string, string>,
): Promise<EnviarCorreoResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const text = await response.text();
    if (!response.ok) {
      const reason = `${provider} ${response.status}: ${text.slice(0, 500)}`;
      console.error(`[correos] Falló "${subject}": ${reason}`);
      return { sent: false, reason };
    }

    let requestId: string | undefined;
    try {
      const json = JSON.parse(text) as { request_id?: string; id?: string };
      requestId = json.request_id ?? json.id;
    } catch {
      // Respuesta 2xx sin JSON: el correo igual fue aceptado.
    }
    return { sent: true, provider, requestId };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[correos] Error enviando "${subject}" (${provider}): ${reason}`);
    return { sent: false, reason };
  }
}
