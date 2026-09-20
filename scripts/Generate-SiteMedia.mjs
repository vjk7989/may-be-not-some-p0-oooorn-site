import sharp from "sharp";

const source = "public/media/source/buckleson-execution-boundary.png";

await Promise.all([
  sharp(source)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile("public/media/buckleson-execution-boundary-1600.webp"),
  sharp(source)
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile("public/media/buckleson-execution-boundary-960.webp"),
]);
