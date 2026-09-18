# Responsive Viewport Sections Test Matrix

## Acceptance boundary

This matrix covers only the nine homepage scenes introduced by the responsive
viewport-section change:

1. Hero
2. Risk landscape
3. Outcomes
4. Platform
5. Hyper-0x
6. Services
7. Industries
8. Article previews
9. Assessment CTA

The shared footer is site chrome. It must reflow without horizontal overflow,
but it is not a viewport-fitted scene. Supporting routes retain their existing
natural document flow.

Every scene must expose `data-viewport-section`. The scene contract is:

- `usable height = window.innerHeight - sticky header footprint`.
- When intrinsic content height is no greater than usable height, the scene's
  rendered height equals usable height within 2 CSS pixels.
- When intrinsic content is taller, the scene grows to contain it. Text and
  controls are not shrunk, clipped, hidden, or placed in an internal vertical
  scroller to force a fit.
- Meaningful visible descendants remain inside the scene boundary.
- The document does not overflow horizontally.
- Sizing is CSS-driven: scenes do not receive inline `height` or
  `min-block-size` values after resize.

Intrinsic height is measured deterministically in the browser by temporarily
removing only the scene's `height`, `min-height`, and `min-block-size` inline
constraints, reading its scroll height, and restoring the original inline
styles before assertions. The test does not alter source files or product
state.

## Geometry matrix

| Context | Viewport | Required result |
| --- | ---: | --- |
| Small short mobile | 320x568 | Natural growth where needed; no clipping or horizontal overflow |
| Standard mobile | 390x844 | Short scenes fit; dense scenes may grow naturally |
| Landscape phone | 844x390 | Header and scene content remain operable; natural growth allowed |
| Portrait tablet | 768x1024 | Fit when intrinsic content permits |
| Landscape tablet | 1024x768 | Fit when intrinsic content permits |
| Common laptop | 1366x768 | Compact desktop composition; fit when content permits |
| Desktop | 1440x900 | Viewport-fitted desktop scenes without artificial empty padding |
| Large desktop | 1920x1080 | Scene expands to usable height without clipping |
| 200% zoom equivalent | 720x450 | Natural growth, ordered reading, and no two-dimensional scrolling |
| Text scaling | 1440x900, root font size 200% | Natural growth with visible text and actions |

The same page is resized 1440x900 -> 390x844 -> 1440x900 without a reload.
The final scene dimensions must return to their initial values within 2 pixels,
and the selected Platform product must remain selected throughout.

## Behavior and resilience

| Area | Check |
| --- | --- |
| Hero | H1, supporting copy, two CTAs, and boundary visual stay inside the scene |
| Risk landscape | Semantic explanation remains present; decorative motion does not change scene height |
| Platform | Hyper Tern, Hyper-ABS, and Hyper-0x states contain their visible content without nested scrolling or clipping |
| No JavaScript | All three product summaries and links are readable; all nine scenes remain in natural document flow |
| Reduced motion | Scene geometry is unchanged and continuous Risk/Platform motion has a complete static state |
| Anchor navigation | `#platform` settles below the sticky header rather than underneath it |
| Missing image I/O | Blocking homepage image requests does not collapse a scene or create horizontal overflow |
| Resize recovery | No stale inline sizing, reload requirement, or lost Platform selection |
| Layout stability | Scene heights are unchanged across consecutive settled animation frames |

## Regression and accessibility

- One visible H1 and nine semantic homepage scenes remain present.
- Existing keyboard navigation, skip link, mobile Sheet, CTAs, Platform
  controls, content, claims, links, SEO, Axe, build, and GitHub Pages checks
  remain authoritative regression gates.
- At 200% text scaling, visible headings, paragraphs, links, buttons, lists,
  definitions, and images remain within their scene and the page has no
  horizontal overflow.
- No Aceternity or motion runtime is added. Existing local shadcn primitives
  remain the component foundation.
- Lighthouse LCP is separate known debt. It is not green unless a fresh
  three-run mobile median is at most 2.5 seconds.

## Risk-category applicability

- Happy path and boundaries: applicable through all nine scenes and the full
  viewport matrix.
- State transitions: applicable to Platform selection, resize/orientation,
  hash navigation, and reduced motion.
- Missing I/O: applicable to blocked local images; font settling is awaited.
- Failure and recovery: applicable to resizing back to desktop, no JavaScript,
  and blocked images.
- Accessibility: applicable because forced viewport sizing can otherwise clip
  zoomed text, headings, or keyboard targets.
- Malformed external input: not applicable; the homepage uses typed local
  content and introduces no input boundary.
- Concurrency, time, and randomness: not applicable; sizing is deterministic
  CSS. Tests use settled animation frames rather than arbitrary animation
  delays.
- Security: regression-only; the change adds no input, network, storage, or
  script execution boundary.
