# Homepage visual-polish test matrix

## Scope

This matrix covers only the approved homepage polish slice:

1. Replace the three equal numbered service cards with an asymmetric ruled
   service list while preserving all service copy, boundary copy, and the
   `/services/` link.
2. Preserve three semantic outcome articles while presenting them as one
   connected control chain.
3. ~~Make the sticky header opaque and remove backdrop blur.~~ Superseded by
   `tests/GLASS_NAVBAR_TEST_MATRIX.md` after approval of the shared glass navbar.
4. Tighten the Hyper-0x section's vertical density without changing its
   content or capability boundary.
5. Add no dependency or asset and preserve the existing responsive,
   accessibility, reduced-motion, static-output, and performance guarantees.

The test contract deliberately avoids prescribing exact CSS declarations. The
new compositions must remain free to use the existing tokens and spacing scale.
Visual connectedness, asymmetry, and rhythm require browser review in addition
to deterministic DOM and computed-style checks.

## Risk-based matrix

| Category | Scenario | Smallest deterministic check | Acceptance criterion |
| --- | --- | --- | --- |
| Happy path | Services retain meaning | On `/`, locate `.services-section`; compare its three service headings, summaries, and boundary paragraphs with the typed `services` data in source order | Exactly AI Security, Secure Inference, and Custom AI render once each; every summary and boundary is unchanged |
| Happy path | Services use the new composition | At 1440px, inspect the three service article boxes and a desktop capture | The list reads as one asymmetric ruled composition, not three equal cards; rule/alignment treatment is clear and no item is visually detached |
| Happy path | Services route remains reachable | Inspect and activate the link named `View all services` | It resolves to `/services/` in the same tab and remains keyboard focusable |
| Happy path | Outcomes retain meaning | Locate `.outcomes-section article` and compare heading/body text in DOM order | Exactly three semantic articles remain, ordered Protect data → Control actions → Verify execution, with their existing descriptions unchanged |
| Happy path | Outcomes read as a chain | At 1440px, compare article bounding boxes and inspect a desktop capture | The three items form one obvious left-to-right connected sequence; connectors do not cover text and are decorative to assistive technology |
| Happy path | Header surface | Superseded by `tests/GLASS_NAVBAR_TEST_MATRIX.md` | The current shared-navbar glass and fallback contract is validated there |
| Happy path | Hyper-0x density is reduced | Compare the section bounding box with the pre-change desktop capture/measurement and inspect all descendants | Desktop vertical height/padding is materially smaller while the logo, status, H2, explanatory paragraph, four definition rows, and Explore Hyper-0x link remain fully visible |
| Input boundaries | Responsive widths | Re-run homepage checks at 320, 390, 768, 1024, and 1440 pixels plus the existing 200% text-size test | No document-level horizontal overflow, clipped copy, overlapping rules/connectors, or obscured navigation/CTA |
| Input boundaries | Longest preserved copy | At 320px and 200% text size, inspect Secure Inference's boundary and the Hyper-0x disclaimer | Text wraps inside its own section without truncation, overlap, ellipsis, or horizontal scrolling |
| Malformed or missing input | Missing service/outcome content | N/A for runtime input: the page consumes repository-owned typed constants and has no form, CMS, fetch, or user-supplied data | Protect with exact count/text regression assertions rather than inventing unreachable malformed-input states |
| State transitions | Sticky header during scroll | Superseded by `tests/GLASS_NAVBAR_TEST_MATRIX.md` | Current sticky glass and fallback behavior is validated there |
| State transitions | Mobile menu | Run the existing open, Escape, focus-return, and `aria-expanded` check after the header CSS change | Behavior and accessible state are unchanged; the header does not obscure the sheet trigger or sheet |
| State transitions | Hover/focus | Keyboard-focus the Services link and all header controls; pointer-hover the service/outcome regions where hover styles apply | Focus remains clearly visible; decorative connected/ruled treatment does not imply that non-interactive articles are clickable |
| Failure and recovery | CSS unavailable or partial enhancement absent | Inspect generated static HTML and optionally disable styles in the browser | All service/outcome/Hyper-0x content and the Services link retain meaningful source order; CSS is not required to understand the page |
| Failure and recovery | Visual treatment fails to load | N/A for network recovery: no new remote asset or runtime request is authorized | Static semantic content remains the complete fallback; no loading/error UI is introduced |
| Regression | Service claims and boundaries | Re-run the production content/claim validator and exact homepage assertions | No copy is rewritten, dropped, or promoted beyond its existing qualified claim |
| Regression | Hyper-0x claims | Assert the current status, full paragraph, four `dt`/`dd` pairs, and product link | Tightened layout changes only presentation; evidence/verification/audit/settlement wording and the confidentiality/model-truth disclaimer are unchanged |
| Regression | Semantic structure | Count section headings, articles, definition terms, landmarks, links, and decorative icons | One H1 remains; outcome/service headings stay ordered under their H2; three outcome articles remain; decorative connectors/icons are not named or focusable |
| Regression | Design system | Inspect changed CSS/markup and run `design:lint`, lint, and typecheck | Existing tokens are reused; the only glass/blur exception is the shared navbar documented in `DESIGN.md`; no gradient, arbitrary z-index, or one-off dependency-backed component is added |
| Regression | Dependency and asset boundary | Diff `package.json`, `package-lock.json`, and `public/` against the pre-slice state; inspect new imports | No dependency/version/lockfile change, no new asset, no CDN/remote font/script, and no new runtime request |
| Concurrency | Mutable shared state | N/A: these are static server-rendered marketing sections with no write path or multi-user state | No concurrency test is introduced |
| Time | Timers and transitions | Header and layout have no timer-dependent behavior; reduced-motion test covers any existing animation | Assertions do not wait on arbitrary timeouts; layout is correct on first stable frame |
| Randomness | Layout/content generation | N/A: content and layout are deterministic local code | Repeated captures at the same viewport produce the same structure and geometry apart from rendering tolerance |
| I/O | Local static output | Monitor requests while loading and scrolling `/` | No new network request occurs; only existing local build assets load |
| Security | New executable surface | Review the diff and generated HTML | No inline handler, injected HTML, remote executable asset, form, script, or unsafe URL is introduced |
| Accessibility | Semantic and keyboard behavior | Run Axe plus existing skip-link/mobile-menu tests; inspect roles and accessible names | No serious/critical Axe violation; header controls and Services link have visible focus; outcomes/services remain semantic and correctly ordered |
| Accessibility | Reflow and zoom | Exercise 320px and 200% text size, including all polished sections | Reading order matches visual order; no two-dimensional scrolling; controls remain at least 44px where applicable |
| Accessibility | Reduced motion | Emulate `prefers-reduced-motion: reduce` and inspect the complete page | No new continuous motion is introduced; all content and connective meaning remain visible without animation |
| Performance | CSS-only polish | Run the existing three-run Lighthouse mobile gate | Performance, Accessibility, Best Practices, and SEO medians remain ≥95; LCP ≤2.5s, CLS ≤0.10, and TBT ≤200ms |

