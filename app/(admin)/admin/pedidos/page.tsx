"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/shared/ui";
import {
  OrdersTable,
  OrderDetail,
} from "@/src/features/admin/orders-ui";
import { orderRepo, type Order, type OrderStatus } from "@/src/features/orders";

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);

  const reload = async () => {
    const list = await orderRepo.list();
    setOrders(list);
  };

  useEffect(() => {
    void reload();
  }, []);

  if (orders == null) {
    return <p className="text-[14px] text-ink-muted">Cargando pedidos…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[24px] font-extrabold text-brand">Pedidos</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          {orders.length} pedido{orders.length === 1 ? "" : "s"} en el sistema.
        </p>
      </header>

      {selected ? (
        <>
          <Button variant="ghost" onClick={() => setSelected(null)}>
            ← Volver a la lista
          </Button>
          <OrderDetail
            order={selected}
            onUpdateStatus={async (next, extra) => {
              const updated = await orderRepo.updateStatus(selected.id, next as OrderStatus);
              if (extra?.trackingNumber) {
                await orderRepo.update(selected.id, {
                  trackingNumber: extra.trackingNumber,
                });
              }
              setSelected(updated);
              await reload();
            }}
            onAddNote={async (text) => {
              await orderRepo.addNote(selected.id, {
                author: "Admin",
                text,
              });
              const refreshed = await orderRepo.byId(selected.id);
              if (refreshed) setSelected(refreshed);
            }}
          />
        </>
      ) : (
        <OrdersTable orders={orders} onSelect={setSelected} />
      )}
    </div>
  );
}
