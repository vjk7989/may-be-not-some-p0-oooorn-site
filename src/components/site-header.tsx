"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

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

function NavLabel({ children }: { children: string }) {
  const characters = Array.from(children);
  const renderCharacters = () => {
    let letterIndex = 0;

    return characters.map((character, index) => {
      const staggerIndex = letterIndex;
      if (character.trim()) letterIndex += 1;

      return (
        <span
          className="nav-letter"
          style={{ "--letter-index": staggerIndex } as CSSProperties}
          key={`${character}-${index}`}
        >
          {character}
        </span>
      );
    });
  };

  return (
    <span className="nav-label">
      <span className="sr-only">{children}</span>
      <span className="nav-label-base" aria-hidden="true">
        {renderCharacters()}
      </span>
      <span className="nav-label-hover" aria-hidden="true">
        {renderCharacters()}
      </span>
    </span>
  );
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
              className="nav-cell"
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            >
              <NavLabel>{item.label}</NavLabel>
            </Link>
          ))}
          <a href={siteConfig.calendarUrl} className="nav-cell desktop-assessment">
            <NavLabel>Contact Us</NavLabel>
          </a>
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
                    className="nav-cell"
                    aria-current={
                      isCurrent(pathname, item.href) ? "page" : undefined
                    }
                  >
                    <NavLabel>{item.label}</NavLabel>
                  </Link>
                </SheetClose>
              ))}
              <a href={siteConfig.calendarUrl} className="nav-cell mobile-assessment">
                <NavLabel>Contact Us</NavLabel>
              </a>
            </nav>
          </SheetContent>
        </Sheet>
        <noscript>
          <style>{`
            :root {
              --header-height: 11rem;
            }
            .header-inner {
              height: var(--header-height);
              min-height: var(--header-height);
              flex-wrap: wrap;
              align-content: start;
              gap: 0.5rem;
              padding-top: 0.75rem;
            }
            .mobile-menu-trigger {
              display: none !important;
            }
            .no-script-nav {
              display: grid !important;
              width: 100%;
              height: 6.5rem;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              align-content: center;
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
