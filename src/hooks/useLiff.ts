"use client";

import { useState, useEffect } from "react";
import type { Liff } from "@line/liff";

export function useLiff() {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return;

    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

    if (!liffId) {
      setLiffError("NEXT_PUBLIC_LIFF_ID is missing");
      return;
    }

    // Dynamic import to avoid SSR issues with @line/liff
    import("@line/liff").then((liffModule) => {
      const liff = liffModule.default;
      liff
        .init({ liffId })
        .then(() => {
          setLiffObject(liff);
          setIsReady(true);
        })
        .catch((err: Error) => {
          console.error("LIFF initialization failed", err);
          setLiffError(err.toString());
        });
    });
  }, []);

  return { liff: liffObject, liffError, isReady };
}
