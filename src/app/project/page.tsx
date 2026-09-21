/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Asterisk } from "lucide-react";
import { ReferenceFaq } from "@/components/reference-faq";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";
import { withBasePath } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({ title:"Our Works", description:"Spartan AI projects.", path:"/project/" });
const images=["sZxYLpvH56E3RznKPcnAPYlPvo.jpg","4GMiBYbu9SI4dXo9ENcqlNA.jpg","0g3E5eja3ueYAXkITtsy9quyYo.jpg","ZK0k9kMGgE21P7r3puSMYZ8548.jpg","LYQLqywSoqlHG7KLRJM70MIk.png"];
const stats=[["$45M+","700%","41x","84"],["$62M+","450%","32x","91"],["$82M+","340%","19x","56"],["$59M+","215%","73x","28"],["$94M+","120%","66x","12"]];
export default function ProjectIndexPage(){return <main id="main-content" className="reference-inner"><section className="inner-marquee-hero"><img src={withBasePath("/spartan-reference/0jQkflIbESW6vSDWyZnlBEqzAo.jpg")} alt=""/><div className="mega-title"><h1>Our Works</h1><Asterisk/></div></section><section className="replica-works inner-works"><div className="works-grid">{content.projects.map((project,index)=><a href={withBasePath(`/project/${project.slug}/`)} className="work-card" key={project.slug}><div className="work-image"><img src={withBasePath(`/spartan-reference/${images[index]}`)} alt=""/><span>{project.category}</span></div><h2>{project.title}</h2><div className="work-stats">{stats[index].map((value,i)=><span key={value}><b>{value}</b>{["Funds raised","Social growth","ATH ROI","Parternships"][i]}</span>)}</div></a>)}</div></section><ReferenceFaq/></main>}
