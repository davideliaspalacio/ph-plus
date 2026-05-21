"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Select, Tabs } from "@/src/shared/ui";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SIZES,
} from "@/src/features/catalog";
import type { Product } from "@/app/lib/products";
import {
  ProductFormSchema,
  PRODUCT_FORM_DEFAULTS,
  type ProductFormValues,
} from "../domain/product-form";

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
    <div className="rounded-2xl border border-dashed border-card-border bg-white p-8 text-center text-[14px] text-ink-muted">
      Subida de imágenes próximamente. Por ahora las imágenes se gestionan vía
      seeds.
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
