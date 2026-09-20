import { ArrowUpRight, Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { navigation, withBasePath } from "@/lib/site-data";

export function SiteHeader() {
  const primary = navigation.filter((item) => item.href !== "/" && item.href !== "/contact/");

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandLogo eager />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primary.map((item) => <a key={item.href} href={withBasePath(item.href)}>{item.label}</a>)}
        </nav>
        <Button asChild className="header-cta"><a href={withBasePath("/contact/")}>Hire team <ArrowUpRight aria-hidden="true" /></a></Button>
        <Button className="menu-trigger" variant="secondary" size="icon" aria-label="Open navigation" popoverTarget="mobile-navigation"><Menu aria-hidden="true" /></Button>
        <aside id="mobile-navigation" className="mobile-sheet" popover="auto" role="dialog" aria-labelledby="mobile-navigation-title">
          <button className="mobile-sheet__close" type="button" aria-label="Close menu" popoverTarget="mobile-navigation" popoverTargetAction="hide"><X aria-hidden="true" /></button>
          <h2 id="mobile-navigation-title">Navigate Spartan</h2>
          <p>Explore the studio, systems, and working notes.</p>
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => <a href={withBasePath(item.href)} key={item.href}><span>0{index + 1}</span>{item.label}</a>)}
          </nav>
        </aside>
      </div>
    </header>
  );
}
