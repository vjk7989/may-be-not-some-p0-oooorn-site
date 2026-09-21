/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Asterisk } from "lucide-react";
import { ReferenceFaq } from "@/components/reference-faq";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { createPageMetadata } from "@/lib/metadata";
import { withBasePath } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({ title:"Insights", description:"Technical frameworks and strategic guides.", path:"/articles/" });
const images=["862JbA3xEJjbdSDVyKEwOZ0f2g.jpeg","YKAEpvQFebP2OETEJDVNip8UTg.jpeg","egDVD5dc2AvUIZKG0seuGXtH0.jpeg"];
export default function ArticlesPage(){return <main id="main-content" className="reference-inner"><section className="inner-marquee-hero"><img src={withBasePath("/spartan-reference/i2PWRihXhhQOooVfgwdnSUsN598.jpg")} alt=""/><div className="mega-title"><h1>Insights</h1><Asterisk/></div></section><section className="replica-insights inner-insights"><div className="article-grid">{content.articles.map((article,index)=><a href={withBasePath(`/articles/${article.slug}/`)} key={article.slug}><img src={withBasePath(`/spartan-reference/${images[index]}`)} alt=""/><span>{article.category}</span><h2>{article.title}</h2><p>{article.description}</p><small>Written by {["Frank Joel","Damilola Manuel","Deborah Reachie"][index]}</small></a>)}</div></section><ReferenceFaq/></main>}
