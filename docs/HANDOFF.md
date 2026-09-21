# Buckleson ScrewFast Astro handoff

## Current state

The repository root now contains the English-only ScrewFast Astro 7 template pinned to upstream commit `54d1daa00214deb5b97613d2a61cf9f997df2218`, rebranded and rewritten for Buckleson. The prior Next.js Spartan/component-lab implementation was removed from the active workspace under the user's explicit replacement authorization. ScrewFast's MIT license is retained, and upstream provenance is recorded in `README.md`.

The active surface contains the homepage, product index and four details, services, Blog and three posts, Insights and three entries, contact, eleven English Starlight documentation pages, custom 404, manifest, favicon, robots, and generated sitemap. No translated route or `/fr/` output remains.

Products are Hyper Tern, Hyper-ABS, Hyper-0x, and Hyper Wallet. Hyper Wallet is explicitly available now for agent identity, credentials, policy-bound permissions, and delegated approvals; the site states that it is not a digital-asset custody or payment product and does not guarantee secure outcomes. Forms are UI-only demonstrations. No authentication, database, payment, CMS, newsletter endpoint, or form endpoint was added.

All rendered product photography, logos, avatars, and partner/testimonial claims were replaced or removed. The site uses the byte-preserved Buckleson and Hyper-0x logos plus four approved cinematic images restored from commit `1e796f9`. Runtime page requests are local except for user-initiated external links.

## Deployment and architecture

`SITE_URL` and `BASE_PATH` drive canonical URLs, Open Graph data, schema, navigation, assets, robots, and sitemap generation. The GitHub Pages workflow tests a root build first, then creates and validates the deployable artifact for `https://vjk7989.github.io/may-be-not-some-p0-oooorn-site/`. A generated-output validator rejects internal root-relative links or assets that escape the manifest's configured base.

ScrewFast behavior remains: responsive mega-menu navigation, informational banner, theme persistence, tabs, FAQ disclosures, UI-only modals/forms, Lenis scrolling, GSAP product-detail motion, Starlight documentation, static generation, and trailing slashes. Light-theme accent shades were darkened only where the browser Axe gate found serious contrast failures.

Durable rationale and the current codebase map are recorded in `docs/architecture/DECISIONS.md` D-057. The independent risk matrix is `tests/BUCKLESON_SCREWFAST_TEST_MATRIX.md`.

## Validation state

Focused implementation gates have passed: source contract, Astro check/build, 27-route output validation, static smoke, Pages-base build, base-path output validation, formatting, and the full three-viewport Playwright suite. The browser suite executes 36 checks and intentionally skips 6 viewport-inapplicable cases; it covers representative marketing/product/article/docs/404 routes, responsive overflow, external runtime requests, theme, tabs, FAQ, modal lifecycle, mobile navigation, reduced motion, exact Hyper Wallet boundaries, and zero serious/critical Axe findings.

The independent final runner repeated all nine release gates with exit code `0`: `git diff --check`, source contract, formatting, root build, root output validation, 27-route smoke, Playwright, Pages-base build, and Pages output validation. Astro checked 121 files with 0 errors and 0 warnings (4 informational hints), generated 27 pages, and Playwright reported 36 passed, 6 intentionally skipped, and 0 failed.

Graft was refreshed with workspace-local cache/temp paths using `@nanonets/graft@0.18.0`. Its current graph contains 62 nodes, 106 edges, and 23 cards.

## Suggested skills

- `clone-website` for any later upstream ScrewFast parity review.
- `impeccable` for narrowly requested visual refinement.
- `understand-anything:understand-diff` for architectural review of future changes.

## Next steps

1. Deploy through the existing GitHub Pages workflow when the branch is ready.
2. If Buckleson supplies new approved copy or media, update the content/data boundary without adding unsupported product claims.
3. Keep new internal URLs routed through the base-path helpers and extend the deterministic contract when adding a route family.

## Guardrails

- Apply YAGNI: no speculative backend, account system, payment flow, CMS, analytics, or new product capability.
- Preserve the exact four product responsibilities and Hyper Wallet exclusions.
- Preserve English-only generation, local approved media, trailing slashes, and the GitHub Pages repository base.
- Run every npm/npx command through `scripts/Invoke-WorkspaceNodeTool.ps1`.
