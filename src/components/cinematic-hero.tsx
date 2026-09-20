import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { withBasePath } from "@/lib/site-data";

export function CinematicHero() {
  const { company, products } = bucklesonSiteContent;

  return (
    <div className="cinematic-hero" data-cinematic-hero>
      <div className="cinematic-hero-media">
        <picture>
          <source
            media="(max-width: 62rem)"
            srcSet={withBasePath("/media/buckleson-execution-boundary-960.webp")}
          />
          {/* The responsive files are pre-generated; a native image avoids delaying the LCP paint behind Next's client image runtime. */}
          <img
            src={withBasePath("/media/buckleson-execution-boundary-1600.webp")}
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
        <aside className="hero-spotlight" data-hero-float aria-label="Buckleson platform spotlight">
          <div className="hero-spotlight-topline"><span><ShieldCheck aria-hidden="true" /> Execution boundary</span><span className="live-status"><i /> Current capability</span></div>
          <p className="hero-spotlight-title">One protected path from context to action.</p>
          <div className="hero-spotlight-products">
            {products.map((product, index) => <Link href={`/products/${product.slug}/`} key={product.slug}><span>0{index + 1}</span><strong>{product.name}</strong><small>{product.role}</small><ArrowUpRight aria-hidden="true" /></Link>)}
          </div>
        </aside>
      </div>
    </div>
  );
}
