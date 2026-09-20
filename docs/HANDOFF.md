---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Spinning execution sphere release handoff

## Next-session focus

Review the deployed homepage hero with the user, make only requested visual or
interaction refinements, then begin the previously deferred Cloudflare-inspired
navbar expansion as a separate graph-scoped task. Do not combine speculative
navbar changes with hero feedback.

## Current release state

- The homepage hero's right-side execution card has been replaced locally by an
  open Buckleson execution-sphere composition. Data, Identity, Tools, and
  Actions flow through rotating boundary layers to Protected context,
  Controlled action, and Execution evidence. The official Buckleson logo stays
  fixed above the moving SVG field.
- Protect data is initially selected. Pointer hover, keyboard focus, and button
  activation persistently select one outcome at a time. All stages remain
  present in server-rendered markup for no-JavaScript and assistive-technology
  use.
- Anime.js is loaded inside the hero client boundary only after hydration. The
  implementation skips motion for reduced-motion users and scopes cleanup to
  the component. Supporting routes remain outside this hero boundary.
- Production changes are limited to
  [`src/components/hero-execution-sphere.tsx`](../src/components/hero-execution-sphere.tsx),
  [`src/app/page.tsx`](../src/app/page.tsx), and
  [`src/app/globals.css`](../src/app/globals.css).
- The risk-based contract and focused browser coverage are maintained in
  [`tests/HERO_EXECUTION_SPHERE_TEST_MATRIX.md`](../tests/HERO_EXECUTION_SPHERE_TEST_MATRIX.md)
  and
  [`tests/e2e/hero-execution-sphere.spec.ts`](../tests/e2e/hero-execution-sphere.spec.ts).
  Use the latest hero-sphere decision in
  [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md) for rationale,
  constraints, and verified gate results rather than duplicating them here.
- The last known deployed baseline before this release is commit `ca390c4`. The
  current session owns final validation, commit, push, GitHub Pages monitoring,
  and live verification of the sphere before this handoff is considered
  release-complete.
- The existing Lighthouse LCP and dependency-audit findings remain separate
  accepted debt. Do not report either as resolved unless fresh evidence in the
  architecture record says otherwise, and do not use `npm audit fix --force`.

## Release completion sequence

1. Finish the independent focused and regression gates defined by the hero
   matrix, including reduced motion, no JavaScript, responsive containment,
   route isolation, brand integrity, accessibility, GitHub Pages mode, and
   performance measurement.
2. If a gate fails, use the required independent failure-analysis role and make
   the smallest valid repair before rerunning it.
3. Refresh Graft, commit the hero implementation, tests, architecture record,
   and this handoff, then push `main`.
4. Monitor the exact GitHub Pages run and verify the deployed commit SHA, hero
   content, stationary logo, rotating field, selected-state persistence,
   reduced-motion state, mobile layout, and absence of horizontal overflow.
5. Stop the local preview and leave the working tree clean.

## Post-deployment review

- Ask for feedback on the sphere's scale, spatial balance, rotation speed,
  input/output legibility, and control density before changing the approved
  hero copy or information architecture.
- Treat any accepted hero refinement as its own small dependency graph with
  focused tests before regressions.
- After the hero is accepted, scope the deferred navbar task from the existing
  shared-header decisions and navbar tests. Preserve the current true-centered
  primary navigation, separate Contact Us CTA, pointer corridor, route
  semantics, keyboard behavior, and mobile Sheet unless the user explicitly
  changes those requirements.

## Suggested skills

- `impeccable` — assess the deployed sphere's hierarchy, composition,
  responsiveness, and motion restraint before proposing refinements.
- `emil-design-eng` — tune hover, focus, selection, and animation feedback if
  the user requests interaction polish.
- `apple-design` — review physical motion, reduced-motion behavior, and
  interruptible state transitions when adjusting the sphere or navbar.
- `understand-anything:understand-diff` — map the blast radius of any follow-up
  hero or shared-header change before editing.

## Guardrails

- Follow the graph-first dependency-DAG, YAGNI, workspace-storage, independent
  test-role, Graft-refresh, and context-update rules in `AGENTS.md`.
- Keep the official Buckleson source asset unchanged in hash, dimensions, and
  proportions. Only boundary rings, paths, particles, and the aperture may
  move; the central logo must remain stationary and readable.
- Preserve exact product-claim boundaries. The visualization must not imply
  guaranteed safety, correctness, privacy, or universal approval.
- Do not add WebGL, canvas, Three.js, cursor tracking, randomness, gradients,
  neon styling, another animation dependency, or a generalized animation
  framework.
- Keep the existing left-side hero copy, CTA destinations, viewport-fit
  behavior, animated 404, static export, and supporting routes unchanged unless
  the user explicitly requests otherwise.
