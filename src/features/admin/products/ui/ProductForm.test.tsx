import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "./ProductForm";
import type { Product } from "@/app/lib/products";

const existing: Product = {
  slug: "botellon-19l",
  visualKey: "garrafas",
  title: "Botellón 19L",
  shortTitle: "Botellón 19L",
  price: "$36.000",
  priceValue: 36000,
  tagline: "Hidrátate",
  description: "Agua alcalina",
  longDescription: [],
  features: [],
  includes: [],
  category: "botellon",
  size: "19L",
  popularity: 70,
  inStock: true,
  gallery: [],
  specs: [],
  usage: [],
  reviews: [],
  rating: { average: 0, count: 0 },
};

describe("ProductForm", () => {
  it("muestra Tabs: General, Precio, Imágenes, Stock, SEO", () => {
    render(
      <ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );
    expect(screen.getByRole("tab", { name: /general/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /precio/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /imágenes/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /stock/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /seo/i })).toBeInTheDocument();
  });

  it("precarga los valores del producto cuando se pasa en `product`", () => {
    render(
      <ProductForm
        product={existing}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const slug = screen.getByLabelText(/slug/i) as HTMLInputElement;
    expect(slug.value).toBe("botellon-19l");
    const title = screen.getByLabelText(/^título \*/i) as HTMLInputElement;
    expect(title.value).toBe("Botellón 19L");
  });

  it("onCancel se dispara al click en Cancelar", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it("submit con valores válidos llama a onSubmit con datos normalizados", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await user.type(screen.getByLabelText(/slug/i), "Botellón Nuevo!");
    await user.type(screen.getByLabelText(/^título \*/i), "Botellón Nuevo");
    await user.type(screen.getByLabelText(/título corto/i), "B Nuevo");
    await user.type(screen.getByLabelText(/tagline/i), "Hidrátate");
    await user.type(screen.getByLabelText(/descripción \*/i), "Agua alcalina");

    await user.click(screen.getByRole("button", { name: /crear producto/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const values = onSubmit.mock.calls[0][0];
    expect(values.slug).toBe("botellon-nuevo");
    expect(values.title).toBe("Botellón Nuevo");
    expect(values.priceValue).toBe(0);
  });

  it("muestra error si title < 3 caracteres al hacer submit", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<ProductForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await user.type(screen.getByLabelText(/slug/i), "slug-ok");
    await user.type(screen.getByLabelText(/^título \*/i), "ab");
    await user.type(screen.getByLabelText(/título corto/i), "ab");
    await user.type(screen.getByLabelText(/tagline/i), "ta");
    await user.type(screen.getByLabelText(/descripción \*/i), "desc");
    await user.click(screen.getByRole("button", { name: /crear producto/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/mínimo 3/i)).toBeInTheDocument();
  });
});
