import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SearchBar } from "./SearchBar";
import type { ProductLike } from "@/src/features/catalog";

// Mock router globalmente: cada test puede inspeccionar push().
const pushMock = vi.fn();
vi.mock("next/navigation", async () => {
  return {
    useRouter: () => ({
      push: pushMock,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
  };
});

function p(over: Partial<ProductLike> & { slug: string; title: string }): ProductLike {
  return {
    shortTitle: over.shortTitle ?? over.title,
    priceValue: over.priceValue ?? 1000,
    category: (over.category as ProductLike["category"]) ?? "botellon",
    size: (over.size as ProductLike["size"]) ?? "1L",
    popularity: over.popularity ?? 0,
    tagline: over.tagline ?? "tagline",
    visualKey: (over.visualKey as ProductLike["visualKey"]) ?? "garrafas",
    ...over,
  };
}

const fixture: ProductLike[] = [
  p({ slug: "agua-1l", title: "Agua mineral 1L" }),
  p({ slug: "agua-5l", title: "Agua mineral 5L" }),
  p({ slug: "botellon-19l", title: "Botellón 19L" }),
  p({ slug: "kit-recargas", title: "Kit recargas" }),
];

const typeInto = (input: HTMLElement, value: string) => {
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value } });
};

describe("<SearchBar />", () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it("renderiza el input vacío sin dropdown", () => {
    render(<SearchBar products={fixture} />);
    const input = screen.getByRole("searchbox");
    expect(input).toBeInTheDocument();
    expect((input as HTMLInputElement).value).toBe("");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("no muestra dropdown si la query tiene menos de 2 caracteres", () => {
    vi.useFakeTimers();
    try {
      render(<SearchBar products={fixture} />);
      const input = screen.getByRole("searchbox");
      typeInto(input, "a");
      act(() => {
        vi.advanceTimersByTime(250);
      });
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("muestra el dropdown con resultados tras el debounce (200ms)", () => {
    vi.useFakeTimers();
    try {
      render(<SearchBar products={fixture} />);
      const input = screen.getByRole("searchbox");
      typeInto(input, "agua");

      // Antes del debounce: NO debe haber dropdown todavía
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(220);
      });

      const list = screen.getByRole("listbox");
      expect(list).toBeInTheDocument();
      expect(screen.getByText(/Agua mineral 1L/i)).toBeInTheDocument();
      expect(screen.getByText(/Agua mineral 5L/i)).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("Escape cierra el dropdown", () => {
    vi.useFakeTimers();
    try {
      render(<SearchBar products={fixture} />);
      const input = screen.getByRole("searchbox");
      typeInto(input, "agua");
      act(() => {
        vi.advanceTimersByTime(220);
      });
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      fireEvent.keyDown(input, { key: "Escape" });
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("click en un resultado navega vía router.push e invoca onSelect si se proveyó", () => {
    vi.useFakeTimers();
    try {
      const onSelect = vi.fn();
      render(<SearchBar products={fixture} onSelect={onSelect} />);
      const input = screen.getByRole("searchbox");
      typeInto(input, "agua");
      act(() => {
        vi.advanceTimersByTime(220);
      });

      const option = screen.getByText(/Agua mineral 1L/i);
      fireEvent.click(option);

      expect(pushMock).toHaveBeenCalledWith("/productos/agua-1l");
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ slug: "agua-1l" }),
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
