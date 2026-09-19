import Image from "next/image";

import { AssessmentCta } from "@/components/assessment-cta";
import { StatusBadge } from "@/components/status-badge";
import { createPageMetadata } from "@/lib/metadata";
import { products, withBasePath } from "@/lib/site-data";

export const metadata = createPageMetadata({
  title: "Products",
  description:
    "Explore Hyper Tern, Hyper-ABS, and Hyper-0x: Buckleson products for AI policy control, pre-inference data protection, and verifiable execution records.",
  path: "/products/",
});

export default function ProductsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero shell">
        <p className="section-label">Products</p>
        <h1>Control, protect, and verify AI execution.</h1>
        <p>
          Three focused products form a trust and execution layer between AI
          systems and the data, tools, action boundaries, and infrastructure they use.
        </p>
      </section>

      <section className="page-section page-section-white">
        <div className="shell detail-list">
          {products.map((product) => (
            <article className="detail-row" id={product.slug} key={product.slug}>
              <div>
                <StatusBadge status={product.status} />
                <h2>{product.name}</h2>
                {product.slug === "hyper-0x" ? (
                  <Image
                    src={withBasePath("/brand/hyper-0x-logo-display.webp")}
                    width={640}
                    height={640}
                    alt="Hyper-0x logo"
                    className="product-logo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
              <div className="detail-copy">
                <p>{product.summary}</p>
                <ul className="feature-list">
                  {product.controls.map((control) => <li key={control}>{control}</li>)}
                </ul>
                {product.designedFor ? (
                  <div className="designed-list">
                    <StatusBadge status="Designed for" />
                    <h3>Planned architecture</h3>
                    <ul>
                      {product.designedFor.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="product-boundary-title">
        <div className="section-heading">
          <p className="section-label">Responsibility boundary</p>
          <h2 id="product-boundary-title">A ledger preserves evidence. It does not create truth.</h2>
          <p>
            Hyper-ABS owns pre-inference exposure protection. Hyper Tern owns
            identity, routing, permissions, policy, tools, and action control.
            Hyper-0x records tamper-evident execution evidence for verification,
            audit, and settlement. None of these claims means a model output is correct.
          </p>
        </div>
      </section>
      <AssessmentCta />
    </main>
  );
}
