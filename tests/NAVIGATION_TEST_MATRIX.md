# Navbar change validation matrix

## Scope

The header navigation must expose this exact visible sequence everywhere the
header provides navigation:

1. Home — `/`
2. About — `/about/`
3. Products — `/products/`
4. Services — `/services/`
5. Blog — `/blog/`
6. Contact Us — `https://cal.com/buckleson-group/30min`

The change is limited to header navigation composition. Page content, footer
composition, routes, and the approved calendar destination remain unchanged.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Desktop primary navigation | At 1440px, the primary navigation is visible and contains exactly the six labels above, in order, with the exact destinations above. |
| Happy path | Mobile Sheet navigation | At 390px, opening the menu exposes exactly the same six labels and destinations in the same order. Escape closes the Sheet and restores focus to the trigger. |
| Input boundaries | Smallest supported viewport | At 320px, the menu trigger remains visible and opening it exposes all six links without horizontal document overflow. |
| Missing input | JavaScript disabled | The `Navigation without JavaScript` fallback contains the same six labels and destinations in order. |
| State transition | Current route | Home has `aria-current="page"` at `/`; About has it at `/about/`; Blog has it on a blog article route. Exactly one header navigation link is current in each checked state. Contact Us is never current. |
| Link behavior | Internal and contact destinations | Internal items resolve to their exact local paths. Contact Us retains the approved Cal.com URL and same-tab behavior (no `_blank`). |
| Keyboard/accessibility | Semantics and focus | Desktop, mobile, and fallback navigation retain distinct accessible names; the mobile trigger has an accessible name and state; menu close restores trigger focus; visible labels are not replaced by icon-only controls. |
| Responsive regression | Header layouts | Desktop navigation is visible at 1440px; the mobile trigger is visible at 320px, 390px, and the established 1024px breakpoint; no horizontal overflow is introduced. |
| Route regression | Existing pages | Home, About, Products, Services, and Blog routes remain available; existing semantic-shell coverage remains authoritative. |
| Failure/recovery | Dismiss mobile menu | Escape returns the closed state and focus to the trigger; this is already covered by the production E2E suite and remains required. |
| Security | External-navigation safety | Contact Us uses the already approved HTTPS Cal.com URL and does not introduce script URLs or a new external target. |
| Accessibility | Active and operable navigation | `aria-current` is unique and correct; all six entries are native links exposed through the named navigation landmark. |

## Not applicable

- Malformed user input: N/A — the navigation is typed, local static data and
  accepts no user input.
- Concurrency: N/A — the site is a deterministic static export with no shared
  mutable state.
- Time: N/A — navigation output does not depend on clocks or schedules.
- Randomness: N/A — navigation order and destinations are fixed.
- Runtime network I/O: N/A for rendering — links do not fetch data while the
  navigation is rendered. Following Contact Us intentionally leaves the site
  and is not exercised in the test.
- Authentication/authorization: N/A — every route in scope is public.
- Persistence/recovery: N/A — the navigation stores no data; Sheet dismissal
  is the only relevant UI recovery transition and is covered above.

## Expected red-first failures

Before implementation, the focused browser checks must fail because the
desktop primary navigation omits Home, orders About after Services, labels the
CTA “Book an assessment,” and does not include it in the primary navigation.
The mobile navigation similarly uses the old order and places a differently
named assessment CTA outside its navigation landmark. The no-script fallback
omits Home and Contact Us. Home also lacks current-page semantics.
