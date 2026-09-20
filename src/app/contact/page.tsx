import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/lib/site-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Contact", description: "Book a focused working session with Spartan.", path: "/contact/" });

export default function ContactPage() {
  return (
    <main id="main-content" className="contact-page">
      <div className="shell contact-layout"><div><p className="eyebrow">Start a project</p><h1>Bring the hard part.</h1><p>Use a focused working session to map the workflow, constraints, decision owners, and the smallest useful first build.</p></div><aside className="contact-card"><p className="eyebrow">30-minute working session</p><h2>One conversation. A clearer boundary.</h2><p>No form, mailing list, or automated funnel. Choose a time and bring the context that matters.</p><a className="button button--light" href={siteConfig.calendarUrl}>Choose a time <ArrowUpRight aria-hidden="true" /></a></aside></div>
    </main>
  );
}

