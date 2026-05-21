import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renderiza páginas y marca la activa", () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />);
    const current = screen.getByRole("button", { name: "Página 2" });
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("dispara onChange al cambiar de página", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={3} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Página 3" }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("deshabilita 'anterior' en la página 1", () => {
    render(<Pagination page={1} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /anterior/i })).toBeDisabled();
  });

  it("deshabilita 'siguiente' en la última página", () => {
    render(<Pagination page={3} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /siguiente/i })).toBeDisabled();
  });

  it("no renderiza nada cuando totalPages <= 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} onChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
