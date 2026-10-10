"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { ArcLines } from "@/components/ui/ArcLines";
import { journeyMilestones } from "@/lib/data/timeline";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 40%"],
  });
  const axisScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section
      ref={sectionRef}
      id="journey"
      padding="none"
      background="off-white"
      className="gutter-safe relative pt-24 md:pt-36 pb-24 md:pb-32 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -left-[22%] bottom-0 h-[500px] w-[500px] text-blue-primary/20 lg:-left-[16%] lg:h-[600px] lg:w-[600px]"
        aria-hidden="true"
      >
        <ArcLines variant="quadrant" stroke="rgba(7,89,155,0.20)" accent="#2f9dea" weight="hair" />
      </div>

      <Container size="content" className="relative z-10">
        <div className="relative mb-16 md:mb-24">
          <span
            aria-hidden="true"
            className="type-display pointer-events-none absolute -left-1 -top-10 select-none text-[110px] leading-none text-ink/[0.055] sm:text-[170px] lg:-top-16 lg:text-[230px]"
          >
            02
          </span>

          <div className="relative">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5">
              <span className="type-meta font-bold text-blue-primary">02</span>
              <span className="type-meta font-bold text-blue-primary">Perjalanan</span>
              <span className="h-3 w-px bg-ink/20" />
              <span className="type-meta text-muted">2021–2026</span>
            </div>

            <Heading
              as="h2"
              size="display"
              className="type-display max-w-[16ch] text-[34px] leading-[0.94] text-ink sm:text-[48px] lg:text-[64px]"
            >
              Perkembangan dari keterampilan visual{" "}
              <span className="type-accent text-blue-primary">menuju sistem cerdas.</span>
            </Heading>

            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">
              Tiap fase memengaruhi fase berikutnya. Naluri visual menajamkan cara saya
              berkomunikasi; organisasi mengajari saya menyusun kerja; komputasi membuat
              susunan itu berjalan otomatis.
            </p>
          </div>
        </div>

        {/* Axis rail and milestones */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-ink/15 md:left-[8px]" aria-hidden="true" />
          <motion.div
            style={{ scaleY: reducedMotion ? 1 : axisScale }}
            className="absolute left-0 top-0 bottom-0 w-px origin-top bg-blue-electric md:left-[8px]"
            aria-hidden="true"
          />

          <ol className="space-y-16 md:space-y-24">
            {journeyMilestones.map((item) => {
              return (
                <motion.li
                  key={item.year}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-7 sm:pl-12 md:pl-20"
                >
                  {/* Axis indicator */}
                  <span
                    className="absolute left-0 top-1.5 -translate-x-1/2 md:left-[8px]"
                    aria-hidden="true"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-off-white">
                      <AsteriskMark
                        size={16}
                        strokeWidth={0.6}
                        points={8}
                        className="text-blue-primary"
                      />
                    </span>
                  </span>

                  {/* Grid layout: Year (col 2), Content (col 6/10), Media (col 4) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
                    {/* 1. Year Column */}
                    <div className="lg:col-span-2 flex items-baseline gap-3 lg:block">
                      <span className="type-display block text-3xl sm:text-4xl lg:text-5xl font-bold leading-none text-ink">
                        {item.year}
                      </span>
                      {/* Mobile-only category badge next to year */}
                      <span className="lg:hidden inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-blue-primary/10 text-blue-deep border border-blue-primary/15">
                        {item.theme}
                      </span>
                    </div>

                    {/* 2. Main Experience Information */}
                    <div
                      className={cn(
                        "space-y-3",
                        item.imageFragment ? "lg:col-span-6" : "lg:col-span-10"
                      )}
                    >
                      {/* Desktop category badge directly above title */}
                      <div className="hidden lg:flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide bg-blue-primary/10 text-blue-deep border border-blue-primary/15">
                          {item.theme}
                        </span>
                      </div>

                      {/* Title + Role & Organization: tight unit */}
                      <div>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-ink leading-snug">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm sm:text-[15px] font-medium text-blue-primary">
                          {item.role}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-[15px] sm:text-base leading-relaxed text-muted pt-1">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <ul className="flex flex-wrap gap-x-2 gap-y-1.5 pt-2">
                        {item.highlights.map((h) => (
                          <li
                            key={h}
                            className="inline-flex items-center text-xs text-muted/90 bg-ink/[0.04] px-2.5 py-1 rounded"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>

                      {/* Case study link if available */}
                      {item.featuredSlug && (
                        <div className="pt-2">
                          <Link
                            href={`/work/${item.featuredSlug}`}
                            className="group/link inline-flex items-center gap-2 type-meta font-bold text-blue-primary transition-colors hover:text-blue-deep"
                          >
                            <span>Buka studi kasus</span>
                            <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                              →
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* 3. Media Preview (if image available) */}
                    {item.imageFragment && (
                      <div className="lg:col-span-4 mt-2 lg:mt-0">
                        <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-md border border-ink/10 bg-ink">
                          <OptimizedImage
                            src={item.imageFragment}
                            alt={`${item.year} · ${item.title}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 30vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/60 via-transparent to-transparent pointer-events-none" />
                          <span className="type-meta absolute bottom-2.5 left-3 text-xs text-white/90 font-medium">
                            Dokumentasi {item.year}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}