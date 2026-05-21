"use client";

import { useEffect, useState } from "react";
import { Badge, Button, EmptyState, Input, Modal, Select } from "@/src/shared/ui";
import { inventoryRepo, type StockItem, type StockMovement } from "@/src/features/admin/inventory";
import { PRODUCTS } from "@/app/lib/products";
import { formatDate } from "@/src/shared/lib/format";

export default function AdminInventarioPage() {
  const [items, setItems] = useState<StockItem[] | null>(null);
  const [adjusting, setAdjusting] = useState<StockItem | null>(null);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const reload = async () => {
    // Asegurar seeds desde PRODUCTS
    await inventoryRepo.seedFromProducts(PRODUCTS.map((p) => p.slug));
    setItems(await inventoryRepo.listStock());
    setMovements(await inventoryRepo.listMovements());
  };

  useEffect(() => {
    void reload();
  }, []);

  if (items == null) {
    return <p className="text-[14px] text-ink-muted">Cargando inventario…</p>;
  }

  const lowStock = items.filter((i) => i.current <= i.low).length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[24px] font-extrabold text-brand">Inventario</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          {items.length} SKU · {lowStock} con stock bajo
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Sin items en stock"
          description="Aún no se sembró el inventario."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-card-border bg-white">
          <table className="w-full text-[14px]">
            <thead className="bg-[#fafbff] text-left text-[12px] uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">Umbral bajo</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.sku} className="border-t border-card-border">
                  <td className="px-4 py-3 font-mono text-[12px] text-ink-muted">
                    {it.sku}
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand">
                    {it.productSlug}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {it.current}
                  </td>
                  <td className="px-4 py-3 text-right text-ink-muted">
                    {it.low}
                  </td>
                  <td className="px-4 py-3">
                    {it.current <= it.low ? (
                      <Badge tone="warning">Stock bajo</Badge>
                    ) : (
                      <Badge tone="success">OK</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setAdjusting(it)}>
                      Ajustar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="rounded-3xl border border-card-border bg-white p-6">
        <h2 className="text-[16px] font-extrabold text-brand">
          Últimos movimientos
        </h2>
        {movements.length === 0 ? (
          <p className="mt-3 text-[13px] text-ink-muted">
            Aún no hay movimientos registrados.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-card-border">
            {movements.slice(0, 10).map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2 text-[13px]">
                <Badge
                  tone={
                    m.type === "in" || m.type === "return"
                      ? "success"
                      : m.type === "adjustment"
                        ? "info"
                        : "danger"
                  }
                >
                  {m.type}
                </Badge>
                <span className="font-mono text-[12px] text-ink-muted">
                  {m.sku}
                </span>
                <span className="font-semibold">
                  {m.type === "out" ? "-" : "+"}
                  {m.quantity}
                </span>
                <span className="ml-auto text-[12px] text-ink-muted">
                  {formatDate(m.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {adjusting && (
        <AdjustModal
          item={adjusting}
          onClose={() => setAdjusting(null)}
          onSaved={async () => {
            setAdjusting(null);
            await reload();
          }}
        />
      )}
    </div>
  );
}

function AdjustModal({
  item,
  onClose,
  onSaved,
}: {
  item: StockItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [type, setType] = useState<StockMovement["type"]>("in");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState<StockMovement["reason"]>("manual");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      await inventoryRepo.adjustStock(item.sku, {
        sku: item.sku,
        type,
        quantity: Number(quantity),
        reason,
        note: note || undefined,
        author: "Admin",
      });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Ajustar ${item.sku}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit}>Guardar</Button>
        </>
      }
    >
      <div className="grid gap-3">
        <Select
          label="Tipo de movimiento"
          value={type}
          onChange={(e) => setType(e.target.value as StockMovement["type"])}
          options={[
            { value: "in", label: "Entrada" },
            { value: "out", label: "Salida" },
            { value: "adjustment", label: "Ajuste (set absoluto)" },
            { value: "return", label: "Devolución" },
          ]}
        />
        <Input
          label="Cantidad"
          type="number"
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <Select
          label="Motivo"
          value={reason}
          onChange={(e) => setReason(e.target.value as StockMovement["reason"])}
          options={[
            { value: "purchase", label: "Compra" },
            { value: "sale", label: "Venta" },
            { value: "loss", label: "Merma" },
            { value: "return", label: "Devolución" },
            { value: "manual", label: "Ajuste manual" },
          ]}
        />
        <Input
          label="Nota (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        {error && <p className="text-[12px] text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}
