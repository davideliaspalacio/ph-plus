import { NextResponse } from "next/server";

import {
  createPayuConfirmationSignature,
  getPayuConfig,
  verifySignature,
} from "@/app/lib/payu-server";
import type { OrderStatus } from "@/src/features/orders";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

export const runtime = "nodejs";

function normalizePayloadEntry(value: FormDataEntryValue | unknown): string {
  return typeof value === "string" ? value : "";
}

async function parsePayuPayload(request: Request): Promise<Record<string, string>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    if (body && typeof body === "object") {
      return Object.fromEntries(
        Object.entries(body as Record<string, unknown>).map(([key, value]) => [
          key,
          typeof value === "string" ? value : String(value ?? ""),
        ]),
      );
    }
  }

  const formData = await request.formData();
  return Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [
      key,
      normalizePayloadEntry(value),
    ]),
  );
}

function statusFromPayuState(statePol: string): OrderStatus {
  if (statePol === "4") return "paid";
  if (statePol === "5" || statePol === "6") return "cancelled";
  return "pending_payment";
}

async function updateOrderFromConfirmation(payload: Record<string, string>) {
  if (
    process.env.NEXT_PUBLIC_DATA_BACKEND !== "supabase" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return;
  }

  const orderId = payload.extra1;
  if (!orderId) return;

  const supabase = await createSupabaseServiceClient();
  const nextStatus = statusFromPayuState(payload.state_pol);
  const payment = {
    method: "payu",
    provider: "payu",
    reference: payload.reference_sale,
    transactionId: payload.transaction_id || payload.reference_pol,
    state: payload.state_pol,
  };

  const { error } = await supabase
    .from("orders")
    .update({
      status: nextStatus,
      payment,
      updated_at: new Date().toISOString(),
    } as never)
    .eq("id", orderId);

  if (error) {
    throw new Error(`No se pudo actualizar la orden ${orderId}: ${error.message}`);
  }

  await supabase.from("order_notes").insert({
    order_id: orderId,
    author: "PayU",
    text: `Confirmación PayU: estado ${payload.state_pol}, referencia ${payload.reference_sale}, transacción ${payment.transactionId || "N/A"}.`,
  } as never);
}

export async function POST(request: Request) {
  const payload = await parsePayuPayload(request);

  let config;
  try {
    config = getPayuConfig();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "PayU no está configurado correctamente",
      },
      { status: 500 },
    );
  }

  const required = [
    "merchant_id",
    "reference_sale",
    "value",
    "currency",
    "state_pol",
    "sign",
  ];
  const missing = required.filter((key) => !payload[key]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Payload PayU incompleto", missing },
      { status: 400 },
    );
  }

  const calculated = createPayuConfirmationSignature({
    apiKey: config.apiKey,
    merchantId: payload.merchant_id,
    referenceSale: payload.reference_sale,
    value: payload.value,
    currency: payload.currency,
    statePol: payload.state_pol,
  });

  if (!verifySignature(payload.sign, calculated)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  try {
    await updateOrderFromConfirmation(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo procesar la confirmación de PayU",
      },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
