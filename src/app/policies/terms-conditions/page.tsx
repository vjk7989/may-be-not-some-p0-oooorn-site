import type { Metadata } from "next";
import Link from "next/link";

import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Terms", description: "Plain-language terms for using the Spartan concept website.", path: "/policies/terms-conditions/" });

export default function TermsPage() {
  return (
    <main id="main-content" className="shell policy-page"><header><p className="eyebrow">Policies</p><h1>Terms of use.</h1><p className="page-hero__intro">A concise statement of how this concept website may be used.</p></header><div className="policy-body"><section><h2>Informational purpose</h2><p>This website describes an independent concept studio and illustrative project directions. Its content is general information, not a guarantee, professional advice, or an offer with fixed commercial terms.</p></section><section><h2>Concept work</h2><p>Project pages are fictional design studies. Names in route identifiers do not identify customers, employers, partners, or endorsements.</p></section><section><h2>External scheduling</h2><p>Choosing the scheduling link takes you to an external calendar service governed by that service&apos;s own terms. Spartan does not collect form submissions on this site.</p></section><section><h2>Questions</h2><p>If a term needs clarification, use the <Link href="/contact/">contact page</Link> to schedule a conversation before relying on the material.</p></section></div></main>
  );
}

