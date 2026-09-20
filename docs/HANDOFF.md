# Buckleson handoff

## Current state

The full-site cinematic rebuild is implemented in the working tree. The pre-rebuild recovery branch remains `codex/pre-spartan-rebuild` at `de245a4`. Use `src/content/buckleson-site-content.ts` as the authoritative source for company, navigation, products, services, risks, statuses, CTA, media references, homepage order, and prohibited claims.

The homepage now has fifteen ordered scenes and an eager cinematic hero extending behind the preserved sticky glass navbar. Its product rail contains exactly three equal desktop glass links and becomes horizontal scroll-snap on mobile. Original local Buckleson media is delivered as responsive AVIF/WebP; supporting routes and product tiles use lazy, dimensioned media. About, Products, all three product details, Services, Blog, articles, and the custom 404 retain the shared cinematic system and static export.

Implementation and rationale are recorded in `docs/architecture/DECISIONS.md` D-050. The independent contract is `tests/FULL_SITE_CINEMATIC_REBUILD_TEST_MATRIX.md`; inspect the current diff rather than duplicating it here.

## Validation

- Design lint, ESLint, typecheck, content, links, SEO, production build: passed.
- Unit tests: 22/22 passed.
- Focused cinematic browser tests: 7/7 passed.
- Full browser suite: 97/97 passed.
- Accessibility: 11/11 passed.
- Aggregate `npm run test`: passed.
- GitHub Pages deployment build and deterministic validator: passed.
- Lighthouse: Performance 94/95/95, Accessibility 100, Best Practices 96, SEO 100, CLS 0, TBT 110/69/72 ms. Selected simulated LCP is 2,921.59 ms and still fails the 2.5-second budget; do not report performance as fully passing.

## Next steps

1. Review the working-tree diff and refreshed Graft graph.
2. Commit and push the rebuild only after ensuring the deployment build remains the desired `out/` state.
3. Monitor GitHub Pages and verify all live routes plus the custom 404.
4. Treat closing the remaining modeled LCP debt as a separate measured header-hydration/performance task; do not hide the LCP candidate.

## Suggested skills

- `impeccable` for visual refinement and hierarchy review.
- `emil-design-eng` for interaction polish without expanding runtime scope.
- `apple-design` for motion and reduced-motion review.
- `understand-anything:understand-diff` before broad follow-up edits.

## Guardrails

- Preserve the exact navbar order, centered links, mega-menu behavior, violet Cal.com CTA, official brand files, qualified security claims, static export, and Pages base-path behavior.
- Do not add copied reference assets, fabricated customers, statistics, testimonials, team members, prices, certifications, deployment claims, or guarantees.
- Keep glass limited to the navbar and hero product rail. Keep social links hidden until supplied.
- Continue the graph-first DAG, YAGNI, workspace-only tools, independent test roles, and focused-gate workflow from `AGENTS.md`.
