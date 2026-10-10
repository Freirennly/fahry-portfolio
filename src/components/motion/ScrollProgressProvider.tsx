"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ScrollContextValue {
  scrollY: number;
  scrollProgress: number;
  viewportHeight: number;
}

const DEFAULT_SCROLL_STATE: ScrollContextValue = {
  scrollY: 0,
  scrollProgress: 0,
  viewportHeight: 1000,
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

function readScrollValues(): ScrollContextValue {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const scrollable = document.body.scrollHeight - viewportHeight;
  return {
    scrollY,
    viewportHeight,
    scrollProgress: scrollable > 0 ? scrollY / scrollable : 0,
  };
}

export function ScrollProgressProvider({ children }: { children: ReactNode }) {
  // Always start from the same constant the server used. Real measurements are
  // adopted in an effect so the first client render matches the SSR markup.
  const [scrollValues, setScrollValues] = useState<ScrollContextValue>(DEFAULT_SCROLL_STATE);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrollValues(readScrollValues());
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollValues}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollProgress(): ScrollContextValue {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollProgress must be used within ScrollProgressProvider");
  }
  return context;
}
