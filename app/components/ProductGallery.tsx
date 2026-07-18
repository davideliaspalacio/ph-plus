"use client";

import { useState } from "react";
import Image from "next/image";
import ProductVisual from "./ProductVisual";
import type { GalleryImage } from "../lib/products";

export default function ProductGallery({
  images,
  highlight,
}: {
  images: GalleryImage[];
  highlight?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const fallbackBg = highlight ? "#eef3fb" : "#f7f8fb";

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-3xl p-8 sm:h-96 sm:p-10 lg:h-[420px]"
        style={{ background: current?.bg ?? fallbackBg }}
      >
        {current?.src ? (
          <Image
            src={current.src}
            alt={current.caption}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain p-6"
          />
        ) : (
          <ProductVisual
            visualKey={current?.visualKey ?? "kit"}
            className="h-64 w-auto sm:h-72 lg:h-80"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}: ${img.caption}`}
              aria-pressed={i === active}
              className={
                "relative flex h-20 items-center justify-center overflow-hidden rounded-xl p-2 transition-all " +
                (i === active
                  ? "ring-2 ring-brand ring-offset-2"
                  : "ring-1 ring-card-border hover:ring-brand")
              }
              style={{ background: img.bg }}
            >
              {img.src ? (
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="120px"
                  className="object-contain p-1"
                />
              ) : (
                <ProductVisual
                  visualKey={img.visualKey}
                  className="h-14 w-auto"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-[12px] text-ink-muted">
        {current?.caption}
      </p>
    </div>
  );
}
