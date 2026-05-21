import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGalleryFeature, type GalleryItem } from "./ProductGalleryFeature";

const images: GalleryItem[] = [
  { src: "/products/agua-19l.png", alt: "Botellón 19L vista frontal" },
  { src: "/products/agua-19l-2.png", alt: "Botellón 19L vista lateral" },
  { src: "/products/agua-19l-3.png", alt: "Botellón 19L en uso" },
  { src: "/products/agua-19l-4.png", alt: "Botellón 19L tapa" },
];

describe("ProductGalleryFeature", () => {
  it("renderiza la imagen principal (primer item por defecto)", () => {
    render(<ProductGalleryFeature images={images} />);
    const main = screen.getByTestId("gallery-main-image") as HTMLImageElement;
    expect(main.getAttribute("src")).toBe(images[0].src);
  });

  it("click en un thumbnail cambia la imagen principal", async () => {
    const user = userEvent.setup();
    render(<ProductGalleryFeature images={images} />);
    const thumbs = screen.getAllByRole("button", { name: /imagen/i });
    await user.click(thumbs[2]);
    const main = screen.getByTestId("gallery-main-image") as HTMLImageElement;
    expect(main.getAttribute("src")).toBe(images[2].src);
    expect(thumbs[2]).toHaveAttribute("aria-pressed", "true");
  });

  it("soporta navegación por teclado con flechas izq/der", async () => {
    const user = userEvent.setup();
    render(<ProductGalleryFeature images={images} />);
    const root = screen.getByTestId("gallery-root");
    root.focus();
    await user.keyboard("{ArrowRight}");
    const main = screen.getByTestId("gallery-main-image") as HTMLImageElement;
    expect(main.getAttribute("src")).toBe(images[1].src);
    await user.keyboard("{ArrowLeft}");
    expect(
      (screen.getByTestId("gallery-main-image") as HTMLImageElement).getAttribute(
        "src",
      ),
    ).toBe(images[0].src);
  });
});
