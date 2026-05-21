import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewsModerationPanel } from "./ReviewsModerationPanel";
import type { Review } from "@/src/features/reviews";

const reviews: Review[] = [
  {
    id: "p1",
    productSlug: "producto-pending",
    authorName: "Pedro",
    rating: 5,
    title: "Pendiente uno",
    text: "Texto del review pendiente uno.",
    recommends: true,
    status: "pending",
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "a1",
    productSlug: "producto-approved",
    authorName: "Ana",
    rating: 4,
    title: "Aprobado uno",
    text: "Texto del review aprobado uno.",
    recommends: true,
    status: "approved",
    createdAt: "2026-05-11T10:00:00Z",
    updatedAt: "2026-05-11T10:00:00Z",
  },
  {
    id: "x1",
    productSlug: "producto-rejected",
    authorName: "Xime",
    rating: 1,
    title: "Rechazado uno",
    text: "Texto del review rechazado uno.",
    recommends: false,
    status: "rejected",
    createdAt: "2026-05-12T10:00:00Z",
    updatedAt: "2026-05-12T10:00:00Z",
  },
];

describe("ReviewsModerationPanel", () => {
  it("renderiza tabs Pendientes / Aprobadas / Rechazadas y por defecto muestra los pendientes", () => {
    render(<ReviewsModerationPanel reviews={reviews} />);

    expect(screen.getByRole("tab", { name: /pendientes/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /aprobadas/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /rechazadas/i })).toBeInTheDocument();

    expect(screen.getByText("Pendiente uno")).toBeInTheDocument();
    expect(screen.queryByText("Aprobado uno")).not.toBeInTheDocument();
    expect(screen.queryByText("Rechazado uno")).not.toBeInTheDocument();
  });

  it("al cambiar de tab muestra los reviews correspondientes", async () => {
    const user = userEvent.setup();
    render(<ReviewsModerationPanel reviews={reviews} />);

    await user.click(screen.getByRole("tab", { name: /aprobadas/i }));
    expect(screen.getByText("Aprobado uno")).toBeInTheDocument();
    expect(screen.queryByText("Pendiente uno")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /rechazadas/i }));
    expect(screen.getByText("Rechazado uno")).toBeInTheDocument();
    expect(screen.queryByText("Aprobado uno")).not.toBeInTheDocument();
  });

  it("muestra EmptyState cuando una tab no tiene reviews", async () => {
    const user = userEvent.setup();
    render(<ReviewsModerationPanel reviews={[reviews[0]]} />);

    await user.click(screen.getByRole("tab", { name: /aprobadas/i }));
    expect(screen.getByText(/sin reviews/i)).toBeInTheDocument();
  });

  it("propaga callbacks (Aprobar dispara onApprove con el id correcto)", async () => {
    const onApprove = vi.fn();
    const user = userEvent.setup();
    render(
      <ReviewsModerationPanel reviews={reviews} onApprove={onApprove} />,
    );

    const card = screen.getByText("Pendiente uno").closest("article");
    expect(card).not.toBeNull();
    await user.click(
      within(card as HTMLElement).getByRole("button", { name: /aprobar/i }),
    );
    expect(onApprove).toHaveBeenCalledWith("p1");
  });
});
