import { readFileSync } from "node:fs";

import { describe, expect, expectTypeOf, it } from "vitest";

import {
  bucklesonSiteContent,
  type EngagementPath,
  type HomepageSection,
  type MediaAsset,
} from "@/content/buckleson-site-content";

const PRODUCT_NAMES = ["Hyper Tern", "Hyper-ABS", "Hyper-0x"] as const;
const PRODUCT_ROLES = [
  "Control AI execution",
  "Protect information before inference",
  "Verify execution evidence",
] as const;

const expectUnique = (values: readonly string[], label: string) => {
  expect(new Set(values).size, `${label} must be unique`).toBe(values.length);
};

const expectLocalPublicPath = (path: string) => {
  expect(path).toMatch(/^\/(?:media|brand)\/[a-z0-9][a-z0-9/_-]*\.(?:avif|webp|png|jpe?g|svg)$/i);
  expect(path).not.toMatch(/(?:^|\/)\.\.(?:\/|$)|^\/\//);
};

describe("cinematic presentation content contract", () => {
  it("exports the required presentation types from the authoritative content module", () => {
    expectTypeOf<MediaAsset>().toMatchTypeOf<{
      id: string;
      source: string;
      alt: string;
      width: number;
      height: number;
      derivatives: ReadonlyArray<{
        src: string;
        width: number;
        height: number;
        format: "avif" | "webp";
      }>;
      decorative?: boolean;
    }>();
    expectTypeOf<HomepageSection>().toMatchTypeOf<{
      id: string;
      label: string;
      title: string;
      mediaId?: string;
    }>();
    expectTypeOf<EngagementPath>().toMatchTypeOf<{
      title: string;
      summary: string;
      href: string;
    }>();
  });

  it("keeps responsive presentation media local, dimensioned, and resolvable", () => {
    const { media } = bucklesonSiteContent.presentation;
    expect(media.length).toBeGreaterThan(0);
    expectUnique(media.map(({ id }) => id), "media ids");

    for (const asset of media) {
      expect(asset.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expectLocalPublicPath(asset.source);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.derivatives.length, `${asset.id} responsive derivatives`).toBeGreaterThanOrEqual(2);

      if (asset.decorative) {
        expect(asset.alt).toBe("");
      } else {
        expect(asset.alt.trim().length, `${asset.id} meaningful alt`).toBeGreaterThan(0);
      }

      const derivativeWidths = asset.derivatives.map(({ width }) => width);
      expectUnique(asset.derivatives.map(({ src }) => src), `${asset.id} derivative paths`);
      expect(derivativeWidths).toEqual([...derivativeWidths].sort((left, right) => left - right));
      for (const derivative of asset.derivatives) {
        expectLocalPublicPath(derivative.src);
        expect(["avif", "webp"]).toContain(derivative.format);
        expect(derivative.src.endsWith(`.${derivative.format}`)).toBe(true);
        expect(derivative.width).toBeGreaterThan(0);
        expect(derivative.height).toBeGreaterThan(0);
        expect(derivative.width / derivative.height).toBeCloseTo(asset.width / asset.height, 2);
      }
    }
  });

  it("resolves every homepage and optional page or product media reference", () => {
    const { media, homepageSections } = bucklesonSiteContent.presentation;
    const mediaIds = new Set(media.map(({ id }) => id));

    expectUnique(homepageSections.map(({ id }) => id), "homepage section ids");
    for (const section of homepageSections) {
      expect(section.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(section.label.trim().length).toBeGreaterThan(0);
      expect(section.title.trim().length).toBeGreaterThan(0);
      if (section.mediaId) expect(mediaIds.has(section.mediaId), section.mediaId).toBe(true);
    }

    for (const item of [...bucklesonSiteContent.pages, ...bucklesonSiteContent.products]) {
      if (item.mediaId) expect(mediaIds.has(item.mediaId), item.mediaId).toBe(true);
    }
  });

  it("defines three deterministic non-priced engagement paths", () => {
    const { engagementPaths } = bucklesonSiteContent.presentation;
    expect(engagementPaths).toHaveLength(3);
    expectUnique(engagementPaths.map(({ title }) => title), "engagement path titles");

    for (const path of engagementPaths) {
      expect(path.title.trim().length).toBeGreaterThan(0);
      expect(path.summary.trim().length).toBeGreaterThan(0);
      expect(path.href).toMatch(/^(?:\/[a-z0-9/#-]*|https:\/\/cal\.com\/buckleson-group\/30min)$/);
      expect(`${path.title}\n${path.summary}`).not.toMatch(/\$|€|£|pricing|per month|starting at/i);
    }
  });

  it("keeps the hero product rail tied exactly to the canonical product family", () => {
    expect(bucklesonSiteContent.products.map(({ name }) => name)).toEqual(PRODUCT_NAMES);
    expect(bucklesonSiteContent.products.map(({ role }) => role)).toEqual(PRODUCT_ROLES);
    expect(bucklesonSiteContent.products.map(({ status }) => status)).toEqual([
      "Current capability",
      "Current capability",
      "Current capability",
    ]);
  });

  it("defines solid glass fallbacks for unsupported and reduced transparency", () => {
    const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
    expect(css).toMatch(
      /@supports not[^{}]*\{[\s\S]{0,1600}\[data-hero-product-card\][\s\S]{0,800}backdrop-filter:\s*none/i,
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-transparency:\s*reduce\)[^{]*\{[\s\S]{0,1600}\[data-hero-product-card\][\s\S]{0,800}backdrop-filter:\s*none/i,
    );
  });
});
