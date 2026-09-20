import { withBasePath } from "@/lib/site-data";

export function BrandLogo({ light = false }: { light?: boolean; eager?: boolean }) {
  return (
    <a href={withBasePath("/")} className="brand-lockup" aria-label="Spartan home" data-light={light || undefined}>
      <span className="brand-mark" aria-hidden="true"><i /></span>
      <span>SPARTAN</span>
    </a>
  );
}
