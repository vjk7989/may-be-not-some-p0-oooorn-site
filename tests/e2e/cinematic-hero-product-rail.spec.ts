import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const products = [
  {
    name: "Hyper Tern",
    role: "Control AI execution",
    href: "/products/hyper-tern/",
  },
  {
    name: "Hyper-ABS",
    role: "Protect information before inference",
    href: "/products/hyper-abs/",
  },
  {
    name: "Hyper-0x",
    role: "Verify execution evidence",
    href: "/products/hyper-0x/",
  },
] as const;

const referenceHosts = /(?:^|\.)(?:spartanai\.framer\.website|pavii\.tech|framerusercontent\.com)$/i;

async function expectNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1);
}

test.describe("cinematic hero and glass product rail", () => {
  test("starts the hero media behind the inset floating header without a top strip", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const header = page.locator(".site-header");
    const hero = page.locator("[data-cinematic-hero]");
    const media = page.locator("[data-hero-media]");
    const [headerBox, heroBox, mediaBox] = await Promise.all([
      header.boundingBox(),
      hero.boundingBox(),
      media.boundingBox(),
    ]);
    if (!headerBox || !heroBox || !mediaBox) throw new Error("Missing hero/header geometry");

    expect(heroBox.y).toBeLessThanOrEqual(1);
    expect(mediaBox.y).toBeLessThanOrEqual(1);
    expect(headerBox.y).toBeGreaterThan(0);
    expect(mediaBox.y + mediaBox.height).toBeGreaterThan(headerBox.y + headerBox.height);
    expect(mediaBox.x).toBeLessThanOrEqual(headerBox.x);
    expect(mediaBox.x + mediaBox.width).toBeGreaterThanOrEqual(headerBox.x + headerBox.width);

    const topSurface = await page.evaluate(() => {
      const node = document.elementFromPoint(window.innerWidth / 2, 1);
      return node?.closest("[data-cinematic-hero], [data-hero-media]") !== null;
    });
    expect(topSurface).toBe(true);
  });

  test("renders exactly three equal desktop glass product boxes in canonical order", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const rail = page.locator("[data-hero-product-rail]");
    const cards = rail.locator("[data-hero-product-card]");
    await expect(cards).toHaveCount(3);

    const widths = await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.getBoundingClientRect().width),
    );
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(2);

    for (const [index, product] of products.entries()) {
      const card = cards.nth(index);
      await expect(card.getByRole("heading", { name: product.name, exact: true })).toBeVisible();
      await expect(card.getByText(product.role, { exact: true })).toBeVisible();
      await expect(card.getByText("Current capability", { exact: true })).toBeVisible();
      await expect(card).toHaveRole("link");
      await expect(card).toHaveAccessibleName(new RegExp(`Explore ${product.name}`, "i"));
      await expect(card).toHaveAttribute("href", product.href);
    }

    const glass = await cards.first().evaluate((node) => {
      const style = getComputedStyle(node);
      const color = style.backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
      return {
        alpha: color.length === 4 ? color[3] : 1,
        backdrop: style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter"),
        radius: Number.parseFloat(style.borderTopLeftRadius),
      };
    });
    expect(glass.alpha).toBeLessThan(1);
    expect(glass.backdrop).toMatch(/blur\(/);
    expect(glass.radius).toBeGreaterThanOrEqual(16);
  });

  test("uses a readable horizontal scroll-snap rail on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const rail = page.locator("[data-hero-product-rail]");
    const cards = rail.locator("[data-hero-product-card]");
    const geometry = await rail.evaluate((node) => {
      const style = getComputedStyle(node);
      return {
        overflowX: style.overflowX,
        scrollSnapType: style.scrollSnapType,
        clientWidth: node.clientWidth,
        scrollWidth: node.scrollWidth,
      };
    });
    expect(geometry.overflowX).toMatch(/auto|scroll/);
    expect(geometry.scrollSnapType).toMatch(/^x\b/);
    expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);

    for (let index = 0; index < products.length; index += 1) {
      await expect(cards.nth(index)).toContainText(products[index].name);
      await expect(cards.nth(index)).toContainText(products[index].role);
    }
    await cards.last().scrollIntoViewIfNeeded();
    await expect(cards.last()).toBeInViewport();
    await expectNoHorizontalOverflow(page);
  });

  test("provides opaque reduced-transparency and static reduced-motion states", async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-reduced-transparency", value: "reduce" },
        { name: "prefers-reduced-motion", value: "reduce" },
      ],
    });
    await page.goto("/", { waitUntil: "networkidle" });

    const rail = page.locator("[data-hero-product-rail]");
    const cards = rail.locator("[data-hero-product-card]");
    const presentation = await cards.first().evaluate((node) => {
      const style = getComputedStyle(node);
      const color = style.backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
      return {
        alpha: color.length === 4 ? color[3] : 1,
        animationName: style.animationName,
        backdrop: style.backdropFilter || style.getPropertyValue("-webkit-backdrop-filter"),
        transitionDuration: style.transitionDuration,
      };
    });
    expect(presentation.alpha).toBeGreaterThanOrEqual(0.95);
    expect(presentation.backdrop).toBe("none");
    expect(presentation.animationName).toBe("none");
    expect(presentation.transitionDuration.split(", ").every((duration) => duration === "0s")).toBe(true);
    expect(await rail.evaluate((node) => node.getAnimations({ subtree: true }).length)).toBe(0);
  });

  test("never requests or embeds reference-site resources", async ({ page }) => {
    const prohibitedRequests: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (referenceHosts.test(url.hostname)) prohibitedRequests.push(request.url());
    });

    await page.goto("/", { waitUntil: "networkidle" });
    expect(prohibitedRequests).toEqual([]);
    expect(await page.content()).not.toMatch(
      /(?:spartanai\.framer\.website|pavii\.tech|framerusercontent\.com)/i,
    );
  });

  test("preserves the approved desktop navigation semantics", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary navigation", exact: true });
    const links = nav.locator(":scope > [data-nav-item] > [data-nav-link]");
    await expect(links).toHaveCount(5);
    for (const [index, label] of ["Home", "About", "Products", "Services", "Blog"].entries()) {
      await expect(links.nth(index)).toHaveAccessibleName(label);
    }
    await expect(nav.locator('[data-nav-link="home"]')).toHaveAttribute("aria-current", "page");
    await expect(page.locator('[data-nav-link="contact"]:visible')).toHaveAttribute(
      "href",
      "https://cal.com/buckleson-group/30min",
    );
  });
});

test("no-JavaScript output keeps every hero product readable and linked", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const cards = page.locator("[data-hero-product-card]");
  await expect(cards).toHaveCount(3);
  for (const [index, product] of products.entries()) {
    const card = cards.nth(index);
    await expect(card).toContainText(product.name);
    await expect(card).toContainText(product.role);
    await expect(card).toHaveRole("link");
    await expect(card).toHaveAccessibleName(new RegExp(`Explore ${product.name}`, "i"));
    await expect(card).toHaveAttribute("href", product.href);
  }
  await expectNoHorizontalOverflow(page);
  await context.close();
});
