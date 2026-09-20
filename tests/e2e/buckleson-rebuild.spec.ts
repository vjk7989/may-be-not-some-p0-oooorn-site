import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const calendarUrl = "https://cal.com/buckleson-group/30min";

const topLevelNavigation = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about/" },
  { key: "products", label: "Products", href: "/products/" },
  { key: "services", label: "Services", href: "/services/" },
  { key: "blog", label: "Blog", href: "/blog/" },
] as const;

const megaMenuDestinations = {
  about: [
    ["About Buckleson", "/about/"],
    ["How we protect", "/about/#how-we-protect"],
    ["Vision", "/about/#vision"],
  ],
  products: [
    ["Product overview", "/products/"],
    ["Hyper Tern", "/products/hyper-tern/"],
    ["Hyper-ABS", "/products/hyper-abs/"],
    ["Hyper-0x", "/products/hyper-0x/"],
  ],
  services: [
    ["AI Security", "/services/#ai-security"],
    ["Secure Inference", "/services/#secure-inference"],
    ["Custom AI", "/services/#custom-ai"],
  ],
  blog: [
    ["All guides", "/blog/"],
    ["AI agent security", "/blog/ai-agent-security/"],
    ["Prompt injection", "/blog/prompt-injection-prevention/"],
    ["Secure inference", "/blog/secure-ai-inference/"],
  ],
} as const;

const products = [
  {
    slug: "hyper-tern",
    name: "Hyper Tern",
    role: "Control AI execution",
    risk: "Excessive Agency",
  },
  {
    slug: "hyper-abs",
    name: "Hyper-ABS",
    role: "Protect information before inference",
    risk: "Sensitive Information Disclosure",
  },
  {
    slug: "hyper-0x",
    name: "Hyper-0x",
    role: "Verify execution evidence",
    risk: "Evidence tampering",
  },
] as const;

const homepageMilestones = [
  ".home-hero",
  ".statement-scene",
  ".responsibilities-scene",
  ".product-rail-scene",
  ".capability-scene",
  ".mission-scene",
  ".hyper-band",
  ".risk-scenarios",
  ".protection-narrative",
  ".process-scene",
  ".principles-scene",
  ".engagement-scene",
  ".faq-scene",
  ".insights-scene",
  ".assessment-cta",
] as const;

async function expectSingleH1(page: Page, name: string | RegExp) {
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1, name })).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
}

async function expectDestinations(
  panel: Locator,
  destinations: readonly (readonly [string, string])[],
) {
  const links = panel.getByRole("link");
  await expect(links).toHaveCount(destinations.length);
  for (const [index, [label, href]] of destinations.entries()) {
    await expect(links.nth(index)).toHaveAccessibleName(new RegExp(`^${label}\\b`));
    await expect(links.nth(index)).toHaveAttribute("href", href);
  }
}

