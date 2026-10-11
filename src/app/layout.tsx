import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, El_Messiri } from "next/font/google";
import { PROVISIONAL_SITE_URL } from "@/lib/data/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const messiri = El_Messiri({
  variable: "--font-messiri",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(PROVISIONAL_SITE_URL),
  title: {
    default: "Muhammad Fahry Ali · Portofolio",
    template: "%s | Muhammad Fahry Ali",
  },
  description:
    "Arsip personal Muhammad Fahry Ali: produksi media kreatif, kepemimpinan organisasi, sistem web, WebGIS desa, otomasi, dan infrastruktur agen AI.",
  authors: [{ name: "Muhammad Fahry Ali" }],
  creator: "Muhammad Fahry Ali",
  publisher: "Muhammad Fahry Ali",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: PROVISIONAL_SITE_URL,
    siteName: "Muhammad Fahry Ali · Portofolio",
    title: "Muhammad Fahry Ali · Portofolio",
    description:
      "Arsip personal Muhammad Fahry Ali: media kreatif, organisasi, kepemimpinan, WebGIS, otomasi Python, dan agen AI.",
    images: [
      {
        url: "/images/projects/pkkmb-fkip-uns-2025/teaser.webp",
        width: 1200,
        height: 750,
        alt: "Dokumentasi lapangan PKKMB FKIP UNS 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Fahry Ali · Portofolio",
    description:
      "Arsip personal Muhammad Fahry Ali: media kreatif, organisasi, kepemimpinan, WebGIS, otomasi Python, dan agen AI.",
    images: ["/images/projects/pkkmb-fkip-uns-2025/teaser.webp"],
  },
  // Icons resolve via file conventions in src/app (favicon.ico, icon.png,
  // apple-icon.png). No explicit `icons` override: it would duplicate the
  // convention-generated <link> tags.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#06233f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${messiri.variable} h-full antialiased`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col selection:bg-blue-electric selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-blue-deep focus:shadow-lg"
        >
          Lompat ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}