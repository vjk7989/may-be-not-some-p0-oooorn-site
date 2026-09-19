import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const routes = [
  "/",
  "/products",
  "/services",
  "/about",
  "/blog",
  "/blog/ai-agent-security",
  "/blog/prompt-injection-prevention",
  "/blog/secure-ai-inference",
  "/blog/llm-data-leakage",
  "/blog/excessive-agency",
  "/blog/ai-audit-trails",
];

const calendarUrl = "https://cal.com/buckleson-group/30min";

const headerNavigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Services", href: "/services/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact Us", href: calendarUrl },
] as const;

async function expectHeaderLinks(links: Locator) {
  await expect(links).toHaveCount(headerNavigation.length);
  for (const [index, item] of headerNavigation.entries()) {
    await expect(links.nth(index)).toHaveAccessibleName(item.label);
    await expect(links.nth(index)).toHaveAttribute("href", item.href);
  }
}

async function expectHeaderNavigation(navigation: Locator) {
  await expectHeaderLinks(navigation.getByRole("link"));
}

function cssTimeToSeconds(value: string) {
  const normalized = value.trim();
  return normalized.endsWith("ms")
    ? Number.parseFloat(normalized) / 1000
    : Number.parseFloat(normalized);
}

const outcomes = [
  {
    title: "Protect data",
    description:
      "Reduce unnecessary sensitive-data exposure before approved information reaches a model.",
  },
  {
    title: "Control actions",
    description:
      "Check identities, permissions, tools, resources, and downstream actions against policy.",
  },
  {
    title: "Verify execution",
    description:
      "Preserve attributable, tamper-evident records that support audit and settlement.",
  },
] as const;

const services = [
  {
    name: "AI Security",
    summary:
      "Assess the data, permissions, tools, and actions around an AI workflow, then define practical control boundaries.",
    boundary:
      "Security controls help reduce risk; they do not guarantee that every attack or unsafe outcome is prevented.",
  },
  {
    name: "Secure Inference",
    summary:
      "Protect and control information around the inference path through minimization, transformation, routing, and policy enforcement.",
    boundary:
      "This describes protection around inference. It is not a claim of confidential computing or proof of model correctness.",
  },
  {
    name: "Custom AI",
    summary:
      "Provide custom AI model development and fine-tuning for defined business requirements while keeping deployment controls and evaluation criteria explicit.",
    boundary:
      "Model work is scoped to agreed requirements, data permissions, evaluation evidence, and deployment responsibilities.",
  },
] as const;

const hyperExplanation =
  "Hyper-0x is Buckleson’s in-house blockchain for tamper-evident execution records, verification, audit, and settlement. It can preserve evidence of what was authorized and recorded; it does not prove that a model response is true or make private data confidential.";

const hyperDefinitions = [
  ["Record", "Attributable events from an approved execution path."],
  ["Verify", "Detect changes to recorded evidence."],
  ["Audit", "Reconstruct a useful chain of activity."],
  ["Settle", "Support accountable machine-to-machine outcomes."],
] as const;

