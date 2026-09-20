import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import type { ProductContent } from "@/content/buckleson-site-content";

function ProductDiagram({ product }: { product: ProductContent }) {
  return (
    <div
      aria-hidden="true"
      className={`product-bento-diagram product-bento-diagram-${product.slug}`}
      data-product-diagram={product.slug}
    >
      <span className="product-bento-diagram-source" />
      <span className="product-bento-diagram-path" />
      <span className="product-bento-diagram-boundary">
        {product.slug === "hyper-tern"
          ? "Policy"
          : product.slug === "hyper-abs"
            ? "Protect"
            : "Evidence"}
      </span>
      <span className="product-bento-diagram-output" />
    </div>
  );
}

export function ProductBento({ products }: { products: readonly ProductContent[] }) {
  return (
    <div className="product-bento" data-product-bento>
      {products.map((product, index) => (
        <article
          className={`product-bento-card${index === 0 ? " product-bento-card-featured" : ""}`}
          data-product-card={product.slug}
          id={product.slug}
          key={product.slug}
        >
          <div className="product-bento-card-header">
            <span className="product-bento-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <StatusBadge status={product.status} />
          </div>

          <ProductDiagram product={product} />

          <div className="product-bento-card-copy">
            <p className="product-bento-role">{product.role}</p>
            <h2>{product.name}</h2>
            <p>{product.summary}</p>
            <ul className="product-bento-capabilities">
              {product.capabilities.slice(0, index === 0 ? 4 : 2).map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
            {product.designedFor ? (
              <p className="product-bento-designed">
                <strong>Designed for:</strong> {product.designedFor.slice(0, 2).join(" · ")}
              </p>
            ) : null}
          </div>

          <Link className="product-bento-link" href={`/products/${product.slug}/`}>
            Explore {product.name}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </article>
      ))}
    </div>
  );
}
