import { storage } from "@/src/shared/lib/storage";
import { newId } from "@/src/shared/lib/id";
import { CONTENT_SEED } from "@/src/mocks/content.seed";
import {
  ContentSchema,
  type Banner,
  type Content,
  type FaqItem,
  type HomeHero,
} from "../domain/content";
import type {
  ContentRepository,
  NewBannerInput,
  NewFaqInput,
} from "./ports";

/**
 * Implementación mock del ContentRepository.
 *
 * Persiste el bundle entero bajo una sola llave `phplus.db.content.v1`.
 * Si no hay valor previo, hidrata desde `CONTENT_SEED`.
 */

export const CONTENT_STORAGE_KEY = "phplus.db.content.v1";

function seedContent(): Content {
  return ContentSchema.parse({
    homeHero: { ...CONTENT_SEED.homeHero },
    featuredSlugs: [...CONTENT_SEED.featuredSlugs],
    banners: CONTENT_SEED.banners.map((b) => ({ ...b })),
    // El seed usa entries sin `id`; le asignamos ids estables del index.
    faq: CONTENT_SEED.faq.map((f, i) => ({
      id: `faq_seed_${i + 1}`,
      q: f.q,
      a: f.a,
    })),
  });
}

function read(): Content {
  const raw = storage.get<Content>(CONTENT_STORAGE_KEY);
  if (raw == null) {
    const seeded = seedContent();
    storage.set(CONTENT_STORAGE_KEY, seeded);
    return seeded;
  }
  // Re-parseamos para validar shape (descarta basura corrupta).
  try {
    return ContentSchema.parse(raw);
  } catch {
    const seeded = seedContent();
    storage.set(CONTENT_STORAGE_KEY, seeded);
    return seeded;
  }
}

function write(next: Content): Content {
  const validated = ContentSchema.parse(next);
  storage.set(CONTENT_STORAGE_KEY, validated);
  return validated;
}

export class MockContentRepo implements ContentRepository {
  async get(): Promise<Content> {
    return read();
  }

  async updateHomeHero(hero: HomeHero): Promise<Content> {
    const current = read();
    return write({ ...current, homeHero: hero });
  }

  async setFeaturedSlugs(slugs: string[]): Promise<Content> {
    const current = read();
    return write({ ...current, featuredSlugs: [...slugs] });
  }

  async addBanner(banner: NewBannerInput): Promise<Content> {
    const current = read();
    const next: Banner = { ...banner, id: newId() };
    return write({ ...current, banners: [...current.banners, next] });
  }

  async removeBanner(id: string): Promise<Content> {
    const current = read();
    return write({
      ...current,
      banners: current.banners.filter((b) => b.id !== id),
    });
  }

  async updateBanner(banner: Banner): Promise<Content> {
    const current = read();
    return write({
      ...current,
      banners: current.banners.map((b) => (b.id === banner.id ? banner : b)),
    });
  }

  async addFaq(faq: NewFaqInput): Promise<Content> {
    const current = read();
    const next: FaqItem = { ...faq, id: newId() };
    return write({ ...current, faq: [...current.faq, next] });
  }

  async removeFaq(id: string): Promise<Content> {
    const current = read();
    return write({
      ...current,
      faq: current.faq.filter((f) => f.id !== id),
    });
  }

  async updateFaq(faq: FaqItem): Promise<Content> {
    const current = read();
    return write({
      ...current,
      faq: current.faq.map((f) => (f.id === faq.id ? faq : f)),
    });
  }
}
