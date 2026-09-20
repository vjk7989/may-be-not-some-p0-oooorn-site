import sharp from "sharp";

const assets = [
  {
    source: "public/media/source/buckleson-execution-boundary.png",
    name: "buckleson-execution-boundary",
    widths: [960, 1586],
  },
  {
    source: "public/media/source/hyper-tern-boundary.png",
    name: "hyper-tern-boundary",
    widths: [768, 1536],
  },
  {
    source: "public/media/source/hyper-abs-chamber.png",
    name: "hyper-abs-chamber",
    widths: [768, 1536],
  },
  {
    source: "public/media/source/hyper-0x-evidence.png",
    name: "hyper-0x-evidence",
    widths: [768, 1536],
  },
];

await Promise.all(
  assets.flatMap(({ source, name, widths }) =>
    widths.flatMap((width) => [
      sharp(source)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: width > 1000 ? 82 : 78, effort: 6 })
        .toFile(`public/media/${name}-${width}.webp`),
      sharp(source)
        .resize({ width, withoutEnlargement: true })
        .avif({ quality: width > 1000 ? 62 : 58, effort: 6 })
        .toFile(`public/media/${name}-${width}.avif`),
    ]),
  ),
);
