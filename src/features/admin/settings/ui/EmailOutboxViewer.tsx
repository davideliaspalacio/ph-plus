"use client";

import { useEffect, useState } from "react";
import { Badge, EmptyState, Tabs } from "@/src/shared/ui";
import {
  outboxRepo,
  type EmailMessage,
  type EmailStatus,
} from "@/src/features/notifications";
import { formatDate } from "@/src/shared/lib/format";

export interface EmailOutboxViewerProps {
  /**
   * Lista de emails opcional para tests / SSR. Si no se pasa, el componente
   * la carga desde `outboxRepo.list()` en mount.
   */
  emails?: EmailMessage[];
}

type Filter = "all" | EmailStatus;

const STATUS_TONE: Record<EmailStatus, "warning" | "success" | "danger"> = {
  queued: "warning",
  sent: "success",
  failed: "danger",
};

const STATUS_LABEL: Record<EmailStatus, string> = {
  queued: "En cola",
  sent: "Enviado",
  failed: "Fallido",
};

/**
 * Visor del outbox de emails (FUNCTIONAL-SPEC §25).
 *
 * Lista los emails que la app fue disparando con filtro por status
 * (queued/sent/failed). Recibe `emails` por prop para tests; si no se pasa,
 * carga vía `outboxRepo.list()` en mount.
 */
export function EmailOutboxViewer({ emails }: EmailOutboxViewerProps) {
  const [loaded, setLoaded] = useState<EmailMessage[] | null>(
    emails ?? null,
  );
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    if (emails) {
      setLoaded(emails);
      return;
    }
    let cancelled = false;
    void outboxRepo.list().then((list) => {
      if (!cancelled) setLoaded(list);
    });
    return () => {
      cancelled = true;
    };
  }, [emails]);

  const all = loaded ?? [];
  const filtered =
    filter === "all" ? all : all.filter((m) => m.status === filter);

  const renderList = (items: EmailMessage[]) => {
    if (items.length === 0) {
      return (
        <EmptyState
          title="No hay emails"
          description="Cuando la app dispare emails, aparecerán acá."
        />
      );
    }
    return (
      <ul className="flex flex-col divide-y divide-card-border rounded-2xl border border-card-border bg-white">
        {items.map((m) => (
          <li
            key={m.id}
            className="flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:justify-between"
            data-testid="outbox-row"
          >
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-ink">
                {m.subject}
              </span>
              <span className="text-[12px] text-ink-muted">{m.to}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-ink-muted">
                {formatDate(m.createdAt)}
              </span>
              <Badge tone={STATUS_TONE[m.status]}>
                {STATUS_LABEL[m.status]}
              </Badge>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        defaultActiveId="all"
        onChange={(id) => setFilter(id as Filter)}
        items={[
          {
            id: "all",
            label: `Todos (${all.length})`,
            content: renderList(all),
          },
          {
            id: "queued",
            label: `En cola (${all.filter((m) => m.status === "queued").length})`,
            content: renderList(
              all.filter((m) => m.status === "queued"),
            ),
          },
          {
            id: "sent",
            label: `Enviados (${all.filter((m) => m.status === "sent").length})`,
            content: renderList(all.filter((m) => m.status === "sent")),
          },
          {
            id: "failed",
            label: `Fallidos (${all.filter((m) => m.status === "failed").length})`,
            content: renderList(
              all.filter((m) => m.status === "failed"),
            ),
          },
        ]}
      />
      {/* Mantengo `filtered` referenciado para futuros usos sin recalcular. */}
      <span className="sr-only" data-testid="outbox-current-count">
        {filtered.length}
      </span>
    </div>
  );
}
