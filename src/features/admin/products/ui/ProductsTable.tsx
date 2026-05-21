"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/app/lib/products";
import { Badge, Button } from "@/src/shared/ui";
import { formatCOP } from "@/app/lib/products";

export interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onArchive?: (product: Product) => void;
  onDuplicate?: (product: Product) => void;
  onBulkUpdate?: (slugs: string[], patch: Partial<Product>) => void;
}

/**
 * Tabla de administración de productos.
 *
 * Soporta selección múltiple por checkbox, bulk actions (publicar /
 * despublicar / archivar / exportar) y acciones por fila (editar, duplicar,
 * archivar).
 */
export function ProductsTable({
  products,
  onEdit,
  onArchive,
  onDuplicate,
  onBulkUpdate,
}: ProductsTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSlugs = useMemo(() => products.map((p) => p.slug), [products]);
  const allSelected =
    products.length > 0 && selected.size === products.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allSlugs));
  }

  function toggleOne(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function runBulk(patch: Partial<Product>) {
    if (!onBulkUpdate || selected.size === 0) return;
    onBulkUpdate(Array.from(selected), patch);
    setSelected(new Set());
  }

  function exportCsv() {
    if (typeof window !== "undefined") {
      window.alert("Exportar CSV: próximamente");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-card-border bg-white px-4 py-3"
        data-testid="bulk-actions-bar"
      >
        <span className="text-[13px] text-ink-muted">
          {selected.size > 0
            ? `${selected.size} seleccionado(s)`
            : "Selecciona productos para acciones masivas"}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={selected.size === 0}
            onClick={() => runBulk({ inStock: true })}
          >
            Publicar
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selected.size === 0}
            onClick={() => runBulk({ inStock: false })}
          >
            Despublicar
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={selected.size === 0}
            onClick={() => runBulk({ inStock: false })}
          >
            Archivar
          </Button>
          <Button size="sm" variant="ghost" onClick={exportCsv}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-card-border bg-white">
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-card-border bg-[#fafbff] text-[12px] uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-3">Imagen</th>
              <th className="px-3 py-3">Nombre</th>
              <th className="px-3 py-3">Slug</th>
              <th className="px-3 py-3">Categoría</th>
              <th className="px-3 py-3">Precio</th>
              <th className="px-3 py-3">Popularity</th>
              <th className="px-3 py-3">Estado</th>
              <th className="px-3 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-ink-muted"
                >
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
            {products.map((p) => {
              const isActive = p.inStock !== false;
              return (
                <tr
                  key={p.slug}
                  className="border-b border-card-border last:border-b-0 hover:bg-[#fafbff]"
                  data-testid={`product-row-${p.slug}`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Seleccionar ${p.title}`}
                      checked={selected.has(p.slug)}
                      onChange={() => toggleOne(p.slug)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div
                      aria-hidden
                      className="h-10 w-10 rounded-lg bg-card-border/40"
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold text-ink">
                    {p.title}
                  </td>
                  <td className="px-3 py-3 font-mono text-[12px] text-ink-muted">
                    {p.slug}
                  </td>
                  <td className="px-3 py-3 capitalize text-ink-muted">
                    {p.category}
                  </td>
                  <td className="px-3 py-3 text-ink">
                    {formatCOP(p.priceValue)}
                  </td>
                  <td className="px-3 py-3 text-ink-muted">{p.popularity}</td>
                  <td className="px-3 py-3">
                    {isActive ? (
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
                        onClick={() => onEdit?.(p)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDuplicate?.(p)}
                      >
                        Duplicar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onArchive?.(p)}
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
    </div>
  );
}
