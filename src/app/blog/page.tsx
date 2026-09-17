import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { AssessmentCta } from "@/components/assessment-cta";
import { createPageMetadata } from "@/lib/metadata";
import { articleRegistry } from "@/lib/site-data";

export const metadata = createPageMetadata({
  title: "AI Security Guides",
  description:
    "Practical guides to AI agent security, prompt injection prevention, secure inference, LLM data leakage, excessive agency, and AI audit trails.",
  path: "/blog/",
});

export default function BlogPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero shell">
        <p className="section-label">AI security guides</p>
        <h1>Understand the risk before choosing the control.</h1>
        <p>
          Clear, practical explanations for teams connecting AI to sensitive
          information, business tools, and consequential actions.
        </p>
      </section>
      <section className="page-section page-section-white">
        <div className="shell blog-index-list">
          {articleRegistry.map((article) => (
            <Link
              href={`/blog/${article.slug}/`}
              className="blog-index-item"
              key={article.slug}
            >
              <time dateTime={article.publishedAt}>16 Sep 2026</time>
              <div>
                <h2>{article.title}</h2>
                <p>{article.description}</p>
              </div>
              <ArrowUpRight aria-hidden="true" className="size-5 text-[var(--primary)]" />
            </Link>
          ))}
        </div>
      </section>
      <AssessmentCta />
    </main>
  );
}
