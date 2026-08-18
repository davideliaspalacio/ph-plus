"use client";

import { useEffect, useRef } from "react";

import { useCart } from "@/app/components/CartProvider";

/**
 * El carrito ya NO se vacía al salir hacia Rapyd (para no perderlo si el
 * comprador cancela o el pago falla) — se vacía acá, una sola vez, cuando
 * esta pantalla confirma "paid" contra la orden real en DB.
 */
export function ClearCartOnPaid({ paid }: { paid: boolean }) {
  const { clear } = useCart();
  const didClear = useRef(false);

  useEffect(() => {
    if (paid && !didClear.current) {
      didClear.current = true;
      clear();
    }
  }, [paid, clear]);

  return null;
}
