"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import Link from "next/link";

const reveal = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

type WallTileData = {
  src: string;
  label: string;
  ar: number;
  x0: number;
  y0: number;
  cw: number;
  ch: number;
  tilt: number;
};

/**
 * One frame of the project wall. Its position is driven by the wall's shared
 * scroll progress: tiles enter slightly scattered (offset, over-rotated) and
 * converge into the masonry as the section scrolls in, each on a staggered
 * band so the wall reads as assembling rather than fading. The scroll
 * transform is skipped under reduced motion.
 */
function WallTile({
  tile,
  index,
  progress,
  reducedMotion,
}: {
  tile: WallTileData;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const dir = index % 2 === 0 ? 1 : -1;
  const p0 = Math.min(index * 0.03, 0.2);
  const y = useTransform(progress, [p0, p0 + 0.55], [dir * 64, 0]);
  const x = useTransform(progress, [p0, p0 + 0.55], [dir * 26, 0]);
  const rotate = useTransform(progress, [p0, p0 + 0.55], [tile.tilt + dir * 6, tile.tilt]);
  const scale = useTransform(progress, [p0, p0 + 0.55], [0.93, 1]);

  return (
    <motion.figure
      style={
        reducedMotion
          ? { aspectRatio: `${tile.ar}`, rotate: tile.tilt }
          : { aspectRatio: `${tile.ar}`, y, x, rotate, scale }
      }
      className="group relative mb-2 block break-inside-avoid overflow-hidden rounded-[4px] bg-blue-abyss sm:mb-3"
    >
      {/* Crop the baked-in letterbox: scale the full image so its measured
          content box fills the frame, then offset it. */}
      <div
        className="absolute"
        style={{
          width: `${100 / tile.cw}%`,
          height: `${100 / tile.ch}%`,
          left: `${-(tile.x0 / tile.cw) * 100}%`,
          top: `${-(tile.y0 / tile.ch) * 100}%`,
        }}
      >
        <OptimizedImage
          src={tile.src}
          alt={tile.label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-blue-deep/80 via-transparent to-transparent" />
      <figcaption className="absolute bottom-2.5 left-2.5 flex items-center gap-2 sm:bottom-3 sm:left-3">
        <AsteriskMark size={11} strokeWidth={1.4} color="#2f9dea" />
        <span className="type-meta text-white/85">{tile.label}</span>
      </figcaption>
    </motion.figure>
  );
}

/**
 * Project wall: real project assets arranged as a dense, staggered collage,
 * the way the reference presents work. No gradients stand in for images.
 *
 * Most exported assets carry a baked-in white letterbox on some or all sides.
 * Each tile therefore records the measured content box (`x0,y0,cw,ch`, as
 * fractions of the natural image) plus the content aspect ratio `ar`. The tile
 * is rendered at `ar`, and the image is scaled and offset so exactly the
 * content box fills the frame; the letterbox is cropped away, never stretched.
 * `tilt` adds the slight rotation the reference wall uses.
 */
const WALL: {
  src: string;
  label: string;
  ar: number;
  x0: number;
  y0: number;
  cw: number;
  ch: number;
  tilt: number;
}[] = [
  { src: "/images/ui-ux/ui-ux-2.webp", label: "UI/UX · antarmuka", ar: 1.462, x0: 0.015, y0: 0.055, cw: 0.968, ch: 0.883, tilt: -1.1 },
  { src: "/images/projects/pkkmb-fkip-uns-2025/teaser.webp", label: "PKKMB · teaser", ar: 0.533, x0: 0.338, y0: 0.015, cw: 0.322, ch: 0.967, tilt: 1.0 },
  { src: "/images/ui-ux/ui-ux-1.webp", label: "UI/UX · katalog", ar: 1.044, x0: 0.12, y0: 0.015, cw: 0.757, ch: 0.967, tilt: -0.8 },
  { src: "/images/projects/pkkmb-fkip-uns-2025/flashmob.webp", label: "PKKMB · flashmob", ar: 2.268, x0: 0.132, y0: 0.239, cw: 0.733, ch: 0.517, tilt: 0.9 },
  { src: "/images/archive/bestari/bestari-1.webp", label: "BESTARI 2024", ar: 0.735, x0: 0.232, y0: 0.015, cw: 0.533, ch: 0.967, tilt: -1.0 },
  { src: "/images/photography/photo-2.webp", label: "Fotografi", ar: 0.75, x0: 0.045, y0: 0.015, cw: 0.908, ch: 0.968, tilt: 0.7 },
  { src: "/images/projects/pkkmb-fkip-uns-2025/logo-animation.webp", label: "PKKMB · logo motion", ar: 2.342, x0: 0.133, y0: 0.25, cw: 0.732, ch: 0.5, tilt: -0.9 },
];

const PROJECTS = [
  {
    num: "01",
    name: "KALANATA",
    meta: "2025–Sekarang · Founder & Developer",
    discipline: "Teknologi · Sistem · AI",
    body: "Kerangka riset personal untuk mengeksplorasi agen AI otonom, tooling developer, dan infrastruktur orkestrasi di ekosistem LLM.",
    specs: ["TypeScript", "Python", "Orkestrasi Agen", "LLM API", "CLI Tooling"],
    href: "/work/kalanata",
  },
  {
    num: "02",
    name: "KINARYA",
    meta: "2024–Sekarang · Full-Stack Developer",
    discipline: "WebGIS · Data Spasial",
    body: "Platform WebGIS desa untuk pemetaan digital UMKM, infrastruktur desa, dan aset publik di Karanganyar, lengkap dengan pencarian geospasial interaktif.",
    specs: ["Laravel", "Leaflet GIS", "PostGIS", "Data Spasial", "Tailwind"],
    href: "/work/kinarya",
  },
  {
    num: "03",
    name: "PKKMB FKIP UNS 2025",
    meta: "2025 · DOP & Koordinator Dokumentasi",
    discipline: "Produksi Media · Videografi",
    body: "Arahan kreatif menyeluruh untuk orientasi mahasiswa baru FKIP UNS: teaser resmi, jingle, koreografi flashmob, motion graphics, logo animation, hingga arsip dokumentasi acara.",
    specs: ["Teaser", "Jingle", "Flashmob", "Logo Motion", "Dokumentasi"],
    href: "/work/pkkmb-fkip-uns-2025",
  },
];

export function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.35"],
  });

  return (
    <Section
      ref={sectionRef}
      id="work"
      padding="none"
      background="blue-deep"
      className="gutter-safe relative overflow-hidden pt-24 md:pt-36 pb-24 md:pb-32 text-white"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-1/4 top-[6%] h-[400px] w-[400px] rounded-full bg-blue-electric/12 blur-[80px]" />
        <div className="absolute -right-1/4 bottom-[10%] h-[400px] w-[400px] rounded-full bg-blue-primary/25 blur-[80px]" />
      </div>

      <Container size="content" className="relative z-10">
        {/* ---- Header ---------------------------------------------------- */}
        <div className="relative mb-12 md:mb-16">
          <span
            aria-hidden="true"
            className="type-display pointer-events-none absolute -left-1 -top-10 select-none text-[110px] leading-none text-white/[0.06] sm:text-[170px] lg:-top-16 lg:text-[230px]"
          >
            03
          </span>

          <div className="relative max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="type-meta font-bold text-blue-bright">03</span>
              <span className="type-meta font-bold text-blue-bright">Karya Pilihan</span>
              <span className="h-3 w-px bg-white/25" />
              <span className="type-meta text-white/60">Tiga proyek utama</span>
            </div>

            <h2 className="type-display text-[34px] leading-[0.94] text-white sm:text-[48px] lg:text-[64px]">
              Tiga inisiatif, tiga bahasa visual yang berbeda.
            </h2>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-white/60 sm:text-lg">
              Infrastruktur agen AI, data spasial, dan produksi media kreatif. Masing-masing
              dibangun dari kumpulan batasan yang tidak sama.
            </p>
          </div>
        </div>

        {/* ---- Project wall: dense staggered collage of real assets ------
             This is the reference's defining gesture: work shown as a wall of
             mixed-height frames, not one image per row with an empty gutter.
             Each frame is rendered at its content ratio, and the image is
             scaled/offset so the measured content box fills it exactly, the
             baked-in white letterbox is cropped away, never stretched. */}
        <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:columns-4">
          {WALL.map((tile, i) => (
            <WallTile
              key={tile.src}
              tile={tile}
              index={i}
              progress={scrollYProgress}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* ---- Three case-study entries: compact, image-led --------------- */}
        <div className="mt-20 border-t border-white/15 md:mt-28">
          {PROJECTS.map((p) => (
            <motion.article
              key={p.href}
              initial={reveal.initial}
              whileInView={reveal.whileInView}
              viewport={reveal.viewport}
              transition={reveal.transition}
              className="group grid gap-5 border-b border-white/15 py-10 md:grid-cols-12 md:gap-10 md:py-12"
            >
              <div key="head" className="flex items-baseline gap-4 md:col-span-4">
                <span className="type-display text-[40px] leading-none text-blue-bright sm:text-[56px]">
                  {p.num}
                </span>
                <div>
                  <h3 className="type-accent text-[30px] leading-[0.95] text-white sm:text-[40px]">
                    {p.name}
                  </h3>
                  <p className="type-meta mt-2 text-white/55">{p.discipline}</p>
                </div>
              </div>

              <div key="body" className="md:col-span-5">
                <p className="type-meta text-white/55">{p.meta}</p>
                <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-white/75 sm:text-base">
                  {p.body}
                </p>
              </div>

              <div key="meta" className="flex flex-col justify-between gap-6 md:col-span-3 md:items-end md:text-right">
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5 md:justify-end">
                  {p.specs.map((s) => (
                    <li key={s} className="type-meta text-white/55">
                      {s}
                    </li>
                  ))}
                </ul>

                <Link
                  href={p.href}
                  className="group/link inline-flex items-center gap-2.5 border-b border-white/25 pb-1.5 type-meta font-bold text-white transition-colors hover:border-blue-bright hover:text-blue-bright"
                >
                  <span>Buka studi kasus</span>
                  <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}