/**
 * API pública de la feature `admin/content`.
 *
 * Importar desde fuera de esta feature siempre por aquí, nunca de subpaths.
 */

export {
  HomeHeroSchema,
  BannerSchema,
  FaqItemSchema,
  ContentSchema,
  type HomeHero,
  type Banner,
  type FaqItem,
  type Content,
} from "./domain/content";

export { contentRepo } from "./data";
export {
  CONTENT_STORAGE_KEY,
  MockContentRepo,
} from "./data/mock.repo";
export type {
  ContentRepository,
  NewBannerInput,
  NewFaqInput,
} from "./data/ports";

export { ContentEditor, type ContentEditorProps } from "./ui/ContentEditor";
