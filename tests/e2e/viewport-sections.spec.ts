import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const sectionClasses = [
  "hero-section",
  "risk-section",
  "outcomes-section",
  "products-section",
  "hyper-section",
  "services-section",
  "industries-section",
  "articles-section",
  "assessment-cta",
] as const;

const viewports = [
  { label: "small short mobile", width: 320, height: 568 },
  { label: "standard mobile", width: 390, height: 844 },
  { label: "landscape phone", width: 844, height: 390 },
  { label: "portrait tablet", width: 768, height: 1024 },
  { label: "landscape tablet", width: 1024, height: 768 },
  { label: "common laptop", width: 1366, height: 768 },
  { label: "desktop", width: 1440, height: 900 },
  { label: "large desktop", width: 1920, height: 1080 },
  { label: "200 percent zoom equivalent", width: 720, height: 450 },
] as const;

type SectionGeometry = {
  className: string;
  height: number;
  intrinsicHeight: number;
  scrollHeight: number;
  clientHeight: number;
  overflowY: string;
  inlineHeight: string;
  inlineMinHeight: string;
  inlineMinBlockSize: string;
  escapedMeaningfulElements: string[];
};

function sections(page: Page) {
  return page.locator("main#main-content > [data-viewport-section]");
}

async function settleLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (image) => {
        if (image.complete || image.loading === "lazy") return Promise.resolve();
        return new Promise<void>((resolveImage) => {
          image.addEventListener("load", () => resolveImage(), { once: true });
          image.addEventListener("error", () => resolveImage(), { once: true });
        });
      }),
    );
    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame())),
    );
  });
}

async function stickyHeaderFootprint(page: Page) {
  return page.locator(".site-header").evaluate((header) => {
    const bounds = header.getBoundingClientRect();
    return Math.max(0, bounds.bottom - Math.min(0, bounds.top));
  });
}

async function readGeometry(section: Locator): Promise<SectionGeometry> {
  return section.evaluate((element) => {
    const sectionElement = element as HTMLElement;
    const original = {
      height: sectionElement.style.height,
      minHeight: sectionElement.style.minHeight,
      minBlockSize: sectionElement.style.minBlockSize,
    };
    const renderedBounds = sectionElement.getBoundingClientRect();
    const renderedStyles = getComputedStyle(sectionElement);
    const meaningfulSelector = [
      "h1",
      "h2",
      "h3",
      "p:not(.sr-only)",
      "a",
      "button",
      "img",
      "li",
      "dt",
      "dd",
      '[role="img"]',
    ].join(",");
    const escapedMeaningfulElements = Array.from(
      sectionElement.querySelectorAll<HTMLElement>(meaningfulSelector),
    )
      .filter((child) => {
        const styles = getComputedStyle(child);
        const bounds = child.getBoundingClientRect();
        const visible =
          styles.display !== "none" &&
          styles.visibility !== "hidden" &&
          Number.parseFloat(styles.opacity || "1") > 0 &&
          bounds.width > 0 &&
          bounds.height > 0;
        return visible && bounds.bottom > renderedBounds.bottom + 2;
      })
      .map((child) => {
        const label = child.textContent?.trim().replace(/\s+/g, " ").slice(0, 48);
        return `${child.tagName.toLowerCase()}${label ? `:${label}` : ""}`;
      });

    sectionElement.style.height = "auto";
    sectionElement.style.minHeight = "0px";
    sectionElement.style.minBlockSize = "0px";
    const intrinsicHeight = sectionElement.scrollHeight;
    sectionElement.style.height = original.height;
    sectionElement.style.minHeight = original.minHeight;
    sectionElement.style.minBlockSize = original.minBlockSize;

    return {
      className: sectionElement.className,
      height: renderedBounds.height,
      intrinsicHeight,
      scrollHeight: sectionElement.scrollHeight,
      clientHeight: sectionElement.clientHeight,
      overflowY: renderedStyles.overflowY,
      inlineHeight: original.height,
      inlineMinHeight: original.minHeight,
      inlineMinBlockSize: original.minBlockSize,
      escapedMeaningfulElements,
    };
  });
}

