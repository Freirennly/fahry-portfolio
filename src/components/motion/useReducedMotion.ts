"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: (matches: boolean) => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }

  const mediaQuery = window.matchMedia(QUERY);

  // Push the current value on subscribe (this is the "sync from external
  // system" callback the lint rule asks for, not a render-cascading setState).
  callback(mediaQuery.matches);

  const handler = (event: MediaQueryListEvent) => callback(event.matches);
  mediaQuery.addEventListener("change", handler);

  return () => mediaQuery.removeEventListener("change", handler);
}

/**
 * Hydration-safe reduced-motion hook.
 *
 * The server has no media-query access, so the first client render MUST match
 * the server's assumption (motion enabled). We therefore always start at
 * `false` and only adopt the real preference through an external-system
 * subscription, which runs after commit. Reading `matchMedia` in a state
 * initializer (as the previous implementation did) makes the first client
 * paint diverge from the server whenever the user prefers reduced motion.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => subscribe(setPrefersReduced), []);

  return prefersReduced;
}
