# Spartan full-site rebuild test matrix

This contract defines the acceptance gates for the original Next.js recreation
of the Spartan reference. The implementation must remain a deterministic static
export, use rewritten neutral copy and local media, and send conversion traffic
only to the approved Cal.com destination.

## Canonical route contract

The site exports sixteen indexable routes: `/`, `/digital-brain/`, `/project/`,
five `/project/[slug]/` pages, `/about/`, `/articles/`, three
`/articles/[slug]/` pages, `/contact/`, and the two policy pages. It also exports
the custom `404.html`. Legacy `/products/`, `/services/`, and `/blog/` paths are
not generated and must resolve to the custom Spartan 404.

## Risk-based matrix

| Category | Validation | Acceptance |
| --- | --- | --- |
| Happy path | Render all canonical routes at desktop and mobile sizes | One visible H1 and main landmark, unique metadata, complete navigation, local media, and no console errors |
| Input boundaries | Validate exact route, project, and article cardinality; unique normalized slugs; safe URLs; media dimensions; and long copy at 320 px/200% text | Invalid, missing, duplicate, or dangling records fail deterministically; no overflow or clipped focus |
| Malformed or missing input | Exercise missing registry records, media paths, metadata, and relations | Tests fail closed with actionable diagnostics; pages never invent fallback claims or remote assets |
| State transitions | Desktop/mobile navigation, disclosures, rails, focus restoration, rapid input, and route transitions | ARIA state matches the visible state; latest input wins; no stuck overlays or lost focus |
| Animation lifecycle | Initial render, reduced motion, JS-disabled render, leave/back, resize, visibility changes, and unmount | Essential content is server rendered; Anime.js scopes clean up; no duplicate timelines, stale styles, or geometry-changing motion |
| Failure and recovery | Block media, disable JavaScript, request unknown and legacy paths, and run validators twice | Content and navigation remain usable; reserved media geometry is stable; custom 404 recovery works; validation is idempotent |
| Content and security | Scan source/output for Buckleson remnants, copied hosts/assets, unsafe URLs, fake social proof, forms, prices, guarantees, and remote executable resources | None present; visible project copy is neutral and fictional; the only external conversion destination is the approved Cal.com URL |
| Accessibility | Landmarks, heading order, keyboard/touch parity, focus, names/states, alt policy, contrast, reflow, reduced motion, and Axe | Zero serious/critical Axe violations and no content loss at target sizes |
| Performance | Three-run mobile Lighthouse cohort plus network/media inspection | Median Performance/Accessibility/Best Practices/SEO >= 95, LCP <= 2.5 s, CLS <= 0.10, TBT <= 200 ms |
| Deployment | Static export and GitHub Pages base-path validation across routes, assets, sitemap, robots, canonicals, fragments, and 404 | Every exported route and local asset resolves with no missing or double prefix |

## Applicability

- Multi-user/server concurrency is not applicable because the output is static;
  rapid overlapping client input remains covered.
- Business-time behavior is not applicable; animation settlement and hidden-tab
  lifecycle are covered without frame-exact sleeps.
- Randomness is prohibited for public ordering, identifiers, copy, and initial
  states.
- Authentication, persistence, payments, CMS, form submission, and newsletter
  delivery are not in scope.
- External-service recovery is not applicable; tests verify the Cal.com URL
  without activating or depending on the service.

## Focused assertions

- The registry contains exactly five project slugs and three article slugs in a
  deterministic order, and every index card resolves to one detail record.
- Navigation exposes Home, Digital Brain, Projects, About, Articles, and
  Contact; the footer also exposes both policy routes.
- No public string or metadata contains Buckleson product names, named clients,
  testimonial identities, prices, certifications, percentages, multipliers,
  fundraising/ROI claims, deployment counts, uptime/latency guarantees, or
  template-purchase language.
- No runtime request targets Spartan, Framer, Framerusercontent, Contra, Delani,
  or another reference CDN.
- `/contact/` contains no form, newsletter field, mailto link, or submission
  handler; its conversion action uses only the approved Cal.com URL.
- Unknown paths and every removed Buckleson route render the custom Spartan 404
  with a working home recovery link and `noindex` metadata.
- Screenshots at 1440x900, 390x844, and 844x390 are reviewed for the reference's
  density, type scale, alternating scene rhythm, cards, and restrained motion;
  pixel identity and copied artwork are explicitly not required.

## Execution gates

Run design lint, ESLint, TypeScript, unit/content/link/SEO/404 validation,
production build, focused and full Playwright, Axe, GitHub Pages validation,
the aggregate test command, Lighthouse, and `git diff --check`. Every applicable
gate must exit zero. A separate test-runner agent records exact commands, exit
codes, retries, and failures. Any failure is independently classified before
the smallest valid repair; assertions are not weakened to obtain a pass.
