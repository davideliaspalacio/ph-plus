"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";

function CartIconSmall() {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 48 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2 2H10L15.36 28.78C15.5429 29.7008 16.0438 30.5279 16.7751 31.1166C17.5064 31.7053 18.4214 32.018 19.36 32H38.8C39.7386 32.018 40.6536 31.7053 41.3849 31.1166C42.1162 30.5279 42.6171 29.7008 42.8 28.78L46 12H12M20 42C20 43.1046 19.1046 44 18 44C16.8954 44 16 43.1046 16 42C16 40.8954 16.8954 40 18 40C19.1046 40 20 40.8954 20 42ZM42 42C42 43.1046 41.1046 44 40 44C38.8954 44 38 43.1046 38 42C38 40.8954 38.8954 40 40 40C41.1046 40 42 40.8954 42 42Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Mode = "add" | "buy";
type Variant = "primary" | "outline";

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-dark hover:scale-[1.03]",
  outline:
    "border border-brand bg-transparent text-brand hover:bg-brand hover:text-white",
};

export default function AddToCartButton({
  slug,
  quantity = 1,
  mode = "add",
  variant = "primary",
  showIcon = true,
  className = "",
  label,
}: {
  slug: string;
  quantity?: number;
  mode?: Mode;
  variant?: Variant;
  showIcon?: boolean;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(slug, quantity);
    if (mode === "buy") {
      router.push("/checkout");
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const finalLabel =
    label ?? (mode === "buy" ? "Comprar ahora" : "Agregar al carrito");

  return (
    <div className={"flex flex-col gap-2 " + (className.includes("w-full") ? "w-full" : "")}>
      <button
        type="button"
        onClick={handleClick}
        className={
          "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold transition-all " +
          VARIANT_STYLES[variant] +
          " " +
          className
        }
      >
        {showIcon && <CartIconSmall />}
        {finalLabel}
      </button>
      {added && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-[#eef0ff] px-3 py-2 text-[12px] text-brand">
          <span>Agregado al carrito</span>
          <Link
            href="/carrito"
            className="font-semibold underline-offset-2 hover:underline"
          >
            Ir al carrito →
          </Link>
        </div>
      )}
    </div>
  );
}
