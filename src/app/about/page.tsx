import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CinematicPicture } from "@/components/cinematic-picture";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "About", description: "The disciplines and operating principles behind Spartan.", path: "/about/" });

export default function AboutPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="shell page-hero__grid"><div><p className="eyebrow">About Spartan</p><h1>We build the operating layer around ambitious AI.</h1></div><p className="page-hero__intro">Spartan is an independent concept studio bringing systems architecture, model engineering, experience design, and reliability practice into one delivery process.</p></div></section>
      <div className="page-media"><CinematicPicture mediaId="frontier" eager sizes="100vw" /></div>
      <section className="content-section shell split-section"><div><p className="eyebrow">Our point of view</p><h2>Complex systems need clear human ownership.</h2></div><div><p>We start with the work: who makes the decision, what context matters, which actions are allowed, and what recovery looks like. That keeps technology in service of an operating model people can actually use.</p><div className="ruled-list">{content.disciplines.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div></div></section>
      <section className="vision-scene"><CinematicPicture mediaId="gateway" className="vision-media" /><div className="shell vision-layout"><div><p className="eyebrow">Independent by design</p><h2>Small enough to stay close. Technical enough to go deep.</h2></div><div><p>The studio forms focused teams around the boundary of each project and leaves behind a system, evidence, and a team that understands how to operate it.</p><Link href="/contact/">Start the conversation <ArrowUpRight aria-hidden="true" /></Link></div></div></section>
    </main>
  );
}
