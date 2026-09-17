import { Badge } from "@/components/ui/badge";
import type { CapabilityStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: CapabilityStatus }) {
  const variant =
    status === "Current capability"
      ? "current"
      : status === "Designed for"
        ? "designed"
        : "neutral";

  return <Badge variant={variant}>{status}</Badge>;
}
