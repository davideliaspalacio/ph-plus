"use client";

import { useEffect, useState } from "react";
import { Badge, EmptyState, Tabs } from "@/src/shared/ui";
import {
  outboxRepo,
  type EmailMessage,
  type EmailStatus,
} from "@/src/features/notifications";
import { formatDate } from "@/src/shared/lib/format";

type TestResult = {
  pedidoDePrueba?: string;
  avisoInterno?: { a: string[]; enviado: boolean; motivo?: string };
  confirmacionCliente?: { a: string; enviado: boolean; motivo?: string };
  error?: string;
};

/** Manda los dos correos reales con datos de ejemplo, sin pasar por la pasarela. */
function EnviarPrueba() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/probar-correos", { method: "POST" });
      setResult((await res.json()) as TestResult);
    } catch {
      setResult({ error: "No se pudo conectar con el servidor" });
    } finally {
      setLoading(false);
    }
  }

  const line = (
    label: string,
    r: { a: string | string[]; enviado: boolean; motivo?: string } | undefined,
  ) =>
    r && (
      <li>
        <strong>{label}</strong> → {Array.isArray(r.a) ? r.a.join(", ") : r.a}:{" "}
        {r.enviado ? (
          <span className="font-semibold text-green-700">enviado ✓</span>
        ) : (
          <span className="font-semibold text-red-600">no se envió — {r.motivo}</span>
        )}
      </li>
    );

  return (
    <div className="mb-4 rounded-2xl border border-card-border bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-muted">
          Envía los correos de una compra (aviso interno y confirmación al cliente) con datos de
          ejemplo, sin pasar por la pasarela. La confirmación llega a tu correo de sesión.
        </p>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-full bg-brand px-5 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Enviar correos de prueba"}
        </button>
      </div>
      {result && (
        <div className="mt-3 text-[13px]" role="status">
          {result.error ? (
            <p className="font-semibold text-red-600">{result.error}</p>
          ) : (
            <ul className="space-y-1">
              {line("Aviso interno", result.avisoInterno)}
              {line("Confirmación al cliente", result.confirmacionCliente)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

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
      <EnviarPrueba />
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
