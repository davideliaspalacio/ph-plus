import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductsTable } from "./ProductsTable";
import type { Product } from "@/app/lib/products";

const sample = (overrides: Partial<Product> = {}): Product =>
  ({
    slug: "p1",
    visualKey: "garrafas",
    title: "Producto 1",
    shortTitle: "P1",
    price: "$10.000",
    priceValue: 10000,
    tagline: "",
    description: "",
    longDescription: [],
    features: [],
    includes: [],
    category: "botellon",
    size: "1L",
    popularity: 50,
    inStock: true,
    gallery: [],
    specs: [],
    usage: [],
    reviews: [],
    rating: { average: 0, count: 0 },
    ...overrides,
  }) as Product;

describe("ProductsTable", () => {
  it("renderiza una fila por producto con título, slug y precio", () => {
    const products = [
      sample({ slug: "p1", title: "Producto 1", priceValue: 10000 }),
      sample({ slug: "p2", title: "Producto 2", priceValue: 20000 }),
    ];
    render(<ProductsTable products={products} />);
    expect(screen.getByText("Producto 1")).toBeInTheDocument();
    expect(screen.getByText("Producto 2")).toBeInTheDocument();
    expect(screen.getByText("p1")).toBeInTheDocument();
    expect(screen.getByText("$10.000")).toBeInTheDocument();
  });

  it("muestra badge Inactivo cuando inStock=false", () => {
    render(
      <ProductsTable
        products={[sample({ slug: "p1", inStock: false })]}
      />,
    );
    expect(screen.getByText(/inactivo/i)).toBeInTheDocument();
  });

  it("dispara onEdit al click en Editar de una fila", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    const p = sample({ slug: "p1", title: "Producto 1" });
    render(<ProductsTable products={[p]} onEdit={onEdit} />);
    const row = screen.getByTestId("product-row-p1");
    await user.click(within(row).getByRole("button", { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(p);
  });

  it("dispara onArchive al click en Archivar de una fila", async () => {
    const onArchive = vi.fn();
    const user = userEvent.setup();
    const p = sample({ slug: "p1" });
    render(<ProductsTable products={[p]} onArchive={onArchive} />);
    const row = screen.getByTestId("product-row-p1");
    await user.click(within(row).getByRole("button", { name: /archivar/i }));
    expect(onArchive).toHaveBeenCalledWith(p);
  });

  it("select-all marca todas las filas y bulk Publicar llama con todos los slugs", async () => {
    const onBulkUpdate = vi.fn();
    const user = userEvent.setup();
    const products = [
      sample({ slug: "p1" }),
      sample({ slug: "p2" }),
      sample({ slug: "p3" }),
    ];
    render(
      <ProductsTable products={products} onBulkUpdate={onBulkUpdate} />,
    );
    await user.click(
      screen.getByRole("checkbox", { name: /seleccionar todos/i }),
    );
    const bar = screen.getByTestId("bulk-actions-bar");
    await user.click(within(bar).getByRole("button", { name: /^publicar$/i }));
    expect(onBulkUpdate).toHaveBeenCalledWith(
      ["p1", "p2", "p3"],
      { inStock: true },
    );
  });

  it("checkbox individual selecciona una fila y bulk Despublicar llama solo con su slug", async () => {
    const onBulkUpdate = vi.fn();
    const user = userEvent.setup();
    const products = [
      sample({ slug: "p1", title: "Producto 1" }),
      sample({ slug: "p2", title: "Producto 2" }),
    ];
    render(
      <ProductsTable products={products} onBulkUpdate={onBulkUpdate} />,
    );
    await user.click(
      screen.getByRole("checkbox", { name: /seleccionar producto 2/i }),
    );
    const bar = screen.getByTestId("bulk-actions-bar");
    await user.click(within(bar).getByRole("button", { name: /despublicar/i }));
    expect(onBulkUpdate).toHaveBeenCalledWith(["p2"], { inStock: false });
  });

  it("bulk Publicar está deshabilitado cuando no hay selección", () => {
    render(<ProductsTable products={[sample({ slug: "p1" })]} />);
    const bar = screen.getByTestId("bulk-actions-bar");
    const publicar = within(bar).getByRole("button", { name: /^publicar$/i });
    expect(publicar).toBeDisabled();
  });

  it("renderiza estado vacío cuando no hay productos", () => {
    render(<ProductsTable products={[]} />);
    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument();
  });
});
