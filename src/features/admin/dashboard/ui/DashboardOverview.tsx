"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { orderRepo, type Order, type OrderStatus } from "@/src/features/orders";
import { Badge, EmptyState } from "@/src/shared/ui";
import { formatCOP, formatDate } from "@/src/shared/lib/format";
import { computeKpis } from "../domain/kpis";
import { KpiCard } from "./KpiCard";

export interface DashboardOverviewProps {
  /**
   * Si se pasa, se usa para los KPIs y se omite el fetch al `orderRepo`.
   * Pensado para tests / Storybook. En la página real (`/admin`) se omite y
   * el componente lee `orderRepo.list()` al montarse.
   */
  orders?: Order[];
}

const STATUS_TONE: Record<
  OrderStatus,
  "neutral" | "brand" | "success" | "warning" | "danger" | "info"
> = {
  draft: "neutral",
  pending_payment: "warning",
  paid: "info",
  preparing: "brand",
  shipped: "brand",
  delivered: "success",
  closed: "success",
  cancelled: "danger",
  refunded: "danger",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  draft: "Borrador",
  pending_payment: "Pago pendiente",
  paid: "Pagado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  closed: "Cerrado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const PENDING_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "preparing",
];

export function DashboardOverview({ orders: ordersProp }: DashboardOverviewProps) {
  const [orders, setOrders] = useState<Order[] | null>(
    ordersProp ?? null,
  );

  useEffect(() => {
    if (ordersProp) {
      setOrders(ordersProp);
      return;
    }
    let cancelled = false;
    orderRepo
      .list()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ordersProp]);

  if (orders === null) {
    return (
      <div className="grid place-items-center py-20 text-ink-muted">
        Cargando…
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="Aún no hay pedidos"
        description="Cuando entren pedidos al storefront, vas a verlos acá con KPIs y top productos."
      />
    );
  }

  const kpis = computeKpis(orders);
  const pending = PENDING_STATUSES.reduce(
    (sum, s) => sum + kpis.ordersByStatus[s],
    0,
  );

  const latest = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  const topProducts = kpis.topProducts.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          tone="brand"
          label="Ventas totales"
          value={formatCOP(kpis.totalSales)}
          hint={`${kpis.totalOrders} pedidos`}
        />
        <KpiCard
          tone="whatsapp"
          label="Pedidos totales"
          value={kpis.totalOrders}
          hint="Histórico"
        />
        <KpiCard
          tone="brand"
          label="Ticket promedio"
          value={formatCOP(kpis.avgTicket)}
        />
        <KpiCard
          tone="whatsapp"
          label="Pedidos pendientes"
          value={pending}
          hint="Pago / preparando / enviado"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Últimos pedidos */}
        <section className="rounded-2xl border border-card-border bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[16px] font-extrabold text-brand">
              Últimos pedidos
            </h2>
            <Link
              href="/admin/pedidos"
              className="text-[13px] font-semibold text-brand hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead className="text-[12px] uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="py-2 pr-4">Pedido</th>
                  <th className="py-2 pr-4">Cliente</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-card-border/60"
                  >
                    <td className="py-2 pr-4 font-mono text-[13px]">
                      {o.id}
                    </td>
                    <td className="py-2 pr-4">{o.contact.name}</td>
                    <td className="py-2 pr-4 text-ink-muted">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge tone={STATUS_TONE[o.status]}>
                        {STATUS_LABEL[o.status]}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 text-right font-semibold">
                      {formatCOP(o.totals.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Top productos */}
        <section className="rounded-2xl border border-card-border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[16px] font-extrabold text-brand">
            Top productos
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-[13px] text-ink-muted">Sin datos todavía.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {topProducts.map((p, idx) => (
                <li
                  key={p.slug}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2 text-[14px]">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand/10 text-[11px] font-bold text-brand">
                      {idx + 1}
                    </span>
                    <span className="font-medium">{p.title}</span>
                  </span>
                  <Badge tone="success">{p.count} ud</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
