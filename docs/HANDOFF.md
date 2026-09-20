---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

# Buckleson rebuild handoff

## Next-session focus

Commit and push the completed Buckleson rebuild, monitor GitHub Pages, verify
the live routes against the pushed SHA, and then review the deployed experience
with the user. Preserve the approved content boundaries and treat each
follow-up as a small graph-scoped task rather than reopening the whole design
system.

## Current status

- The recoverable pre-rebuild site is preserved on branch
  `codex/pre-spartan-rebuild` at commit `de245a4`.
- The authoritative typed content contract was committed to `main` at
  `9ea8efd`. Use
  [`src/content/buckleson-site-content.ts`](../src/content/buckleson-site-content.ts)
  as the source of company, navigation, page, product, service, risk, FAQ, CTA,
  status, and prohibited-claim data.
- The working tree contains the completed Buckleson rebuild: new homepage
  presentation, shared navigation updates, product bento, original generated
  responsive hero media, product detail routes, and refreshed About, Services,
  Products, Blog, sitemap, styles, and validation coverage. Inspect the current
  Git diff for the exact file set and implementation rather than relying on
  this summary.
- Superseded hero, platform, risk-landscape components and presentation-only
  tests are removed in the working tree. Reusable accessibility utilities,
  static-export configuration, local fonts, shadcn primitives, Anime.js,
  existing articles, official brand assets, and the custom 404 remain part of
  the project.
- The generated hero source and its 960/1600 WebP derivatives live under
  [`public/media`](../public/media). `CinematicHero` is a static Server
  Component whose native `<picture>` keeps the mobile derivative and fallback
  eagerly discoverable with high fetch priority, synchronous decoding, and
  intrinsic dimensions. Its restrained product-spotlight drift is CSS-only;
  reduced motion is static. Anime.js remains route-scoped to the custom 404.
  Keep the official Buckleson and Hyper-0x source artwork unchanged.
- The independent rebuild validation contract is in
  [`tests/BUCKLESON_REBUILD_TEST_MATRIX.md`](../tests/BUCKLESON_REBUILD_TEST_MATRIX.md).
  Focused rebuild coverage passes 18/18, accessibility passes 11/11, and the
  preceding full E2E regression passes 90/90. The GitHub Pages validator also
  passed before final publication.
- The latest three-run Lighthouse cohort scored Performance 95/95/94,
  Accessibility 100, Best Practices 96, and SEO 100. CLS is 0 and TBT is 42
  ms. The simulated median LCP is 2,974.93 ms, so the 2,500 ms threshold still
  fails and must not be claimed as passing. Raw browser LCP samples are
  313–344 ms. A further modeled-LCP repair requires a larger shared-header
  hydration redesign; this remains recorded debt in D-049.
- GitHub push, Pages deployment monitoring, and live-route verification are
  still pending. Do not claim the rebuild is deployed until the pushed commit
  SHA and successful Pages run are verified against the live site.

## Sources of truth

- Read [`docs/architecture/DECISIONS.md`](architecture/DECISIONS.md) for design
  decisions, constraints, consequences, implementation notes, and the current
  codebase map.
- Read
  [`tests/BUCKLESON_REBUILD_TEST_MATRIX.md`](../tests/BUCKLESON_REBUILD_TEST_MATRIX.md)
  for acceptance coverage and explicit not-applicable categories.
- Read
  [`src/content/buckleson-site-content.ts`](../src/content/buckleson-site-content.ts)
  for approved content and claim boundaries.
- Use `git diff` and `git status --short` for the exact uncommitted rebuild
  state. Do not duplicate the architecture record, test matrix, or diff here.

## Completion sequence

1. Refresh Graft, run the final deterministic documentation/diff checks, and
   confirm no unrelated artifact remains in the working tree.
2. Commit the completed rebuild and push `main`.
3. Monitor GitHub Pages and verify the homepage, About, Products, three product
   details, Services, Blog/articles, and an unknown nested 404 against the
   pushed SHA. Do not represent Lighthouse LCP as passing.
4. If publication or live verification fails, use an independent
   failure-analysis role, apply the smallest valid repair, rerun the affected
   gate, and redeploy.
5. Review the live result with the user. Limit the next edit to their requested
   refinement and preserve qualified security language.

## Suggested skills

- `impeccable` — audit hierarchy, editorial rhythm, bento composition,
  responsiveness, and visual consistency during post-deployment review.
- `emil-design-eng` — refine hover, focus, accordion, rail, and mega-menu motion
  without adding unnecessary interaction machinery.
- `apple-design` — assess the physical feel, interruption behavior, and
  reduced-motion fallbacks of cinematic and navigation transitions.
- `understand-anything:understand-diff` — map the blast radius and regressions
  of requested follow-up changes before editing.

## Guardrails

- Follow the graph-first dependency DAG, YAGNI, workspace-only storage,
  independent test roles, Graft refresh, and documentation rules in
  `AGENTS.md`.
- Preserve the navbar order `Home · About · Products · Services · Blog ·
  Contact Us`, centered primary links, mega-menu pointer corridor, keyboard and
  touch behavior, and the violet Cal.com CTA unless the user explicitly asks
  to change them.
- Do not introduce copied reference assets, fabricated clients, testimonials,
  team members, prices, certifications, deployments, or unsupported
  performance claims.
- Do not publish guarantees of safety, privacy, universal attack detection,
  model-truth verification, or confidential computing.
- Keep social navigation hidden until real links are supplied.
- Keep static export and GitHub Pages base-path behavior intact. Do not add a
  CMS, database, authentication, analytics, newsletter backend, pricing
  system, contact-form backend, or another animation framework.
