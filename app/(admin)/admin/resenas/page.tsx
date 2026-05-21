"use client";

import { useEffect, useState } from "react";
import { ReviewsModerationPanel } from "@/src/features/admin/reviews-ui";
import { reviewRepo, type Review } from "@/src/features/reviews";

export default function AdminResenasPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  const reload = async () => {
    const [pending, approved, rejected] = await Promise.all([
      reviewRepo.listForModeration("pending"),
      reviewRepo.listForModeration("approved"),
      reviewRepo.listForModeration("rejected"),
    ]);
    setReviews([...pending, ...approved, ...rejected]);
  };

  useEffect(() => {
    void reload();
  }, []);

  if (reviews == null) {
    return <p className="text-[14px] text-ink-muted">Cargando reseñas…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-[24px] font-extrabold text-brand">Reseñas</h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          Moderá las opiniones de los clientes.
        </p>
      </header>
      <ReviewsModerationPanel
        reviews={reviews}
        onApprove={async (id) => {
          await reviewRepo.approve(id);
          await reload();
        }}
        onReject={async (id, reason) => {
          await reviewRepo.reject(id, reason);
          await reload();
        }}
        onRespond={async (id, text) => {
          await reviewRepo.respond(id, text);
          await reload();
        }}
      />
    </div>
  );
}
