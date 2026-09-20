import type { Metadata, Viewport } from "next";

import { JsonLd } from "@/lib/json-ld";
import { siteConfig, withBasePath } from "@/lib/site-data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SpartanMotion } from "@/components/spartan-motion";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  description: siteConfig.description,
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    type: "website",
    siteName: "Spartan",
    title: "Spartan — Independent AI Systems Studio",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary",
    title: "Spartan — Independent AI Systems Studio",
    description: siteConfig.description,
  },
  icons: { icon: withBasePath("/favicon.svg") },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f1f1ef",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Spartan",
  url: siteConfig.siteUrl,
  description: siteConfig.description,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Spartan",
  url: siteConfig.siteUrl,
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <JsonLd value={[organizationSchema, websiteSchema]} />
        <SiteHeader />
        {children}
        <SiteFooter />
        <SpartanMotion />
      </body>
    </html>
  );
}
