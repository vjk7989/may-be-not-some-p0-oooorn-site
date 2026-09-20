# Buckleson Hero Labeled Token Flow Test Matrix

## Acceptance boundary

This matrix covers only the request-token choreography and path polish inside
the existing homepage `HeroExecutionSphere`. The left-side hero copy, CTA
destinations, the three outcome controls, route structure, shared navigation,
and the remaining homepage sections are regression boundaries, not redesign
scope.

The visual is an **illustrative request flow**, not a claim that Buckleson
detects or eliminates every attack. Its three deterministic examples are:

1. **Prompt injection** — visibly marked as a known attack and red from
   ingress; it reaches the Buckleson boundary, is blocked, and visually
   dissolves before the aperture.
2. **User request** — visibly marked as approved, remains violet, crosses the
   boundary, and reaches the currently selected outcome.
3. **Deceptive input** — appears neutral before inspection; **when detected**,
   it gains an explicit detected-risk status, turns red, and dissolves at the
   boundary before reaching an outcome.

The accompanying language must say that detected harmful requests can be
blocked or stopped at the boundary. It must not say that every attack is
detected, destroyed, eliminated, guaranteed safe, guaranteed private, or
guaranteed correct. Red is a risk state, violet is an active or approved
request path, and verified green remains limited to completed outcome nodes.

## Focused verification matrix

