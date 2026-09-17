import { AssessmentCta } from "@/components/assessment-cta";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";
import { services, siteConfig } from "@/lib/site-data";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Buckleson services cover AI security assessments, protection and control around inference, and custom AI model development and fine-tuning.",
  path: "/services/",
});

export default function ServicesPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero shell">
        <p className="section-label">Services</p>
        <h1>Make AI useful inside clear boundaries.</h1>
        <p>
          Security and model work begin with the workflow: its data, identities,
          tools, permissions, actions, and intended outcome.
        </p>
      </section>

      <section className="page-section page-section-white">
        <div className="shell detail-list">
          {services.map((service, index) => (
            <article className="detail-row" id={service.slug} key={service.slug}>
              <div>
                <span className="service-number">0{index + 1}</span>
                <h2>{service.name}</h2>
              </div>
              <div className="detail-copy">
                <p>{service.summary}</p>
                <p><strong>Related platform:</strong> {service.relatedProduct}</p>
                <p className="boundary-copy"><strong>Boundary:</strong> {service.boundary}</p>
                <Button asChild className="mt-6">
                  <a href={siteConfig.calendarUrl}>Discuss this service</a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="inference-boundary-title">
        <div className="section-heading">
          <p className="section-label">Secure inference</p>
          <h2 id="inference-boundary-title">Protection and control around inference.</h2>
          <p>
            Buckleson can help minimize, transform, route, and govern information
            before and around model execution. This wording is deliberate: it is
            not a claim of confidential computing or a guarantee that every model
            response is safe or correct.
          </p>
        </div>
      </section>
      <AssessmentCta />
    </main>
  );
}
