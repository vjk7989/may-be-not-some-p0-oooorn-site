import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";

import { JsonLd } from "@/lib/json-ld";
import { siteConfig, withBasePath } from "@/lib/site-data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  display: "optional",
  preload: true,
  variable: "--font-onest",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Buckleson — Trust and Execution Infrastructure for AI",
    template: "%s — Buckleson",
  },
  description: siteConfig.description,
  alternates: { canonical: siteConfig.siteUrl },
  openGraph: {
    type: "website",
    siteName: "Buckleson",
    title: "Buckleson — Trust and Execution Infrastructure for AI",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    images: [
      {
        url: `${siteConfig.siteUrl}/brand/buckleson-logo.jpg`,
        width: 322,
        height: 308,
        alt: "Buckleson logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Buckleson — Trust and Execution Infrastructure for AI",
    description: siteConfig.description,
    images: [`${siteConfig.siteUrl}/brand/buckleson-logo.jpg`],
  },
  icons: { icon: withBasePath("/brand/buckleson-icon.svg") },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6F5F2",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Buckleson",
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/brand/buckleson-logo.jpg`,
  description: siteConfig.description,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Buckleson",
  url: siteConfig.siteUrl,
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={onest.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <JsonLd value={[organizationSchema, websiteSchema]} />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
