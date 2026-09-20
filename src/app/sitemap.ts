import type { MetadataRoute } from "next";

import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { siteConfig } from "@/lib/site-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/digital-brain", "/project", "/about", "/articles", "/contact", "/policies/terms-conditions", "/policies/privacy-policy"];
  const projectRoutes = content.projects.map((project) => `/project/${project.slug}`);
  const articleRoutes = content.articles.map((article) => `/articles/${article.slug}`);
  return [...staticRoutes, ...projectRoutes, ...articleRoutes].map((path) => ({
    url: `${siteConfig.siteUrl}${path}/`.replace(/([^:]\/)\/+/, "$1"),
    lastModified: "2026-09-20",
    changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
