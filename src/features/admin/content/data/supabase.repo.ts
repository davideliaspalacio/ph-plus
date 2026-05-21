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
 * Implementación Supabase del ContentRepository.
 *
 * Tabla `content` con id='main' (single doc). Para listas embebidas (banners,
 * faq), el patrón es read → mutate → write.
 *
 * Conversiones snake↔camel: `home_hero` ↔ `homeHero`, `featured_slugs` ↔
 * `featuredSlugs`. El resto (`banners`, `faq`) coincide.
 */

const CONTENT_ID = "main";

async function getClient() {
  if (typeof window === "undefined") {
    const { createSupabaseServerClient } = await import(
      "@/src/shared/supabase/server"
    );
    return createSupabaseServerClient();
  }
  const { createSupabaseBrowserClient } = await import(
    "@/src/shared/supabase/client"
  );
  return createSupabaseBrowserClient();
}

type ContentRow = {
  id: string;
  home_hero: unknown;
  featured_slugs: unknown;
  banners: unknown;
  faq: unknown;
};

function seedContent(): Content {
  return ContentSchema.parse({
    homeHero: { ...CONTENT_SEED.homeHero },
    featuredSlugs: [...CONTENT_SEED.featuredSlugs],
    banners: CONTENT_SEED.banners.map((b) => ({ ...b })),
    faq: CONTENT_SEED.faq.map((f, i) => ({
      id: `faq_seed_${i + 1}`,
      q: f.q,
      a: f.a,
    })),
  });
}

function mapRow(row: ContentRow): Content {
  return ContentSchema.parse({
    homeHero: row.home_hero,
    featuredSlugs: row.featured_slugs,
    banners: row.banners,
    faq: row.faq,
  });
}

async function readOrInit(): Promise<Content> {
  const client = await getClient();
  const { data, error } = await client
    .from("content")
    .select("*")
    .eq("id", CONTENT_ID)
    .maybeSingle();
  if (error) throw new Error(`content.get: ${error.message}`);
  if (data) {
    return mapRow(data as unknown as ContentRow);
  }
  // Row doesn't exist → insert seed
  const seeded = seedContent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contentTable = client.from("content") as any;
  const { error: insertError } = await contentTable.insert({
    id: CONTENT_ID,
    home_hero: seeded.homeHero,
    featured_slugs: seeded.featuredSlugs,
    banners: seeded.banners,
    faq: seeded.faq,
  });
  if (insertError) {
    // If insertion failed (e.g. due to race / RLS), still return seed shape.
    // The next read will reconcile.
    return seeded;
  }
  return seeded;
}

async function writeContent(next: Content): Promise<Content> {
  const validated = ContentSchema.parse(next);
  const client = await getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = client.from("content") as any;
  const { data, error } = await table
    .update({
      home_hero: validated.homeHero,
      featured_slugs: validated.featuredSlugs,
      banners: validated.banners,
      faq: validated.faq,
    })
    .eq("id", CONTENT_ID)
    .select("*")
    .single();
  if (error) throw new Error(`content.update: ${error.message}`);
  return mapRow(data as unknown as ContentRow);
}

export class SupabaseContentRepo implements ContentRepository {
  async get(): Promise<Content> {
    return readOrInit();
  }

  async updateHomeHero(hero: HomeHero): Promise<Content> {
    const current = await readOrInit();
    return writeContent({ ...current, homeHero: hero });
  }

  async setFeaturedSlugs(slugs: string[]): Promise<Content> {
    const current = await readOrInit();
    return writeContent({ ...current, featuredSlugs: [...slugs] });
  }

  async addBanner(banner: NewBannerInput): Promise<Content> {
    const current = await readOrInit();
    const next: Banner = { ...banner, id: newId() };
    return writeContent({ ...current, banners: [...current.banners, next] });
  }

  async removeBanner(id: string): Promise<Content> {
    const current = await readOrInit();
    return writeContent({
      ...current,
      banners: current.banners.filter((b) => b.id !== id),
    });
  }

  async updateBanner(banner: Banner): Promise<Content> {
    const current = await readOrInit();
    return writeContent({
      ...current,
      banners: current.banners.map((b) => (b.id === banner.id ? banner : b)),
    });
  }

  async addFaq(faq: NewFaqInput): Promise<Content> {
    const current = await readOrInit();
    const next: FaqItem = { ...faq, id: newId() };
    return writeContent({ ...current, faq: [...current.faq, next] });
  }

  async removeFaq(id: string): Promise<Content> {
    const current = await readOrInit();
    return writeContent({
      ...current,
      faq: current.faq.filter((f) => f.id !== id),
    });
  }

  async updateFaq(faq: FaqItem): Promise<Content> {
    const current = await readOrInit();
    return writeContent({
      ...current,
      faq: current.faq.map((f) => (f.id === faq.id ? faq : f)),
    });
  }
}
