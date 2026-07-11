"use client";

import { useMemo, useState } from "react";
import { Badge, EmptyState, Input, Select, type BadgeTone } from "@/src/shared/ui";
import { formatCOP, formatDate } from "@/src/shared/lib/format";
import type { Order, OrderStatus } from "@/src/features/orders";
import { ORDER_STATUSES } from "@/src/features/orders";

export interface OrdersTableProps {
  orders: Order[];
  onSelect?: (order: Order) => void;
}

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

const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
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

const PAYMENT_LABEL: Record<string, string> = {
  credit_card: "Tarjeta",
  pse: "PSE",
  nequi: "Nequi",
  cash_on_delivery: "Contra entrega",
  payu: "PayU",
  mock: "Mock",
};

export function statusLabel(status: OrderStatus): string {
  return STATUS_LABEL[status];
}

export function statusTone(status: OrderStatus): BadgeTone {
  return STATUS_TONE[status];
}

export function OrdersTable({ orders, onSelect }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTime = from ? new Date(from).getTime() : null;
    const toTime = to ? new Date(`${to}T23:59:59.999Z`).getTime() : null;

    return orders.filter((o) => {
      if (q) {
        const haystack = `${o.id} ${o.contact.email}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (status && o.status !== status) return false;
      const created = new Date(o.createdAt).getTime();
      if (fromTime !== null && created < fromTime) return false;
      if (toTime !== null && created > toTime) return false;
      return true;
    });
  }, [orders, search, status, from, to]);

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    ...ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Buscar"
          placeholder="Buscar por #pedido o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Estado"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | OrderStatus)}
        />
        <Input
          type="date"
          label="Desde"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Input
          type="date"
          label="Hasta"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin pedidos"
          description="No hay pedidos que coincidan con los filtros."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-card-border bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbff] text-[12px] font-bold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Pago</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => onSelect?.(o)}
                  className="cursor-pointer border-t border-card-border transition hover:bg-brand/5"
                >
                  <td className="px-4 py-3 font-semibold text-brand">{o.id}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{o.contact.name}</div>
                    <div className="text-[12px] text-ink-muted">
                      {o.contact.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">
                    {formatCOP(o.totals.total)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[o.status]}>
                      {STATUS_LABEL[o.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {PAYMENT_LABEL[o.payment.method] ?? o.payment.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
