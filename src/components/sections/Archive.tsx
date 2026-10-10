"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Section } from "@/components/ui/Section";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { ArcLines } from "@/components/ui/ArcLines";
import { archiveData } from "@/lib/data/archive";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Category = "ALL" | "TECH" | "CREATIVE" | "MEDIA" | "ORGANIZATION" | "ACADEMIC" | "EXPERIMENTS";

const categories: Category[] = [
  "ALL",
  "TECH",
  "CREATIVE",
  "MEDIA",
  "ORGANIZATION",
  "ACADEMIC",
  "EXPERIMENTS",
];

export function Archive() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const reducedMotion = useReducedMotion();

  const publication = archiveData.find((item) => item.id === "icvee-2026-paper");

  const filteredItems = activeCategory === "ALL"
    ? archiveData
    : archiveData.filter((item) => item.category === activeCategory);

  return (
    <Section
      ref={sectionRef}
      id="archive"
      padding="none"
      background="default"
      className="gutter-safe relative overflow-hidden pt-24 md:pt-36 pb-24 md:pb-32"
    >
      {/* Curved line language: shallow horizon arc across the catalog */}
      <div
        className="pointer-events-none absolute -top-[10%] left-1/2 h-[700px] w-[1500px] -translate-x-1/2 text-blue-primary/20 lg:h-[860px] lg:w-[2000px]"
        aria-hidden="true"
      >
        <ArcLines variant="horizon" stroke="rgba(7,89,155,0.22)" accent="#2f9dea" weight="hair" />
      </div>

      <Container size="content" className="relative z-10">
        {/* Header */}
        <div className="relative mb-12 md:mb-16">
          <span
            aria-hidden="true"
            className="type-display pointer-events-none absolute -left-1 -top-8 select-none text-[96px] leading-none text-ink/[0.055] sm:text-[140px] lg:text-[180px]"
          >
            05
          </span>

          <div className="relative max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="type-meta font-bold text-blue-primary">05</span>
              <span className="type-meta font-bold text-blue-primary">Arsip</span>
              <span className="h-3 w-px bg-ink/20" />
              <span className="type-meta text-muted">Catatan lengkap</span>
            </div>
            <Heading
              as="h2"
              size="display"
              className="type-display text-[30px] leading-[0.96] text-ink sm:text-[42px] lg:text-[54px]"
            >
              Catatan proyek, produksi, dan peran.
            </Heading>
            <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg">
              {archiveData.length} entri terdokumentasi. Saring berdasarkan bidang untuk
              menelusuri ranah tertentu.
            </p>
          </div>
        </div>

        {/* Featured academic publication, a record block, not a badge */}
        {publication && (
          <div className="mb-10 border-y border-ink/12 py-7 md:py-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="type-meta font-bold text-blue-primary">Publikasi akademik</span>
                  <span className="h-3 w-px bg-ink/20" />
                  <span className="type-meta text-muted">{publication.venue}</span>
                </div>

                <h3 className="mt-3 max-w-[46ch] font-heading text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
                  {publication.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {publication.authors}
                </p>

                <p className="type-meta mt-2 text-muted">
                  {publication.track} · Peran: {publication.role}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-6 lg:col-span-4 lg:items-end lg:text-right">
                <div>
                  <span className="type-meta block text-muted">Status</span>
                  <span className="mt-1 block font-heading text-lg font-bold tracking-tight text-blue-primary">
                    {publication.status}
                  </span>
                  <span className="type-meta mt-1 block text-muted">
                    Belum terbit sebagai prosiding
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar, index tabs, not pills */}
        <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-ink/12 py-4">
          {categories.map((cat) => {
            const count = cat === "ALL"
              ? archiveData.length
              : archiveData.filter((i) => i.category === cat).length;
            const active = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "type-meta inline-flex items-baseline gap-2 pb-0.5 transition-colors cursor-pointer border-b",
                  active
                    ? "border-blue-electric text-blue-deep font-bold"
                    : "border-transparent text-muted hover:text-ink"
                )}
                aria-pressed={active}
              >
                <span>{cat}</span>
                <span className={cn("text-[10px]", active ? "text-blue-primary" : "text-muted")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Catalog grid */}
        <motion.div layout className="grid grid-cols-1 gap-px bg-ink/12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const previewSrc = item.thumbnail || item.images?.[0];
              const isFeature = index === 0 && activeCategory === "ALL";

              return (
                <motion.article
                  key={item.id}
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { duration: 0.35, delay: Math.min(index * 0.02, 0.2) }
                  }
                  className={cn(
                    "group relative flex flex-col justify-between bg-background transition-colors hover:bg-off-white",
                    isFeature && "sm:col-span-2"
                  )}
                >
                  <div>
                    {previewSrc && (
                      <div
                        className={cn(
                          "relative overflow-hidden bg-ink",
                          isFeature ? "aspect-[21/9]" : "aspect-[16/10]"
                        )}
                      >
                        <OptimizedImage
                          src={previewSrc}
                          alt={`${item.title} · dokumentasi`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/70 via-transparent to-transparent" />
                        <span className="type-meta absolute left-3 top-3 text-white/85">
                          {item.year}
                        </span>
                      </div>
                    )}

                    <div className="p-5 sm:p-6">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="type-meta font-bold text-blue-primary">
                          {item.category}
                        </span>
                        {!previewSrc && (
                          <span className="type-meta text-muted">{item.year}</span>
                        )}
                      </div>

                      <h3 className="font-heading text-lg font-bold leading-snug tracking-tight text-ink transition-colors group-hover:text-blue-primary sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="type-meta mt-2.5 text-muted">{item.role}</p>

                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3.5 sm:px-6">
                    <span className="type-meta text-muted">
                      № {item.id.replace(/-/g, "_")}
                    </span>

                    {item.featuredProjectSlug ? (
                      <Link
                        href={`/work/${item.featuredProjectSlug}`}
                        className="inline-flex items-center gap-1.5 type-meta font-bold text-blue-primary transition-colors hover:text-blue-deep"
                      >
                        <span>Studi kasus</span>
                        <span>→</span>
                      </Link>
                    ) : item.links?.github ? (
                      <a
                        href={item.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="type-meta text-muted transition-colors hover:text-ink"
                      >
                        Repo ↗
                      </a>
                    ) : (
                      <AsteriskMark
                        size={13}
                        strokeWidth={1.4}
                        className="text-ink/25 transition-colors group-hover:text-blue-primary"
                      />
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
    </Section>
  );
}