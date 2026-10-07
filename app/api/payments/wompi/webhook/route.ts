import { after, NextResponse } from "next/server";

import { notificarPedidoPagado } from "@/app/lib/correos/pedido-pagado";
import { applyWompiTransaction } from "@/app/lib/wompi-orders";
import {
  getWompiConfig,
  verifyEventChecksum,
  type WompiEvent,
} from "@/app/lib/wompi-server";

export const runtime = "nodejs";

/**
 * Webhook de Wompi (evento `transaction.updated`).
 *
 * Doble defensa: (1) si hay WOMPI_EVENTS_SECRET se valida el checksum del
 * evento, y (2) pase lo que pase NO se usa el estado que trae el body — sólo el
 * id de la transacción, que se vuelve a consultar a Wompi en
 * `applyWompiTransaction`. Un body falsificado a lo sumo hace una consulta de
 * más; no puede marcar nada como pagado.
 *
 * Wompi reintenta si no recibe 2xx, por eso los casos "no hay nada que hacer"
 * (evento de otro tipo, orden desconocida) responden 200.
 */
export async function POST(request: Request) {
  let config;
  try {
    config = getWompiConfig();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Wompi no está configurado correctamente",
      },
      { status: 500 },
    );
  }

  const event = (await request.json().catch(() => null)) as WompiEvent | null;
  if (!event) {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  if (config.eventsSecret && !verifyEventChecksum(event, config.eventsSecret)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  if (event.event !== "transaction.updated") {
    return NextResponse.json({ received: true, ignored: event.event ?? "N/A" });
  }

  const transactionId = event.data?.transaction?.id;
  if (!transactionId) {
    return NextResponse.json({ received: true, matched: false });
  }

  let result;
  try {
    result = await applyWompiTransaction(transactionId);
  } catch (error) {
    // 500 => Wompi reintenta (fallo transitorio de red/DB).
    console.error("[wompi-webhook]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error aplicando la transacción" },
      { status: 500 },
    );
  }

  if (!result.matched) {
    return NextResponse.json({ received: true, matched: false, reason: result.reason });
  }

  // Aviso por correo de pedido pagado. Va en `after` para no demorar la
  // respuesta; la transición a `paid` ocurre una sola vez por orden, así que el
  // correo tampoco se duplica con reintentos.
  if (result.becamePaid) {
    after(() => notificarPedidoPagado(result.orderId));
  }

  return NextResponse.json({ received: true, matched: true, applied: result.applied });
}
