# Spartan one-to-one replica handoff

## Current state

The earlier inspired/neutral-content build has been superseded. The application now follows the public Spartan reference as-is across the 16-route static information architecture: floating navigation, homepage scene order, metrics, five projects, capabilities, vision, testimonial rail, film scene, four-step process, team profiles, four pricing tiers with monthly/annual state, seven FAQs, insight cards, template CTA, newsletter/social footer, Digital Brain, indexes/details, About, Contact, policies, and custom 404.

Public reference media and fonts required for visual parity are frozen in `public/spartan-reference/`. Runtime pages do not request Spartan, Framer, or Framerusercontent resources. Internal URLs remain trailing-slash and GitHub-Pages-base-path safe. The homepage is server rendered; local Anime.js enhances entrances and the pricing, capability, process, carousel, and FAQ controls while reduced-motion and no-JavaScript users retain the complete content.

Durable rationale is recorded in `docs/architecture/DECISIONS.md` D-054. `DESIGN.md` and `PRODUCT.md` describe the replica contract.

## Validation state

Independent release verification passed: design lint (0 errors), ESLint, TypeScript, production validation across all 16 routes, 6/6 Vitest cases, 11/11 Playwright tests with zero retries, accessibility across the representative route families, GitHub Pages base-path build (20 static pages), and `git diff --check`. Valid accessibility failures found during the pass were independently analyzed and fixed without weakening assertions.

## Next steps

1. Commit, push `main`, monitor GitHub Pages, and verify every live route and local asset.
2. Use the user’s subsequent feedback for visual deltas; do not revert to neutral or inspired content unless explicitly requested.

## Suggested skills

- `impeccable` for screenshot-led typography, spacing, and motion refinement.
- `understand-anything:understand-diff` for a later architectural review.

## Guardrails

- Preserve YAGNI: no CMS, auth, database, analytics, or submission backend.
- Keep the local frozen-asset boundary and static export.
- Preserve the standalone homepage interaction module unless the postbuild runtime-stripping decision is revised.
