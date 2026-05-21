import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedProducts } from "./RelatedProducts";
import type { Product } from "@/app/lib/products";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    slug: "p",
    title: "P",
    shortTitle: "P",
    price: "$ 1.000",
    priceValue: 1000,
    tagline: "t",
    description: "",
    longDescription: [],
    features: [],
    includes: [],
    category: "botellon",
    size: "19L",
    popularity: 1,
    inStock: true,
    visualKey: "garrafas",
    gallery: [],
    specs: [],
    usage: [],
    reviews: [],
    rating: { average: 4, count: 1 },
    ...overrides,
  } as unknown as Product;
}

const current = makeProduct({ slug: "agua-19l", category: "botellon" });

const all: Product[] = [
  current,
  makeProduct({ slug: "agua-19l-promo", title: "Promo", category: "botellon" }),
  makeProduct({ slug: "garrafa-5l", title: "Garrafa 5L", category: "garrafa" }),
  makeProduct({ slug: "agua-19l-b", title: "Otro Botellón", category: "botellon" }),
  makeProduct({ slug: "agua-19l-c", title: "Tercer Botellón", category: "botellon" }),
  makeProduct({ slug: "agua-19l-d", title: "Cuarto Botellón", category: "botellon" }),
  makeProduct({ slug: "agua-19l-e", title: "Quinto Botellón", category: "botellon" }),
];

describe("RelatedProducts", () => {
  it("filtra por misma categoría y excluye el actual, máximo 4", () => {
    render(<RelatedProducts current={current} all={all} />);
    // No debe aparecer el actual
    expect(screen.queryByRole("heading", { name: /^P$/i })).not.toBeInTheDocument();
    // No aparece producto de otra categoría
    expect(screen.queryByRole("heading", { name: /garrafa 5l/i })).not.toBeInTheDocument();
    // Aparecen como máximo 4 relacionados
    const titles = ["Promo", "Otro Botellón", "Tercer Botellón", "Cuarto Botellón"];
    titles.forEach((t) =>
      expect(screen.getByRole("heading", { name: t })).toBeInTheDocument(),
    );
    expect(
      screen.queryByRole("heading", { name: /quinto botellón/i }),
    ).not.toBeInTheDocument();
  });

  it("no renderiza nada si no hay relacionados", () => {
    const { container } = render(
      <RelatedProducts
        current={current}
        all={[current, makeProduct({ slug: "g1", category: "garrafa" })]}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renderiza un heading 'Otros productos' cuando hay items", () => {
    render(<RelatedProducts current={current} all={all} />);
    expect(screen.getByRole("heading", { name: /otros productos/i })).toBeInTheDocument();
  });
});
