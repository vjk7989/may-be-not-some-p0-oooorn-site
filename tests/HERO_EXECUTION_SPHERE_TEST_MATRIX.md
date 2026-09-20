# Spinning Buckleson Execution Sphere Test Matrix

## Acceptance boundary

This matrix covers the homepage hero's new right-side execution sphere. The
left-side hero copy, calls to action, routes, shared header, the remaining eight
homepage scenes, and supporting pages are regression boundaries rather than
redesign scope.

The server-rendered first frame must communicate the complete flow without
depending on animation: **Data**, **Identity**, **Tools**, and **Actions** enter
the Buckleson execution boundary and resolve as **Protected context**,
**Controlled action**, and **Execution evidence**. The first control,
**Protect data**, is the deterministic initial selection.

The three controls and their concise explanations are:

1. **Protect data** — reduce sensitive-data exposure before inference.
2. **Control actions** — check identity, permissions, tools, and actions against
   policy.
3. **Preserve evidence** — preserve attributable, tamper-evident execution
   records.

The copy may describe controls, risk reduction, and evidence. It must not claim
guaranteed safety, privacy, correctness, universally approved AI output,
confidential computing, or universal risk coverage.

## Focused verification matrix

| Risk area | Scenario | Verification | Required result |
| --- | --- | --- | --- |
| Static content | Complete server-rendered diagram | Inspect built homepage HTML and the rendered hero before animation settles | All four inputs, all three outcomes, Buckleson identity, all three controls, and all three explanations exist in static HTML; no animation is required to understand the flow |
| Content accuracy | Exact labels and descriptions | Assert visible text and control names | Labels and descriptions match this matrix; the former `Execution boundary` dashboard/card, `Models`, `Protection · Policy · Evidence`, and `Controlled execution` presentation do not remain in the hero visual |
| Claim boundary | No security guarantees | Run the existing content validator plus focused prohibited-copy checks | No guarantee of safety, privacy, model correctness, confidential computing, or universal coverage is introduced |
| Initial state | Deterministic selection | Load the homepage in a fresh context | `Protect data` is the only control with `aria-pressed="true"`; exactly one outcome state is active |
| Pointer state | Hover selection and persistence | Hover each control, then move the pointer into neutral hero space | The hovered control becomes the sole pressed/active state; its input strand, sphere layer, output, and explanation are highlighted; the state persists after pointer exit |
| Keyboard state | Focus selection and activation | Tab through the controls, then use Enter and Space | Focus selects the focused control, one `aria-pressed` value remains true, Enter/Space are safe idempotent activations, and focus remains visible above the visual treatment |
| Touch state | Tap selection | At 390x844, tap each control in sequence | Each tap selects exactly one outcome, exposes the matching explanation, and leaves a minimum 44x44 CSS-pixel target |
| State transitions | Repeated and mixed input | Select in the order pointer -> keyboard -> touch-equivalent click, including selecting the current item twice | No duplicate active state, lost focus, stale explanation, DOM growth, or reset on pointer exit occurs |
| Static SVG | Complete decorative composition | Inspect the sphere SVG hooks and accessibility tree | Incoming paths, layered sphere rings, central aperture, outgoing paths, and completed output nodes exist in the first frame; decorative SVG is `aria-hidden="true"` and equivalent meaning is present in visible text |
| Normal motion | Rotating field with fixed identity | Sample ring transforms and logo geometry across at least six animation frames after load | At least two ring layers change transform at independently paced deterministic rates; request particles/path strokes change; the logo transform and bounding-box center remain stable within 0.5 CSS px |
| Motion restraint | Layout-independent enhancement | Sample hero and visual bounds before and during a full interaction transition | Pulse, compression/release, particles, and path drawing alter only transform, opacity, masks, or SVG stroke properties; hero dimensions and document flow do not change |
| Reduced motion | Finished static state | Emulate `prefers-reduced-motion: reduce`, sample every animated target over 700 ms, and operate all controls | Ring, particle, pulse, and path-travel values remain unchanged; the full flow stays visible; selection and focus update immediately without traveling effects |
| No JavaScript | Progressive enhancement | Disable JavaScript and load `/` | Inputs, outcomes, logo/Buckleson identity, controls, explanations, headline, and CTAs remain readable in natural flow; the finished sphere is visible and no content depends on hydration |
| Hidden document | Background pause and recovery | Observe stable animation markers, make the page hidden by activating a second page, then return | Animated values do not advance while hidden beyond one in-flight frame; animation resumes once without a jump, duplicate timeline, or console error |
| Lifecycle cleanup | Route changes during and before dynamic import resolution | Navigate homepage -> supporting route -> homepage repeatedly, including immediately after load | No state update after unmount, unhandled rejection, console error, retained duplicate timeline, or accelerated animation occurs; a fresh hero starts with one selected control |
| Chunk isolation | Homepage-only hero runtime | Record scripts on `/`, `/about/`, `/products/`, `/services/`, `/blog/`, and an article in fresh contexts | The hero component/animation chunk and its Anime.js code are requested by the homepage only; supporting routes do not import or preload them; the existing independent 404 animation boundary remains route-local |
| Network boundary | Local assets only | Record hero requests under normal use and every selection | No CDN, Anime.js documentation, reference-site, remote font, telemetry, or new runtime data request occurs |
| Missing logo I/O | Block the Buckleson display image | Abort the central logo request and load/interact with the hero | Buckleson text identity and full execution flow remain understandable; reserved dimensions prevent collapse, CLS, clipping, or horizontal overflow |
| Brand integrity | Official source and derivative | Hash the source, inspect intrinsic dimensions, and inspect the rendered display instance | `public/brand/buckleson-logo.jpg` remains SHA-256 `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481` and 322 x 308; the hero uses the existing local proportion-preserving display derivative with explicit dimensions; the logo is not cropped, recolored, distorted, or animated |
| Color semantics | Active and completed states | Inspect computed styles for inactive, active, and completed elements | Violet carries active paths and selected controls; verified green appears only at completed output nodes; contrast remains WCAG AA |
| Responsive containment | Existing viewport cohort | Test 320x568, 390x844, 844x390, 768x1024, 1024x768, 1366x768, 1440x900, and 1920x1080 | Desktop keeps the two-column hero; smaller layouts stack the visual after the copy; no visible meaningful child escapes the hero, no internal scrollbar appears, and horizontal overflow is at most 1 px |
| Text scaling | 200% text and zoom equivalent | Test 1440x900 with root text at 200% and 720x450 as the zoom-equivalent viewport | Copy, controls, explanations, and CTAs remain readable and operable; the hero grows naturally rather than clipping, shrinking text, or forcing two-dimensional scrolling |
| Resize recovery | Orientation and breakpoint changes | Resize 1440x900 -> 390x844 -> 844x390 -> 1440x900 without reload after selecting `Preserve evidence` | Selected state persists, geometry returns within 2 px where intrinsic content permits, no stale inline sizing appears, and animation remains single-instance |
| Viewport scene | Existing usable-height contract | Run the hero through the viewport-section geometry helper | The hero fills usable viewport height when intrinsic content fits and grows naturally otherwise; no internal vertical scroller, escaped meaningful content, or animation-driven height change appears |
| Layout stability | CLS and reserved media | Measure layout shifts through load, animation start, interaction, font readiness, and blocked-logo recovery | CLS remains at most 0.10; the hero visual reserves its final dimensions and decorative motion creates no layout shift |
| Performance | Critical-path budget | Compare a fresh three-run Lighthouse mobile median with the retained baseline | Performance, Accessibility, Best Practices, and SEO medians are at least 95; LCP is at most 2.5 s, CLS at most 0.10, and TBT at most 200 ms. Any miss remains explicit and is not relabeled green |
| Accessibility | Semantics and assistive equivalence | Inspect roles, accessible names, state, tab order, focus, and run Axe | Controls are real buttons with unique accessible names and accurate `aria-pressed`; decorative motion is absent from the accessibility tree; one H1 remains; no serious or critical Axe violation is introduced |
| Failure recovery | Dynamic import failure | Abort the hero animation chunk after static HTML loads | Static content, selections, headline, and CTAs remain usable; no blank hero, layout collapse, repeated retry loop, or uncaught page error occurs |
| Regression | Homepage and shared behavior | Run content, links, SEO, viewport sections, Platform, navbar, 404, full E2E, and Axe suites | All established routes, copy, CTAs, anchors, viewport scenes, navigation interactions, Platform states, 404 animation isolation, and GitHub Pages base-path behavior remain green |
| Dependency boundary | YAGNI and pinned runtime | Inspect manifest, lockfile, imports, and output chunks | Anime.js remains exactly `4.5.0`; no WebGL, Three.js, canvas, motion framework, observer utility, telemetry, or additional dependency is added |

