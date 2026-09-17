---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Buckleson GitHub Pages deployment handoff

## Next-session focus

The GitHub Pages deployment is complete and verified. Ask the user which site
section they want to work on next; do not begin another visual, copy,
structural, or dependency change until they select it.

## Deployment state

- The repository is
  <https://github.com/vjk7989/may-be-not-some-p0-oooorn-site> on branch `main`.
  The verified live site is
  <https://vjk7989.github.io/may-be-not-some-p0-oooorn-site/>.
- GitHub Actions run
  <https://github.com/vjk7989/may-be-not-some-p0-oooorn-site/actions/runs/35265549056>
  completed successfully. At verification time, the deployed code SHA was
  `b4c8d87a70261abee8d391a5e4f1e25474d70902`.
- The repository is configured for a static Next.js export under the project
  base path `/may-be-not-some-p0-oooorn-site`. The Pages workflow and base-path
  behavior are covered by
  [`tests/GITHUB_PAGES_TEST_MATRIX.md`](../tests/GITHUB_PAGES_TEST_MATRIX.md);
  use that artifact and the relevant entries in
  [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md) as the sources
  of truth rather than reconstructing their detail here.
- GitHub Pages had to be enabled once for the repository before the workflow
  could publish. The workspace Node-tool wrapper also required a Linux scalar
  handling fix for the Actions runner. Preserve both pieces of deployment
  context when diagnosing future publishing failures.
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

## Deployment verification record

- The `main` deployment commit, successful workflow run, live project URL,
  base-path routing, and published assets were verified.
- The deterministic GitHub Pages validation and broader regression gates pass,
  except for the separately authorized Lighthouse LCP exception. Do not round
  that measurement into compliance or weaken its threshold.
- For the next user-selected section, follow the repository's independent test
  design, bounded implementation, test-runner, architecture-record, and handoff
  workflow.

## Suggested skills

- `impeccable` — use for the next user-selected frontend critique or polish
  pass.
- `emil-design-eng` — use for interaction detail, hierarchy, and restrained UI
  refinement.
- `apple-design` — use if the selected section involves translucent materials,
  depth, motion, gestures, or reduced-motion behavior.

## Blockers and deferred decisions

- The next site section has not yet been selected by the user.
- A custom production domain remains a separate future decision; the current
  target is the GitHub Pages project site.
- Backend contact handling, CMS, analytics, authentication, payments, and
  runtime data fetching remain out of scope.
