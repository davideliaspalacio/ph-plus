"use client";

import { useRef, useState } from "react";

/**
 * Video con esquinas redondeadas (cuadrado/rectangular) y un botón de play
 * explícito.
 *
 * Usado en el testimonio de Sirley (home) y en "Gotas que cuentan
 * historias" (Camilo/Martha/Daniel). Antes: en el de Sirley había una
 * flecha decorativa que se confundía con navegación, y en los otros 3 los
 * controles nativos del video (que aparecen siempre) tapaban la cara de
 * cada persona en pantallas chicas. Ahora el botón de play sólo se
 * muestra antes de reproducir, y los controles nativos aparecen recién
 * cuando el video ya está sonando.
 *
 * Nota: se probó un recorte en forma de gota (ver `DropClipDefs`, que se
 * deja sin usar por si se retoma), pero el cliente pidió volver a la forma
 * cuadrada/rectangular simple porque la gota recortaba mal las caras.
 */
export function PlayableDropVideo({
  src,
  poster,
  ariaLabel,
  className = "",
  objectPosition = "center 20%",
}: {
  src: string;
  poster: string;
  ariaLabel: string;
  className?: string;
  /**
   * Punto de encuadre para `object-cover` (mismo formato que `object-position`
   * en CSS). Por defecto sesgado hacia arriba porque el material de los
   * testimonios encuadra a la persona con espacio de sobra arriba de la
   * cabeza; sin esto `object-cover` recorta desde el centro y la gota
   * termina cortando la frente/cara. Ajustable por video si alguno necesita
   * otro encuadre.
   */
  objectPosition?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    const video = videoRef.current;
    if (!video) return;
    setPlaying(true);
    video.play().catch(() => {
      // autoplay bloqueado por el navegador: dejamos los controles nativos
      // visibles para que el usuario le dé play a mano.
    });
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#e8f6fb] ${className}`}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        style={{ objectPosition }}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={ariaLabel}
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Reproducir: ${ariaLabel}`}
          className="absolute inset-0 grid place-items-center bg-black/10 transition-colors hover:bg-black/20"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-[#1e3a8a] shadow-[0_4px_12px_rgba(0,0,0,0.35)] sm:h-12 sm:w-12 lg:h-16 lg:w-16">
            <svg
              viewBox="0 0 24 24"
              className="ml-0.5 h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
              fill="currentColor"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/**
 * Path de gota (mismo que el ícono de "Gotas que cuentan historias"),
 * normalizado a objectBoundingBox para recortar cualquier video/foto con
 * esa forma. Se monta UNA sola vez por página (id compartido
 * "ph-drop-clip") — montarlo más de una vez es inofensivo (mismo id),
 * pero sólo hace falta una vez.
 */
export function DropClipDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <clipPath id="ph-drop-clip" clipPathUnits="objectBoundingBox">
          {/*
            El path original vive en un viewBox "0 0 18 24" pero su propio
            bounding box es x:[2,16] y:[1,15.2] (es un ícono con margen, no
            algo que llene su lienzo). Escalar por 1/18,1/24 directamente
            dejaba la gota achicada y pegada arriba, con espacio vacío
            debajo. Acá primero se traslada el bounding box del path al
            origen y RECIÉN then se escala por su propio ancho/alto, así
            sí llena el objectBoundingBox (0,0)-(1,1) completo.
          */}
          <path
            transform="scale(0.0714286 0.0704225) translate(-2 -1)"
            d="M9 1C7.2 5.1 2 10.3 2 15.2A7 7 0 0016 15.2C16 10.3 10.8 5.1 9 1Z"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
