declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { ArticleMetadata } from "@/lib/types";

  export const articleMetadata: ArticleMetadata;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
