"use client";

import { useRef } from "react";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Tone of the band. */
  tone?: "blue" | "light" | "ink";
  /** Slower cadence for long, ambient bands. */
  speed?: "normal" | "slow";
  className?: string;
  /** Separator glyph between entries. */
  separator?: "asterisk" | "dot";
}

const toneClasses = {
  blue: "bg-blue-deep text-white/85 border-white/10",
  ink: "bg-ink text-white/85 border-white/10",
  light: "bg-off-white text-ink/75 border-ink/10",
};

/** Edge-fade colour must match the band fill, or a seam shows at both ends. */
const fadeFromClasses = {
  blue: "from-blue-deep",
  ink: "from-ink",
  light: "from-off-white",
};

function Separator({ kind, tone }: { kind: "asterisk" | "dot"; tone: NonNullable<MarqueeProps["tone"]> }) {
  if (kind === "dot") {
    return (
      <span aria-hidden="true" className={cn("mx-6 sm:mx-10", tone === "light" ? "text-blue-primary" : "text-blue-bright")}>
        ·
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="mx-6 inline-flex shrink-0 sm:mx-10">
      <AsteriskMark
        size={20}
        strokeWidth={1.3}
        points={8}
        color={tone === "light" ? "#0876ce" : "#2f9dea"}
      />
    </span>
  );
}

/**
 * One or two of these on the page, no more.
 *
 * The strip is duplicated inline and translated by -50%, so the loop is seamless
 * with a single transform animation. It pauses on hover/focus for control, and
 * under `prefers-reduced-motion` the keyframe duration collapses to a static
 * strip (see globals.css `.marquee-row` reset).
 */
export function Marquee({
  items,
  tone = "blue",
  speed = "normal",
  className,
  separator = "asterisk",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const sequence = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {items.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center">
          <span className="type-display whitespace-nowrap px-1 text-[40px] leading-none tracking-tight sm:text-[64px] lg:text-[88px]">
            {item}
          </span>
          <Separator kind={separator} tone={tone} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "gutter-safe group/marquee relative overflow-hidden border-y",
        toneClasses[tone],
        className
      )}
      onMouseEnter={() => {
        if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
      }}
      onMouseLeave={() => {
        if (trackRef.current) trackRef.current.style.animationPlayState = "running";
      }}
    >
      <div className="flex w-max py-6 sm:py-8">
        <div
          ref={trackRef}
          className={cn(
            "marquee-row flex w-max",
            speed === "slow" ? "animate-marquee-slow" : "animate-marquee",
            "group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused]"
          )}
        >
          {sequence("a")}
          {sequence("b")}
        </div>
      </div>

      {/* Edge fades seat the strip into the surrounding field. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28",
          "bg-gradient-to-r to-transparent",
          fadeFromClasses[tone]
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28",
          "bg-gradient-to-l to-transparent",
          fadeFromClasses[tone]
        )}
      />
    </div>
  );
}
