"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * El webhook de Rapyd puede tardar unos segundos en llegar después de que el
 * comprador vuelve a esta página. Mientras la orden siga "pending_payment"
 * (o "draft"), hacemos polling liviano a /api/payments/rapyd/status y, apenas
 * cambia, refrescamos la página (router.refresh() vuelve a correr el
 * Server Component con el estado ya actualizado) — así el comprador ve
 * "Pago confirmado" solo sin tener que recargar a mano.
 *
 * Se corta a los 2 minutos (40 intentos x 3s) para no pegarle al endpoint
 * para siempre si alguien deja la pestaña abierta.
 */
const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 40;

export function PendingPaymentWatcher({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [timedOut, setTimedOut] = useState(false);
  const attempts = useRef(0);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      attempts.current += 1;
      if (attempts.current > MAX_ATTEMPTS) {
        setTimedOut(true);
        return;
      }

      try {
        const res = await fetch(
          `/api/payments/rapyd/status?orderId=${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as { status?: string | null };
        if (!cancelled && data.status && data.status !== initialStatus) {
          router.refresh();
          return; // el refresh trae un initialStatus nuevo vía props; no seguimos desde acá
        }
      } catch {
        // red inestable: seguimos intentando en el próximo tick
      }

      if (!cancelled) {
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    const t = setTimeout(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [orderId, initialStatus, router]);

  if (!timedOut) return null;

  return (
    <p className="mx-auto mt-4 max-w-xl text-[12px] text-ink-muted">
      Está tardando más de lo normal. Guarda el número de tu pedido y
      escríbenos si no ves la confirmación en unos minutos.
    </p>
  );
}
