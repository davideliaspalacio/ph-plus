import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/app/lib/products";

const product = {
  slug: "agua-19l",
  title: "Botellón 19L Premium",
  shortTitle: "Botellón 19L",
  priceValue: 36_000,
  price: "$ 36.000",
  prevPriceValue: 42_000,
  prevPrice: "$ 42.000",
  tagline: "Hidratación premium para la familia",
  category: "botellon",
  size: "19L",
  popularity: 9,
  inStock: true,
  visualKey: "garrafas",
  description: "",
  longDescription: [],
  features: [],
  includes: [],
  gallery: [],
  specs: [],
  usage: [],
  reviews: [],
  rating: { average: 4.7, count: 22 },
} as unknown as Product;

describe("ProductCard", () => {
  it("renderiza nombre, precio y precio anterior cuando hay promo", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByRole("heading", { name: "Botellón 19L Premium" })).toBeInTheDocument();
    expect(screen.getByText("$ 36.000")).toBeInTheDocument();
    expect(screen.getByText("$ 42.000")).toBeInTheDocument();
  });

  it("muestra rating cuando viene", () => {
    render(<ProductCard product={product} />);
    expect(screen.getByText(/4\.7/)).toBeInTheDocument();
  });

  it("link al PDP correcto", () => {
    render(<ProductCard product={product} />);
    const links = screen.getAllByRole("link", {
      name: /botellón 19l premium/i,
    });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((l) =>
      expect(l).toHaveAttribute("href", "/productos/agua-19l"),
    );
  });

  it("muestra badge 'AGOTADO' cuando inStock=false", () => {
    render(<ProductCard product={{ ...product, inStock: false }} />);
    expect(screen.getByText(/agotado/i)).toBeInTheDocument();
  });

  it("dispara onAdd cuando se hace click en el botón Añadir", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<ProductCard product={product} onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: /añadir/i }));
    expect(onAdd).toHaveBeenCalledWith(product);
  });

  it("no muestra Añadir cuando inStock=false", () => {
    render(<ProductCard product={{ ...product, inStock: false }} onAdd={() => {}} />);
    expect(
      screen.queryByRole("button", { name: /añadir/i }),
    ).not.toBeInTheDocument();
  });
});
