"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import type { CSSProperties, FocusEvent, KeyboardEvent } from "react";

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
import {
  navigation,
  siteConfig,
  withBasePath,
} from "@/lib/site-data";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";

type NavigationKey = "home" | "about" | "products" | "services" | "blog";

interface NavigationDestination {
  label: string;
  href: string;
  summary: string;
}

interface NavigationGroup {
  title: string;
  summary: string;
  destinations: NavigationDestination[];
}

const navigationKeys: Record<string, NavigationKey> = {
  "/": "home",
  "/about/": "about",
  "/products/": "products",
  "/services/": "services",
  "/blog/": "blog",
};

function destinationsFor(label: string): NavigationDestination[] {
  const item = bucklesonSiteContent.navigation.find((entry) => entry.label === label);
  return item?.items?.map(({ label, href, description }) => ({ label, href, summary: description })) ?? [];
}

const navigationGroups: Partial<Record<NavigationKey, NavigationGroup>> = {
  about: {
    title: "Know what Buckleson stands for.",
    summary: "Mission, protection layers, responsibility, and the path from current capability to long-term vision.",
    destinations: destinationsFor("About"),
  },
  products: {
    title: "Three products. One execution boundary.",
    summary: "Protect information, control what AI can do, and preserve attributable evidence.",
    destinations: destinationsFor("Products"),
  },
  services: {
    title: "Apply the controls to real AI work.",
    summary: "Start from the workflow, its data, permissions, actions, and intended outcome.",
    destinations: destinationsFor("Services"),
  },
  blog: {
    title: "Practical guidance for safer AI.",
    summary: "Clear explanations of agent risks, inference controls, data exposure, and accountable execution.",
    destinations: destinationsFor("Blog"),
  },
};

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
  const [menuState, setMenuState] = useState<{
    pathname: string;
    activeMenu: NavigationKey | null;
  }>({ pathname, activeMenu: null });
  const triggerRefs = useRef<Partial<Record<NavigationKey, HTMLAnchorElement | null>>>({});

  if (menuState.pathname !== pathname) {
    setMenuState({ pathname, activeMenu: null });
  }

  const activeMenu = menuState.activeMenu;

  function setActiveMenu(activeMenu: NavigationKey | null) {
    setMenuState({ pathname, activeMenu });
  }

  function closeWhenFocusLeaves(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setActiveMenu(null);
    }
  }

  function closeWithEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape" || !activeMenu) return;
    event.preventDefault();
    const activeTrigger = triggerRefs.current[activeMenu];
    activeTrigger?.focus();
    setActiveMenu(null);
  }

  return (
    <header className="site-header">
      <div
        className="shell header-inner"
        onPointerLeave={() => setActiveMenu(null)}
      >
        <BrandLogo eager />
        <nav
          className="desktop-navigation"
          aria-label="Primary navigation"
          onBlur={closeWhenFocusLeaves}
          onKeyDown={closeWithEscape}
        >
          {navigation.map((item) => {
            const key = navigationKeys[item.href];
            const group = navigationGroups[key];
            const isOpen = Boolean(group && activeMenu === key);

            return (
              <div
                className="nav-item"
                data-nav-item={key}
                key={item.href}
                onPointerEnter={() => group && setActiveMenu(key)}
              >
                <Link
                  ref={(node) => {
                    triggerRefs.current[key] = node;
                  }}
                  id={`nav-link-${key}`}
                  data-nav-link={key}
                  href={item.href}
                  className="nav-cell"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  aria-controls={group ? `nav-panel-${key}` : undefined}
                  aria-expanded={group ? isOpen : undefined}
                  aria-haspopup={group ? "true" : undefined}
                  onFocus={() => setActiveMenu(group ? key : null)}
                >
                  <NavLabel>{item.label}</NavLabel>
                  {group ? <ChevronDown aria-hidden="true" className="nav-chevron" /> : null}
                </Link>

                {group ? (
                  <div
                    id={`nav-panel-${key}`}
                    data-nav-panel={key}
                    data-state={isOpen ? "open" : "closed"}
                    className="mega-menu-panel"
                    aria-labelledby={`nav-link-${key}`}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                    <div className="mega-menu-intro">
                      <span>Explore {item.label}</span>
                      <p className="mega-menu-title">{group.title}</p>
                      <p>{group.summary}</p>
                    </div>
                    <div className="mega-menu-links">
                      {group.destinations.map((destination) => (
                        <Link className="mega-menu-link" href={destination.href} key={destination.href}>
                          <span>{destination.label}</span>
                          <p>{destination.summary}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <a
          href={siteConfig.calendarUrl}
          className="nav-cell nav-contact desktop-assessment"
          data-nav-link="contact"
          onFocus={() => setActiveMenu(null)}
        >
          <NavLabel>Contact Us</NavLabel>
        </a>

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
          <SheetContent className="mobile-menu-sheet">
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
                    data-nav-link={navigationKeys[item.href]}
                    aria-current={
                      isCurrent(pathname, item.href) ? "page" : undefined
                    }
                  >
                    <NavLabel>{item.label}</NavLabel>
                  </Link>
                </SheetClose>
              ))}
              <a
                href={siteConfig.calendarUrl}
                className="nav-cell nav-contact mobile-assessment"
                data-nav-link="contact"
              >
                <NavLabel>Contact Us</NavLabel>
              </a>
              <div className="mobile-navigation-groups">
                {(Object.entries(navigationGroups) as [NavigationKey, NavigationGroup][]).map(
                  ([key, group]) => (
                    <section className="mobile-navigation-group" data-mobile-nav-group={key} key={key}>
                      <div>
                        <h2>{navigation.find((item) => navigationKeys[item.href] === key)?.label}</h2>
                        <p>{group.summary}</p>
                      </div>
                      <div>
                        {group.destinations.map((destination) => (
                          <SheetClose asChild key={destination.href}>
                            <Link href={destination.href}>
                              <span>{destination.label}</span>
                              <p>{destination.summary}</p>
                            </Link>
                          </SheetClose>
                        ))}
                      </div>
                    </section>
                  ),
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <noscript>
          <style>{`
            :root {
              --header-height: 11rem;
            }
            .header-inner {
              height: auto;
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
              grid-template-columns: 1fr;
              align-content: center;
              gap: 1rem;
              border-top: 1px solid var(--line);
              padding: 0.75rem 0 1rem;
            }
            .no-script-primary,
            .no-script-groups {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 0.5rem 1rem;
            }
            .no-script-groups {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .no-script-group {
              display: grid;
              gap: 0.35rem;
              border-top: 1px solid var(--line);
              padding-top: 0.75rem;
            }
            .no-script-group strong { color: var(--primary); }
            .no-script-nav a {
              color: var(--ink);
              font-size: 0.875rem;
              font-weight: 600;
              text-decoration: none;
            }
            @media (max-width: 36rem) {
              .no-script-groups { grid-template-columns: 1fr; }
            }
          `}</style>
          <nav className="no-script-nav" aria-label="Navigation without JavaScript">
            <div className="no-script-primary">
              {navigation.map((item) => (
                <a key={item.href} href={withBasePath(item.href)}>
                  {item.label}
                </a>
              ))}
              <a href={siteConfig.calendarUrl}>Contact Us</a>
            </div>
            <div className="no-script-groups">
              {(Object.entries(navigationGroups) as [NavigationKey, NavigationGroup][]).map(
                ([key, group]) => (
                  <section className="no-script-group" data-no-script-nav-group={key} key={key}>
                    <strong>{navigation.find((item) => navigationKeys[item.href] === key)?.label}</strong>
                    {group.destinations.map((destination) => (
                      <a href={withBasePath(destination.href)} key={destination.href}>
                        {destination.label}
                      </a>
                    ))}
                  </section>
                ),
              )}
            </div>
          </nav>
        </noscript>
      </div>
    </header>
  );
}
