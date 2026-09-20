import sharp from "sharp";

const assets = [
  {
    source: "public/media/source/spartan-signal-horizon.png",
    name: "spartan-signal-horizon",
    widths: [960, 1672],
    avifQualityByWidth: { 960: 44 },
  },
  {
    source: "public/media/source/spartan-frontier.png",
    name: "spartan-frontier",
    widths: [960, 1586],
  },
  {
    source: "public/media/source/spartan-gateway.png",
    name: "spartan-gateway",
    widths: [768, 1536],
  },
  {
    source: "public/media/source/spartan-neural-core.png",
    name: "spartan-neural-core",
    widths: [768, 1536],
  },
  {
    source: "public/media/source/spartan-evidence-grid.png",
    name: "spartan-evidence-grid",
    widths: [768, 1536],
  },
];

await Promise.all(
  assets.flatMap(({ source, name, widths, avifQualityByWidth = {} }) =>
    widths.flatMap((width) => [
      sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: width > 1000 ? 82 : 78, effort: 6 })
        .toFile(`public/media/${name}-${width}.webp`),
      sharp(source)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: avifQualityByWidth[width] ?? (width > 1000 ? 62 : 58), effort: 6 })
        .toFile(`public/media/${name}-${width}.avif`),
    ]),
  ),
);
