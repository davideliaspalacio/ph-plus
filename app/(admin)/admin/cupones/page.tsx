"use client";

import { useEffect, useState } from "react";
import { Button, EmptyState, Modal } from "@/src/shared/ui";
import {
  CouponsTable,
  CouponForm,
  type CouponFormInput,
} from "@/src/features/admin/coupons-ui";
import { couponRepo, type Coupon } from "@/src/features/coupons";

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = async () => setCoupons(await couponRepo.list());

  useEffect(() => {
    void reload();
  }, []);

  if (coupons == null) {
    return <p className="text-[14px] text-ink-muted">Cargando cupones…</p>;
  }

  const handleSubmit = async (input: CouponFormInput) => {
    if (editing) {
      await couponRepo.update(editing.id, input);
    } else {
      await couponRepo.create(input);
    }
    setCreating(false);
    setEditing(null);
    await reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold text-brand">Cupones</h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            {coupons.length} cupón{coupons.length === 1 ? "" : "es"} configurado
            {coupons.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Crear cupón</Button>
      </header>

      {coupons.length === 0 ? (
        <EmptyState
          title="Sin cupones"
          description="Empezá creando el primero."
          action={<Button onClick={() => setCreating(true)}>Crear cupón</Button>}
        />
      ) : (
        <CouponsTable
          coupons={coupons}
          onEdit={setEditing}
          onArchive={async (c) => {
            await couponRepo.archive(c.id);
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
        title={editing ? "Editar cupón" : "Crear cupón"}
        size="lg"
      >
        <CouponForm
          coupon={editing ?? undefined}
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
