"use client";

import { useState } from "react";
import type { Review, SpecRow } from "../lib/products";

type TabKey = "descripcion" | "especificaciones" | "uso" | "reseñas";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill={i < Math.round(rating) ? "#f6c84a" : "#e5e6ea"}
          aria-hidden
        >
          <path d="M12 2.5l3 6 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.9 2.7 1.1-6.5L2.5 9.4 9 8.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductTabs({
  longDescription,
  specs,
  usage,
  reviews,
  rating,
}: {
  longDescription: string[];
  specs: SpecRow[];
  usage: string[];
  reviews: Review[];
  rating: { average: number; count: number };
}) {
  const [tab, setTab] = useState<TabKey>("descripcion");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "descripcion", label: "Descripción" },
    { key: "especificaciones", label: "Especificaciones" },
    { key: "uso", label: "Cómo usarlo" },
    { key: "reseñas", label: `Reseñas (${reviews.length})` },
  ];

  return (
    <div className="rounded-2xl border border-card-border bg-white">
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-card-border p-2 sm:gap-2 sm:p-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={
              "rounded-full px-4 py-2 text-[12px] font-semibold transition-colors sm:text-[13px] " +
              (tab === t.key
                ? "bg-brand text-white"
                : "text-ink-muted hover:bg-[#eef0ff] hover:text-brand")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8">
        {tab === "descripcion" && (
          <div className="space-y-4 text-[14px] leading-[1.7] text-ink sm:text-[15px]">
            {longDescription.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {tab === "especificaciones" && (
          <dl className="divide-y divide-card-border">
            {specs.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-3.5"
              >
                <dt className="text-[13px] font-semibold uppercase tracking-wide text-brand sm:w-1/3">
                  {row.label}
                </dt>
                <dd className="text-[14px] text-ink sm:text-right">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {tab === "uso" && (
          <ol className="space-y-3 text-[14px] leading-[1.65] text-ink sm:text-[15px]">
            {usage.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[12px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        )}

        {tab === "reseñas" && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl bg-[#eef0ff] p-4">
              <div className="text-center">
                <p className="text-[32px] font-extrabold leading-none text-brand">
                  {rating.average.toFixed(1)}
                </p>
                <StarRow rating={rating.average} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-brand">
                  Basado en {rating.count} reseñas
                </p>
                <p className="text-[12px] text-ink-muted">
                  Reseñas verificadas de clientes PH PLUS.
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {reviews.map((r) => (
                <li
                  key={r.author + r.date}
                  className="rounded-xl border border-card-border p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-ink">
                      {r.author}
                    </p>
                    <span className="text-[12px] text-ink-muted">{r.date}</span>
                  </div>
                  <StarRow rating={r.rating} />
                  <p className="mt-2 text-[13px] leading-[1.6] text-ink">
                    {r.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
