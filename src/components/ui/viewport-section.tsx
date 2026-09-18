import * as React from "react";

import { cn } from "@/lib/utils";

export function ViewportSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-viewport-section=""
      className={cn("viewport-section", className)}
      {...props}
    />
  );
}
