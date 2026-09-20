import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";

import { AssessmentCta } from "@/components/assessment-cta";
import { CinematicPicture } from "@/components/cinematic-picture";
import { Button } from "@/components/ui/button";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { createPageMetadata } from "@/lib/metadata";

const servicesPage = bucklesonSiteContent.pages.find(
  (page) => page.route === "/services/",
)!;

export const metadata = createPageMetadata({
  title: servicesPage.title,
  description: servicesPage.description,
  path: servicesPage.route,
});

export default function ServicesPage() {
  const { company, process, services } = bucklesonSiteContent;

  return (
    <main id="main-content" tabIndex={-1}>
      <section
        className="page-hero services-hero shell"
        aria-labelledby="services-title"
      >
        <p className="section-label">Services</p>
        <h1 id="services-title">Make AI useful inside clear boundaries.</h1>
        <p className="page-hero-lede">
          Start with the workflow—its information, identities, tools,
          permissions, actions, and intended outcome—then choose the smallest
          practical control set.
        </p>
        <Button asChild>
          <a href={company.calendarUrl}>
            Discuss your AI workflow
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
        <CinematicPicture mediaId="hyper-abs-chamber" className="page-hero-media" />
      </section>

      <section
        className="page-section page-section-white services-list-section"
        aria-labelledby="services-list-title"
      >
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">What we do</p>
            <h2 id="services-list-title">
              Services tied to measurable requirements.
            </h2>
          </div>

          <div className="services-editorial-list">
            {services.map((service, index) => (
              <article
                className="service-editorial-row"
                id={service.slug}
                key={service.slug}
              >
                <header className="service-editorial-heading">
                  <span className="service-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{service.name}</h3>
                  <p>{service.summary}</p>
                </header>

                <div className="service-deliverables">
                  <h4>Typical deliverables</h4>
                  <ul>
                    {service.deliverables.map((deliverable) => (
                      <li key={deliverable}>
                        <Check aria-hidden="true" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="service-boundary">
                  <h4>Related platform</h4>
                  <p>{service.relatedProducts.join(" · ")}</p>
                  <h4>Responsibility boundary</h4>
                  <p>{service.boundary}</p>
                  <a href={company.calendarUrl}>
                    Discuss {service.name}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="page-section shell services-process"
        aria-labelledby="process-title"
      >
        <div className="section-heading section-heading-split">
          <div>
            <p className="section-label">Engagement process</p>
            <h2 id="process-title">Assess before adding control.</h2>
          </div>
          <p>
            A compact path from understanding the workflow to preserving useful
            execution evidence.
          </p>
        </div>
        <ol className="services-process-list">
          {process.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <ArrowRight aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>

      <section
        className="page-section page-section-white services-platform-link"
        aria-labelledby="services-platform-title"
      >
        <div className="shell detail-row">
          <div>
            <p className="section-label">Platform connection</p>
            <h2 id="services-platform-title">
              Services lead to explicit product boundaries.
            </h2>
          </div>
          <div className="detail-copy">
            <p>
              Hyper-ABS protects information before inference, Hyper Tern
              constrains execution, and Hyper-0x preserves attributable,
              tamper-evident evidence.
            </p>
            <Button asChild variant="secondary">
              <Link href="/products/">
                Explore Buckleson products
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <AssessmentCta />
    </main>
  );
}
