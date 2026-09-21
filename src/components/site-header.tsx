import { ArrowUpRight } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { withBasePath } from "@/lib/site-data";

const links = [["Works", "/project/"], ["Services", "/#capabilities"], ["Insights", "/articles/"], ["Pricing", "/#pricing"], ["Company", "/about/"]] as const;

export function SiteHeader() {
  return <header className="site-header"><div className="site-header__inner">
    <BrandLogo eager />
    <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <a key={label} href={withBasePath(href)}>{label}</a>)}</nav>
    <a className="header-cta" href={withBasePath("/contact/")}>Hire Team <ArrowUpRight aria-hidden="true" /></a>
  </div></header>;
}
