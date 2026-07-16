"use client";

import { useEffect, useState } from "react";
import { ContentEditor, contentRepo, type Content } from "@/src/features/admin/content";

export default function AdminContenidoPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        setContent(await contentRepo.get());
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "No se pudo cargar el contenido.",
        );
      }
    })();
  }, []);

  if (error && !content) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
        {error}
      </p>
    );
  }

  if (!content) {
    return <p className="text-[14px] text-ink-muted">Cargando contenido…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-[24px] font-extrabold text-brand">Contenido</h1>
          <p className="mt-1 text-[14px] text-ink-muted">
            Editá hero del home, productos destacados, banners y FAQ.
          </p>
        </div>
        {saved && (
          <span className="text-[13px] text-whatsapp-dark">Guardado ✓</span>
        )}
        {error && (
          <span className="text-[13px] font-semibold text-red-600">{error}</span>
        )}
      </header>
      <ContentEditor
        initial={content}
        onSave={async (draft) => {
          setError(null);
          try {
            // El editor entrega un draft completo, pero el repo opera por
            // ítem (add/update/remove). Hay que diffear contra lo guardado:
            // los banners/FAQ nuevos traen un id generado en el cliente que no
            // matchea ninguna fila, así que un updateX los descartaba en
            // silencio; y los borrados nunca se propagaban.
            const current = await contentRepo.get();

            await contentRepo.updateHomeHero(draft.homeHero);
            await contentRepo.setFeaturedSlugs(draft.featuredSlugs);

            const savedBannerIds = new Set(current.banners.map((b) => b.id));
            const draftBannerIds = new Set(draft.banners.map((b) => b.id));
            for (const banner of draft.banners) {
              if (savedBannerIds.has(banner.id)) {
                await contentRepo.updateBanner(banner);
              } else {
                const { id: _id, ...nuevo } = banner;
                await contentRepo.addBanner(nuevo);
              }
            }
            for (const banner of current.banners) {
              if (!draftBannerIds.has(banner.id)) {
                await contentRepo.removeBanner(banner.id);
              }
            }

            const savedFaqIds = new Set(current.faq.map((f) => f.id));
            const draftFaqIds = new Set(draft.faq.map((f) => f.id));
            for (const faq of draft.faq) {
              if (savedFaqIds.has(faq.id)) {
                await contentRepo.updateFaq(faq);
              } else {
                const { id: _id, ...nueva } = faq;
                await contentRepo.addFaq(nueva);
              }
            }
            for (const faq of current.faq) {
              if (!draftFaqIds.has(faq.id)) {
                await contentRepo.removeFaq(faq.id);
              }
            }

            setContent(await contentRepo.get());
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          } catch (e) {
            // Antes cualquier fallo (p. ej. RLS) reventaba sin feedback.
            setError(
              e instanceof Error ? e.message : "No se pudieron guardar los cambios.",
            );
          }
        }}
      />
    </div>
  );
}
