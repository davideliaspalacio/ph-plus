import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renderiza con clase shimmer", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("skeleton");
  });

  it("respeta width y height inline", () => {
    const { container } = render(<Skeleton width="100px" height="20px" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.width).toBe("100px");
    expect(el.style.height).toBe("20px");
  });

  it("variante circle aplica rounded-full", () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });
});
