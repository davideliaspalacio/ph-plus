import { createHash } from "crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPaymentLink,
  getTransaction,
  getWompiConfig,
  orderStatusFromWompi,
  toCents,
  verifyEventChecksum,
  type WompiConfig,
  type WompiEvent,
} from "./wompi-server";

const ENV_KEYS = ["WOMPI_PUBLIC_KEY", "WOMPI_PRIVATE_KEY", "WOMPI_EVENTS_SECRET"] as const;

describe("getWompiConfig", () => {
  const saved: Record<string, string | undefined> = {};
  beforeEach(() => {
    for (const k of ENV_KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
  });
  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  });

  it("exige ambas llaves", () => {
    process.env.WOMPI_PUBLIC_KEY = "pub_test_abc";
    expect(() => getWompiConfig()).toThrow(/Faltan/);
  });

  it("deduce sandbox de pub_test_", () => {
    process.env.WOMPI_PUBLIC_KEY = "pub_test_abc";
    process.env.WOMPI_PRIVATE_KEY = "prv_test_def";
    const c = getWompiConfig();
    expect(c.test).toBe(true);
    expect(c.apiUrl).toBe("https://sandbox.wompi.co/v1");
    expect(c.eventsSecret).toBeNull();
  });

  it("deduce producción de pub_prod_ y lee el secreto de eventos", () => {
    process.env.WOMPI_PUBLIC_KEY = "pub_prod_abc";
    process.env.WOMPI_PRIVATE_KEY = "prv_prod_def";
    process.env.WOMPI_EVENTS_SECRET = "prod_events_xyz";
    const c = getWompiConfig();
    expect(c.test).toBe(false);
    expect(c.apiUrl).toBe("https://production.wompi.co/v1");
    expect(c.eventsSecret).toBe("prod_events_xyz");
  });

  it("rechaza llaves de ambientes distintos", () => {
    process.env.WOMPI_PUBLIC_KEY = "pub_prod_abc";
    process.env.WOMPI_PRIVATE_KEY = "prv_test_def";
    expect(() => getWompiConfig()).toThrow(/no coincide/);
  });

  it("rechaza una llave pública con prefijo desconocido", () => {
    process.env.WOMPI_PUBLIC_KEY = "xxx";
    process.env.WOMPI_PRIVATE_KEY = "prv_prod_def";
    expect(() => getWompiConfig()).toThrow(/pub_test_ o pub_prod_/);
  });
});

describe("helpers puros", () => {
  it("convierte pesos a centavos sin errores de flotante", () => {
    expect(toCents(88470)).toBe(8_847_000);
    expect(toCents(19.99)).toBe(1999);
  });

  it("mapea estados de Wompi a estados de orden", () => {
    expect(orderStatusFromWompi("APPROVED")).toBe("paid");
    expect(orderStatusFromWompi("DECLINED")).toBe("cancelled");
    expect(orderStatusFromWompi("ERROR")).toBe("cancelled");
    expect(orderStatusFromWompi("VOIDED")).toBe("cancelled");
    expect(orderStatusFromWompi("PENDING")).toBeNull();
    expect(orderStatusFromWompi(undefined)).toBeNull();
  });
});

