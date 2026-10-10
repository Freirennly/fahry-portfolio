"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArcLines } from "@/components/ui/ArcLines";
import { disciplinesData } from "@/lib/data/skills";

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <Section
      ref={sectionRef}
      id="skills"
      padding="none"
      background="off-white"
      className="gutter-safe relative overflow-hidden pt-24 md:pt-36 pb-24 md:pb-32"
    >
      {/* Simplified curved line language: single long arc on the right */}
      <div
        className="pointer-events-none absolute -right-[8%] top-1/2 h-[400px] w-[400px] -translate-y-1/2 text-blue-primary/20 lg:h-[500px] lg:w-[500px]"
        aria-hidden="true"
      >
        <ArcLines variant="orbit" stroke="rgba(7,89,155,0.20)" accent="#2f9dea" weight="hair" />
      </div>

      <Container size="content" className="relative z-10">
        <div className="relative mb-16 md:mb-20">
          <div className="relative max-w-3xl">
            <div className="mb-5 flex items-center gap-x-3 gap-y-1">
              <span className="type-meta font-bold text-blue-primary">04</span>
              <span className="type-meta font-bold text-blue-primary">Yang saya kerjakan</span>
              <span className="h-3 w-px bg-ink/20" />
              <span className="type-meta text-muted">Rentang kemampuan</span>
            </div>
            <Heading
              as="h2"
              size="display"
              className="type-display text-[30px] leading-[0.96] text-ink sm:text-[42px] lg:text-[54px]"
            >
              Empat bidang yang membentuk cara saya berpikir, membangun, dan memimpin.
            </Heading>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">
              Bukan daftar lencana teknologi, tapi kerangka kerja yang mencakup perangkat
              lunak, arahan visual, tata kelola, dan alur kerja otonom.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {disciplinesData.map((discipline, index) => (
            <motion.article
              key={discipline.key}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col bg-off-white p-6 sm:p-8 rounded-lg transition-colors hover:bg-white"
            >
              <div>
                {/* Discipline header: index marker + label */}
                <div className="mb-6 flex items-baseline gap-3 border-b border-ink/12 pb-4">
                  <span className="type-meta font-bold text-blue-primary">
                    {index + 1}
                  </span>
                  <span className="type-meta text-muted">{discipline.label}</span>
                </div>

                <h3 className="type-display text-[32px] leading-[0.88] text-ink transition-colors group-hover:text-blue-primary sm:text-[40px]">
                  {discipline.label}
                </h3>

                <p className="mt-3 type-meta text-blue-primary">
                  {discipline.tagline}
                </p>

                <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
                  {discipline.description}
                </p>

                {/* Focus areas as a label list, not pills */}
                <dl className="mt-5 border-t border-ink/12 pt-4">
                  <dt className="type-meta text-muted">Fokus utama</dt>
                  <dd className="mt-2 space-y-1">
                    {discipline.focusAreas.map((area) => (
                      <p
                        key={area}
                        className="flex items-baseline gap-1.5 text-[15px] text-ink/85"
                      >
                        <span className="text-blue-primary">·</span>
                        <span>{area}</span>
                      </p>
                    ))}
                  </dd>
                </dl>
              </div>

              {/* Tools as metadata line */}
              <div className="mt-6">
                <p className="type-meta text-muted">Perangkat pilihan</p>
                <p className="mt-2 text-[15px] type-meta normal-case tracking-normal text-ink/70">
                  {discipline.tools.join(" · ")}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}