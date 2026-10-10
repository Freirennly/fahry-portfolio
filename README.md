# Portofolio Muhammad Fahry Ali

Personal archive site: creative media production, organizational leadership, WebGIS, Python automation, and AI-agent research. Static-first Next.js App Router, no database, no backend.

## Requirements

- Node.js 20+ (project uses Next.js 16 and React 19)
- npm

## Setup

```bash
npm install
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL (see below)
```

`NEXT_PUBLIC_SITE_URL` is the public canonical origin used by page metadata, canonical links, Open Graph, `sitemap.xml`, and `robots.txt`. If it is unset, the app falls back to the provisional placeholder in `src/lib/data/site.ts`. Set it to the real production origin (no trailing slash) before deploying.

No secrets are required. The only environment variable is public (`NEXT_PUBLIC_*`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server (webpack) at http://localhost:3000 |
| `npm run build` | Production build (webpack) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Structure

```
src/
  app/
    layout.tsx          root metadata, fonts, skip link
    page.tsx            homepage composition
    work/[slug]/page.tsx  case-study pages (generateStaticParams)
    sitemap.ts          sitemap.xml
    robots.ts           robots.txt
    favicon.ico
  components/
    sections/           homepage sections
    layout/             Header, Footer
    ui/                 Section, Container, Heading, OptimizedImage, ...
    motion/             reduced-motion-aware scroll helpers
  lib/
    data/               site config and content (projects, archive, timeline, skills)
    utils.ts
```

Content lives in `src/lib/data/`. Case studies are defined in `featuredProjects.ts`; archive entries in `archive.ts`.

## Deployment

The site builds to static pages and can be deployed to any Node host or static/edge platform that supports Next.js App Router. Set `NEXT_PUBLIC_SITE_URL` in the host environment before building so metadata and the sitemap use the real domain.
