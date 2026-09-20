import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";

import { AssessmentCta } from "@/components/assessment-cta";
import { StatusBadge } from "@/components/status-badge";
import { CinematicPicture } from "@/components/cinematic-picture";
import {
  bucklesonSiteContent,
  type ProductContent,
} from "@/content/buckleson-site-content";
import { createPageMetadata } from "@/lib/metadata";

export const dynamicParams = false;
const products: readonly ProductContent[] = bucklesonSiteContent.products;

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return {};
  }

  return createPageMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}/`,
  });
}

function ProductArchitecture({ product }: { product: ProductContent }) {
  return (
    <div className="product-architecture" data-product-architecture={product.slug}>
      {product.architecture.map((layer, index) => (
        <article className="product-architecture-layer" key={layer.title}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3>{layer.title}</h3>
          <p>{layer.description}</p>
        </article>
      ))}
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="product-detail-hero shell">
        <Link className="product-detail-back" href="/products/">
          <ArrowLeft aria-hidden="true" className="size-4" />
          All products
        </Link>
        <div className="product-detail-hero-grid">
          <div>
            <StatusBadge status={product.status} />
            <p className="section-label">{product.role}</p>
            <h1>{product.name}</h1>
          </div>
          <div className="product-detail-intro">
            <p className="product-detail-summary">{product.summary}</p>
            <p><strong>The problem:</strong> {product.problem}</p>
          </div>
        </div>
        {product.mediaId ? <CinematicPicture mediaId={product.mediaId} className="product-detail-media" /> : null}
      </section>

      <section className="page-section page-section-white" aria-labelledby="capabilities-title">
        <div className="shell product-detail-split">
          <div className="section-heading">
            <p className="section-label">Current capability</p>
            <h2 id="capabilities-title">What {product.name} does now.</h2>
          </div>
          <ul className="product-capability-list">
            {product.capabilities.map((capability, index) => (
              <li key={capability}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="workflow-title">
        <div className="section-heading">
          <p className="section-label">Execution path</p>
          <h2 id="workflow-title">A four-step responsibility.</h2>
        </div>
        <ol className="product-workflow">
          {product.workflow.map((step, index) => (
            <li key={step.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="page-section product-architecture-section" aria-labelledby="architecture-title">
        <div className="shell">
          <div className="section-heading section-heading-inverse">
            <p className="section-label section-label-light">Architecture</p>
            <h2 id="architecture-title">The boundary, layer by layer.</h2>
          </div>
          <ProductArchitecture product={product} />
        </div>
      </section>

      <section className="page-section page-section-white" aria-labelledby="risks-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Relevant risks</p>
            <h2 id="risks-title">Controls with explicit limits.</h2>
            <p>
              These mappings explain where the product can help reduce impact.
              They are not guarantees that every unsafe request or outcome will be detected.
            </p>
          </div>
          <div className="product-risk-list">
            {product.riskControls.map((control) => (
              <article key={control.risk}>
                <h3>{control.risk}</h3>
                <p>{control.response}</p>
                <p className="product-risk-boundary"><strong>Boundary:</strong> {control.boundary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {product.designedFor ? (
        <section className="page-section shell" aria-labelledby="designed-title">
          <div className="product-designed-panel">
            <div>
              <StatusBadge status="Designed for" />
              <h2 id="designed-title">Designed-for architecture</h2>
              <p>
                These properties describe the intended direction for Hyper-0x.
                They remain separate from verified current capability.
              </p>
            </div>
            <ul>
              {product.designedFor.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="product-detail-next shell" aria-label="Continue exploring Buckleson">
        <Link href="/services/">
          Explore related services
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </section>

      <AssessmentCta />
    </main>
  );
}
