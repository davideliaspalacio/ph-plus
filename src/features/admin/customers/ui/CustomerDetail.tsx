"use client";

import { Badge, Tabs, type TabItem } from "@/src/shared/ui";
import { formatCOP, formatDate } from "@/src/shared/lib/format";
import type { Order } from "@/src/features/orders";
import type { CustomerView } from "../domain/customer-view";

export interface CustomerDetailProps {
  customer: CustomerView;
  orders: Order[];
  onSelectOrder?: (order: Order) => void;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-card-border bg-white px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </div>
      <div className="mt-1 text-[18px] font-extrabold text-brand">{value}</div>
    </div>
  );
}

function OrdersList({
  orders,
  onSelectOrder,
}: {
  orders: Order[];
  onSelectOrder?: (o: Order) => void;
}) {
  if (orders.length === 0) {
    return (
      <p className="text-[14px] text-ink-muted">
        Este cliente todavía no tiene pedidos.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-card-border rounded-2xl border border-card-border bg-white">
      {orders.map((o) => (
        <li
          key={o.id}
          onClick={() => onSelectOrder?.(o)}
          className="flex cursor-pointer items-center justify-between px-4 py-3 transition hover:bg-brand/5"
        >
          <div>
            <div className="font-semibold text-brand">{o.id}</div>
            <div className="text-[12px] text-ink-muted">
              {formatDate(o.createdAt)} · {o.status}
            </div>
          </div>
          <div className="font-bold text-ink">{formatCOP(o.totals.total)}</div>
        </li>
      ))}
    </ul>
  );
}

export function CustomerDetail({
  customer,
  orders,
  onSelectOrder,
}: CustomerDetailProps) {
  const items: TabItem[] = [
    {
      id: "orders",
      label: "Pedidos",
      content: <OrdersList orders={orders} onSelectOrder={onSelectOrder} />,
    },
    {
      id: "notes",
      label: "Notas internas",
      content: (
        <p className="text-[14px] text-ink-muted">
          Próximamente: notas internas sobre el cliente.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-card-border bg-white px-5 py-4">
        <div>
          <h2 className="text-[20px] font-extrabold text-brand">
            {customer.name}
          </h2>
          <p className="text-[13px] text-ink-muted">{customer.email}</p>
          <p className="text-[12px] text-ink-muted">
            Alta: {formatDate(customer.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{customer.role}</Badge>
          {customer.isVip && <Badge tone="warning">VIP</Badge>}
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="# Pedidos" value={customer.ordersCount} />
        <Stat label="Total gastado" value={formatCOP(customer.totalSpent)} />
        <Stat label="LTV" value={formatCOP(customer.lifetimeValue)} />
        <Stat
          label="Último pedido"
          value={
            customer.lastOrderAt ? formatDate(customer.lastOrderAt) : "—"
          }
        />
      </section>

      <section className="rounded-3xl border border-card-border bg-white p-5">
        <Tabs items={items} />
      </section>
    </div>
  );
}
