import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const products = [
  {
    name: "Hyper Tern",
    slug: "hyper-tern",
    summary:
      "Mediates AI requests before execution so identities, permissions, tools, resources, and actions can be checked against policy.",
  },
  {
    name: "Hyper-ABS",
    slug: "hyper-abs",
    summary:
      "Helps reduce unnecessary sensitive-data exposure before information reaches a model while retaining the context needed for an approved task.",
  },
  {
    name: "Hyper-0x",
    slug: "hyper-0x",
    summary:
      "Buckleson’s in-house blockchain for tamper-evident execution records, verification, audit, and settlement.",
  },
] as const;

function platform(page: Page) {
  return page.locator(".products-section");
}

function panels(page: Page) {
  return platform(page).locator("[data-product-panel]");
}

function trigger(page: Page, name: string) {
  return platform(page).getByRole("button", { name: new RegExp(`^${name}`) });
}

async function expectOneExpanded(page: Page, name: string) {
  const allTriggers = platform(page).getByRole("button");
  await expect(allTriggers).toHaveCount(products.length);
  await expect(platform(page).locator('button[aria-expanded="true"]')).toHaveCount(1);
  await expect(trigger(page, name)).toHaveAttribute("aria-expanded", "true");
}

async function expectExactProductContract(page: Page) {
  const items = panels(page);
  await expect(items).toHaveCount(products.length);
  for (const [index, product] of products.entries()) {
    const item = items.nth(index);
    await expect(item.getByText(product.name, { exact: true }).first()).toBeVisible();
    await expect(item.getByText(product.summary, { exact: true })).toBeAttached();
    await expect(item.locator(`a[href="/products/#${product.slug}"]`)).toHaveAttribute(
      "href",
      `/products/#${product.slug}`,
    );
  }
}

test("platform panels preserve exact content and expose Hyper Tern initially", async ({ page }) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    const host = new URL(request.url()).hostname;
    if (!['127.0.0.1', 'localhost'].includes(host)) externalRequests.push(request.url());
  });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expectExactProductContract(page);
  await expectOneExpanded(page, "Hyper Tern");

  for (const product of products) {
    const control = trigger(page, product.name);
    const controlledId = await control.getAttribute("aria-controls");
    expect(controlledId, `${product.name} needs aria-controls`).toBeTruthy();
    await expect(platform(page).locator(`#${controlledId}`)).toHaveCount(1);
  }
  expect(externalRequests).toEqual([]);
});

test("desktop hover, focus, Enter, and Space persist one selected product", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const abs = trigger(page, "Hyper-ABS");
  await abs.hover();
  await expectOneExpanded(page, "Hyper-ABS");
  const absPanelId = await abs.getAttribute("aria-controls");
  const absContent = platform(page).locator(`#${absPanelId}`);
  await absContent.hover();
  await expectOneExpanded(page, "Hyper-ABS");

  const ox = trigger(page, "Hyper-0x");
  await ox.focus();
  await expectOneExpanded(page, "Hyper-0x");
  await page.keyboard.press("Tab");
  await expect(ox).toHaveAttribute("aria-expanded", "true");
  await expect(platform(page).getByRole("link", { name: /Hyper-0x/ })).toBeFocused();

  await abs.focus();
  await page.keyboard.press("Enter");
  await expectOneExpanded(page, "Hyper-ABS");
  await ox.focus();
  const scrollBeforeSpace = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("Space");
  await expectOneExpanded(page, "Hyper-0x");
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBeforeSpace);
});

test("mobile panels form a one-open accordion with native disclosure semantics", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 720 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expectOneExpanded(page, "Hyper Tern");

    const abs = trigger(page, "Hyper-ABS");
    await abs.click();
    await expectOneExpanded(page, "Hyper-ABS");
    await expect(trigger(page, "Hyper Tern")).toHaveAttribute("aria-expanded", "false");

    await abs.click();
    await expectOneExpanded(page, "Hyper-ABS");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `mobile panel overflow at ${viewport.width}px`).toBeLessThanOrEqual(1);
  }
});

test("product diagrams are decorative and contain no focusable content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const diagrams = panels(page).locator('[data-product-diagram][aria-hidden="true"]');
  await expect(diagrams).toHaveCount(products.length);
  for (let index = 0; index < products.length; index += 1) {
    await expect(
      diagrams.nth(index).locator('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
    ).toHaveCount(0);
  }
});

test.describe("platform panels without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("shows every product summary and link without hover or inert controls", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/");
    const section = platform(page);
    const fallback = section.locator(".platform-noscript");
    await expect(section.locator(".platform-panels")).toBeHidden();
    await expect(fallback).toBeVisible();
    for (const product of products) {
      await expect(fallback.getByText(product.name, { exact: true })).toBeVisible();
      await expect(fallback.getByText(product.summary, { exact: true })).toBeVisible();
      await expect(fallback.getByRole("link", { name: new RegExp(product.name) })).toHaveAttribute(
        "href",
        `/products/#${product.slug}`,
      );
    }
    await expect(section.getByRole("button")).toHaveCount(0);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, "no-JavaScript fallback overflow at 320px").toBeLessThanOrEqual(1);
  });
});

test("reduced motion preserves disclosure and removes meaningful panel motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await trigger(page, "Hyper-ABS").click();
  await expectOneExpanded(page, "Hyper-ABS");

  const moving = platform(page).locator("[data-product-panel], [data-product-content], [data-product-diagram]");
  for (let index = 0; index < await moving.count(); index += 1) {
    const timing = await moving.nth(index).evaluate((element) => {
      const styles = getComputedStyle(element);
      return { animation: styles.animationDuration, transition: styles.transitionDuration };
    });
    for (const value of `${timing.animation}, ${timing.transition}`.split(",")) {
      const duration = value.trim();
      const milliseconds = duration.endsWith("ms")
        ? Number.parseFloat(duration)
        : Number.parseFloat(duration) * 1000;
      expect(milliseconds, `motion remains active: ${JSON.stringify(timing)}`).toBeLessThanOrEqual(0.01);
    }
  }
});

for (const viewport of [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 1000 },
]) {
  test(`platform panels reflow without overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(platform(page)).toBeVisible();
    await expectOneExpanded(page, "Hyper Tern");
    for (const product of products) {
      await expect(trigger(page, product.name)).toBeVisible();
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("platform panels preserve 200 percent text reflow and qualified claims", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });

  for (const product of products) {
    await expect(trigger(page, product.name)).toBeVisible();
    await trigger(page, product.name).click();
    const controlledId = await trigger(page, product.name).getAttribute("aria-controls");
    await expect(platform(page).locator(`#${controlledId}`).getByText(product.summary, { exact: true })).toBeVisible();
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(platform(page)).not.toContainText(
    /100% secure|privacy guaranteed|solves every OWASP|confidential computing|model output is true/i,
  );
});

test("panel selection does not introduce unexpected cumulative layout shift", async ({ page }) => {
  await page.addInitScript(() => {
    (window as Window & { __platformCls?: number }).__platformCls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!entry.hadRecentInput) {
          (window as Window & { __platformCls?: number }).__platformCls! += entry.value;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await trigger(page, "Hyper-ABS").hover();
  await page.evaluate(() => new Promise<void>((done) => requestAnimationFrame(() => requestAnimationFrame(() => done()))));
  const cls = await page.evaluate(
    () => (window as Window & { __platformCls?: number }).__platformCls ?? 0,
  );
  expect(cls).toBeLessThanOrEqual(0.1);
});
