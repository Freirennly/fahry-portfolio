import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { ArcLines } from "@/components/ui/ArcLines";
import { cn } from "@/lib/utils";

interface TransitionBandProps {
  /** Small archival label set at the left of the band. */
  label: string;
  /** Large statement that crosses the band. */
  statement: string;
  tone?: "blue" | "ink";
  /** Optional metadata pinned to the right edge. */
  meta?: string;
  showMark?: boolean;
}

/**
 * A full-bleed tonal band used between editorial sections. Its job is rhythm:
 * it breaks the LIGHT → LIGHT cadence with a BLUE or INK beat and lets an
 * oversized line of type cross a section boundary.
 */
export function TransitionBand({
  label,
  statement,
  tone = "blue",
  meta,
  showMark = true,
}: TransitionBandProps) {
  const blue = tone === "blue";

  return (
    <div
      className={cn(
        "gutter-safe relative overflow-hidden",
        blue ? "bg-blue-deep text-white" : "bg-ink text-white"
      )}
    >
      <div
        className="pointer-events-none absolute -left-[18%] top-1/2 h-[700px] w-[700px] -translate-y-1/2 text-white/15 lg:h-[900px] lg:w-[900px]"
        aria-hidden="true"
      >
        <ArcLines
          variant="horizon"
          stroke="rgba(255,255,255,0.18)"
          accent="#2f9dea"
          weight="hair"
        />
      </div>

      {showMark && (
        <div
          className="pointer-events-none absolute -right-[6%] top-1/2 -translate-y-1/2 text-white/[0.07]"
          aria-hidden="true"
        >
          <AsteriskMark size={280} strokeWidth={1} points={8} color="currentColor" spin duration={120} />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <AsteriskMark size={13} strokeWidth={1.6} color="#2f9dea" />
          <span className="type-meta font-bold text-blue-bright">{label}</span>
          {meta && (
            <>
              <span className="h-3 w-px bg-white/25" />
              <span className="type-meta text-white/60">{meta}</span>
            </>
          )}
        </div>

        <p className="type-display max-w-[22ch] text-[30px] leading-[0.98] text-white sm:text-[42px] lg:text-[56px]">
          {statement}
        </p>
      </div>
    </div>
  );
}
