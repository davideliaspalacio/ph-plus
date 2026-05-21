"use client";

import { Badge } from "@/src/shared/ui";
import { formatCOP, formatDate } from "@/src/shared/lib/format";
import type { Order, OrderStatus } from "@/src/features/orders";
import { statusLabel, statusTone } from "./OrdersTable";
import { OrderTimeline, type OrderTimelineExtra } from "./OrderTimeline";
import { OrderNotes } from "./OrderNotes";

export interface OrderDetailProps {
  order: Order;
  onUpdateStatus?: (next: OrderStatus, extra?: OrderTimelineExtra) => void;
  onAddNote?: (text: string) => void;
}

function buildWhatsappHref(order: Order): string {
  const phone = order.contact.phone.replace(/[^0-9]/g, "");
  const message =
    `Hola ${order.contact.name}, te contactamos por tu pedido ` +
    `${order.id} en PH Plus.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function OrderDetail({
  order,
  onUpdateStatus,
  onAddNote,
}: OrderDetailProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-card-border bg-white px-5 py-4">
        <div>
          <h2 className="text-[20px] font-extrabold text-brand">
            Pedido {order.id}
          </h2>
          <p className="text-[12px] text-ink-muted">
            Creado el {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={statusTone(order.status)}>
            {statusLabel(order.status)}
          </Badge>
          <a
            href={buildWhatsappHref(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full bg-whatsapp px-4 text-[13px] font-semibold text-white shadow hover:bg-whatsapp-dark"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </header>

      <section className="rounded-3xl border border-card-border bg-white p-5">
        <h3 className="mb-3 text-[14px] font-bold text-brand">Estado</h3>
        <OrderTimeline
          currentStatus={order.status}
          onTransition={onUpdateStatus}
        />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-card-border bg-white p-5">
          <h3 className="mb-3 text-[14px] font-bold text-brand">Items</h3>
          <ul className="space-y-2">
            {order.lines.map((l) => (
              <li
                key={l.slug}
                className="flex justify-between text-[14px] text-ink"
              >
                <span>
                  {l.title}{" "}
                  <span className="text-ink-muted">× {l.quantity}</span>
                </span>
                <span className="font-semibold">{formatCOP(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-card-border pt-3 text-[14px]">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal</span>
              <span>{formatCOP(order.totals.subtotal)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div className="flex justify-between text-ink-muted">
                <span>Descuento</span>
                <span>-{formatCOP(order.totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-muted">
              <span>Envío</span>
              <span>{formatCOP(order.totals.shipping)}</span>
            </div>
            <div className="flex justify-between pt-1 text-[16px] font-extrabold text-brand">
              <span>Total</span>
              <span>{formatCOP(order.totals.total)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-card-border bg-white p-5">
          <h3 className="mb-3 text-[14px] font-bold text-brand">Contacto</h3>
          <p className="text-[14px] text-ink">{order.contact.name}</p>
          <p className="text-[13px] text-ink-muted">{order.contact.email}</p>
          <p className="text-[13px] text-ink-muted">{order.contact.phone}</p>

          <h3 className="mt-5 mb-3 text-[14px] font-bold text-brand">Envío</h3>
          <p className="text-[13px] text-ink">{order.shipping.address}</p>
          <p className="text-[13px] text-ink-muted">
            {order.shipping.city}, {order.shipping.department}
          </p>
          {order.shipping.postalCode && (
            <p className="text-[13px] text-ink-muted">
              CP {order.shipping.postalCode}
            </p>
          )}
          {order.trackingNumber && (
            <p className="mt-2 text-[13px]">
              <span className="font-semibold text-ink">Guía:</span>{" "}
              <span className="text-ink-muted">{order.trackingNumber}</span>
            </p>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-card-border bg-white p-5">
        <h3 className="mb-3 text-[14px] font-bold text-brand">
          Notas internas
        </h3>
        <OrderNotes notes={order.notes} onAddNote={onAddNote} />
      </section>
    </div>
  );
}
