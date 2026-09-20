import type { MetadataRoute } from "next";

import { articleRegistry, siteConfig } from "@/lib/site-data";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/services", "/about", "/blog"];
  const productRoutes = bucklesonSiteContent.products.map(
    (product) => `/products/${product.slug}`,
  );
  return [
    ...[...staticRoutes, ...productRoutes].map((path) => ({
      url: `${siteConfig.siteUrl}${path}/`.replace(/([^:]\/)\/+/, "$1"),
      lastModified: "2026-09-16",
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...articleRegistry.map((article) => ({
      url: `${siteConfig.siteUrl}/blog/${article.slug}/`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
