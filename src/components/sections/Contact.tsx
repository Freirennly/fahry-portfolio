"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { ArcLines } from "@/components/ui/ArcLines";
import { siteConfig } from "@/lib/data/site";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleCopyEmail = async () => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    };
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(siteConfig.email);
        done();
        return;
      }
      throw new Error("clipboard unavailable");
    } catch {
      // Fallback for non-secure contexts where navigator.clipboard is undefined.
      try {
        const ta = document.createElement("textarea");
        ta.value = siteConfig.email;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        done();
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <Section
      id="contact"
      padding="none"
      background="blue-deep"
      className="gutter-safe relative overflow-hidden pt-28 md:pt-40 pb-24 md:pb-32 text-white"
    >
      {/* Field */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-blue-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_120%,rgba(59,130,246,0.22),transparent_60%)]" />
      </div>

      {/* Curved line language: single concentric ring centered on the statement */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] text-white/10 lg:h-[600px] lg:w-[600px]"
        aria-hidden="true"
      >
        <ArcLines variant="orbit" stroke="rgba(255,255,255,0.12)" accent="#2f9dea" weight="hair" />
      </div>

      <Container size="content" className="relative z-10">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1">
            <AsteriskMark size={15} strokeWidth={1.8} color="#2f9dea" />
            <span className="type-meta font-bold text-blue-bright">06</span>
            <span className="type-meta font-bold text-blue-bright">Kontak</span>
            <span className="h-3 w-px bg-white/25" />
            <span className="type-meta text-white/60">Terbuka untuk kolaborasi</span>
          </div>

          {/* The statement as the page's closing object */}
          <h2 className="type-display max-w-[14ch] text-[46px] leading-[0.88] text-white sm:text-[76px] lg:text-[104px]">
            Punya proyek
            <br />
            dalam pikiran?
            <br />
            <span className="type-accent text-blue-bright">Mari bicara.</span>
          </h2>

          <p className="mt-10 max-w-[48ch] text-base leading-relaxed text-white/65 sm:text-lg">
            Sistem web, pemetaan spasial, penyutradaraan video, atau otomasi alur kerja,
            terbuka untuk kolaborasi teknis maupun kerja kreatif.
          </p>

          {/* Actions */}
          <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a
              href={`mailto:${siteConfig.email}`}
              className="group inline-flex h-16 items-center justify-between gap-8 rounded-md bg-white px-6 text-blue-deep transition-colors hover:bg-blue-light"
            >
              <span className="flex flex-col justify-center">
                <span className="type-meta text-blue-primary">Email langsung</span>
                <span className="mt-1.5 font-heading text-base font-bold tracking-tight sm:text-lg">
                  {siteConfig.email}
                </span>
              </span>
              <span
                className="text-xl transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </a>

            <button
              onClick={handleCopyEmail}
              className="inline-flex h-16 items-center justify-center gap-2.5 rounded-md border border-white/25 px-6 text-base font-semibold tracking-tight text-white/80 transition-colors hover:border-blue-bright hover:text-white"
              aria-label="Salin alamat email ke papan klip"
              aria-live="polite"
            >
              <span>{copied ? "✓ Tersalin" : "Salin alamat"}</span>
            </button>
          </div>

          {/* Secondary links + closing metadata rail */}
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/15 pt-8">
            {siteConfig.socials.instagram && (
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 type-meta text-white/65 transition-colors hover:text-white"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden="true"
                >
                  <rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1={17.5} y1={6.5} x2={17.51} y2={6.51} />
                </svg>
                <span>@fahrylsny</span>
              </a>
            )}

            <span className="type-meta text-white/60 text-sm leading-relaxed">
              Tersedia untuk remote & on-site
            </span>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}