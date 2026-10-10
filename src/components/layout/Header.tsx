"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#work", label: "WORK" },
  { href: "#about", label: "ABOUT" },
  { href: "#archive", label: "ARCHIVE" },
  { href: "#contact", label: "CONTACT" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer whenever the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!mobileOpen) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const close = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [mobileOpen]);

  // Escape closes the drawer and returns focus to the trigger.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Click outside closes the dropdown.
  useEffect(() => {
    if (!mobileOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-blue-abyss/80 backdrop-blur-xl border-b border-white/10 shadow-[0_1px_0_rgba(255,255,255,0.04)] text-white"
            : "bg-transparent text-white"
        )}
        role="banner"
      >
        <div className="mx-auto px-6 md:px-12 max-w-7xl">
          <div className="flex h-14 md:h-16 items-center justify-between">
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-bright"
              aria-label="Muhammad Fahry Ali, Beranda"
            >
              <span className="relative block h-6 w-[114px] md:h-6 md:w-[114px]">
                <Image
                  src="/images/brand/fahry-logo-light.png"
                  alt=""
                  fill
                  priority
                  sizes="114px"
                  className="object-contain"
                />
              </span>
              <span className="sr-only">Muhammad Fahry Ali</span>
            </Link>

            <nav className="hidden md:flex items-center gap-9" aria-label="Navigasi utama">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[15px] font-semibold tracking-wide text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-bright rounded-sm"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              ref={buttonRef}
              className="md:hidden flex h-11 w-11 -mr-2 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-bright"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileOpen ? (
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              ) : (
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <line x1={3} y1={12} x2={21} y2={12} />
                  <line x1={3} y1={6} x2={21} y2={6} />
                  <line x1={3} y1={18} x2={21} y2={18} />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Glassmorphism Mobile Dropdown Panel: compact, anchored top-right */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            ref={menuRef}
            id="mobile-nav"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="md:hidden fixed right-4 sm:right-6 top-[calc(3.5rem+6px)] z-50 w-[min(260px,calc(100vw-32px))] max-h-[calc(100svh-5rem)] overflow-y-auto rounded-xl bg-[#06172a]/88 backdrop-blur-xl border border-white/12 p-2 shadow-[0_16px_40px_rgba(2,10,24,0.52)]"
            aria-label="Navigasi seluler"
          >
            <ul className="flex flex-col gap-0.5 w-full" role="menu">
              {navLinks.map((link, i) => (
                <li key={link.href} role="none">
                  <a
                    href={link.href}
                    onClick={() => {
                      setMobileOpen(false);
                      buttonRef.current?.focus();
                    }}
                    role="menuitem"
                    className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-white/85 hover:text-white hover:bg-white/10 focus-visible:bg-white/15 focus-visible:text-white transition-colors focus-visible:outline-none"
                  >
                    <span className="type-meta text-xs font-mono text-blue-bright/80">0{i + 1}</span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}