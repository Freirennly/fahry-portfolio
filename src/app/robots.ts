import { MetadataRoute } from "next";
import { PROVISIONAL_SITE_URL } from "@/lib/data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${PROVISIONAL_SITE_URL}/sitemap.xml`,
  };
}
