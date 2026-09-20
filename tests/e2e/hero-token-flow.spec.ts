import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const tokens = [
  {
    id: "prompt-injection",
    label: "Prompt injection",
    initialStatus: "attack",
  },
  {
    id: "user-request",
    label: "User request",
    initialStatus: "approved",
  },
  {
    id: "deceptive-input",
    label: "Deceptive input",
    initialStatus: "inspection",
  },
] as const;

const outcomes = [
  { control: "Protect data", id: "protect", outcome: "Protected context" },
  { control: "Control actions", id: "control", outcome: "Controlled action" },
  { control: "Preserve evidence", id: "evidence", outcome: "Execution evidence" },
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
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
  });
}

async function waitForStatus(token: Locator, status: string, timeout = 8_000) {
  await expect
    .poll(() => token.getAttribute("data-token-status"), {
      message: `Expected ${await token.getAttribute("data-request-token")} to reach ${status}`,
      timeout,
      intervals: [60, 90, 120],
    })
    .toBe(status);
}

async function tokenColor(token: Locator) {
  return token.evaluate((element) => {
    const styles = getComputedStyle(element);
    return [styles.color, styles.fill, styles.stroke, styles.backgroundColor].join(" ");
  });
}

function rgbChannels(value: string) {
  const match = value.match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/i);
  return match ? match.slice(1, 4).map(Number) : null;
}

