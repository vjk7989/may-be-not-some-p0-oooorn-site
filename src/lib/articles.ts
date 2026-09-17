import type { ComponentType } from "react";

import type { ArticleMetadata } from "@/lib/types";

export interface ArticleModule {
  default: ComponentType;
  articleMetadata: ArticleMetadata;
}

export const articleLoaders: Record<string, () => Promise<ArticleModule>> = {
  "ai-agent-security": () => import("@/content/articles/ai-agent-security.mdx"),
  "prompt-injection-prevention": () => import("@/content/articles/prompt-injection-prevention.mdx"),
  "secure-ai-inference": () => import("@/content/articles/secure-ai-inference.mdx"),
  "llm-data-leakage": () => import("@/content/articles/llm-data-leakage.mdx"),
  "excessive-agency": () => import("@/content/articles/excessive-agency.mdx"),
  "ai-audit-trails": () => import("@/content/articles/ai-audit-trails.mdx"),
};
