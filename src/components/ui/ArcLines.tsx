import { cn } from "@/lib/utils";

type ArcVariant = "orbit" | "intersect" | "horizon" | "quadrant";

interface ArcLinesProps {
  variant?: ArcVariant;
  className?: string;
  stroke?: string;
  accent?: string;
  /** Renders at 1.5x stroke weight for large display moments. */
  weight?: "hair" | "regular";
  dashed?: boolean;
}

/**
 * Thin-line graphic system: precise stroked arcs and partial circles.
 * Deliberately not blobs: every path is a circular segment with a
 * mathematical center so the arcs read as orbital geometry.
 */
export function ArcLines({
  variant = "orbit",
  className = "",
  stroke = "currentColor",
  accent = "#2f9dea",
  weight = "regular",
  dashed = true,
}: ArcLinesProps) {
  const w = weight === "hair" ? 0.75 : 1.25;
  const dash = dashed ? "6 10" : undefined;

  return (
    <svg
      viewBox="0 0 1000 1000"
      fill="none"
      className={cn("w-full h-full", className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {variant === "orbit" && (
        <>
          <circle cx="500" cy="500" r="470" stroke={stroke} strokeWidth={w} strokeDasharray={dash} />
          <circle cx="500" cy="500" r="360" stroke={accent} strokeWidth={w * 1.4} opacity="0.9" />
          <circle cx="500" cy="500" r="250" stroke={stroke} strokeWidth={w} opacity="0.7" />
          {/* Open horizon arc: 180° sweep, ends deliberately cut */}
          <path
            d="M 40 500 A 460 460 0 0 1 960 500"
            stroke={accent}
            strokeWidth={w * 2}
            strokeLinecap="round"
          />
        </>
      )}

      {variant === "intersect" && (
        <>
          <circle cx="330" cy="500" r="330" stroke={stroke} strokeWidth={w} strokeDasharray={dash} />
          <circle cx="670" cy="500" r="330" stroke={accent} strokeWidth={w} opacity="0.85" />
          <path d="M 0 760 H 1000" stroke={stroke} strokeWidth={w * 0.6} opacity="0.5" />
        </>
      )}

      {variant === "horizon" && (
        <>
          {/* Long shallow arc, reads as a low orbit crossing the frame */}
          <path
            d="M -60 640 A 780 780 0 0 1 1060 470"
            stroke={accent}
            strokeWidth={w * 1.6}
          />
          <path
            d="M -60 700 A 780 780 0 0 1 1060 530"
            stroke={stroke}
            strokeWidth={w}
            strokeDasharray={dash}
          />
          <circle cx="820" cy="220" r="130" stroke={stroke} strokeWidth={w} strokeDasharray={dash} />
        </>
      )}

      {variant === "quadrant" && (
        <>
          {/* Quarter arc anchored bottom-left, plus its concentric echo */}
          <path d="M 0 1000 A 620 620 0 0 1 620 380" stroke={accent} strokeWidth={w * 1.6} />
          <path d="M 0 1000 A 440 440 0 0 1 440 560" stroke={stroke} strokeWidth={w} strokeDasharray={dash} />
          <circle cx="1000" cy="120" r="200" stroke={stroke} strokeWidth={w} strokeDasharray={dash} />
        </>
      )}
    </svg>
  );
}