function containsRed(value: string) {
  return value
    .split(/(?=rgba?\()/i)
    .map(rgbChannels)
    .some((channels) =>
      channels ? channels[0] >= 150 && channels[0] > channels[1] * 1.35 && channels[0] > channels[2] * 1.15 : false,
    );
}

function containsViolet(value: string) {
  return value
    .split(/(?=rgba?\()/i)
    .map(rgbChannels)
    .some((channels) =>
      channels ? channels[2] >= 120 && channels[2] > channels[1] * 1.35 : false,
    );
}

async function distanceFromTokenToPath(token: Locator, path: Locator) {
  return path.evaluate((pathElement, tokenElement) => {
    const path = pathElement as SVGPathElement;
    const token = tokenElement as Element;
    const tokenBounds = token.getBoundingClientRect();
    const tokenCenter = {
      x: tokenBounds.left + tokenBounds.width / 2,
      y: tokenBounds.top + tokenBounds.height / 2,
    };
    const matrix = path.getScreenCTM();
    if (!matrix) throw new Error("Token path has no screen transform matrix");

    const length = path.getTotalLength();
    let nearest = Number.POSITIVE_INFINITY;
    const samples = Math.max(80, Math.ceil(length / 2));
    for (let index = 0; index <= samples; index += 1) {
      const point = path.getPointAtLength((length * index) / samples);
      const screenPoint = new DOMPoint(point.x, point.y).matrixTransform(matrix);
      nearest = Math.min(nearest, Math.hypot(screenPoint.x - tokenCenter.x, screenPoint.y - tokenCenter.y));
    }
    return nearest;
  }, await token.elementHandle());
}

async function scriptPaths(page: Page, route: string) {
  const paths = new Set<string>();
  page.on("request", (request) => {
    if (request.resourceType() === "script") paths.add(new URL(request.url()).pathname);
  });
  await page.goto(route, { waitUntil: "networkidle" });
  return paths;
}

test.describe("labeled Buckleson request flow", () => {
  test("renders the exact deterministic token set and qualified static story", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    await expect(hero).toBeVisible();

    for (const expected of tokens) {
      const token = hero.locator(`[data-request-token="${expected.id}"]`);
      await expect(token).toHaveCount(1);
      await expect(token).toContainText(expected.label);
      await expect(token).toHaveAttribute("data-token-status", expected.initialStatus);
      await expect(hero.locator(`[data-token-path="${expected.id}"]`)).toHaveCount(1);
    }

    const story = hero.locator("[data-token-flow-summary]");
    await expect(story).toBeVisible();
    await expect(story).toContainText(/known attack.+blocked/is);
    await expect(story).toContainText(/approved.+passed/is);
    await expect(story).toContainText(/deceptive input.+when detected.+blocked/is);
    await expect(hero).toContainText(/illustrative/i);
    await expect(hero).toContainText(/detected harmful requests can be (?:blocked|stopped)/i);

    const text = (await hero.textContent()) ?? "";
    for (const prohibited of [
      /detects? every/i,
      /destroys? every/i,
      /eliminates? every/i,
      /guaranteed (?:safe|safety|private|privacy|correct|correctness)/i,
      /100% secure/i,
      /solves? every (?:OWASP )?risk/i,
      /universal(?:ly)? (?:detection|coverage|approval)/i,
    ]) {
      expect(text).not.toMatch(prohibited);
    }
  });

  test("uses persistent non-color status cues and distinct risk/request colors", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    const attack = hero.locator('[data-request-token="prompt-injection"]');
    const approved = hero.locator('[data-request-token="user-request"]');
    const deceptive = hero.locator('[data-request-token="deceptive-input"]');

    await expect(attack).toContainText(/attack/i);
    await expect(approved).toContainText(/approved/i);
    await expect(deceptive).toContainText(/inspect|checking/i);
    expect(containsRed(await tokenColor(attack))).toBeTruthy();
    expect(containsViolet(await tokenColor(approved))).toBeTruthy();
    expect(containsRed(await tokenColor(deceptive))).toBeFalsy();

    await waitForStatus(deceptive, "detected");
    await expect(deceptive).toContainText(/detected/i);
    expect(containsRed(await tokenColor(deceptive))).toBeTruthy();
  });

  test("blocks known attacks and conditionally detected deceptive input before the aperture", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    const aperture = hero.locator("[data-sphere-aperture]");
    await expect(aperture).toBeVisible();

    for (const id of ["prompt-injection", "deceptive-input"] as const) {
      const token = hero.locator(`[data-request-token="${id}"]`);
      await waitForStatus(token, "blocked");
      await expect(token).toContainText(/blocked/i);
      const [tokenBounds, apertureBounds] = await Promise.all([token.boundingBox(), aperture.boundingBox()]);
      expect(tokenBounds).not.toBeNull();
      expect(apertureBounds).not.toBeNull();
      expect(tokenBounds!.x + tokenBounds!.width / 2).toBeLessThanOrEqual(
        apertureBounds!.x + apertureBounds!.width / 2,
      );
      await expect(hero.locator(`[data-token-fragment][data-token-owner="${id}"]`)).not.toHaveCount(0);
    }

    for (const outcome of outcomes) {
      await expect(
        hero.locator(`[data-hero-outcome="${outcome.id}"] [data-token-copy="prompt-injection"]`),
      ).toHaveCount(0);
      await expect(
        hero.locator(`[data-hero-outcome="${outcome.id}"] [data-token-copy="deceptive-input"]`),
      ).toHaveCount(0);
    }
  });

  test("passes only the approved request to the currently selected outcome", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    const approved = hero.locator('[data-request-token="user-request"]');

    for (const destination of outcomes) {
      await hero.locator(`[data-hero-control="${destination.id}"]`).click();
      await expect(hero.locator('button[aria-pressed="true"]')).toHaveCount(1);
      await expect(hero.locator(`[data-hero-control="${destination.id}"]`)).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await waitForStatus(approved, "passed");
      await expect(approved).toContainText(/passed/i);
      await expect(hero.locator(`[data-hero-outcome="${destination.id}"]`)).toHaveAttribute(
        "data-active",
        "true",
      );
      await expect(hero.locator(`[data-hero-flow="${destination.id}"]`)).toHaveAttribute(
        "data-active",
        "true",
      );
    }
  });

  test("keeps every moving label on its assigned polished SVG lane", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    const hero = page.locator("[data-hero-execution-sphere]");

    for (const expected of tokens) {
      const token = hero.locator(`[data-request-token="${expected.id}"]`);
      const path = hero.locator(`path[data-token-path="${expected.id}"]`);
      await expect(path).toHaveCount(1);
      await expect(path).toHaveCSS("stroke-linecap", "round");
      await expect(path).toHaveCSS("stroke-linejoin", "round");
      expect(await path.evaluate((node) => (node as SVGPathElement).getTotalLength())).toBeGreaterThan(80);

      for (let frame = 0; frame < 8; frame += 1) {
        const opacity = Number(await token.evaluate((node) => getComputedStyle(node).opacity));
        if (opacity >= 0.2) {
          expect(await distanceFromTokenToPath(token, path), `${expected.label} left its route`).toBeLessThanOrEqual(3);
        }
        await page.waitForTimeout(90);
      }
    }
  });

  test("animates the request decisions and sphere while keeping the logo fixed", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    const logo = hero.locator("[data-sphere-logo]");
    const moving = hero.locator("[data-sphere-ring], [data-request-token], [data-token-path]");
    const logoStart = await logo.boundingBox();
    expect(logoStart).not.toBeNull();

    const samples = new Set<string>();
    for (let frame = 0; frame < 8; frame += 1) {
      samples.add(
        await moving.evaluateAll((nodes) =>
          nodes
            .map((node) => {
              const styles = getComputedStyle(node);
              return `${styles.transform}|${styles.opacity}|${styles.strokeDashoffset}`;
            })
            .join("||"),
        ),
      );
      await page.waitForTimeout(110);
    }
    expect(samples.size).toBeGreaterThan(2);

    const logoEnd = await logo.boundingBox();
    expect(logoEnd).not.toBeNull();
    expect(Math.abs(logoEnd!.x + logoEnd!.width / 2 - (logoStart!.x + logoStart!.width / 2))).toBeLessThanOrEqual(0.5);
    expect(Math.abs(logoEnd!.y + logoEnd!.height / 2 - (logoStart!.y + logoStart!.height / 2))).toBeLessThanOrEqual(0.5);
    await expect(logo).toHaveCSS("transform", "none");
  });

  test("freezes the finished explanatory composition for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    const moving = hero.locator(
      "[data-sphere-ring], [data-request-token], [data-token-path], [data-token-fragment]",
    );
    const snapshot = () =>
      moving.evaluateAll((nodes) =>
        nodes.map((node) => {
          const styles = getComputedStyle(node);
          return `${node.getAttribute("data-token-status")}|${styles.transform}|${styles.opacity}|${styles.strokeDashoffset}`;
        }),
      );
    const before = await snapshot();
    await page.waitForTimeout(700);
    expect(await snapshot()).toEqual(before);

    for (const token of tokens) {
      await expect(hero.locator(`[data-request-token="${token.id}"]`)).toContainText(token.label);
    }
    await hero.locator('[data-hero-control="evidence"]').click();
    await expect(hero.locator('[data-hero-control="evidence"]')).toHaveAttribute("aria-pressed", "true");
  });

  test("keeps selection deterministic through rapid mixed input", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    const protect = hero.locator('[data-hero-control="protect"]');
    const control = hero.locator('[data-hero-control="control"]');
    const evidence = hero.locator('[data-hero-control="evidence"]');
    const initialTokenCount = await hero.locator("[data-request-token]").count();

    await protect.hover();
    await control.click();
    await evidence.focus();
    await evidence.press("Space");
    await expect(hero.locator('button[aria-pressed="true"]')).toHaveCount(1);
    await expect(evidence).toHaveAttribute("aria-pressed", "true");
    await expect(hero.locator('[data-hero-outcome="evidence"][data-active="true"]')).toHaveCount(1);
    await expect(hero.locator("[data-request-token]")).toHaveCount(initialTokenCount);
  });

  test("is homepage-only and introduces no remote runtime request", async ({ browser }) => {
    const homeContext = await browser.newContext();
    const home = await homeContext.newPage();
    const remoteRequests: string[] = [];
    home.on("request", (request) => {
      const hostname = new URL(request.url()).hostname;
      if (!['127.0.0.1', 'localhost'].includes(hostname)) remoteRequests.push(request.url());
    });
    const homeScripts = await scriptPaths(home, "/");
    await expect(home.locator("[data-request-token]")).toHaveCount(3);
    expect(remoteRequests).toEqual([]);
    await homeContext.close();

    for (const route of ["/about/", "/products/", "/services/", "/blog/", "/blog/prompt-injection-prevention/"]) {
      const context = await browser.newContext();
      const page = await context.newPage();
      const scripts = await scriptPaths(page, route);
      await expect(page.locator("[data-hero-execution-sphere], [data-request-token]")).toHaveCount(0);
      expect([...homeScripts].some((script) => !scripts.has(script)), `${route} needs a homepage-only chunk`).toBeTruthy();
      await context.close();
    }
  });

  test("retains controls, focus semantics, and focused Axe compliance", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-execution-sphere]");
    await expect(hero.locator('button[aria-pressed="true"]')).toHaveCount(1);
    await expect(hero.locator('[data-hero-control="protect"]')).toHaveAttribute("aria-pressed", "true");
    for (const destination of outcomes) {
      const button = hero.getByRole("button", { name: destination.control, exact: true });
      await button.focus();
      await expect(button).toBeFocused();
      const focusTreatment = await button.evaluate((element) => {
        const styles = getComputedStyle(element);
        return `${styles.outlineStyle}|${styles.outlineWidth}|${styles.boxShadow}`;
      });
      expect(focusTreatment).not.toBe("none|0px|none");
    }

    const results = await new AxeBuilder({ page: page as never })
      .include("[data-hero-execution-sphere]")
      .analyze();
    const severe = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });
});

