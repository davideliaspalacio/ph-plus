import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Row = Record<string, unknown> & { id: string };

const db: { orders: Row[]; order_notes: Row[] } = { orders: [], order_notes: [] };

function readCol(row: Row, col: string): unknown {
  if (col.includes("->>")) {
    const [base, key] = col.split("->>");
    return ((row[base] ?? {}) as Record<string, unknown>)[key];
  }
  return row[col];
}

// Mini cliente Supabase en memoria: sólo lo que usa wompi-orders.
function fakeClient() {
  return {
    from(table: "orders" | "order_notes") {
      let filters: Array<[string, unknown]> = [];
      let patch: Record<string, unknown> | null = null;
      const match = () =>
        db[table].filter((r) => filters.every(([c, v]) => readCol(r, c) === v));
      const builder = {
        select: () => builder,
        eq: (c: string, v: unknown) => {
          filters.push([c, v]);
          return builder;
        },
        update: (p: Record<string, unknown>) => {
          patch = p;
          return builder;
        },
        insert: async (row: Row) => {
          db[table].push(row);
          return { error: null };
        },
        maybeSingle: async () => ({ data: match()[0] ?? null, error: null }),
        then: (resolve: (v: { error: null }) => void) => {
          if (patch) for (const r of match()) Object.assign(r, patch);
          filters = [];
          resolve({ error: null });
        },
      };
      return builder;
    },
  };
}

vi.mock("@/src/shared/supabase/server", () => ({
  createSupabaseServiceClient: async () => fakeClient(),
}));

import { applyWompiTransaction, attachWompiLink } from "./wompi-orders";

const TOTAL = 88_470;

function seedOrder(overrides: Partial<Row> = {}) {
  db.orders.push({
    id: "ORD-ABC",
    status: "pending_payment",
    totals: { total: TOTAL },
    payment: { method: "wompi", wompiPaymentLinkId: "LINK1" },
    ...overrides,
  });
}

function stubWompiTx(tx: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async () =>
      new Response(
        JSON.stringify({
          data: {
            id: "TX1",
            status: "APPROVED",
            reference: "abc",
            amount_in_cents: TOTAL * 100,
            currency: "COP",
            payment_link_id: "LINK1",
            payment_method_type: "CARD",
            ...tx,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ),
  );
}

const ENV = {
  NEXT_PUBLIC_DATA_BACKEND: "supabase",
  NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  WOMPI_PUBLIC_KEY: "pub_test_a",
  WOMPI_PRIVATE_KEY: "prv_test_b",
};

describe("applyWompiTransaction", () => {
  const saved: Record<string, string | undefined> = {};
  beforeEach(() => {
    db.orders = [];
    db.order_notes = [];
    for (const [k, v] of Object.entries(ENV)) {
      saved[k] = process.env[k];
      process.env[k] = v;
    }
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  });

  it("marca como pagada una transacción APPROVED del link y monto correctos", async () => {
    seedOrder();
    stubWompiTx({});
    const r = await applyWompiTransaction("TX1");

    expect(r).toMatchObject({ matched: true, orderId: "ORD-ABC", applied: true, becamePaid: true });
    expect(db.orders[0].status).toBe("paid");
    expect((db.orders[0].payment as Record<string, unknown>).wompiTransactionId).toBe("TX1");
    expect(db.order_notes).toHaveLength(1);
    expect(db.order_notes[0].text).toContain('orden marcada como "paid"');
  });

  it("es idempotente: aplicar dos veces la misma transacción no duplica nada", async () => {
    seedOrder();
    stubWompiTx({});
    await applyWompiTransaction("TX1");
    const again = await applyWompiTransaction("TX1");

    expect(again).toMatchObject({ matched: true, duplicate: true, becamePaid: false });
    expect(db.order_notes).toHaveLength(1);
  });

  it("NO marca como pagada si el monto cobrado no coincide con el de la orden", async () => {
    seedOrder();
    stubWompiTx({ amount_in_cents: 100 });
    const r = await applyWompiTransaction("TX1");

    expect(r).toMatchObject({ matched: true, applied: false, becamePaid: false });
    expect(db.orders[0].status).toBe("pending_payment");
    expect(db.order_notes[0].text).toContain("NO coincide");
  });

  it("NO marca como pagada si la moneda no es COP", async () => {
    seedOrder();
    stubWompiTx({ currency: "USD" });
    const r = await applyWompiTransaction("TX1");
    expect(r).toMatchObject({ applied: false, becamePaid: false });
    expect(db.orders[0].status).toBe("pending_payment");
  });

  it("cancela la orden cuando el pago es rechazado", async () => {
    seedOrder();
    stubWompiTx({ status: "DECLINED" });
    const r = await applyWompiTransaction("TX1");

    expect(r).toMatchObject({ applied: true, becamePaid: false });
    expect(db.orders[0].status).toBe("cancelled");
    expect((db.orders[0].payment as Record<string, unknown>).lastEventStatus).toBe("DECLINED");
  });

  it("deja la orden como está mientras la transacción siga PENDING", async () => {
    seedOrder();
    stubWompiTx({ status: "PENDING" });
    const r = await applyWompiTransaction("TX1");

    expect(r).toMatchObject({ matched: true, applied: false });
    expect(db.orders[0].status).toBe("pending_payment");
  });

  it("un rechazo tardío no 'des-paga' una orden que ya está pagada", async () => {
    seedOrder({ status: "paid" });
    stubWompiTx({ status: "DECLINED" });
    const r = await applyWompiTransaction("TX1");

    expect(r).toMatchObject({ matched: true, applied: false });
    expect(db.orders[0].status).toBe("paid");
  });

  it("no hace nada si la transacción no corresponde a ninguna orden", async () => {
    seedOrder();
    stubWompiTx({ payment_link_id: "OTRO", reference: "zzz" });
    const r = await applyWompiTransaction("TX1");

    expect(r).toEqual({ matched: false, reason: "orden no encontrada" });
    expect(db.orders[0].status).toBe("pending_payment");
  });

  it("también casa por referencia ORD-… (Web Checkout)", async () => {
    seedOrder({ payment: { method: "wompi" } });
    stubWompiTx({ payment_link_id: null, reference: "ORD-ABC" });
    const r = await applyWompiTransaction("TX1");

    expect(r).toMatchObject({ matched: true, becamePaid: true });
  });

  it("sin persistencia (modo mock) no consulta nada", async () => {
    process.env.NEXT_PUBLIC_DATA_BACKEND = "mock";
    const fn = vi.fn();
    vi.stubGlobal("fetch", fn);
    expect(await applyWompiTransaction("TX1")).toEqual({
      matched: false,
      reason: "persistencia deshabilitada",
    });
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("attachWompiLink", () => {
  beforeEach(() => {
    db.orders = [];
    for (const [k, v] of Object.entries(ENV)) process.env[k] = v;
  });

  it("guarda el id del link conservando el resto del pago", async () => {
    seedOrder({ payment: { method: "wompi", provider: "wompi", extra: 1 } });
    await attachWompiLink("ORD-ABC", "LINK9");
    expect(db.orders[0].payment).toMatchObject({
      method: "wompi",
      extra: 1,
      wompiPaymentLinkId: "LINK9",
    });
  });
});
