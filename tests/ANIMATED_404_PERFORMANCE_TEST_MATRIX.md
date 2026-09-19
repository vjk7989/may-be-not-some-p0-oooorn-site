# Animated 404 and Performance Test Matrix

## Acceptance boundary

This matrix covers the custom statically exported Buckleson 404 route, its
route-local Anime.js enhancement, and the bounded homepage/image performance
pass. It does not expand the product surface, navigation, content claims, or
supporting-page layouts.

| Risk category | Scenario | Deterministic check | Acceptance |
| --- | --- | --- | --- |
| Happy path | Missing root and nested URLs | Request `/missing-route/` and `/nested/missing-route/` from the production static server | Both responses have status `404` and render the custom 404 content |
| Happy path | Recovery action | Inspect and activate `Return to homepage` | It is a keyboard-focusable link, resolves through the configured base path, and reaches the homepage |
| Static export | Generated error document | Inspect `out/404.html` after `next build` | File exists and contains one visible H1, the approved label/copy/CTA, title `Page not found — Buckleson`, and `noindex` |
| Static export | Repository base path | Run the validator with `/may-be-not-some-p0-oooorn-site` | internal asset and recovery URLs are base-path safe; no root-only project URL escapes the repository prefix |
| Semantic boundary | Immersive error chrome | Compare 404 and homepage browser landmarks | 404 hides the shared banner, primary navigation, skip link, and footer; the homepage still exposes them |
| Progressive enhancement | Static first frame | Load the 404 with JavaScript disabled | H1, copy, CTA, complete SVG, large `404`, checkpoints, request paths, and terminal route state remain visible and meaningful |
| Motion | Deterministic enhancement | Observe marked request tokens/checkpoints during one fixed interval | At least one marked visual value changes without random timing or geometry; the DOM count/order remains fixed |
| Motion | Reduced motion | Emulate `prefers-reduced-motion: reduce` and sample marked SVG styles twice | Complete visual remains visible and transform/opacity values remain unchanged |
| Lifecycle | Hidden-document policy | Inspect the route-scoped motion source | Anime.js is configured to pause on document hiding and all scopes/timelines are reverted during React cleanup |
| Bundle isolation | 404-only Anime.js | Compare scripts requested by `/` and a missing URL and inspect imports | Normal routes do not import or request the 404/Anime.js route chunk; the 404 has at least one route-unique JavaScript chunk |
| Missing input | Social links unavailable | Inspect the 404 DOM and static output while the configured list is empty | No placeholder, empty social navigation, `#`, or invented external profile is rendered |
| Input boundary | Social links supplied later | Contract-level validation only until data exists | Future entries must preserve supplied order, use complete `https://` URLs, and include `noopener noreferrer`; no link is required for this delivery |
| Responsive | Supported viewport range | Check 320×568, 390×844, 844×390, 768×1024, 1024×768, 1366×768, 1440×900, and 1920×1080 | Content is readable; no meaningful element escapes the main boundary; no horizontal overflow or internal vertical scroller appears |
| Accessibility scale | 200% text | Set root text to `200%` at 720×450 | Content grows naturally without clipping or horizontal overflow; CTA remains operable |
| Accessibility | Semantics and contrast | Run Axe and inspect H1, main, CTA, decorative SVG, and focus state | One H1, one main, decorative SVG hidden from assistive technology, visible focus, and no serious/critical Axe violations |
| Failure/recovery | Animation unavailable | JavaScript-disabled run | The finished visual and recovery path remain complete; no loading placeholder is exposed |
| Failure/recovery | Decorative assets blocked | Abort image requests | Error copy, SVG, and CTA remain usable; no layout overflow is introduced |
| Regression | Homepage deferred rendering | Inspect computed `content-visibility` on all nine viewport scenes | Hero is `visible`; each non-hero scene is `auto` and has non-zero `contain-intrinsic-size` |
| Regression | Deferred content remains real content | Disable JavaScript and inspect homepage DOM and anchors | All nine sections remain in static HTML, their meaningful text exists, and anchor targets remain available |
| Regression | Image loading policy | Inspect rendered homepage images | Above-fold Buckleson identity image is eager with dimensions; below-fold Hyper-0x is lazy, async-decoded, and dimensionally reserved |
| Asset integrity | Official sources | Hash and dimensions/size checks | `buckleson-logo.jpg` remains SHA-256 `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481`; `hyper-0x-logo.png` remains SHA-256 `D54E012E3A323D284E5CF0AB9A41522F89A92B3AA3DF4D10316E5A06B267B6F8` |
| Asset performance | Display derivatives | Compare URLs and local file sizes of rendered header/hero and Hyper-0x images with preserved sources | Display instances use local optimized derivatives smaller than their source; dimensions and aspect ratios remain reserved |
| Network/I/O | External runtime traffic | Record requests on 404 and homepage | No CDN, remote font, remote animation, or reference-site asset request occurs |
| Security | URL and dependency boundary | Validate links/imports | No unsafe social URL, inline remote script, copied reference asset, or Anime.js import outside the isolated 404 client component |
| Performance | Existing budgets | Run three Lighthouse mobile samples after focused correctness passes | Median Performance, Accessibility, Best Practices, and SEO ≥95; LCP ≤2.5 s, CLS ≤0.10, TBT ≤200 ms; failures are reported, never relabeled green |

## Explicitly not applicable

- **Malformed request bodies:** no API, form, request body, or mutable input is
  introduced.
- **Authentication/authorization:** the site and 404 route are public static
  documents.
- **Persistence and recovery:** there is no database, storage write, or
  migration.
- **Concurrency:** no shared mutable runtime state exists; animation lifecycle
  cleanup and repeated navigation cover the relevant client-state boundary.
- **Time and randomness:** animation uses fixed constants and must not call
  `Math.random`, date/time APIs, or network clocks.
- **Multi-user state:** the static site has no user-specific state.

## Gate order

1. `Validate-404Performance.ps1` after a static build.
2. Focused Playwright `not-found-performance.spec.ts`.
3. Existing lint, typecheck, unit/content/link/SEO/build gates.
4. Full E2E and Axe regressions.
5. Three-run Lighthouse; keep any unmet LCP result explicit.
6. GitHub Pages validation and live missing-route smoke after deployment.
