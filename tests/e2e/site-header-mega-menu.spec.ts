import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

const calendarUrl = "https://cal.com/buckleson-group/30min";

const topLevel = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about/" },
  { key: "products", label: "Products", href: "/products/" },
  { key: "services", label: "Services", href: "/services/" },
  { key: "blog", label: "Blog", href: "/blog/" },
  { key: "contact", label: "Contact Us", href: calendarUrl },
] as const;

const groups = {
  about: [
    { label: "About Buckleson", href: "/about/" },
    { label: "Protection layers", href: "/about/#protect-title" },
    { label: "Human responsibility", href: "/about/#responsibility-title" },
    { label: "Journey and vision", href: "/about/#status-title" },
  ],
  products: [
    { label: "All products", href: "/products/" },
    { label: "Hyper Tern", href: "/products/#hyper-tern" },
    { label: "Hyper-ABS", href: "/products/#hyper-abs" },
    { label: "Hyper-0x", href: "/products/#hyper-0x" },
  ],
  services: [
    { label: "All services", href: "/services/" },
    { label: "AI Security", href: "/services/#ai-security" },
    { label: "Secure Inference", href: "/services/#secure-inference" },
    { label: "Custom AI", href: "/services/#custom-ai" },
  ],
  blog: [
    { label: "All articles", href: "/blog/" },
    {
      label: "AI Agent Security: A Practical Guide to Data, Tools, and Actions",
      href: "/blog/ai-agent-security/",
    },
    {
      label: "Prompt Injection Prevention for AI Agents",
      href: "/blog/prompt-injection-prevention/",
    },
    {
      label: "Secure AI Inference: Protecting Data Around Model Execution",
      href: "/blog/secure-ai-inference/",
    },
  ],
} as const;

type GroupKey = keyof typeof groups;

function desktopNav(page: Page) {
  return page.getByRole("navigation", { name: "Primary navigation", exact: true });
}

function topLink(page: Page, key: (typeof topLevel)[number]["key"]) {
  return desktopNav(page).locator(`[data-nav-link="${key}"]`);
}

function panel(page: Page, key: GroupKey) {
  return page.locator(`[data-nav-panel="${key}"]`);
}

