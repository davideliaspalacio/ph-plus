"use client";

import { useState, type ChangeEvent } from "react";
import { Button, Input } from "@/src/shared/ui";
import {
  couponRepo as defaultCouponRepo,
  validateCoupon,
  type CouponRepository,
  type ValidationReason,
} from "@/src/features/coupons";
import { useCheckout } from "../store/useCheckout";

const REASON_MESSAGES: Record<ValidationReason, string> = {
  NOT_STARTED: "El cupón aún no está activo",
  EXPIRED: "Cupón vencido",
  INACTIVE: "Cupón inactivo",
  MIN_SUBTOTAL_NOT_REACHED: "No alcanza el mínimo de compra",
  MAX_USES_REACHED: "Cupón sin usos disponibles",
};

export interface CouponInputProps {
  /** Subtotal actual del carrito — necesario para validar `minSubtotal`. */
  subtotal: number;
  /** Inyectable para tests. */
  couponRepo?: CouponRepository;
  /** Inyectable para tests deterministas. */
  now?: Date;
  className?: string;
}

export function CouponInput({
  subtotal,
  couponRepo = defaultCouponRepo,
  now,
  className,
}: CouponInputProps) {
  const setCoupon = useCheckout((s) => s.setCoupon);
  const appliedCode = useCheckout((s) => s.couponCode);

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // Uppercase auto.
    setCode(e.target.value.toUpperCase());
    if (error) setError(null);
  }

  async function handleApply() {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Ingresa un código");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const coupon = await couponRepo.findByCode(trimmed);
      if (!coupon) {
        setError("Cupón no encontrado");
        return;
      }
      const result = validateCoupon(coupon, {
        now: now ?? new Date(),
        subtotal,
      });
      if (!result.ok) {
        setError(REASON_MESSAGES[result.reason] ?? "Cupón inválido");
        return;
      }
      setCoupon(coupon.code);
    } catch {
      setError("No pudimos validar el cupón");
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    setCoupon(null);
    setCode("");
    setError(null);
  }

  if (appliedCode) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between rounded-2xl border border-whatsapp/40 bg-whatsapp/5 px-4 py-3">
          <div>
            <p className="text-[12px] uppercase tracking-wide text-ink-muted">
              Cupón aplicado
            </p>
            <p className="text-[14px] font-bold text-whatsapp-dark">
              {appliedCode}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
          >
            Quitar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            label="Cupón"
            placeholder="DESC10"
            value={code}
            onChange={handleChange}
            error={error ?? undefined}
            aria-label="Código de cupón"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleApply}
          isLoading={loading}
        >
          Aplicar
        </Button>
      </div>
    </div>
  );
}
