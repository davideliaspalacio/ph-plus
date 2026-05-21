import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renderiza children como contenido accesible", () => {
    render(<Button>Comprar</Button>);
    expect(
      screen.getByRole("button", { name: "Comprar" }),
    ).toBeInTheDocument();
  });

  it("dispara onClick al hacer click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("se deshabilita correctamente", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        x
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("muestra estado loading con aria-busy y deshabilita click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button isLoading onClick={onClick}>
        Pagar
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("aplica clases distintas por variante", () => {
    const { rerender } = render(<Button variant="primary">A</Button>);
    const primary = screen.getByRole("button").className;
    rerender(<Button variant="outline">A</Button>);
    expect(screen.getByRole("button").className).not.toBe(primary);
  });

  it("acepta className y la mergea con tailwind-merge", () => {
    render(<Button className="px-12">A</Button>);
    expect(screen.getByRole("button").className).toContain("px-12");
  });

  it("forward refs al <button> nativo", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>x</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renderiza tamaños sm/md/lg con altura distinta (clases distintas)", () => {
    const { rerender } = render(<Button size="sm">x</Button>);
    const sm = screen.getByRole("button").className;
    rerender(<Button size="lg">x</Button>);
    expect(screen.getByRole("button").className).not.toBe(sm);
  });
});