## Test implementation notes

- Prefer stable hooks such as `data-hero-execution-sphere`,
  `data-sphere-ring`, `data-request-path`, `data-request-particle`,
  `data-sphere-logo`, and outcome identifiers. These are test hooks, not a new
  public API.
- Test selection through rendered roles and `aria-pressed`; do not assert React
  state or Anime.js internals.
- Compare geometry after `document.fonts.ready` and two animation frames. Do not
  use arbitrary sleeps except bounded animation sampling.
- Hidden-document coverage should observe externally visible animation state;
  it must not patch `document.hidden` or Anime.js internals.
- Chunk-isolation coverage must use fresh browser contexts so cache reuse cannot
  hide a supporting-route request.
- The established viewport helper remains authoritative for usable-height,
  containment, and overflow calculations.

## Risk-category applicability

- **Happy path:** applicable to the complete static flow, initial animation,
  each selection, and the normal desktop/mobile presentation.
- **Input boundaries:** applicable to pointer, keyboard, touch, reduced-motion,
  JavaScript-disabled, hidden-document, viewport, and text-scaling modes.
- **Malformed input:** not applicable. The component has no form, URL parameter,
  API payload, CMS value, or public data input; its content is typed and local.
- **Missing input:** not applicable. There are no optional consumer props or
  user-supplied values in the approved component boundary.
