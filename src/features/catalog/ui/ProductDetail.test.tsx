import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDetail } from "./ProductDetail";
import { useCart } from "@/src/features/cart/store/useCart";
import type { Product } from "@/app/lib/products";

const product = {
  slug: "agua-19l",
  title: "Botellón 19L Premium",
  shortTitle: "Botellón 19L",
  priceValue: 36_000,
  price: "$ 36.000",
  prevPriceValue: 42_000,
  prevPrice: "$ 42.000",
  tagline: "Hidratación premium",
  category: "botellon",
  size: "19L",
  popularity: 9,
  inStock: true,
  visualKey: "garrafas",
  description: "Descripción corta",
  longDescription: ["Parrafo uno", "Parrafo dos"],
  features: ["pH 9", "Origen"],
  includes: ["Botellón"],
  gallery: [
    { src: "/products/agua-19l.png", alt: "Frontal" },
    { src: "/products/agua-19l-2.png", alt: "Lateral" },
  ],
  specs: [
    { label: "pH", value: "9.0" },
    { label: "Tamaño", value: "19L" },
  ],
  usage: ["Conservar fresco"],
  reviews: [],
  rating: { average: 4.7, count: 22 },
  shipping: "Envío a domicilio en 24h",
} as unknown as Product;

beforeEach(() => {
  useCart.setState({ items: [] });
});

describe("ProductDetail", () => {
  it("renderiza nombre, precio y galería principal", () => {
    render(<ProductDetail product={product} />);
    expect(
      screen.getByRole("heading", { name: "Botellón 19L Premium" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("product-price")).toHaveTextContent("$ 36.000");
    expect(screen.getByTestId("gallery-main-image")).toBeInTheDocument();
  });

  it("agregar al carrito con cantidad > 1 funciona", async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={product} />);
    await user.click(screen.getByRole("button", { name: /aumentar/i }));
    await user.click(screen.getByTestId("add-to-cart"));
    expect(useCart.getState().items).toEqual([
      { slug: "agua-19l", quantity: 2 },
    ]);
  });

  it("cambiar tab cambia el contenido visible (Specs muestra labels)", async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={product} />);
    // Por defecto, descripción visible
    expect(screen.getByText("Parrafo uno")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /specs/i }));
    expect(screen.getByText("pH")).toBeInTheDocument();
    expect(screen.getByText("9.0")).toBeInTheDocument();
  });

  it("tab Reseñas muestra rating y placeholder de inicio de sesión", async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={product} />);
    await user.click(screen.getByRole("tab", { name: /reseñas/i }));
    expect(screen.getByText(/basado en 22 reseñas/i)).toBeInTheDocument();
    expect(screen.getByText(/inicia sesión para escribir/i)).toBeInTheDocument();
  });
});
