import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ArrowUpRight, Asterisk, Braces, Cpu, Network, Play, ScanLine } from "lucide-react";

import { CinematicPicture } from "@/components/cinematic-picture";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";
import { withBasePath } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({ title: "Independent AI Systems Studio", description: content.company.description, path: "/" });

const capabilityIcons = [Network, Cpu, ScanLine];
const proofSignals = [
  ["Reviewable", "Human checkpoints stay visible."],
  ["Local-first", "Deployment follows your boundary."],
  ["Observable", "Every handoff leaves a trail."],
] as const;

export default function HomePage() {
  const heroMobileAvif = withBasePath("/media/spartan-signal-horizon-960.avif");
  const heroMobileWebp = withBasePath("/media/spartan-signal-horizon-960.webp");
  const heroDesktopAvif = withBasePath("/media/spartan-signal-horizon-1672.avif");
  const heroDesktopWebp = withBasePath("/media/spartan-signal-horizon-1672.webp");
  const heroArtworkCss = `
    body:has(.home-page)::before {
      background-image: url("${heroMobileWebp}");
      background-image: image-set(url("${heroMobileAvif}") type("image/avif"), url("${heroMobileWebp}") type("image/webp"));
    }
    @media (min-width: 60rem) {
      body:has(.home-page)::before {
        background-image: url("${heroDesktopWebp}");
        background-image: image-set(url("${heroDesktopAvif}") type("image/avif"), url("${heroDesktopWebp}") type("image/webp"));
      }
    }
  `;

  return (
    <>
    <style>{heroArtworkCss}</style>
    <main id="main-content" className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-shade" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <h1 id="hero-title"><span>Scale your ideas.</span> Build with intelligence.</h1>
            <p>Deploy private agents, knowledge systems, and operational automation in one deliberate flow.</p>
            <a className="hero-build" href={withBasePath("/contact/")}><span aria-hidden="true">⌁</span>Start build</a>
          </div>
          <a className="hero-product-card" href={withBasePath("/digital-brain/")} data-motion-section>
            <span className="hero-product-visual" aria-hidden="true" />
            <div><span><strong>Digital Brain</strong><small>{"// Model 04 / private operations"}</small></span><ArrowRight aria-hidden="true" /></div>
          </a>
          <div className="hero-trust"><span>Built for complex workflows and accountable teams.</span><div aria-label="System disciplines"><b>Systems</b><b>Agents</b><b>Knowledge</b><b>Operations</b></div></div>
        </div>
      </section>

      <section className="impact-scene" data-motion-section>
        <div className="shell impact-intro"><p className="display-statement">Automate the manual. Accelerate the useful. Keep human judgment in the loop.</p><p>Spartan turns complex data and disconnected tools into legible operating systems built around the work.</p></div>
        <div className="shell proof-mosaic" aria-label="Operating qualities">
          <article className="proof-card proof-card--dark" data-motion-item><strong>Clear</strong><p>Boundaries that make ownership and exceptions easy to understand.</p></article>
          <article className="proof-card proof-card--people" data-motion-item><div className="proof-orbits" aria-hidden="true"><i /><i /><i /><i /></div><strong>Shared context</strong><p>One visible workspace for people and their tools.</p></article>
          {proofSignals.map(([title, description], index) => <article className="proof-card" key={title} data-motion-item><span>0{index + 1}</span><strong>{title}</strong><p>{description}</p></article>)}
        </div>
        <div className="shell signal-strip"><b><span aria-hidden="true" className="mini-mark" />{"//SPARTAN"}</b><p>Independent systems practice for private intelligence, bounded automation, and accountable operations.</p></div>
      </section>

      <section className="works-scene" data-motion-section>
        <div className="shell mega-heading"><h2>Our Works</h2><Asterisk aria-hidden="true" /></div>
        <div className="shell project-grid">{content.projects.map((project, index) => <a className={`project-card project-card--${index + 1}`} href={withBasePath(`/project/${project.slug}/`)} key={project.slug} data-motion-item><CinematicPicture mediaId={project.mediaId} /><div><span>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p><ArrowUpRight aria-hidden="true" /></div></a>)}</div>
      </section>

      <section className="capabilities-scene" id="capabilities" data-motion-section>
        <div className="shell capabilities-head"><div><p className="eyebrow">Capabilities</p><p>From operating model to working product.</p></div><h2>Tailored intelligence for teams with consequential work.</h2><a className="button button--light" href={withBasePath("/contact/")}>Start build <ArrowUpRight aria-hidden="true" /></a></div>
        <div className="shell capability-rows">{content.capabilities.slice(0, 3).map((capability, index) => { const Icon = capabilityIcons[index]; return <Card className="capability-row" key={capability.index} data-motion-item><CardContent><span>{capability.index}</span><Icon aria-hidden="true" /><div><h3>{capability.title}</h3><p>{capability.description}</p></div><ArrowUpRight aria-hidden="true" /></CardContent></Card>; })}</div>
        <div className="shell systems-grid">
          <article className="systems-vision" data-motion-item><p className="eyebrow">Our vision</p><h3>AI should amplify the creative and strategic potential of every human.</h3><p>We combine technical rigor with clear interaction design so complex systems remain understandable.</p></article>
          <a className="systems-product" href={withBasePath("/digital-brain/")} data-motion-item><CinematicPicture mediaId="neural-core" /><span>Digital Brain <small>Model 04</small></span><ArrowUpRight aria-hidden="true" /></a>
          <article className="systems-list" data-motion-item><p>Semantic retrieval with visible provenance.</p><p>Unified context without flattened permissions.</p><p>Token-conscious flows for faster operations.</p><div><span>EN</span><span>HI</span><span>ES</span><span>FR</span><span>AR</span><span>PT</span><span>DE</span><span>ZH</span></div><small>Designed for multilingual teams.</small></article>
        </div>
      </section>

      <section className="experiences-scene" data-motion-section>
        <div className="shell mega-heading"><h2>Experiences</h2><Asterisk aria-hidden="true" /></div>
        <div className="shell experience-meta"><p>Working principles for systems that people can trust, inspect, and improve.</p><div><a href="#principle-1" aria-label="First principle"><ArrowLeft aria-hidden="true" /></a><a href="#principle-4" aria-label="Last principle"><ArrowRight aria-hidden="true" /></a></div></div>
        <div className="experience-rail shell" role="region" aria-label="Experience principles" tabIndex={0}>{content.disciplines.map((item, index) => <article id={`principle-${index + 1}`} key={item.title} data-motion-item><span>0{index + 1}</span><p>{item.description}</p><div><strong>{item.title}</strong><small>Spartan practice principle</small></div></article>)}</div>
        <div className="shell signal-strip"><b><span aria-hidden="true" className="mini-mark" />{"//SPARTAN"}</b><p>Quiet systems, explicit boundaries, and purposeful automation.</p></div>
      </section>

      <section className="film-scene" data-motion-section>
        <CinematicPicture mediaId="gateway" className="film-media" /><div className="film-shade" />
        <div className="shell film-layout"><div><p>Exploring the intersection of human creativity and machine logic.</p><span>2 min field note</span></div><h2>Intelligence by Design.</h2><details><summary aria-label="Open field note"><Play aria-hidden="true" /></summary><p>Systems feel intelligent when their boundaries, context, and next action are visible to the people responsible for them.</p></details></div>
      </section>

      <section className="process-section" data-motion-section>
        <div className="shell process-layout"><div className="process-title"><p className="eyebrow">Our process</p><h2>From raw context to refined intelligence. One iterative delivery cycle.</h2></div><ol className="process-list">{content.process.map((step) => <li key={step.index} data-motion-item><span>{`// ${step.index}`}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol><aside><p>We do not just ship code. Every step is designed to keep the system legible, adaptable, and ready for real work.</p><a className="button button--light" href={withBasePath("/contact/")}>Build now <ArrowUpRight aria-hidden="true" /></a></aside></div>
      </section>

      <section className="practice-scene" data-motion-section>
        <div className="shell practice-intro"><h2>We are a collective of engineers, designers, and researchers dedicated to useful AI.</h2><div><p>Bridging the gap between research and dependable deployment with precision engineering.</p><a href={withBasePath("/about/")}>Our story <ArrowRight aria-hidden="true" /></a></div></div>
        <div className="shell profile-grid">{content.disciplines.map((item, index) => <article key={item.title} data-motion-item><header><span>Practice 0{index + 1}</span><h3>{item.title}</h3></header><p>{item.description}</p><div className={`profile-visual profile-visual--${index + 1}`}><Braces aria-hidden="true" /><strong>{item.title}</strong></div></article>)}</div>
      </section>

      <section className="engagement-section" id="engagements" data-motion-section>
        <div className="shell mega-heading mega-heading--dark"><h2>Engagements</h2><Asterisk aria-hidden="true" /></div><div className="shell engagement-meta"><p>Flexible starting points shaped around the work. No hidden packages or invented outcomes.</p><span>Contact for scope</span></div>
        <div className="shell engagement-grid">{content.engagements.map((item, index) => <article className={index === 2 ? "is-featured" : ""} key={item.name} data-motion-item><h3>{item.name}</h3><strong>Custom engagement</strong><p>{item.description}</p><a href={withBasePath("/contact/")}>Discuss scope <ArrowUpRight aria-hidden="true" /></a><Separator /><ul>{item.includes.map((include) => <li key={include}><Asterisk aria-hidden="true" />{include}</li>)}</ul></article>)}</div>
        <div className="shell signal-strip signal-strip--dark"><b><span aria-hidden="true" className="mini-mark" />{"//SPARTAN"}</b><p>Scope follows the work, the environment, and the responsibility boundary.</p></div>
      </section>

      <section className="faq-section shell" data-motion-section>
        <div className="faq-layout"><div><p className="eyebrow">Common queries</p><p>Direct answers about technical fit, delivery, and operating boundaries.</p></div><div><h2>Everything you need to start a useful AI conversation.</h2><a href={withBasePath("/contact/")}>Contact Spartan <ArrowRight aria-hidden="true" /></a></div></div>
        <div className="faq-list">{content.faqs.map((item, index) => <details key={item.question} open={index === 0}><summary><span>0{index + 1}</span><strong>{item.question}</strong><i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="articles-preview" data-motion-section>
        <div className="shell mega-heading"><h2>Insights</h2><Asterisk aria-hidden="true" /></div><div className="shell articles-meta"><p>Frameworks and field notes for leaders shaping private, accountable AI systems.</p><a href={withBasePath("/articles/")}>All articles <ArrowRight aria-hidden="true" /></a></div>
        <div className="shell article-grid">{content.articles.map((article) => <a href={withBasePath(`/articles/${article.slug}/`)} key={article.slug} data-motion-item><CinematicPicture mediaId={article.mediaId} /><span>{article.category}</span><h3>{article.title}</h3><p>{article.description}</p><small>{article.readingTime}</small></a>)}</div>
      </section>
    </main>
    </>
  );
}