async function expectViewportContract(page: Page, context: string) {
  const homepageSections = sections(page);
  await expect(homepageSections, `${context}: exact viewport-section count`).toHaveCount(
    sectionClasses.length,
  );

  const headerFootprint = await stickyHeaderFootprint(page);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  const usableHeight = viewportHeight - headerFootprint;

  for (const [index, expectedClass] of sectionClasses.entries()) {
    const section = homepageSections.nth(index);
    await expect(section, `${context}: ${expectedClass} is visible`).toBeVisible();
    await expect(section, `${context}: section order`).toHaveClass(new RegExp(`\\b${expectedClass}\\b`));
    await section.scrollIntoViewIfNeeded();
    const geometry = await readGeometry(section);

    expect(
      geometry.inlineHeight,
      `${context}: ${expectedClass} must not use runtime inline height`,
    ).toBe("");
    expect(
      geometry.inlineMinHeight,
      `${context}: ${expectedClass} must not use runtime inline min-height`,
    ).toBe("");
    expect(
      geometry.inlineMinBlockSize,
      `${context}: ${expectedClass} must not use runtime inline min-block-size`,
    ).toBe("");
    expect(
      ["auto", "visible"],
      `${context}: ${expectedClass} must not become an internal vertical scroller`,
    ).toContain(geometry.overflowY);
    expect(
      geometry.scrollHeight,
      `${context}: ${expectedClass} content must not be vertically clipped`,
    ).toBeLessThanOrEqual(geometry.clientHeight + 2);
    expect(
      geometry.escapedMeaningfulElements,
      `${context}: meaningful content escaped ${expectedClass}`,
    ).toEqual([]);

    if (geometry.intrinsicHeight <= usableHeight + 2) {
      expect(
        Math.abs(geometry.height - usableHeight),
        `${context}: ${expectedClass} should fill the usable viewport`,
      ).toBeLessThanOrEqual(2);
    } else {
      expect(
        geometry.height,
        `${context}: ${expectedClass} should grow to contain intrinsic content`,
      ).toBeGreaterThanOrEqual(geometry.intrinsicHeight - 2);
    }
  }

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const overflowSources = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        const styles = getComputedStyle(element);
        return (
          styles.display !== "none" &&
          bounds.width > 0 &&
          (bounds.right > document.documentElement.clientWidth + 1 || bounds.left < -1)
        );
      })
      .slice(0, 8)
      .map((element) => `${element.tagName.toLowerCase()}.${element.className}`),
  );
  expect(
    horizontalOverflow,
    `${context}: document horizontal overflow from ${overflowSources.join(", ")}`,
  ).toBeLessThanOrEqual(1);
}

test("homepage exposes exactly nine ordered semantic viewport sections", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await settleLayout(page);

  await expect(page.locator("main#main-content h1:visible")).toHaveCount(1);
  await expectViewportContract(page, "semantic homepage baseline");
  await expect(page.locator("footer[data-viewport-section]")).toHaveCount(0);
});

for (const viewport of viewports) {
  test(`${viewport.label} ${viewport.width}x${viewport.height} satisfies the viewport contract`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await settleLayout(page);
    await expectViewportContract(page, `${viewport.label} ${viewport.width}x${viewport.height}`);
  });
}

test("200 percent root text scaling grows scenes instead of clipping content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  await settleLayout(page);

  await expectViewportContract(page, "200 percent root text scaling");
  await expect(page.getByRole("link", { name: "Book a Security Assessment" }).first()).toBeVisible();
  await expect(page.locator("#platform").getByRole("button", { name: /Hyper Tern/ })).toBeVisible();
});

