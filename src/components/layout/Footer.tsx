import Link from "next/link";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { ArcLines } from "@/components/ui/ArcLines";
import { siteConfig } from "@/lib/data/site";

/**
 * Deterministic build-year constant.
 *
 * Must NOT be computed via `new Date()` during render: the footer is rendered
 * on the server and hydrated on the client, so any clock read at render time
 * can make the two disagree (e.g. across a year boundary). A fixed constant
 * guarantees identical output on both sides.
 */
const CURRENT_YEAR = 2026;

const navGroups = [
  {
    title: "Bagian",
    links: [
      { href: "#work", label: "Karya Pilihan" },
      { href: "#journey", label: "Perjalanan" },
      { href: "#about", label: "Identitas" },
      { href: "#skills", label: "Yang Saya Kerjakan" },
      { href: "#archive", label: "Arsip" },
      { href: "#contact", label: "Kontak" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="gutter-safe relative overflow-hidden border-t border-white/12 bg-blue-deep text-white"
      role="contentinfo"
    >
      {/* Curved line language continues into the footer */}
      <div
        className="pointer-events-none absolute -bottom-[55%] left-1/2 h-[900px] w-[1500px] -translate-x-1/2 text-white/10"
        aria-hidden="true"
      >
        <ArcLines variant="horizon" stroke="rgba(255,255,255,0.14)" accent="#2f9dea" weight="hair" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        {/* Oversized wordmark band */}
        <div className="mb-14 flex flex-col gap-6 border-b border-white/12 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="group inline-flex items-baseline gap-3 focus-visible:outline-none"
              aria-label="Muhammad Fahry Ali, home"
            >
              <span className="type-display text-[40px] leading-none text-white sm:text-[56px]">
                FAHRY
              </span>
              <AsteriskMark
                size={22}
                strokeWidth={1.2}
                points={8}
                className="text-blue-bright transition-transform duration-700 group-hover:rotate-180"
              />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/55">
              Arsip digital personal Muhammad Fahry Ali, mendokumentasikan produksi
              visual, tata kelola kemahasiswaan, aplikasi WebGIS, otomasi Python, dan
              eksperimen agen AI.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
          <div className="md:col-span-2">
            <h3 className="type-meta mb-5 text-white/60">Indeks arsip</h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-0 sm:max-w-md">
              {navGroups[0].links.map((link) => (
                <li key={link.href} className="border-b border-white/10 py-2.5">
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-blue-bright"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="type-meta mb-5 text-white/60">Kontak</h3>
            <address className="not-italic">
              <div className="border-b border-white/10 py-2.5">
                <span className="type-meta block text-white/55">Email langsung</span>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="mt-1.5 inline-block font-heading text-lg font-bold tracking-tight text-white transition-colors hover:text-blue-bright"
                >
                  {siteConfig.email}
                </a>
              </div>
              {siteConfig.socials.instagram && (
                <div className="border-b border-white/10 py-2.5">
                  <span className="type-meta block text-white/55">Instagram</span>
                  <a
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-white/75 transition-colors hover:text-blue-bright"
                  >
                    <span>@fahrylsny</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/12 pt-8 sm:flex-row sm:items-center">
          <p className="type-meta text-white/55">
            © {CURRENT_YEAR} Muhammad Fahry Ali
          </p>
        </div>
      </div>
    </footer>
  );
}
