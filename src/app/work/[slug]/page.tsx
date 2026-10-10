import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { AsteriskMark } from "@/components/ui/AsteriskSymbol";
import { featuredProjects } from "@/lib/data/featuredProjects";
import { siteConfig, SITE_OG_IMAGE } from "@/lib/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = featuredProjects.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Proyek Tidak Ditemukan",
    };
  }

  // Social card: always the single validated raster asset (1200x750). Project
  // thumbnails are excluded because two are SVG placeholders (invalid for OG)
  // and the third is 800x500, which would mismatch the declared dimensions.
  const ogImage = SITE_OG_IMAGE;
  const pageTitle = `${project.title} · Muhammad Fahry Ali`;

  return {
    title: { absolute: pageTitle },
    description: project.tagline,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: project.tagline,
      type: "article",
      url: `/work/${project.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 750,
          alt: project.title,
        },
      ],
      authors: ["Muhammad Fahry Ali"],
      tags: [project.category],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · Muhammad Fahry Ali`,
      description: project.tagline,
      images: [ogImage],
    },
  };
}

const categoryLabels: Record<string, string> = {
  TECH: "TEKNOLOGI & SISTEM",
  CREATIVE: "KREATIF & BRANDING",
  MEDIA: "MEDIA & ARAHAN VIDEO",
  ORGANIZATION: "ORGANISASI & KEPEMIMPINAN",
  ACADEMIC: "AKADEMIK & RISET",
  EXPERIMENTS: "R&D / EKSPERIMEN",
};

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const projectIndex = featuredProjects.findIndex((p) => p.slug === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = featuredProjects[projectIndex];
  const nextProject = featuredProjects[(projectIndex + 1) % featuredProjects.length];

  const facts: { label: string; value: string }[] = [
    { label: "Bidang", value: categoryLabels[project.category] || project.category },
    { label: "Periode", value: project.year },
    { label: "Peran", value: project.role },
  ];

  const narrative: { index: string; kicker: string; title: string; body: string }[] = [
    {
      index: "01",
      kicker: "Konteks",
      title: "Apa yang dihadapi?",
      body: project.what ?? "",
    },
    {
      index: "02",
      kicker: "Alasan",
      title: "Kenapa dikerjakan?",
      body: project.why ?? "",
    },
    {
      index: "03",
      kicker: "Peran & proses",
      title: "Pendekatan dan eksekusi",
      body: `${project.roleDetail ?? ""}\n\n${project.process ?? ""}`.trim(),
    },
    {
      index: "04",
      kicker: "Keputusan",
      title: "Pilihan teknis & kreatif",
      body: project.decisions ?? "",
    },
    {
      index: "05",
      kicker: "Hasil",
      title: "Keluaran dan dampak",
      body: project.outcome ?? "",
    },
    {
      index: "06",
      kicker: "Pembelajaran",
      title: "Catatan balik",
      body: project.learning ?? "",
    },
  ].filter((n) => n.body.length > 0);

  return (
    <article id="main-content" className="min-h-screen bg-background text-foreground">
      {/* Editorial Navigation Bar */}
      <header className="sticky top-0 z-40 bg-off-white/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto px-6 md:px-12 max-w-7xl h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2.5 type-meta text-muted transition-colors hover:text-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border transition-colors group-hover:border-blue-primary group-hover:bg-blue-light/50">
              ←
            </span>
            <span>Kembali ke karya</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="type-meta text-blue-primary">
              0{projectIndex + 1} / 0{featuredProjects.length}
            </span>
            <span className="hidden sm:inline-block h-3 w-px bg-ink/20" />
            <span className="hidden sm:inline-block type-meta text-muted">
              {project.shortTitle}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <Section id="project-hero" padding="xl" background="blue-deep" className="gutter-safe relative overflow-hidden">
        <div className="pointer-events-none absolute -right-[20%] -top-[30%] h-[700px] w-[700px] rounded-full bg-blue-electric/15 blur-[130px]" aria-hidden="true" />

        <Container size="content" className="relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3 type-meta">
              <span className="border border-blue-electric/40 bg-blue-electric/15 px-3 py-1 text-blue-bright">
                {categoryLabels[project.category] || project.category}
              </span>
              <span className="text-white/55">·</span>
              <span className="text-white/70">{project.year}</span>
              <span className="text-white/55">·</span>
              <span className="text-white/70">{project.role}</span>
            </div>

            <h1 className="type-display text-[40px] leading-[0.96] text-white sm:text-[60px] lg:text-[84px]">
              {project.title}
            </h1>

            <p className="max-w-3xl pt-2 text-lg leading-relaxed text-white/80 md:text-2xl">
              {project.tagline}
            </p>
          </div>
        </Container>
      </Section>

      {/* Featured Hero Media */}
      <section className="bg-background pt-10 md:pt-16 pb-6">
        <Container size="content">
          {project.thumbnailCrop ? (
            /* Portrait content with baked-in side letterbox: render a
               content-ratio plate and crop the gutters, never stretch. */
            <div
              className="relative mx-auto max-h-[72svh] w-full max-w-[420px] overflow-hidden border border-border bg-ink md:h-[72svh] md:w-auto"
              style={{ aspectRatio: `${project.thumbnailCrop.ar}` }}
            >
              <div
                className="absolute"
                style={{
                  width: `${100 / project.thumbnailCrop.cw}%`,
                  height: `${100 / project.thumbnailCrop.ch}%`,
                  left: `${-(project.thumbnailCrop.x0 / project.thumbnailCrop.cw) * 100}%`,
                  top: `${-(project.thumbnailCrop.y0 / project.thumbnailCrop.ch) * 100}%`,
                }}
              >
                <OptimizedImage
                  src={project.thumbnail}
                  alt={`${project.title} · tinjauan`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-off-white md:aspect-[21/9]">
              <OptimizedImage
                src={project.thumbnail}
                alt={`${project.title} · tinjauan`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
        </Container>
      </section>

      {/* Spec strip + narrative */}
      <Section id="project-overview" padding="lg" background="default">
        <Container size="content">
          {/* Spec strip, a record block, not a floating card */}
          <dl className="mb-16 grid grid-cols-1 gap-px border-y border-ink/12 bg-ink/12 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-background px-6 py-6">
                <dt className="type-meta text-muted">{fact.label}</dt>
                <dd className="mt-2 font-heading text-lg font-bold tracking-tight text-ink">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Sticky technology rail */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
              <p className="type-meta text-blue-primary">Perangkat &amp; teknologi</p>
              <ul className="mt-5 border-t border-ink/12">
                {project.technology?.map((tech) => (
                  <li
                    key={tech}
                    className="flex items-baseline gap-3 border-b border-ink/12 py-3 text-[15px] text-ink/80"
                  >
                    <span className="text-blue-primary">·</span>
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <a
                  href={`mailto:${siteConfig.email}?subject=Project%20Inquiry%3A%20${encodeURIComponent(project.title)}`}
                  className="inline-flex items-center gap-2 type-meta font-bold text-blue-primary transition-colors hover:text-blue-deep"
                >
                  <span>Bahas proyek ini</span>
                  <span>→</span>
                </a>
              </div>
            </aside>

            {/* Narrative */}
            <div className="space-y-12 lg:col-span-8">
              {narrative.map((block) => (
                <section key={block.index} className="border-t border-ink/12 pt-8">
                  <div className="flex items-baseline gap-3">
                    <span className="type-meta font-bold text-blue-primary">{block.index}</span>
                    <span className="type-meta text-muted">{block.kicker}</span>
                  </div>
                  <Heading as="h2" size="lg" className="type-display mt-3 text-ink">
                    {block.title}
                  </Heading>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-muted md:text-lg">
                    {block.body.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Visual Gallery */}
      {project.images && project.images.length > 0 && (
        <Section id="project-gallery" padding="lg" background="off-white" className="border-t border-border">
          <Container size="content">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="type-meta text-blue-primary">Visual proyek</span>
                <Heading as="h2" size="lg" className="type-display mt-1 text-ink">
                  Media &amp; artefak
                </Heading>
              </div>
              <p className="type-meta text-muted">
                {project.images.length} aset visual terdokumentasi
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-[16/10] overflow-hidden border border-border bg-white"
                >
                  <OptimizedImage
                    src={image}
                    alt={`${project.title} · visual dokumentasi ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2 left-2 border border-white/20 bg-blue-abyss/70 px-2 py-1 type-meta text-white/90">
                    Aset 0{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Next project + closing CTA */}
      <section className="gutter-safe relative overflow-hidden border-t border-blue-primary/30 bg-blue-deep py-16 text-white md:py-24">
        <Container size="content" className="relative z-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="type-meta font-bold text-blue-bright">Karya berikutnya</span>
              <p className="mt-1 type-meta text-white/50">
                0{((projectIndex + 1) % featuredProjects.length) + 1} dari 0{featuredProjects.length}
              </p>
              <h3 className="type-accent mt-2 text-3xl text-white md:text-4xl">
                {nextProject.title}
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/70 md:text-base">
                {nextProject.tagline}
              </p>
              <Link
                href={`/work/${nextProject.slug}`}
                className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-blue-deep transition-colors hover:bg-blue-light"
              >
                <span>Baca studi kasus berikutnya</span>
                <span>→</span>
              </Link>
            </div>

            <div className="space-y-4 md:border-l md:border-white/10 md:pl-12">
              <div className="flex items-center gap-2 text-blue-bright">
                <AsteriskMark size={22} strokeWidth={2} />
                <span className="type-meta font-bold">Kolaborasi</span>
              </div>
              <h3 className="type-display text-2xl text-white md:text-3xl">
                Punya proyek dalam pikiran? Mari bicara.
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-white/70">
                Baik untuk pengembangan teknologi, produksi video kreatif, maupun
                koordinasi proyek.
              </p>
              <div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="type-meta inline-flex items-center gap-2 text-blue-bright underline underline-offset-4 transition-colors hover:text-white"
                >
                  {siteConfig.email} →
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}
