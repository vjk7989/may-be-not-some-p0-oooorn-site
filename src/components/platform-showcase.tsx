"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Fingerprint, ShieldCheck } from "lucide-react";
import { useState, type CSSProperties } from "react";

import { StatusBadge } from "@/components/status-badge";
import { products } from "@/lib/site-data";

function ProductDiagram({ slug }: { slug: string }) {
  if (slug === "hyper-tern") {
    return (
      <div className="platform-diagram platform-diagram-tern" data-product-diagram aria-hidden="true">
        <div className="platform-diagram-stage">
          <span><Fingerprint className="size-4" />Identity</span>
          <span><ShieldCheck className="size-4" />Policy</span>
          <span><Check className="size-4" />Approved action</span>
        </div>
        <svg viewBox="0 0 520 88" focusable="false">
          <path className="platform-path" d="M14 44 H506" />
          <circle className="platform-pulse" cx="14" cy="44" r="5" />
        </svg>
      </div>
    );
  }

  if (slug === "hyper-abs") {
    return (
      <div className="platform-diagram platform-diagram-abs" data-product-diagram aria-hidden="true">
        <div className="platform-data-before">
          <span>Account 4082</span><span>name@company.com</span><span>Project Atlas</span>
        </div>
        <div className="platform-mask-gate"><span>MASK</span></div>
        <div className="platform-data-after">
          <span>Account ••••</span><span>user_token_17</span><span>Project Atlas</span>
        </div>
      </div>
    );
  }

  return (
    <div className="platform-diagram platform-diagram-0x" data-product-diagram aria-hidden="true">
      <svg viewBox="0 0 540 180" focusable="false">
        <path className="ledger-link" d="M75 90 H465" />
        {[92, 214, 336].map((x, index) => (
          <g className="ledger-block" key={x} style={{ "--block-delay": `${index * 110}ms` } as CSSProperties}>
            <rect x={x} y="48" width="92" height="84" rx="10" />
            <path d={`M${x + 18} 76 H${x + 74} M${x + 18} 92 H${x + 64} M${x + 18} 108 H${x + 50}`} />
          </g>
        ))}
        <circle className="ledger-verified" cx="478" cy="90" r="25" />
        <path className="ledger-check" d="M466 90 l8 8 16 -18" />
      </svg>
    </div>
  );
}

export function PlatformShowcase() {
  const [activeSlug, setActiveSlug] = useState(products[0].slug);

  return (
    <>
      <div className="platform-panels" data-active-product={activeSlug}>
        {products.map((product, index) => {
          const isActive = product.slug === activeSlug;
          const contentId = `platform-content-${product.slug}`;
          return (
            <article
              className="platform-panel"
              data-product-panel
              data-active={isActive || undefined}
              key={product.slug}
              onMouseEnter={() => {
                if (
                  window.matchMedia(
                    "(min-width: 48.0625rem) and (hover: hover) and (pointer: fine)",
                  ).matches
                ) {
                  setActiveSlug(product.slug);
                }
              }}
            >
              <button
                className="platform-panel-trigger"
                type="button"
                aria-label={`${product.name} product details`}
                aria-expanded={isActive}
                aria-controls={contentId}
                onClick={() => setActiveSlug(product.slug)}
                onFocus={() => setActiveSlug(product.slug)}
              >
                <span className="platform-panel-index" aria-hidden="true">0{index + 1}</span>
                <span className="platform-panel-name">{product.name}</span>
                <span className="platform-panel-state" aria-hidden="true">{isActive ? "Viewing" : "View"}</span>
              </button>
              <div className="platform-panel-content" data-product-content id={contentId} hidden={!isActive}>
                <ProductDiagram slug={product.slug} />
                <div className="platform-panel-copy">
                  <StatusBadge status={product.status} />
                  <h3>{product.name}</h3>
                  <p>{product.summary}</p>
                  <Link href={`/products/#${product.slug}`}>
                    Explore {product.name}<ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className="platform-noscript">
        {products.map((product, index) => (
          <article key={product.slug}>
            <span aria-hidden="true">0{index + 1}</span>
            <StatusBadge status={product.status} />
            <h3>{product.name}</h3>
            <p>{product.summary}</p>
            <Link href={`/products/#${product.slug}`}>Explore {product.name}</Link>
          </article>
        ))}
      </div>
      <noscript><style>{`.platform-panels{display:none!important}.platform-noscript{display:grid!important}`}</style></noscript>
    </>
  );
}