| Risk area | Scenario | Verification | Required result |
| --- | --- | --- | --- |
| Static meaning | Complete server-rendered example | Inspect built homepage HTML and the hero before motion initializes | Prompt injection, User request, and Deceptive input are named in static HTML; known attack, approved, detected risk, blocked, and passed meanings are available without animation |
| Claim boundary | Illustrative, conditional protection | Assert visible qualification and run prohibited-copy checks | The hero identifies the flow as illustrative and uses “when detected” for deceptive input; it contains no universal detection, destruction, safety, privacy, correctness, or coverage guarantee |
| Known-attack token | Red from ingress and blocked | Observe the Prompt injection token for one deterministic cycle | It begins red with a non-color attack marker, follows its assigned ingress path, reaches but never crosses the boundary/aperture, visibly dissolves, and resets without appearing in an output lane |
| Approved token | Violet pass-through | Observe the User request token for one deterministic cycle in each selected outcome state | It begins and remains violet, passes through the aperture, stays on the selected route, and reaches exactly one of Protected context, Controlled action, or Execution evidence |
| Deceptive token | Detection transition at boundary | Observe the Deceptive input token before and after its inspection checkpoint | Before inspection it is not presented as known-malicious; when the illustrative detection occurs it gains a textual/icon detected state, turns red, stops before the aperture, dissolves, and never appears at an output |
| Color independence | Status is not conveyed by hue alone | Inspect token markup, rendered labels, high-contrast mode, and a grayscale screenshot | Attack, approved, detected, blocked, and passed states have readable text and/or distinct status symbols or shapes; the story remains unambiguous without red/violet/green perception |
| Determinism | Stable token set and sequence | Reload three fresh contexts and sample the first complete cycle | Token count, labels, paths, delays, transition order, and destinations are identical; no random, date-based, or viewport-dependent ordering is used |
| Path alignment | Clean ingress connections | Compare every path endpoint with its source label, boundary contact, aperture, and output anchor in SVG coordinates and rendered CSS pixels | Paths meet their intended anchors within 2 SVG units and 2 CSS px; no path ends visibly short, overshoots a node, crosses unrelated labels, or changes alignment during animation |
| Path hierarchy | Polished, intentional routing | Inspect normal, selected, and inactive states at desktop and mobile sizes | Primary selected flow is visually strongest; supporting paths remain legible but subdued; line caps, joins, dash rhythm, spacing, and curve tangents are consistent rather than wireframe-like |
| Token-to-path tracking | Moving labels remain on their lane | Sample each token center and its assigned path point across at least eight frames | Token center remains within 3 CSS px of its intended route; no jump occurs at the sphere boundary or when the approved token branches to an output |
| Boundary choreography | Block versus pass is spatially clear | Sample one cycle including ingress, contact, pass/block, and reset | Harmful examples terminate outside the aperture; the approved request alone crosses the aperture; dissolve fragments/fade do not leak onto a passed route or completed output |
| Token label legibility | Labels stay readable while moving | Inspect each token at every sampled phase, including sphere contact | Text stays horizontal, high-contrast, non-mirrored, and unclipped; labels do not rotate with the sphere, collide with one another, or fall below the design system’s smallest readable text size |
| Fixed identity | Sphere moves while Buckleson identity does not | Sample sphere rings, token paths, and `[data-sphere-logo]` geometry | At least two sphere layers and the token choreography change; the official logo’s transform and bounding-box center remain stable within 0.5 CSS px |
| Initial state | Existing deterministic control state | Open a fresh homepage | Protect data remains the sole `aria-pressed="true"` control and exactly one output/flow state is active |
| Pointer controls | Outcome selection and persistence | Hover each outcome control, then move into neutral hero space | The selected outcome becomes the approved token’s sole destination and remains selected after pointer exit; blocked tokens remain blocked regardless of outcome choice |
| Keyboard controls | Focus and activation | Tab through controls and use Enter and Space | Focus is visible; focus/activation selects exactly one outcome; token labels and semantic explanations remain available without requiring hover |
| Touch controls | Mobile selection | At 390x844, tap all controls | Every target is at least 44x44 CSS px, selection updates once per tap, the approved route updates correctly, and the blocked routes do not change into passed routes |
| Mixed state transitions | Selection during an active cycle | Change outcomes rapidly by pointer, keyboard, and click while tokens are moving | No duplicate token, orphaned fragment, stale active route, DOM growth, accelerated timeline, or impossible mid-cycle teleport occurs; the next deterministic branch resolves to the latest selection |
| Reduced motion | Complete static explanatory state | Emulate `prefers-reduced-motion: reduce` and inspect over 700 ms | Rings, tokens, path travel, color transitions, and dissolve motion remain stationary; all three example labels and their approved/blocked meanings are visible in a finished static composition; controls update immediately |
| No JavaScript | Progressive enhancement | Disable JavaScript and load `/` | The complete illustrative story, all three token names/statuses, all inputs/outcomes, Buckleson identity, controls, explanations, H1, and CTAs remain readable; meaning does not depend on timed color change or disappearance |
| Assistive equivalence | Decorative motion excluded, meaning retained | Inspect the accessibility tree | Moving SVG artwork is `aria-hidden="true"`; an adjacent concise semantic explanation describes the known attack blocked, approved request passed, and deceptive input blocked when detected; no moving duplicate is announced |
| Responsive containment | Established viewport cohort | Test 320x568, 390x844, 844x390, 768x1024, 1024x768, 1366x768, 1440x900, and 1920x1080 | Token pills, paths, sphere, logo, outcomes, and controls remain inside the hero; labels do not overlap or clip; there is no internal scrollbar and horizontal overflow is at most 1 px |
| Text reflow | 200% text and zoom equivalent | Test 1440x900 with 200% root text and 720x450 | Semantic labels and controls reflow without truncation or two-dimensional scrolling; the scene may grow naturally instead of shrinking text; the visual retains understandable source/boundary/destination alignment |
| Resize recovery | Breakpoint and orientation changes | Select Preserve evidence, resize desktop -> portrait mobile -> landscape mobile -> desktop without reload | Selection persists, paths realign to the current layout, token motion remains single-instance, and no stale inline transform or off-canvas token remains |
| Hidden document | Pause and deterministic recovery | Background the page during each token phase, then restore it | Motion pauses with at most one in-flight frame and resumes once without skipping a security decision, duplicating a token, or reporting a false passed state |
| Lifecycle cleanup | Navigation during delayed initialization and active motion | Navigate home -> supporting route -> home before and after Anime.js loads | No post-unmount state update, retained token, duplicate timeline, unhandled rejection, or accelerated cycle occurs; a remount begins from the documented initial state |
| Route isolation | Homepage-only motion code | Record scripts for `/`, `/about/`, `/products/`, `/services/`, `/blog/`, and an article in fresh contexts | Hero token animation code and its Anime.js import are requested only by `/`; supporting routes do not import or preload them |
| Failure recovery | Animation import fails | Abort the route-local animation chunk after static HTML loads | Static labels, statuses, paths, controls, copy, and CTAs remain usable; no blank visual, misleading all-passed state, retry loop, or uncaught error occurs |
| Local I/O | No external visual/runtime request | Record all network requests through load and control changes | No reference-site asset, CDN, remote font, telemetry, or runtime data request is introduced |
| Brand integrity | Official logo unchanged | Hash the source and inspect the hero instance | `public/brand/buckleson-logo.jpg` remains SHA-256 `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481` and 322 x 308; its local display derivative keeps explicit proportional dimensions and is neither recolored nor animated |
| Blocked logo I/O | Identity fallback | Abort the Buckleson display image request | Buckleson text identity and the three request outcomes remain understandable; reserved dimensions prevent layout collapse, clipping, or CLS |
| Accessibility | Focus, contrast, motion, and Axe | Check semantic roles/names/states, forced colors, keyboard order, and run Axe | Controls remain real buttons with accurate `aria-pressed`; text and status indicators meet WCAG AA; focus is visible; no serious or critical Axe issue is introduced |
| Layout stability | Animation and labels do not move document flow | Measure shifts through fonts, motion start, status transitions, outcome changes, and blocked image | Token movement, detection, dissolve, and branch changes use only transform, opacity, SVG stroke/mask properties, or reserved-size state layers; CLS remains at most 0.10 |
| Performance | Preserve the known baseline honestly | Run a fresh three-run mobile Lighthouse cohort and compare bundle/request data | No new dependency is added; TBT remains at most 200 ms and CLS at most 0.10. The existing approximately 2.825 s median LCP debt is reported, not relabeled passing; the refinement must not materially regress it |
| Regression | Existing site contracts | Run hero, viewport, content, links, SEO, Platform, navbar, 404, full E2E, accessibility, build, GitHub Pages, and aggregate gates | Existing copy, routes, base paths, controls, viewport fit, route-local 404 animation, static export, and deployment behavior remain green |
| Dependency boundary | YAGNI | Inspect manifest, lockfile, imports, and output | Anime.js remains pinned at 4.5.0; no WebGL, canvas, Three.js, generalized particle framework, observer utility, telemetry, or extra runtime dependency is added |

