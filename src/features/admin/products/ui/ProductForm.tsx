"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Select, Tabs } from "@/src/shared/ui";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
} from "@/src/features/catalog";
import type { GalleryImage, Product } from "@/app/lib/products";
import {
  ProductFormSchema,
  PRODUCT_FORM_DEFAULTS,
  type ProductFormValues,
} from "../domain/product-form";
import { uploadProductImage } from "../data/upload-image";

export interface ProductFormProps {
  product?: Product;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

type FormState = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  priceValue: string;
  prevPriceValue: string;
  category: string;
  size: string;
  visualKey: string;
  popularity: string;
  isActive: boolean;
  gallery: GalleryImage[];
  metaTitle: string;
  metaDescription: string;
  stockCurrent: string;
  stockLow: string;
};

function toInitialState(product?: Product): FormState {
  const base = product ?? PRODUCT_FORM_DEFAULTS;
  return {
    slug: product?.slug ?? "",
    title: base.title ?? "",
    shortTitle: base.shortTitle ?? "",
    tagline: base.tagline ?? "",
    description: base.description ?? "",
    priceValue: String(base.priceValue ?? 0),
    prevPriceValue:
      base.prevPriceValue != null ? String(base.prevPriceValue) : "",
    category: base.category ?? "botellon",
    size: base.size ?? "19L",
    visualKey: (base as { visualKey?: string }).visualKey ?? "garrafas",
    popularity: String(base.popularity ?? 50),
    isActive: product ? product.inStock !== false : true,
    gallery: product?.gallery ?? [],
    metaTitle: "",
    metaDescription: "",
    stockCurrent: "",
    stockLow: "5",
  };
}

const CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map((c) => ({
  value: c,
  label: c,
}));
const SIZE_OPTIONS = PRODUCT_SIZES.map((s) => ({ value: s, label: s }));
const VISUAL_KEY_OPTIONS = [
  { value: "kit", label: "kit" },
  { value: "garrafas", label: "garrafas" },
  { value: "recargas", label: "recargas" },
];

/**
 * Formulario de creación / edición de productos.
 *
 * Organizado en tabs (General / Precio / Imágenes / Stock / SEO). Valida con
 * `ProductFormSchema` al hacer submit y emite los valores normalizados (slug
 * pasado por `toSlug`, números parseados, etc.) al `onSubmit` del caller.
 */
