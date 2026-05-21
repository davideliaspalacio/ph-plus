"use client";

import { useEffect, useState } from "react";
import { ContentEditor, contentRepo, type Content } from "@/src/features/admin/content";

export default function AdminContenidoPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => setContent(await contentRepo.get()))();
  }, []);

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
      </header>
      <ContentEditor
        initial={content}
        onSave={async (draft) => {
          // Persistimos todo via los métodos del repo. Para mantenerlo simple
          // sobreescribimos con un solo "snapshot": actualizamos hero, slugs y
          // luego re-cargamos.
          await contentRepo.updateHomeHero(draft.homeHero);
          await contentRepo.setFeaturedSlugs(draft.featuredSlugs);
          // banners/faq pueden tener cambios in-place; persistimos via update individuales
          for (const banner of draft.banners) {
            await contentRepo.updateBanner(banner);
          }
          for (const faq of draft.faq) {
            await contentRepo.updateFaq(faq);
          }
          setContent(await contentRepo.get());
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      />
    </div>
  );
}
