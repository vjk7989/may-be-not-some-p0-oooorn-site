/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ReferenceFaq } from "@/components/reference-faq";
import { createPageMetadata } from "@/lib/metadata";
import { withBasePath } from "@/lib/site-data";

export const metadata: Metadata=createPageMetadata({title:"Contact",description:"Let's build your neural future together.",path:"/contact/"});
export default function ContactPage(){return <main id="main-content" className="reference-inner contact-replica"><section className="contact-lead"><div><img src={withBasePath("/spartan-reference/64l3Qidyw4y3D5wng0mTJwvxA.jpg")} alt=""/><h1>Let&apos;s build your neural future together.</h1></div><form action="https://cal.com/" method="get"><h2>Deploy your first agent today.</h2><p>Ready to transform your legacy data into a strategic asset?</p><label>Name<input name="name" required/></label><label>Email<input name="email" type="email" required/></label><label>Budget<span><i>$</i><input name="budget" inputMode="numeric"/></span></label><label>Message<textarea name="message" rows={4}/></label><button type="submit">Submit <ArrowUpRight/></button></form></section><section className="contact-statement"><a href="mailto:info@spartanai.org">info@spartanai.org</a><div><img src={withBasePath("/spartan-reference/BaYHimDgZ5LwxTNRFLREkNHCO0.jpg")} alt=""/><h2>Forging the secure neural foundations for the next generation of global leaders.</h2><p>We empower global leaders with private, scalable neural layers.</p></div></section><ReferenceFaq/></main>}
