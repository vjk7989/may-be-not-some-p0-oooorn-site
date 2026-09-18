---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Staggered navbar animation handoff

## Next-session focus

Review the slower letter-by-letter navbar roll with the user and continue only
with requested refinements. Keep the unboxed single-shell navigation decision
intact and treat the known Lighthouse LCP debt as separate scope.

## Current state

- Each desktop navigation label now rolls one character at a time in reading
  order. Character transforms run for 340ms with a deterministic 28ms delay
  between non-whitespace characters; spaces preserve the visible word gap but
  do not add an animation beat.
- The accessible-name boundary was corrected for the split-letter treatment:
  each link exposes one unsplit `.sr-only` label, while both animated character
  layers are `aria-hidden`. This avoids accessibility trees announcing words as
  separated letters.
- Reduced motion removes both transitions and per-character delays, hides the
  duplicate layer, and leaves one complete static visual label.
- D-037 in [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md) is the
  durable decision. The bounded acceptance contract is
  [`tests/GLASS_NAVBAR_TEST_MATRIX.md`](../tests/GLASS_NAVBAR_TEST_MATRIX.md).
  Use those artifacts and the current `git diff` for implementation detail.

## Changed files and repository state

- `src/components/site-header.tsx`
- `src/app/globals.css`
- `tests/e2e/production-website.spec.ts`
- `tests/GLASS_NAVBAR_TEST_MATRIX.md`
- `docs/architecture/DECISIONS.md`
- `docs/HANDOFF.md`

The work is currently uncommitted. No dependency, route, or runtime state was
added. Inspect the current diff before further edits; it is the authoritative
patch.

## Validation record

- Focused navbar coverage passes 35/35, including character ordering, exact
  accessible names, keyboard focus, reduced motion, responsive layouts, and
  no-JavaScript navigation.
- Independent full-suite validation is green: design lint, lint, typecheck,
  unit, build, content, links, SEO, E2E, Axe, and aggregate checks all passed.
  Playwright passed 48/48 and the dedicated Axe slice passed 11/11.
- Lighthouse remains non-green: the known mobile LCP is approximately 2.611
  seconds against the 2.5-second budget. This predates this animation change,
  remains separate performance debt, and must not be reported as passing.
- The workspace-owned static preview was stopped after validation and visual
  review; port 4173 was released.

## Suggested skills

- `impeccable` — evaluate visual rhythm, hierarchy, and accessibility of any
  requested navbar refinement.
- `emil-design-eng` — tune character staggering and interaction feedback while
  keeping motion restrained, interruptible, and CSS-only.
- `apple-design` — use only if a follow-up changes the outer glass material or
  the reduced-motion experience.

## Deferred work

- Commit and push only when explicitly requested after validation.
- Handle the mobile LCP budget as a separate optimization task using fresh
  three-run measurements and the existing 2.5-second threshold.
