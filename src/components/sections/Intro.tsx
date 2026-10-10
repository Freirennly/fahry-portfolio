"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { ArcLines } from "@/components/ui/ArcLines";

/**
 * Archive metadata. Every value here is drawn from verified CV / portfolio
 * content only. `2021` is the verified inception year (Gamelab internship).
 */
const META_ROWS: { key: string; value: string; detail: string }[] = [
  { key: "Mulai", value: "2021", detail: "Produksi video · Gamelab" },
  { key: "Berbasis", value: "Solo, ID", detail: "Jawa Tengah, Indonesia" },
  { key: "Menempuh", value: "S1 PTIK", detail: "FKIP · Universitas Sebelas Maret" },
];

export function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const figureY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <Section
      ref={sectionRef}
      id="about"
      padding="none"
      background="off-white"
      className="gutter-safe relative overflow-hidden pt-24 md:pt-36 pb-24 md:pb-32"
    >
      {/* Curved line language: a single long horizon arc crossing the spread */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[760px] w-[1500px] -translate-x-1/2 text-blue-primary/25 lg:h-[900px] lg:w-[1900px]"
        aria-hidden="true"
      >
        <ArcLines variant="horizon" stroke="rgba(7,89,155,0.30)" accent="#2f9dea" weight="hair" />
      </div>

      <Container size="content" className="relative z-10">
        {/* ---- Statement block: oversized, off the grid -------------------- */}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-8">
            <span className="type-meta font-bold text-blue-primary">01</span>
            <span className="type-meta font-bold text-blue-primary">Identitas</span>
            <span className="h-3 w-px bg-ink/20" />
            <span className="type-meta text-muted">Arsip personal</span>
          </div>

          <h2 className="type-display max-w-[19ch] text-[38px] leading-[0.92] text-ink sm:text-[58px] lg:text-[82px]">
            Saya mulai dari
            <span className="relative mx-3 inline-block">
              <span className="relative z-10">gambar.</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[0.13em] z-0 h-[0.14em] bg-blue-electric/60"
              />
            </span>
            <br className="hidden sm:block" />
            Lalu sampai ke{" "}
            <span className="type-accent text-blue-primary">sistem.</span>
          </h2>
        </div>

        {/* ---- Two-column editorial body ----------------------------------- */}
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-12">
          {/* Production still: large, offset, with archival plate.
              The project holds no genuine portrait; this is a verified
              behind-the-scenes still, so it is labelled as such. */}
          <motion.div
            style={{ y: reducedMotion ? 0 : figureY }}
            className="md:col-span-5 lg:col-span-4 md:-mt-4"
          >
            <figure className="relative">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                <OptimizedImage
                  src="/images/profile/profile.webp"
                  alt="Pemantauan hasil rekaman pada layar kamera saat produksi media"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 42vw, 33vw"
                  className="object-cover object-[58%_20%] contrast-[1.06] grayscale-[0.18]"
                />
                <div className="absolute inset-0 bg-blue-deep/15 mix-blend-multiply" />
                {/* Corner registration ticks, archival framing */}
                <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-white/70" />
                <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-white/70" />
                <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-white/70" />
                <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-white/70" />
              </div>

              <figcaption className="mt-4 flex items-start justify-between gap-4 border-t border-ink/15 pt-4">
                <div>
                  <p className="type-meta font-bold text-ink">Muhammad Fahry Ali</p>
                  <p className="type-meta mt-1 text-muted">
                    PTIK · FKIP UNS, Solo, Indonesia
                  </p>
                </div>
                <AsteriskMark
                  size={22}
                  strokeWidth={1.6}
                  className="mt-0.5 shrink-0 text-blue-primary"
                />
              </figcaption>
            </figure>
          </motion.div>

          {/* Body copy: kept to a narrow measure, editorial not corporate */}
          <div className="md:col-span-7 lg:col-span-7 lg:col-start-6 space-y-6">
            <p className="max-w-[54ch] text-[17px] leading-relaxed text-ink/80 sm:text-[19px]">
              Fondasi saya visual. Storyboard, kamera, color grading, sound design, soal
              membuat sesuatu terbaca oleh penonton jauh sebelum saya menulis kode.
            </p>

            <p className="max-w-[54ch] text-[15px] leading-relaxed text-muted sm:text-base">
              Mengarahkan tim branding kreatif dan media untuk pameran komersial mengubah
              keterampilan itu menjadi koordinasi. Mengoordinasikan public relations dan
              program desa untuk FKIP Siap Mengabdi dan BEM FKIP mengubah koordinasi
              menjadi strategi, dan strategi butuh bukti.
            </p>

            <p className="max-w-[54ch] text-[15px] leading-relaxed text-muted sm:text-base">
              Di situ sistem mulai masuk. Kuliah Pendidikan Teknik Informatika dan Komputer
              di UNS memberi bahasa formalnya;{" "}
              <strong className="font-semibold text-ink">KINARYA</strong> memberi platform
              WebGIS desa untuk dibangun,{" "}
              <strong className="font-semibold text-ink">otomasi Python</strong> memberi
              cara menghilangkan pekerjaan administratif, dan{" "}
              <strong className="font-semibold text-ink">KALANATA</strong> menjadi tempat
              saya menguji sejauh mana agen AI benar-benar bisa dipercaya.
            </p>

            {/* Capability axis, typographic, not badge soup */}
            <div className="!mt-10 border-t border-ink/15 pt-6">
              <p className="type-meta mb-4 text-muted">Bergerak di bidang</p>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2">
                {[
                  "Videografi & DOP",
                  "Motion & Editing",
                  "Kepemimpinan",
                  "Public Relations",
                  "WebGIS",
                  "Otomasi Python",
                  "Agen AI",
                ].map((skill, i, arr) => (
                  <span key={skill} className="inline-flex items-baseline gap-2">
                    <span className="font-heading text-[15px] font-medium tracking-tight text-ink sm:text-[17px]">
                      {skill}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-blue-primary/70">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Archive metadata strip, a record block, not stat cards */}
          <dl className="md:col-span-12 mt-4 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink/15 pt-8 lg:grid-cols-3">
            {META_ROWS.map((row) => (
              <div key={row.key}>
                <dt className="type-meta text-muted">{row.key}</dt>
                <dd className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink lg:text-3xl">
                  {row.value}
                </dd>
                <p className="type-meta mt-2 normal-case tracking-normal text-muted">
                  {row.detail}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
