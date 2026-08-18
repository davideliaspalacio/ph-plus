import { createHash, createHmac, randomBytes } from "crypto";

/**
 * Cliente de servidor para la pasarela Rapyd (Hosted Checkout Page).
 *
 * Referencia: https://docs.rapyd.net/en/request-signatures.html y
 * https://docs.rapyd.net/en/webhook-authentication.html
 *
 * Dos firmas distintas, NO intercambiables:
 *  - Firma de REQUEST (llamadas nuestras -> Rapyd): incluye el método HTTP y
 *    usa sólo el path relativo (ej. "/v1/checkout").
 *  - Firma de WEBHOOK (llamadas de Rapyd -> nosotros): NO incluye método HTTP
 *    y usa la URL ABSOLUTA completa configurada para recibir el webhook.
 */

export type RapydConfig = {
  accessKey: string;
  secretKey: string;
  test: boolean;
  baseUrl: string;
  country: string;
  currency: string;
};

const BASE_URLS = {
  test: "https://sandboxapi.rapyd.net",
  production: "https://api.rapyd.net",
} as const;

function boolFromEnv(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function getRapydConfig(): RapydConfig {
  const accessKey = process.env.RAPYD_ACCESS_KEY;
  const secretKey = process.env.RAPYD_SECRET_KEY;
  const test = boolFromEnv(process.env.RAPYD_TEST, true);
  const country = process.env.RAPYD_COUNTRY || "CO";
  const currency = process.env.RAPYD_CURRENCY || "COP";

  if (!accessKey || !secretKey) {
    throw new Error("Faltan RAPYD_ACCESS_KEY o RAPYD_SECRET_KEY");
  }

  return {
    accessKey,
    secretKey,
    test,
    baseUrl: test ? BASE_URLS.test : BASE_URLS.production,
    country,
    currency,
  };
}

function randomSalt(): string {
  // Rapyd pide un string random de 8-16 caracteres.
  return randomBytes(8).toString("hex").slice(0, 12);
}

function hmacBase64(message: string, secretKey: string): string {
  // IMPORTANTE: Rapyd firma el HEX DIGEST del HMAC (como string ASCII), no
  // los bytes crudos. El paso es: hex = HMAC-SHA256(msg, key).hexdigest();
  // signature = base64(hex).
  const hex = createHmac("sha256", secretKey).update(message).digest("hex");
  return Buffer.from(hex).toString("base64");
}

/**
 * Firma para requests salientes (nosotros -> Rapyd).
 * string a firmar: method + urlPath + salt + timestamp + accessKey + secretKey + bodyString
 * - method: minúsculas (get/post/...)
 * - urlPath: sólo el path relativo empezando en "/v1", con querystring si la hay
 * - bodyString: JSON sin espacios extra; "" (no "{}") si no hay body
 */
export function buildRapydRequestSignature({
  method,
  urlPath,
  salt,
  timestamp,
  accessKey,
  secretKey,
  bodyString,
}: {
  method: string;
  urlPath: string;
  salt: string;
  timestamp: number;
  accessKey: string;
  secretKey: string;
  bodyString: string;
}): string {
  const toSign =
    method.toLowerCase() + urlPath + salt + String(timestamp) + accessKey + secretKey + bodyString;
  return hmacBase64(toSign, secretKey);
}

/**
 * Firma esperada de un webhook entrante (Rapyd -> nosotros).
 * string a firmar: urlPath (URL ABSOLUTA completa del webhook) + salt + timestamp + accessKey + secretKey + bodyString
 * Sin método HTTP. bodyString debe ser el body crudo tal cual llegó (sin
 * re-serializar), sin espacios extra fuera de los strings.
 */
export function buildRapydWebhookSignature({
  absoluteUrl,
  salt,
  timestamp,
  accessKey,
  secretKey,
  bodyString,
}: {
  absoluteUrl: string;
  salt: string;
  timestamp: string;
  accessKey: string;
  secretKey: string;
  bodyString: string;
}): string {
  const toSign = absoluteUrl + salt + timestamp + accessKey + secretKey + bodyString;
  return hmacBase64(toSign, secretKey);
}

export type RapydResponse<T> = {
  status: {
    error_code: string;
    status: string; // "SUCCESS" | "ERROR"
    message: string;
    response_code?: string;
    operation_id?: string;
  };
  data: T;
};

export class RapydApiError extends Error {
  constructor(
    message: string,
    public readonly status?: RapydResponse<unknown>["status"],
  ) {
    super(message);
    this.name = "RapydApiError";
  }
}

/**
 * Ejecuta un request firmado contra la API de Rapyd. `urlPath` debe empezar
 * con "/v1/..." (sin el host).
 */
export async function rapydRequest<T>(
  config: RapydConfig,
  method: "get" | "post" | "put" | "delete",
  urlPath: string,
  body?: unknown,
): Promise<T> {
  const bodyString = body === undefined ? "" : JSON.stringify(body);
  const salt = randomSalt();
  const timestamp = Math.floor(Date.now() / 1000);

  const signature = buildRapydRequestSignature({
    method,
    urlPath,
    salt,
    timestamp,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    bodyString,
  });

  const response = await fetch(`${config.baseUrl}${urlPath}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      access_key: config.accessKey,
      salt,
      timestamp: String(timestamp),
      signature,
    },
    body: bodyString === "" ? undefined : bodyString,
    cache: "no-store",
  });

  const json = (await response.json().catch(() => null)) as RapydResponse<T> | null;

  if (!json || json.status?.status !== "SUCCESS") {
    throw new RapydApiError(
      json?.status?.message || `Rapyd respondió ${response.status} sin body válido`,
      json?.status,
    );
  }

  return json.data;
}

export function sanitizeRapydReference(value: string): string {
  // merchant_reference_id de Rapyd acepta hasta 45 caracteres.
  const clean = value.replace(/[^A-Za-z0-9-]/g, "").slice(0, 45);
  return clean || `PHPLUS${Date.now()}`;
}

export function getRequestOrigin(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured && !configured.includes("localhost")) {
    return configured.replace(/\/$/, "");
  }

  const proto = request.headers.get("x-forwarded-proto") || "https";
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}

/** Hash estable (no criptográfico) para deduplicar eventos sin id explícito. */
export function hashWebhookBody(bodyString: string): string {
  return createHash("sha256").update(bodyString).digest("hex").slice(0, 32);
}
