import { createHash, timingSafeEqual } from "crypto";

/**
 * Cliente de servidor para la pasarela Wompi (Bancolombia).
 *
 * Flujo: creamos un Payment Link con la llave PRIVADA (POST /payment_links),
 * redirigimos al comprador a https://checkout.wompi.co/l/<id> y Wompi lo
 * devuelve a `redirect_url` agregando `?id=<transactionId>`. El estado de la
 * orden NUNCA se decide por lo que llega en la URL ni en el body del webhook:
 * siempre se vuelve a consultar la transacción a Wompi (`getTransaction`) y esa
 * respuesta es la que manda (ver `wompi-orders.ts`).
 *
 * Ambiente: se deduce del prefijo de la llave pública (`pub_test_` =
 * sandbox, `pub_prod_` = producción), así no hay un flag aparte que pueda
 * quedar desalineado con las llaves.
 *
 * Docs: https://docs.wompi.co/docs/colombia/
 */

export type WompiConfig = {
  publicKey: string;
  privateKey: string;
  /** Secreto de eventos (webhooks). Opcional: si falta, se confía sólo en la re-consulta. */
  eventsSecret: string | null;
  test: boolean;
  apiUrl: string;
  checkoutUrl: string;
};

const API_URLS = {
  test: "https://sandbox.wompi.co/v1",
  production: "https://production.wompi.co/v1",
} as const;

const CHECKOUT_LINK_URL = "https://checkout.wompi.co/l";

export function getWompiConfig(): WompiConfig {
  const publicKey = process.env.WOMPI_PUBLIC_KEY?.trim();
  const privateKey = process.env.WOMPI_PRIVATE_KEY?.trim();
  const eventsSecret = process.env.WOMPI_EVENTS_SECRET?.trim() || null;

  if (!publicKey || !privateKey) {
    throw new Error("Faltan WOMPI_PUBLIC_KEY o WOMPI_PRIVATE_KEY");
  }

  const test = publicKey.startsWith("pub_test_");
  if (!test && !publicKey.startsWith("pub_prod_")) {
    throw new Error("WOMPI_PUBLIC_KEY debe empezar por pub_test_ o pub_prod_");
  }
  if (!privateKey.startsWith(test ? "prv_test_" : "prv_prod_")) {
    throw new Error(
      "WOMPI_PRIVATE_KEY no coincide con el ambiente de WOMPI_PUBLIC_KEY (test/prod)",
    );
  }

  return {
    publicKey,
    privateKey,
    eventsSecret,
    test,
    apiUrl: test ? API_URLS.test : API_URLS.production,
    checkoutUrl: CHECKOUT_LINK_URL,
  };
}

type WompiErrorBody = {
  error?: { type?: string; reason?: string; messages?: Record<string, string[]> };
};

function describeWompiError(body: WompiErrorBody | null, status: number): string {
  const err = body?.error;
  if (err?.messages) {
    const detail = Object.entries(err.messages)
      .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
      .join("; ");
    if (detail) return `Wompi rechazó la solicitud (${detail})`;
  }
  if (err?.reason) return `Wompi respondió ${status}: ${err.reason}`;
  return `Wompi respondió ${status} sin detalle`;
}

async function wompiRequest<T>(
  config: WompiConfig,
  method: "GET" | "POST" | "PATCH",
  path: string,
  options: { body?: unknown; auth: "private" | "public" },
): Promise<T> {
  const token = options.auth === "private" ? config.privateKey : config.publicKey;
  const response = await fetch(`${config.apiUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    // Wompi suele responder en <1s; no dejamos el checkout colgado si no.
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });

  const json = (await response.json().catch(() => null)) as
    | (WompiErrorBody & { data?: T })
    | null;

  if (!response.ok || !json || json.data === undefined) {
    throw new Error(describeWompiError(json, response.status));
  }
  return json.data;
}

/** Pesos COP -> centavos (Wompi siempre trabaja en `amount_in_cents`). */
export function toCents(pesos: number): number {
  return Math.round(pesos * 100);
}

export type WompiPaymentLink = { id: string; url: string };

export async function createPaymentLink(
  config: WompiConfig,
  input: {
    name: string;
    description: string;
    amountInCents: number;
    redirectUrl: string;
    /** ISO 8601. Pasado ese momento el link deja de aceptar pagos. */
    expiresAt: string;
  },
): Promise<WompiPaymentLink> {
  const data = await wompiRequest<{ id: string }>(config, "POST", "/payment_links", {
    auth: "private",
    body: {
      // Límites de Wompi: name <= 64, description <= 255.
      name: input.name.slice(0, 64),
      description: input.description.slice(0, 255),
      single_use: true,
      collect_shipping: false,
      currency: "COP",
      amount_in_cents: input.amountInCents,
      redirect_url: input.redirectUrl,
      expires_at: input.expiresAt,
    },
  });
  return { id: data.id, url: `${config.checkoutUrl}/${data.id}` };
}

/** Desactiva un link (usado para limpiar pruebas). No lanza si falla. */
export async function deactivatePaymentLink(
  config: WompiConfig,
  linkId: string,
): Promise<boolean> {
  try {
    await wompiRequest(config, "PATCH", `/payment_links/${encodeURIComponent(linkId)}`, {
      auth: "private",
      body: { active: false },
    });
    return true;
  } catch {
    return false;
  }
}

export type WompiTransactionStatus =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "VOIDED"
  | "ERROR";

export type WompiTransaction = {
  id: string;
  status: WompiTransactionStatus;
  reference: string | null;
  amount_in_cents: number;
  currency: string;
  payment_link_id: string | null;
  payment_method_type?: string | null;
  status_message?: string | null;
};

/** Fuente de verdad del estado de un pago: se consulta SIEMPRE a Wompi. */
export async function getTransaction(
  config: WompiConfig,
  transactionId: string,
): Promise<WompiTransaction> {
  return wompiRequest<WompiTransaction>(
    config,
    "GET",
    `/transactions/${encodeURIComponent(transactionId)}`,
    { auth: "public" },
  );
}

/**
 * Estado de la orden que corresponde a un estado de transacción de Wompi.
 * `null` = todavía no es definitivo (PENDING): no se toca la orden.
 */
export function orderStatusFromWompi(
  status: string | undefined,
): "paid" | "cancelled" | null {
  switch (status) {
    case "APPROVED":
      return "paid";
    case "DECLINED":
    case "ERROR":
    case "VOIDED":
      return "cancelled";
    default:
      return null;
  }
}

export type WompiEvent = {
  event?: string;
  data?: { transaction?: Partial<WompiTransaction> } & Record<string, unknown>;
  timestamp?: number;
  signature?: { checksum?: string; properties?: string[] };
};

function readPath(source: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      source,
    );
}

/**
 * Valida el checksum de un evento (https://docs.wompi.co/docs/colombia/eventos/):
 * SHA256( valores de `signature.properties` leídos de `data` + timestamp + secreto ).
 */
export function verifyEventChecksum(event: WompiEvent, eventsSecret: string): boolean {
  const checksum = event.signature?.checksum;
  const properties = event.signature?.properties;
  if (!checksum || !properties?.length || event.timestamp === undefined) return false;

  const concatenated =
    properties.map((p) => String(readPath(event.data, p) ?? "")).join("") +
    String(event.timestamp) +
    eventsSecret;

  const expected = createHash("sha256").update(concatenated).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(checksum.toLowerCase(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
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
