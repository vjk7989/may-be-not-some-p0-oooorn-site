# Interactive Buckleson Platform Panels validation matrix

## Scope

Replace only the homepage Platform product list with three progressively
disclosed product panels. Preserve the typed product data, product order,
qualified claims, `/products/#…` destinations, surrounding homepage sections,
and static-export model.

Initial state is Hyper Tern. Desktop supports pointer hover plus persistent
keyboard/click selection. Mobile presents a one-open accordion. The complete
product meaning must remain reachable without hover and without JavaScript.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Exact products | Panels are ordered Hyper Tern, Hyper-ABS, Hyper-0x and expose the exact approved summaries and links `/products/#hyper-tern`, `/products/#hyper-abs`, `/products/#hyper-0x`. |
| Initial state | Hyper Tern | On first render exactly Hyper Tern is expanded and its complete summary/link are visible. |
| Desktop pointer | Hover selection and persistence | At 1440px, hovering a different trigger expands it; moving into that panel's disclosed content does not collapse it. Hover is enhancement, not the only access path. |
| Desktop keyboard | Focus persistence | Focusing a trigger expands it, and the panel remains expanded while focus moves into its internal product link. |
| Keyboard activation | Enter and Space | Native button triggers respond to Enter and Space, update the one-expanded state, and Space does not unexpectedly scroll the page. |
| Mobile state | One-open accordion | At 320px and 390px, opening a panel closes the previous one; activating the already-open trigger leaves one panel open. Exactly one product remains expanded. |
| Accessibility | Disclosure semantics | Each trigger is a native button with unique `aria-controls` and accurate `aria-expanded`; the controlled content has the matching unique ID. Focus remains visible under the existing global focus contract. |
| Accessibility | No hover-only information | Every summary and product link is reachable through keyboard/click disclosure, and all three are visible in the no-JavaScript fallback. |
| Accessibility | Decorative diagrams | Each product diagram is `aria-hidden="true"`, contains no focusable descendants, and does not duplicate the product's accessible name or explanatory text. |
| Missing script | Static fallback | With JavaScript disabled, all three products, exact summaries, and links are visible and ordered; no inert trigger hides required content. |
| Motion preference | Reduced motion | With `prefers-reduced-motion: reduce`, disclosure remains operable and relevant panel transitions/animations are effectively static. |
| Responsive | Supported widths | At 320, 390, 768, 1024, and 1440px there is no horizontal overflow and the panel names plus current disclosure path remain usable. |
| Text enlargement | 200% | At a 1280px viewport with root text set to 200%, the section reflows without horizontal overflow and all three triggers remain operable. |
| Visual stability | CLS/overflow | Initial render and panel changes do not exceed CLS 0.10 and do not create horizontal document overflow. |
| Claims regression | Capability boundaries | Exact qualified summaries remain unchanged; the homepage panels do not add “100% secure,” “privacy guaranteed,” universal OWASP coverage, confidential-computing claims, or claims that blockchain/model output establishes truth. |
| Route regression | Product destinations | Every panel link remains an internal same-tab anchor to the corresponding product detail section; `/products/` continues to own full product/control content. |

## Boundary and failure classification

- Malformed user input: N/A — the component accepts no free-form input.
- Missing product content: applicable — exact count, order, summary, link, and
  ID assertions fail deterministically if typed data is omitted or mismatched.
- State transitions: applicable — initial selection, hover, focus, Enter, Space,
  mobile replacement, and repeated activation are covered.
- Failure/recovery: applicable — leaving the trigger for its disclosed content
  must preserve desktop state; repeated mobile activation must retain one usable
  open panel.
- Runtime I/O: no product I/O is required. Tests reject unexpected external
  requests during the homepage render; links are not followed.
- Security: limited applicability — content is trusted typed local data and
  internal links; no new HTML injection, form, authentication, or authorization
  boundary is introduced. Existing static and dependency checks remain active.
- Concurrency: N/A — one local component owns one selected value and there is no
  shared server or multi-user state.
- Time: N/A — selection must not depend on clocks, delays, autoplay, or timers.
- Randomness: N/A — initial product, ordering, IDs, and transitions are fixed.
- Persistence: N/A — selection does not survive navigation or store user data.

## Red-first expectation

Before implementation, the focused tests fail because `.product-row` entries
are static articles: there are no disclosure buttons, no initial expanded state,
no `aria-expanded`/`aria-controls` relationship, no one-open interaction model,
and no per-product decorative diagrams. The existing static list does preserve
the product order, summaries, links, and no-JavaScript meaning; those regression
facts must remain true during the replacement.
