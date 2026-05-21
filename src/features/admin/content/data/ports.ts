import type { Banner, Content, FaqItem, HomeHero } from "../domain/content";

/**
 * Puerto del repositorio de contenido editable.
 *
 * Toda la sección de "Contenido" del admin opera contra este contrato.
 * El día que migremos a Supabase, una `SupabaseContentRepo` lo cumple igual.
 */

/** Input para agregar un banner: sin `id` (lo genera el repo). */
export type NewBannerInput = Omit<Banner, "id">;

/** Input para agregar una FAQ: sin `id` (lo genera el repo). */
export type NewFaqInput = Omit<FaqItem, "id">;

export interface ContentRepository {
  /** Devuelve el bundle completo de contenido (con seed inicial si está vacío). */
  get(): Promise<Content>;
  /** Reemplaza el bloque `homeHero`. */
  updateHomeHero(hero: HomeHero): Promise<Content>;
  /** Reemplaza la lista de slugs destacados. */
  setFeaturedSlugs(slugs: string[]): Promise<Content>;
  /** Agrega un banner generando `id`. */
  addBanner(banner: NewBannerInput): Promise<Content>;
  /** Quita un banner por `id`. */
  removeBanner(id: string): Promise<Content>;
  /** Actualiza un banner existente. */
  updateBanner(banner: Banner): Promise<Content>;
  /** Agrega una FAQ generando `id`. */
  addFaq(faq: NewFaqInput): Promise<Content>;
  /** Quita una FAQ por `id`. */
  removeFaq(id: string): Promise<Content>;
  /** Actualiza una FAQ existente. */
  updateFaq(faq: FaqItem): Promise<Content>;
}
