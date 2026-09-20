import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Asterisk, Braces, Cpu, Network, ScanLine } from "lucide-react";

import { CinematicPicture } from "@/components/cinematic-picture";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";
import { withBasePath } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "Independent AI Systems Studio",
  description: content.company.description,
  path: "/",
});

const capabilityIcons = [Network, Cpu, ScanLine];

export default function HomePage() {
  return (
    <main id="main-content" className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <CinematicPicture mediaId="frontier" className="hero-media" eager sizes="100vw" />
        <div className="hero-shade" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker">Independent AI systems studio</p>
            <h1 id="hero-title"><span>Scale your ideas.</span> Build with intelligence.</h1>
            <p>Design private knowledge systems, bounded agents, and operational workflows in one deliberate delivery cycle.</p>
            <div className="hero-actions">
              <a className="button button--dark" href={withBasePath("/contact/")}>Start a project <ArrowUpRight aria-hidden="true" /></a>
              <span>Strategy · architecture · product</span>
            </div>
          </div>
          <a className="hero-product-card" href={withBasePath("/digital-brain/")} data-motion-section>
            <CinematicPicture mediaId="neural-core" />
            <div><span><strong>Digital Brain</strong><small>Model 04 / private operations</small></span><ArrowUpRight aria-hidden="true" /></div>
          </a>
          <div className="hero-trust"><span>Built for complex workflows and accountable teams.</span><div><b>Systems</b><b>Agents</b><b>Knowledge</b><b>Operations</b></div></div>
        </div>
      </section>

      <section className="statement-section shell" data-motion-section>
        <p className="display-statement">Automate the repeatable. Keep judgment visible. Build systems people can understand when the easy path ends.</p>
        <div className="statement-aside"><p>Spartan turns complex data and disconnected tools into useful, reviewable operating systems.</p><span>Built around the work, not the spectacle.</span></div>
      </section>

      <section className="signal-grid shell" aria-label="Operating principles" data-motion-section>
        <article data-motion-item><strong>01</strong><h2>Useful by design</h2><p>Every surface begins with a real decision, handoff, or outcome.</p></article>
        <article data-motion-item><strong>02</strong><h2>Bounded by default</h2><p>Inputs, actions, review points, and recovery paths stay explicit.</p></article>
        <article data-motion-item><strong>03</strong><h2>Built to evolve</h2><p>Modular interfaces make the system easier to inspect and change.</p></article>
      </section>

      <section className="dark-scene" data-motion-section>
        <div className="shell section-intro section-intro--light"><p className="eyebrow">Selected concepts</p><h2>Systems that turn ambiguity into an operating advantage.</h2><a href={withBasePath("/project/")}>View all projects <ArrowRight aria-hidden="true" /></a></div>
        <div className="shell project-grid">
          {content.projects.map((project, index) => (
            <a className={`project-card project-card--${(index % 3) + 1}`} href={withBasePath(`/project/${project.slug}/`)} key={project.slug} data-motion-item>
              <CinematicPicture mediaId={project.mediaId} />
              <div><span>{project.category}</span><h3>{project.title}</h3><p>{project.summary}</p><ArrowUpRight aria-hidden="true" /></div>
            </a>
          ))}
        </div>
      </section>

      <section className="capabilities-section shell" data-motion-section>
        <div className="section-intro"><div><p className="eyebrow">Capabilities</p><p>From operating model to working product.</p></div><h2>Tailored intelligence for teams with consequential work.</h2><a className="button button--dark" href={withBasePath("/contact/")}>Start a build</a></div>
        <div className="capability-stack">
          {content.capabilities.map((capability, index) => {
            const Icon = capabilityIcons[index];
            return <Card className="capability-card" key={capability.index} data-motion-item><CardContent><span>{capability.index}</span><Icon aria-hidden="true" /><div><h3>{capability.title}</h3><p>{capability.description}</p></div></CardContent></Card>;
          })}
        </div>
      </section>

      <section className="vision-scene" data-motion-section>
        <CinematicPicture mediaId="gateway" className="vision-media" />
        <div className="shell vision-layout">
          <div><p className="eyebrow">Our vision</p><h2>AI should expand the quality of human decisions, not erase the people responsible for them.</h2></div>
          <div><p>We combine technical rigor with clear interaction design to build systems that stay legible as the work becomes more complex.</p><a href={withBasePath("/about/")}>Meet the practice <ArrowRight aria-hidden="true" /></a></div>
        </div>
      </section>

      <section className="product-feature shell" data-motion-section>
        <div className="product-feature__copy"><Badge>{content.product.eyebrow}</Badge><h2>{content.product.title}</h2><p>{content.product.summary}</p><a className="button button--dark" href={withBasePath("/digital-brain/")}>Explore Digital Brain <ArrowUpRight aria-hidden="true" /></a></div>
        <CinematicPicture mediaId={content.product.mediaId} className="product-feature__media" />
        <div className="language-ticker" aria-label="Designed for multilingual teams"><span>EN</span><span>HI</span><span>ES</span><span>FR</span><span>AR</span><span>PT</span><span>DE</span><span>ZH</span></div>
      </section>

      <section className="process-section" data-motion-section>
        <div className="shell"><div className="section-intro section-intro--light"><div><p className="eyebrow">Our process</p><p>From raw context to a dependable operating layer.</p></div><h2>A measured path from first question to working system.</h2></div>
          <ol className="process-list">{content.process.map((step) => <li key={step.index} data-motion-item><span>{`// ${step.index}`}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
        </div>
      </section>

      <section className="disciplines-section shell" data-motion-section>
        <div className="section-intro"><p className="eyebrow">The practice</p><h2>Four disciplines. One delivery system.</h2></div>
        <div className="discipline-grid">{content.disciplines.map((item, index) => <article key={item.title} data-motion-item><div><span>0{index + 1}</span><Braces aria-hidden="true" /></div><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>
      </section>

      <section className="engagement-section" data-motion-section>
        <div className="shell"><div className="section-intro section-intro--light"><p className="eyebrow">Engagements</p><h2>Choose the smallest useful way to begin.</h2><p>No packaged promises. Scope follows the work.</p></div>
          <div className="engagement-grid">{content.engagements.map((item) => <article key={item.name} data-motion-item><h3>{item.name}</h3><strong>Custom engagement</strong><p>{item.description}</p><a href={withBasePath("/contact/")}>Discuss scope <ArrowUpRight aria-hidden="true" /></a><Separator /> <ul>{item.includes.map((include) => <li key={include}><Asterisk aria-hidden="true" />{include}</li>)}</ul></article>)}</div>
        </div>
      </section>

      <section className="faq-section shell" data-motion-section>
        <div className="section-intro"><div><p className="eyebrow">Common questions</p><p>Direct answers about how the work begins.</p></div><h2>Everything you need to start a useful conversation.</h2><a href={withBasePath("/contact/")}>Contact Spartan <ArrowRight aria-hidden="true" /></a></div>
        <div className="faq-list">{content.faqs.map((item, index) => <details key={item.question} open={index === 0}><summary><span>0{index + 1}</span><strong>{item.question}</strong><i aria-hidden="true">+</i></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="articles-preview shell" data-motion-section>
        <div className="section-intro"><p className="eyebrow">Field notes</p><h2>Ideas for building calmer, more accountable AI systems.</h2><a href={withBasePath("/articles/")}>All articles <ArrowRight aria-hidden="true" /></a></div>
        <div className="article-grid">{content.articles.map((article) => <a href={withBasePath(`/articles/${article.slug}/`)} key={article.slug} data-motion-item><CinematicPicture mediaId={article.mediaId} /><span>{article.category}</span><h3>{article.title}</h3><p>{article.description}</p><small>{article.readingTime}</small></a>)}</div>
      </section>

      <section className="closing-marquee" aria-label="Spartan studio statement"><div>DESIGN THE BOUNDARY <span>✦</span> BUILD THE SYSTEM <span>✦</span> KEEP IT LEGIBLE <span>✦</span></div></section>
    </main>
  );
}
