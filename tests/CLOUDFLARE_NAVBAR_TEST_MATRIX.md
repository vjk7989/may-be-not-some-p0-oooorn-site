# Cloudflare-inspired navigation acceptance matrix

## Scope and dependency graph

This contract covers the shared header only. It preserves Buckleson's existing
rolling labels, routes, static export, and real 404 behavior while adding
progressive disclosure around the existing About, Products, Services, and Blog
links. Cloudflare is an interaction reference, not a visual or content source.

| Node | Work item | Dependencies | Boundary | Acceptance | Parallel-safe |
| --- | --- | --- | --- | --- | --- |
| N1 | Define destinations from current local data and route anchors | None | Test data | Every destination is an existing route/anchor; Blog uses the first three entries in `articleRegistry` | Yes, read-only |
| N2 | Add desktop/mobile/no-script interaction acceptance tests | N1 | Header browser contract | The checks below are discoverable and initially fail only where the new behavior is absent | No, one test-file write |
| N3 | Implement and verify the header | N2 | Production header/data/CSS | All focused checks and the broader existing navigation suite pass | No, production work owned separately |

There is no dependency cycle: content truth precedes interaction tests, and
tests precede implementation.

## Approved destination groups

- About: `/about/`, `#protect-title`, `#responsibility-title`, and
  `#status-title` (the current journey/vision boundary).
- Products: `/products/` and the existing `#hyper-tern`, `#hyper-abs`, and
  `#hyper-0x` product anchors.
- Services: `/services/` and the existing `#ai-security`,
  `#secure-inference`, and `#custom-ai` service anchors.
- Blog: `/blog/` plus the first three entries in the ordered local
  `articleRegistry`; with the current registry these are AI Agent Security,
  Prompt Injection Prevention, and Secure AI Inference.

The top-level labels remain native links to `/about/`, `/products/`,
`/services/`, and `/blog/`. Home is a native link with no disclosure. Contact
Us remains a same-tab native link to
`https://cal.com/buckleson-group/30min`.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Desktop destination groups | At 1440px the top-level sequence remains Home, About, Products, Services, Blog, Contact Us. About, Products, Services, and Blog each expose a labelled panel with exactly the approved real destinations. Home has no panel. |
| Content | Useful structure | Every panel destination has a concise visible title and non-empty supporting summary. No copied Cloudflare content, invented route, placeholder `#`, or dead fragment is introduced. |
| Click behavior | Labels remain links | Clicking a top-level internal label follows its existing page route. Hover/focus disclosure never replaces the anchor with a button or requires disclosure before navigation. |
| Pointer state | Stable hover corridor | Hover opens the matching panel. Moving from the label into that panel and dwelling there does not collapse it. Leaving the navigation dismisses it. |
| Exclusive state | One open panel | Opening Products after About closes About. At most one desktop panel is visible/expanded at any time. |
| Keyboard state | Focus entry and exit | Focusing a disclosure label opens its panel. Panel links are reachable in document order. Escape dismisses the panel; moving focus outside the disclosure group also dismisses it. Focus is never trapped or lost. |
| Active route | Current page semantics | Exactly one top-level internal link has `aria-current="page"`: Home on `/`, the matching section link on its route, and Blog on every `/blog/[slug]/` article. Contact Us and submenu links do not create a second page-current state. |
| Mobile | Equivalent grouped navigation | At 320px and 390px the Sheet exposes all four destination groups without hover dependence, preserves native links and ordered group labels, and retains Escape dismissal/focus restoration. |
| Missing script | Progressive enhancement | With JavaScript disabled, top-level routes, grouped destinations, and Contact Us are visible native anchors. Navigation does not depend on the inert Sheet trigger or client event handlers. |
| Contact action | Persistent visual priority | On desktop and mobile, Contact Us is a violet oval outline at rest. Hover and pointer press invert it to violet fill with white text; release restores the appropriate hover/rest state. Keyboard focus is visibly indicated independently of color. |
| Motion | Existing rolling labels | The accepted 449.344ms/37.0048ms per-character rolling-label contract remains unchanged for ordinary motion users. Mega-panel motion uses transform/opacity only and cannot gate semantic availability. |
| Reduced motion | Immediate/static state | Under `prefers-reduced-motion: reduce`, opening and dismissing a panel is immediate; panel descendants and rolling-label characters have no non-zero animation or transition duration. |
| Responsive | Width and 200% text | At 320, 390, 768, 1024, 1280, and 1440px, plus 200% root text size, the document has no horizontal overflow. Every visible panel stays inside the viewport and is not clipped by the glass shell. |
| Failure/recovery | Rapid modality changes | Pointer-open → keyboard-open → Escape → reopen leaves one coherent panel state and working links. Closing/reopening the mobile Sheet restores its trigger and does not retain a stale desktop disclosure. |
| Regression | Site behavior | Logo/skip link/sticky shell/base-path routing/static export remain intact. Unmatched routes still render the existing real 404 and the pre-existing Lighthouse LCP debt is not reclassified. |
| Accessibility | Semantics and audit | Panels are labelled by their controlling links, expanded state is exposed, duplicate rolling layers remain hidden, target sizes remain at least 44px, focus is visible, and Axe reports no serious/critical violations. |
| Security and I/O | Link safety | Internal destinations remain local, fragments resolve to unique IDs, and Contact Us is the sole approved HTTPS external destination with no `_blank`, inline handler, or script URL. No runtime content fetch is added. |

## Boundary and applicability classification

- **Malformed or missing data — applicable at the static boundary.** Navigation
  is typed local data, not user input. Missing labels, duplicate/empty hrefs,
  unsafe protocols, non-existent fragments, or fewer than three registered
  articles must fail type/unit/link validation rather than produce a broken
  interactive item. Runtime form-validation cases are not applicable because
  the header accepts no input.
- **State transitions and recovery — applicable.** Hover/focus entry, pointer
  transfer, exclusive-open state, Escape, focus exit, Sheet close/reopen, and
  modality changes are the principal regression risks.
- **Concurrency — not applicable.** The header has one browser-local state and
  no asynchronous shared mutation, multi-user data, worker, or server write.
  Rapid sequential modality changes cover the relevant race-like boundary.
- **Time — applicable only to presentation.** The existing deterministic
  rolling-label timing remains authoritative; no delayed close may break the
  pointer corridor. No clock, locale, schedule, or timer-backed business state
  exists.
- **Randomness — not applicable.** Navigation order, recent-article order, and
  open state are deterministic. “Recent” means the registry's explicit first
  three entries; the header must not sort against wall-clock time.
- **Network I/O — regression only.** Rendering and menu opening use local
  static data with zero runtime fetches. Tests validate, but do not follow, the
  external Cal.com destination.
- **Security — applicable to link protocols and injection resistance only.**
  All menu copy is repository-owned React content; there is no HTML injection,
  authentication, authorization, or sensitive-data boundary.
- **Accessibility — fully applicable.** Native-link semantics, labelled
  disclosures, current-page uniqueness, keyboard equivalence, focus visibility,
  reduced motion, zoom/reflow, and touch target sizing are release gates.

## Red-first expectation

Before production implementation, the focused browser file is expected to be
discoverable but fail because no desktop disclosure panels, mobile groups, or
grouped no-script destinations exist and Contact Us is still an unboxed nav
cell. Existing route, rolling-label, Sheet, and 404 tests should remain green;
implementation must update any superseded assertion that still requires
Contact Us to be unboxed.
