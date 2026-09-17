---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Electric-violet navbar handoff

## Next-session focus

Review the implemented shared navbar with the user and make only requested
visual or interaction refinements. Then decide explicitly whether the
pre-existing Lighthouse LCP debt should become a separate performance task;
do not treat that debt as part of the completed navbar interaction.

## Current state

- The shared desktop and mobile navigation now uses compact, moderately
  rounded cells with an electric-violet fill, vertically rolling duplicate
  label, press feedback, and a violet-invariant current-page state.
- Navigation order, routes, the mobile Sheet, Contact Us destination,
  no-JavaScript recovery, focus behavior, reduced-motion handling, glass
  fallbacks, and GitHub Pages static-export compatibility are preserved.
- The durable decision and implementation constraints are recorded in D-035
  in [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md). The bounded
  acceptance contract is
  [`tests/GLASS_NAVBAR_TEST_MATRIX.md`](../tests/GLASS_NAVBAR_TEST_MATRIX.md).
  Use those artifacts and the current `git diff` rather than reconstructing
  implementation detail here.

## Changed files

- `src/components/site-header.tsx`
- `src/app/globals.css`
- `tests/e2e/production-website.spec.ts`
- `tests/GLASS_NAVBAR_TEST_MATRIX.md`
- `docs/architecture/DECISIONS.md`
- `docs/HANDOFF.md`

The changes are currently uncommitted. Inspect `git diff` for the authoritative
patch before further edits.

## Validation record

- Functional validation is green: design lint, lint, typecheck, unit, build,
  content, links, and SEO checks pass.
- Focused navbar Playwright coverage passes 34/34; combined E2E passes 47/47;
  the dedicated Axe slice passes 11/11.
- Lighthouse is not green. All configured Lighthouse budgets pass except the
  mobile LCP budget: the current median is approximately 2.611 seconds against
  the 2.5-second limit. This matches the pre-existing D-033 baseline and must
  not be reported as a passing performance gate.
- A `preload: false` experiment worsened the Lighthouse median to approximately
  2.835 seconds and was reverted. Do not reintroduce it without new evidence.
- Browser checks must run against a freshly started static preview after the
  latest build. A previously running server can retain stale exported files or
  occupy the expected port and produce misleading failures or measurements.

## Suggested skills

- `impeccable` — review the navbar’s hierarchy, polish, responsive behavior,
  and accessibility before making any user-requested refinement.
- `emil-design-eng` — refine hover, focus, press, and label-roll motion without
  adding a dependency or ornamental motion.
- `apple-design` — use only if further work changes the glass material, depth,
  or reduced-motion behavior.

## Deferred decision

- The only known non-green gate is the pre-existing mobile LCP budget. Treat a
  new optimization pass as separate scope, preserve the 2.5-second threshold,
  and compare any experiment with fresh-server three-run medians.
