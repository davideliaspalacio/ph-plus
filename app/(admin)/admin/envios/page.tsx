"use client";

import { useEffect, useState } from "react";
import { Button, EmptyState, Modal } from "@/src/shared/ui";
import {
  ShippingZonesTable,
  ZoneForm,
} from "@/src/features/admin/shipping-zones-ui";
import {
  shippingRepo,
  type ShippingZone,
  type NewShippingZone,
} from "@/src/features/shipping";

export default function AdminEnviosPage() {
  const [zones, setZones] = useState<ShippingZone[] | null>(null);
  const [editing, setEditing] = useState<ShippingZone | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = async () => setZones(await shippingRepo.list());

  useEffect(() => {
    void reload();
  }, []);

  if (zones == null) {
    return <p className="text-[14px] text-ink-muted">Cargando zonas…</p>;
  }

  const handleSubmit = async (input: NewShippingZone) => {
    if (editing) {
      await shippingRepo.update(editing.id, input);
    } else {
      await shippingRepo.create(input);
    }
    setCreating(false);
    setEditing(null);
    await reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold text-brand">Zonas de envío</h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            {zones.length} zona{zones.length === 1 ? "" : "s"} configurada
            {zones.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Crear zona</Button>
      </header>

      {zones.length === 0 ? (
        <EmptyState
          title="Sin zonas configuradas"
          description="Crear al menos una para que el carrito calcule envíos."
          action={<Button onClick={() => setCreating(true)}>Crear zona</Button>}
        />
      ) : (
        <ShippingZonesTable
          zones={zones}
          onEdit={setEditing}
          onArchive={async (z) => {
            await shippingRepo.archive(z.id);
            await reload();
          }}
        />
      )}

      <Modal
        isOpen={creating || editing != null}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={editing ? "Editar zona" : "Nueva zona de envío"}
        size="lg"
      >
        <ZoneForm
          zone={editing ?? undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