test.describe("production route contract", () => {
  for (const route of routes) {
    test(`${route} has a usable semantic shell`, async ({ page }) => {
      const externalRequests: string[] = [];
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (!['127.0.0.1', 'localhost'].includes(url.hostname)) externalRequests.push(request.url());
      });

      await page.goto(route, { waitUntil: "networkidle" });
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.locator("main#main-content")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    await expect(
      page.getByRole("navigation", {
        name: "Primary navigation",
        exact: true,
      }),
    ).toBeVisible();
      expect(externalRequests, `unexpected runtime requests on ${route}`).toEqual([]);

      // The pinned Axe adapter currently declares an older structural Page type.
      // Runtime compatibility is covered by the browser test itself.
      const results = await new AxeBuilder({ page: page as never }).analyze();
      const severe = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
      expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
    });
  }
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.locator('a[href="#main-content"]');
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("mobile navigation exposes and restores its expanded state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.locator("button.mobile-menu-trigger");
  await expect(trigger).toHaveCount(1);
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAccessibleName("Open menu");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Products", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("desktop header exposes the exact requested navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  await expect(navigation).toBeVisible();
  await expectHeaderNavigation(navigation);
  await expect(navigation.getByRole("link", { name: "Home", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(
    navigation.getByRole("link", { name: "Contact Us", exact: true }),
  ).not.toHaveAttribute("target", "_blank");
});

test("desktop header keeps one glass shell with animated unboxed navigation links", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const header = page.locator(".site-header");
  const surface = page.locator(".header-inner");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  await expectHeaderNavigation(navigation);

  const material = await surface.evaluate((element) => {
    const styles = getComputedStyle(element);
    const bounds = element.getBoundingClientRect();
    const rgba = styles.backgroundColor.match(
      /^rgba?\([^,]+,[^,]+,[^,]+(?:,\s*([\d.]+))?\)$/,
    );
    const modernAlpha = styles.backgroundColor.match(/\/\s*([\d.]+)\s*\)$/);
    const alpha = Number(rgba?.[1] ?? modernAlpha?.[1] ?? 1);
    const webkitBackdropFilter = (
      styles as CSSStyleDeclaration & { webkitBackdropFilter?: string }
    ).webkitBackdropFilter;

    return {
      alpha,
      backdropFilter: styles.backdropFilter,
      webkitBackdropFilter: webkitBackdropFilter ?? "none",
      borderRadius: Number.parseFloat(styles.borderTopLeftRadius),
      boxShadow: styles.boxShadow,
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
      width: bounds.width,
    };
  });

  expect(material.left).toBeGreaterThanOrEqual(16);
  expect(1440 - material.right).toBeGreaterThanOrEqual(16);
  expect(material.top).toBeGreaterThanOrEqual(8);
  expect(material.width).toBeLessThan(1408);
  expect(material.borderRadius).toBeGreaterThanOrEqual(10);
  expect(material.borderRadius).toBeLessThanOrEqual(20);
  expect(material.alpha).toBeGreaterThan(0.35);
  expect(material.alpha).toBeLessThan(0.96);
  expect(
    `${material.backdropFilter} ${material.webkitBackdropFilter}`,
  ).toMatch(/blur\([^)]*[1-9][\d.]*px\)/);
  expect(material.boxShadow).not.toBe("none");

  const cells = navigation.locator("a.nav-cell");
  await expect(cells).toHaveCount(headerNavigation.length);
  const home = navigation.getByRole("link", { name: "Home", exact: true });
  const about = navigation.getByRole("link", { name: "About", exact: true });
  const activeColor = await home.evaluate((element) => getComputedStyle(element).color);
  const inactiveColor = await about.evaluate((element) => getComputedStyle(element).color);
  expect(activeColor).toBe("rgb(109, 40, 217)");
  expect(inactiveColor).not.toBe(activeColor);

  for (const cell of [home, about]) {
    const presentation = await cell.evaluate((element) => {
      const styles = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        background: styles.backgroundColor,
        borderStyle: styles.borderTopStyle,
        borderWidth: Number.parseFloat(styles.borderTopWidth),
        boxShadow: styles.boxShadow,
        width: bounds.width,
        height: bounds.height,
      };
    });
    expect(presentation.background).toBe("rgba(0, 0, 0, 0)");
    expect(presentation.borderStyle === "none" || presentation.borderWidth === 0).toBeTruthy();
    expect(presentation.boxShadow).toBe("none");
    expect(presentation.height).toBeGreaterThanOrEqual(40);
    expect(presentation.width).toBeGreaterThan(presentation.height);
  }

  const labels = about.locator(".nav-label");
  const baseLabel = labels.locator(".nav-label-base");
  const hoverLabel = labels.locator('.nav-label-hover[aria-hidden="true"]');
  await expect(baseLabel).toHaveCount(1);
  await expect(hoverLabel).toHaveCount(1);
  const restLabels = await about.evaluate((element) => {
    const base = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-base")!);
    const hover = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-hover")!);
    const baseLetters = Array.from(
      element.querySelectorAll<HTMLElement>(".nav-label-base .nav-letter"),
      (letter) => getComputedStyle(letter).transform,
    );
    const hoverLetters = Array.from(
      element.querySelectorAll<HTMLElement>(".nav-label-hover .nav-letter"),
      (letter) => getComputedStyle(letter).transform,
    );
    return {
      baseColor: base.color,
      baseLetters,
      hoverColor: hover.color,
      hoverLetters,
    };
  });
  expect(restLabels.baseColor).toBe(inactiveColor);
  expect(restLabels.baseLetters).toHaveLength("About".length);
  expect(restLabels.hoverLetters).toHaveLength("About".length);

  await about.focus();
  await expect(about).toBeFocused();
  await expect.poll(() => hoverLabel.evaluate((element) => getComputedStyle(element).color)).toBe(
    activeColor,
  );
  await expect.poll(() => hoverLabel.locator(".nav-letter").last().evaluate(
    (element) => getComputedStyle(element).transform,
  )).not.toBe(restLabels.hoverLetters.at(-1));
  const focus = await about.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      outlineStyle: styles.outlineStyle,
      outlineWidth: Number.parseFloat(styles.outlineWidth),
      boxShadow: styles.boxShadow,
      background: styles.backgroundColor,
    };
  });
  expect(
    (focus.outlineStyle !== "none" && focus.outlineWidth >= 2) ||
      focus.boxShadow !== "none",
    `navigation focus is not visibly styled: ${JSON.stringify(focus)}`,
  ).toBeTruthy();
  expect(focus.background).toBe("rgba(0, 0, 0, 0)");

  await about.evaluate((element) => (element as HTMLElement).blur());
  await page.mouse.move(0, 0);
  const aboutBounds = await about.boundingBox();
  expect(aboutBounds).not.toBeNull();
  await page.mouse.move(
    aboutBounds!.x + aboutBounds!.width / 2,
    aboutBounds!.y + aboutBounds!.height / 2,
  );
  await expect.poll(() => hoverLabel.evaluate((element) => getComputedStyle(element).color)).toBe(
    activeColor,
  );
  const inactiveHover = await about.evaluate((element) => {
    const styles = getComputedStyle(element);
    const hover = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-hover")!);
    return {
      background: styles.backgroundColor,
      baseTransforms: Array.from(
        element.querySelectorAll<HTMLElement>(".nav-label-base .nav-letter"),
        (letter) => getComputedStyle(letter).transform,
      ),
      hoverColor: hover.color,
      hoverTransforms: Array.from(
        element.querySelectorAll<HTMLElement>(".nav-label-hover .nav-letter"),
        (letter) => getComputedStyle(letter).transform,
      ),
    };
  });
  expect(inactiveHover.background).toBe("rgba(0, 0, 0, 0)");
  expect(inactiveHover.hoverColor).toBe(activeColor);
  expect(inactiveHover.baseTransforms).not.toEqual(restLabels.baseLetters);
  expect(inactiveHover.hoverTransforms).not.toEqual(restLabels.hoverLetters);

  const activeRest = await home.evaluate((element) => {
    const styles = getComputedStyle(element);
    const base = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-base")!);
    const hover = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-hover")!);
    return { background: styles.backgroundColor, baseColor: base.color, hoverColor: hover.color };
  });
  const homeBounds = await home.boundingBox();
  expect(homeBounds).not.toBeNull();
  await page.mouse.move(homeBounds!.x + homeBounds!.width / 2, homeBounds!.y + homeBounds!.height / 2);
  const activeHover = await home.evaluate((element) => {
    const styles = getComputedStyle(element);
    const base = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-base")!);
    const hover = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-hover")!);
    return { background: styles.backgroundColor, baseColor: base.color, hoverColor: hover.color };
  });
  expect(activeHover).toEqual(activeRest);
  expect(activeRest.background).toBe("rgba(0, 0, 0, 0)");
  expect(activeRest.baseColor).toBe(activeColor);
  expect(activeRest.hoverColor).toBe(activeColor);

  const beforePress = await home.evaluate((element) => getComputedStyle(element).transform);
  const bounds = await home.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  const duringPress = await home.evaluate((element) => getComputedStyle(element).transform);
  expect(duringPress).not.toBe(beforePress);
  await page.mouse.up();

  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => done())));
  const sticky = await header.evaluate((element) => {
    const styles = getComputedStyle(element);
    const surfaceBounds = element.querySelector<HTMLElement>(".header-inner")!.getBoundingClientRect();
    return { position: styles.position, top: surfaceBounds.top };
  });
  expect(sticky.position).toBe("sticky");
  expect(sticky.top).toBeGreaterThanOrEqual(0);
  expect(sticky.top).toBeLessThanOrEqual(32);
});

