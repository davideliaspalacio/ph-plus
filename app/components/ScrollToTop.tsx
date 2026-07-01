"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetScroll();
    const id = window.setTimeout(resetScroll, 0);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
