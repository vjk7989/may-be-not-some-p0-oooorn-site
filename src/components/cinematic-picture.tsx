import { getMediaById } from "@/content/spartan-site-content";
import { withBasePath } from "@/lib/site-data";

export function CinematicPicture({
  mediaId,
  className = "",
  eager = false,
  sizes = "(max-width: 48rem) 94vw, 50vw",
}: {
  mediaId: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const media = getMediaById(mediaId);
  if (!media) return null;
  const avif = media.derivatives.filter((item) => item.format === "avif");
  const webp = media.derivatives.filter((item) => item.format === "webp");
  const fallback = webp.at(-1) ?? media.derivatives.at(-1);
  if (!fallback) return null;

  return (
    <picture className={`cinematic-picture ${className}`.trim()}>
      <source type="image/avif" srcSet={avif.map((item) => `${withBasePath(item.src)} ${item.width}w`).join(", ")} sizes={sizes} />
      <source type="image/webp" srcSet={webp.map((item) => `${withBasePath(item.src)} ${item.width}w`).join(", ")} sizes={sizes} />
      <img src={withBasePath(fallback.src)} alt={media.decorative ? "" : media.alt} width={fallback.width} height={fallback.height} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} decoding={eager ? "sync" : "async"} />
    </picture>
  );
}
