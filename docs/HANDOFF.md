---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Buckleson GitHub Pages deployment handoff

## Next-session focus

First verify the GitHub Pages deployment end to end, including the workflow run,
the published URL, base-path assets and navigation, canonical metadata, and the
production smoke checks. Then ask the user which site section they want to work
on next; do not begin another visual, copy, structural, or dependency change
until they select it.

## Deployment state

- The intended GitHub repository and Pages target is
  `vjk7989/may-be-not-some-p0-oooorn-site` on branch `main`.
- The repository is configured for a static Next.js export under the project
  base path `/may-be-not-some-p0-oooorn-site`. The Pages workflow and base-path
  behavior are covered by
  [`tests/GITHUB_PAGES_TEST_MATRIX.md`](../tests/GITHUB_PAGES_TEST_MATRIX.md);
  use that artifact and the relevant entries in
  [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md) as the sources
  of truth rather than reconstructing their detail here.
- At the time this handoff was written, deployment work was still in progress.
  Do not report the site as live solely because local configuration, a commit,
  or a push exists. Confirm the remote commit, successful Pages workflow, and
  live URL before stating that deployment completed.
- The user explicitly authorized proceeding despite the Lighthouse LCP result
  of approximately 2.611 seconds exceeding the 2.5-second project threshold.
  Record this as a narrow, user-authorized deployment exception, not as a
  passing performance gate. All other relevant functional, accessibility,
  build, content, SEO, link, static-export, and GitHub Pages validation gates
  pass.

## Current implementation state

- The site is a statically exported Next.js App Router implementation using
  TypeScript, React Server Components, and Tailwind CSS v4.
- `PlatformShowcase` is implemented and its intended desktop/mobile,
  interaction, fallback, and accessibility behavior has been independently
  exercised. Its bounded acceptance record is
  [`tests/PLATFORM_PANELS_TEST_MATRIX.md`](../tests/PLATFORM_PANELS_TEST_MATRIX.md);
  consult that matrix instead of duplicating cases here.
- The established navbar, homepage, logo treatment, content, metadata, and
  static-export decisions remain documented in
  [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md). Relevant test
  matrices under [`tests`](../tests) remain the acceptance records.
- `SITE_URL` remains the build-time canonical-domain setting. During live
  verification, distinguish the GitHub Pages project URL from any future custom
  production-domain decision.

## Verification checklist

1. Confirm the `origin` remote resolves to the intended repository and `main`
   contains the deployment commit.
2. Confirm the GitHub Pages workflow completed successfully and note its exact
   run/result.
3. Open the live project URL and verify the homepage plus representative nested
   routes load without 404s, redirects to incorrect roots, or missing assets.
4. Run the deterministic GitHub Pages validation and the broader regression
   suite prescribed by `AGENTS.md`. Preserve exact commands, exit codes, and
   failures through the independent test-runner role.
5. Report Lighthouse LCP separately as the authorized exception; do not round
   it into compliance or weaken the threshold.
6. After deployment is verified, ask the user to select the next section and
   follow the repository's test-design, implementation, and independent
   test-runner workflow for that bounded change.

## Suggested skills

- `impeccable` — use for the next user-selected frontend critique or polish
  pass.
- `emil-design-eng` — use for interaction detail, hierarchy, and restrained UI
  refinement.
- `apple-design` — use if the selected section involves translucent materials,
  depth, motion, gestures, or reduced-motion behavior.

## Blockers and deferred decisions

- Deployment cannot be called complete until the remote workflow and live URL
  are verified.
- The next site section has not yet been selected by the user.
- A custom production domain remains a separate future decision; the current
  target is the GitHub Pages project site.
- Backend contact handling, CMS, analytics, authentication, payments, and
  runtime data fetching remain out of scope.