test("navbar label roll is exactly eighteen percent slower at every timing boundary", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });

  for (const item of headerNavigation) {
    const link = navigation.getByRole("link", { name: item.label, exact: true });
    const semanticLabel = link.locator(".nav-label > .sr-only");
    const base = link.locator('.nav-label-base[aria-hidden="true"]');
    const hover = link.locator('.nav-label-hover[aria-hidden="true"]');
    const baseLetters = base.locator(".nav-letter");
    const hoverLetters = hover.locator(".nav-letter");
    const expectedCharacters = Array.from(item.label);

    await expect(link).toHaveAccessibleName(item.label);
    await expect(semanticLabel).toHaveCount(1);
    await expect(semanticLabel).toHaveText(item.label);
    await expect(base).toHaveAttribute("aria-hidden", "true");
    await expect(hover).toHaveAttribute("aria-hidden", "true");
    await expect(baseLetters).toHaveCount(expectedCharacters.length);
    await expect(hoverLetters).toHaveCount(expectedCharacters.length);

    for (const [index, character] of expectedCharacters.entries()) {
      const expected = character === " " ? /^(?: |\u00a0)$/ : character;
      await expect(baseLetters.nth(index)).toHaveText(expected);
      await expect(hoverLetters.nth(index)).toHaveText(expected);
    }

    const timing = await baseLetters.evaluateAll((letters) =>
      letters.map((letter) => {
        const styles = getComputedStyle(letter);
        return {
          character: (letter.textContent ?? "").replace("\u00a0", " "),
          delay: styles.transitionDelay,
          duration: styles.transitionDuration,
          property: styles.transitionProperty,
        };
      }),
    );
    const animatedLetters = timing.filter(({ character }) => character.trim().length > 0);
    const delays = animatedLetters.map(({ delay }) => cssTimeToSeconds(delay.split(",")[0]));
    const durations = animatedLetters.map(({ duration }) =>
      cssTimeToSeconds(duration.split(",")[0]),
    );

    const expectedDurationSeconds = 0.340 * 1.12 * 1.18;
    const expectedStaggerSeconds = 0.028 * 1.12 * 1.18;
    const expectedCompletionSeconds =
      expectedDurationSeconds + (animatedLetters.length - 1) * expectedStaggerSeconds;

    expect(animatedLetters.every(({ property }) => property.includes("transform"))).toBeTruthy();
    for (const duration of durations) {
      expect(duration).toBeCloseTo(expectedDurationSeconds, 5);
    }
    for (const [index, delay] of delays.entries()) {
      expect(delay).toBeCloseTo(index * expectedStaggerSeconds, 5);
    }
    expect((delays.at(-1) ?? 0) + (durations.at(-1) ?? 0)).toBeCloseTo(
      expectedCompletionSeconds,
      5,
    );
  }
});

