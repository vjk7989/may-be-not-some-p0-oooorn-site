import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  DatabaseZap,
  FileCheck2,
  Fingerprint,
  LockKeyhole,
} from "lucide-react";

import { AssessmentCta } from "@/components/assessment-cta";
import { PlatformShowcase } from "@/components/platform-showcase";
import { RiskLandscape } from "@/components/risk-landscape";
import { SectionHeading } from "@/components/section-heading";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { ViewportSection } from "@/components/ui/viewport-section";
import {
  articleRegistry,
  industries,
  services,
  siteConfig,
  withBasePath,
} from "@/lib/site-data";

const outcomes = [
  {
    title: "Protect data",
    description:
      "Reduce unnecessary sensitive-data exposure before approved information reaches a model.",
    icon: LockKeyhole,
  },
  {
    title: "Control actions",
    description:
      "Check identities, permissions, tools, resources, and downstream actions against policy.",
    icon: Fingerprint,
  },
  {
    title: "Verify execution",
    description:
      "Preserve attributable, tamper-evident records that support audit and settlement.",
    icon: FileCheck2,
  },
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <ViewportSection className="hero-section">
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="hero-category">A Trust &amp; Execution Layer for AI Infrastructure.</p>
            <h1>We help you use AI safely.</h1>
            <p className="hero-positioning">We secure how AI runs — not what AI thinks.</p>
            <p className="hero-lede">
              For companies, organizations, and individual users connecting AI
              to sensitive data, tools, applications, and devices.
            </p>
            <div className="hero-actions">
              <Button asChild>
                <a href={siteConfig.calendarUrl}>
                  Book a Security Assessment
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </a>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/products/">
                  Explore the platform
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="hero-boundary" aria-label="Buckleson platform overview">
            <div className="boundary-label">Execution boundary</div>
            <div className="boundary-inputs" aria-hidden="true">
              <span>Data</span><span>Models</span><span>Tools</span><span>Actions</span>
            </div>
            <div className="boundary-core">
              <Image
                src={withBasePath("/brand/buckleson-logo.jpg")}
                width={322}
                height={308}
                alt=""
                className="boundary-logo"
              />
              <strong>Buckleson</strong>
              <p>Protection · Policy · Evidence</p>
            </div>
            <div className="boundary-output">
              <DatabaseZap aria-hidden="true" className="size-5" />
              <span>Controlled execution</span>
            </div>
          </div>
        </div>
      </ViewportSection>

      <RiskLandscape />

      <ViewportSection className="outcomes-section">
        <div className="shell">
          <SectionHeading
            title="Three outcomes around every approved AI task."
            description="Layered controls help reduce risk without pretending that one system can make AI universally safe."
          />
          <div className="outcomes-grid">
            {outcomes.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className="outcome-item">
                <div className="outcome-marker" aria-hidden="true">
                  <Icon className="size-5" />
                </div>
                <div className="outcome-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                {index < outcomes.length - 1 ? (
                  <span className="outcome-connector" aria-hidden="true" />
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </ViewportSection>

      <ViewportSection className="products-section" id="platform">
        <div className="shell">
          <SectionHeading
            label="Platform"
            title="One boundary. Three focused products."
            description="Each product owns a different responsibility: protect information, control execution, or preserve evidence."
          />
          <PlatformShowcase />
        </div>
      </ViewportSection>

      <ViewportSection className="hyper-section">
        <div className="shell hyper-layout">
          <div className="hyper-mark-wrap">
            <Image
              src={withBasePath("/brand/hyper-0x-logo.png")}
              width={1254}
              height={1254}
              alt="Hyper-0x logo"
              className="hyper-mark"
              loading="lazy"
            />
          </div>
          <div className="hyper-copy">
            <StatusBadge status="Current capability" />
            <h2>Evidence that is harder to rewrite after the fact.</h2>
            <p>
              Hyper-0x is Buckleson’s in-house blockchain for tamper-evident
              execution records, verification, audit, and settlement. It can
              preserve evidence of what was authorized and recorded; it does not
              prove that a model response is true or make private data confidential.
            </p>
            <dl className="hyper-definitions">
              <div><dt>Record</dt><dd>Attributable events from an approved execution path.</dd></div>
              <div><dt>Verify</dt><dd>Detect changes to recorded evidence.</dd></div>
              <div><dt>Audit</dt><dd>Reconstruct a useful chain of activity.</dd></div>
              <div><dt>Settle</dt><dd>Support accountable machine-to-machine outcomes.</dd></div>
            </dl>
            <Button asChild variant="inverse">
              <Link href="/products/#hyper-0x">Explore Hyper-0x</Link>
            </Button>
          </div>
        </div>
      </ViewportSection>

      <ViewportSection className="services-section">
        <div className="shell">
          <div className="services-layout">
            <div className="services-intro">
              <SectionHeading
                label="Services"
                title="Security and model work tied to real requirements."
                description="Start with the workflow, the information it handles, and the actions it is expected to take."
              />
              <Link className="section-link" href="/services/">
                View all services <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="service-layout">
              {services.map((service) => (
                <article key={service.slug} id={service.slug} className="service-row">
                  <header>
                    <h3>{service.name}</h3>
                  </header>
                  <div className="service-copy">
                  <p>{service.summary}</p>
                  <p className="service-boundary">{service.boundary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </ViewportSection>

      <ViewportSection className="industries-section">
        <div className="shell industries-layout">
          <div>
            <p className="section-label">Where controls matter</p>
            <h2>Built for AI connected to consequential systems.</h2>
          </div>
          <ul>
            {industries.map((industry) => <li key={industry}>{industry}</li>)}
          </ul>
        </div>
      </ViewportSection>

      <ViewportSection className="articles-section">
        <div className="shell">
          <SectionHeading
            label="Field notes"
            title="Understand the risks before choosing the controls."
          />
          <div className="article-preview-list">
            {articleRegistry.slice(0, 3).map((article, index) => (
              <Link href={`/blog/${article.slug}/`} key={article.slug} className="article-preview">
                <span>Guide 0{index + 1}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <ArrowUpRight aria-hidden="true" className="size-5" />
              </Link>
            ))}
          </div>
          <Link className="section-link" href="/blog/">
            Read all guides <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </ViewportSection>

      <AssessmentCta />
    </main>
  );
}
