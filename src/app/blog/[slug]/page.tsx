import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { articleLoaders } from "@/lib/articles";
import { JsonLd } from "@/lib/json-ld";
import { absoluteUrl, createPageMetadata } from "@/lib/metadata";
import { articleRegistry, siteConfig } from "@/lib/site-data";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articleRegistry.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articleRegistry.find((item) => item.slug === slug);
  if (!article) return {};

  const metadata = createPageMetadata({
    title: article.seoTitle,
    description: article.description,
    path: `/blog/${article.slug}/`,
    type: "article",
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articleRegistry.find((item) => item.slug === slug);
  const loader = articleLoaders[slug];
  if (!article || !loader) notFound();

  const { default: Article } = await loader();
  const articleUrl = absoluteUrl(`/blog/${article.slug}/`);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      mainEntityOfPage: articleUrl,
      author: { "@type": "Organization", name: "Buckleson" },
      publisher: {
        "@type": "Organization",
        name: "Buckleson",
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.siteUrl}/brand/buckleson-logo.jpg`,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog/") },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    },
  ];

  return (
    <main id="main-content" tabIndex={-1}>
      <JsonLd value={schema} />
      <article className="article-shell article-prose">
        <nav className="article-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/blog/">Blog</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{article.primaryKeyword}</span>
        </nav>
        <Article />
      </article>
    </main>
  );
}
