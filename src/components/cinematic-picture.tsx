import { bucklesonSiteContent } from "@/content/buckleson-site-content";
import { withBasePath } from "@/lib/site-data";

export function CinematicPicture({ mediaId, className = "" }: { mediaId: string; className?: string }) {
  const media = bucklesonSiteContent.presentation.media.find((item) => item.id === mediaId);
  if (!media) return null;

  const avif = media.derivatives.filter((item) => item.format === "avif");
  const webp = media.derivatives.filter((item) => item.format === "webp");
  const fallback = webp.at(-1) ?? media.derivatives.at(-1);
  if (!fallback) return null;

  return (
    <picture className={`cinematic-picture ${className}`.trim()}>
      {avif.length ? <source type="image/avif" srcSet={avif.map((item) => `${withBasePath(item.src)} ${item.width}w`).join(", ")} sizes="(max-width: 48rem) 92vw, 50vw" /> : null}
      <source type="image/webp" srcSet={webp.map((item) => `${withBasePath(item.src)} ${item.width}w`).join(", ")} sizes="(max-width: 48rem) 92vw, 50vw" />
      <img src={withBasePath(fallback.src)} alt={media.decorative ? "" : media.alt} width={fallback.width} height={fallback.height} loading="lazy" decoding="async" />
    </picture>
  );
}
