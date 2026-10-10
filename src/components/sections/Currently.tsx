"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ArcLines } from "@/components/ui/ArcLines";
import { currentlyData } from "@/lib/data/currently";
import Link from "next/link";

export function Currently() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const reveal = {
    initial: reducedMotion ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <Section
      ref={sectionRef}
      id="currently"
      padding="none"
      background="blue-deep"
      className="gutter-safe relative overflow-hidden pt-16 md:pt-24 pb-24 md:pb-32 text-white"
    >
      {/* Field + simplified curved line language: single horizon arc */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-blue-deep" />
        <div
          className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 h-[300px] w-[600px] bg-blue-primary/10 blur-[60px] rounded-full"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] text-white/10 md:h-[760px]"
        aria-hidden="true"
      >
        <ArcLines
          variant="horizon"
          stroke="rgba(255,255,255,0.12)"
          accent="#2f9dea"
          weight="hair"
        />
      </div>

      <Container size="content" className="relative z-10">
        {/* Header */}
        <div className="relative mb-14 md:mb-16">
          <div className="relative max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="type-meta font-bold text-blue-bright">Sekarang · 2025–2026</span>
              <span className="h-3 w-px bg-white/25" />
              <span className="type-meta text-white/60">Catatan kerja</span>
            </div>

            <h2 className="type-display text-[34px] leading-[0.94] text-white sm:text-[48px] lg:text-[62px]">
              Yang sedang saya bangun,{" "}
              <span className="type-accent text-blue-bright">pelajari,</span> dan fokuskan.
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/60 sm:text-lg">
              Cuplikan hidup dari pekerjaan teknis, pertanyaan riset terbuka, dan perangkat
              yang sedang aktif dipakai.
            </p>
          </div>
        </div>

        {/* Workspace layout: KALANATA as the dominant plate */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* KALANATA, emphasized, spanning majority of the row */}
          <motion.div {...reveal} className="lg:col-span-7 bg-blue-deep p-6 lg:p-9 rounded-lg">
            <div className="mb-4 flex items-center justify-between border-b border-white/12 pb-3">
              <span className="type-meta font-bold text-blue-bright">
                01 / Produksi aktif
              </span>
            </div>

            <h3 className="type-display text-[44px] leading-[0.88] text-white sm:text-[60px]">
              KALANATA
            </h3>

            <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-white/75">
              Merancang kerangka orkestrasi agen otonom, tooling CLI developer, dan
              harness validasi untuk pipeline LLM multi-langkah.
            </p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="bg-blue-deep py-4 sm:pl-6">
                <dt className="type-meta text-white/60">Sasaran inti</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-white/85">
                  Keandalan agen yang deterministik, bukan sekadar eksekusi probabilistik.
                </dd>
              </div>
              <div className="bg-blue-deep py-4 sm:pl-6">
                <dt className="type-meta text-white/60">Status</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-white/85">
                  Repositori riset personal yang aktif.
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-white/12 pt-4">
              <Link
                href="/work/kalanata"
                className="group/link inline-flex items-center gap-2.5 type-meta font-bold text-blue-bright transition-colors hover:text-white"
              >
                <span>Baca catatan riset KALANATA</span>
                <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Exploring, open list, notebook style */}
          <motion.div {...reveal} className="lg:col-span-5 bg-blue-deep p-6 lg:p-9 rounded-lg">
            <div className="mb-4 flex items-center justify-between border-b border-white/12 pb-3">
              <span className="type-meta font-bold text-blue-bright">
                02 / Riset & pertanyaan
              </span>
              <span className="type-meta text-white/55">Kumpulan terbuka</span>
            </div>

            <h3 className="font-heading text-xl font-bold tracking-tight text-white">Topik eksplorasi</h3>

            <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-white/70">
              Jalur investigasi aktif terhadap tooling dan pola otomasi yang sedang berkembang.
            </p>

            <ol className="mt-6 space-y-2 border-t border-white/12">
              {currentlyData.exploring.map((topic, i) => (
                <li
                  key={topic}
                  className="flex items-baseline gap-4 border-b border-white/12 py-3"
                >
                  <span className="type-meta w-6 shrink-0 text-blue-bright">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-snug text-white/85">{topic}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <span className="type-meta text-white/55">R&D berjalan</span>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}