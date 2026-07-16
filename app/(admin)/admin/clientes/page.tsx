"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/shared/ui";
import {
  CustomersTable,
  CustomerDetail,
  customerAdminRepo,
  type CustomerView,
} from "@/src/features/admin/customers";
import { orderRepo, type Order } from "@/src/features/orders";

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<CustomerView[] | null>(null);
  const [selected, setSelected] = useState<CustomerView | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Igual que en pedidos: sin catch, un fallo dejaba "Cargando clientes…" fijo.
  useEffect(() => {
    void (async () => {
      try {
        const list = await customerAdminRepo.list();
        setCustomers(list);
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "No se pudieron cargar los clientes.",
        );
        setCustomers([]);
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!selected) {
        setOrders([]);
        return;
      }
      const list = await orderRepo.byUser(selected.id);
      if (!cancelled) setOrders(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  if (customers == null) {
    return <p className="text-[14px] text-ink-muted">Cargando clientes…</p>;
  }

  if (loadError) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
        {loadError}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[24px] font-extrabold text-brand">Clientes</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          {customers.length} cliente{customers.length === 1 ? "" : "s"} registrado
          {customers.length === 1 ? "" : "s"}.
        </p>
      </header>

      {selected ? (
        <>
          <Button variant="ghost" onClick={() => setSelected(null)}>
            ← Volver al listado
          </Button>
          <CustomerDetail customer={selected} orders={orders} />
        </>
      ) : (
        <CustomersTable customers={customers} onSelect={setSelected} />
      )}
    </div>
  );
}