test.describe("labeled request flow without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("keeps all fates, outcomes, controls, and recovery content readable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator("[data-hero-execution-sphere]");
    await expect(hero).toBeVisible();
    for (const token of tokens) await expect(hero).toContainText(token.label);
    await expect(hero).toContainText(/known attack.+blocked/is);
    await expect(hero).toContainText(/approved.+passed/is);
    await expect(hero).toContainText(/when detected.+blocked/is);
    for (const outcome of outcomes) {
      await expect(hero.getByText(outcome.control, { exact: true })).toHaveCount(1);
      await expect(hero.getByText(outcome.outcome, { exact: true })).toHaveCount(1);
    }
    await expect(page.locator("h1")).toHaveText("We help you use AI safely.");
    await expect(page.getByRole("link", { name: "Book a Security Assessment", exact: true }).first()).toBeVisible();
  });
});

for (const viewport of viewports) {
  test(`labeled token flow remains aligned at ${viewport.label} ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await settle(page);
    const hero = page.locator(".hero-section");
    const scene = page.locator("[data-hero-execution-sphere]");
    const result = await hero.evaluate((section) => {
      const scene = section.querySelector<HTMLElement>("[data-hero-execution-sphere]");
      if (!scene) throw new Error("Execution sphere is missing");
      const sectionBounds = section.getBoundingClientRect();
      const sceneBounds = scene.getBoundingClientRect();
      const visibleTokens = [...scene.querySelectorAll<HTMLElement>("[data-request-token]")]
        .filter((token) => Number(getComputedStyle(token).opacity) >= 0.2)
        .map((token) => token.getBoundingClientRect());
      const tokensInside = visibleTokens.every(
        (bounds) =>
          bounds.left >= sceneBounds.left - 2 &&
          bounds.right <= sceneBounds.right + 2 &&
          bounds.top >= sceneBounds.top - 2 &&
          bounds.bottom <= sceneBounds.bottom + 2,
      );
      const labelsDoNotCollide = visibleTokens.every((bounds, index) =>
        visibleTokens.slice(index + 1).every(
          (other) =>
            bounds.right <= other.left ||
            other.right <= bounds.left ||
            bounds.bottom <= other.top ||
            other.bottom <= bounds.top,
        ),
      );
      return {
        sceneInside:
          sceneBounds.left >= sectionBounds.left - 2 &&
          sceneBounds.right <= sectionBounds.right + 2 &&
          sceneBounds.top >= sectionBounds.top - 2 &&
          sceneBounds.bottom <= sectionBounds.bottom + 2,
        tokensInside,
        labelsDoNotCollide,
        internalScroll: scene.scrollHeight - scene.clientHeight,
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(result.sceneInside).toBeTruthy();
    expect(result.tokensInside).toBeTruthy();
    expect(result.labelsDoNotCollide).toBeTruthy();
    expect(result.internalScroll).toBeLessThanOrEqual(1);
    expect(result.horizontalOverflow).toBeLessThanOrEqual(1);
    await expect(scene.locator("[data-request-token]")).toHaveCount(3);
  });
}

test("labeled token flow reflows at 200 percent text without clipping", async ({ page }) => {
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("/");
  await page.locator("html").evaluate((element) => {
    element.style.fontSize = "200%";
  });
  await settle(page);
  const hero = page.locator("[data-hero-execution-sphere]");
  for (const token of tokens) {
    await expect(hero.locator(`[data-request-token="${token.id}"]`)).toBeVisible();
  }
  for (const outcome of outcomes) {
    await expect(hero.getByRole("button", { name: outcome.control, exact: true })).toBeVisible();
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  ).toBeLessThanOrEqual(1);
});
