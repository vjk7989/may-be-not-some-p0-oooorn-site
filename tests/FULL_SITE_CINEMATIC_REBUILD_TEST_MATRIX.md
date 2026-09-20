# Full-site Buckleson cinematic rebuild test matrix

## Acceptance contract

This matrix governs the approved full-site cinematic rebuild. It supplements
the existing production, navigation, 404, GitHub Pages, accessibility, and
performance contracts; it does not relax them. Tests must derive expected
company, route, product, service, risk, status, CTA, and claim-boundary values
from `src/content/buckleson-site-content.ts` rather than duplicating a second
content source.

The implementation gate is ordered:

1. Typed presentation data and its unit/static validation pass.
2. Shared hero, navbar integration, media rules, and product glass rail pass.
3. Homepage sections pass before supporting-route visual-system checks begin.
4. Every route and interaction passes focused browser checks.
5. The existing full regression, accessibility, static-export, GitHub Pages,
   and three-run Lighthouse gates pass before publication.

## Risk-based matrix

| Category | Scenario | Deterministic check | Acceptance criterion |
| --- | --- | --- | --- |
| Happy path | Authoritative presentation data | Typecheck and unit-test `MediaAsset`, `HomepageSection`, and `EngagementPath`, plus optional page/product media references | Presentation data is typed, local, unique, deterministic, and remains subordinate to the existing authoritative company/content contract |
| Happy path | Hero and navbar integration | Render `/` at desktop and inspect the header and hero geometry | Hero media begins at the top of the page and continues behind the inset translucent navbar; no white band or independent header backdrop remains above the image |
| Happy path | Desktop glass product rail | Inspect the hero rail at 1024, 1366, 1440, and 1920 CSS pixels | Exactly three equal adjacent boxes appear in canonical order: Hyper Tern, Hyper-ABS, Hyper-0x; each exposes name, approved one-line role, status, and a working directional detail link |
| Happy path | Mobile product rail | Inspect the hero rail at 320 and 390 CSS pixels and operate it by touch and keyboard | Cards remain readable, use horizontal scroll snapping, preserve canonical order, and expose all content without compressing into three narrow columns |
| Happy path | Full homepage rhythm | Assert ordered semantic sections and their key headings/content | Hero, responsibilities, product work, capabilities, mission/vision, Hyper-0x band, risks, protection narrative, process, principles, engagement paths, FAQ, insights, CTA, and footer occur once in the approved order |
| Happy path | Route-wide system | Visit Home, About, Products, all three product details, Services, Blog, every article, and a missing path | Each route retains its unique purpose and one H1 while sharing the approved typography, spacing, cinematic media treatment, navigation, CTA language, and footer system; 404 remains custom and `noindex` |
| Happy path | Truthful section substitutions | Inspect visible headings and body copy for reference-role replacements | Responsibilities replace statistics; products replace client projects; risks replace testimonials; principles replace team; non-priced engagement paths replace pricing; no empty or invented proof section is shipped |
| Content boundary | Exact navigation and conversion | Compare rendered navigation with authoritative data | Order is Home, About, Products, Services, Blog, Contact Us; Contact Us stays a violet outlined oval and opens the exact Cal.com URL in the same tab |
| Content boundary | Product responsibility mapping | Compare hero rail, product overview, and detail routes with authoritative products | Hyper Tern controls execution, Hyper-ABS reduces pre-inference exposure, and Hyper-0x supports evidence, verification, audit, and settlement; statuses and detail destinations are exact |
| Content boundary | Claim safety | Scan source content and visible output with negation-aware rules | No guarantees of safety/privacy/correctness, universal detection or prevention, model-truth proof, unsupported confidential computing, fabricated clients/statistics/testimonials/team/prices/certifications/deployments, or finance claims appear |
| Content boundary | Capability separation | Inspect About, Products, product details, Services, and homepage labels | Current capability, pilot work, designed-for architecture, and long-term vision are visibly and semantically distinct; Hyper-0x designed-for features cannot appear as current |
| Input boundary | Product rail cardinality | Mutate a fixture or unit-test a rejected/flagged count outside three | Hero product presentation fails validation unless it contains exactly the three authoritative products once each in canonical order |
| Input boundary | Media dimensions and formats | Validate every presentation media record and generated file | Each local image has non-zero intrinsic width/height, descriptive alt text when meaningful, a frozen source, responsive AVIF or WebP delivery derivatives, and a valid workspace-local public path |
| Input boundary | Long and narrow layouts | Exercise the longest approved product/service/article labels at 320px and 200% text scaling | Text wraps without truncation, overlap, clipped focus rings, hidden links, horizontal document overflow, or fixed-height cropping |
| Malformed or missing input | Media record | Unit-test absent path, derivative, dimensions, alt policy, or duplicate identifier | Invalid media data fails deterministically before presentation; decorative media requires explicit empty-alt/decorative treatment rather than an omitted accessibility decision |
| Malformed or missing input | Presentation references | Unit-test unknown product/page/media references and duplicate section identifiers | Dangling or duplicate references fail; page and product references resolve to canonical content entries |
| Malformed or missing input | Build artifact | Remove or zero a required generated asset in a fixture/output validation | Validation names the missing asset and fails cleanly; normal pages do not silently request a reference-host fallback |
| State transition | Mega menus | Hover/focus/touch About, Products, Services, and Blog; move pointer/focus into panels; press Escape; restore focus | One menu is open at a time, safe pointer transfer works, every destination remains keyboard/touch operable, Escape closes and restores focus, and route selection remains accurate |
| State transition | Product and media reveals | Hover, focus, tap, and then leave each interactive product card/rail item | Copy/media/arrow reveal is available to keyboard and touch users, leaves links operable, persists only where specified, and never makes essential information hover-only |
| State transition | Disclosures and process controls | Toggle capability, process, engagement, and FAQ controls with pointer, Enter, Space, and touch | State and ARIA remain synchronized; content is reachable, only the intended panel changes, and focus is not lost |
| State transition | Horizontal rails | Scroll product/risk/story rails by touch, trackpad, keyboard, and visible controls where provided | Rails move in the expected direction, snap predictably, expose the final item, and do not trap page scrolling or keyboard focus |
| Failure and recovery | Hero image blocked | Abort hero/media requests and load each affected route | H1, positioning, CTAs, product names, and navigation remain legible; reserved geometry prevents major layout shift; no broken-image icon obscures interaction |
| Failure and recovery | JavaScript disabled | Load all primary routes and the 404 without JavaScript | Navigation links, all core content, product rail content, disclosures/alternatives, CTAs, articles, and recovery link remain readable and operable; animation is enhancement only |
| Failure and recovery | Motion lifecycle | Navigate away/back and simulate document hidden/visible for route-scoped motion | Timelines pause while hidden, resume deterministically when appropriate, clean up on unmount, and do not duplicate after navigation |
| Regression | Existing navbar behavior | Run the Cloudflare-style mega-menu and unboxed letter-roll suites | Centered links, safe hover corridor, staggered label motion, current-route semantics, mobile Sheet, and violet Contact inversion remain intact |
| Regression | Brand integrity | Hash the official Buckleson and Hyper-0x source artwork and inspect presentation | Source hashes and dimensions are unchanged; rounding/display derivatives preserve proportions; no redraw, recolor, crop, or recompression replaces the authoritative files |
| Regression | Existing articles and routes | Resolve all current page/article/product URLs, sitemap entries, canonicals, internal fragments, and CTAs | No route, article, SEO datum, base-path-aware asset, or internal link regresses during visual replacement |
| Regression | 404 isolation | Load normal routes and unknown root/nested paths | Custom 404 still returns 404, hides normal chrome only there, and route-only animation code/assets are not requested by normal pages |
| Responsive | Required viewport matrix | Capture and inspect 320x568, 390x844, 844x390, 768x1024, 1024x768, 1366x768, 1440x900, and 1920x1080 | No horizontal overflow, clipped meaningful content, internal section scrollbar, obstructed CTA/nav, or animation-driven layout shift; composition adapts instead of shrinking illegibly |
| Responsive | 200% text scaling | Test browser text scaling and the 720x450 zoom-equivalent viewport | Reflow preserves reading order, touch targets, focus visibility, disclosure controls, and all product-rail information without two-dimensional scrolling |
| Accessibility | Semantic structure | Inspect landmarks, heading order, lists/regions, accessible names, alt text, and one H1 per route | Meaning remains clear without CSS; decorative animation/media is hidden appropriately; every interactive control has a stable accessible name and state |
| Accessibility | Keyboard and focus | Traverse every shared and route-specific interaction from a fresh page | Logical order, visible focus, no keyboard trap, 44px touch targets where applicable, skip-link operation, and focus restoration all pass |
| Accessibility | Preferences and contrast | Emulate reduced motion, reduced transparency/unsupported backdrop filter, forced/increased contrast where supported | Motion stops or switches immediately; complete static content remains; glass falls back to an opaque high-contrast surface; WCAG 2.2 AA and Axe serious/critical zero are maintained |
| Security | URL and executable-resource boundary | Inspect typed URLs, built HTML, CSP-relevant resource types, and browser network requests | Internal links are base-path safe; external destinations are approved HTTPS links; no `javascript:` URLs, inline event handlers, remote executable assets, unexpected form submissions, or reference-site runtime requests occur |
| I/O | Reference-host isolation | Record all requests across all routes and search exported HTML/CSS/JS | No runtime request or embedded asset URL targets Spartan, Framer, PAVii, `framerusercontent.com`, or other reference asset hosts; Cal.com and cited authorities remain links only |
| I/O | Responsive media loading | Observe requests above and below the fold | Only the first hero asset is eager/high-priority; viewport-appropriate derivatives load; below-fold images are lazy, asynchronously decoded, dimensionally reserved, and not fetched before needed unless browser policy requires it |
| SEO | Static metadata and discovery | Validate exported metadata, JSON-LD, robots, sitemap, canonicals, titles/descriptions, and headings | All indexable routes are present, unique, crawlable, canonical to the configured site URL, structured data parses safely, and the 404 is excluded/noindex |
| GitHub Pages | Repository base path | Build with the repository base path and serve/export root and nested routes | Navigation, media, CSS/JS, fragments, product/article routes, sitemap, robots, favicon, and 404 resolve under `/may-be-not-some-p0-oooorn-site/` without root-relative breakage |
| Performance | Critical path | Inspect bundles/requests and run three Lighthouse mobile samples | Hero remains server-rendered and meaningful immediately; only critical hero media is eager; no reference runtime or new animation framework ships; median category scores are at least 95, LCP <=2.5s, CLS <=0.10, and TBT <=200ms |
| Performance | Layout stability | Measure hero/navbar/product rail during font, image, hydration, animation, resize, and orientation changes | Reserved dimensions and transform/opacity-only motion keep CLS within budget and do not change section geometry |

