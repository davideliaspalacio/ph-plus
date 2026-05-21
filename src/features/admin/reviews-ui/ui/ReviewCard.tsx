"use client";

import { useState } from "react";
import { Badge, Button, Modal, type BadgeTone } from "@/src/shared/ui";
import { formatDate } from "@/src/shared/lib/format";
import type { Review, ReviewStatus } from "@/src/features/reviews";

export interface ReviewCardProps {
  review: Review;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onRespond?: (id: string, text: string) => void;
}

const STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
};

const STATUS_TONE: Record<ReviewStatus, BadgeTone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div aria-label={`Rating ${rating} de 5`} className="text-amber-500">
      {"★".repeat(rating)}
      <span className="text-card-border">{"★".repeat(5 - rating)}</span>
    </div>
  );
}

export function ReviewCard({
  review,
  onApprove,
  onReject,
  onRespond,
}: ReviewCardProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [respondOpen, setRespondOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [response, setResponse] = useState("");

  const isPending = review.status === "pending";

  const confirmReject = () => {
    const trimmed = reason.trim();
    if (!trimmed) return;
    onReject?.(review.id, trimmed);
    setReason("");
    setRejectOpen(false);
  };

  const sendResponse = () => {
    const trimmed = response.trim();
    if (!trimmed) return;
    onRespond?.(review.id, trimmed);
    setResponse("");
    setRespondOpen(false);
  };

  return (
    <article className="space-y-3 rounded-3xl border border-card-border bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[12px] text-ink-muted">
            <span className="font-semibold text-brand">
              {review.productSlug}
            </span>
            <span>·</span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-ink">
              {review.authorName}
            </span>
            <Stars rating={review.rating} />
          </div>
        </div>
        <Badge tone={STATUS_TONE[review.status]}>
          {STATUS_LABEL[review.status]}
        </Badge>
      </header>

      <div>
        <h4 className="text-[15px] font-extrabold text-ink">{review.title}</h4>
        <p className="mt-1 text-[14px] text-ink-muted">{review.text}</p>
      </div>

      {review.rejectionReason && (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-[12px] text-red-700">
          <strong>Motivo de rechazo:</strong> {review.rejectionReason}
        </p>
      )}

      {review.adminResponse && (
        <p className="rounded-2xl bg-brand/5 px-3 py-2 text-[12px] text-brand">
          <strong>Respuesta:</strong> {review.adminResponse}
        </p>
      )}

      <footer className="flex flex-wrap gap-2 pt-1">
        {isPending && (
          <>
            <Button
              size="sm"
              onClick={() => onApprove?.(review.id)}
            >
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => setRejectOpen(true)}
            >
              Rechazar
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setRespondOpen(true)}
        >
          Responder
        </Button>
      </footer>

      <Modal
        isOpen={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Rechazar review"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRejectOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" size="sm" onClick={confirmReject}>
              Confirmar
            </Button>
          </>
        }
      >
        <label className="mb-2 block text-[13px] font-semibold text-ink">
          Motivo del rechazo
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo del rechazo..."
          rows={4}
          className="w-full rounded-2xl border border-card-border bg-white px-3 py-2 text-[14px] text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </Modal>

      <Modal
        isOpen={respondOpen}
        onClose={() => setRespondOpen(false)}
        title="Responder review"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRespondOpen(false)}
            >
              Cancelar
            </Button>
            <Button size="sm" onClick={sendResponse}>
              Enviar
            </Button>
          </>
        }
      >
        <label className="mb-2 block text-[13px] font-semibold text-ink">
          Respuesta pública
        </label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Escribir respuesta..."
          rows={4}
          className="w-full rounded-2xl border border-card-border bg-white px-3 py-2 text-[14px] text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </Modal>
    </article>
  );
}
