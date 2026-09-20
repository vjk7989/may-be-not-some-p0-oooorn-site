import { AssessmentCta } from "@/components/assessment-cta";
import { ProductBento } from "@/components/product-bento";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Buckleson Products",
  description: bucklesonSiteContent.pages.find((page) => page.route === "/products/")!
    .description,
  path: "/products/",
});

export default function ProductsPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="page-hero shell">
        <p className="section-label">Products</p>
        <h1>Three responsibilities. One execution boundary.</h1>
        <p>
          Protect information before inference, control what AI can reach and
          do, then preserve attributable evidence of approved execution.
        </p>
      </section>

      <section className="page-section page-section-white" aria-labelledby="product-family-title">
        <div className="shell">
          <div className="section-heading">
            <p className="section-label">Product family</p>
            <h2 id="product-family-title">Protection, control, and evidence work together.</h2>
            <p>
              Each product owns a defined responsibility. Select a product to
              explore its workflow, architecture, risk controls, and limits.
            </p>
          </div>
          <ProductBento products={bucklesonSiteContent.products} />
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="product-boundary-title">
        <div className="section-heading">
          <p className="section-label">Responsibility boundary</p>
          <h2 id="product-boundary-title">Every layer has a clear limit.</h2>
          <p>
            Hyper-ABS reduces unnecessary exposure before inference. Hyper Tern
            enforces policy around identities, permissions, tools, resources,
            and action boundaries.
            Hyper-0x preserves tamper-evident execution evidence. These controls
            help reduce risk; they do not guarantee privacy, safety, or model correctness.
          </p>
        </div>
      </section>
      <AssessmentCta />
    </main>
  );
}
