import { cn } from "@/lib/utils";

interface AsteriskMarkProps {
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
  color?: string;
  /** Slowly rotating. Disabled automatically under prefers-reduced-motion. */
  spin?: boolean;
  /** Seconds per rotation. */
  duration?: number;
  /** 8-point variant used for large identity moments. */
  points?: 4 | 8;
  title?: string;
}

/**
 * The ✳ identity mark. Not a logo lockup, a graphic element that scales
 * from 14px inline accent to a cropped, oversized field graphic.
 */
export function AsteriskMark({
  className = "",
  size = 24,
  strokeWidth = 1.5,
  color = "currentColor",
  spin = false,
  duration = 42,
  points = 4,
  title,
}: AsteriskMarkProps) {
  const stroke = typeof strokeWidth === "number" ? strokeWidth : Number(strokeWidth) || 1.5;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(spin && "animate-drift", className)}
      style={spin ? { animationDuration: `${duration}s` } : undefined}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g stroke={color} strokeWidth={stroke} strokeLinecap="round">
        <line x1="50" y1="6" x2="50" y2="94" />
        <line x1="6" y1="50" x2="94" y2="50" />
        <line x1="18.9" y1="18.9" x2="81.1" y2="81.1" />
        <line x1="81.1" y1="18.9" x2="18.9" y2="81.1" />
        {points === 8 && (
          <>
            <line x1="28" y1="9" x2="72" y2="91" strokeWidth={stroke * 0.6} />
            <line x1="72" y1="9" x2="28" y2="91" strokeWidth={stroke * 0.6} />
            <line x1="9" y1="28" x2="91" y2="72" strokeWidth={stroke * 0.6} />
            <line x1="9" y1="72" x2="91" y2="28" strokeWidth={stroke * 0.6} />
          </>
        )}
      </g>
    </svg>
  );
}

/** Backwards-compatible thin wrapper for existing call sites. */
export function AsteriskSymbol({
  className = "",
  size = 24,
  strokeWidth = 1.5,
  fill = "currentColor",
}: {
  className?: string;
  size?: number;
  strokeWidth?: number;
  fill?: string;
}) {
  return (
    <AsteriskMark className={className} size={size} strokeWidth={strokeWidth} color={fill} />
  );
}
