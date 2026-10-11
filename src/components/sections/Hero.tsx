"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Section } from "@/components/ui/Section";

/**
 * Hero: centered statement, oversized name, single line of context, and a
 * real work asset beneath. No pills, badges, or fake status markers.
 */

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);

  return (
    <Section
      ref={containerRef}
      id="hero"
      padding="none"
      background="blue-deep"
      className="gutter-safe relative overflow-hidden bg-blue-deep text-white"
    >
      {/* Field: deep blue ground with a soft top glow, matching the reference */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-blue-deep" />
        <div className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(90%_70%_at_50%_0%,rgba(8,118,206,0.28),transparent_65%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pt-32 pb-10 md:px-12 md:pt-40 md:pb-20 md:min-h-[720px]">
        {/* ---- Centered statement ---------------------------------------- */}
        <motion.div
          style={{ y: reducedMotion ? 0 : headlineY, opacity: fade }}
          className="flex flex-col items-center text-center"
        >
          {/* El Messiri applied inline: the unlayered `h1..h6` rule in
              globals.css outranks layered utilities, so a font utility class
              here would be silently ignored. */}
          <h1
            style={{ fontFamily: "var(--font-messiri)", fontWeight: 600 }}
            className="text-[56px] leading-[0.95] tracking-tight text-white sm:text-[84px] lg:text-[112px]"
          >
            Muhammad Fahry Ali
          </h1>

          <p className="mt-3 max-w-[42ch] text-base leading-relaxed text-white/70 sm:text-lg">
            Media kreatif, sistem spasial, dan agen AI.
          </p>
        </motion.div>

        {/* ---- Large visual below the fold ------------------------------- */}
        <motion.div
          style={{ y: reducedMotion ? 0 : visualY }}
          className="relative mt-14 w-full md:mt-20"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] bg-blue-abyss lg:aspect-[16/9]">
            <OptimizedImage
              src="/images/brand/hero-banner.webp"
              sizes="(max-width: 1024px) 100vw, 1280px"
              alt="Banner kreatif: cetak spasial, tata letak desain, dan elemen AI"
              fill
              priority
              fetchPriority="high"
              className="object-cover object-center brightness-[0.92] contrast-[1.04]"
            />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}