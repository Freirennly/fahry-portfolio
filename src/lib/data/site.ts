import { SiteConfig } from "./types";

/**
 * PROVISIONAL SITE URL CONFIGURATION
 * CAUTION: "https://fahryali.com" is an unconfirmed provisional placeholder domain.
 * The user has not explicitly confirmed their production domain.
 * Set the real origin via the NEXT_PUBLIC_SITE_URL environment variable.
 *
 * A trailing slash is trimmed so route concatenation (e.g. `${url}/work/x`)
 * and sitemap/canonical URLs never produce a double slash.
 */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fahryali.com";

export const PROVISIONAL_SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

/** Raster social preview. SVG project thumbnails are not usable as og:image. */
export const SITE_OG_IMAGE = "/images/projects/pkkmb-fkip-uns-2025/teaser.webp";

export const siteConfig: SiteConfig = {
  name: "Muhammad Fahry Ali",
  title: "Portfolio",
  email: "fahrymn64@gmail.com",
  phone: "+62 85171590464",
  location: "Solo, Indonesia",
  socials: {
    instagram: "https://instagram.com/fahrylsny",
  },
};

export const navLinks = [
  { href: "#work", label: "WORK" },
  { href: "#about", label: "ABOUT" },
  { href: "#archive", label: "ARCHIVE" },
  { href: "#contact", label: "CONTACT" },
] as const;