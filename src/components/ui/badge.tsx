import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-[var(--radius-sm)] px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        current: "bg-[var(--verified-soft)] text-[var(--verified)]",
        designed: "bg-[var(--soft-violet)] text-[var(--primary-hover)]",
        neutral: "bg-[#e8e7eb] text-[#4f5059]",
        dark: "border border-white/20 bg-white/10 text-white",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
