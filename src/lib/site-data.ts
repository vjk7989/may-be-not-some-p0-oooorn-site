import type {
  ArticleMetadata,
  NavItem,
  Product,
  RiskItem,
  Service,
  SiteConfig,
  SocialLink,
} from "@/lib/types";
import { bucklesonSiteContent } from "@/content/buckleson-site-content";

const configuredSiteUrl = process.env.SITE_URL?.replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

export function withBasePath(path: string) {
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    return path;
  }
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteConfig: SiteConfig = {
  name: bucklesonSiteContent.company.name,
  description: bucklesonSiteContent.company.description,
  siteUrl: configuredSiteUrl ?? "https://buckleson.example",
  calendarUrl: bucklesonSiteContent.company.calendarUrl,
};

export const isProductionSite = Boolean(configuredSiteUrl);

export const navigation: NavItem[] = bucklesonSiteContent.navigation.map(
  ({ label, href }) => ({ label, href }),
).filter(({ href }) => href.startsWith("/"));

export const socialLinks: SocialLink[] = [];

export const products: Product[] = bucklesonSiteContent.products.map(
  (product) => ({
    name: product.name,
    slug: product.slug,
    status: product.status,
    summary: product.summary,
    controls: [...product.capabilities],
    designedFor: product.designedFor ? [...product.designedFor] : undefined,
  }),
);

export const services: Service[] = bucklesonSiteContent.services.map(
  (service) => ({
    name: service.name,
    slug: service.slug,
    summary: service.summary,
    boundary: service.boundary,
    relatedProduct: service.relatedProducts.join(" and "),
  }),
);

export const risks: RiskItem[] = bucklesonSiteContent.risks
  .filter((risk) => risk.category !== "Operational")
  .map((risk) => ({
    name: risk.name,
    category: risk.category as RiskItem["category"],
    explanation: risk.explanation,
  }));

export const articleRegistry: ArticleMetadata[] = [
  {
    slug: "ai-agent-security",
    title: "AI Agent Security: A Practical Guide to Data, Tools, and Actions",
    seoTitle: "AI Agent Security Guide",
    description:
      "A practical guide to controlling the data, tools, permissions, and actions connected to enterprise AI agents.",
    publishedAt: "2026-09-16",
    primaryKeyword: "AI agent security",
    relatedTerms: ["agentic AI security", "AI agent controls"],
    relatedHref: "/services/#ai-security",
  },
  {
    slug: "prompt-injection-prevention",
    title: "Prompt Injection Prevention for AI Agents",
    seoTitle: "Prompt Injection Prevention for AI Agents",
    description:
      "Learn how layered controls can reduce prompt injection risk across agent data, tools, permissions, and actions.",
    publishedAt: "2026-09-16",
    primaryKeyword: "prompt injection prevention",
    relatedTerms: ["indirect prompt injection", "AI agent security"],
    relatedHref: "/services/#ai-security",
  },
  {
    slug: "secure-ai-inference",
    title: "Secure AI Inference: Protecting Data Around Model Execution",
    seoTitle: "Secure AI Inference Guide",
    description:
      "Understand secure AI inference as data protection and policy control around model execution and connected systems.",
    publishedAt: "2026-09-16",
    primaryKeyword: "secure AI inference",
    relatedTerms: ["AI inference security", "pre-inference data protection"],
    relatedHref: "/services/#secure-inference",
  },
  {
    slug: "llm-data-leakage",
    title: "LLM Data Leakage: How Sensitive Information Reaches AI Systems",
    seoTitle: "LLM Data Leakage Guide",
    description:
      "Map the common paths that expose sensitive information to LLMs and the controls that can reduce unnecessary access.",
    publishedAt: "2026-09-16",
    primaryKeyword: "LLM data leakage",
    relatedTerms: ["sensitive information disclosure", "AI data protection"],
    relatedHref: "/products/#hyper-abs",
  },
  {
    slug: "excessive-agency",
    title: "Excessive Agency: Applying Least Privilege to AI Agents",
    seoTitle: "Excessive Agency and Least Privilege",
    description:
      "Apply least privilege to AI identities, tools, resources, and actions to reduce the impact of excessive agency.",
    publishedAt: "2026-09-16",
    primaryKeyword: "excessive agency AI",
    relatedTerms: ["AI agent permissions", "least privilege AI"],
    relatedHref: "/products/#hyper-tern",
  },
  {
    slug: "ai-audit-trails",
    title: "AI Audit Trails for Agent Actions: What to Record and Why",
    seoTitle: "AI Audit Trails for Agent Actions",
    description:
      "Learn what an AI agent audit trail should preserve to support investigation, accountability, and operational review.",
    publishedAt: "2026-09-16",
    primaryKeyword: "AI audit trail",
    relatedTerms: ["AI agent auditability", "agent action logs"],
    relatedHref: "/products/#hyper-0x",
  },
];

export const industries = [...bucklesonSiteContent.industries];
