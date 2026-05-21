import { beforeEach, describe, expect, it } from "vitest";
import { CONTENT_STORAGE_KEY, MockContentRepo } from "./mock.repo";
import { CONTENT_SEED } from "@/src/mocks/content.seed";

beforeEach(() => {
  localStorage.clear();
});

describe("MockContentRepo", () => {
  it("get() hidrata desde CONTENT_SEED en primera lectura", async () => {
    const repo = new MockContentRepo();
    const c = await repo.get();
    expect(c.homeHero.title).toBe(CONTENT_SEED.homeHero.title);
    expect(c.featuredSlugs).toEqual(CONTENT_SEED.featuredSlugs);
    expect(c.banners).toHaveLength(CONTENT_SEED.banners.length);
    expect(c.faq).toHaveLength(CONTENT_SEED.faq.length);
    // Persiste la llave esperada.
    expect(localStorage.getItem(CONTENT_STORAGE_KEY)).not.toBeNull();
  });

  it("updateHomeHero persiste y devuelve el bundle actualizado", async () => {
    const repo = new MockContentRepo();
    const updated = await repo.updateHomeHero({
      title: "Nuevo",
      subtitle: "Sub",
      ctaLabel: "Ya",
      ctaHref: "/",
    });
    expect(updated.homeHero.title).toBe("Nuevo");
    const reread = await repo.get();
    expect(reread.homeHero.title).toBe("Nuevo");
  });

  it("setFeaturedSlugs reemplaza la lista completa", async () => {
    const repo = new MockContentRepo();
    const updated = await repo.setFeaturedSlugs(["uno", "dos"]);
    expect(updated.featuredSlugs).toEqual(["uno", "dos"]);
  });

  it("addBanner asigna un id y appendea", async () => {
    const repo = new MockContentRepo();
    const before = await repo.get();
    const updated = await repo.addBanner({
      title: "Nuevo banner",
      image: "/banners/new.svg",
      href: "/nuevo",
    });
    expect(updated.banners).toHaveLength(before.banners.length + 1);
    const last = updated.banners[updated.banners.length - 1];
    expect(last.id).toBeTruthy();
    expect(last.title).toBe("Nuevo banner");
  });

  it("removeBanner quita el banner por id", async () => {
    const repo = new MockContentRepo();
    const added = await repo.addBanner({
      title: "X",
      image: "/x.svg",
      href: "/x",
    });
    const target = added.banners[added.banners.length - 1];
    const removed = await repo.removeBanner(target.id);
    expect(removed.banners.find((b) => b.id === target.id)).toBeUndefined();
  });

  it("updateBanner edita campos sin tocar id", async () => {
    const repo = new MockContentRepo();
    const added = await repo.addBanner({
      title: "Antes",
      image: "/x.svg",
      href: "/x",
    });
    const target = added.banners[added.banners.length - 1];
    const updated = await repo.updateBanner({
      id: target.id,
      title: "Después",
      image: target.image,
      href: target.href,
    });
    const found = updated.banners.find((b) => b.id === target.id);
    expect(found?.title).toBe("Después");
  });

  it("addFaq + removeFaq + updateFaq operan sobre la lista de FAQ", async () => {
    const repo = new MockContentRepo();
    const added = await repo.addFaq({
      q: "¿Hola?",
      a: "Sí.",
    });
    const target = added.faq[added.faq.length - 1];
    expect(target.id).toBeTruthy();

    const editedRes = await repo.updateFaq({
      id: target.id,
      q: "¿Hola actualizada?",
      a: target.a,
    });
    expect(
      editedRes.faq.find((f) => f.id === target.id)?.q,
    ).toBe("¿Hola actualizada?");

    const removed = await repo.removeFaq(target.id);
    expect(removed.faq.find((f) => f.id === target.id)).toBeUndefined();
  });
});
