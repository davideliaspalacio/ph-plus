"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, EmptyState, Modal } from "@/src/shared/ui";
import {
  adminProductRepo,
  ProductsTable,
  ProductForm,
} from "@/src/features/admin/products";
import type { Product } from "@/app/lib/products";

export default function AdminProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = async () => {
    const list = await adminProductRepo.list();
    setProducts(list);
  };

  useEffect(() => {
    void reload();
  }, []);

  if (products == null) {
    return <p className="text-[14px] text-ink-muted">Cargando productos…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-extrabold text-brand">Productos</h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            {products.length} producto{products.length === 1 ? "" : "s"} en el
            catálogo.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>+ Crear producto</Button>
      </header>

      {products.length === 0 ? (
        <EmptyState
          title="Sin productos"
          description="Empezá creando el primero."
          action={<Button onClick={() => setCreating(true)}>Crear producto</Button>}
        />
      ) : (
        <ProductsTable
          products={products}
          onEdit={setEditing}
          onArchive={async (p) => {
            await adminProductRepo.archive(p.slug);
            await reload();
          }}
          onBulkUpdate={async (slugs, patch) => {
            await adminProductRepo.bulkUpdate(slugs, patch);
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
        title={editing ? "Editar producto" : "Crear producto"}
        size="lg"
      >
        <ProductForm
          product={editing ?? undefined}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (values) => {
            if (editing) {
              await adminProductRepo.update(editing.slug, values as Partial<Product>);
            } else {
              // Producto nuevo: hidratamos los campos visuales obligatorios
              // del Product legacy que el form no expone (gallery, specs, etc).
              const newProduct = {
                ...values,
                price: `$ ${values.priceValue.toLocaleString("es-CO")}`,
                longDescription: [values.description],
                features: [],
                includes: [],
                gallery: values.gallery ?? [],
                specs: [],
                usage: [],
                reviews: [],
                rating: { average: 0, count: 0 },
              } as unknown as Product;
              await adminProductRepo.create(newProduct);
            }
            setCreating(false);
            setEditing(null);
            await reload();
            router.refresh();
          }}
        />
      </Modal>
    </div>
  );
}
