"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { MiniCart } from "@/src/features/cart/ui/MiniCart";
import { useSession } from "@/src/features/auth";
import { SearchBar } from "@/src/features/search";

const NAV = [
  { label: "INICIO", href: "/" },
  { label: "POR QUÉ PH PLUS", href: "/#por-que" },
  { label: "PRODUCTOS", href: "/productos" },
  { label: "PUNTOS DE VENTA", href: "/#puntos-venta" },
];

function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M4 21c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="28"
      height="26"
      viewBox="0 0 48 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2 2H10L15.36 28.78C15.5429 29.7008 16.0438 30.5279 16.7751 31.1166C17.5064 31.7053 18.4214 32.018 19.36 32H38.8C39.7386 32.018 40.6536 31.7053 41.3849 31.1166C42.1162 30.5279 42.6171 29.7008 42.8 28.78L46 12H12M20 42C20 43.1046 19.1046 44 18 44C16.8954 44 16 43.1046 16 42C16 40.8954 16.8954 40 18 40C19.1046 40 20 40.8954 20 42ZM42 42C42 43.1046 41.1046 44 40 44C38.8954 44 38 43.1046 38 42C38 40.8954 38.8954 40 40 40C41.1046 40 42 40.8954 42 42Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const { totalItems, hydrated } = useCart();
  const session = useSession((s) => s.session);
  const isAuth = session != null && session.expiresAt > Date.now();
  const showBadge = hydrated && totalItems > 0;
  const prevTotal = useRef(totalItems);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (totalItems > prevTotal.current) {
      setBouncing(true);
      const t = window.setTimeout(() => setBouncing(false), 550);
      return () => window.clearTimeout(t);
    }
    prevTotal.current = totalItems;
  }, [totalItems, hydrated]);

  useEffect(() => {
    prevTotal.current = totalItems;
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-40 w-full bg-brand text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-[64px] max-w-page items-center gap-4 px-4 sm:h-[70px] sm:px-6 lg:gap-10 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-4">
          <Image
            src="/brand/logo-ph-plus.png"
            alt="PH PLUS"
            width={160}
            height={48}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] font-semibold tracking-[0.06em]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-opacity hover:opacity-80"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 max-w-md md:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-5">
          <Link
            href={isAuth ? "/cuenta" : "/login"}
            aria-label={isAuth ? "Mi cuenta" : "Iniciar sesión"}
            className="hidden transition-opacity hover:opacity-80 md:inline-flex"
          >
            <UserIcon />
          </Link>

          <button
            type="button"
            onClick={() => setMiniCartOpen(true)}
            aria-label={`Abrir carrito${
              showBadge
                ? ` con ${totalItems} producto${totalItems === 1 ? "" : "s"}`
                : ""
            }`}
            className="relative transition-opacity hover:opacity-80"
          >
            <CartIcon />
            {showBadge && (
              <span
                className={
                  "absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-white px-1 text-[11px] font-extrabold text-brand shadow-[0_2px_6px_rgba(0,0,0,0.18)] " +
                  (bouncing ? "cart-badge-bounce" : "")
                }
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          <a
            href="https://wa.me/573234392470"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contáctanos por WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full bg-whatsapp transition-colors hover:bg-whatsapp-dark sm:h-11 sm:w-11"
          >
            <Image
              src="/icons/whatsapp.svg"
              alt=""
              width={26}
              height={26}
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </a>

          <button
            type="button"
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/15 bg-brand lg:hidden">
          <ul className="mx-auto flex max-w-page flex-col px-4 py-2 text-[13px] font-semibold tracking-[0.06em] sm:px-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 transition-opacity hover:opacity-80"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <MiniCart isOpen={miniCartOpen} onClose={() => setMiniCartOpen(false)} />
    </header>
  );
}
