import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const controls = [
  {
    name: "Protect data",
    mode: "protect",
    explanation: "reduce sensitive-data exposure before inference.",
    outcome: "Protected context",
  },
  {
    name: "Control actions",
    mode: "control",
    explanation: "check identity, permissions, tools, and actions against policy.",
    outcome: "Controlled action",
  },
  {
    name: "Preserve evidence",
    mode: "evidence",
    explanation: "preserve attributable, tamper-evident execution records.",
    outcome: "Execution evidence",
  },
] as const;

const viewports = [
  { label: "small short mobile", width: 320, height: 568 },
  { label: "standard mobile", width: 390, height: 844 },
  { label: "landscape phone", width: 844, height: 390 },
  { label: "portrait tablet", width: 768, height: 1024 },
  { label: "landscape tablet", width: 1024, height: 768 },
  { label: "laptop", width: 1366, height: 768 },
  { label: "desktop", width: 1440, height: 900 },
  { label: "large desktop", width: 1920, height: 1080 },
] as const;

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolveFrame) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolveFrame())),
    );
  });
}

async function expectSingleSelection(page: Page, selectedMode: (typeof controls)[number]["mode"]) {
  const sphere = page.locator("[data-hero-execution-sphere]");
  await expect(sphere.locator('button[aria-pressed="true"]')).toHaveCount(1);
  await expect(sphere.locator(`[data-hero-control="${selectedMode}"]`)).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(sphere.locator(`[data-hero-outcome="${selectedMode}"]`)).toHaveAttribute(
    "data-active",
    "true",
  );
  await expect(sphere.locator(`[data-hero-flow="${selectedMode}"]`)).toHaveAttribute(
    "data-active",
    "true",
  );
}

async function motionSnapshot(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const styles = getComputedStyle(element);
      return `${styles.transform}|${styles.opacity}|${styles.strokeDashoffset}|${styles.offsetDistance}`;
    }),
  );
}

async function scriptsRequestedBy(page: Page, route: string) {
  const scripts = new Set<string>();
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.add(new URL(request.url()).pathname);
  });
  await page.goto(route, { waitUntil: "networkidle" });
  return scripts;
}

