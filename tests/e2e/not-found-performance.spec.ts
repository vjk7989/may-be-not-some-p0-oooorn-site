import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { statSync } from "node:fs";
import { resolve } from "node:path";

const missingRoutes = ["/__buckleson-missing__/", "/nested/__buckleson-missing__/"] as const;

const viewports = [
  { label: "small short mobile", width: 320, height: 568 },
  { label: "standard mobile", width: 390, height: 844 },
  { label: "landscape phone", width: 844, height: 390 },
  { label: "portrait tablet", width: 768, height: 1024 },
  { label: "landscape tablet", width: 1024, height: 768 },
  { label: "common laptop", width: 1366, height: 768 },
  { label: "desktop", width: 1440, height: 900 },
  { label: "large desktop", width: 1920, height: 1080 },
] as const;

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

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame())),
    );
  });
}

async function expectNoHorizontalOverflow(page: Page, context: string) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `${context}: horizontal overflow`).toBeLessThanOrEqual(1);
}

async function expect404Content(page: Page) {
  await expect(page.locator("main.not-found-page")).toBeVisible();
  await expect(page.locator("h1")).toHaveText("This path left the boundary.");
  await expect(page.getByText("ERROR / 404", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "The page may have moved, or the address may be wrong. Return home to continue exploring Buckleson.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Return to homepage", exact: true })).toBeVisible();
}

async function scriptsRequestedBy(page: Page, route: string) {
  const scripts = new Set<string>();
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.add(new URL(request.url()).pathname);
  });
  await page.goto(route, { waitUntil: "networkidle" });
  return scripts;
}

test.describe("custom 404 route", () => {
  for (const route of missingRoutes) {
    test(`${route} returns the custom document with HTTP 404`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(404);
      await expect404Content(page);
      await expect(page).toHaveTitle(/Page not found.*Buckleson/i);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
    });
  }

  test("uses immersive chrome while preserving the normal homepage shell", async ({ page }) => {
    await page.goto(missingRoutes[0]);
    await expect404Content(page);
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator(".skip-link")).toBeHidden();
    await expect(page.locator(".site-footer")).toBeHidden();
    await expect(page.getByRole("navigation", { name: "Social links" })).toHaveCount(0);

    await page.goto("/");
    await expect(page.locator(".site-header")).toBeVisible();
    await expect(page.locator(".skip-link")).toHaveCount(1);
    await expect(page.locator(".site-footer")).toBeVisible();
  });

  test("recovery CTA is a visible keyboard target and reaches home", async ({ page }) => {
    await page.goto(missingRoutes[0]);
    const cta = page.getByRole("link", { name: "Return to homepage", exact: true });
    await expect(cta).toHaveAttribute("href", /\/$/);
    await cta.focus();
    await expect(cta).toBeFocused();
    const focus = await cta.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: Number.parseFloat(styles.outlineWidth),
        shadow: styles.boxShadow,
      };
    });
    expect(
      (focus.outlineStyle !== "none" && focus.outlineWidth >= 2) || focus.shadow !== "none",
    ).toBeTruthy();
    await cta.press("Enter");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("h1")).toHaveText("We help you use AI safely.");
  });

  test("static SVG is complete and decorative", async ({ page }) => {
    await page.goto(missingRoutes[0]);
    const visual = page.locator("svg[data-not-found-visual]");
    await expect(visual).toBeVisible();
    await expect(visual).toHaveAttribute("aria-hidden", "true");
    await expect(visual.locator("[data-request-token]")).not.toHaveCount(0);
    await expect(visual.locator("[data-checkpoint]")).toHaveCount(3);
    await expect(visual.locator("[data-broken-route]")).toHaveCount(1);
    await expect(visual.locator("[data-resolve-route]")).toHaveCount(1);
    await expect(visual).toContainText("404");
  });

  test("normal motion enhances a fixed DOM without external requests", async ({ page }) => {
    const externalRequests: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (!["127.0.0.1", "localhost"].includes(url.hostname)) externalRequests.push(request.url());
    });
    await page.goto(missingRoutes[0], { waitUntil: "networkidle" });
    const tokens = page.locator("[data-request-token]");
    const count = await tokens.count();
    expect(count).toBeGreaterThan(0);
    const samples = new Set<string>();
    for (let index = 0; index < 6; index += 1) {
      samples.add(
        await tokens.first().evaluate((element) => {
          const styles = getComputedStyle(element);
          return `${styles.transform}|${styles.opacity}|${styles.offsetDistance}`;
        }),
      );
      await page.waitForTimeout(120);
    }
    expect(samples.size).toBeGreaterThan(1);
    await expect(tokens).toHaveCount(count);
    expect(externalRequests).toEqual([]);
  });

  test("reduced motion keeps a complete static state", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(missingRoutes[0]);
    await expect404Content(page);
    const targets = page.locator("[data-request-token], [data-checkpoint], [data-broken-route], [data-resolve-route]");
    const first = await targets.evaluateAll((elements) =>
      elements.map((element) => {
        const styles = getComputedStyle(element);
        return `${styles.transform}|${styles.opacity}|${styles.offsetDistance}`;
      }),
    );
    await page.waitForTimeout(700);
    const second = await targets.evaluateAll((elements) =>
      elements.map((element) => {
        const styles = getComputedStyle(element);
        return `${styles.transform}|${styles.opacity}|${styles.offsetDistance}`;
      }),
    );
    expect(second).toEqual(first);
    await expect(page.locator("svg[data-not-found-visual]")).toBeVisible();
  });

  test("404 animation JavaScript is isolated from the homepage", async ({ browser }) => {
    const homepageContext = await browser.newContext();
    const homepagePage = await homepageContext.newPage();
    const homepageScripts = await scriptsRequestedBy(homepagePage, "/");
    await homepageContext.close();

    const missingContext = await browser.newContext();
    const missingPage = await missingContext.newPage();
    const missingScripts = await scriptsRequestedBy(missingPage, missingRoutes[0]);
    await missingContext.close();

    const unique404Scripts = [...missingScripts].filter((script) => !homepageScripts.has(script));
    expect(unique404Scripts, "404 must own at least one route-local script chunk").not.toEqual([]);
    for (const script of unique404Scripts) expect(homepageScripts.has(script)).toBeFalsy();
  });

  test("passes the focused accessibility boundary", async ({ page }) => {
    await page.goto(missingRoutes[0]);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const severe = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });

  test("remains complete when decorative image requests fail", async ({ page }) => {
    await page.route(/\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i, (route) => route.abort());
    await page.goto(missingRoutes[0]);
    await expect404Content(page);
    await expect(page.locator("svg[data-not-found-visual]")).toBeVisible();
    await expectNoHorizontalOverflow(page, "blocked images");
  });
});

