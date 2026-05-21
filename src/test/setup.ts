import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as React from "react";

afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock next/navigation — lo que usamos en la app
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  },
}));

// Mock next/image — un <img/> nativo (sin optimización en tests)
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt = "", ...rest } = props as { src: string; alt?: string };
    return React.createElement("img", { src, alt, ...rest });
  },
}));

// Mock next/link — pasa children y href como <a/>
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) =>
    React.createElement("a", { href, ...rest }, children),
}));
