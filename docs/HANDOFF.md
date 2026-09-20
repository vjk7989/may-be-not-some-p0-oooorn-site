# Spartan high-fidelity homepage handoff

## Current state

The Spartan-branded static Next.js application now has a substantially closer observation-based homepage: framed cinematic hero, qualitative proof mosaic, oversized works grid, dark capabilities system, horizontal experience principles, film reveal, process sequence, practice cards, engagement tiers, FAQ, insights, and dense footer. The original generated signal-horizon scene is registered in the typed media contract and exported as responsive AVIF/WebP. Durable rationale is in `docs/architecture/DECISIONS.md` D-051 and D-052.

The complete route surface remains sixteen indexable pages plus the custom 404. `src/content/spartan-site-content.ts` remains the authoritative content and media contract. Copy, code, logo, project art, and the new hero are independently authored; no Framer source, protected media, customer marks, testimonials, prices, certifications, or unsupported performance claims are used.

The first frame is server-rendered and usable without JavaScript. Anime.js remains local, interaction-gated, reduced-motion aware, and reverted on pagehide. Native disclosures and the mobile popover remain functional without speculative application state. Deferred rendering is scoped to the heaviest later homepage sections with intrinsic-size fallbacks, and responsive lazy media remains in place.

The homepage-only postbuild transform removes unused Next JavaScript chunks and flight payloads while retaining inline critical CSS, JSON-LD, and the SpartanMotion module. This is intentionally limited to the current server-only homepage; revisit it before adding any homepage client component.

## Validation

- Independent release validation passes with no retries: design lint, ESLint, TypeScript, production content/unit tests (16 routes and 6 Vitest cases), animated 404 validation, Playwright (10/10), focused accessibility (1/1), default export, GitHub Pages base-path export, and Pages validation (16 routes).
- Three independent mobile Lighthouse samples pass every budget: Performance 100, Accessibility 96, Best Practices 100, SEO 100, median LCP 1,210.29 ms, CLS 0, and TBT 0 ms.
- Desktop and mobile browser coverage confirms the reference-aligned hero, semantic section order, native navigation/disclosures, reduced motion, no-JavaScript behavior, local-only resources, and custom 404.

## Next steps

Refresh Graft, commit and push `main`, monitor the Pages workflow, then verify every live route, asset, fragment, canonical, sitemap, robots, favicon, and nested 404.

## Suggested skills

- `impeccable` for future visual refinement while preserving the current design language.
- `understand-anything:understand-diff` for a later architectural review.

## Guardrails

- Preserve YAGNI: no CMS, auth, persistence, form backend, newsletter, analytics, redirects, fake success state, pricing logic, or speculative compatibility layer.
- Keep public assets local and base-path safe. Do not reintroduce reference-host requests or unsupported claims.
- Keep the server-first homepage boundary and scoped Anime.js island unless measured evidence justifies changing it.
