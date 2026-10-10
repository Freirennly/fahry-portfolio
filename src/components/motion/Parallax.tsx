"use client";

import { useRef, useEffect } from "react";
import { useScrollProgress } from "./ScrollProgressProvider";
import { useReducedMotion } from "./useReducedMotion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Parallax({ children, speed = 0.3, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY, viewportHeight } = useScrollProgress();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const element = ref.current;
    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const offset = (scrollY - elementTop + viewportHeight) * speed;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY, viewportHeight, speed, reducedMotion]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden will-change-transform h-full", className)}
      style={{ ...style, transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}