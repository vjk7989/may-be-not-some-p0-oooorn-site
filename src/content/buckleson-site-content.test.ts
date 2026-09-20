import { readFileSync } from "node:fs";

import { describe, expect, expectTypeOf, it } from "vitest";

import {
  bucklesonSiteContent,
  getProductBySlug,
  type CapabilityStatus,
  type CompanyContent,
  type FaqItem,
  type NavigationItem,
  type PageDefinition,
  type ProductContent,
  type RiskContent,
  type ServiceContent,
  type SiteContent,
} from "@/content/buckleson-site-content";

const CALENDAR_URL = "https://cal.com/buckleson-group/30min";
const PRODUCT_NAMES = ["Hyper Tern", "Hyper-ABS", "Hyper-0x"] as const;
const SERVICE_NAMES = ["AI Security", "Secure Inference", "Custom AI"] as const;
const RISK_NAMES = [
  "Prompt Injection",
  "Sensitive Information Disclosure",
  "Excessive Agency",
  "Intent Breaking & Goal Manipulation (Agentic T6)",
  "Tool Misuse (Agentic T2)",
  "Memory Poisoning (Agentic T1)",
  "Evidence tampering",
] as const;
const CAPABILITY_STATUSES = [
  "Current capability",
  "Pilot stage",
  "Designed for",
  "Long-term vision",
] as const satisfies readonly CapabilityStatus[];

const collectStrings = (value: unknown, path = "root"): Array<{ path: string; value: string }> => {
  if (typeof value === "string") return [{ path, value }];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      key === "prohibitedClaims" ? [] : collectStrings(item, `${path}.${key}`),
    );
  }
  return [];
};

const expectUnique = (values: readonly string[], label: string) => {
  expect(new Set(values).size, `${label} must be unique`).toBe(values.length);
};

