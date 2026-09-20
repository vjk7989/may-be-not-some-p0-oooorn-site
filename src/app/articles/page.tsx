import type { Metadata } from "next";
import Link from "next/link";

import { CinematicPicture } from "@/components/cinematic-picture";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Articles", description: "Working notes on private AI, autonomous systems, and human-centered automation.", path: "/articles/" });

export default function ArticlesPage() {
  return (
    <main id="main-content" className="article-index">
      <section className="page-hero"><div className="shell page-hero__grid"><div><p className="eyebrow">Field notes</p><h1>Intelligence by design.</h1></div><p className="page-hero__intro">Practical frameworks for teams building AI systems that must remain useful, observable, and accountable.</p></div></section>
      <div className="shell article-grid">{content.articles.map((article) => <Link href={`/articles/${article.slug}/`} key={article.slug}><CinematicPicture mediaId={article.mediaId} /><span>{article.category}</span><h2>{article.title}</h2><p>{article.description}</p><small>{article.readingTime}</small></Link>)}</div>
    </main>
  );
}

