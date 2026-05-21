"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Button, EmptyState } from "@/src/shared/ui";
import { useSession } from "@/src/features/auth";
import { orderRepo, type Order } from "@/src/features/orders";
import { formatCOP, formatDate } from "@/src/shared/lib/format";

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  pending_payment: "Pendiente de pago",
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  closed: "Cerrado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_TONE: Record<string, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  draft: "neutral",
  pending_payment: "warning",
  paid: "info",
  preparing: "info",
  shipped: "brand",
  delivered: "success",
  closed: "neutral",
  cancelled: "danger",
  refunded: "danger",
};

export function OrdersList() {
  const session = useSession((s) => s.session);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.userId) {
        setOrders([]);
        return;
      }
      const list = await orderRepo.byUser(session.userId);
      if (!cancelled) setOrders(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.userId]);

  if (orders == null) {
    return <p className="text-[14px] text-ink-muted">Cargando pedidos…</p>;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Aún no tenés pedidos"
        description="Cuando hagas tu primera compra aparecerá acá."
        action={
          <Link href="/productos">
            <Button>Empezar a comprar</Button>
          </Link>
        }
      />
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li
          key={o.id}
          className="rounded-3xl border border-card-border bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12px] text-ink-muted">Pedido</p>
              <h4 className="text-[16px] font-extrabold text-brand">{o.id}</h4>
              <p className="text-[12px] text-ink-muted">
                {formatDate(o.createdAt)}
              </p>
            </div>
            <Badge tone={STATUS_TONE[o.status] ?? "neutral"}>
              {STATUS_LABELS[o.status] ?? o.status}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <p className="text-[13px] text-ink-muted">
              {o.lines.length} producto{o.lines.length === 1 ? "" : "s"}
            </p>
            <p className="text-[18px] font-extrabold text-brand">
              {formatCOP(o.totals.total)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
