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
  const fontCss = `
    @font-face{font-family:"Inter Display";src:url("${withBasePath("/spartan-reference/bHYNJqzTyl2lqvmMiRRS6Y16Es.woff2")}") format("woff2");font-weight:400;font-display:swap}
    @font-face{font-family:"Inter Display";src:url("${withBasePath("/spartan-reference/iwWTDc49ENF2tCHbqlNARXw6Ug.woff2")}") format("woff2");font-weight:500;font-display:swap}
    @font-face{font-family:"Inter Display";src:url("${withBasePath("/spartan-reference/PfdOpgzFf7N2Uye9JX7xRKYTgSc.woff2")}") format("woff2");font-weight:600;font-display:swap}
    @font-face{font-family:"Editorial";src:url("${withBasePath("/spartan-reference/XVuJxrEXb8jdhTKGx0Zqrz5EU.woff2")}") format("woff2");font-weight:400;font-display:swap}
  `;
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: fontCss }} />
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