test("glass navbar CSS includes preference and capability fallbacks", async () => {
  const css = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");

  expect(css).toMatch(
    /@supports\s+not\s*\([^{}]*(?:backdrop-filter|-webkit-backdrop-filter)[^{}]*\)\s*\{[\s\S]*?\.header-inner\s*(?:,\s*\.mega-menu-panel\s*)?\{[\s\S]*?(?:backdrop-filter\s*:\s*none|background\s*:\s*[^;]+(?:0\.9|95%|96%|97%|98%|99%|100%))/i,
  );
  expect(css).toMatch(
    /@media\s*\(prefers-reduced-transparency:\s*reduce\)\s*\{[\s\S]*?\.header-inner\s*(?:,\s*\.mega-menu-panel\s*)?\{[\s\S]*?backdrop-filter\s*:\s*none/i,
  );
  expect(css).toMatch(
    /@media\s*\(prefers-contrast:\s*more\)\s*\{[\s\S]*?\.header-inner\s*(?:,\s*\.mega-menu-panel\s*)?\{[\s\S]*?(?:border|outline)\s*:/i,
  );
  expect(css).toMatch(
    /@media\s*\(hover:\s*hover\)\s+and\s+\(pointer:\s*fine\)\s*\{[\s\S]*?\.nav-cell:hover/i,
  );
  expect(css).toMatch(
    /\.nav-cell:active\s*\{[^{}]*transform\s*:\s*scale\((?:0\.9[5-9]|\.9[5-9])\)/i,
  );
  expect(css).toMatch(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?transition-duration\s*:\s*0\.0*1ms\s*!important/i,
  );
  expect(css).not.toMatch(/\.nav-cell(?:::[a-z-]+|\[[^\]]+\]::[a-z-]+)\s*\{/i);
  expect(css).toMatch(
    /\.nav-cell\[aria-current=["']page["']\]\s*\{[^{}]*color\s*:\s*(?:var\(--primary\)|#(?:6d28d9|7c3aed|8b5cf6))/i,
  );
  expect(css).toMatch(
    /\.nav-label\s*\{[^{}]*overflow\s*:\s*hidden[^{}]*\}/i,
  );
  expect(css).toMatch(/\.nav-letter\s*\{[^{}]*transition[^{}]*transform/i);
  expect(css).toMatch(
    /\.nav-letter\s*\{[^{}]*transition\s*:\s*transform\s+449\.344ms\s+cubic-bezier\(0\.22,\s*1,\s*0\.36,\s*1\)/i,
  );
  expect(css).toMatch(
    /\.nav-letter\s*\{[^{}]*transition-delay\s*:\s*calc\(var\(--letter-index\)\s*\*\s*37\.0048ms\)/i,
  );
  expect(css).not.toMatch(
    /\.nav-label-base\s*,\s*\.nav-label-hover\s*\{[^{}]*transition[^{}]*transform/i,
  );
  expect(css).toMatch(
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.nav-(?:cell|label)[^{}]*\{[^{}]*transition(?:-duration)?\s*:/i,
  );
});

test("Buckleson logo rounding preserves original bytes and rendered proportions", async ({
  page,
}) => {
  const original = readFileSync(resolve(process.cwd(), "public/brand/buckleson-logo.jpg"));
  expect(createHash("sha256").update(original).digest("hex").toUpperCase()).toBe(
    "19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481",
  );

  for (const viewport of [
    { width: 320, height: 720 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const sourceDimensions = await page.evaluate(async () => {
      const source = new Image();
      source.src = new URL("brand/buckleson-logo.jpg", window.location.href).href;
      await source.decode();
      return { width: source.naturalWidth, height: source.naturalHeight };
    });
    expect(sourceDimensions).toEqual({ width: 322, height: 308 });

    const logos = page.locator("img.brand-logo-image, img.boundary-logo");
    expect(await logos.count(), "expected shared header and footer logo instances").toBeGreaterThanOrEqual(2);

    for (let index = 0; index < await logos.count(); index += 1) {
      const logo = logos.nth(index);
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("alt", "");

      const presentation = await logo.evaluate((element) => {
        const image = element as HTMLImageElement;
        const styles = getComputedStyle(image);
        const bounds = image.getBoundingClientRect();
        return {
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          renderedRatio: bounds.width / bounds.height,
          radius: Math.min(
            Number.parseFloat(styles.borderTopLeftRadius),
            Number.parseFloat(styles.borderTopRightRadius),
            Number.parseFloat(styles.borderBottomRightRadius),
            Number.parseFloat(styles.borderBottomLeftRadius),
          ),
          minimumSide: Math.min(bounds.width, bounds.height),
          objectFit: styles.objectFit,
        };
      });

      expect(presentation.naturalWidth).toBeGreaterThan(0);
      expect(presentation.naturalHeight).toBeGreaterThan(0);
      expect(
        Math.abs(presentation.naturalWidth / presentation.naturalHeight - 322 / 308),
        `optimized logo ${index} changed the source proportions`,
      ).toBeLessThanOrEqual(0.01);
      expect(
        Math.abs(presentation.renderedRatio - 322 / 308),
        `logo ${index} is distorted at ${viewport.width}px`,
      ).toBeLessThanOrEqual(0.01);
      expect(presentation.radius).toBeGreaterThanOrEqual(presentation.minimumSide * 0.15);
      expect(presentation.objectFit).toBe("contain");
    }

    const linkedLockups = page.locator(
      ".brand-lockup img.brand-logo-image",
    );
    expect(await linkedLockups.count()).toBeGreaterThanOrEqual(2);
    for (let index = 0; index < await linkedLockups.count(); index += 1) {
      await expect(linkedLockups.nth(index).locator("xpath=ancestor::a[1]")).toHaveAccessibleName(
        "Buckleson home",
      );
    }

    await expect(page.locator(".boundary-logo")).toHaveAttribute("alt", "");
    await expect(page.locator(".boundary-logo").locator("xpath=ancestor::a[1]")).toHaveCount(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `logo treatment overflow at ${viewport.width}px`).toBeLessThanOrEqual(1);
  }
});

test("favicon metadata uses a visible self-contained versioned icon", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const icon = page.locator('link[rel~="icon"]');
  await expect(icon).toHaveCount(1);
  const href = await icon.getAttribute("href");
  expect(href).toMatch(/^(?:\/may-be-not-some-p0-oooorn-site)?\/brand\/buckleson-icon-v2\.svg$/);

  const response = await request.get(href!);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  const svg = await response.text();
  expect(svg.length).toBeGreaterThan(1_000);
  expect(svg).toMatch(/<svg\b[^>]*\bviewBox=["'][^"']+["']/i);
  expect(svg).toMatch(/<clipPath\b/i);
  expect(svg).toMatch(/<rect\b[^>]*\brx=["'][^"']+["']/i);
  expect(svg).toMatch(
    /<image\b[^>]*(?:href|xlink:href)=["']data:image\/jpeg;base64,[A-Za-z0-9+/=]+["'][^>]*preserveAspectRatio=["']xMidYMid meet["']/i,
  );
  expect(svg).not.toMatch(
    /<script\b|\bon\w+\s*=|<foreignObject\b|(?:href|xlink:href)=["'](?:https?:|\/|\.\.?\/|file:)/i,
  );

  const rendering = await page.evaluate(async (iconHref) => {
    const image = new Image();
    image.src = iconHref;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("Canvas 2D context unavailable");
    context.drawImage(image, 0, 0, 64, 64);
    const pixels = context.getImageData(0, 0, 64, 64).data;
    let darkest = 255;
    let lightest = 0;
    let opaque = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] === 0) continue;
      opaque += 1;
      const luminance =
        0.2126 * pixels[index] + 0.7152 * pixels[index + 1] + 0.0722 * pixels[index + 2];
      darkest = Math.min(darkest, luminance);
      lightest = Math.max(lightest, luminance);
    }
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      opaque,
      contrastRange: lightest - darkest,
    };
  }, href!);
  expect(rendering.width).toBeGreaterThan(0);
  expect(rendering.height).toBeGreaterThan(0);
  expect(rendering.opaque).toBeGreaterThan(64 * 64 * 0.5);
  expect(rendering.contrastRange).toBeGreaterThan(180);

  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/brand\/buckleson-logo\.jpg$/,
  );
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    "Buckleson logo",
  );
});

test("mobile header preserves navigation order and active route semantics", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/about/");
    await page.locator("button.mobile-menu-trigger").click();
    const navigation = page.getByRole("navigation", {
      name: "Mobile navigation",
      exact: true,
    });
    const topLevelLinks = navigation.locator(":scope > a[data-nav-link]");
    await expectHeaderLinks(topLevelLinks);
    await expect(
      navigation.locator(':scope > a[data-nav-link][aria-current="page"]'),
    ).toHaveCount(1);
    const currentTopLevelLink = navigation.locator(
      ':scope > a[data-nav-link="about"]',
    );
    await expect(currentTopLevelLink).toHaveAccessibleName("About");
    await expect(currentTopLevelLink).toHaveAttribute("aria-current", "page");
    const cells = navigation.locator(":scope > a.nav-cell[data-nav-link]");
    await expect(cells).toHaveCount(headerNavigation.length);
    const navigationBounds = await navigation.boundingBox();
    expect(navigationBounds).not.toBeNull();
    for (let index = 0; index < headerNavigation.length; index += 1) {
      const cell = cells.nth(index);
      const bounds = await cell.boundingBox();
      expect(bounds, `${headerNavigation[index].label} must have a touch target`).not.toBeNull();
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
      expect(bounds!.width).toBeGreaterThanOrEqual(navigationBounds!.width - 2);
      const presentation = await cell.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          background: styles.backgroundColor,
          borderStyle: styles.borderTopStyle,
          borderWidth: Number.parseFloat(styles.borderTopWidth),
          boxShadow: styles.boxShadow,
        };
      });
      expect(presentation.background).toBe("rgba(0, 0, 0, 0)");
      if (headerNavigation[index].label === "Contact Us") {
        expect(presentation.borderStyle).not.toBe("none");
        expect(presentation.borderWidth).toBeGreaterThanOrEqual(1);
      } else {
        expect(
          presentation.borderStyle === "none" || presentation.borderWidth === 0,
        ).toBeTruthy();
      }
      expect(presentation.boxShadow).toBe("none");
    }

    const current = navigation.getByRole("link", { name: "About", exact: true });
    const inactive = navigation.getByRole("link", { name: "Products", exact: true });
    const [currentStyles, inactiveStyles] = await Promise.all([
      current.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, color: styles.color };
      }),
      inactive.evaluate((element) => {
        const styles = getComputedStyle(element);
        return { background: styles.backgroundColor, color: styles.color };
      }),
    ]);
    expect(currentStyles.background).toBe("rgba(0, 0, 0, 0)");
    expect(inactiveStyles.background).toBe("rgba(0, 0, 0, 0)");
    expect(currentStyles.color).not.toBe(inactiveStyles.color);
    expect(currentStyles.color).toBe("rgb(109, 40, 217)");
    const mobileContact = navigation.getByRole("link", {
      name: "Contact Us",
      exact: true,
    });
    await expect(mobileContact.locator(".nav-label > .sr-only")).toHaveText("Contact Us");
    await expect(mobileContact.locator(".nav-label-base")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(mobileContact.locator(".nav-label-base .nav-letter")).toHaveCount(
      "Contact Us".length,
    );
    await expect(
      mobileContact.locator('.nav-label-hover[aria-hidden="true"] .nav-letter'),
    ).toHaveCount("Contact Us".length);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow at ${viewport.width}px`).toBeLessThanOrEqual(1);
  }
});

test("blog articles keep Blog as the sole current header destination", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of routes.filter((route) => route.startsWith("/blog/"))) {
    await page.goto(`${route}/`);
    const navigation = page.getByRole("navigation", {
      name: "Primary navigation",
      exact: true,
    });
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(navigation.getByRole("link", { name: "Blog", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
});

test("every internal route exposes exactly one current destination", async ({ page }) => {
  const expectations = [
    ["/", "Home"],
    ["/about/", "About"],
    ["/products/", "Products"],
    ["/services/", "Services"],
    ["/blog/", "Blog"],
    ["/blog/prompt-injection-prevention/", "Blog"],
  ] as const;

  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [route, label] of expectations) {
    await page.goto(route);
    const navigation = page.getByRole("navigation", {
      name: "Primary navigation",
      exact: true,
    });
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(navigation.getByRole("link", { name: label, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      navigation.getByRole("link", { name: "Contact Us", exact: true }),
    ).not.toHaveAttribute("aria-current", "page");
  }
});

test("reduced motion preserves navbar state without traveling labels", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  const about = navigation.getByRole("link", { name: "About", exact: true });
  await about.hover();
  const state = await about.evaluate((element) => {
    const styles = getComputedStyle(element);
    const base = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-base")!);
    const hover = getComputedStyle(element.querySelector<HTMLElement>(".nav-label-hover")!);
    const letters = Array.from(element.querySelectorAll<HTMLElement>(".nav-letter"), (letter) => {
      const letterStyles = getComputedStyle(letter);
      return {
        delay: letterStyles.transitionDelay,
        duration: letterStyles.transitionDuration,
        transform: letterStyles.transform,
      };
    });
    return {
      transitionDuration: styles.transitionDuration,
      baseDuration: base.transitionDuration,
      hoverDuration: hover.transitionDuration,
      letters,
      color: styles.color,
      background: styles.backgroundColor,
      baseColor: base.color,
      baseTransform: base.transform,
      hoverDisplay: hover.display,
      hoverOpacity: hover.opacity,
      hoverTransform: hover.transform,
    };
  });
  for (const duration of [state.transitionDuration, state.baseDuration, state.hoverDuration]) {
    const seconds = duration.split(",").map(cssTimeToSeconds);
    expect(seconds.every((value) => value <= 0.001)).toBeTruthy();
  }
  expect(state.letters).toHaveLength("About".length * 2);
  for (const letter of state.letters) {
    expect(letter.duration.split(",").map(cssTimeToSeconds).every((value) => value <= 0.001)).toBeTruthy();
    expect(letter.delay.split(",").map(cssTimeToSeconds).every((value) => value <= 0.001)).toBeTruthy();
    expect(letter.transform).toBe("none");
  }
  expect(state.color).toBe("rgb(109, 40, 217)");
  expect(state.background).toBe("rgba(0, 0, 0, 0)");
  expect(state.baseColor).toBe("rgb(109, 40, 217)");
  expect(state.baseTransform).toBe("none");
  expect(state.hoverTransform).toBe("none");
  expect(state.hoverDisplay === "none" || Number(state.hoverOpacity) === 0).toBeTruthy();
  await expect(about).toBeVisible();
});

test("two-hundred-percent text sizing retains an operable header without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  const trigger = page.locator("button.mobile-menu-trigger");
  const desktop = page.getByRole("navigation", {
    name: "Primary navigation",
    exact: true,
  });
  const usablePath = (await trigger.isVisible()) || (await desktop.isVisible());
  expect(usablePath).toBeTruthy();
  if (await trigger.isVisible()) {
    await trigger.click();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation", exact: true }),
    ).toBeVisible();
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test.describe("navigation without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("exposes a visible and operable fallback at mobile and desktop widths", async ({ page }) => {
    for (const viewport of [
      { width: 320, height: 720 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      const navigation = page.locator(
        'nav.no-script-nav[aria-label="Navigation without JavaScript"]',
      );
      await expect(navigation).toHaveCount(1);
      await expect(navigation).toBeVisible();
      const links = navigation.locator(":scope > .no-script-primary > a");
      await expectHeaderLinks(links);

      for (let index = 0; index < headerNavigation.length; index += 1) {
        const link = links.nth(index);
        await expect(link).toBeVisible();
        const presentation = await link.evaluate((element) => {
          const styles = getComputedStyle(element);
          return {
            background: styles.backgroundColor,
            borderStyle: styles.borderTopStyle,
            borderWidth: Number.parseFloat(styles.borderTopWidth),
            boxShadow: styles.boxShadow,
          };
        });
        expect(presentation.background).toBe("rgba(0, 0, 0, 0)");
        expect(
          presentation.borderStyle === "none" || presentation.borderWidth === 0,
        ).toBeTruthy();
        expect(presentation.boxShadow).toBe("none");
        await link.focus();
        await expect(link).toBeFocused();
      }

      await expect(page.locator("button.mobile-menu-trigger")).toBeHidden();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `no-script navigation overflow at ${viewport.width}px`).toBeLessThanOrEqual(1);
    }
  });
});

test("assessment links use the approved same-tab destination", async ({ page }) => {
  for (const route of ["/", "/products", "/services", "/about"]) {
    await page.goto(route);
    const links = page.locator(`a[href="${calendarUrl}"]`);
    expect(await links.count(), `${route} must contain an assessment link`).toBeGreaterThan(0);
    for (let index = 0; index < await links.count(); index += 1) {
      const target = await links.nth(index).getAttribute("target");
      expect([null, "_self"]).toContain(target);
    }
  }
});

test("homepage polish preserves meaning while changing composition", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const outcomeItems = page.locator(".outcomes-section article.outcome-item");
  await expect(outcomeItems).toHaveCount(outcomes.length);
  for (const [index, outcome] of outcomes.entries()) {
    const item = outcomeItems.nth(index);
    await expect(item.getByRole("heading", { name: outcome.title, exact: true })).toBeVisible();
    await expect(item.getByText(outcome.description, { exact: true })).toBeVisible();
  }

  const outcomeConnectors = outcomeItems.locator(
    ".outcome-connector[aria-hidden=\"true\"]",
  );
  await expect(outcomeConnectors).toHaveCount(2);
  await expect(
    outcomeItems.nth(0).locator('.outcome-connector[aria-hidden="true"]'),
  ).toHaveCount(1);
  await expect(
    outcomeItems.nth(1).locator('.outcome-connector[aria-hidden="true"]'),
  ).toHaveCount(1);
  await expect(
    outcomeItems.nth(2).locator('.outcome-connector[aria-hidden="true"]'),
  ).toHaveCount(0);

  const serviceItems = page.locator(".services-section .service-layout article");
  await expect(serviceItems).toHaveCount(services.length);
  for (const [index, service] of services.entries()) {
    const item = serviceItems.nth(index);
    await expect(item.getByRole("heading", { name: service.name, exact: true })).toBeVisible();
    await expect(item.getByText(service.summary, { exact: true })).toBeVisible();
    await expect(item.getByText(service.boundary, { exact: true })).toBeVisible();
  }
  await expect(page.locator(".services-section .service-number")).toHaveCount(0);
  await expect(page.locator(".services-section .service-featured")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /view all services/i, exact: false }),
  ).toHaveAttribute("href", "/services/");

  const hyper = page.locator(".hyper-section");
  await expect(hyper.getByText("Current capability", { exact: true })).toBeVisible();
  await expect(
    hyper.getByRole("heading", {
      name: "Evidence that is harder to rewrite after the fact.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(hyper.getByText(hyperExplanation, { exact: true })).toBeVisible();
  const definitionRows = hyper.locator(".hyper-definitions > div");
  await expect(definitionRows).toHaveCount(hyperDefinitions.length);
  for (const [index, [term, definition]] of hyperDefinitions.entries()) {
    await expect(definitionRows.nth(index).locator("dt")).toHaveText(term);
    await expect(definitionRows.nth(index).locator("dd")).toHaveText(definition);
  }
  await expect(hyper.getByRole("link", { name: "Explore Hyper-0x", exact: true })).toHaveAttribute(
    "href",
    "/products/#hyper-0x",
  );

  const hyperOverflow = await page.locator(".hyper-layout").evaluate((layout) => {
    const container = layout.getBoundingClientRect();
    const tolerance = 1;

    return Array.from(layout.querySelectorAll<HTMLElement>("*"))
      .filter((element) => {
        const styles = getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        return (
          styles.display !== "none" &&
          styles.visibility !== "hidden" &&
          bounds.width > 0 &&
          bounds.height > 0
        );
      })
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        return (
          bounds.left < container.left - tolerance ||
          bounds.right > container.right + tolerance ||
          bounds.top < container.top - tolerance ||
          bounds.bottom > container.bottom + tolerance
        );
      })
      .map((element) => ({
        className: element.className,
        tagName: element.tagName,
        text: element.textContent?.trim().slice(0, 80),
      }));
  });
  expect(hyperOverflow, JSON.stringify(hyperOverflow, null, 2)).toEqual([]);
});

for (const viewport of [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 1000 },
]) {
  test(`homepage has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /book a security assessment/i }).first()).toBeVisible();
    for (const outcome of outcomes) {
      await expect(page.getByRole("heading", { name: outcome.title, exact: true })).toBeVisible();
    }
    for (const service of services) {
      await expect(page.getByRole("heading", { name: service.name, exact: true })).toBeVisible();
    }
    await expect(
      page.getByRole("heading", {
        name: "Evidence that is harder to rewrite after the fact.",
        exact: true,
      }),
    ).toBeVisible();
  });
}

test("supporting routes remain readable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const route of routes.slice(1)) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("200 percent text sizing preserves the core path", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("link", { name: /book a security assessment/i }).first()).toBeVisible();
});

test("reduced motion keeps the full Risk Landscape visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const landscape = page.getByRole("region", { name: /risk landscape/i }).or(page.locator('[aria-label*="Risk Landscape"]')).first();
  await expect(landscape).toBeVisible();
  for (const phrase of ["Prompt Injection", "Buckleson", "individual users", "servers", "applications", "devices"]) {
    await expect(landscape.getByText(phrase, { exact: false }).first()).toBeVisible();
  }
  const moving = landscape.locator('[data-motion], .motion-token, [class*="animate"]');
  for (let index = 0; index < await moving.count(); index += 1) {
    const styles = await moving.nth(index).evaluate((element) => {
      const computed = getComputedStyle(element);
      return { duration: computed.animationDuration, playState: computed.animationPlayState };
    });
    expect(
      styles.duration === "0s" || styles.duration === "0.001s" || styles.playState === "paused",
      `motion remains active in reduced-motion mode: ${JSON.stringify(styles)}`,
    ).toBeTruthy();
  }
});