## Recommended stable verification seams

Retain the established hero hooks and add the smallest token-specific seams
needed for black-box verification:

- `data-request-token="prompt-injection|user-request|deceptive-input"`
- `data-token-status="attack|approved|detected|blocked|passed"`
- `data-token-path="prompt-injection|user-request|deceptive-input"`
- `data-token-checkpoint="inspection|boundary|outcome"`
- `data-token-fragment` for decorative dissolve pieces

These attributes are test seams, not a public component API. Tests should
prefer accessible text and button state for user-visible behavior, and use the
hooks only for geometry and motion sampling.

## Test implementation notes

- Assert that harmful tokens never cross the aperture by comparing their
  rendered center to the boundary intersection and destination anchors, not by
  relying only on opacity.
- Measure route alignment with SVG `getPointAtLength()` plus the element’s
  screen transformation matrix. Wait for `document.fonts.ready` and two
  animation frames before geometry assertions.
- Use bounded frame sampling rather than exact wall-clock timestamps. The
  choreography must be deterministic, but browser scheduling need not land on
  an identical millisecond.
- A dissolving token may become transparent only after its blocked status is
  already visible in static or semantic content. Hidden pixels must never be
  the only evidence of a block.
- Do not assert Anime.js internals. Verify rendered transforms, status
  attributes, geometry, pause/resume, and cleanup from outside the component.
- Run chunk-isolation checks in fresh browser contexts so the homepage cache
  cannot conceal a supporting-route request.
- Keep visual-regression tolerances narrow around path endpoints, sphere
  alignment, token-label collisions, and output anchors; tolerate normal
  antialiasing differences.

## Risk-category applicability

- **Happy path:** applicable to all three labeled examples, the initial Protect
  data state, and each selected approved destination.
- **Input boundaries:** applicable to pointer, keyboard, touch, reduced-motion,
  JavaScript-disabled, forced-colors, hidden-document, viewport, orientation,
  and 200% text modes.
- **Malformed input:** not applicable. The component accepts no form value,
  query parameter, CMS payload, or runtime network data; examples are typed and
  local.
- **Missing input:** not applicable to consumer data because there are no
  optional public props. A blocked logo and failed motion chunk are covered as
  I/O recovery cases.
- **State transitions:** applicable to ingress, inspection, detection,
  block/pass, dissolve/reset, outcome selection, resize, visibility changes,
  unmount, and remount.
- **Failure and recovery:** applicable to animation-import failure, blocked
  logo, background pause/resume, and navigation during initialization.
- **Concurrency:** limited applicability. There is no shared or multi-user
  state; concurrent concerns are rapid outcome changes, asynchronous import
  resolution racing with unmount, and duplicate-timeline prevention.
- **Time:** applicable because the illustration is time-based. Tests verify
  order and bounded visual state changes without requiring one exact clock
  phase.
- **Randomness:** applicable as a prohibition. Token selection, route, delay,
  status, and reset must not use `Math.random`, date/time seeding, or runtime
  randomizers.
- **I/O:** applicable to the local logo, homepage-only code chunk, failure
  recovery, base path, and external-request prohibition.
- **Security:** applicable primarily to claim accuracy and safe rendering. No
  user-controlled markup or executable input is added; tests still reject
  unsafe HTML, remote scripts, telemetry, and misleading universal protection
  claims.
- **Accessibility:** applicable to non-color status, semantic static
  equivalence, focus, keyboard/touch controls, contrast, reduced motion,
  reflow, and Axe.

## Gate order

1. Static content, qualification, deterministic source, and brand-integrity
   checks.
2. Focused token-flow browser tests for status, choreography, geometry,
   controls, fallbacks, lifecycle, route isolation, and Axe.
3. Visual review at desktop, mobile portrait, mobile landscape, and reduced
   motion, including path alignment and label-collision inspection.
4. Lint, typecheck, unit/content, links, SEO, and production build.
5. Viewport, Platform, navbar, 404, full E2E, accessibility, aggregate, and
   GitHub Pages regression gates.
6. Three-run Lighthouse comparison; retain any unmet LCP result as explicit
   debt.

