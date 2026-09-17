# Electric-violet navbar validation matrix

## Scope

Adapt the shared Buckleson glass header into a compact rounded rectangle with
six consistently shaped navigation cells. The Zenox reference informs only the
interaction idea: Buckleson retains its own violet, typography, logo, routes,
copy, mobile Sheet, and no-JavaScript recovery path.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Desktop geometry | At 1440px, the sticky glass surface is inset and elevated with a 10–20px outer radius. Its six cells have 6–14px radii and remain wider than tall. |
| Content | Exact contract | Desktop, mobile, and no-JavaScript paths expose Home, About, Products, Services, Blog, Contact Us in that exact order with unchanged destinations. Contact Us remains same-tab. |
| State | Current route | Every internal route has exactly one `aria-current="page"`; article routes select Blog, and Contact Us is never current. |
| State | Inactive cell | An inactive cell begins as a light/white surface with dark text. Hover and keyboard focus reveal electric violet and white text without changing layout. |
| State | Active cell | The current-page cell is electric violet at rest and remains violet on hover, focus, and press. Feedback may change depth or label position but never reverse to white. |
| Motion | Rolling label | Every enhanced cell contains one semantic label and one `aria-hidden` duplicate. Fine-pointer hover/focus moves labels vertically using transform/opacity and reveals the violet pseudo-element. |
| Press | Immediate response | Pointer-down applies a subtle transform and release restores it without shifting adjacent cells. |
| Keyboard | Equivalent operation | Links remain native anchors, every cell is keyboard reachable, focus is visible above the fill, and focus exposes the same readable state as hover. |
| Mobile | Sheet and touch | At 320px and 390px, the Sheet retains exact order, 44px minimum targets, one visible current state, Escape dismissal, and focus restoration. Touch does not depend on hover. |
| Responsive | Supported widths | At 320, 390, 768, 1024, and 1440px there is no horizontal overflow. Desktop or mobile navigation is always usable. |
| Text scaling | 200% reflow | At 1280px with a 200% root font, the header switches or reflows to a usable navigation path without document overflow. |
| Motion preference | Reduced motion | `prefers-reduced-motion: reduce` makes cell and label transitions immediate/static while preserving active, hover, focus, and visible labels. |
| Transparency preference | Reduced transparency | The existing preference rule removes backdrop filtering and provides an opaque or near-opaque surface. |
| Contrast preference | Increased contrast | The existing preference rule provides a solid readable surface and explicit contrasting boundary; active and inactive states stay distinguishable. |
| Capability fallback | Unsupported filters | `@supports not` removes backdrop filtering and raises opacity without changing navigation behavior. |
| Missing script | Native fallback | With JavaScript disabled at 320px and 1440px, ordered native links remain visible and focusable, the inert Sheet trigger is hidden, and no overflow occurs. |
| Accessibility | Semantics and audit | Duplicate labels are hidden from assistive technology, each link has one accessible name, focus remains visible, and Axe reports no serious or critical issues. |
| Performance | Bounded CSS motion | The effect uses CSS pseudo-elements, transforms, and opacity only. No animation library, remote asset, continuous loop, or layout-property animation is added. |
| Regression | Shared site contract | Sticky behavior, skip link, logo, routes, content, SEO, static export, Pages base path, and performance budgets remain authoritative and green. |

## Boundary classification

- Malformed or missing input: N/A — the header accepts no free-form input.
- Concurrency: N/A — it has no shared mutable or multi-user state.
- Time and randomness: N/A — short deterministic CSS transitions do not affect
  application state.
- Network I/O: N/A for rendering — assets are local and validation does not
  follow the external calendar destination.
- Security: regression only — native HTTPS links and existing same-tab behavior
  remain unchanged; no data or script boundary is introduced.
- Failure and recovery: applicable to unsupported filters, reduced preferences,
  missing JavaScript, and mobile Sheet dismissal.
- Accessibility: applicable to native semantics, duplicate-label hiding,
  keyboard/focus equivalence, contrast, zoom, reduced motion, and target size.

## Red-first expectation

Before production implementation, focused tests fail because cells do not use
the required `.nav-cell` and layered `.nav-label-base` / `.nav-label-hover`
contract, the outer surface still has pill geometry, inactive links use an
underline rather than a violet fill, active links are not solid violet, and
mobile links do not expose the matching cell treatment. Existing route order,
current-page semantics, glass fallbacks, Sheet operation, no-JavaScript path,
and overflow coverage should continue to pass.
