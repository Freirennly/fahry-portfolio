import { MetadataRoute } from "next";
import { featuredProjects } from "@/lib/data/featuredProjects";
import { PROVISIONAL_SITE_URL } from "@/lib/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: PROVISIONAL_SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = featuredProjects.map((project) => ({
    url: `${PROVISIONAL_SITE_URL}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...routes, ...projectRoutes];
}
