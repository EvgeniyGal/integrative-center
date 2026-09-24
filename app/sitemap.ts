import type { MetadataRoute } from "next";

import {
  getPublishedArticles,
  getVisibleServices,
} from "@/lib/content/queries";
import { pages } from "@/lib/seo";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = Object.values(pages).map(
    (page) => ({
      url: page.path === "/" ? site.url : `${site.url}${page.path}`,
      changeFrequency: page.path === "/" ? "weekly" : "monthly",
      priority: page.path === "/" ? 1 : page.path === "/services" || page.path === "/news" ? 0.9 : 0.7,
    }),
  );

  let serviceEntries: MetadataRoute.Sitemap = [];
  let articleEntries: MetadataRoute.Sitemap = [];

  try {
    const [services, articles] = await Promise.all([
      getVisibleServices(),
      getPublishedArticles(),
    ]);

    serviceEntries = services.map((service) => ({
      url: `${site.url}/services/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    articleEntries = articles.map((article) => ({
      url: `${site.url}/news/${article.slug}`,
      lastModified: article.updatedAt ?? article.publishedAt ?? undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Build/preview without DB should still expose static routes.
  }

  return [...staticEntries, ...serviceEntries, ...articleEntries];
}
