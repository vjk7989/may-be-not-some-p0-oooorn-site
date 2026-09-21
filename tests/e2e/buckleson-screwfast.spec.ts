import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const representativeRoutes = [
  '/',
  '/products/',
  '/products/hyper-wallet/',
  '/services/',
  '/blog/ai-agent-security/',
  '/insights/ai-audit-trails/',
  '/contact/',
  '/welcome-to-docs/',
  '/definitely-missing/',
];

test.describe('Buckleson route and responsive contract', () => {
  for (const path of representativeRoutes) {
    test(`${path} renders Buckleson without overflow`, async ({ page }) => {
      const remoteRequests: string[] = [];
      page.on('request', request => {
        const url = new URL(request.url());
        if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
          remoteRequests.push(request.url());
        }
      });

      const response = await page.goto(path);
      if (path === '/definitely-missing/') {
        expect(response?.status()).toBe(404);
      } else {
        expect(response?.ok()).toBeTruthy();
      }
      await expect(page.locator('body')).toContainText('Buckleson');
      await expect(page.locator('body')).not.toContainText('ScrewFast');
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
      expect(remoteRequests).toEqual([]);
    });
  }

  test('homepage has no serious or critical accessibility violations', async ({
    page,
  }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      results.violations.filter(({ impact }) =>
        ['serious', 'critical'].includes(impact ?? '')
      )
    ).toEqual([]);
  });
});

test.describe('preserved ScrewFast interactions', () => {
  test('theme, tabs, FAQ, and UI-only modal work', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'covered once on desktop');
    await page.goto('/');

    const themeButton = page.locator(
      '[data-hs-theme-click-value="dark"]:visible'
    );
    await themeButton.click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    const secondTab = page.getByRole('tab').nth(1);
    await secondTab.click();
    await expect(secondTab).toHaveAttribute('aria-selected', 'true');

    const collapsedFaq = page.locator('.hs-accordion-toggle').nth(1);
    await collapsedFaq.click();
    await expect(collapsedFaq).toHaveAttribute('aria-expanded', 'true');

    await page.getByRole('button', { name: 'Log in' }).click();
    const dialog = page.getByRole('dialog', { name: 'Sign in' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('does not collect credentials');
    await expect(dialog).toHaveClass(/\bopened\b/);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('mobile navigation opens and exposes retained destinations', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only control');
    await page.goto('/');
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    const globalNavigation = page.getByRole('navigation', { name: 'Global' });
    await expect(
      globalNavigation.getByRole('link', { name: 'Products', exact: true })
    ).toBeVisible();
    await expect(
      globalNavigation.getByRole('link', { name: 'Blog', exact: true })
    ).toBeVisible();
  });

  test('reduced motion preserves readable content', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/products/hyper-0x/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Hyper-0x'
    );
  });
});

test('Hyper Wallet states its exact product boundary', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'desktop',
    'content contract covered once'
  );
  await page.goto('/products/hyper-wallet/');
  await expect(page.locator('main')).toContainText(
    'available-now agent credential wallet'
  );
  await expect(page.locator('main')).toContainText(
    'not a digital-asset custody or payment product'
  );
  await expect(page.locator('main')).toContainText(
    'does not guarantee secure outcomes'
  );
});