test("resize recovery preserves CSS geometry and the selected Platform product", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await settleLayout(page);
  await expectViewportContract(page, "initial desktop");

  const platform = page.locator("#platform");
  const hyperAbs = platform.getByRole("button", { name: /^Hyper-ABS/ });
  await hyperAbs.focus();
  await expect(hyperAbs).toHaveAttribute("aria-expanded", "true");
  const initialHeights = await sections(page).evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().height),
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await settleLayout(page);
  await expect(hyperAbs).toHaveAttribute("aria-expanded", "true");
  await expectViewportContract(page, "resize to mobile");

  await page.setViewportSize({ width: 1440, height: 900 });
  await settleLayout(page);
  await expect(hyperAbs).toHaveAttribute("aria-expanded", "true");
  await expectViewportContract(page, "resize back to desktop");
  const recoveredHeights = await sections(page).evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().height),
  );
  expect(recoveredHeights).toHaveLength(initialHeights.length);
  recoveredHeights.forEach((height, index) => {
    expect(Math.abs(height - initialHeights[index])).toBeLessThanOrEqual(2);
  });
});

test("all Platform states stay inside the viewport-section boundary", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await settleLayout(page);
  const platform = page.locator("#platform");

  for (const product of ["Hyper Tern", "Hyper-ABS", "Hyper-0x"]) {
    const trigger = platform.getByRole("button", { name: new RegExp(`^${product}`) });
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await settleLayout(page);
    const geometry = await readGeometry(platform);
    expect(geometry.scrollHeight, `${product}: no nested section scrolling`).toBeLessThanOrEqual(
      geometry.clientHeight + 2,
    );
    expect(geometry.escapedMeaningfulElements, `${product}: no clipped content`).toEqual([]);
  }
});

test("reduced motion keeps complete, stable viewport geometry", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await settleLayout(page);
  await expectViewportContract(page, "reduced motion");

  const first = await sections(page).evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().height),
  );
  await page.evaluate(
    () => new Promise<void>((resolveFrame) => requestAnimationFrame(() => resolveFrame())),
  );
  const second = await sections(page).evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().height),
  );
  second.forEach((height, index) => {
    expect(Math.abs(height - first[index])).toBeLessThanOrEqual(0.5);
  });

  const movingRiskTokens = page.locator(".risk-section .moving-token");
  for (let index = 0; index < await movingRiskTokens.count(); index += 1) {
    await expect(movingRiskTokens.nth(index)).toBeHidden();
  }
});

test.describe("viewport sections without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps all products and scenes readable in natural flow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "load" });
    await expectViewportContract(page, "no JavaScript");

    const fallback = page.locator("#platform .platform-noscript");
    await expect(page.locator("#platform .platform-panels")).toBeHidden();
    await expect(fallback).toBeVisible();
    for (const product of ["Hyper Tern", "Hyper-ABS", "Hyper-0x"]) {
      await expect(fallback.getByText(product, { exact: true })).toBeVisible();
      await expect(fallback.getByRole("link", { name: new RegExp(product) })).toBeVisible();
    }
  });
});

test("platform anchor clears the sticky header", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/#platform");
  await settleLayout(page);

  const positions = await page.evaluate(() => ({
    headerBottom: document.querySelector(".site-header")!.getBoundingClientRect().bottom,
    platformTop: document.querySelector("#platform")!.getBoundingClientRect().top,
  }));
  expect(positions.platformTop).toBeGreaterThanOrEqual(positions.headerBottom - 2);
  expect(positions.platformTop).toBeLessThan(positions.headerBottom + 80);
});

test("blocked homepage images preserve scene structure and horizontal fit", async ({ page }) => {
  await page.route(/\.(?:png|jpe?g|webp|avif)(?:\?.*)?$/i, (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await settleLayout(page);

  await expect(sections(page)).toHaveCount(sectionClasses.length);
  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
  for (const section of await sections(page).all()) {
    await section.scrollIntoViewIfNeeded();
    const geometry = await readGeometry(section);
    expect(geometry.height).toBeGreaterThan(0);
    expect(geometry.escapedMeaningfulElements).toEqual([]);
  }
});

test("viewport implementation adds no Aceternity or motion runtime", () => {
  const packageJson = JSON.parse(
    readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
  ) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  const dependencyNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ];
  expect(dependencyNames.filter((name) => /aceternity|framer-motion/i.test(name))).toEqual([]);
  expect(readFileSync(resolve(process.cwd(), "components.json"), "utf8")).toContain(
    '"style": "new-york"',
  );
});