describe("verifyEventChecksum", () => {
  // Ejemplo de https://docs.wompi.co/docs/colombia/eventos/ reconstruido:
  // checksum = sha256(valores de `properties` + timestamp + secreto).
  const secret = "test_events_secret";
  const timestamp = 1530291411;
  const data = {
    transaction: { id: "1234-1610641025-49201", status: "APPROVED", amount_in_cents: 4490000 },
  };
  const properties = [
    "transaction.id",
    "transaction.status",
    "transaction.amount_in_cents",
  ];
  const checksum = createHash("sha256")
    .update(`1234-1610641025-49201APPROVED4490000${timestamp}${secret}`)
    .digest("hex");
  const event: WompiEvent = {
    event: "transaction.updated",
    data,
    timestamp,
    signature: { checksum, properties },
  };

  it("acepta un evento con checksum correcto", () => {
    expect(verifyEventChecksum(event, secret)).toBe(true);
  });

  it("rechaza un secreto equivocado", () => {
    expect(verifyEventChecksum(event, "otro")).toBe(false);
  });

  it("rechaza un evento manipulado (estado cambiado)", () => {
    const tampered: WompiEvent = {
      ...event,
      data: { transaction: { ...data.transaction, status: "DECLINED" } },
    };
    expect(verifyEventChecksum(tampered, secret)).toBe(false);
  });

  it("rechaza eventos sin firma", () => {
    expect(verifyEventChecksum({ event: "transaction.updated", data }, secret)).toBe(false);
  });
});

describe("llamadas a la API (fetch simulado)", () => {
  const config: WompiConfig = {
    publicKey: "pub_test_a",
    privateKey: "prv_test_b",
    eventsSecret: null,
    test: true,
    apiUrl: "https://sandbox.wompi.co/v1",
    checkoutUrl: "https://checkout.wompi.co/l",
  };

  afterEach(() => vi.unstubAllGlobals());

  function stubFetch(status: number, body: unknown) {
    const fn = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fn);
    return fn;
  }

  it("crea el link con la llave privada y arma la URL del checkout", async () => {
    const fn = stubFetch(201, { data: { id: "LINK123" } });
    const link = await createPaymentLink(config, {
      name: "Pedido PH PLUS ORD-1",
      description: "Kit x1",
      amountInCents: 7_800_000,
      redirectUrl: "https://ph-plus.vercel.app/checkout/wompi/respuesta/ORD-1",
      expiresAt: "2026-10-07T20:00:00.000Z",
    });

    expect(link).toEqual({ id: "LINK123", url: "https://checkout.wompi.co/l/LINK123" });
    const [url, init] = fn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://sandbox.wompi.co/v1/payment_links");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer prv_test_b");
    expect(JSON.parse(init.body as string)).toMatchObject({
      single_use: true,
      collect_shipping: false,
      currency: "COP",
      amount_in_cents: 7_800_000,
    });
  });

  it("recorta nombre (64) y descripción (255) a los límites de Wompi", async () => {
    const fn = stubFetch(201, { data: { id: "L" } });
    await createPaymentLink(config, {
      name: "n".repeat(100),
      description: "d".repeat(400),
      amountInCents: 1,
      redirectUrl: "https://x",
      expiresAt: "2026-10-07T20:00:00.000Z",
    });
    const body = JSON.parse((fn.mock.calls[0] as [string, RequestInit])[1].body as string);
    expect(body.name).toHaveLength(64);
    expect(body.description).toHaveLength(255);
  });

  it("consulta la transacción con la llave pública", async () => {
    const fn = stubFetch(200, {
      data: { id: "T1", status: "APPROVED", amount_in_cents: 100, currency: "COP" },
    });
    const tx = await getTransaction(config, "T1");
    expect(tx.status).toBe("APPROVED");
    const [url, init] = fn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://sandbox.wompi.co/v1/transactions/T1");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer pub_test_a");
  });

  it("propaga el detalle de un error de validación de Wompi", async () => {
    stubFetch(422, {
      error: { type: "INPUT_VALIDATION_ERROR", messages: { name: ["No está presente"] } },
    });
    await expect(
      createPaymentLink(config, {
        name: "",
        description: "",
        amountInCents: 1,
        redirectUrl: "https://x",
        expiresAt: "2026-10-07T20:00:00.000Z",
      }),
    ).rejects.toThrow(/name: No está presente/);
  });

  it("falla con un mensaje claro si Wompi responde 404", async () => {
    stubFetch(404, { error: { type: "NOT_FOUND_ERROR", reason: "La entidad solicitada no existe" } });
    await expect(getTransaction(config, "nope")).rejects.toThrow(/404/);
  });
});
