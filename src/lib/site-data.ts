import type {
  ArticleMetadata,
  NavItem,
  Product,
  RiskItem,
  Service,
  SiteConfig,
} from "@/lib/types";

const configuredSiteUrl = process.env.SITE_URL?.replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

export function withBasePath(path: string) {
  if (basePath && (path === basePath || path.startsWith(`${basePath}/`))) {
    return path;
  }
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export const siteConfig: SiteConfig = {
  name: "Buckleson",
  description:
    "A trust and execution layer that helps companies, organizations, and individual users use AI safely.",
  siteUrl: configuredSiteUrl ?? "https://buckleson.example",
  calendarUrl: "https://cal.com/buckleson-group/30min",
};

export const isProductionSite = Boolean(configuredSiteUrl);

export const navigation: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Services", href: "/services/" },
  { label: "Blog", href: "/blog/" },
];

export const products: Product[] = [
  {
    name: "Hyper Tern",
    slug: "hyper-tern",
    status: "Current capability",
    summary:
      "Mediates AI requests before execution so identities, permissions, tools, resources, and actions can be checked against policy.",
    controls: [
      "Approved model and request routing",
      "Identity, permission, and policy checks",
      "Tool and resource access boundaries",
      "Explicit limits for downstream actions",
    ],
  },
  {
    name: "Hyper-ABS",
    slug: "hyper-abs",
    status: "Current capability",
    summary:
      "Helps reduce unnecessary sensitive-data exposure before information reaches a model while retaining the context needed for an approved task.",
    controls: [
      "Masking and redaction",
      "Tokenization and abstraction",
      "Policy-aligned pre-inference transformation",
      "Controlled reconstruction at approved boundaries",
    ],
  },
  {
    name: "Hyper-0x",
    slug: "hyper-0x",
    status: "Current capability",
    summary:
      "Buckleson’s in-house blockchain for tamper-evident execution records, verification, audit, and settlement.",
    controls: [
      "Attributable execution evidence",
      "Tamper-evident event records",
      "Audit and settlement support",
      "Clear separation from model-output truth",
    ],
    designedFor: [
      "Quantum-resistant architecture and four-layer encryption",
      "EVM, Solana, and Sui interoperability",
      "Account abstraction and task side-chains",
      "High-velocity finality",
    ],
  },
];

export const services: Service[] = [
  {
    name: "AI Security",
    slug: "ai-security",
    summary:
      "Assess the data, permissions, tools, and actions around an AI workflow, then define practical control boundaries.",
    boundary:
      "Security controls help reduce risk; they do not guarantee that every attack or unsafe outcome is prevented.",
    relatedProduct: "Hyper Tern and Hyper-ABS",
  },
  {
    name: "Secure Inference",
    slug: "secure-inference",
    summary:
      "Protect and control information around the inference path through minimization, transformation, routing, and policy enforcement.",
    boundary:
      "This describes protection around inference. It is not a claim of confidential computing or proof of model correctness.",
    relatedProduct: "Hyper-ABS and Hyper Tern",
  },
  {
    name: "Custom AI",
    slug: "custom-ai",
    summary:
      "Provide custom AI model development and fine-tuning for defined business requirements while keeping deployment controls and evaluation criteria explicit.",
    boundary:
      "Model work is scoped to agreed requirements, data permissions, evaluation evidence, and deployment responsibilities.",
    relatedProduct: "Buckleson platform controls",
  },
];

export const risks: RiskItem[] = [
  {
    name: "Prompt Injection",
    category: "LLM",
    explanation:
      "Untrusted instructions attempt to redirect a model or agent away from the approved task.",
  },
  {
    name: "Sensitive Information Disclosure",
    category: "LLM",
    explanation:
      "Protected or unnecessary information reaches a model, response, tool, or destination.",
  },
  {
    name: "Excessive Agency",
    category: "LLM",
    explanation:
      "An agent receives more permissions, autonomy, or functionality than the task requires.",
  },
  {
    name: "Intent Breaking & Goal Manipulation (Agentic T6)",
    category: "Agentic",
    explanation:
      "The agent’s assigned purpose is altered or displaced during a workflow.",
  },
  {
    name: "Tool Misuse (Agentic T2)",
    category: "Agentic",
    explanation:
      "An agent invokes an available tool outside the intended policy or operating boundary.",
  },
  {
    name: "Memory Poisoning (Agentic T1)",
    category: "Agentic",
    explanation:
      "Untrusted information changes persistent context that can influence later decisions.",
  },
];

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

export const industries = [
  "Financial services",
  "Healthcare",
  "Government",
  "Enterprise software",
  "Manufacturing",
  "Professional services",
];
