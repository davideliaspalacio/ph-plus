"use client";

import { useEffect, useState } from "react";
import { MOCK_LOADING_MS } from "../lib/mock-loading";

export function useMockLoading(ms: number = MOCK_LOADING_MS): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), ms);
    return () => window.clearTimeout(t);
  }, [ms]);
  return loading;
}
