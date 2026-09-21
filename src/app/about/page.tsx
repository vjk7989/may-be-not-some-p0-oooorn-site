/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReferenceFaq } from "@/components/reference-faq";
import { createPageMetadata } from "@/lib/metadata";
import { withBasePath } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({ title: "About", description: "The evolution of intelligence at Spartan AI.", path: "/about/" });
const testimonials = [
  ["MARCUS CHENG", "Head of AI, Aetna", "The custom agentic workflows they built reduced our manual data entry by 90%, saving us hundreds of hours weekly.", "9AvPLCB2PkQCEoFgNdwvDaIaGGI.jpg"],
  ["DAVID ROSSI", "Lead Dev, Cigna", "Their team didn't just provide tools; they provided a roadmap for AI integration that actually makes sense for ROI.", "rLkyXpp1TSaADDj0EYjy9c8uw.jpg"],
  ["SARAH JENKINS", "CTO, Anthem Group", "A game-changer for our R&D. The neural infrastructure is robust, secure, and perfectly tailored to our niche stack.", "IIK9uqdpvVqpPgAHuhf8s9r4Ee4.jpg"],
  ["ELENA VANCE", "VP Eng, UnitedHealth", "Incredible technical depth. They handled our complex RAG implementation with ease and delivered ahead of schedule.", "QHChEEbpWFuUCrhS6zqN5BK4Rr0.jpg"],
] as const;

export default function AboutPage() {
  return <main id="main-content" className="reference-inner about-replica">
    <section className="about-hero"><h1>We architect the neural engines that power the world&apos;s most ambitious firms.</h1><p>Spartan AI is an independent intelligence studio engineering custom neural infrastructure, autonomous agents, and private machine-learning systems.</p><img src={withBasePath("/spartan-reference/GDx7YyEJpkHaDiL2EcHleWQBeA.png")} alt="" /></section>
    <section className="about-story"><b>OUR STORY</b><h2>The Evolution of Intelligence at Spartan AI</h2><div><p>We began with a simple conviction: enterprise AI should be built around the ambition of the organization, not the limitations of generic tools.</p><p>Today, we combine research, design, and engineering to turn complex data into secure systems that create measurable advantage.</p></div><div className="about-numbers"><span><strong>45+</strong>Neural systems</span><span><strong>15K</strong>Active agents</span><span><strong>95+</strong>Languages</span><span><strong>3</strong>Global regions</span></div><h2>We empower global leaders with private, scalable neural layers.</h2><div className="about-services">{["Neural Strategy", "Edge Deployment", "Custom LLMs", "Predictive Ops"].map((x, i) => <article key={x}><span>0{i + 1}</span><h3>{x}</h3></article>)}</div></section>
    <section className="replica-experiences"><div className="mega-title"><h2>Experiences</h2></div><div className="experience-top"><p>Empowering global enterprises through bespoke neural architectures and autonomous agentic workflows.</p><div><button data-carousel-prev aria-label="Previous"><ArrowLeft /></button><button data-carousel-next aria-label="Next"><ArrowRight /></button></div></div><div className="experience-rail" data-carousel role="region" aria-label="Client experiences" tabIndex={0}>{testimonials.map((x) => <article key={x[0]}><img src={withBasePath(`/spartan-reference/${x[3]}`)} alt="" /><p>{x[2]}</p><footer><b>{x[0]}</b><span>{x[1]}</span></footer></article>)}</div></section>
    <ReferenceFaq />
  </main>;
}
