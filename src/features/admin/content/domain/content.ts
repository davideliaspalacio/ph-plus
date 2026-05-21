import { z } from "zod";

/**
 * Schemas del dominio de contenido editable de storefront (FUNCTIONAL-SPEC §24).
 *
 * Representa lo que se administra desde `/admin/contenido/*`:
 * hero del home, slugs de productos destacados, banners y FAQ.
 */

export const HomeHeroSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
});

export type HomeHero = z.infer<typeof HomeHeroSchema>;

export const BannerSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  image: z.string().min(1),
  href: z.string().min(1),
});

export type Banner = z.infer<typeof BannerSchema>;

export const FaqItemSchema = z.object({
  id: z.string().min(1),
  q: z.string().min(1),
  a: z.string().min(1),
});

export type FaqItem = z.infer<typeof FaqItemSchema>;

export const ContentSchema = z.object({
  homeHero: HomeHeroSchema,
  featuredSlugs: z.array(z.string().min(1)),
  banners: z.array(BannerSchema),
  faq: z.array(FaqItemSchema),
});

export type Content = z.infer<typeof ContentSchema>;
