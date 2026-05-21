import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "@/src/features/reviews";

const baseReview: Review = {
  id: "r1",
  productSlug: "tenis-running-x",
  authorName: "Laura M.",
  rating: 4,
  title: "Muy cómodos",
  text: "Los uso para correr y son muy livianos.",
  recommends: true,
  status: "pending",
  createdAt: "2026-05-10T10:00:00Z",
  updatedAt: "2026-05-10T10:00:00Z",
};

describe("ReviewCard", () => {
  it("muestra producto, autor, rating, título y texto", () => {
    render(<ReviewCard review={baseReview} />);
    expect(screen.getByText(/tenis-running-x/i)).toBeInTheDocument();
    expect(screen.getByText(/Laura M\./)).toBeInTheDocument();
    expect(screen.getByText("Muy cómodos")).toBeInTheDocument();
    expect(
      screen.getByText(/Los uso para correr/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/rating 4/i)).toBeInTheDocument();
  });

  it("en pending muestra acciones Aprobar / Rechazar / Responder", () => {
    render(<ReviewCard review={baseReview} />);
    expect(screen.getByRole("button", { name: /aprobar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rechazar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /responder/i })).toBeInTheDocument();
  });

  it("en approved/rejected sólo muestra Responder", () => {
    const { rerender } = render(
      <ReviewCard review={{ ...baseReview, status: "approved" }} />,
    );
    expect(screen.queryByRole("button", { name: /aprobar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /rechazar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /responder/i })).toBeInTheDocument();

    rerender(<ReviewCard review={{ ...baseReview, status: "rejected" }} />);
    expect(screen.queryByRole("button", { name: /aprobar/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /rechazar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /responder/i })).toBeInTheDocument();
  });

  it("Aprobar dispara onApprove(id)", async () => {
    const onApprove = vi.fn();
    const user = userEvent.setup();
    render(<ReviewCard review={baseReview} onApprove={onApprove} />);
    await user.click(screen.getByRole("button", { name: /aprobar/i }));
    expect(onApprove).toHaveBeenCalledWith("r1");
  });

  it("Rechazar abre Modal con motivo y confirma con onReject(id, reason)", async () => {
    const onReject = vi.fn();
    const user = userEvent.setup();
    render(<ReviewCard review={baseReview} onReject={onReject} />);
    await user.click(screen.getByRole("button", { name: /rechazar/i }));

    const ta = await screen.findByPlaceholderText(/motivo/i);
    await user.type(ta, "Contiene lenguaje ofensivo");
    await user.click(screen.getByRole("button", { name: /confirmar/i }));

    expect(onReject).toHaveBeenCalledWith("r1", "Contiene lenguaje ofensivo");
  });

  it("Responder abre Modal con respuesta y dispara onRespond(id, text)", async () => {
    const onRespond = vi.fn();
    const user = userEvent.setup();
    render(
      <ReviewCard
        review={{ ...baseReview, status: "approved" }}
        onRespond={onRespond}
      />,
    );
    await user.click(screen.getByRole("button", { name: /responder/i }));
    const ta = await screen.findByPlaceholderText(/respuesta/i);
    await user.type(ta, "Gracias por tu review!");
    await user.click(screen.getByRole("button", { name: /enviar/i }));
    expect(onRespond).toHaveBeenCalledWith("r1", "Gracias por tu review!");
  });
});
