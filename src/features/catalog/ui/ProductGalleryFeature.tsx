"use client";

import {
  useState,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import { cn } from "@/src/shared/lib/cn";

export interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProductGalleryFeatureProps {
  images: GalleryItem[];
  className?: string;
}

/**
 * Galería con imagen principal + thumbnails.
 * - Click thumbnail cambia la principal.
 * - Soporta teclado: flechas izq/der cuando el contenedor está enfocado.
 */
export function ProductGalleryFeature({
  images,
  className,
}: ProductGalleryFeatureProps) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const safeImages = images.length > 0 ? images : [];
  const current = safeImages[active] ?? safeImages[0];

  const goTo = (idx: number) => {
    if (safeImages.length === 0) return;
    const next = ((idx % safeImages.length) + safeImages.length) % safeImages.length;
    setActive(next);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  if (!current) return null;

  return (
    <div
      ref={rootRef}
      data-testid="gallery-root"
      role="group"
      aria-label="Galería de imágenes del producto"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "flex flex-col gap-4 outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 rounded-3xl",
        className,
      )}
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-accent-cyan/15 to-white">
        <Image
          data-testid="gallery-main-image"
          src={current.src}
          alt={current.alt}
          width={800}
          height={800}
          className="h-full w-full object-contain p-8"
          priority
        />
      </div>

      {safeImages.length > 1 && (
        <div
          aria-label="Miniaturas"
          className="grid grid-cols-4 gap-3"
        >
          {safeImages.map((img, i) => {
            const selected = i === active;
            return (
              <button
                key={img.src + i}
                type="button"
                aria-pressed={selected}
                aria-label={`Ver imagen ${i + 1}: ${img.alt}`}
                onClick={() => goTo(i)}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-xl bg-white p-2 transition-all",
                  selected
                    ? "ring-2 ring-brand ring-offset-2"
                    : "ring-1 ring-card-border hover:ring-brand",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  width={120}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {current.caption && (
        <p className="text-center text-[12px] text-ink-muted">
          {current.caption}
        </p>
      )}
    </div>
  );
}
