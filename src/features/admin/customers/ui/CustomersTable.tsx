"use client";

import { useMemo, useState } from "react";
import { Badge, EmptyState, Input } from "@/src/shared/ui";
import { formatCOP, formatDate } from "@/src/shared/lib/format";
import type { CustomerView } from "../domain/customer-view";

export interface CustomersTableProps {
  customers: CustomerView[];
  onSelect?: (customer: CustomerView) => void;
}

export function CustomersTable({ customers, onSelect }: CustomersTableProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => {
      const haystack = `${c.name} ${c.email}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [customers, search]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:max-w-md">
        <Input
          label="Buscar"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Sin clientes"
          description="No hay clientes que coincidan con la búsqueda."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-card-border bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbff] text-[12px] font-bold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3"># Pedidos</th>
                <th className="px-4 py-3">Gastado</th>
                <th className="px-4 py-3">Último pedido</th>
                <th className="px-4 py-3">VIP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onSelect?.(c)}
                  className="cursor-pointer border-t border-card-border transition hover:bg-brand/5"
                >
                  <td className="px-4 py-3 font-semibold text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{c.email}</td>
                  <td className="px-4 py-3 text-ink">{c.ordersCount}</td>
                  <td className="px-4 py-3 font-bold text-ink">
                    {formatCOP(c.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {c.isVip ? <Badge tone="warning">VIP</Badge> : null}
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
