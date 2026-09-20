import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Privacy", description: "Privacy boundaries for the static Spartan concept website.", path: "/policies/privacy-policy/" });

export default function PrivacyPage() {
  return (
    <main id="main-content" className="shell policy-page"><header><p className="eyebrow">Policies</p><h1>Privacy.</h1><p className="page-hero__intro">This static website is intentionally designed without account creation, contact forms, or newsletter collection.</p></header><div className="policy-body"><section><h2>Information you submit</h2><p>Spartan does not accept personal information through forms on this website. The only conversion action is an external scheduling link that opens after you choose it.</p></section><section><h2>Static delivery</h2><p>The pages and media are delivered as static files. This policy does not claim that the hosting platform, your browser, or an external scheduling service collects no technical information.</p></section><section><h2>External destinations</h2><p>External services apply their own privacy practices. Review them before entering information outside this website.</p></section><section><h2>Questions</h2><p>Use the <Link href="/contact/">contact page</Link> to reach the approved scheduling destination.</p></section></div></main>
  );
}

