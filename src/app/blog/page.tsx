import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { AssessmentCta } from "@/components/assessment-cta";
import { CinematicPicture } from "@/components/cinematic-picture";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { createPageMetadata } from "@/lib/metadata";
import { articleRegistry } from "@/lib/site-data";

const blogPage = bucklesonSiteContent.pages.find(
  (page) => page.route === "/blog/",
)!;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export const metadata = createPageMetadata({
  title: blogPage.title,
  description: blogPage.description,
  path: blogPage.route,
});

export default function BlogPage() {
  const [featuredArticle, ...articles] = articleRegistry;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero blog-hero shell" aria-labelledby="blog-title">
        <p className="section-label">Buckleson guides</p>
        <h1 id="blog-title">Understand the risk before choosing the control.</h1>
        <p className="page-hero-lede">
          Practical explanations for teams connecting AI to sensitive
          information, business tools, and consequential actions.
        </p>
        <CinematicPicture mediaId="hero-boundary" className="page-hero-media" />
      </section>

      <section
        className="page-section page-section-white blog-featured-section"
        aria-labelledby="featured-title"
      >
        <div className="shell">
          <p className="section-label">Start here</p>
          <Link
            href={`/blog/${featuredArticle.slug}/`}
            className="blog-featured-card"
          >
            <div className="blog-featured-copy">
              <time dateTime={featuredArticle.publishedAt}>
                {formatDate(featuredArticle.publishedAt)}
              </time>
              <h2 id="featured-title">{featuredArticle.title}</h2>
              <p>{featuredArticle.description}</p>
              <span className="blog-card-action">
                Read the guide
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
            <div className="blog-featured-visual" aria-hidden="true">
              <span>Data</span>
              <span>Tools</span>
              <span>Actions</span>
              <ArrowRight />
            </div>
          </Link>
        </div>
      </section>

      <section
        className="page-section shell blog-library"
        aria-labelledby="library-title"
      >
        <div className="section-heading section-heading-split">
          <div>
            <p className="section-label">Guide library</p>
            <h2 id="library-title">Controls for real AI workflows.</h2>
          </div>
          <p>
            Six original guides covering information exposure, unsafe
            instructions, excessive authority, and execution evidence.
          </p>
        </div>

        <div className="blog-card-grid">
          {articles.map((article, index) => (
            <Link
              href={`/blog/${article.slug}/`}
              className="blog-guide-card"
              key={article.slug}
            >
              <div className="blog-guide-meta">
                <span aria-hidden="true">0{index + 2}</span>
                <time dateTime={article.publishedAt}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <span className="blog-card-action">
                Read guide
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AssessmentCta />
    </main>
  );
}
