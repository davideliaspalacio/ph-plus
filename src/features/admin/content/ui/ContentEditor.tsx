"use client";

import { useState } from "react";
import { Button, EmptyState, Input } from "@/src/shared/ui";
import { newId } from "@/src/shared/lib/id";
import type { Banner, Content, FaqItem, HomeHero } from "../domain/content";

/**
 * Editor único de contenido de storefront (FUNCTIONAL-SPEC §24).
 *
 * Recibe el bundle inicial y un `onSave` callback. Internamente es controlado:
 * mantiene un draft local con las 4 secciones (Hero, Destacados, Banners, FAQ)
 * y dispara `onSave(draft)` cuando el admin aprieta "Guardar".
 *
 * La persistencia real vive en el repo: el caller decide qué hacer con el
 * payload (típicamente `contentRepo.updateHomeHero` + `setFeaturedSlugs` + diff
 * de banners y FAQ, o un set único si el backend lo soporta).
 */

export interface ContentEditorProps {
  initial: Content;
  onSave: (next: Content) => void | Promise<void>;
}

export function ContentEditor({ initial, onSave }: ContentEditorProps) {
  const [hero, setHero] = useState<HomeHero>(initial.homeHero);
  const [slugsText, setSlugsText] = useState<string>(
    initial.featuredSlugs.join("\n"),
  );
  const [banners, setBanners] = useState<Banner[]>(initial.banners);
  const [faq, setFaq] = useState<FaqItem[]>(initial.faq);

  const handleSave = () => {
    const featuredSlugs = slugsText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    void onSave({
      homeHero: hero,
      featuredSlugs,
      banners,
      faq,
    });
  };

  const updateHero = (patch: Partial<HomeHero>) =>
    setHero((h) => ({ ...h, ...patch }));

  const addBanner = () =>
    setBanners((prev) => [
      ...prev,
      {
        id: newId(),
        title: "Nuevo banner",
        image: "/banners/nuevo.svg",
        href: "/",
      },
    ]);

  const removeBanner = (id: string) =>
    setBanners((prev) => prev.filter((b) => b.id !== id));

  const updateBanner = (id: string, patch: Partial<Banner>) =>
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    );

  const addFaq = () =>
    setFaq((prev) => [
      ...prev,
      { id: newId(), q: "Nueva pregunta", a: "Nueva respuesta" },
    ]);

  const removeFaq = (id: string) =>
    setFaq((prev) => prev.filter((f) => f.id !== id));

  const updateFaq = (id: string, patch: Partial<FaqItem>) =>
    setFaq((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    );

  return (
    <div className="flex flex-col gap-8">
      {/* ----------------------------- Hero ----------------------------- */}
      <section className="rounded-3xl border border-card-border bg-white p-6">
        <h2 className="mb-4 text-[18px] font-extrabold text-brand">
          Hero del home
        </h2>
        <div className="flex flex-col gap-3">
          <Input
            label="Título del hero"
            value={hero.title}
            onChange={(e) => updateHero({ title: e.target.value })}
          />
          <Input
            label="Subtítulo"
            value={hero.subtitle}
            onChange={(e) => updateHero({ subtitle: e.target.value })}
          />
          <Input
            label="Texto del CTA"
            value={hero.ctaLabel}
            onChange={(e) => updateHero({ ctaLabel: e.target.value })}
          />
          <Input
            label="URL del CTA"
            value={hero.ctaHref}
            onChange={(e) => updateHero({ ctaHref: e.target.value })}
          />
        </div>
      </section>

      {/* ------------------------- Featured slugs ----------------------- */}
      <section className="rounded-3xl border border-card-border bg-white p-6">
        <h2 className="mb-4 text-[18px] font-extrabold text-brand">
          Productos destacados
        </h2>
        <label
          htmlFor="featured-slugs"
          className="mb-1.5 block text-[13px] font-semibold text-ink"
        >
          Slugs destacados (uno por línea)
        </label>
        <textarea
          id="featured-slugs"
          aria-label="Slugs destacados"
          rows={5}
          value={slugsText}
          onChange={(e) => setSlugsText(e.target.value)}
          className="w-full rounded-2xl border border-card-border bg-white p-3 font-mono text-[13px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </section>

      {/* ----------------------------- Banners ----------------------------- */}
      <section className="rounded-3xl border border-card-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-brand">Banners</h2>
          <Button size="sm" onClick={addBanner}>
            Agregar banner
          </Button>
        </div>
        {banners.length === 0 ? (
          <EmptyState
            title="Sin banners"
            description="Agregá el primer banner para que aparezca en el home."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                data-banner-row
                className="flex flex-col gap-2 rounded-2xl border border-card-border p-4"
              >
                <Input
                  label="Título"
                  value={b.title}
                  onChange={(e) =>
                    updateBanner(b.id, { title: e.target.value })
                  }
                />
                <Input
                  label="Imagen (path o URL)"
                  value={b.image}
                  onChange={(e) =>
                    updateBanner(b.id, { image: e.target.value })
                  }
                />
                <Input
                  label="Destino (href)"
                  value={b.href}
                  onChange={(e) =>
                    updateBanner(b.id, { href: e.target.value })
                  }
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeBanner(b.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------- FAQ ------------------------------- */}
      <section className="rounded-3xl border border-card-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-extrabold text-brand">FAQ</h2>
          <Button size="sm" onClick={addFaq}>
            Agregar FAQ
          </Button>
        </div>
        {faq.length === 0 ? (
          <EmptyState
            title="Sin preguntas frecuentes"
            description="Agregá la primera pregunta para que aparezca en la página de FAQ."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {faq.map((f) => (
              <div
                key={f.id}
                data-faq-row
                className="flex flex-col gap-2 rounded-2xl border border-card-border p-4"
              >
                <Input
                  label="Pregunta"
                  value={f.q}
                  onChange={(e) => updateFaq(f.id, { q: e.target.value })}
                />
                <label
                  htmlFor={`faq-a-${f.id}`}
                  className="mb-1.5 block text-[13px] font-semibold text-ink"
                >
                  Respuesta
                </label>
                <textarea
                  id={`faq-a-${f.id}`}
                  rows={3}
                  value={f.a}
                  onChange={(e) => updateFaq(f.id, { a: e.target.value })}
                  className="w-full rounded-2xl border border-card-border bg-white p-3 text-[14px] text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeFaq(f.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------------------- Save ------------------------------ */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar</Button>
      </div>
    </div>
  );
}
