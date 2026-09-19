# Buckleson logo edge-rounding validation matrix

## Scope

Round the displayed edges of the approved Buckleson logo everywhere it is
rendered, including the shared navbar and footer and any future/current use in
the Risk Landscape. Apply an equivalent rounded mask to the browser favicon
declared through Next metadata. This is presentation-only: the approved JPEG's
bytes, intrinsic 322 × 308 dimensions, proportions, meaning, and accessible
link labeling must not change.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Shared rendered marks | Every Buckleson display derivative, including header, footer, and homepage boundary uses visibly rounded clipping at every corner. |
| Happy path | Favicon presentation | The metadata icon points to a local SVG presentation wrapper that clips the original JPEG with a rounded rectangle and preserves its aspect ratio. |
| Asset integrity | Original bytes | `public/brand/buckleson-logo.jpg` remains SHA-256 `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481`, with intrinsic dimensions 322 × 308. |
| Proportion | No distortion | Every rendered Buckleson derivative keeps the approved 322 × 308 source aspect ratio within 1%; rounding must not force it into a stretched square or crop the brand mark. The preserved source itself is loaded independently to verify its intrinsic dimensions. |
| Responsive | Mobile and desktop | At 320px and 1440px, all rendered Buckleson marks retain the same rounded mask and source proportions with no horizontal overflow. |
| Coverage | Shared components | The browser test discovers the shared `brand-logo-image` and homepage `boundary-logo` presentation hooks instead of coupling presentation to the immutable source URL. New Buckleson display placements must reuse one of those tested hooks or extend this matrix explicitly. |
| Accessibility | Decorative image in named link | Shared lockup images remain `alt=""` because the surrounding home link is named “Buckleson home”; rounding does not add duplicate announcements or remove the link's accessible name. |
| Metadata regression | Social/organization identity | Open Graph/Twitter/Organization metadata may continue to reference the byte-preserved original; their existing descriptions and logo identity remain unchanged. Browser-rendered marks may use smaller local derivatives and the browser icon keeps its rounded wrapper. |
| Missing/malformed asset | Deterministic failure | A missing original, changed hash, wrong intrinsic size, missing/invalid SVG wrapper, absent rounded clip, or remote icon reference fails validation. |
| Failure/recovery | Unsupported presentation | The normal image uses CSS `border-radius`, which degrades to the intact original if unavailable; the icon wrapper includes explicit SVG geometry and `preserveAspectRatio` rather than script-dependent masking. |
| I/O | Local static assets only | The original and icon wrapper resolve locally with successful responses; no CDN, runtime fetch, data URL, or remote image is introduced. |
| Security | SVG boundary | The favicon wrapper is static, local, and declarative: no scripts, event attributes, `foreignObject`, or external HTTP(S) references. |
| Regression | Routes and content | Logo links still navigate home; navigation, route, content, CTA, SEO, accessibility, and performance suites remain authoritative. |

## Not applicable

- User input: N/A — logo paths and presentation are repository-owned constants.
- State transitions: N/A — rounding has no open/closed/loading state.
- Concurrency: N/A — static assets and CSS have no shared mutable state.
- Time: N/A — rendering does not depend on a clock or duration.
- Randomness: N/A — geometry, hash, and paths are deterministic.
- Authentication/authorization: N/A — public marketing assets have no access
  control boundary.
- Persistence/recovery: N/A — no user data or durable application state changes.

## Red-first expectation

Before implementation, the shared image is rendered as a forced 2rem × 2rem
square with no rounded clipping, so the presentation/proportion assertions
fail. The favicon also points directly to the square-edged JPEG, so the local
rounded SVG-wrapper contract fails. The original asset hash and intrinsic
dimensions should already pass and guard against solving the request by
modifying the approved source.