test.describe("spinning Buckleson execution sphere", () => {
  test("renders the complete, qualified execution story in the first frame", async ({ page }) => {
    await page.goto("/");
    const sphere = page.locator("[data-hero-execution-sphere]");
    await expect(sphere).toBeVisible();
    await expect(sphere.locator('svg[aria-hidden="true"]')).toHaveCount(1);

    for (const input of ["Data", "Identity", "Tools", "Actions"]) {
      await expect(sphere.getByText(input, { exact: true })).toHaveCount(1);
    }
    await expect(sphere.getByText("Buckleson", { exact: true })).toBeVisible();

    for (const control of controls) {
      await expect(sphere.getByRole("button", { name: control.name, exact: true })).toHaveCount(1);
      await expect(sphere.getByText(control.outcome, { exact: true })).toHaveCount(1);
      await expect(sphere.getByText(control.explanation, { exact: true })).toHaveCount(1);
    }

    await expect(sphere.locator("[data-request-path]")).not.toHaveCount(0);
    await expect(sphere.locator("[data-request-particle]")).not.toHaveCount(0);
    expect(await sphere.locator("[data-sphere-ring]").count()).toBeGreaterThanOrEqual(2);
    await expect(sphere.locator("[data-sphere-aperture]")).toHaveCount(1);
    await expect(sphere.locator("[data-sphere-logo]")).toHaveCount(1);

    for (const obsolete of [
      "Execution boundary",
      "Models",
      "Protection · Policy · Evidence",
      "Controlled execution",
    ]) {
      await expect(sphere.getByText(obsolete, { exact: true })).toHaveCount(0);
    }
  });

  test("starts on Protect data and persists pointer, focus, and click selections", async ({ page }) => {
    await page.goto("/");
    const sphere = page.locator("[data-hero-execution-sphere]");
    await expectSingleSelection(page, "protect");

    const control = sphere.locator('[data-hero-control="control"]');
    await control.hover();
    await expectSingleSelection(page, "control");
    await page.locator(".hero-copy").hover();
    await expectSingleSelection(page, "control");

    const evidence = sphere.locator('[data-hero-control="evidence"]');
    await evidence.focus();
    await expect(evidence).toBeFocused();
    await expectSingleSelection(page, "evidence");
    await evidence.press("Enter");
    await expectSingleSelection(page, "evidence");
    await evidence.press("Space");
    await expectSingleSelection(page, "evidence");

    await control.click();
    await expectSingleSelection(page, "control");
    await control.click();
    await expectSingleSelection(page, "control");
  });

  test.describe("mobile touch input", () => {
    test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

    test("provides touch-sized outcome controls on mobile", async ({ page }) => {
      await page.goto("/");
      const sphere = page.locator("[data-hero-execution-sphere]");
      for (const control of controls) {
        const button = sphere.getByRole("button", { name: control.name, exact: true });
        await button.tap();
        await expectSingleSelection(page, control.mode);
        const bounds = await button.boundingBox();
        expect(bounds, `${control.name} needs a rendered touch target`).not.toBeNull();
        expect(bounds!.width).toBeGreaterThanOrEqual(44);
        expect(bounds!.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test("rotates multiple rings while the official logo remains fixed", async ({ page }) => {
    await page.goto("/");
    const sphere = page.locator("[data-hero-execution-sphere]");
    const rings = sphere.locator("[data-sphere-ring]");
    const animated = sphere.locator("[data-sphere-ring], [data-request-particle], [data-request-path]");
    const logo = sphere.locator("[data-sphere-logo]");
    expect(await rings.count()).toBeGreaterThanOrEqual(2);
    await expect(logo).toBeVisible();

    const logoStart = await logo.boundingBox();
    expect(logoStart).not.toBeNull();
    const ringSamples = new Set<string>();
    const motionSamples = new Set<string>();
    for (let frame = 0; frame < 6; frame += 1) {
      ringSamples.add((await motionSnapshot(rings)).join("||"));
      motionSamples.add((await motionSnapshot(animated)).join("||"));
      await page.waitForTimeout(140);
    }
    expect(ringSamples.size).toBeGreaterThan(2);
    expect(motionSamples.size).toBeGreaterThan(2);

    const logoEnd = await logo.boundingBox();
    expect(logoEnd).not.toBeNull();
    expect(Math.abs(logoEnd!.x + logoEnd!.width / 2 - (logoStart!.x + logoStart!.width / 2))).toBeLessThanOrEqual(0.5);
    expect(Math.abs(logoEnd!.y + logoEnd!.height / 2 - (logoStart!.y + logoStart!.height / 2))).toBeLessThanOrEqual(0.5);
  });

  test("reduced motion freezes decoration but keeps every selection immediate", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const sphere = page.locator("[data-hero-execution-sphere]");
    const targets = sphere.locator(
      "[data-sphere-ring], [data-request-particle], [data-request-path], [data-sphere-aperture]",
    );
    const before = await motionSnapshot(targets);
    await page.waitForTimeout(700);
    expect(await motionSnapshot(targets)).toEqual(before);

    await sphere.locator('[data-hero-control="evidence"]').click();
    await expectSingleSelection(page, "evidence");
    await expect(sphere.locator('svg[aria-hidden="true"]')).toBeVisible();
  });

  test("survives a blocked display logo without losing its meaning or geometry", async ({ page }) => {
    await page.route(/\/brand\/buckleson-logo-display\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i, (route) =>
      route.abort(),
    );
    await page.goto("/");
    const sphere = page.locator("[data-hero-execution-sphere]");
    await expect(sphere.getByText("Buckleson", { exact: true })).toBeVisible();
    await expectSingleSelection(page, "protect");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("uses no remote runtime request and keeps the hero runtime off supporting routes", async ({ browser }) => {
    const homepageContext = await browser.newContext();
    const homepagePage = await homepageContext.newPage();
    const externalRequests: string[] = [];
    homepagePage.on("request", (request) => {
      const hostname = new URL(request.url()).hostname;
      if (!["127.0.0.1", "localhost"].includes(hostname)) externalRequests.push(request.url());
    });
    const homepageScripts = await scriptsRequestedBy(homepagePage, "/");
    await expect(homepagePage.locator("[data-hero-execution-sphere]")).toBeVisible();
    await homepageContext.close();
    expect(externalRequests).toEqual([]);

    for (const route of ["/about/", "/products/", "/services/", "/blog/", "/blog/prompt-injection-prevention/"]) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const scripts = await scriptsRequestedBy(page, route);
      const homeOnlyScripts = [...homepageScripts].filter((script) => !scripts.has(script));
      expect(homeOnlyScripts, `${route} must not preload every homepage script`).not.toEqual([]);
      await expect(page.locator("[data-hero-execution-sphere]")).toHaveCount(0);
      await context.close();
    }
  });

  test("preserves qualified claims and passes the focused accessibility boundary", async ({ page }) => {
    await page.goto("/");
    const sphere = page.locator("[data-hero-execution-sphere]");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(sphere.getByRole("button")).toHaveCount(3);
    const names = await sphere.getByRole("button").allTextContents();
    expect(new Set(names.map((name) => name.trim())).size).toBe(3);

    const prohibited = [
      /100% secure/i,
      /privacy guaranteed/i,
      /guaranteed safety/i,
      /guaranteed correctness/i,
      /confidential computing/i,
      /solves every (?:OWASP )?risk/i,
      /universally approved/i,
    ];
    const text = (await sphere.textContent()) ?? "";
    for (const claim of prohibited) expect(text).not.toMatch(claim);

    const results = await new AxeBuilder({ page: page as never }).include("[data-hero-execution-sphere]").analyze();
    const severe = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });
});

test.describe("execution sphere without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps the complete finished flow and hero recovery path readable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const sphere = page.locator("[data-hero-execution-sphere]");
    await expect(sphere).toBeVisible();
    for (const label of [
      "Data",
      "Identity",
      "Tools",
      "Actions",
      "Protected context",
      "Controlled action",
      "Execution evidence",
      "Buckleson",
    ]) {
      await expect(sphere.getByText(label, { exact: true })).toHaveCount(1);
    }
    for (const control of controls) {
      await expect(sphere.getByText(control.name, { exact: true })).toHaveCount(1);
      await expect(sphere.getByText(control.explanation, { exact: true })).toHaveCount(1);
    }
    await expect(page.locator("h1")).toHaveText("We help you use AI safely.");
    await expect(page.getByRole("link", { name: "Book a Security Assessment", exact: true }).first()).toBeVisible();
  });
});

for (const viewport of viewports) {
  test(`execution sphere fits ${viewport.label} ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await settle(page);
    const hero = page.locator(".hero-section");
    const sphere = page.locator("[data-hero-execution-sphere]");
    await expect(sphere).toBeVisible();
    const geometry = await hero.evaluate((section) => {
      const sectionBounds = section.getBoundingClientRect();
      const sphere = section.querySelector<HTMLElement>("[data-hero-execution-sphere]");
      if (!sphere) throw new Error("Execution sphere is missing");
      const sphereBounds = sphere.getBoundingClientRect();
      const styles = getComputedStyle(section);
      return {
        sphereInside:
          sphereBounds.left >= sectionBounds.left - 2 &&
          sphereBounds.right <= sectionBounds.right + 2 &&
          sphereBounds.top >= sectionBounds.top - 2 &&
          sphereBounds.bottom <= sectionBounds.bottom + 2,
        overflowY: styles.overflowY,
        scrollHeight: section.scrollHeight,
        clientHeight: section.clientHeight,
        horizontalOverflow:
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(geometry.sphereInside).toBeTruthy();
    expect(["auto", "visible"]).toContain(geometry.overflowY);
    expect(geometry.scrollHeight).toBeLessThanOrEqual(geometry.clientHeight + 2);
    expect(geometry.horizontalOverflow).toBeLessThanOrEqual(1);
  });
}

test("execution sphere supports 200 percent text without clipping", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("/");
  await page.locator("html").evaluate((element) => {
    element.style.fontSize = "200%";
  });
  await settle(page);
  const sphere = page.locator("[data-hero-execution-sphere]");
  await expect(sphere).toBeVisible();
  for (const control of controls) {
    await expect(sphere.getByRole("button", { name: control.name, exact: true })).toBeVisible();
  }
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
