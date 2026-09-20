import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CinematicPicture } from "@/components/cinematic-picture";
import { Badge } from "@/components/ui/badge";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Digital Brain", description: content.product.summary, path: "/digital-brain/" });

export default function DigitalBrainPage() {
  return (
    <main id="main-content">
      <section className="page-hero page-hero--dark"><div className="shell page-hero__grid" data-motion-section><div><Badge>{content.product.eyebrow}</Badge><h1>{content.product.title}</h1></div><div className="page-hero__intro"><p>{content.product.summary}</p><Link className="button button--light" href="/contact/">Discuss the system <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
      <div className="page-media"><CinematicPicture mediaId={content.product.mediaId} eager sizes="100vw" /></div>
      <section className="content-section shell split-section" data-motion-section><div><p className="eyebrow">Neural operations command</p><h2>One view across context, work, and review.</h2></div><div className="ruled-list">{content.product.capabilities.map((item, index) => <article key={item.title} data-motion-item><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></section>
      <section className="vision-scene" data-motion-section><CinematicPicture mediaId="evidence-grid" className="vision-media" /><div className="shell vision-layout"><div><p className="eyebrow">A dynamic operating layer</p><h2>Context becomes useful when its source and next action remain visible.</h2></div><div><p>Digital Brain is a design direction for teams who need more than a chat window. It brings retrieval, workflow state, approvals, and evidence into one legible system.</p><Link href="/contact/">Plan a working session <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
      <section className="content-section shell"><div className="section-intro"><p className="eyebrow">System principles</p><h2>Private where needed. Observable everywhere.</h2></div><div className="signal-grid"><article><strong>01</strong><h2>Approved context</h2><p>Use deliberate sources and preserve where each contribution came from.</p></article><article><strong>02</strong><h2>Bounded execution</h2><p>Connect only the tools, identities, and actions the workflow requires.</p></article><article><strong>03</strong><h2>Visible recovery</h2><p>Make exceptions, review, and the path back to a safe state first-class.</p></article></div></section>
    </main>
  );
}

