import { describe, expect, it } from "vitest";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
  buildCartSummary,
  type CartItemInput,
  type ProductLike,
} from "./pricing";

const p = (slug: string, price: number): ProductLike => ({
  slug,
  priceValue: price,
});

const catalog: ProductLike[] = [
  p("agua-1l", 5_000),
  p("agua-5l", 18_000),
  p("botellon-19l", 36_000),
  p("kit-dispensador", 280_000),
];

const findBySlug = (slug: string) => catalog.find((c) => c.slug === slug);

describe("buildCartSummary", () => {
  it("devuelve un carrito vacío con totales en cero cuando no hay items", () => {
    const result = buildCartSummary([], findBySlug);
    expect(result.lines).toEqual([]);
    expect(result.subtotal).toBe(0);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(0);
    expect(result.qualifiesForFreeShipping).toBe(false);
    expect(result.freeShippingThreshold).toBe(FREE_SHIPPING_THRESHOLD);
  });

  it("calcula el subtotal multiplicando precio por cantidad", () => {
    const items: CartItemInput[] = [
      { slug: "agua-1l", quantity: 2 }, // 10.000
      { slug: "agua-5l", quantity: 1 }, // 18.000
    ];
    const result = buildCartSummary(items, findBySlug);
    expect(result.subtotal).toBe(28_000);
    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].lineTotal).toBe(10_000);
    expect(result.lines[1].lineTotal).toBe(18_000);
  });

  it("aplica el costo de envío flat cuando el subtotal está por debajo del umbral", () => {
    const items: CartItemInput[] = [{ slug: "agua-1l", quantity: 1 }];
    const result = buildCartSummary(items, findBySlug);
    expect(result.subtotal).toBe(5_000);
    expect(result.shipping).toBe(SHIPPING_FLAT);
    expect(result.total).toBe(5_000 + SHIPPING_FLAT);
    expect(result.qualifiesForFreeShipping).toBe(false);
  });

  it("regala envío cuando el subtotal alcanza exactamente el umbral", () => {
    // necesitamos exactamente 120.000 -> 6 x agua-5l = 108.000 + 12.000 (3 x agua-1l) no es exacto.
    // Construimos un caso exacto: priceValue forzado.
    const exactCatalog = [{ slug: "x", priceValue: FREE_SHIPPING_THRESHOLD }];
    const result = buildCartSummary(
      [{ slug: "x", quantity: 1 }],
      (s) => exactCatalog.find((c) => c.slug === s),
    );
    expect(result.qualifiesForFreeShipping).toBe(true);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(FREE_SHIPPING_THRESHOLD);
  });

  it("regala envío cuando el subtotal supera el umbral", () => {
    const items: CartItemInput[] = [{ slug: "kit-dispensador", quantity: 1 }];
    const result = buildCartSummary(items, findBySlug);
    expect(result.subtotal).toBe(280_000);
    expect(result.shipping).toBe(0);
    expect(result.qualifiesForFreeShipping).toBe(true);
    expect(result.total).toBe(280_000);
  });

  it("ignora silenciosamente items cuyo producto no existe en el catálogo", () => {
    const items: CartItemInput[] = [
      { slug: "agua-1l", quantity: 1 },
      { slug: "producto-fantasma", quantity: 99 },
    ];
    const result = buildCartSummary(items, findBySlug);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].product.slug).toBe("agua-1l");
    expect(result.subtotal).toBe(5_000);
  });

  it("expone freeShippingThreshold y la distancia restante a envío gratis", () => {
    const items: CartItemInput[] = [{ slug: "agua-5l", quantity: 1 }];
    const result = buildCartSummary(items, findBySlug);
    expect(result.freeShippingThreshold).toBe(FREE_SHIPPING_THRESHOLD);
    expect(result.amountToFreeShipping).toBe(FREE_SHIPPING_THRESHOLD - 18_000);
  });

  it("amountToFreeShipping es 0 cuando ya califica", () => {
    const items: CartItemInput[] = [{ slug: "kit-dispensador", quantity: 1 }];
    const result = buildCartSummary(items, findBySlug);
    expect(result.amountToFreeShipping).toBe(0);
  });

  it("no cobra envío cuando el carrito está vacío", () => {
    const result = buildCartSummary([], findBySlug);
    expect(result.shipping).toBe(0);
  });

  it("trata cantidades <= 0 como 0 y las descarta", () => {
    const items: CartItemInput[] = [
      { slug: "agua-1l", quantity: 0 },
      { slug: "agua-5l", quantity: -3 },
      { slug: "botellon-19l", quantity: 2 },
    ];
    const result = buildCartSummary(items, findBySlug);
    expect(result.lines).toHaveLength(1);
    expect(result.lines[0].lineTotal).toBe(72_000);
    expect(result.subtotal).toBe(72_000);
  });

  it("contabiliza correctamente totalItems sumando cantidades de líneas válidas", () => {
    const items: CartItemInput[] = [
      { slug: "agua-1l", quantity: 3 },
      { slug: "agua-5l", quantity: 2 },
      { slug: "fantasma", quantity: 50 },
    ];
    const result = buildCartSummary(items, findBySlug);
    expect(result.totalItems).toBe(5);
  });
});