async function expectDestinations(container: Locator, expected: readonly { label: string; href: string }[]) {
  const links = container.getByRole("link");
  await expect(links).toHaveCount(expected.length);

  for (const [index, destination] of expected.entries()) {
    const link = links.nth(index);
    await expect(link).toHaveAttribute("href", destination.href);
    await expect(link).toContainText(destination.label);
    await expect(link.locator("p")).not.toHaveText("");
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test.describe("Cloudflare-inspired shared navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
  });

  test("keeps clickable top-level links while exposing four structured panels", async ({ page }) => {
    const nav = desktopNav(page);
    await expect(nav).toBeVisible();

    const directLinks = nav.locator(":scope > [data-nav-item] > [data-nav-link], :scope > [data-nav-link]");
    await expect(directLinks).toHaveCount(topLevel.length);
    for (const [index, item] of topLevel.entries()) {
      await expect(directLinks.nth(index)).toHaveAccessibleName(item.label);
      await expect(directLinks.nth(index)).toHaveAttribute("href", item.href);
    }

    await expect(topLink(page, "home")).not.toHaveAttribute("aria-controls", /.+/);
    await expect(page.locator('[data-nav-panel="home"]')).toHaveCount(0);

    for (const key of Object.keys(groups) as GroupKey[]) {
      const link = topLink(page, key);
      const disclosure = panel(page, key);
      const disclosureId = await disclosure.getAttribute("id");
      const linkId = await link.getAttribute("id");
      if (!disclosureId || !linkId) {
        throw new Error(`Missing navigation relationship id for ${key}`);
      }
      await expect(link).toHaveAttribute("aria-controls", disclosureId);
      await expect(link).toHaveAttribute("aria-expanded", "false");
      await expect(disclosure).toHaveAttribute("aria-labelledby", linkId);
      await expect(disclosure).toBeHidden();
      await expect(disclosure.getByRole("link")).toHaveCount(0);

      await link.focus();
      await expect(link).toHaveAttribute("aria-expanded", "true");
      await expect(disclosure).toBeVisible();
      await expectDestinations(disclosure, groups[key]);

      await page.keyboard.press("Escape");
      await expect(link).toHaveAttribute("aria-expanded", "false");
      await expect(disclosure).toBeHidden();
      await expect(disclosure.getByRole("link")).toHaveCount(0);
    }

    await topLink(page, "about").hover();
    await topLink(page, "about").click();
    await expect(page).toHaveURL(/\/about\/$/);
  });

  test("keeps one pointer-open panel stable while the pointer enters it", async ({ page }) => {
    const aboutLink = topLink(page, "about");
    const aboutPanel = panel(page, "about");
    const productsLink = topLink(page, "products");
    const productsPanel = panel(page, "products");

    await aboutLink.hover();
    await expect(aboutLink).toHaveAttribute("aria-expanded", "true");
    await expect(aboutPanel).toBeVisible();
    await aboutPanel.hover();
    await page.waitForTimeout(250);
    await expect(aboutPanel).toBeVisible();

    await productsLink.hover();
    await expect(productsPanel).toBeVisible();
    await expect(productsLink).toHaveAttribute("aria-expanded", "true");
    await expect(aboutLink).toHaveAttribute("aria-expanded", "false");
    await expect(aboutPanel).toBeHidden();
    await expect(page.locator('[data-nav-panel]:visible')).toHaveCount(1);

    await page.locator("main").hover({ position: { x: 10, y: 10 } });
    await expect(productsPanel).toBeHidden();

    await aboutLink.focus();
    await expect(aboutPanel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(aboutPanel).toBeHidden();
    await aboutLink.hover();
    await expect(aboutPanel).toBeVisible();
  });

  test("opens on focus and dismisses on Escape and focus exit", async ({ page }) => {
    const aboutLink = topLink(page, "about");
    const aboutPanel = panel(page, "about");

    await aboutLink.focus();
    await expect(aboutPanel).toBeVisible();
    await expect(aboutLink).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Tab");
    await expect(aboutPanel.getByRole("link").first()).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(aboutPanel).toBeHidden();
    await expect(aboutLink).toHaveAttribute("aria-expanded", "false");

    await topLink(page, "home").focus();
    await aboutLink.focus();
    await expect(aboutPanel).toBeVisible();
    await topLink(page, "products").focus();
    await expect(aboutPanel).toBeHidden();
    await expect(panel(page, "products")).toBeVisible();

    await page.locator("main").focus();
    await expect(panel(page, "products")).toBeHidden();
  });

  test("retains exactly one top-level current page across pages and articles", async ({ page }) => {
    const cases = [
      { route: "/", current: "Home" },
      { route: "/about/", current: "About" },
      { route: "/products/", current: "Products" },
      { route: "/services/", current: "Services" },
      { route: "/blog/", current: "Blog" },
      { route: "/blog/ai-agent-security/", current: "Blog" },
    ] as const;

    for (const currentCase of cases) {
      await page.goto(currentCase.route);
      const current = desktopNav(page).locator('[data-nav-link][aria-current="page"]');
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAccessibleName(currentCase.current);
      await expect(
        desktopNav(page).getByRole("link", { name: "Contact Us", exact: true }),
      ).not.toHaveAttribute("aria-current", "page");
    }
  });

  test("styles Contact Us as an outlined oval with inverted hover and press states", async ({ page }) => {
    const contact = topLink(page, "contact");
    await expect(contact).toHaveAttribute("href", calendarUrl);
    await expect(contact).not.toHaveAttribute("target", "_blank");

    const rest = await contact.evaluate((element) => {
      const styles = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        background: styles.backgroundColor,
        borderColor: styles.borderTopColor,
        borderWidth: Number.parseFloat(styles.borderTopWidth),
        color: styles.color,
        height: bounds.height,
        radius: Number.parseFloat(styles.borderTopLeftRadius),
      };
    });
    expect(rest.borderColor).toBe("rgb(109, 40, 217)");
    expect(rest.borderWidth).toBeGreaterThanOrEqual(1);
    expect(rest.color).toBe("rgb(109, 40, 217)");
    expect(rest.background).toBe("rgba(0, 0, 0, 0)");
    expect(rest.radius).toBeGreaterThanOrEqual(rest.height / 2 - 1);

    await contact.hover();
    await expect.poll(() => contact.evaluate((element) => getComputedStyle(element).backgroundColor))
      .toBe("rgb(109, 40, 217)");
    await expect.poll(() => contact.evaluate((element) => getComputedStyle(element).color))
      .toBe("rgb(255, 255, 255)");

    await page.mouse.down();
    await expect(contact).toHaveCSS("background-color", "rgb(109, 40, 217)");
    await expect(contact).toHaveCSS("color", "rgb(255, 255, 255)");
    await page.mouse.move(0, 0);
    await page.mouse.up();

    await page.keyboard.press("Tab");
    await contact.focus();
    const focus = await contact.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        outlineStyle: styles.outlineStyle,
        outlineWidth: Number.parseFloat(styles.outlineWidth),
        boxShadow: styles.boxShadow,
      };
    });
    expect(
      (focus.outlineStyle !== "none" && focus.outlineWidth >= 2) || focus.boxShadow !== "none",
    ).toBeTruthy();
  });

  test("mobile Sheet exposes the same groups without hover", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const trigger = page.locator("button.mobile-menu-trigger");
    await trigger.click();
    const nav = page.getByRole("navigation", { name: "Mobile navigation", exact: true });

    for (const key of Object.keys(groups) as GroupKey[]) {
      const group = nav.locator(`[data-mobile-nav-group="${key}"]`);
      await expect(group).toBeVisible();
      await expectDestinations(group, groups[key]);
    }

    const contact = nav.getByRole("link", { name: "Contact Us", exact: true });
    await expect(contact).toHaveAttribute("href", calendarUrl);
    await expect(contact).toHaveCSS("border-top-color", "rgb(109, 40, 217)");
    const mobileContact = await contact.evaluate((element) => {
      const styles = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        color: styles.color,
        radius: Number.parseFloat(styles.borderTopLeftRadius),
        height: bounds.height,
      };
    });
    expect(mobileContact.color).toBe("rgb(109, 40, 217)");
    expect(mobileContact.radius).toBeGreaterThanOrEqual(mobileContact.height / 2 - 1);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  });

  test("reduced motion makes panel and rolling-label state changes immediate", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const productsLink = topLink(page, "products");
    const productsPanel = panel(page, "products");
    await productsLink.focus();
    await expect(productsPanel).toBeVisible();

    const movingNodes = productsPanel.locator("*, :scope").or(productsLink.locator(".nav-letter"));
    const motion = await movingNodes.evaluateAll((elements) =>
      elements.map((element) => {
        const styles = getComputedStyle(element);
        return {
          animationName: styles.animationName,
          animationDuration: styles.animationDuration,
          transitionDuration: styles.transitionDuration,
        };
      }),
    );
    for (const item of motion) {
      expect(item.animationName === "none" || item.animationDuration.split(", ").every((value) => value === "0s")).toBeTruthy();
      expect(item.transitionDuration.split(", ").every((value) => value === "0s")).toBeTruthy();
    }
  });

  test("panels stay inside the viewport and the page reflows at supported widths", async ({ page }) => {
    for (const width of [320, 390, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expectNoHorizontalOverflow(page);

      if (await desktopNav(page).isVisible()) {
        for (const key of Object.keys(groups) as GroupKey[]) {
          await topLink(page, key).hover();
          const bounds = await panel(page, key).boundingBox();
          expect(bounds).not.toBeNull();
          expect(bounds!.x).toBeGreaterThanOrEqual(0);
          expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        }
      } else {
        await expect(page.locator("button.mobile-menu-trigger")).toBeVisible();
      }
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.locator("html").evaluate((element) => {
      element.style.fontSize = "200%";
    });
    await expectNoHorizontalOverflow(page);
    const visibleNavigationControl = page.locator(
      "button.mobile-menu-trigger:visible, nav.desktop-navigation:visible",
    );
    await expect(visibleNavigationControl).toHaveCount(1);
    await expect(visibleNavigationControl).toBeVisible();
  });

  test("has no serious or critical accessibility violations while a panel is open", async ({ page }) => {
    await topLink(page, "about").focus();
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const severe = results.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical",
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });
});

test("no-JavaScript fallback exposes every grouped destination as a native link", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navigation without JavaScript", exact: true });
  await expect(nav).toBeVisible();

  for (const item of topLevel) {
    await expect(nav.getByRole("link", { name: item.label, exact: true })).toHaveAttribute(
      "href",
      item.href,
    );
  }
  for (const key of Object.keys(groups) as GroupKey[]) {
    const group = nav.locator(`[data-no-script-nav-group="${key}"]`);
    await expect(group).toBeVisible();
    for (const destination of groups[key]) {
      await expect(group.locator(`a[href="${destination.href}"]`)).toBeVisible();
    }
  }
  await expect(page.locator("button.mobile-menu-trigger")).toBeHidden();
  await expectNoHorizontalOverflow(page);
  await context.close();
});
