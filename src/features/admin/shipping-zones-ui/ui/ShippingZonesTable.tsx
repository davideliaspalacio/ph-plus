"use client";

import type { ShippingZone } from "@/src/features/shipping";
import { Badge, Button } from "@/src/shared/ui";
import { formatCOP } from "@/app/lib/products";

export interface ShippingZonesTableProps {
  zones: ShippingZone[];
  onEdit?: (zone: ShippingZone) => void;
  onArchive?: (zone: ShippingZone) => void;
}

const MAX_REGION_CHIPS = 3;

/**
 * Tabla de administración de zonas de envío.
 *
 * Muestra para cada zona: nombre, regiones (chips, primeros 3 + "+N"),
 * costo, lead time min-max, umbral de envío gratis y estado activo /
 * inactivo. Expone callbacks `onEdit` y `onArchive` por fila.
 */
export function ShippingZonesTable({
  zones,
  onEdit,
  onArchive,
}: ShippingZonesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-card-border bg-white">
      <table className="w-full text-left text-[13px]">
        <thead className="border-b border-card-border bg-[#fafbff] text-[12px] uppercase tracking-wide text-ink-muted">
          <tr>
            <th className="px-3 py-3">Nombre</th>
            <th className="px-3 py-3">Regiones</th>
            <th className="px-3 py-3">Costo</th>
            <th className="px-3 py-3">Lead time (días)</th>
            <th className="px-3 py-3">Free shipping</th>
            <th className="px-3 py-3">Estado</th>
            <th className="px-3 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zones.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-3 py-8 text-center text-ink-muted"
              >
                No hay zonas para mostrar.
              </td>
            </tr>
          )}
          {zones.map((z) => {
            const visibleRegions = z.regions.slice(0, MAX_REGION_CHIPS);
            const extra = z.regions.length - visibleRegions.length;
            return (
              <tr
                key={z.id}
                className="border-b border-card-border last:border-b-0 hover:bg-[#fafbff]"
                data-testid={`zone-row-${z.id}`}
              >
                <td className="px-3 py-3 font-semibold text-ink">{z.name}</td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {visibleRegions.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-full bg-card-border/40 px-2 py-0.5 text-[11px] text-ink"
                      >
                        {r}
                      </span>
                    ))}
                    {extra > 0 && (
                      <span className="inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                        +{extra}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-ink">{formatCOP(z.cost)}</td>
                <td className="px-3 py-3 text-ink-muted">
                  {z.leadTimeDaysMin} - {z.leadTimeDaysMax}
                </td>
                <td className="px-3 py-3 text-ink-muted">
                  {z.freeShippingThreshold != null
                    ? formatCOP(z.freeShippingThreshold)
                    : "—"}
                </td>
                <td className="px-3 py-3">
                  {z.isActive ? (
                    <Badge tone="success">Activa</Badge>
                  ) : (
                    <Badge tone="danger">Inactiva</Badge>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit?.(z)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onArchive?.(z)}
                    >
                      Archivar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
