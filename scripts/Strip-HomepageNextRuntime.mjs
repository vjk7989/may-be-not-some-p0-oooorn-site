import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const homepagePath = path.join(process.cwd(), "out", "index.html");
const original = await readFile(homepagePath, "utf8");

const withoutChunkHints = original.replace(
  /<link\b(?=[^>]*\brel=["']modulepreload["'])(?=[^>]*\bhref=["'][^"']*\/_next\/static\/chunks\/[^"']+["'])[^>]*\/?>(?:<\/link>)?|<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']script["'])(?=[^>]*\bhref=["'][^"']*\/_next\/static\/chunks\/[^"']+["'])[^>]*\/?>(?:<\/link>)?/gi,
  "",
);

const withoutChunkScripts = withoutChunkHints.replace(
  /<script\b(?=[^>]*\bsrc=["'][^"']*\/_next\/static\/chunks\/[^"']+["'])[^>]*>\s*<\/script>/gi,
  "",
);

const transformed = withoutChunkScripts.replace(
  /<script\b[^>]*>\s*(?:\(self\.__next_f|self\.__next_f)[\s\S]*?<\/script>/gi,
  "",
);

if (transformed === original) {
  throw new Error(`No Next.js homepage runtime was removed from ${homepagePath}.`);
}

const hasChunkScript = /<script\b(?=[^>]*\bsrc=["'][^"']*\/_next\/static\/chunks\/[^"']+["'])[^>]*>/i.test(transformed);
const hasChunkModulePreload = /<link\b(?=[^>]*\brel=["']modulepreload["'])(?=[^>]*\bhref=["'][^"']*\/_next\/static\/chunks\/[^"']+["'])[^>]*>/i.test(transformed);
const hasChunkScriptPreload = /<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']script["'])(?=[^>]*\bhref=["'][^"']*\/_next\/static\/chunks\/[^"']+["'])[^>]*>/i.test(transformed);

if (hasChunkScript || hasChunkModulePreload || hasChunkScriptPreload || /self\.__next_f/.test(transformed)) {
  throw new Error(`Next.js homepage runtime remains in ${homepagePath}.`);
}

if (!/type=["']application\/ld\+json["']/.test(transformed) || !/type=["']module["']/.test(transformed)) {
  throw new Error(`Required JSON-LD or motion module script was removed from ${homepagePath}.`);
}

await writeFile(homepagePath, transformed, "utf8");
