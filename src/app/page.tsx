import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Braces, CheckCircle2, DatabaseZap, Fingerprint } from "lucide-react";

import { AssessmentCta } from "@/components/assessment-cta";
import { CinematicHero } from "@/components/cinematic-hero";
import { SectionHeading } from "@/components/section-heading";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { articleRegistry } from "@/lib/site-data";

export const metadata: Metadata = {
  title: { absolute: "Buckleson — Trust and Execution Infrastructure for AI" },
  description: bucklesonSiteContent.pages.find((page) => page.route === "/")!.description,
  robots: { index: true, follow: true },
};
const responsibilityIcons = [DatabaseZap, Fingerprint, CheckCircle2];

export default function HomePage() {
  const { company, products, services, process, risks, faqs } = bucklesonSiteContent;
  return (
    <main id="main-content" tabIndex={-1}>
      <section className="home-scene home-hero" aria-label={company.hero}><CinematicHero /></section>

      <section className="home-scene statement-scene"><div className="shell statement-layout"><p className="section-index">01 / Why Buckleson</p><h2>AI becomes consequential when it can reach your data, tools, and systems.</h2><p>{company.positioning} We place protection, policy, and evidence around the execution path.</p></div></section>

      <section className="home-scene responsibilities-scene" aria-labelledby="responsibilities-title"><div className="shell"><SectionHeading id="responsibilities-title" label="Platform responsibilities" title="Three controls. One accountable execution path." /><div className="responsibility-grid">
        {[
          { title: "Protect information", product: products[1] },
          { title: "Control execution", product: products[0] },
          { title: "Preserve evidence", product: products[2] },
        ].map(({ title, product }, index) => { const Icon = responsibilityIcons[index]; return <article key={title}><span className="responsibility-number">0{index + 1}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{product.summary}</p></article>; })}
      </div></div></section>

      <section className="home-scene product-rail-scene" aria-labelledby="product-rail-title"><div className="shell"><SectionHeading id="product-rail-title" label="Products" title="Built around the moment AI acts." description="Move from protected context to controlled action and attributable evidence." /><div className="product-rail" role="list">
        {products.map((product, index) => <Link href={`/products/${product.slug}/`} className="product-rail-card" key={product.slug} role="listitem"><div><span>0{index + 1}</span><StatusBadge status={product.status} /></div><p className="product-role">{product.role}</p><h3>{product.name}</h3><p>{product.summary}</p><span className="rail-link">Explore product <ArrowUpRight aria-hidden="true" /></span></Link>)}
      </div></div></section>

      <section className="home-scene capability-scene" aria-labelledby="capabilities-title"><div className="shell split-heading-layout"><SectionHeading id="capabilities-title" label="Capabilities" title="Start with the boundary that matters most." description="Each engagement stays tied to approved data, actions, evidence, and measurable requirements." /><div className="disclosure-list">
        {services.map((service, index) => <details key={service.slug} open={index === 0} id={service.slug}><summary><span>0{index + 1}</span><strong>{service.name}</strong><i aria-hidden="true">+</i></summary><div className="disclosure-content"><p>{service.summary}</p><ul>{service.deliverables.map((item) => <li key={item}>{item}</li>)}</ul><p className="boundary-note">{service.boundary}</p></div></details>)}
      </div></div></section>

      <section className="home-scene mission-scene" aria-labelledby="mission-title"><div className="shell mission-layout"><p className="section-index">02 / Mission</p><div><h2 id="mission-title">Accountability belongs in the infrastructure.</h2><p>{company.mission}</p></div><blockquote>“{company.vision}”</blockquote><Button asChild variant="secondary"><Link href="/about/">About Buckleson <ArrowRight aria-hidden="true" /></Link></Button></div></section>

      <section className="home-scene hyper-band" aria-labelledby="hyper-band-title"><div className="shell hyper-band-layout"><div><StatusBadge status="Current capability" /><p className="eyebrow">Hyper-0x / Evidence layer</p><h2 id="hyper-band-title">Records that are harder to rewrite after the fact.</h2><p>{products[2].summary} It does not prove that a model response is true.</p><Link className="text-link" href="/products/hyper-0x/">Explore Hyper-0x <ArrowRight aria-hidden="true" /></Link></div><div className="evidence-diagram" aria-hidden="true"><span>Attribute</span><i /><span>Record</span><i /><span>Verify</span><i /><span>Audit</span></div></div></section>

      <section className="home-scene risk-scenarios" aria-labelledby="risk-title"><div className="shell"><SectionHeading id="risk-title" label="AI risk scenarios" title="Unsafe requests do not need unlimited impact." description="These are control scenarios—not claims that every attack is detected or prevented." /><div className="risk-rail" role="region" aria-label="Scrollable AI risk scenarios" tabIndex={0}>
        {risks.slice(0, 6).map((risk) => <article key={risk.name}><span className="risk-category">{risk.category}</span><h3>{risk.name}</h3><p>{risk.explanation}</p><div>{risk.relatedProducts.map((slug) => <span key={slug}>{products.find((item) => item.slug === slug)?.name}</span>)}</div></article>)}
      </div></div></section>

      <section className="home-scene process-scene" aria-labelledby="process-title"><div className="shell split-heading-layout"><SectionHeading id="process-title" label="Engagement process" title="From workflow map to accountable execution." /><ol className="process-list">{process.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></div></section>

      <section className="home-scene principles-scene" aria-labelledby="principles-title"><div className="shell"><SectionHeading id="principles-title" label="Company principles" title="Clear boundaries beat invented certainty." /><div className="principles-grid">{company.principles.map((principle) => <article key={principle.title}><Braces aria-hidden="true" /><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></div></section>

      <section className="home-scene faq-scene" aria-labelledby="faq-title"><div className="shell split-heading-layout"><SectionHeading id="faq-title" label="Security FAQ" title="Direct answers about scope and responsibility." /><div className="disclosure-list faq-list">{faqs.map((item) => <details key={item.question}><summary><strong>{item.question}</strong><i aria-hidden="true">+</i></summary><div className="disclosure-content"><p>{item.answer}</p></div></details>)}</div></div></section>

      <section className="home-scene insights-scene" aria-labelledby="insights-title"><div className="shell"><SectionHeading id="insights-title" label="Field notes" title="Understand the risks before choosing the controls." /><div className="article-preview-list">{articleRegistry.slice(0, 3).map((article, index) => <Link href={`/blog/${article.slug}/`} key={article.slug} className="article-preview"><span>Guide 0{index + 1}</span><h3>{article.title}</h3><p>{article.description}</p><ArrowUpRight aria-hidden="true" /></Link>)}</div><Link className="text-link" href="/blog/">Read all guides <ArrowRight aria-hidden="true" /></Link></div></section>

      <AssessmentCta />
    </main>
  );
}