test.describe("Buckleson rebuild homepage", () => {
  test("presents the approved story in deterministic section order", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await expectSingleH1(page, "We help you use AI safely.");
    await expect(page.locator("main").getByText("We secure how AI runs — not what AI thinks.", { exact: true })).toBeVisible();

    const order = await page.locator("main > section").evaluateAll((sections, selectors) =>
      selectors.map((selector) =>
        sections.findIndex((section) => section.matches(selector)),
      ), homepageMilestones);
    expect(order).toEqual(homepageMilestones.map((_, index) => index));

    await expect(page.getByRole("heading", { name: "Three controls. One accountable execution path." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Built around the moment AI acts." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Direct answers about scope and responsibility." })).toBeVisible();
    await expect(page.locator(".article-preview-list > a")).toHaveCount(3);
    await expect(page.locator("body > footer")).toBeVisible();
  });

  test("loads the responsive local hero image and never contacts a reference host", async ({ page }) => {
    const externalRequests: string[] = [];
    const heroRequests: string[] = [];
    page.on("request", (request) => {
      const requestUrl = new URL(request.url());
      const hostname = requestUrl.hostname;
      if (hostname !== "127.0.0.1" && hostname !== "localhost") {
        externalRequests.push(request.url());
      }
      if (requestUrl.pathname.includes("buckleson-execution-boundary-")) {
        heroRequests.push(requestUrl.pathname);
      }
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    const heroImage = page.locator("[data-cinematic-hero] img");
    const mobileSource = page.locator('[data-cinematic-hero] picture source[media="(max-width: 62rem)"][type="image/avif"]');
    await expect(heroImage).toBeVisible();
    await expect(heroImage).toHaveAttribute("alt", /sculptural execution boundary/i);
    await expect(heroImage).toHaveAttribute("src", /\/media\/buckleson-execution-boundary-1586\.webp/);
    await expect(heroImage).toHaveAttribute("loading", "eager");
    await expect(heroImage).toHaveAttribute("fetchpriority", "high");
    await expect(mobileSource).toHaveAttribute("media", "(max-width: 62rem)");
    await expect(mobileSource).toHaveAttribute("srcset", /\/media\/buckleson-execution-boundary-960\.avif/);
    expect(heroRequests.filter((url) => /buckleson-execution-boundary-960\.(?:avif|webp)$/.test(url))).toHaveLength(1);
    expect(heroRequests.filter((url) => /buckleson-execution-boundary-1586\.(?:avif|webp)$/.test(url))).toHaveLength(0);

    const html = await page.content();
    expect(html).not.toMatch(/spartanai\.framer\.website|pavii\.tech|framerusercontent\.com/i);
    expect(externalRequests).toEqual([]);
  });

  test("links every product rail and hero product item to its detail route", async ({ page }) => {
    await page.goto("/");
    for (const product of products) {
      const href = `/products/${product.slug}/`;
      await expect(page.locator(`.product-rail a[href="${href}"]`)).toHaveCount(1);
      await expect(page.locator(`[data-hero-product-rail] a[href="${href}"]`)).toHaveCount(1);
    }
  });

  test("keeps capability and FAQ disclosures keyboard-operable", async ({ page }) => {
    await page.goto("/");

    const serviceDetails = page.locator(".capability-scene details");
    await expect(serviceDetails).toHaveCount(3);
    await expect(serviceDetails.first()).toHaveAttribute("open", "");
    const secondService = serviceDetails.nth(1);
    const secondSummary = secondService.locator("summary");
    await secondSummary.focus();
    await page.keyboard.press("Enter");
    await expect(secondService).toHaveAttribute("open", "");
    await expect(secondService.locator(".boundary-note")).toBeVisible();

    const faqItems = page.locator(".faq-scene details");
    await expect(faqItems).toHaveCount(6);
    const firstFaq = faqItems.first();
    await firstFaq.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(firstFaq).toHaveAttribute("open", "");
    await expect(firstFaq.locator(".disclosure-content")).toBeVisible();
  });

  test("stops hero motion when reduced motion is requested", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });

    const motionState = await page.locator("[data-cinematic-hero]").evaluate((root) => ({
      animations: root.getAnimations({ subtree: true }).length,
      opacity: getComputedStyle(root.querySelector<HTMLElement>("[data-hero-reveal]")!).opacity,
      mediaTransform: getComputedStyle(root.querySelector<HTMLElement>("[data-hero-media] img")!).transform,
      cardTransition: getComputedStyle(root.querySelector<HTMLElement>("[data-hero-product-card]")!).transitionDuration,
    }));
    expect(motionState.animations).toBe(0);
    expect(Number.parseFloat(motionState.opacity)).toBeGreaterThan(0);
    expect(motionState.mediaTransform).toBe("none");
    expect(motionState.cardTransition.split(", ").every((duration) => duration === "0s")).toBe(true);
  });
});

