import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CinematicPicture } from "@/components/cinematic-picture";
import { JsonLd } from "@/lib/json-ld";
import { getArticleBySlug, spartanSiteContent as content } from "@/content/spartan-site-content";
import { absoluteUrl, createPageMetadata } from "@/lib/metadata";

export function generateStaticParams() { return content.articles.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const article = getArticleBySlug((await params).slug);
  if (!article) return {};
  return createPageMetadata({ title: article.title, description: article.description, path: `/articles/${article.slug}/`, type: "article" });
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  const article = getArticleBySlug((await params).slug);
  if (!article) notFound();
  return (
    <main id="main-content" className="shell article-page">
      <JsonLd value={{ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, datePublished: article.publishedAt, author: { "@type": "Organization", name: "Spartan" }, mainEntityOfPage: absoluteUrl(`/articles/${article.slug}/`) }} />
      <header><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="page-hero__intro">{article.description}</p><div className="article-meta"><span>{article.publishedAt}</span><span>{article.readingTime}</span></div></header>
      <CinematicPicture mediaId={article.mediaId} eager sizes="100vw" />
      <div className="article-body">{article.sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div>
    </main>
  );
}
