import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CinematicPicture } from "@/components/cinematic-picture";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Projects", description: "Five conceptual systems exploring useful and accountable AI operations.", path: "/project/" });

export default function ProjectIndexPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="shell page-hero__grid"><div><p className="eyebrow">Selected concepts</p><h1>Systems designed around the work.</h1></div><p className="page-hero__intro">These conceptual projects show how Spartan approaches complex workflows. They are design studies, not customer claims.</p></div></section>
      <section className="dark-scene project-index"><div className="shell project-grid">{content.projects.map((project, index) => <Link className={`project-card project-card--${(index % 3) + 1}`} href={`/project/${project.slug}/`} key={project.slug}><CinematicPicture mediaId={project.mediaId} /><div><span>{project.category}</span><h2>{project.title}</h2><p>{project.summary}</p><ArrowUpRight aria-hidden="true" /></div></Link>)}</div></section>
    </main>
  );
}

