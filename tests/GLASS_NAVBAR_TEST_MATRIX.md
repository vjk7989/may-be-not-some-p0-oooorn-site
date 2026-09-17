# Unboxed rolling navbar validation matrix

## Scope

Keep Buckleson’s single rounded rectangular glass header shell while presenting
Home, About, Products, Services, Blog, and Contact Us as unboxed text links.
The Zenox reference informs only the vertical label-roll interaction; Buckleson
retains its own electric violet, typography, logo, routes, mobile Sheet, and
native no-JavaScript recovery path.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Desktop geometry | At 1440px, the sticky outer glass surface remains inset and elevated with a 10–20px radius. Each link has a generous click target but no individual visible background, border, radius treatment, or shadow. |
| Content | Exact contract | Desktop, mobile, and no-JavaScript paths expose Home, About, Products, Services, Blog, Contact Us in that exact order with unchanged destinations. Contact Us remains same-tab. |
| State | Current route | Every internal route has exactly one `aria-current="page"`; article routes select Blog, and Contact Us is never current. |
| State | Inactive link | An inactive link begins as ink text on a transparent surface. Hover and keyboard focus roll an electric-violet duplicate into view without adding a box or changing layout. |
| State | Active link | The current-page label is electric violet at rest and remains electric violet on hover, focus, and press. Feedback may change label position or scale but never adds a filled cell or reverses the label color. |
| Motion | Rolling label | Every enhanced link contains one semantic label and one `aria-hidden` duplicate. Fine-pointer hover and keyboard focus move the two labels vertically using transforms; no background-fill animation is present. |
| Press | Immediate response | Pointer-down applies a subtle transform and release restores it without shifting adjacent links. |
| Keyboard | Equivalent operation | Links remain native anchors, every link is keyboard reachable, the focus indicator is visible outside the label, and focus exposes the same readable violet state as hover. |
| Mobile | Sheet and touch | At 320px and 390px, the Sheet retains exact order, full-width unboxed targets of at least 44px, one violet current state, Escape dismissal, and focus restoration. Touch does not depend on hover. |
| Responsive | Supported widths | At 320, 390, 768, 1024, and 1440px there is no horizontal overflow. Desktop or mobile navigation is always usable. |
| Text scaling | 200% reflow | At 1280px with a 200% root font, the header switches or reflows to a usable navigation path without document overflow. |
| Motion preference | Reduced motion | `prefers-reduced-motion: reduce` makes link and label transitions immediate/static while preserving transparent surfaces and correct violet states. |
| Transparency preference | Reduced transparency | The existing preference rule removes backdrop filtering from the outer shell and provides an opaque or near-opaque surface; links remain unboxed. |
| Contrast preference | Increased contrast | The existing preference rule provides a solid readable outer shell and explicit contrasting boundary; active and inactive labels remain distinguishable without link boxes. |
| Capability fallback | Unsupported filters | `@supports not` removes outer-shell backdrop filtering and raises opacity without changing navigation behavior or adding per-link surfaces. |
| Missing script | Native fallback | With JavaScript disabled at 320px and 1440px, ordered unboxed native links remain visible and focusable, the inert Sheet trigger is hidden, and no overflow occurs. |
| Accessibility | Semantics and audit | Duplicate labels are hidden from assistive technology, each link has one accessible name, focus remains visible, targets are operable, and Axe reports no serious or critical issues. |
| Performance | Bounded CSS motion | The effect uses CSS transforms and opacity only. No animation library, remote asset, continuous loop, background-fill animation, or layout-property animation is added. |
| Regression | Shared site contract | Sticky behavior, outer glass material, skip link, logo, routes, content, SEO, static export, Pages base path, and existing budgets remain authoritative. The documented pre-existing LCP exception is not reclassified as a pass. |

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
  missing JavaScript, and mobile Sheet dismissal/focus restoration.
- Accessibility: applicable to native semantics, duplicate-label hiding,
  keyboard/focus equivalence, contrast, zoom, reduced motion, and target size.

## Red-first expectation

Before production implementation, the new focused checks fail because the
current `.nav-cell` rules still draw white/violet backgrounds, borders, shadows,
and a violet `::before` fill; current-page labels are white instead of violet;
and mobile links retain boxed cell treatment. Route order, current-page
semantics, outer glass fallbacks, Sheet operation, no-JavaScript navigation,
reduced-motion timing, and overflow coverage should remain green.