## Smallest tests to add or change before implementation

### 1. Add one focused Playwright test

Add a single `homepage polish contract` test to
`tests/e2e/production-website.spec.ts`. It should:

- use a 1440px viewport and load `/`;
- assert exactly three `.outcome-item` articles and their exact ordered
  heading/body text;
- assert exactly three service articles and their exact service heading,
  summary, and boundary text;
- assert the `View all services` link has `/services/` as its resolved path;
- assert the complete Hyper-0x status, paragraph, four definition pairs, and
  link remain present;
- apply the current shared-navbar checks from `tests/GLASS_NAVBAR_TEST_MATRIX.md`;
- assert each polished section has no element extending past its section or
  the document viewport.

Use roles/text for meaning and existing stable section classes only for
geometry/style boundaries. Do not add test-only attributes unless an element
otherwise has no semantic selector.

### 2. Extend the existing responsive loop, not the suite size

Inside the current 320/390/768/1024/1440 homepage overflow test, add visibility
checks for the three outcome headings, the three service headings, and the
Hyper-0x heading. This catches reflow regressions without creating five more
tests.

### 3. Keep visual review explicit and bounded

Capture only four screenshots after deterministic checks pass:

- homepage at 1440px;
- homepage at 390px;
- outcomes + services crop at 1440px; and
- Hyper-0x crop at 1440px.

Compare against the pre-change capture for hierarchy and density. Reject the
change if the service list still reads as three equal cards, the outcomes do
not read as a connected sequence, the header visually merges with page
content, or the Hyper-0x content becomes cramped. Do not add pixel snapshots;
they would be brittle across browser/font-rendering environments and would not
reliably judge the intended composition.

### 4. Reuse existing gates

No new package or test framework is justified. Run, through the workspace
wrapper, the existing gates most relevant to this CSS/markup slice:

1. `design:lint`
2. `lint`
3. `typecheck`
4. `test:unit`
5. `build`
6. `test:content`
7. `test:links`
8. `test:e2e`
9. `test:a11y`
10. `test:performance`

## Slice acceptance criteria

The slice passes only when all of the following are true:

- Services appear as an asymmetric ruled list, not equal numbered cards, while
  the three service names, summaries, boundaries, source order, semantic
  articles, and `/services/` link are intact.
- Outcomes remain three semantic articles with unchanged copy and an obvious
  Protect data → Control actions → Verify execution visual chain on desktop;
  mobile preserves that same top-to-bottom semantic order.
- The sticky-header material clause is superseded by
  `tests/GLASS_NAVBAR_TEST_MATRIX.md`; current checks cover rest and scrolling
  on desktop and mobile while preserving navigation and focus behavior.
- Hyper-0x is visibly denser vertically without clipping or changing any text,
  status, definition, disclaimer, image proportion, or link.
- No new dependency, asset, remote resource, interactive state, or executable
  surface is introduced.
- Existing content, link, responsive, keyboard, Axe, reduced-motion, SEO,
  static-output, and Lighthouse gates all pass.
- Independent desktop and mobile review confirms the intended composition and
  finds no overlap, clipping, awkward wrapping, or misleading affordance.
