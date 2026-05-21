"use client";

import type { Coupon } from "@/src/features/coupons";
import { Badge, Button } from "@/src/shared/ui";

export interface CouponsTableProps {
  coupons: Coupon[];
  onEdit?: (coupon: Coupon) => void;
  onArchive?: (coupon: Coupon) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatValue(coupon: Coupon): string {
  if (coupon.type === "percent") return `${coupon.value}%`;
  if (coupon.type === "fixed") return `$${coupon.value.toLocaleString("es-CO")}`;
  return "—";
}

function typeLabel(type: Coupon["type"]): string {
  if (type === "percent") return "Porcentaje";
  if (type === "fixed") return "Monto fijo";
  return "Envío gratis";
}

/**
 * Tabla de administración de cupones.
 *
 * Muestra código, tipo, valor, usos (used/max), vigencia y estado.
 * Acciones por fila: editar, archivar.
 */
export function CouponsTable({
  coupons,
  onEdit,
  onArchive,
}: CouponsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-card-border bg-white">
      <table className="w-full text-left text-[13px]">
        <thead className="border-b border-card-border bg-[#fafbff] text-[12px] uppercase tracking-wide text-ink-muted">
          <tr>
            <th className="px-3 py-3">Código</th>
            <th className="px-3 py-3">Tipo</th>
            <th className="px-3 py-3">Valor</th>
            <th className="px-3 py-3">Usos</th>
            <th className="px-3 py-3">Vigencia</th>
            <th className="px-3 py-3">Estado</th>
            <th className="px-3 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-3 py-8 text-center text-ink-muted"
              >
                No hay cupones para mostrar.
              </td>
            </tr>
          )}
          {coupons.map((c) => (
            <tr
              key={c.id}
              className="border-b border-card-border last:border-b-0 hover:bg-[#fafbff]"
              data-testid={`coupon-row-${c.id}`}
            >
              <td className="px-3 py-3 font-mono font-semibold text-ink">
                {c.code}
              </td>
              <td className="px-3 py-3 text-ink-muted">{typeLabel(c.type)}</td>
              <td className="px-3 py-3 text-ink">{formatValue(c)}</td>
              <td className="px-3 py-3 text-ink-muted">
                {c.usedCount}/{c.maxUses}
              </td>
              <td className="px-3 py-3 text-ink-muted">
                {formatDate(c.startsAt)} → {formatDate(c.endsAt)}
              </td>
              <td className="px-3 py-3">
                {c.isActive ? (
                  <Badge tone="success">Activo</Badge>
                ) : (
                  <Badge tone="danger">Inactivo</Badge>
                )}
              </td>
              <td className="px-3 py-3 text-right">
                <div className="inline-flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit?.(c)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onArchive?.(c)}
                  >
                    Archivar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
