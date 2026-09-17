import Image from "next/image";
import Link from "next/link";

import { withBasePath } from "@/lib/site-data";

export function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="brand-lockup"
      aria-label="Buckleson home"
      data-light={light || undefined}
    >
      <Image
        src={withBasePath("/brand/buckleson-logo.jpg")}
        width={322}
        height={308}
        alt=""
        className="brand-logo-image"
      />
      <span>BUCKLESON</span>
    </Link>
  );
}
