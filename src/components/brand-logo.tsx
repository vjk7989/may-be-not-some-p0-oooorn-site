import Image from "next/image";
import Link from "next/link";

import { withBasePath } from "@/lib/site-data";

export function BrandLogo({
  light = false,
  eager = false,
}: {
  light?: boolean;
  eager?: boolean;
}) {
  return (
    <Link
      href="/"
      className="brand-lockup"
      aria-label="Buckleson home"
      data-light={light || undefined}
    >
      <Image
        src={withBasePath("/brand/buckleson-logo-display.webp")}
        width={128}
        height={122}
        alt=""
        className="brand-logo-image"
        decoding="async"
        loading={eager ? "eager" : "lazy"}
      />
      <span>BUCKLESON</span>
    </Link>
  );
}
