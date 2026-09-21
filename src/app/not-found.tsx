import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Route not found — Spartan" },
  description: "The requested Spartan route could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <main id="main-content" className="not-found-page"><div className="shell"><strong aria-hidden="true">404</strong><h1>Error 404</h1><p>Oops! Looks like you took a wrong turn.</p><Link className="button button--dark" href="/">Back To Home</Link></div></main>
  );
}
