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

  useEffect(() => {
    void (async () => {
      const list = await customerAdminRepo.list();
      setCustomers(list);
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
