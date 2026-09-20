import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { CinematicPicture } from "@/components/cinematic-picture";
import { getProjectBySlug, spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";

export function generateStaticParams() { return content.projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/project/[slug]">): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  if (!project) return {};
  return createPageMetadata({ title: project.title, description: project.summary, path: `/project/${project.slug}/` });
}

export default async function ProjectDetailPage({ params }: PageProps<"/project/[slug]">) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  const index = content.projects.findIndex((item) => item.slug === project.slug);
  const next = content.projects[(index + 1) % content.projects.length];
  return (
    <main id="main-content">
      <section className="detail-hero"><CinematicPicture mediaId={project.mediaId} eager sizes="100vw" /><div className="shell detail-hero__copy"><p className="eyebrow">{project.category}</p><h1>{project.title}</h1><p>{project.summary}</p></div></section>
      <section className="shell project-story"><article><h2>The challenge</h2><p>{project.challenge}</p></article><article><h2>The approach</h2><p>{project.approach}</p></article><article><h2>The outcome</h2><p>{project.outcome}</p></article><article><h2>System capabilities</h2><div className="capability-tags">{project.capabilities.map((item) => <span key={item}>{item}</span>)}</div></article></section>
      <Link className="shell next-project" href={`/project/${next.slug}/`}><span><small>Next concept</small><h2>{next.title}</h2></span><ArrowRight aria-hidden="true" /></Link>
    </main>
  );
}

