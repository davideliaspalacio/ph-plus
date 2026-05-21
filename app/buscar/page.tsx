"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button, EmptyState } from "@/src/shared/ui";
import { rankProducts } from "@/src/features/search";
import { productRepo, ProductCard } from "@/src/features/catalog";
import { useCart } from "@/src/features/cart/store/useCart";
import type { Product } from "@/app/lib/products";

function SearchContent() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const [products, setProducts] = useState<Product[] | null>(null);
  const addItem = useCart((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const all = await productRepo.list();
      if (!cancelled) setProducts(all.items);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const results = useMemo(() => {
    if (!products || q.length < 2) return [];
    return rankProducts(products, q, 30).map((r) => r.product);
  }, [products, q]);

  if (q.length < 2) {
    return (
      <EmptyState
        title="Escribí al menos 2 caracteres"
        description="Buscá tus productos PH PLUS favoritos."
        action={
          <Link href="/productos">
            <Button>Ver todos los productos</Button>
          </Link>
        }
      />
    );
  }

  if (products == null) {
    return <p className="text-[14px] text-ink-muted">Buscando…</p>;
  }

  if (results.length === 0) {
    return (
      <EmptyState
        title={`Sin resultados para "${q}"`}
        description="Probá con otros términos o revisá la lista completa de productos."
        action={
          <Link href="/productos">
            <Button>Ver todos los productos</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-[14px] text-ink-muted">
        {results.length} resultado{results.length === 1 ? "" : "s"} para{" "}
        <strong className="text-ink">&ldquo;{q}&rdquo;</strong>
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((p) => (
          <ProductCard key={p.slug} product={p} onAdd={(prod) => addItem(prod.slug, 1)} />
        ))}
      </div>
    </>
  );
}

export default function BuscarPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-page px-5 py-10 sm:px-8 lg:px-12">
        <h1 className="text-[28px] font-extrabold text-brand">Búsqueda</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Encontrá lo que necesitás más rápido.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p>Cargando…</p>}>
            <SearchContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
