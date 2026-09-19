import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { NotFoundMotion } from "@/components/not-found-motion";
import { socialLinks } from "@/lib/site-data";

export default function NotFound() {
  return (
    <main className="not-found-page" id="main-content" tabIndex={-1}>
      <title>Page not found — Buckleson</title>
      <div className="not-found-shell">
        <section className="not-found-copy" aria-labelledby="not-found-title">
          <p className="not-found-code">ERROR / 404</p>
          <h1 id="not-found-title">This path left the boundary.</h1>
          <p className="not-found-description">
            The page may have moved, or the address may be wrong. Return home to
            continue exploring Buckleson.
          </p>
          <Link className="not-found-cta" href="/">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Return to homepage
          </Link>
        </section>

        <NotFoundMotion />

        <div className="not-found-status" aria-label="Route status">
          <span>404</span>
          <span>Route unavailable</span>
          <span>No action taken</span>
        </div>

        {socialLinks.length > 0 ? (
          <nav className="not-found-socials" aria-label="Social links">
            {socialLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </main>
  );
}
