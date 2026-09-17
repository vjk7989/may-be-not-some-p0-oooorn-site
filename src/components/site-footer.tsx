import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { navigation, siteConfig } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-intro">
          <BrandLogo light />
          <p>Trust and execution infrastructure for safer AI.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={siteConfig.calendarUrl}>Book an assessment</a>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <p>© 2026 Buckleson. Capability boundaries are stated throughout.</p>
        <p>We secure how AI runs — not what AI thinks.</p>
      </div>
    </footer>
  );
}
