import { AssessmentCta } from "@/components/assessment-cta";
import { StatusBadge } from "@/components/status-badge";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn Buckleson’s mission, current platform capabilities, protection layers, pilot-stage work, designed-for architecture, and long-term vision.",
  path: "/about/",
});

const layers = [
  {
    index: "Layer 01",
    title: "Reduce exposure with Hyper-ABS",
    body: "Masking, redaction, tokenization, abstraction, and policy-aligned transformations help keep unnecessary sensitive information out of the inference path.",
  },
  {
    index: "Layer 02",
    title: "Control execution with Hyper Tern",
    body: "Identity, routing, permissions, policy, tools, resources, and actions are checked before an agent reaches a downstream system.",
  },
  {
    index: "Layer 03",
    title: "Preserve evidence with Hyper-0x",
    body: "Attributable, tamper-evident execution records support verification, audit, and settlement without claiming to prove that an AI output is true.",
  },
];

export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero shell">
        <p className="section-label">About Buckleson</p>
        <h1>Infrastructure for accountable AI.</h1>
        <p>
          Our Mission is to help companies, organizations, and individual users
          use AI safely by placing practical protection, policy, and evidence
          around execution.
        </p>
      </section>

      <section className="page-section page-section-white" aria-labelledby="protect-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">How We Protect</p>
            <h2 id="protect-title">Security is layered around the work AI performs.</h2>
            <p>
              Models are connected to information and authority through an
              operating path. Buckleson focuses on that path: what enters it,
              what may act, and what evidence remains afterward.
            </p>
          </div>
          <div className="protect-layers">
            {layers.map((layer) => (
              <article className="protect-layer" key={layer.index}>
                <span>{layer.index}</span>
                <h3>{layer.title}</h3>
                <p>{layer.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="responsibility-title">
        <div className="detail-row">
          <div><h2 id="responsibility-title">Technology does not remove human responsibility.</h2></div>
          <div className="detail-copy">
            <p>
              Organizations remain responsible for deciding which use cases are
              appropriate, classifying data, approving permissions, evaluating
              model behavior, responding to incidents, and maintaining legal and
              regulatory obligations.
            </p>
            <p>
              Buckleson helps make boundaries and evidence clearer. It does not
              eliminate every AI, security, privacy, or operational risk.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section page-section-white" aria-labelledby="status-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Company status</p>
            <h2 id="status-title">Clear about what is current and what comes next.</h2>
          </div>
          <div className="status-grid">
            <article><StatusBadge status="Current capability" /><h3>MVP</h3><p>Core platform capabilities are available for demonstrations and technical evaluation.</p></article>
            <article><StatusBadge status="Pilot stage" /><h3>Enterprise pilot</h3><p>Controlled pilot work tests capabilities against real workflows and requirements.</p></article>
            <article><StatusBadge status="Designed for" /><h3>Expanded architecture</h3><p>Roadmap features remain explicitly separate from verified current capability.</p></article>
            <article><StatusBadge status="Long-term vision" /><h3>Vision</h3><p>Make trusted AI execution a dependable infrastructure layer across organizations and industries.</p></article>
          </div>
        </div>
      </section>
      <AssessmentCta />
    </main>
  );
}