test.describe("Buckleson rebuild navigation", () => {
  test("has the exact top-level order, mega-menu destinations, and external contact CTA", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary navigation", exact: true });
    const links = nav.locator(":scope > .nav-item > a");
    await expect(links).toHaveCount(topLevelNavigation.length);

    for (const [index, item] of topLevelNavigation.entries()) {
      await expect(links.nth(index)).toHaveAccessibleName(item.label);
      await expect(links.nth(index)).toHaveAttribute("href", item.href);
    }

    const contact = page.locator('.header-inner > [data-nav-link="contact"]');
    await expect(contact).toHaveAccessibleName("Contact Us");
    await expect(contact).toHaveAttribute("href", calendarUrl);
    await expect(contact).not.toHaveAttribute("target", "_blank");

    for (const [key, destinations] of Object.entries(megaMenuDestinations)) {
      const trigger = page.locator(`[data-nav-link="${key}"]`);
      await trigger.hover();
      const panel = page.locator(`[data-nav-panel="${key}"]`);
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expectDestinations(panel, destinations);
    }
  });

  test("keeps a mega menu open while focus moves into it and closes on Escape", async ({ page }) => {
    await page.goto("/");
    const trigger = page.locator('[data-nav-link="products"]');
    const panel = page.locator('[data-nav-panel="products"]');
    await trigger.focus();
    await expect(panel).toBeVisible();

    await panel.getByRole("link", { name: "Hyper Tern" }).focus();
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe("Buckleson products", () => {
  test("renders one featured tile and two supporting tiles with valid detail links", async ({ page }) => {
    await page.goto("/products/");
    await expectSingleH1(page, "Three responsibilities. One execution boundary.");

    const bento = page.locator("[data-product-bento]");
    await expect(bento.locator("[data-product-card]")).toHaveCount(3);
    await expect(bento.locator(".product-bento-card-featured")).toHaveCount(1);
    for (const product of products) {
      const card = bento.locator(`[data-product-card="${product.slug}"]`);
      await expect(card).toContainText(product.name);
      await expect(card).toContainText(product.role);
      await expect(card.getByRole("link", { name: `Explore ${product.name}` })).toHaveAttribute(
        "href",
        `/products/${product.slug}/`,
      );
    }
  });

  for (const product of products) {
    test(`${product.name} detail has current capability, architecture, risk limits, and no invented guarantee`, async ({ page }) => {
      await page.goto(`/products/${product.slug}/`);
      await expectSingleH1(page, product.name);
      await expect(page.getByText("Current capability", { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("heading", { name: `What ${product.name} does now.` })).toBeVisible();
      await expect(page.getByRole("heading", { name: "The boundary, layer by layer." })).toBeVisible();
      await expect(page.getByRole("heading", { name: product.risk, exact: true })).toBeVisible();
      await expect(page.getByText("Boundary:", { exact: true }).first()).toBeVisible();

      const text = await page.locator("main").innerText();
      expect(text).not.toMatch(/100% secure|privacy guaranteed|guaranteed (?:privacy|security|safety|correctness)/i);

      if (product.slug === "hyper-0x") {
        await expect(page.getByRole("heading", { name: "Designed-for architecture" })).toBeVisible();
        await expect(page.getByText("Designed for", { exact: true })).toBeVisible();
        await expect(page.getByText(/remain separate from verified current capability/i)).toBeVisible();
      } else {
        await expect(page.getByRole("heading", { name: "Designed-for architecture" })).toHaveCount(0);
      }
    });
  }
});

test.describe("Buckleson supporting routes and claim boundaries", () => {
  const routes = [
    ["/about/", "Infrastructure for accountable AI execution."],
    ["/services/", "Make AI useful inside clear boundaries."],
    ["/blog/", "Understand the risk before choosing the control."],
  ] as const;

  for (const [route, heading] of routes) {
    test(`${route} has one route-specific H1 and an assessment path`, async ({ page }) => {
      await page.goto(route);
      await expectSingleH1(page, heading);
      await expect(page.locator(`a[href="${calendarUrl}"]`).first()).toBeVisible();
    });
  }

  test("states people, inference, and blockchain responsibility boundaries", async ({ page }) => {
    await page.goto("/about/");
    await expect(page.getByRole("heading", { name: "People remain responsible." })).toBeVisible();
    await expect(page.getByText(/organizations remain responsible for appropriate use cases/i)).toBeVisible();

    await page.goto("/services/");
    const inference = page.locator("#secure-inference");
    await expect(inference).toContainText("not a claim of confidential computing");

    await page.goto("/products/hyper-0x/");
    await expect(page.locator("main")).toContainText(
      "Tamper evidence does not prove that the original event was correct",
    );
  });

  test("does not publish fabricated evidence or prohibited claims", async ({ page }) => {
    const routesToCheck = ["/", "/about/", "/products/", "/services/"];
    const prohibited = [
      /100% secure/i,
      /privacy (?:is )?guaranteed/i,
      /privacy guaranteed|guaranteed (?:privacy|security|safety|correctness)/i,
      /(?:detects?|prevents?|blocks?) (?:all|every) (?:attack|threat|prompt injection)/i,
      /solves? (?:all|every) owasp/i,
      /(?:provides|uses|implements|delivers|guarantees) confidential computing/i,
      /trusted by \d+/i,
      /meet (?:our|the) team/i,
      /customer logos?/i,
      /from our client/i,
      /soc ?2 certified/i,
      /iso ?27001 certified/i,
      /\$\d+(?:\.\d+)?\s*\/\s*month/i,
    ];

    for (const route of routesToCheck) {
      await page.goto(route);
      const visibleText = await page.locator("body").innerText();
      for (const pattern of prohibited) expect(visibleText).not.toMatch(pattern);
      await expect(page.locator('a[href^="/pricing"], a[href^="/team"], a[href^="/testimonials"], a[href^="/case-studies"]')).toHaveCount(0);
    }
  });
});

test.describe("Buckleson responsive containment", () => {
  for (const viewport of [
    { width: 390, height: 844, label: "mobile" },
    { width: 1440, height: 900, label: "desktop" },
  ]) {
    test(`${viewport.label} homepage and products avoid horizontal overflow`, async ({ page }) => {
      await page.setViewportSize(viewport);
      for (const route of ["/", "/products/"]) {
        await page.goto(route);
        await expectNoHorizontalOverflow(page);
        await expect(page.locator("main")).toBeVisible();
      }
    });
  }
});
