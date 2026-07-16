/**
 * Integración con HubSpot CRM (uso server-side únicamente: sólo lo importan
 * route handlers).
 *
 * Diseño FAIL-SAFE: si `HUBSPOT_ACCESS_TOKEN` no está configurado, o si la API
 * de HubSpot falla/tarda, NADA de esto rompe el checkout. Las funciones de
 * orquestación (`syncOrderToHubspot`, `subscribeNewsletterContact`) nunca
 * tiran — devuelven un resultado describiendo qué pasó y loguean el error.
 *
 * Auth: Private App token (Bearer). Creá una Private App en
 * HubSpot → Settings → Integrations → Private Apps con los scopes
 * `crm.objects.contacts.write` y `crm.objects.deals.write`.
 */

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const REQUEST_TIMEOUT_MS = 5000;

/** associationTypeId definido por HubSpot para Deal → Contact. */
const DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID = 3;

export type HubspotConfig = {
  token: string;
  /** Pipeline de negocios (opcional; si falta, HubSpot usa el default). */
  dealPipeline?: string;
  /** Etapa inicial del negocio (opcional; si falta, HubSpot usa la default). */
  dealStage?: string;
};

export function getHubspotConfig(): HubspotConfig | null {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token || token.trim() === "") return null;
  return {
    token,
    dealPipeline: process.env.HUBSPOT_DEAL_PIPELINE || undefined,
    dealStage: process.env.HUBSPOT_DEAL_STAGE || undefined,
  };
}

export function isHubspotEnabled(): boolean {
  return getHubspotConfig() !== null;
}

/* ────────────────────────── Mappers puros (testeables) ─────────────────── */

export function splitFullName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
};

/**
 * Traduce un contacto del checkout a properties de HubSpot. Solo incluye las
 * claves con valor (HubSpot rechaza strings vacíos en algunas properties).
 */
export function mapContactProperties(
  input: ContactInput,
  options?: { lifecycleStage?: string },
): Record<string, string> {
  const { firstName, lastName } = splitFullName(input.name);
  const props: Record<string, string> = { email: input.email };
  if (firstName) props.firstname = firstName;
  if (lastName) props.lastname = lastName;
  if (input.phone) props.phone = input.phone;
  if (input.city) props.city = input.city;
  if (input.address) props.address = input.address;
  if (options?.lifecycleStage) props.lifecyclestage = options.lifecycleStage;
  return props;
}

export type DealInput = {
  orderId: string;
  /** Monto total del pedido (en la moneda de la cuenta HubSpot, ej. COP). */
  amount: number;
  paymentMethod: string;
  itemsSummary: string;
  pipeline?: string;
  stage?: string;
};

export function mapDealProperties(input: DealInput): Record<string, string> {
  const props: Record<string, string> = {
    dealname: `Pedido PH PLUS ${input.orderId}`,
    amount: String(input.amount),
    description:
      `Método de pago: ${input.paymentMethod}. Productos: ${input.itemsSummary}`.slice(
        0,
        65000,
      ),
  };
  if (input.pipeline) props.pipeline = input.pipeline;
  if (input.stage) props.dealstage = input.stage;
  return props;
}

/* ────────────────────────── Cliente HTTP ───────────────────────────────── */

async function hubspotFetch(
  config: HubspotConfig,
  path: string,
  init: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`${HUBSPOT_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function readError(res: Response): Promise<string> {
  const detail = await res.text().catch(() => "");
  return `${res.status} ${detail.slice(0, 300)}`;
}

/**
 * Crea o actualiza un contacto por email (idempotente). Usa el endpoint de
 * upsert batch de HubSpot con `idProperty: "email"`. Devuelve el id del
 * contacto, o null si HubSpot no lo devolvió.
 */
export async function upsertContact(
  config: HubspotConfig,
  input: ContactInput,
  options?: { lifecycleStage?: string },
): Promise<string | null> {
  const properties = mapContactProperties(input, options);
  const res = await hubspotFetch(
    config,
    "/crm/v3/objects/contacts/batch/upsert",
    {
      method: "POST",
      body: JSON.stringify({
        inputs: [{ idProperty: "email", id: input.email, properties }],
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`HubSpot upsert contacto: ${await readError(res)}`);
  }
  const data = (await res.json()) as { results?: Array<{ id?: string }> };
  return data.results?.[0]?.id ?? null;
}

/** Crea un negocio (Deal) y, si hay contactId, lo asocia al contacto. */
export async function createDeal(
  config: HubspotConfig,
  input: DealInput,
  contactId: string | null,
): Promise<string | null> {
  const body: Record<string, unknown> = {
    properties: mapDealProperties({
      ...input,
      pipeline: input.pipeline ?? config.dealPipeline,
      stage: input.stage ?? config.dealStage,
    }),
  };
  if (contactId) {
    body.associations = [
      {
        to: { id: contactId },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: DEAL_TO_CONTACT_ASSOCIATION_TYPE_ID,
          },
        ],
      },
    ];
  }
  const res = await hubspotFetch(config, "/crm/v3/objects/deals", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`HubSpot crear deal: ${await readError(res)}`);
  }
  const data = (await res.json()) as { id?: string };
  return data.id ?? null;
}

/* ────────────────────────── Orquestadores fail-safe ────────────────────── */

export type HubspotSyncResult =
  | { synced: false; reason: string }
  | { synced: true; contactId: string | null; dealId: string | null };

export type OrderSyncInput = {
  orderId: string;
  contact: ContactInput;
  amount: number;
  paymentMethod: string;
  itemsSummary: string;
};

/**
 * Sincroniza un pedido a HubSpot: upsert del contacto (marcado como
 * `customer`) + creación del negocio asociado. Nunca tira: ante cualquier
 * fallo devuelve `{ synced: false, reason }` y loguea.
 */
export async function syncOrderToHubspot(
  input: OrderSyncInput,
): Promise<HubspotSyncResult> {
  const config = getHubspotConfig();
  if (!config) return { synced: false, reason: "HubSpot no configurado" };

  try {
    const contactId = await upsertContact(config, input.contact, {
      lifecycleStage: "customer",
    });
    const dealId = await createDeal(
      config,
      {
        orderId: input.orderId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        itemsSummary: input.itemsSummary,
      },
      contactId,
    );
    return { synced: true, contactId, dealId };
  } catch (error) {
    console.error(
      "[hubspot] sync de pedido falló:",
      error instanceof Error ? error.message : error,
    );
    return {
      synced: false,
      reason: error instanceof Error ? error.message : "error desconocido",
    };
  }
}

export type NewsletterInput = { email: string; name?: string };

/**
 * Suscribe un email al newsletter creando/actualizando el contacto en HubSpot
 * con lifecycle stage `subscriber`. Fail-safe como `syncOrderToHubspot`.
 */
export async function subscribeNewsletterContact(
  input: NewsletterInput,
): Promise<HubspotSyncResult> {
  const config = getHubspotConfig();
  if (!config) return { synced: false, reason: "HubSpot no configurado" };

  try {
    const contactId = await upsertContact(
      config,
      { email: input.email, name: input.name ?? "" },
      { lifecycleStage: "subscriber" },
    );
    return { synced: true, contactId, dealId: null };
  } catch (error) {
    console.error(
      "[hubspot] suscripción newsletter falló:",
      error instanceof Error ? error.message : error,
    );
    return {
      synced: false,
      reason: error instanceof Error ? error.message : "error desconocido",
    };
  }
}
