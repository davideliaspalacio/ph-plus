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
  const [error, setError] = useState<string | null>(null);

  // Sin este catch, un fallo (RLS, red, o un INVALID_TRANSITION del trigger)
  // dejaba la pantalla en "Cargando pedidos…" para siempre, sin feedback.
  const reload = async () => {
    try {
      setError(null);
      const list = await orderRepo.list();
      setOrders(list);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudieron cargar los pedidos.",
      );
      setOrders([]);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
        {error}
      </p>
    );
  }

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
