"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { MiniCart } from "@/src/features/cart/ui/MiniCart";

const NAV = [
  { label: "INICIO", href: "/" },
  { label: "POR QUÉ PH PLUS", href: "/por-que-ph-plus" },
  { label: "PRODUCTOS", href: "/productos" },
  { label: "PUNTOS DE VENTA", href: "/puntos-de-venta" },
];

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="28"
      height="26"
      viewBox="0 0 48 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden className="h-full w-full">
      <circle cx="27" cy="27" r="18" stroke="currentColor" strokeWidth="5" />
      <path
        d="M41 41l15 15"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const { totalItems, hydrated } = useCart();
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
    <header className="sticky top-0 z-40 w-full bg-[#1e2aab] text-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="relative mx-auto flex h-[50px] max-w-[390px] items-center px-0 sm:h-[64px] sm:max-w-[1440px] sm:px-6 lg:hidden">
        <Link href="/" className="flex h-full shrink-0 items-center">
          <Image
            src="/brand/logo-ph-plus-figma.png"
            alt="PH PLUS"
            width={160}
            height={48}
            priority
            className="h-[42px] w-[100px] object-contain sm:h-10 sm:w-auto"
          />
        </Link>

        <Image
          src="/home/ph9-drop.png"
          alt=""
          width={98}
          height={155}
          priority
          className="absolute left-[96px] top-[3px] h-[56px] w-[35px] object-contain sm:left-[130px]"
        />

        <Link
          href="/buscar"
          aria-label="Buscar productos"
          className="ml-auto grid h-6 w-6 place-items-center transition-opacity hover:opacity-80"
        >
          <SearchIcon />
        </Link>

        <div className="ml-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMiniCartOpen(true)}
            aria-label={`Abrir carrito${
              showBadge
                ? ` con ${totalItems} producto${totalItems === 1 ? "" : "s"}`
                : ""
            }`}
            className="relative grid h-[35px] w-[35px] place-items-center transition-opacity hover:opacity-80"
          >
            <CartIcon className="h-[35px] w-[35px]" />
            {showBadge && (
              <span
                className={
                  "absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-white px-1 text-[9px] font-extrabold text-[#1e3a8a] shadow-[0_2px_6px_rgba(0,0,0,0.18)] " +
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
            className="grid h-[23px] w-[23px] place-items-center rounded-full bg-[#25d366] transition-colors hover:bg-[#1fb055]"
          >
            <Image
              src="/icons/whatsapp.svg"
              alt=""
              width={23}
              height={23}
              className="h-[19px] w-[19px]"
            />
          </a>

          <button
            type="button"
            aria-label="Menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-[42px] w-[41px] place-items-center"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
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

      <div className="mx-auto hidden h-[96px] max-w-[1200px] items-center px-6 lg:flex">
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="relative h-[92px] w-[250px] shrink-0"
        >
          <Image
            src="/brand/logo-ph-plus-figma.png"
            alt="PH PLUS"
            width={295}
            height={123}
            priority
            className="h-full w-full object-contain"
          />
        </Link>

        <Image
          src="/home/ph9-drop.png"
          alt=""
          width={98}
          height={155}
          priority
          className="ml-4 h-[92px] w-[52px] shrink-0 object-contain"
        />

        <nav className="ph-display ml-9 flex flex-1 items-center justify-center gap-7 whitespace-nowrap text-[21px] uppercase leading-none">
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

        <Link
          href="/buscar"
          aria-label="Buscar productos"
          className="ml-8 grid h-10 w-10 shrink-0 place-items-center transition-opacity hover:opacity-80"
        >
          <SearchIcon />
        </Link>

        <button
          type="button"
          onClick={() => setMiniCartOpen(true)}
          aria-label={`Abrir carrito${
            showBadge
              ? ` con ${totalItems} producto${totalItems === 1 ? "" : "s"}`
              : ""
          }`}
          className="ml-7 grid h-10 w-10 shrink-0 place-items-center transition-opacity hover:opacity-80"
        >
          <CartIcon />
          {showBadge && (
            <span
              className={
                "absolute -right-2 -top-2 grid h-6 min-w-[24px] place-items-center rounded-full bg-white px-1 text-[12px] font-extrabold text-[#1e3a8a] shadow-[0_2px_6px_rgba(0,0,0,0.18)] " +
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
          className="ml-8 grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full bg-[#25d366] transition-colors hover:bg-[#1fb055]"
        >
          <Image
            src="/icons/whatsapp.svg"
            alt=""
            width={42}
            height={42}
            className="h-8 w-8"
          />
        </a>
      </div>

      {open && (
        <nav className="border-t border-white/15 bg-[#1e2aab] lg:hidden">
          <ul className="mx-auto flex max-w-[1440px] flex-col px-4 py-2 text-[13px] font-semibold tracking-[0.06em] sm:px-6">
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
