import { spartanSiteContent } from "@/content/spartan-site-content";

const configuredSiteUrl = process.env.SITE_URL?.replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

export function withBasePath(path: string) {
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteConfig = {
  name: spartanSiteContent.company.name,
  description: spartanSiteContent.company.description,
  siteUrl: configuredSiteUrl ?? "https://spartan.example",
  calendarUrl: spartanSiteContent.company.calendarUrl,
} as const;

export const isProductionSite = Boolean(configuredSiteUrl);
export const navigation = spartanSiteContent.navigation;
export const projects = spartanSiteContent.projects;
export const articleRegistry = spartanSiteContent.articles;
