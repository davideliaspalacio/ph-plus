import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentEditor } from "./ContentEditor";
import type { Content } from "../domain/content";

const baseContent: Content = {
  homeHero: {
    title: "Hero Title",
    subtitle: "Hero Sub",
    ctaLabel: "Comprar",
    ctaHref: "/productos",
  },
  featuredSlugs: ["uno", "dos"],
  banners: [
    {
      id: "ban_1",
      title: "Banner 1",
      image: "/b1.svg",
      href: "/h1",
    },
  ],
  faq: [{ id: "faq_1", q: "¿Pregunta?", a: "Respuesta." }],
};

describe("ContentEditor", () => {
  it("renderiza las 4 secciones (Hero, Destacados, Banners, FAQ) con los valores iniciales", () => {
    render(<ContentEditor initial={baseContent} onSave={vi.fn()} />);
    expect(screen.getByDisplayValue("Hero Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hero Sub")).toBeInTheDocument();
    // Slugs destacados: textarea con líneas
    expect(screen.getByLabelText(/slugs destacados/i)).toHaveValue(
      "uno\ndos",
    );
    // Banner inicial visible
    expect(screen.getByDisplayValue("Banner 1")).toBeInTheDocument();
    // FAQ inicial visible
    expect(screen.getByDisplayValue("¿Pregunta?")).toBeInTheDocument();
  });

  it("editar el hero y guardar llama onSave con el hero actualizado", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ContentEditor initial={baseContent} onSave={onSave} />);
    const titleInput = screen.getByLabelText(/título del hero/i);
    await user.clear(titleInput);
    await user.type(titleInput, "Nuevo título");
    await user.click(screen.getByRole("button", { name: /guardar/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
    const payload = onSave.mock.calls[0][0] as Content;
    expect(payload.homeHero.title).toBe("Nuevo título");
  });

  it("agregar un banner muestra una nueva fila editable", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ContentEditor initial={baseContent} onSave={onSave} />);
    await user.click(
      screen.getByRole("button", { name: /agregar banner/i }),
    );
    await user.click(screen.getByRole("button", { name: /guardar/i }));
    const payload = onSave.mock.calls[0][0] as Content;
    expect(payload.banners.length).toBe(baseContent.banners.length + 1);
  });

  it("eliminar un banner lo saca del payload guardado", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ContentEditor initial={baseContent} onSave={onSave} />);
    const bannerRow = screen.getByDisplayValue("Banner 1").closest("div[data-banner-row]");
    expect(bannerRow).not.toBeNull();
    await user.click(
      within(bannerRow as HTMLElement).getByRole("button", {
        name: /eliminar/i,
      }),
    );
    await user.click(screen.getByRole("button", { name: /guardar/i }));
    const payload = onSave.mock.calls[0][0] as Content;
    expect(payload.banners).toHaveLength(0);
  });

  it("agregar una FAQ y guardar la incluye en el payload", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ContentEditor initial={baseContent} onSave={onSave} />);
    await user.click(screen.getByRole("button", { name: /agregar faq/i }));
    await user.click(screen.getByRole("button", { name: /guardar/i }));
    const payload = onSave.mock.calls[0][0] as Content;
    expect(payload.faq.length).toBe(baseContent.faq.length + 1);
  });

  it("editar slugs destacados refleja el cambio al guardar", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<ContentEditor initial={baseContent} onSave={onSave} />);
    const ta = screen.getByLabelText(/slugs destacados/i);
    await user.clear(ta);
    await user.type(ta, "alfa{enter}beta{enter}gamma");
    await user.click(screen.getByRole("button", { name: /guardar/i }));
    const payload = onSave.mock.calls[0][0] as Content;
    expect(payload.featuredSlugs).toEqual(["alfa", "beta", "gamma"]);
  });
});
