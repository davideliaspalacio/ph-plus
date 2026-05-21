import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductInfo } from "./ProductInfo";
import { useCart } from "@/src/features/cart/store/useCart";
import type { Product } from "@/app/lib/products";

const product = {
  slug: "agua-19l",
  title: "Botellón 19L Premium",
  shortTitle: "Botellón 19L",
  priceValue: 36_000,
  prevPriceValue: 42_000,
  tagline: "Hidratación premium para la familia",
  category: "botellon",
  size: "19L",
  popularity: 9,
  inStock: true,
  visualKey: "garrafas",
  description: "Descripción detallada",
  longDescription: ["Detalle uno", "Detalle dos"],
  features: ["pH 9.0", "Origen Cundinamarca"],
  includes: ["Botellón", "Tapa"],
  gallery: [],
  specs: [],
  usage: [],
  reviews: [],
  rating: { average: 4.7, count: 22 },
} as unknown as Product;

beforeEach(() => {
  useCart.setState({ items: [] });
});

describe("ProductInfo", () => {
  it("renderiza nombre, rating y precio", () => {
    render(<ProductInfo product={product} />);
    expect(
      screen.getByRole("heading", { name: "Botellón 19L Premium" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/4\.7/)).toBeInTheDocument();
    expect(screen.getByText(/22/)).toBeInTheDocument();
  });

  it("qty stepper aumenta y disminuye, mínimo 1", async () => {
    const user = userEvent.setup();
    render(<ProductInfo product={product} />);
    const qty = screen.getByTestId("qty-value");
    expect(qty.textContent).toBe("1");
    await user.click(screen.getByRole("button", { name: /aumentar/i }));
    await user.click(screen.getByRole("button", { name: /aumentar/i }));
    expect(qty.textContent).toBe("3");
    await user.click(screen.getByRole("button", { name: /disminuir/i }));
    expect(qty.textContent).toBe("2");
    // no baja de 1
    await user.click(screen.getByRole("button", { name: /disminuir/i }));
    await user.click(screen.getByRole("button", { name: /disminuir/i }));
    expect(qty.textContent).toBe("1");
  });

  it("Añadir agrega al carrito con la cantidad seleccionada", async () => {
    const user = userEvent.setup();
    render(<ProductInfo product={product} />);
    await user.click(screen.getByRole("button", { name: /aumentar/i }));
    await user.click(screen.getByRole("button", { name: /aumentar/i }));
    await user.click(screen.getByTestId("add-to-cart"));
    const items = useCart.getState().items;
    expect(items).toEqual([{ slug: "agua-19l", quantity: 3 }]);
  });

  it("cuando inStock=false muestra bloque 'Notifícame cuando llegue'", async () => {
    const user = userEvent.setup();
    render(<ProductInfo product={{ ...product, inStock: false }} />);
    expect(screen.queryByRole("button", { name: /añadir/i })).not.toBeInTheDocument();
    const email = screen.getByLabelText(/email|correo/i);
    await user.type(email, "test@example.com");
    await user.click(screen.getByRole("button", { name: /avísame|notif/i }));
    expect(screen.getByText(/te avisaremos a test@example\.com/i)).toBeInTheDocument();
  });

  it("onAdd se llama si se provee como prop (en lugar del store)", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<ProductInfo product={product} onAdd={onAdd} />);
    await user.click(screen.getByTestId("add-to-cart"));
    expect(onAdd).toHaveBeenCalledWith(product, 1);
  });
});
