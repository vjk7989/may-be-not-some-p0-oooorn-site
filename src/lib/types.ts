export type CapabilityStatus =
  | "Current capability"
  | "Pilot stage"
  | "Designed for"
  | "Long-term vision";

export interface SiteConfig {
  name: string;
  description: string;
  siteUrl: string;
  calendarUrl: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: `https://${string}`;
}

export interface Product {
  name: string;
  slug: string;
  status: CapabilityStatus;
  summary: string;
  controls: string[];
  designedFor?: string[];
}

export interface Service {
  name: string;
  slug: string;
  summary: string;
  boundary: string;
  relatedProduct: string;
}

export interface RiskItem {
  name: string;
  category: "LLM" | "Agentic";
  explanation: string;
}

export interface ArticleMetadata {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  publishedAt: string;
  primaryKeyword: string;
  relatedTerms: string[];
  relatedHref: string;
}
