"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { cn } from "@/lib/utils";

interface PressPreviewProps {
  /** Short, quiet instruction shown while the interaction is idle. */
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Press-and-hold preview surface, adapted from the reference studio site.
 *
 * Desktop: holding a pointer down scales the media in and drops a scrim, so the
 * work reads at full focus without leaving the page. Releasing settles back.
 *
 * Touch / small screens: a long-press is unreliable and fights scrolling, so we
 * expose a single, explicit toggle instead: tap the hint to hold the preview
 * open, tap again to release. Nothing here blocks navigation: the surrounding
 * link is a sibling, and keyboard users get the plain focus ring.
 *
 * `prefers-reduced-motion` removes the scale transition; the scrim still fades.
 */
export function PressPreview({ hint = "Tahan untuk melihat", className, children }: PressPreviewProps) {
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const press = useCallback((e: ReactPointerEvent) => {
    // Only respond to primary pointer; ignore right/middle click.
    if (e.button !== 0) return;
    if (e.pointerType === "touch") return; // handled by the explicit toggle
    setActive(true);
  }, []);

  const release = useCallback(() => setActive(false), []);

  return (
    <div
      ref={containerRef}
      className={cn("group/preview relative select-none", className)}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {children}

      {/* Focus scrim + frame, revealed while held. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-10 transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-blue-abyss/55 backdrop-blur-[2px]" />
        <div
          className={cn(
            "absolute inset-0 ring-1 ring-inset ring-blue-electric/60",
            !reduced && "scale-[0.985] transition-transform duration-500",
            !reduced && active && "scale-100"
          )}
        />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
          <AsteriskMark size={22} strokeWidth={1.3} points={8} color="#2f9dea" spin={!reduced} duration={18} />
          <span className="type-meta text-white/90">Preview</span>
        </div>
      </div>

      {/* Quiet instruction. On touch it becomes the explicit toggle. */}
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        aria-pressed={active}
        className={cn(
          "absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 border px-3 py-1.5 type-meta transition-colors",
          active
            ? "border-blue-electric bg-blue-electric/15 text-white"
            : "border-white/30 bg-blue-abyss/50 text-white/75 hover:border-white/60 hover:text-white"
        )}
      >
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-electric" />
        <span className="hidden sm:inline">{hint}</span>
        <span className="sm:hidden">{active ? "Lepas" : "Pratinjau"}</span>
        <span className="hidden text-white/50 sm:inline">· tekan</span>
      </button>
    </div>
  );
}
