import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WishlistButton } from "./WishlistButton";
import { useWishlist } from "@/src/features/wishlist";

beforeEach(() => {
  useWishlist.getState().clear();
});

describe("WishlistButton", () => {
  it("arranca con aria-pressed=false", () => {
    render(<WishlistButton slug="agua-1l" />);
    expect(
      screen.getByRole("button", { name: /agregar a favoritos/i }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("toggle agrega y cambia el aria-label", async () => {
    const user = userEvent.setup();
    render(<WishlistButton slug="agua-1l" />);
    await user.click(
      screen.getByRole("button", { name: /agregar a favoritos/i }),
    );
    expect(
      screen.getByRole("button", { name: /quitar de favoritos/i }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(useWishlist.getState().contains("agua-1l")).toBe(true);
  });

  it("doble click quita el item", async () => {
    const user = userEvent.setup();
    render(<WishlistButton slug="agua-1l" />);
    const btn = screen.getByRole("button");
    await user.click(btn);
    await user.click(btn);
    expect(useWishlist.getState().contains("agua-1l")).toBe(false);
  });
});
