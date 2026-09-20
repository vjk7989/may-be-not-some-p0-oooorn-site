import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Route not found — Spartan" },
  description: "The requested Spartan route could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found-page"><div className="shell"><strong aria-hidden="true">404</strong><p className="eyebrow">Boundary lost</p><h1>This route is outside the system.</h1><p>The page may have moved or the address may be incomplete. Return to the homepage to find a working path.</p><Link className="button button--dark" href="/">Return home</Link></div></main>
  );
}
