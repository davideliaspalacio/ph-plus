"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/src/shared/ui";
import type { OrderStatus } from "@/src/features/orders";
import { isValidTransition } from "@/src/features/orders";
import { statusLabel } from "./OrdersTable";

export type OrderTimelineExtra = {
  trackingNumber?: string;
  refundReason?: string;
};

export interface OrderTimelineProps {
  currentStatus: OrderStatus;
  onTransition?: (next: OrderStatus, extra?: OrderTimelineExtra) => void;
}

// Pasos del happy-path, en orden visual.
const HAPPY_PATH: OrderStatus[] = [
  "draft",
  "pending_payment",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "closed",
];

type StepState = "done" | "current" | "pending";

function stepState(step: OrderStatus, current: OrderStatus): StepState {
  if (step === current) return "current";
  const currentIdx = HAPPY_PATH.indexOf(current);
  const stepIdx = HAPPY_PATH.indexOf(step);
  if (currentIdx === -1) return "pending";
  if (stepIdx === -1) return "pending";
  return stepIdx < currentIdx ? "done" : "pending";
}

const ACTION_LABEL: Record<OrderStatus, string> = {
  draft: "Marcar como borrador",
  pending_payment: "Marcar como pago pendiente",
  paid: "Marcar como pagado",
  preparing: "Marcar como preparando",
  shipped: "Marcar como enviado",
  delivered: "Marcar como entregado",
  closed: "Marcar como cerrado",
  cancelled: "Cancelar",
  refunded: "Reembolsar",
};

export function OrderTimeline({
  currentStatus,
  onTransition,
}: OrderTimelineProps) {
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  const canTransition = (to: OrderStatus) =>
    isValidTransition(currentStatus, to);

  const handleClick = (next: OrderStatus) => {
    if (next === "shipped") {
      setTrackingNumber("");
      setTrackingModalOpen(true);
      return;
    }
    if (next === "refunded") {
      setRefundReason("");
      setRefundModalOpen(true);
      return;
    }
    onTransition?.(next, undefined);
  };

  // Acciones: happy-path siguiente + cancelar + reembolsar.
  const happyNext = HAPPY_PATH.filter((s) => canTransition(s));
  const terminalActions: OrderStatus[] = (["cancelled", "refunded"] as const).filter(
    (s) => canTransition(s),
  );

  return (
    <div className="space-y-5">
      <ol className="flex flex-wrap items-center gap-2">
        {HAPPY_PATH.map((step, i) => {
          const s = stepState(step, currentStatus);
          const isLast = i === HAPPY_PATH.length - 1;
          return (
            <li
              key={step}
              className="flex items-center gap-2"
              data-testid={`timeline-step-${step}`}
              data-state={s}
            >
              <span
                aria-hidden
                className={
                  s === "done"
                    ? "grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-[12px]"
                    : s === "current"
                      ? "grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-[12px] ring-4 ring-brand/20"
                      : "grid h-7 w-7 place-items-center rounded-full border-2 border-card-border bg-white text-[12px] text-ink-muted"
                }
              >
                {s === "done" || s === "current" ? "✓" : ""}
              </span>
              <span
                className={
                  s === "pending"
                    ? "text-[12px] font-semibold text-ink-muted"
                    : "text-[12px] font-semibold text-brand"
                }
              >
                {statusLabel(step)}
              </span>
              {!isLast && (
                <span aria-hidden className="h-px w-6 bg-card-border" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-2">
        {happyNext.map((s) => (
          <Button
            key={s}
            size="sm"
            variant="primary"
            onClick={() => handleClick(s)}
          >
            {ACTION_LABEL[s]}
          </Button>
        ))}
        {terminalActions.includes("cancelled") && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleClick("cancelled")}
          >
            {ACTION_LABEL.cancelled}
          </Button>
        )}
        {terminalActions.includes("refunded") && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleClick("refunded")}
          >
            {ACTION_LABEL.refunded}
          </Button>
        )}
      </div>

      <Modal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        title="Marcar como enviado"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setTrackingModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={trackingNumber.trim().length === 0}
              onClick={() => {
                onTransition?.("shipped", {
                  trackingNumber: trackingNumber.trim(),
                });
                setTrackingModalOpen(false);
              }}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <Input
          label="Número de guía (tracking)"
          placeholder="Ej: ABC123"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </Modal>

      <Modal
        isOpen={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="Reembolsar pedido"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRefundModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onTransition?.("refunded", {
                  refundReason: refundReason.trim() || undefined,
                });
                setRefundModalOpen(false);
              }}
            >
              Confirmar
            </Button>
          </>
        }
      >
        <Input
          label="Motivo del reembolso"
          placeholder="Opcional"
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}
