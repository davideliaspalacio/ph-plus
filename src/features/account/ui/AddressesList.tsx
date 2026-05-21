"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, EmptyState, Input, Modal } from "@/src/shared/ui";
import { useSession } from "@/src/features/auth";
import { addressRepo, type Address, type NewAddressInput } from "@/src/features/account";

export function AddressesList() {
  const session = useSession((s) => s.session);
  const userId = session?.userId;
  const [items, setItems] = useState<Address[] | null>(null);
  const [adding, setAdding] = useState(false);

  const reload = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }
    setItems(await addressRepo.listByUser(userId));
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  if (items == null) {
    return <p className="text-[14px] text-ink-muted">Cargando…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-ink-muted">
          {items.length} dirección{items.length === 1 ? "" : "es"} guardada
          {items.length === 1 ? "" : "s"}
        </p>
        <Button onClick={() => setAdding(true)}>+ Agregar dirección</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No tenés direcciones guardadas"
          description="Agregá una para acelerar el checkout."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((a) => (
            <li
              key={a.id}
              className="rounded-3xl border border-card-border bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-[14px] font-bold text-brand">{a.label}</h4>
                {a.isDefault && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-bold uppercase text-brand">
                    Predeterminada
                  </span>
                )}
              </div>
              <p className="mt-2 text-[14px] font-semibold text-ink">{a.name}</p>
              <p className="text-[13px] text-ink-muted">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""} · {a.city}, {a.department}
              </p>
              <p className="text-[12px] text-ink-muted">Tel: {a.phone}</p>
              <div className="mt-3 flex gap-2 text-[12px]">
                {!a.isDefault && userId && (
                  <button
                    type="button"
                    onClick={async () => {
                      await addressRepo.setDefault(userId, a.id);
                      await reload();
                    }}
                    className="font-semibold text-brand hover:underline"
                  >
                    Establecer predeterminada
                  </button>
                )}
                <button
                  type="button"
                  onClick={async () => {
                    await addressRepo.remove(a.id);
                    await reload();
                  }}
                  className="ml-auto font-semibold text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddressFormModal
        isOpen={adding}
        onClose={() => setAdding(false)}
        userId={userId}
        onSaved={async () => {
          setAdding(false);
          await reload();
        }}
      />
    </div>
  );
}

function AddressFormModal({
  isOpen,
  onClose,
  userId,
  onSaved,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string | undefined;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<NewAddressInput>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    department: "",
    phone: "",
    label: "Casa",
    isDefault: false,
  });
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!userId) return;
    try {
      await addressRepo.create(userId, values);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva dirección"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={submit}>Guardar</Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Nombre del destinatario"
          required
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
        />
        <Input
          label="Teléfono"
          type="tel"
          inputMode="numeric"
          required
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
        />
        <Input
          label="Dirección"
          required
          className="sm:col-span-2"
          value={values.line1}
          onChange={(e) => setValues({ ...values, line1: e.target.value })}
        />
        <Input
          label="Información adicional"
          className="sm:col-span-2"
          value={values.line2 ?? ""}
          onChange={(e) => setValues({ ...values, line2: e.target.value })}
        />
        <Input
          label="Ciudad"
          required
          value={values.city}
          onChange={(e) => setValues({ ...values, city: e.target.value })}
        />
        <Input
          label="Departamento"
          required
          value={values.department}
          onChange={(e) => setValues({ ...values, department: e.target.value })}
        />
        <Input
          label="Etiqueta"
          value={values.label ?? "Casa"}
          onChange={(e) => setValues({ ...values, label: e.target.value })}
        />
        <label className="flex items-center gap-2 self-end pb-2 text-[13px] text-ink">
          <input
            type="checkbox"
            checked={values.isDefault ?? false}
            onChange={(e) =>
              setValues({ ...values, isDefault: e.target.checked })
            }
          />
          Establecer como predeterminada
        </label>
        {error && (
          <p className="text-[12px] text-red-600 sm:col-span-2">{error}</p>
        )}
      </div>
    </Modal>
  );
}
