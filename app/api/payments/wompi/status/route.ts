import { after, NextResponse } from "next/server";

import { notificarPedidoPagado } from "@/app/lib/correos/pedido-pagado";
import { applyWompiTransaction, isOrderPersistenceEnabled } from "@/app/lib/wompi-orders";
import { createSupabaseServiceClient } from "@/src/shared/supabase/server";

export const runtime = "nodejs";

/**
 * Consulta liviana para la pantalla de retorno mientras espera la confirmación
 * (PSE puede tardar minutos). Si llega `id` (la transacción que Wompi agrega al
 * volver), primero se re-verifica contra Wompi y se aplica a la orden —así no
 * dependemos de que el webhook ya haya llegado—. Devuelve SOLO el status de la
 * orden: ningún dato de contacto, envío ni monto.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const orderId = params.get("orderId");
  const transactionId = params.get("id");
  if (!orderId) {
    return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
  }
  if (!isOrderPersistenceEnabled()) {
    return NextResponse.json({ status: null });
  }

  try {
    if (transactionId) {
      const result = await applyWompiTransaction(transactionId).catch((error) => {
        console.error("[wompi-status]", error);
        return null;
      });
      if (result?.matched && result.becamePaid) {
        after(() => notificarPedidoPagado(result.orderId));
      }
    }

    const supabase = await createSupabaseServiceClient();
    const { data } = await supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .maybeSingle();
    return NextResponse.json({
      status: (data as { status?: string } | null)?.status ?? null,
    });
  } catch {
    return NextResponse.json({ status: null });
  }
}
