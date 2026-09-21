import { existsSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { getArticleBySlug, getMediaById, getProjectBySlug, spartanSiteContent } from "@/content/spartan-site-content";

const canonicalStaticRoutes = ["/", "/digital-brain/", "/project/", "/about/", "/articles/", "/contact/", "/policies/terms-conditions/", "/policies/privacy-policy/"];
const publicCopy = () => JSON.stringify({
  company: spartanSiteContent.company.description,
  product: spartanSiteContent.product,
  projects: spartanSiteContent.projects.map(({ slug, ...project }) => { void slug; return project; }),
  articles: spartanSiteContent.articles.map(({ slug, ...article }) => { void slug; return article; }),
  capabilities: spartanSiteContent.capabilities,
  process: spartanSiteContent.process,
  disciplines: spartanSiteContent.disciplines,
  engagements: spartanSiteContent.engagements,
  faqs: spartanSiteContent.faqs,
});

describe("Spartan authoritative content", () => {
  it("defines the complete deterministic route inventory", () => {
    expect(spartanSiteContent.projects).toHaveLength(5);
    expect(spartanSiteContent.articles).toHaveLength(3);
    const routes = [
      ...canonicalStaticRoutes,
      ...spartanSiteContent.projects.map(({ slug }) => `/project/${slug}/`),
      ...spartanSiteContent.articles.map(({ slug }) => `/articles/${slug}/`),
    ];
    expect(routes).toHaveLength(16);
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.every((route) => route.startsWith("/") && route.endsWith("/"))).toBe(true);
    expect(routes.some((route) => /^\/(products|services|blog)\//.test(route))).toBe(false);
  });

  it("keeps the observed navigation and booking destination canonical", () => {
    expect(spartanSiteContent.navigation.map(({ label }) => label)).toEqual(["Works", "Services", "Insights", "Pricing", "Company"]);
    expect(spartanSiteContent.navigation.every(({ href }) => href.startsWith("/"))).toBe(true);
    expect(spartanSiteContent.company.calendarUrl).toBe("https://cal.com/buckleson-group/30min");
  });

  it("resolves every project, article, and media relation", () => {
    for (const project of spartanSiteContent.projects) {
      expect(getProjectBySlug(project.slug)).toBe(project);
      expect(getMediaById(project.mediaId)).toBeTruthy();
    }
    for (const article of spartanSiteContent.articles) {
      expect(getArticleBySlug(article.slug)).toBe(article);
      expect(getMediaById(article.mediaId)).toBeTruthy();
    }
    expect(getProjectBySlug("missing")).toBeUndefined();
    expect(getArticleBySlug("missing")).toBeUndefined();
    expect(getMediaById("missing")).toBeUndefined();
  });

  it("uses only valid local responsive media", () => {
    const paths = new Set<string>();
    for (const media of spartanSiteContent.media) {
      expect(media.width).toBeGreaterThan(0);
      expect(media.height).toBeGreaterThan(0);
      expect(media.decorative || media.alt.trim().length > 0).toBeTruthy();
      for (const derivative of media.derivatives) {
        expect(derivative.src).toMatch(/^\/media\/[a-z0-9-]+\.(?:avif|webp)$/);
        expect(derivative.width).toBeGreaterThan(0);
        expect(derivative.height).toBeGreaterThan(0);
        expect(paths.has(derivative.src)).toBe(false);
        paths.add(derivative.src);
        const diskPath = `${process.cwd()}/public${derivative.src}`;
        expect(existsSync(diskPath)).toBe(true);
        expect(statSync(diskPath).size).toBeGreaterThan(0);
      }
    }
  });

  it("contains the reference-visible content contract without runtime media hosts", () => {
    const copy = publicCopy();
    expect(copy).toContain("Own Your Private Neural Engine");
    expect(copy).toContain("Cigna Smart Health Systems");
    expect(copy).toContain("The Sovereign Cloud: Why On-Premise AI is the Future of Data Privacy");
    expect(copy).toContain("How do you ensure our data remains secure?");
    for (const term of ["Buckleson", "Hyper Tern", "Hyper-ABS", "Hyper-0x", "framerusercontent", "spartanai.framer.website"])
      expect(copy).not.toContain(term);
  });

  it("is stable across repeated serialization", () => {
    expect(JSON.stringify(spartanSiteContent)).toBe(JSON.stringify(spartanSiteContent));
  });
});
