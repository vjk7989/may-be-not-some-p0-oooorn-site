# Spartan full-site rebuild handoff

## Current state

The active application is the completed Spartan-branded static Next.js rebuild. `src/content/spartan-site-content.ts` is the authoritative contract for all public copy, navigation, five project concepts, three rewritten articles, engagements, FAQs, and local media. The route inventory contains sixteen indexable pages plus the custom 404; legacy Products, Services, and Blog routes are intentionally absent.

The implementation recreates the observed reference silhouette with original copy and local media. It does not copy Framer source, protected images, logos, testimonials, customers, metrics, prices, or certifications. Contact conversion is limited to the approved Cal.com URL. Durable rationale is recorded in `docs/architecture/DECISIONS.md` D-051; acceptance scope is in `tests/SPARTAN_FULL_SITE_TEST_MATRIX.md`.

The first frame is server-rendered and usable without JavaScript. Native disclosures and a native mobile popover avoid initial hydration. Anime.js is vendored locally and imported only after scroll, pointer, or keyboard input; reduced-motion users bypass it and pagehide cleanup reverts the scope. Local responsive AVIF/WebP media has intrinsic dimensions. Production CSS is inlined and below-fold homepage sections use `content-visibility:auto` to satisfy the measured first-load budget.

## Validation

- ESLint, TypeScript, static export, typed-content tests, deterministic production validation, and 10/10 browser tests pass.
- Browser coverage includes all route families, mobile menu focus restoration, FAQ state, legacy/custom 404s, no-JavaScript content, reduced motion, eight viewport sizes, no horizontal overflow, local-only requests, and zero serious/critical Axe violations.
- The final three-sample Lighthouse cohort passes Performance, Accessibility, Best Practices, and SEO ≥95; LCP ≤2.5 seconds; CLS ≤0.10; TBT ≤200 ms.
- The independent runner passed every executable gate; its only failure was three extra EOF blank lines, which were removed. The focused `git diff --check`, lint, and typecheck rerun passed. The production base-path build and `tests/Validate-GitHubPages.ps1` also pass for all sixteen routes.
- Commit `73f5817` was pushed to `main`; GitHub Pages workflow run `35511679251` completed successfully.
- Live verification passed for all sixteen sitemap routes, nineteen unique internal links, fragment targets, canonical metadata, sitemap, robots, favicon, Anime.js, responsive media, and the nested custom 404. Legacy Products, Services, and Blog routes return 404, and production HTML contains no Spartan/Framer/Contra resource URLs.

## Next steps

The requested rebuild, validation, deployment, and live verification are complete. Future work should begin only from a new user requirement or a measured regression.

## Suggested skills

- `impeccable` for any future visual critique without expanding product scope.
- `understand-anything:understand-diff` for a later architectural review.

## Guardrails

- Preserve YAGNI: no CMS, auth, persistence, form backend, newsletter, analytics, redirects, fake success state, pricing logic, or speculative compatibility layer.
- Keep public assets local and base-path safe. Do not reintroduce reference-host requests or unsupported claims.
- Keep the server-first/no-hydration homepage boundary unless a measured regression justifies revisiting it.