export function ProductForm({
  product,
  onSubmit,
  onCancel,
  submitting,
}: ProductFormProps) {
  const [state, setState] = useState<FormState>(() => toInitialState(product));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const src = await uploadProductImage(file, state.slug);
        setState((prev) => ({
          ...prev,
          gallery: [
            ...prev.gallery,
            {
              visualKey: (prev.visualKey || "garrafas") as GalleryImage["visualKey"],
              bg: "#f4f6fb",
              caption: prev.title || file.name,
              src,
            },
          ],
        }));
      }
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "No se pudo subir la imagen.",
      );
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryItem(index: number) {
    setState((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = {
      slug: state.slug,
      title: state.title,
      shortTitle: state.shortTitle,
      tagline: state.tagline,
      description: state.description,
      priceValue: Number(state.priceValue),
      prevPriceValue:
        state.prevPriceValue === ""
          ? undefined
          : Number(state.prevPriceValue),
      category: state.category,
      size: state.size,
      visualKey: state.visualKey,
      popularity: Number(state.popularity),
      isActive: state.isActive,
      gallery: state.gallery,
      metaTitle: state.metaTitle || undefined,
      metaDescription: state.metaDescription || undefined,
    };
    const parsed = ProductFormSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSubmit(parsed.data);
  }

  const generalTab = (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Slug"
        required
        value={state.slug}
        onChange={(e) => set("slug", e.target.value)}
        error={errors.slug}
        hint="Se normaliza a kebab-case automáticamente"
      />
      <Input
        label="Título"
        required
        value={state.title}
        onChange={(e) => set("title", e.target.value)}
        error={errors.title}
      />
      <Input
        label="Título corto"
        required
        value={state.shortTitle}
        onChange={(e) => set("shortTitle", e.target.value)}
        error={errors.shortTitle}
      />
      <Input
        label="Tagline"
        required
        value={state.tagline}
        onChange={(e) => set("tagline", e.target.value)}
        error={errors.tagline}
      />
      <div className="md:col-span-2">
        <label
          htmlFor="product-form-description"
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          Descripción *
        </label>
        <textarea
          id="product-form-description"
          value={state.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-card-border bg-white px-4 py-3 text-[14px] text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        {errors.description && (
          <p className="mt-1.5 text-[12px] text-red-600">{errors.description}</p>
        )}
      </div>
      <Select
        label="Categoría"
        options={CATEGORY_OPTIONS}
        value={state.category}
        onChange={(e) => set("category", e.target.value)}
        error={errors.category}
      />
      <Select
        label="Tamaño"
        options={SIZE_OPTIONS}
        value={state.size}
        onChange={(e) => set("size", e.target.value)}
        error={errors.size}
      />
      <Select
        label="Visual key"
        options={VISUAL_KEY_OPTIONS}
        value={state.visualKey}
        onChange={(e) => set("visualKey", e.target.value)}
        error={errors.visualKey}
      />
      <label className="mt-2 flex items-center gap-2 text-[14px] text-ink">
        <input
          type="checkbox"
          checked={state.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
        />
        Activo
      </label>
    </div>
  );

  const priceTab = (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Precio (COP)"
        required
        type="number"
        min={0}
        value={state.priceValue}
        onChange={(e) => set("priceValue", e.target.value)}
        error={errors.priceValue}
      />
      <Input
        label="Precio anterior (opcional)"
        type="number"
        min={0}
        value={state.prevPriceValue}
        onChange={(e) => set("prevPriceValue", e.target.value)}
        error={errors.prevPriceValue}
        hint="Si lo cargás, debe ser mayor al precio actual"
      />
      <Input
        label="Popularity (0–100)"
        required
        type="number"
        min={0}
        max={100}
        value={state.popularity}
        onChange={(e) => set("popularity", e.target.value)}
        error={errors.popularity}
      />
    </div>
  );

  const imagesTab = (
    <div className="flex flex-col gap-4">
      {state.gallery.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {state.gallery.map((img, i) => (
            <li
              key={`${img.src ?? img.visualKey}-${i}`}
              className="group relative overflow-hidden rounded-xl border border-card-border bg-white"
            >
              {img.src ? (
                // Preview del admin: URL remota de Storage, sin next/image.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.src}
                  alt={img.caption}
                  className="h-24 w-full object-contain p-1"
                />
              ) : (
                <div
                  className="grid h-24 w-full place-items-center text-[11px] text-ink-muted"
                  style={{ background: img.bg }}
                >
                  ilustración ({img.visualKey})
                </div>
              )}
              <button
                type="button"
                onClick={() => removeGalleryItem(i)}
                aria-label={`Quitar imagen ${i + 1}`}
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-[12px] text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-card-border bg-white p-8 text-center text-[14px] text-ink-muted transition-colors hover:border-brand">
        <span className="font-semibold text-brand">
          {uploading ? "Subiendo…" : "Subir imágenes"}
        </span>
        <span className="text-[12px]">
          JPG/PNG/WebP hasta 5MB. Podés seleccionar varias.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            void handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {uploadError && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          {uploadError}
        </p>
      )}
      <p className="text-[12px] text-ink-muted">
        La primera imagen es la principal. Se guardan al guardar el producto.
      </p>
    </div>
  );

  const stockTab = (
    <div className="grid gap-4 md:grid-cols-2">
      <Input
        label="Stock actual"
        type="number"
        min={0}
        value={state.stockCurrent}
        onChange={(e) => set("stockCurrent", e.target.value)}
        hint="Se integrará con admin/inventory"
      />
      <Input
        label="Umbral low-stock"
        type="number"
        min={0}
        value={state.stockLow}
        onChange={(e) => set("stockLow", e.target.value)}
      />
    </div>
  );

  const seoTab = (
    <div className="grid gap-4">
      <Input
        label="Meta título"
        value={state.metaTitle}
        onChange={(e) => set("metaTitle", e.target.value)}
        error={errors.metaTitle}
      />
      <div>
        <label
          htmlFor="product-form-meta-description"
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          Meta descripción
        </label>
        <textarea
          id="product-form-meta-description"
          value={state.metaDescription}
          onChange={(e) => set("metaDescription", e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-card-border bg-white px-4 py-3 text-[14px] text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Tabs
        items={[
          { id: "general", label: "General", content: generalTab },
          { id: "price", label: "Precio", content: priceTab },
          { id: "images", label: "Imágenes", content: imagesTab },
          { id: "stock", label: "Stock", content: stockTab },
          { id: "seo", label: "SEO", content: seoTab },
        ]}
      />
      <div className="flex justify-end gap-3 border-t border-card-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={submitting}>
          {product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}
