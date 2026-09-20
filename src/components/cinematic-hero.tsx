import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { withBasePath } from "@/lib/site-data";

export function CinematicHero() {
  const { company, products } = bucklesonSiteContent;

  return (
    <div className="cinematic-hero" data-cinematic-hero>
      <div className="cinematic-hero-media" data-hero-media>
        <picture>
          <source media="(max-width: 62rem)" type="image/avif" srcSet={withBasePath("/media/buckleson-execution-boundary-960.avif")} />
          <source
            media="(max-width: 62rem)"
            srcSet={withBasePath("/media/buckleson-execution-boundary-960.webp")}
          />
          <source type="image/avif" srcSet={withBasePath("/media/buckleson-execution-boundary-1586.avif")} />
          {/* The responsive files are pre-generated; a native image avoids delaying the LCP paint behind Next's client image runtime. */}
          <img
            src={withBasePath("/media/buckleson-execution-boundary-1586.webp")}
            alt="A sculptural execution boundary in a warm technical landscape"
            width={1586}
            height={992}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
          />
        </picture>
        <div className="cinematic-hero-shade" aria-hidden="true" />
      </div>
      <div className="shell cinematic-hero-grid">
        <div className="cinematic-hero-copy">
          <p className="eyebrow" data-hero-reveal>{company.supportingTitle}</p>
          <h1 data-hero-reveal>{company.hero}</h1>
          <p className="hero-positioning" data-hero-reveal>{company.positioning}</p>
          <p className="hero-lede" data-hero-reveal>{company.description}</p>
          <div className="hero-actions" data-hero-reveal>
            <Button asChild><a href={company.calendarUrl}>Book a Security Assessment <ArrowUpRight aria-hidden="true" /></a></Button>
            <Button asChild variant="secondary"><Link href="/products/">Explore the platform <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
        </div>
        <nav className="hero-product-rail" data-hero-product-rail aria-label="Buckleson products">
          {products.map((product, index) => (
            <Link className="hero-product-card" data-hero-product-card href={`/products/${product.slug}/`} aria-label={`Explore ${product.name}`} key={product.slug}>
              <span className="hero-product-index">0{index + 1}</span>
              <span className="hero-product-status"><i aria-hidden="true" />Current capability</span>
              <h2>{product.name}</h2>
              <p>{product.role}</p>
              <span className="hero-product-link" aria-hidden="true">Explore <ArrowUpRight /></span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
