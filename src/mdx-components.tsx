import type { AnchorHTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

import { withBasePath } from "@/lib/site-data";

function MdxAnchor({ href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const resolvedHref =
    href?.startsWith("/") && !href.startsWith("//")
      ? withBasePath(href)
      : href;

  return <a href={resolvedHref} {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { a: MdxAnchor, ...components };
}
