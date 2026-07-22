"use client";

import type { Product } from "@/app/lib/products";
import { Tabs, type TabItem } from "@/src/shared/ui";
import { cn } from "@/src/shared/lib/cn";
import { ProductGalleryFeature, type GalleryItem } from "./ProductGalleryFeature";
import { ProductInfo } from "./ProductInfo";
import { RelatedProducts } from "./RelatedProducts";

export interface ProductDetailProps {
  product: Product;
  /** Lista completa de productos para `RelatedProducts`. Si no se pasa, no se renderiza. */
  allProducts?: Product[];
  onAdd?: (product: Product, qty: number) => void;
  className?: string;
}

/**
 * Adapta la galería interna del producto (visualKey/bg/caption) al shape
 * `GalleryItem` (src/alt) que espera `ProductGalleryFeature`. Si el producto
 * ya trae `gallery` con `src`+`alt` (forma nueva), se respeta. Si no, se
 * genera un fallback razonable con la imagen canónica del slug.
 */
function toGalleryItems(product: Product): GalleryItem[] {
  const raw = (product.gallery ?? []) as unknown[];
  const mapped: GalleryItem[] = raw
    .map((g) => {
      if (g && typeof g === "object") {
        const obj = g as Record<string, unknown>;
        if (typeof obj.src === "string") {
          return {
            src: obj.src,
            alt: (typeof obj.alt === "string" && obj.alt) ||
              (typeof obj.caption === "string" && obj.caption) ||
              product.title,
            caption: typeof obj.caption === "string" ? obj.caption : undefined,
          } as GalleryItem;
        }
      }
      return null;
    })
    .filter((x): x is GalleryItem => x !== null);

  if (mapped.length > 0) return mapped;
  return [
    {
      src: `/products/${product.slug}.png`,
      alt: product.title,
    },
  ];
}

function ReviewsTab({ product }: { product: Product }) {
  const rating = product.rating;
  return (
    <div id="tab-reviews" className="space-y-4">
      {rating && (
        <div className="flex items-center gap-4 rounded-xl bg-[#eef0ff] p-4">
          <p className="text-[32px] font-extrabold leading-none text-brand">
            {rating.average.toFixed(1)}
          </p>
          <p className="text-[14px] font-semibold text-brand">
            Basado en {rating.count} reseñas
          </p>
        </div>
      )}
      <p className="text-[13px] text-ink-muted">
        Inicia sesión para escribir una reseña.
      </p>
    </div>
  );
}

function ShippingTab({ product }: { product: Product }) {
  const shipping =
    (product as unknown as { shipping?: string }).shipping ??
    "Envíos a domicilio en 24-48h hábiles. Cambios y devoluciones dentro de 7 días.";
  return (
    <div className="space-y-3 text-[14px] leading-[1.7] text-ink sm:text-[15px]">
      <p>{shipping}</p>
      <ul className="list-disc pl-5">
        <li>El envío se calcula según la ciudad seleccionada.</li>
        <li>Pago seguro y atención por WhatsApp.</li>
        <li>Devolución hasta 7 días tras la entrega.</li>
      </ul>
    </div>
  );
}

export function ProductDetail({
  product,
  allProducts,
  onAdd,
  className,
}: ProductDetailProps) {
  const galleryItems = toGalleryItems(product);

  const longDescription = (product.longDescription ?? []) as string[];
  const specs = (product.specs ?? []) as Array<{ label: string; value: string }>;

  const tabs: TabItem[] = [
    {
      id: "descripcion",
      label: "Descripción",
      content: (
        <div className="space-y-4 text-[14px] leading-[1.7] text-ink sm:text-[15px]">
          {longDescription.length > 0 ? (
            longDescription.map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <p>{product.description}</p>
          )}
        </div>
      ),
    },
    {
      id: "specs",
      label: "Specs",
      content: (
        <dl className="divide-y divide-card-border">
          {specs.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-3.5"
            >
              <dt className="text-[13px] font-semibold uppercase tracking-wide text-brand sm:w-1/3">
                {row.label}
              </dt>
              <dd className="text-[14px] text-ink sm:text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "reviews",
      label: "Reseñas",
      content: <ReviewsTab product={product} />,
    },
    {
      id: "envios",
      label: "Envío y devoluciones",
      content: <ShippingTab product={product} />,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
        <ProductGalleryFeature images={galleryItems} />
        <ProductInfo product={product} onAdd={onAdd} />
      </section>

      <section>
        <Tabs items={tabs} defaultActiveId="descripcion" />
      </section>

      {allProducts && allProducts.length > 0 && (
        <RelatedProducts current={product} all={allProducts} />
      )}
    </div>
  );
}
