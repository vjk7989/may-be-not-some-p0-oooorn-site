import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-data";

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const canonicalPath = path.endsWith("/") ? path : `${path}/`;
  const canonicalUrl = `${siteConfig.siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  return {
    title: { absolute: `${title} — Spartan` },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: { type, title: `${title} — Spartan`, description, url: canonicalUrl, siteName: "Spartan" },
    twitter: { card: "summary", title: `${title} — Spartan`, description },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function absoluteUrl(path: string) {
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