- **State transitions:** applicable to hover/focus/tap selection, repeated
  selection, pointer exit, resize, visibility changes, and route unmount/remount.
- **Failure and recovery:** applicable to a blocked logo, a failed dynamic
  animation import, hidden-tab recovery, and repeated route navigation.
- **Concurrency:** limited applicability. There is no multi-user or shared
  mutable state, but asynchronous module resolution racing with route unmount
  must cleanly cancel and repeated mounts must not create concurrent timelines.
- **Time:** applicable because animation is time-based. Tests verify change,
  pause, and stability over bounded frames without depending on a particular
  wall-clock phase.
- **Randomness:** applicable as a prohibition. Production animation configuration
  must use fixed values and must not call `Math.random`, date APIs, or a runtime
  randomizer; repeat loads must have the same path/order and initial state.
- **I/O:** applicable to the local logo and route-specific JavaScript chunks,
  blocked requests, base paths, and the prohibition on external runtime traffic.
- **Security:** regression-only. No user-controlled HTML, URL, storage, network
  data, or execution boundary is added; tests still reject remote scripts,
  unsafe dynamic markup, and unexpected telemetry.
- **Accessibility:** applicable to stateful controls, focus, motion preferences,
  static semantic equivalence, contrast, touch targets, reflow, and Axe.

## Gate order

1. Static source/content and brand-integrity checks.
2. Focused hero browser tests: content, selection, motion, fallbacks, lifecycle,
   isolation, containment, and Axe.
3. Existing lint, typecheck, unit, content, links, SEO, and production build.
4. Viewport, Platform, navbar, 404, full E2E, and accessibility regressions.
5. Three-run Lighthouse; retain any unmet LCP result as explicit debt.
6. GitHub Pages build/base-path validation and deployed homepage smoke.

