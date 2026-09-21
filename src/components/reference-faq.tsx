import { ArrowRight } from "lucide-react";
import { spartanSiteContent as content } from "@/content/spartan-site-content";
import { withBasePath } from "@/lib/site-data";

export function ReferenceFaq() {
  return <section className="replica-faq inner-faq" data-motion-section><div className="faq-intro"><div><b>COMMON QUERIES</b><p>Find answers to technical specifications, deployment timelines, and our data security protocols.</p></div><div><h2>Everything you need to know about our AI.</h2><a href={withBasePath("/contact/")}>Contact Support <ArrowRight /></a></div></div><div className="faq-list">{content.faqs.map((item,index)=><details open={index===0} key={item.question}><summary><h3>{item.question}</h3><span>+</span></summary><p>{item.answer}</p></details>)}</div></section>;
}
