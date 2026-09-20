import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const projectSlugs = [
  "cigna-smart-health-systems",
  "aetna-health-data-ecosystem",
  "anthem-neural-care-network",
  "cvs-smart-supply-chain-hub",
  "united-ai-security-protocol",
];

const articleSlugs = [
  "the-sovereign-cloud-why-on-premise-ai-is-the-future-of-data-privacy",
  "the-architecture-of-autonomy-scaling-ai-within-legacy-frameworks",
  "human-centric-automation-designing-ai-that-empowers-your-workforce",
];

const routes = [
  "/",
  "/digital-brain/",
  "/project/",
  ...projectSlugs.map((slug) => `/project/${slug}/`),
  "/about/",
  "/articles/",
  ...articleSlugs.map((slug) => `/articles/${slug}/`),
  "/contact/",
  "/policies/terms-conditions/",
  "/policies/privacy-policy/",
];

test("all public routes render one semantic main and heading", async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("body"), route).not.toContainText(/Buckleson|Hyper-0x|Hyper Tern|Hyper-ABS/);
  }
});

test("project and article indexes link to every deterministic detail", async ({ page }) => {
  await page.goto("/project/");
  for (const slug of projectSlugs) await expect(page.locator(`a[href="/project/${slug}/"]`).first()).toBeVisible();
  await page.goto("/articles/");
  for (const slug of articleSlugs) await expect(page.locator(`a[href="/articles/${slug}/"]`).first()).toBeVisible();
});

test("mobile sheet is keyboard-operable and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("FAQ uses native disclosures", async ({ page }) => {
  await page.goto("/");
  const disclosure = page.locator(".faq-list details").nth(1);
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
});

test("removed legacy paths and unknown nested paths use the custom 404", async ({ page }) => {
  for (const route of ["/products/", "/services/", "/blog/", "/missing/nested/path/"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("outside the system");
    const robotDirectives = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content") ?? ""));
    expect(robotDirectives.some((content) => /\bnoindex\b/.test(content))).toBe(true);
  }
});

test("site remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("a.hero-build")).toBeVisible();
  await expect(page.locator("a.hero-build")).toHaveAttribute("href", /contact\/$/);
  await expect(page.locator(".faq-list details").first()).toHaveAttribute("open", "");
  await context.close();
});

test("reduced motion bypasses Anime.js inline transforms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(250);
  await expect(page.locator("[data-motion-section]").first()).not.toHaveAttribute("style", /transform|opacity/);
});

test("responsive boundaries have no horizontal overflow", async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 },
    { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1366, height: 768 },
    { width: 1440, height: 900 }, { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(1);
  }
});

test("usable semantic shell has no serious or critical Axe violations", async ({ page }) => {
  for (const route of ["/", "/digital-brain/", "/project/", "/articles/", "/contact/"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? "")), route).toEqual([]);
  }
});

test("production pages request only local assets", async ({ page }) => {
  const remote: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) remote.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  expect(remote).toEqual([]);
});
