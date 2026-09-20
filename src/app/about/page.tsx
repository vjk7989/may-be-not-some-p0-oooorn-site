import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { AssessmentCta } from "@/components/assessment-cta";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { createPageMetadata } from "@/lib/metadata";

const aboutPage = bucklesonSiteContent.pages.find(
  (page) => page.route === "/about/",
)!;

const protectionLayers = [
  {
    eyebrow: "Protect",
    product: bucklesonSiteContent.products.find(
      (product) => product.slug === "hyper-abs",
    )!,
    description:
      "Reduce unnecessary exposure before information reaches an approved inference path.",
  },
  {
    eyebrow: "Control",
    product: bucklesonSiteContent.products.find(
      (product) => product.slug === "hyper-tern",
    )!,
    description:
      "Keep identities, permissions, tools, resources, and actions inside explicit policy boundaries.",
  },
  {
    eyebrow: "Verify",
    product: bucklesonSiteContent.products.find(
      (product) => product.slug === "hyper-0x",
    )!,
    description:
      "Preserve attributable, tamper-evident execution evidence for review, audit, and settlement.",
  },
] as const;

export const metadata = createPageMetadata({
  title: aboutPage.title,
  description: aboutPage.description,
  path: aboutPage.route,
});

export default function AboutPage() {
  const { company } = bucklesonSiteContent;

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero about-hero shell" aria-labelledby="about-title">
        <p className="section-label">About Buckleson</p>
        <h1 id="about-title">Infrastructure for accountable AI execution.</h1>
        <p className="page-hero-lede">{company.mission}</p>
        <div className="page-hero-actions">
          <Button asChild>
            <a href={company.calendarUrl}>
              Book a security assessment
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/products/">Explore the platform</Link>
          </Button>
        </div>
      </section>

      <section
        className="page-section page-section-white about-protection"
        id="how-we-protect"
        aria-labelledby="protection-title"
      >
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">How we protect</p>
            <h2 id="protection-title">
              Three responsibilities around one execution path.
            </h2>
            <p>
              Buckleson focuses on what enters an AI workflow, what it may do,
              and what evidence remains afterward.
            </p>
          </div>

          <ol className="about-protection-grid">
            {protectionLayers.map(({ eyebrow, product, description }, index) => (
              <li className="about-protection-card" key={product.slug}>
                <span className="about-card-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <p className="section-label">{eyebrow}</p>
                <h3>{product.name}</h3>
                <p>{description}</p>
                <StatusBadge status={product.status} />
                <Link href={`/products/${product.slug}/`}>
                  Explore {product.name}
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="page-section shell about-status"
        id="journey"
        aria-labelledby="status-title"
      >
        <div className="section-heading section-heading-split">
          <div>
            <p className="section-label">Where we are</p>
            <h2 id="status-title">Current capability stays separate from ambition.</h2>
          </div>
          <p>
            Buckleson distinguishes what can be evaluated now, what is being
            tested through pilots, what the architecture is designed for, and
            the direction of the company.
          </p>
        </div>

        <ol className="about-status-list">
          {company.stages.map((stage, index) => (
            <li className="about-status-item" key={stage.status}>
              <span className="about-card-index" aria-hidden="true">
                0{index + 1}
              </span>
              <StatusBadge status={stage.status} />
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="page-section page-section-white about-principles"
        aria-labelledby="principles-title"
      >
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Operating principles</p>
            <h2 id="principles-title">Boundaries before promises.</h2>
          </div>
          <div className="about-principles-grid">
            {company.principles.map((principle, index) => (
              <article key={principle.title}>
                <span className="about-card-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="page-section shell about-vision"
        id="vision"
        aria-labelledby="vision-title"
      >
        <div className="about-vision-statement">
          <p className="section-label">Long-term vision</p>
          <h2 id="vision-title">{company.vision}</h2>
          <StatusBadge status="Long-term vision" />
        </div>
        <div className="about-responsibility" aria-labelledby="responsibility-title">
          <p className="section-label">Human responsibility</p>
          <h3 id="responsibility-title">People remain responsible.</h3>
          {company.responsibility.map((statement) => (
            <p key={statement}>{statement}</p>
          ))}
        </div>
      </section>

      <AssessmentCta />
    </main>
  );
}
