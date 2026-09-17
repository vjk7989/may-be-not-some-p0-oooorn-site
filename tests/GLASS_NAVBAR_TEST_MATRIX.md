# Floating glass navbar validation matrix

## Scope

Restyle the existing shared Buckleson header as a restrained, Pavii-inspired
floating pill with an Apple-like translucent material. Preserve the established
navigation order, destinations, semantics, mobile Sheet, no-JavaScript fallback,
copy, routes, dependencies, and performance budgets.

The reference informs hierarchy and material only. Buckleson must keep its own
brand, wording, component structure, and interaction behavior.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Floating desktop pill | At 1440px, the header's inner surface is inset from the viewport, visibly rounded, elevated, and narrower than the viewport while the outer header remains a sticky positioning boundary. |
| Material | Supported glass treatment | In Chromium, the pill has a genuinely translucent background plus non-zero `backdrop-filter` blur/saturation; text remains readable and Axe reports no serious or critical violations. |
| Failure and recovery | Unsupported-filter fallback | CSS contains an explicit `@supports not` fallback that removes the filter and raises the surface opacity so navigation remains readable when backdrop filtering is unavailable. |
| Regression | Exact navigation contract | Desktop, mobile, and no-JavaScript modes retain Home, About, Products, Services, Blog, Contact Us in that exact order, with unchanged destinations and same-tab Contact Us behavior. |
| State transition | Current route | Exactly one internal item has `aria-current="page"`; the visual active state does not replace the semantic state. Contact Us is never current. |
| Pointer interaction | Fine-pointer hover only | Decorative hover movement/highlight is scoped to `@media (hover: hover) and (pointer: fine)` so touch taps do not leave a false hover state. |
| Press feedback | Immediate active response | Pressing a desktop navigation target produces subtle transform feedback on pointer-down and restores it on release; the transition is short and property-specific. |
| Keyboard | Visible focus | Keyboard focus remains clearly visible on the glass surface, and all navigation targets remain native links. |
| Position | Sticky behavior | After scrolling, the floating header remains visible near the top inset and does not cover or remove the skip-link path. |
| Responsive | Supported widths | At 320, 390, 768, and 1024px the mobile trigger/Sheet path remains operable; at 1440px the desktop pill is visible. No supported viewport has horizontal document overflow. |
| Text scaling | 200% reflow | At 1280px with root text at 200%, the header switches/reflows without horizontal document overflow and still exposes a usable navigation path. |
| Mobile Sheet | Open, dismiss, restore | The trigger exposes expanded state, the Sheet contains the exact ordered links, Escape closes it, and focus returns to the trigger. |
| Motion preference | Reduced motion | `prefers-reduced-motion: reduce` removes transform-driven header motion or reduces it to an effectively instant/static state without hiding feedback or navigation. |
| Transparency preference | Reduced transparency | CSS provides `prefers-reduced-transparency: reduce` with an opaque/near-opaque surface and no backdrop filter. Chromium does not currently emulate this preference, so deterministic source validation is used. |
| Contrast preference | Increased contrast | CSS provides `prefers-contrast: more` with a near-solid surface and a defined contrasting border. Source validation is used because Playwright Chromium media emulation does not expose this preference consistently. |
| Missing script | No-JavaScript fallback | With JavaScript disabled at 320px and 1440px, the fallback is visibly rendered, every link is keyboard-focusable, and it preserves the exact order and destinations. The inert mobile Sheet trigger is hidden so it cannot block or falsely advertise an unavailable menu. |
| Performance | No runtime expansion | No animation/runtime dependency, CDN asset, remote font, WebGL, or continuous navbar animation is introduced; existing Lighthouse thresholds remain authoritative. |
| Content regression | Site contract unchanged | Existing route, CTA, article, product, service, claim, and homepage-content tests remain authoritative and must continue to pass. |

## Boundary classification

- Malformed or missing user input: N/A — navigation accepts no free-form input.
- Concurrency: N/A — the header has no shared mutable or multi-user state.
- Time and clocks: N/A — behavior is not time-dependent; short CSS transitions
  are presentation feedback, not business-time logic.
- Randomness: N/A — order, styling, and state transitions are deterministic.
- Runtime network I/O: N/A for rendering — all header assets are local and the
  external calendar link is not followed by the test.
- Security: limited to regression — native HTTPS links and existing same-tab
  behavior are preserved; no new script, HTML injection, or data boundary exists.
- Persistence: N/A — the component stores no durable state.
- Accessibility: applicable — semantics, focus, contrast, reduced motion,
  reduced transparency, increased contrast, zoom, and touch-safe hover are in
  scope.

## Red-first expectation

Before implementation, the focused material test fails because the current
header is a full-width opaque strip: its inner surface has no rounded glass
geometry, translucent background, backdrop filter, or elevation. The CSS
resilience test also fails because it lacks unsupported-filter,
reduced-transparency, increased-contrast, fine-pointer-hover, and explicit
press-feedback contracts. The no-JavaScript visibility test fails at 320px
because `.no-script-nav` remains `display: none` while the visible mobile
trigger cannot open a Sheet without JavaScript.
