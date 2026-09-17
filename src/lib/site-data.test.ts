import { describe, expect, it } from "vitest";

import { articleRegistry, products, risks, services, siteConfig } from "@/lib/site-data";

describe("Buckleson content contracts", () => {
  it("keeps the approved assessment link exact", () => {
    expect(siteConfig.calendarUrl).toBe("https://cal.com/buckleson-group/30min");
  });

  it("keeps product and service families bounded", () => {
    expect(products.map(({ name }) => name)).toEqual(["Hyper Tern", "Hyper-ABS", "Hyper-0x"]);
    expect(services.map(({ name }) => name)).toEqual(["AI Security", "Secure Inference", "Custom AI"]);
  });

  it("keeps exact source-defined risk names", () => {
    expect(risks.map(({ name }) => name)).toEqual([
      "Prompt Injection",
      "Sensitive Information Disclosure",
      "Excessive Agency",
      "Intent Breaking & Goal Manipulation (Agentic T6)",
      "Tool Misuse (Agentic T2)",
      "Memory Poisoning (Agentic T1)",
    ]);
  });

  it("publishes unique, complete article metadata", () => {
    expect(articleRegistry).toHaveLength(6);
    expect(new Set(articleRegistry.map(({ slug }) => slug)).size).toBe(6);
    expect(new Set(articleRegistry.map(({ title }) => title)).size).toBe(6);
    for (const article of articleRegistry) {
      expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      expect(article.description.length).toBeGreaterThanOrEqual(70);
      expect(article.description.length).toBeLessThanOrEqual(160);
      expect(`${article.seoTitle} — Buckleson`.length).toBeLessThanOrEqual(65);
      expect(article.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.primaryKeyword.length).toBeGreaterThan(2);
      expect(article.relatedTerms.length).toBeGreaterThan(0);
      expect(article.relatedHref).toMatch(/^\/(products|services)\//);
    }
  });
});
