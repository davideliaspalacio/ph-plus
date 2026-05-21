import { describe, expect, it } from "vitest";
import {
  BannerSchema,
  ContentSchema,
  FaqItemSchema,
  HomeHeroSchema,
} from "./content";

describe("HomeHeroSchema", () => {
  it("acepta un hero válido", () => {
    const hero = HomeHeroSchema.parse({
      title: "Hidratación alcalina",
      subtitle: "Agua PH 9",
      ctaLabel: "Comprar",
      ctaHref: "/productos",
    });
    expect(hero.title).toBe("Hidratación alcalina");
  });

  it("rechaza title vacío", () => {
    expect(() =>
      HomeHeroSchema.parse({
        title: "",
        subtitle: "x",
        ctaLabel: "x",
        ctaHref: "/x",
      }),
    ).toThrow();
  });
});

describe("BannerSchema", () => {
  it("acepta un banner válido", () => {
    const banner = BannerSchema.parse({
      id: "ban_1",
      title: "Promo",
      image: "/banners/promo.svg",
      href: "/productos/promo",
    });
    expect(banner.id).toBe("ban_1");
  });

  it("rechaza banner sin id", () => {
    expect(() =>
      BannerSchema.parse({
        id: "",
        title: "Promo",
        image: "/x.svg",
        href: "/x",
      }),
    ).toThrow();
  });
});

describe("FaqItemSchema", () => {
  it("acepta una entry válida", () => {
    const item = FaqItemSchema.parse({
      id: "faq_1",
      q: "¿Qué es?",
      a: "Es agua alcalina.",
    });
    expect(item.q).toBe("¿Qué es?");
  });
});

describe("ContentSchema", () => {
  it("acepta un content completo", () => {
    const content = ContentSchema.parse({
      homeHero: {
        title: "T",
        subtitle: "S",
        ctaLabel: "C",
        ctaHref: "/",
      },
      featuredSlugs: ["a", "b"],
      banners: [
        { id: "b1", title: "B1", image: "/i.svg", href: "/h" },
      ],
      faq: [{ id: "f1", q: "Q?", a: "A." }],
    });
    expect(content.featuredSlugs).toEqual(["a", "b"]);
    expect(content.banners).toHaveLength(1);
    expect(content.faq).toHaveLength(1);
  });
});