const expectSafeDestination = (href: string) => {
  expect(href.trim()).toBe(href);
  expect(href).not.toMatch(/^\/\//);
  expect(href).not.toMatch(/(?:^|\/)\.\.(?:\/|$)/);
  expect(href.toLowerCase()).not.toMatch(/^(?:javascript|data|vbscript):/);

  if (href.startsWith("/")) {
    expect(href).toMatch(/^\/(?:[a-z0-9-]+\/)*(?:#[a-z0-9-]+)?$/);
    return;
  }

  const url = new URL(href);
  expect(url.protocol).toBe("https:");
};

describe("authoritative Buckleson content contract", () => {
  it("exports the required typed public contract", () => {
    expectTypeOf(bucklesonSiteContent).toMatchTypeOf<SiteContent>();
    expectTypeOf<CompanyContent>().toMatchTypeOf<SiteContent["company"]>();
    expectTypeOf<NavigationItem>().toMatchTypeOf<SiteContent["navigation"][number]>();
    expectTypeOf<PageDefinition>().toMatchTypeOf<SiteContent["pages"][number]>();
    expectTypeOf<ProductContent>().toMatchTypeOf<SiteContent["products"][number]>();
    expectTypeOf<ServiceContent>().toMatchTypeOf<SiteContent["services"][number]>();
    expectTypeOf<RiskContent>().toMatchTypeOf<SiteContent["risks"][number]>();
    expectTypeOf<FaqItem>().toMatchTypeOf<SiteContent["faqs"][number]>();
    expectTypeOf<CapabilityStatus>().toEqualTypeOf<(typeof CAPABILITY_STATUSES)[number]>();
  });

  it("keeps the approved company identity, positioning, audiences, and CTA exact", () => {
    expect(bucklesonSiteContent.company.name).toBe("Buckleson");
    expect(bucklesonSiteContent.company.hero).toBe("We help you use AI safely.");
    expect(bucklesonSiteContent.company.positioning).toBe(
      "We secure how AI runs — not what AI thinks.",
    );
    expect(bucklesonSiteContent.company.supportingTitle).toBe(
      "A Trust & Execution Layer for AI Infrastructure.",
    );
    expect(bucklesonSiteContent.company.audiences).toEqual([
      "Companies",
      "Organizations",
      "Individual users",
    ]);
    expect(bucklesonSiteContent.company.calendarUrl).toBe(CALENDAR_URL);
    expect(bucklesonSiteContent.company.mission).toContain("use AI safely");
    expect(bucklesonSiteContent.company.vision).toContain("trusted AI execution");
    expect(bucklesonSiteContent.company.responsibility).toHaveLength(2);
  });

  it("defines the exact public navigation order and destinations", () => {
    expect(bucklesonSiteContent.navigation.map(({ label }) => label)).toEqual([
      "Home",
      "About",
      "Products",
      "Services",
      "Blog",
      "Contact Us",
    ]);
    expect(bucklesonSiteContent.navigation.map(({ href }) => href)).toEqual([
      "/",
      "/about/",
      "/products/",
      "/services/",
      "/blog/",
      CALENDAR_URL,
    ]);

    const destinations = bucklesonSiteContent.navigation.flatMap((item) => [
      item.href,
      ...(item.items?.map((child) => child.href) ?? []),
    ]);
    for (const href of destinations) expectSafeDestination(href);
  });

  it("defines valid, unique local page routes and metadata", () => {
    const routes = bucklesonSiteContent.pages.map(({ route }) => route);
    expect(routes).toEqual([
      "/",
      "/about/",
      "/products/",
      "/products/hyper-tern/",
      "/products/hyper-abs/",
      "/products/hyper-0x/",
      "/services/",
      "/blog/",
    ]);
    expectUnique(routes, "page routes");
    expectUnique(
      bucklesonSiteContent.pages.map(({ title }) => title),
      "page titles",
    );

    for (const page of bucklesonSiteContent.pages) {
      expectSafeDestination(page.route);
      expect(page.title.trim().length).toBeGreaterThan(0);
      expect(page.description.trim().length).toBeGreaterThan(0);
      expect(page.purpose.trim().length).toBeGreaterThan(0);
      expect(page.sections.length).toBeGreaterThan(0);
      expect(page.sections.every((section) => section.trim().length > 0)).toBe(true);
    }

    expect(routes).not.toContain("/contact/");
    expect(routes).not.toContain("/pricing/");
    expect(routes).not.toContain("/team/");
    expect(routes).not.toContain("/testimonials/");
    expect(routes).not.toContain("/case-studies/");
    expect(routes).not.toContain("/privacy/");
    expect(routes).not.toContain("/terms/");
  });

  it("keeps the product family exact, related, and within qualified boundaries", () => {
    expect(bucklesonSiteContent.products.map(({ name }) => name)).toEqual(PRODUCT_NAMES);
    expect(bucklesonSiteContent.products.map(({ slug }) => slug)).toEqual([
      "hyper-tern",
      "hyper-abs",
      "hyper-0x",
    ]);
    expect(bucklesonSiteContent.products.every(({ status }) => status === "Current capability")).toBe(
      true,
    );
    expectUnique(
      bucklesonSiteContent.products.map(({ slug }) => slug),
      "product slugs",
    );

    const canonicalRisks = new Set<string>(bucklesonSiteContent.risks.map(({ name }) => name));
    for (const product of bucklesonSiteContent.products) {
      expect(product.summary.trim().length).toBeGreaterThan(0);
      expect(product.problem.trim().length).toBeGreaterThan(0);
      expect(product.capabilities.length).toBeGreaterThan(0);
      expect(product.workflow).toHaveLength(4);
      expect(product.architecture).toHaveLength(4);
      expect(product.riskControls.length).toBeGreaterThan(0);
      for (const control of product.riskControls) {
        expect(canonicalRisks.has(control.risk), `${product.slug}: ${control.risk}`).toBe(true);
        expect(control.response.trim().length).toBeGreaterThan(0);
        expect(control.boundary.trim().length).toBeGreaterThan(0);
      }
    }

    expect(bucklesonSiteContent.products[0].designedFor).toBeUndefined();
    expect(bucklesonSiteContent.products[1].designedFor).toBeUndefined();
    expect(bucklesonSiteContent.products[2].designedFor).toEqual([
      "Quantum-resistant architecture and four-layer encryption",
      "EVM, Solana, and Sui interoperability",
      "Account abstraction and task side-chains",
      "High-velocity finality",
    ]);
    expect(JSON.stringify(bucklesonSiteContent.products)).not.toContain("Hyper Wallet");
  });

  it("keeps service names, slugs, related products, and secure-inference boundary exact", () => {
    expect(bucklesonSiteContent.services.map(({ name }) => name)).toEqual(SERVICE_NAMES);
    expect(bucklesonSiteContent.services.map(({ slug }) => slug)).toEqual([
      "ai-security",
      "secure-inference",
      "custom-ai",
    ]);
    expectUnique(
      bucklesonSiteContent.services.map(({ slug }) => slug),
      "service slugs",
    );

    const relatedProductNames = new Set<string>([
      ...PRODUCT_NAMES,
      "Buckleson platform controls",
    ]);
    for (const service of bucklesonSiteContent.services) {
      expect(service.deliverables.length).toBeGreaterThan(0);
      expect(service.relatedProducts.length).toBeGreaterThan(0);
      expect(service.relatedProducts.every((name) => relatedProductNames.has(name))).toBe(true);
      expect(service.boundary.trim().length).toBeGreaterThan(0);
    }

    const secureInference = bucklesonSiteContent.services.find(
      ({ slug }) => slug === "secure-inference",
    );
    expect(secureInference?.summary).toContain("around the inference path");
    expect(secureInference?.boundary).toBe(
      "This is protection around inference, not a claim of confidential computing or proof of model correctness.",
    );
  });

  it("keeps the approved risk inventory and all product relations resolvable", () => {
    expect(bucklesonSiteContent.risks.map(({ name }) => name)).toEqual(RISK_NAMES);
    expectUnique(
      bucklesonSiteContent.risks.map(({ name }) => name),
      "risk names",
    );
    const productSlugs = new Set(bucklesonSiteContent.products.map(({ slug }) => slug));
    for (const risk of bucklesonSiteContent.risks) {
      expect(risk.explanation.trim().length).toBeGreaterThan(0);
      expect(risk.relatedProducts.length).toBeGreaterThan(0);
      expectUnique(risk.relatedProducts, `${risk.name} product relations`);
      expect(risk.relatedProducts.every((slug) => productSlugs.has(slug))).toBe(true);
    }
  });

  it("separates current, pilot, designed-for, and vision states", () => {
    expect(bucklesonSiteContent.company.stages.map(({ status }) => status)).toEqual(
      CAPABILITY_STATUSES,
    );
    expectUnique(
      bucklesonSiteContent.company.stages.map(({ status }) => status),
      "company capability statuses",
    );
    expect(bucklesonSiteContent.company.stages.every(({ title, description }) =>
      title.trim().length > 0 && description.trim().length > 0,
    )).toBe(true);
  });

  it("contains the approved process, FAQ, industries, footer, and prohibition rules", () => {
    expect(bucklesonSiteContent.process.map(({ title }) => title)).toEqual([
      "Assess",
      "Protect",
      "Control",
      "Verify",
    ]);
    expect(bucklesonSiteContent.faqs).toHaveLength(6);
    expectUnique(
      bucklesonSiteContent.faqs.map(({ question }) => question),
      "FAQ questions",
    );
    expect(bucklesonSiteContent.industries).toHaveLength(6);
    expectUnique(bucklesonSiteContent.industries, "industries");
    expect(bucklesonSiteContent.footer.statement).toBe(
      "Trust and execution infrastructure for safer AI.",
    );
    expect(bucklesonSiteContent.prohibitedClaims).toEqual([
      "100% secure",
      "privacy guaranteed",
      "guaranteed safety",
      "guaranteed correctness",
      "detects every attack",
      "prevents every attack",
      "solves every OWASP risk",
      "confidential computing",
      "proves model truth",
    ]);
  });

  it("does not publish guarantees, fabricated evidence, or positive unsupported claims", () => {
    const strings = collectStrings(bucklesonSiteContent);
    const corpus = strings.map(({ value }) => value).join("\n");

    expect(corpus).not.toMatch(
      /100% secure|privacy guaranteed|guaranteed safety|guaranteed correctness|detects every attack|prevents every attack|solves every OWASP risk/i,
    );
    expect(corpus).not.toMatch(
      /(?:our|trusted) (?:customers?|clients?)|testimonial|revenue|funding|runway|certified|certification|deployed to|deployments? across|team member|pricing starts/i,
    );

    const confidentialComputing = strings.filter(({ value }) =>
      /confidential computing/i.test(value),
    );
    expect(confidentialComputing.length).toBeGreaterThan(0);
    for (const item of confidentialComputing) {
      expect(item.value, item.path).toMatch(/not (?:an? )?[^.]*confidential computing/i);
    }

    const modelTruth = strings.filter(({ value }) => /proves? model truth/i.test(value));
    expect(modelTruth.length).toBeGreaterThan(0);
    for (const item of modelTruth) {
      expect(item.value, item.path).toMatch(/does not [^.]*prove(?:s)? model truth/i);
    }
  });

  it("uses deterministic local literals without runtime or network dependencies", () => {
    const source = readFileSync(new URL("./buckleson-site-content.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/);
    expect(source).not.toMatch(/\bMath\.random\s*\(/);
    expect(source).not.toMatch(/\bDate\.(?:now|parse)\s*\(|\bnew\s+Date\s*\(/);
    expect(source).not.toMatch(/\b(?:window|document|localStorage|sessionStorage)\b/);
    expect(source).not.toMatch(/\bprocess\.env\b/);
    expect(JSON.stringify(bucklesonSiteContent)).toBe(JSON.stringify(bucklesonSiteContent));
  });

  it("returns only authoritative products and fails closed for an unknown slug", () => {
    expect(getProductBySlug("hyper-tern")?.name).toBe("Hyper Tern");
    expect(getProductBySlug("hyper-abs")?.name).toBe("Hyper-ABS");
    expect(getProductBySlug("hyper-0x")?.name).toBe("Hyper-0x");
    expect(getProductBySlug("unknown" as ProductContent["slug"])).toBeUndefined();
  });
});