test.describe("custom 404 without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the finished illustration, copy, and recovery route", async ({ page }) => {
    const response = await page.goto(missingRoutes[0], { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect404Content(page);
    const visual = page.locator("svg[data-not-found-visual]");
    await expect(visual).toBeVisible();
    await expect(visual.locator("[data-request-token]")).not.toHaveCount(0);
    await expect(visual.locator("[data-checkpoint]")).toHaveCount(3);
    await expect(visual.locator("[data-resolve-route]")).toHaveCount(1);
  });
});

for (const viewport of viewports) {
  test(`404 fits ${viewport.label} ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(missingRoutes[0]);
    await settle(page);
    await expect404Content(page);
    await expectNoHorizontalOverflow(page, viewport.label);

    const geometry = await page.locator("main.not-found-page").evaluate((main) => {
      const mainBounds = main.getBoundingClientRect();
      const styles = getComputedStyle(main);
      const escaped = Array.from(main.querySelectorAll<HTMLElement>("h1, p, a, svg"))
        .filter((element) => {
          const child = element.getBoundingClientRect();
          const childStyles = getComputedStyle(element);
          return (
            childStyles.display !== "none" &&
            childStyles.visibility !== "hidden" &&
            (child.left < mainBounds.left - 2 ||
              child.right > mainBounds.right + 2 ||
              child.top < mainBounds.top - 2 ||
              child.bottom > mainBounds.bottom + 2)
          );
        })
        .map((element) => element.tagName.toLowerCase());
      return {
        escaped,
        overflowY: styles.overflowY,
        scrollHeight: main.scrollHeight,
        clientHeight: main.clientHeight,
      };
    });
    expect(geometry.escaped).toEqual([]);
    expect(["auto", "visible"]).toContain(geometry.overflowY);
    expect(geometry.scrollHeight).toBeLessThanOrEqual(geometry.clientHeight + 2);
  });
}

test("404 supports a 200 percent text-scale equivalent", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto(missingRoutes[0]);
  await page.locator("html").evaluate((element) => {
    element.style.fontSize = "200%";
  });
  await settle(page);
  await expect404Content(page);
  await expectNoHorizontalOverflow(page, "200 percent text");
  await expect(page.getByRole("link", { name: "Return to homepage" })).toBeVisible();
});

test.describe("bounded homepage performance regressions", () => {
  test("hero stays eager while every non-hero scene defers rendering", async ({ page }) => {
    await page.goto("/");
    const sections = page.locator("main#main-content > [data-viewport-section]");
    await expect(sections).toHaveCount(sectionClasses.length);
    for (const [index, expectedClass] of sectionClasses.entries()) {
      const section = sections.nth(index);
      await expect(section).toHaveClass(new RegExp(`\\b${expectedClass}\\b`));
      const containment = await section.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          contentVisibility: styles.contentVisibility,
          intrinsicSize: styles.getPropertyValue("contain-intrinsic-size"),
        };
      });
      if (index === 0) {
        expect(containment.contentVisibility).toBe("visible");
      } else {
        expect(containment.contentVisibility, expectedClass).toBe("auto");
        expect(containment.intrinsicSize, expectedClass).not.toMatch(/^(?:none|auto)?$/);
      }
    }
  });

  test("deferred scenes remain semantic static HTML without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    const sections = page.locator("main#main-content > [data-viewport-section]");
    await expect(sections).toHaveCount(sectionClasses.length);
    await expect(page.locator("#platform")).toHaveCount(1);
    for (const section of await sections.all()) {
      expect((await section.textContent())?.trim().length).toBeGreaterThan(0);
    }
    await context.close();
  });

  test("critical and deferred images use reserved optimized local assets", async ({ page }) => {
    await page.goto("/");
    const brandImages = [page.locator(".brand-logo-image").first(), page.locator(".boundary-logo")];
    const hyperImage = page.locator(".hyper-mark");

    for (const image of brandImages) {
      await expect(image).toBeVisible();
      const data = await image.evaluate((element) => {
        const image = element as HTMLImageElement;
        return {
          src: image.currentSrc || image.src,
          width: image.getAttribute("width"),
          height: image.getAttribute("height"),
          loading: image.getAttribute("loading"),
          decoding: image.decoding,
        };
      });
      expect(new URL(data.src).hostname).toMatch(/^(?:127\.0\.0\.1|localhost)$/);
      expect(new URL(data.src).pathname).not.toMatch(/\/brand\/buckleson-logo\.jpg$/);
      expect(data.width).toMatch(/^\d+$/);
      expect(data.height).toMatch(/^\d+$/);
      expect(data.loading).not.toBe("lazy");
      expect(data.decoding).toBe("async");
      const brandPath = new URL(data.src).pathname.slice(new URL(data.src).pathname.indexOf("/brand/") + 1);
      expect(statSync(resolve(process.cwd(), "public", brandPath)).size).toBeLessThan(
        statSync(resolve(process.cwd(), "public", "brand/buckleson-logo.jpg")).size,
      );
    }

    const hyperData = await hyperImage.evaluate((element) => {
      const image = element as HTMLImageElement;
      return {
        src: image.currentSrc || image.src,
        width: image.getAttribute("width"),
        height: image.getAttribute("height"),
        loading: image.getAttribute("loading"),
        decoding: image.decoding,
      };
    });
    expect(new URL(hyperData.src).hostname).toMatch(/^(?:127\.0\.0\.1|localhost)$/);
    expect(new URL(hyperData.src).pathname).not.toMatch(/\/brand\/hyper-0x-logo\.png$/);
    expect(hyperData.width).toMatch(/^\d+$/);
    expect(hyperData.height).toMatch(/^\d+$/);
    expect(hyperData.loading).toBe("lazy");
    expect(hyperData.decoding).toBe("async");
    const hyperPath = new URL(hyperData.src).pathname.slice(new URL(hyperData.src).pathname.indexOf("/brand/") + 1);
    expect(statSync(resolve(process.cwd(), "public", hyperPath)).size).toBeLessThan(
      statSync(resolve(process.cwd(), "public", "brand/hyper-0x-logo.png")).size,
    );
  });

  test("Products uses the optimized Hyper-0x derivative below its page hero", async ({ page }) => {
    await page.goto("/products/");
    const productLogo = page.locator(".product-logo");
    await expect(productLogo).toBeVisible();
    const data = await productLogo.evaluate((element) => {
      const image = element as HTMLImageElement;
      return {
        src: image.currentSrc || image.src,
        width: image.getAttribute("width"),
        height: image.getAttribute("height"),
        loading: image.getAttribute("loading"),
        decoding: image.decoding,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      };
    });
    const source = new URL(data.src);
    expect(source.hostname).toMatch(/^(?:127\.0\.0\.1|localhost)$/);
    expect(source.pathname).not.toMatch(/\/brand\/hyper-0x-logo\.png$/);
    expect(data.width).toMatch(/^\d+$/);
    expect(data.height).toMatch(/^\d+$/);
    expect(data.loading).toBe("lazy");
    expect(data.decoding).toBe("async");
    expect(data.naturalWidth).toBeGreaterThan(0);
    expect(data.naturalHeight).toBeGreaterThan(0);
    expect(Math.abs(data.naturalWidth / data.naturalHeight - 1)).toBeLessThanOrEqual(0.01);
    const publicPath = source.pathname.slice(source.pathname.indexOf("/brand/") + 1);
    expect(statSync(resolve(process.cwd(), "public", publicPath)).size).toBeLessThan(
      statSync(resolve(process.cwd(), "public", "brand/hyper-0x-logo.png")).size,
    );
  });
});
