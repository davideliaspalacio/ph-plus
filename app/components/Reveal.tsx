"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  threshold?: number;
};

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServer = () => false;

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      // setState dentro de un callback async del IO no dispara el lint;
      // aquí también está fuera del path sincrónico del effect.
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, prefersReducedMotion]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      style={{ transitionDelay: `${delay}ms` }}
      className={
        "transform transition-all duration-[700ms] ease-out " +
        (visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4") +
        (className ? " " + className : "")
      }
    >
      {children}
    </Tag>
  );
}
