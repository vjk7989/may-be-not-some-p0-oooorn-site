---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Labeled hero request-flow handoff

## Next-session focus

Finish the independent full regression gate for the labeled homepage request
flow. If it passes, complete visual review, refresh Graft, update durable records,
commit, push `main`, monitor GitHub Pages, and verify the deployed hero. If it
fails, stop and use an independent failure-analysis role before making the
smallest valid repair. Do not begin the deferred navbar expansion until this
hero refinement is deployed and verified.

## Current state

- The execution-sphere hero now replaces anonymous particles with three
  labeled, color- and text-distinguished request tokens: a known prompt-
  injection attack, an approved user request, and a deceptive input that is
  inspected before any detected harmful request is blocked. The approved
  request passes through the Buckleson boundary toward the selected outcome.
- The visualization uses aligned SVG motion paths, rounded lane geometry,
  blocked-token fragments, and a compact semantic flow summary. The fixed
  Buckleson logo, rotating boundary field, existing outcome controls, static
  first frame, reduced-motion behavior, and route-scoped Anime.js loading are
  preserved.
- Copy explicitly identifies the flow as illustrative and says detected
  harmful requests *can* be blocked. Preserve that qualification; the hero
  must not imply universal attack detection, guaranteed safety, or guaranteed
  privacy.
- Implementation and design details live in
  [`src/components/hero-execution-sphere.tsx`](../src/components/hero-execution-sphere.tsx),
  [`src/app/globals.css`](../src/app/globals.css),
  [`DESIGN.md`](../DESIGN.md), and the latest hero decision in
  [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md). The Anime.js
  import boundary is validated by
  [`tests/Validate-404Performance.ps1`](../tests/Validate-404Performance.ps1).
- The risk contract and executable coverage are in
  [`tests/HERO_TOKEN_FLOW_TEST_MATRIX.md`](../tests/HERO_TOKEN_FLOW_TEST_MATRIX.md)
  and
  [`tests/e2e/hero-token-flow.spec.ts`](../tests/e2e/hero-token-flow.spec.ts).
  Keep the existing execution-sphere contract in
  [`tests/HERO_EXECUTION_SPHERE_TEST_MATRIX.md`](../tests/HERO_EXECUTION_SPHERE_TEST_MATRIX.md)
  and its focused browser suite as regression coverage.

## Gate status

- The first combined focused hero run passed 37/38. Independent failure
  analysis classified the remaining no-JavaScript token-position failure as a
  production progressive-enhancement geometry defect.
- Deterministic SVG start transforms and the blocked-token destruction fade
  repaired that defect. Typecheck, lint, and static build now exit 0, and the
  combined focused hero suites pass 38/38.
- The independent full regression run is still in progress. The working tree
  is intentionally uncommitted and must not be pushed or described as released
  until the remaining applicable gates pass.
- The pre-existing mobile Lighthouse LCP median remains approximately
  2,825.15 ms against the 2,500 ms budget. Treat this as known debt and do not
  claim the performance gate is green unless a fresh three-run median proves
  it.

## Guardrails

- Follow the graph-first dependency DAG, YAGNI, workspace-storage, independent
  test-role, failure-analysis, Graft-refresh, and context-update rules in
  `AGENTS.md`.
- Preserve the official Buckleson asset hash, dimensions, proportions, and
  stationary presentation. Keep status meaning available through visible text
  and symbols rather than color alone.
- Retain exact token labels and deterministic state progression. Known attacks
  are visibly blocked before the aperture; approved requests pass; deceptive
  input changes to a detected/blocked state only when represented as detected.
- Preserve keyboard and touch controls, one selected outcome, reduced motion,
  no-JavaScript completeness, homepage-only animation loading, responsive
  containment, and no remote runtime assets.
- Do not add another animation dependency, WebGL, canvas, Three.js, cursor
  tracking, randomness, gradients, neon styling, or speculative abstractions.
- Keep unrelated homepage content, supporting routes, the animated 404, static
  export, and the deferred Cloudflare-inspired navbar work unchanged.

## Suggested skills

- `impeccable` — visually review hierarchy, token legibility, lane alignment,
  responsive composition, and motion restraint before release.
- `emil-design-eng` — polish state transitions and feedback only if regression
  evidence or user review identifies an interaction issue.
- `apple-design` — review physical motion and reduced-motion behavior if the
  timing or destruction effect needs refinement.
- `understand-anything:understand-diff` — map the final change blast radius
  before commit and deployment.
