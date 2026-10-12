export type Category =
  | "TECH"
  | "CREATIVE"
  | "MEDIA"
  | "ORGANIZATION"
  | "LEADERSHIP"
  | "ACADEMIC"
  | "EXPERIMENTS";

export interface FeaturedProject {
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  category: Category;
  role: string;
  tagline: string;
  thumbnail: string;
  /** Measured content box for thumbnails with baked-in letterbox (fractions
      of the natural image) plus the content aspect ratio. When present, the
      project hero renders a content-ratio plate with the letterbox cropped
      away (same technique as the SelectedWork wall) instead of a 16:9 frame. */
  thumbnailCrop?: { x0: number; y0: number; cw: number; ch: number; ar: number };
  images: string[];
  links: {
    live?: string;
    github?: string;
    demo?: string;
  };
  featured: true;
  what?: string;
  why?: string;
  roleDetail?: string;
  process?: string;
  decisions?: string;
  technology?: string[];
  outcome?: string;
  learning?: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  year: string;
  category: Category;
  role: string;
  description: string;
  thumbnail?: string;
  images?: string[];
  featuredProjectSlug?: string;
  /** External source (e.g. an academic index page) when there is no case study. */
  sourceUrl?: string;
  /** Academic publication metadata. */
  authors?: string;
  venue?: string;
  track?: string;
  status?: string;
  links?: {
    live?: string;
    github?: string;
  };
}

export interface CurrentlyData {
  building: { title: string; description: string; link?: string }[];
  exploring: string[];
  workingWith: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}