## Explicitly not applicable

| Category | Reason |
| --- | --- |
| Concurrency | The site is a deterministic static export with no shared mutable server, database, multi-user write state, worker queue, or concurrent transaction contract. Parallel test workers must use isolated browser contexts but do not test application concurrency. |
| Time | No user-visible clock, expiring state, schedule, or time-dependent content is authorized. Fixed publication metadata is syntax-checked without comparison to wall-clock time. Hidden-tab pause/resume is covered as a motion state transition, not temporal business logic. |
| Randomness | Visual layout, copy, media selection, IDs, and animation sequences must be deterministic. Randomized particles, ordering, or content are prohibited rather than statistically tested. |
| Malicious user input | No form, authentication, API, database, CMS, search field, or user-generated content is introduced. Static URL/resource safety and JSON-LD escaping remain covered under Security. |
| Network recovery | The application performs no runtime data fetch. Third-party availability for Cal.com and cited authorities is out of scope; tests validate safe links without navigating or submitting data. |

## Required execution gates

Run Node-based commands only through `scripts/Invoke-WorkspaceNodeTool.ps1`.
The independent runner records exact commands, exit codes, and failures for:

1. Focused content/presentation unit tests.
2. Focused cinematic rebuild Playwright checks.
3. `design:lint`, `lint`, `typecheck`, `test:unit`, and `build`.
4. `test:content`, `test:links`, `test:seo`, and `test:404`.
5. Full `test:e2e` and `test:a11y`.
6. GitHub Pages validation against the configured base path.
7. Three-run `test:performance` median.
8. Aggregate `test`, Graft refresh/check, and `git diff --check`.

Any failure blocks dependent work and receives independent classification as a
production, test, fixture/content, toolchain, or environment defect before the
smallest valid repair and retest. A valid assertion must not be weakened merely
to obtain a pass. The existing simulated LCP debt may not be reported as fixed
unless a fresh three-run median satisfies the active threshold.
