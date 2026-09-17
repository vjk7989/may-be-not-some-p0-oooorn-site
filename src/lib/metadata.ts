import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-data";

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const canonicalPath = path.endsWith("/") ? path : `${path}/`;
  const canonicalUrl = `${siteConfig.siteUrl}${canonicalPath === "/" ? "" : canonicalPath}`;
  const logoUrl = `${siteConfig.siteUrl}/brand/buckleson-logo.jpg`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type,
      title: `${title} — Buckleson`,
      description,
      url: canonicalUrl,
      siteName: "Buckleson",
      images: [
        {
          url: logoUrl,
          width: 322,
          height: 308,
          alt: "Buckleson logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${title} — Buckleson`,
      description,
      images: [logoUrl],
    },
    robots: { index: true, follow: true },
  };
}

export function absoluteUrl(path: string) {
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
