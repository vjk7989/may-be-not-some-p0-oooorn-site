"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation, siteConfig, withBasePath } from "@/lib/site-data";

function isCurrent(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <BrandLogo />
        <nav className="desktop-navigation" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild size="sm" className="desktop-assessment">
            <a href={siteConfig.calendarUrl}>Contact Us</a>
          </Button>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="mobile-menu-trigger"
              aria-label="Open menu"
            >
              <Menu aria-hidden="true" className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="pr-12 text-2xl font-semibold">
              Navigate Buckleson
            </SheetTitle>
            <SheetDescription className="mt-2 text-sm text-[var(--muted)]">
              Company information, products, services, and AI security guides.
            </SheetDescription>
            <nav className="mobile-navigation" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={
                      isCurrent(pathname, item.href) ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <Button asChild className="mt-auto w-full">
                <a href={siteConfig.calendarUrl}>Contact Us</a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <noscript>
          <style>{`
            .header-inner {
              flex-wrap: wrap;
              gap: 0.5rem;
              padding-top: 0.75rem;
            }
            .mobile-menu-trigger {
              display: none !important;
            }
            .no-script-nav {
              display: flex !important;
              width: 100%;
              flex-wrap: wrap;
              gap: 0.5rem 1rem;
              border-top: 1px solid var(--line);
              padding: 0.75rem 0 1rem;
            }
            .no-script-nav a {
              color: var(--ink);
              font-size: 0.875rem;
              font-weight: 600;
              text-decoration: none;
            }
          `}</style>
          <nav className="no-script-nav" aria-label="Navigation without JavaScript">
            {navigation.map((item) => (
              <a key={item.href} href={withBasePath(item.href)}>
                {item.label}
              </a>
            ))}
            <a href={siteConfig.calendarUrl}>Contact Us</a>
          </nav>
        </noscript>
      </div>
    </header>
  );
}
