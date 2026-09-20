# Buckleson content-system and website rebuild test matrix

## Purpose and gate order

This is the independent, risk-based acceptance contract for replacing the
current presentation with the approved Buckleson rebuild. The typed local
content module is authoritative; pages may transform its data for
presentation, but must not restate product or claim data in a second source of
truth.

Execute gates in dependency order:

1. typed content contract and unit tests;
2. static content, route, link, claim, asset, and SEO validation;
3. build and GitHub Pages export validation;
4. focused navbar, homepage, products, and product-detail browser tests;
5. full accessibility and responsive regression;
6. three-run Lighthouse cohort and independent visual review.

A dependent slice does not proceed until its focused gate passes. Tests must
run through `scripts/Invoke-WorkspaceNodeTool.ps1`. Reference sites are design
inspiration only; the built site must not request their assets or reproduce
their copy, identity, customer claims, or illustrations.

## Authoritative content contract

`src/content/buckleson-site-content.ts` must export these public TypeScript
interfaces and their populated local data:

- `CompanyContent`
- `NavigationItem`
- `PageDefinition`
- `ProductContent`
- `ServiceContent`
- `RiskContent`
- `FaqItem`
- `CapabilityStatus`

The module must represent company identity, approved positioning, mission,
vision, audiences, company status, responsibility boundaries, navigation and
mega-menu destinations, pages and metadata, products, services, risks,
industries, FAQs, CTAs, footer content, status distinctions, and prohibited
claim rules. Values must be deterministic local literals with no network,
clock, randomness, browser-global, or environment dependency.

The exact public navigation order is `Home`, `About`, `Products`, `Services`,
`Blog`, `Contact Us`. `Contact Us` links in the same tab to
`https://cal.com/buckleson-group/30min` and is not a local route.

The exact product family is `Hyper Tern`, `Hyper-ABS`, and `Hyper-0x`:

- Hyper Tern controls routing, identities, permissions, policies, tools, and
  action boundaries. It helps constrain excessive agency, tool misuse, goal
  manipulation, and unauthorized actions resulting from unsafe requests.
- Hyper-ABS supports masking, redaction, tokenization, abstraction, and
  reduced sensitive-data exposure before inference. It helps reduce sensitive
  information disclosure and unnecessary data exposure.
- Hyper-0x is Buckleson's in-house blockchain for attributable,
  tamper-evident execution evidence, verification, audit, and settlement. It
  can help reveal changes to recorded evidence; it does not prevent prompt
  injection, create confidentiality, or prove a model output true.

The exact service family is `AI Security`, `Secure Inference`, and `Custom AI`
model development and fine-tuning. Secure Inference means protection and
control before and around inference, not an unsupported confidential-computing
capability.

`CapabilityStatus` must distinguish `Current capability`, `Pilot stage`,
`Designed for`, and `Long-term vision`. Presentations must not merge or imply
promotion between these states.

## Risk-based matrix

| Category | Scenario | Deterministic check | Acceptance criterion |
| --- | --- | --- | --- |
| Happy path | Typed content exports | Import the content module in a unit test and type-check named exports | All eight required interfaces/types are exported; populated data is importable without side effects |
| Happy path | Company identity and positioning | Assert exact approved literals in the content module and rendered homepage | `Buckleson`, `We help you use AI safely.`, trust/execution positioning, intended audiences, mission, vision, status, calendar URL, and responsibility boundary are present |
| Happy path | Navigation source | Compare navigation data and rendered desktop/mobile links | Exact order is Home, About, Products, Services, Blog, Contact Us; internal routes and the external calendar destination are correct |
| Happy path | Page registry | Compare page definitions, filesystem routes, sitemap, and built output | `/`, `/about/`, `/products/`, three product details, `/services/`, `/blog/`, six article routes, and custom `/404.html` exist; no local Contact route is created |
| Happy path | Product data | Assert exact product names, slugs, statuses, summaries, controls, architecture, related risks, and claim boundaries | Three products have unique stable slugs and accurate qualified descriptions; Hyper Wallet is absent |
| Happy path | Service data | Assert names, slugs, summaries, boundaries, and related products | All three services render from the authoritative module with the approved inference boundary |
| Happy path | Risks, industries, FAQs, and CTAs | Compare source arrays with rendered cards/rails/accordions and footer | Every configured item appears once where intended, identifiers are unique, CTA text/destination are exact, and no empty placeholder is rendered |
| Happy path | Homepage sequence | Inspect semantic sections in DOM order | Navbar; hero; positioning; three responsibilities; product rail; services; mission/vision; Hyper-0x band; risk scenarios; Assess/Protect/Control/Verify process; principles; FAQ; three recent articles; assessment CTA; footer appear in that order |
| Happy path | Products bento | Inspect product overview at desktop and narrow widths | One featured product tile and two supporting tiles render all three products; each links to its correct detail route and exposes benefit, architecture, and risk-control meaning |
| Happy path | Product detail routes | Inspect H1, sections, statuses, internal links, and metadata | Each route has unique product-specific copy, architecture and relevant risks; Hyper-0x visibly separates current capability from designed-for features |
| Input boundary | Required strings | Construct fixture copies with an empty or whitespace-only required value | Validation rejects empty company, page, product, service, risk, FAQ, CTA, metadata, and route fields with a stable field path |
| Input boundary | Collection sizes and uniqueness | Test empty arrays, duplicate IDs/slugs/routes, and the expected product/service/navigation cardinality | Required collections are non-empty; product count is three, service count is three, navigation count is six; IDs, slugs, routes, article slugs, and keys are unique |
| Input boundary | Routes and URLs | Test trailing slashes, fragments, unsafe schemes, external and internal destinations | Local routes are root-relative and compatible with the configured base path; external destinations are valid `https:` URLs; `javascript:`, protocol-relative, traversal, and blank URLs fail |
| Input boundary | Metadata | Count H1s and validate titles/descriptions/canonicals for every indexable page | Exactly one visible H1; non-empty unique metadata; canonical paths match routes; product details and articles are included in sitemap |
| Malformed or missing input | Missing data object/member | Delete each required top-level group and representative nested fields in validator fixtures | Validation fails closed with an actionable field path; pages never silently invent fallback claims |
| Malformed or missing input | Invalid capability status | Inject an unknown or misspelled status | Typecheck or runtime content validation fails; UI never renders an unclassified capability |
| Malformed or missing input | Product-risk relation | Reference an unknown risk/product slug or duplicate a relation | Validation rejects dangling and duplicate relations; every rendered relation resolves to authoritative data |
| Malformed or missing input | Unsafe rich content | Inject markup, raw `<`, inline handlers, and script-like URLs in content fixtures | Data remains plain text or reviewed local JSX; JSON-LD escapes `<`; no untrusted executable markup is emitted |
| State transition | Desktop mega menu | Hover/focus About, Products, Services, and Blog; move the pointer through the trigger-to-panel corridor; then switch triggers | One matching panel remains open during safe travel, changes without flicker, and closes on outside interaction or Escape; Home has no invented submenu |
| State transition | Mega-menu navigation | Activate top-level links and every submenu destination by pointer and keyboard | Top-level links still navigate to their landing page; sublinks reach valid sections/routes; current route semantics remain accurate |
| State transition | Mobile navigation | Open Sheet, expand/navigate grouped destinations, press Escape, navigate a link, and restore focus | Minimum 44px targets, valid `aria-expanded`/controls, one coherent menu state, focus trap/restoration, Escape dismissal, and route navigation work |
| State transition | Navbar motion and Contact CTA | Exercise hover, focus, press, current-route, reduced-motion, and click states | Letter-stagger treatment remains readable; current route is violet; Contact Us remains a separate violet outlined oval and inverts without layout shift |
| State transition | Product bento reveal | Hover, focus, tap, and leave each product tile | Benefit/architecture/risk detail is available without hover-only loss, links remain operable, and media/depth effects do not move adjacent layout |
| State transition | Product/work and risk rails | Use previous/next, keyboard, touch/drag or scroll-snap behavior at relevant widths | Items advance predictably, selected/current state is exposed accessibly, boundaries do not overscroll into blank content, and all items remain reachable |
| State transition | Services/capabilities and FAQ | Activate headers using click, Enter, and Space; move between items rapidly | Correct panel and `aria-expanded` state remain synchronized; content is never duplicated or lost; disclosure focus stays stable |
| State transition | Four-step process | Navigate Assess, Protect, Control, Verify controls if interactive | Exactly one active explanation when enhanced; all four stages remain understandable in static markup |
| Failure and recovery | Animation startup/cleanup | Navigate away and back, resize/orient, background/foreground the document, and unmount route-local motion | No console errors, duplicate timelines/listeners, stale state, or orphaned animation; hidden documents pause where applicable |
| Failure and recovery | Missing or blocked image | Abort generated-media and brand-display derivative requests | Headings, body copy, links, controls, and product identity remain usable; dimensions reserve layout and no broken-image text collision occurs |
| Failure and recovery | JavaScript disabled | Load all principal routes with JavaScript disabled | Navigation destinations, product details, homepage meaning, disclosures/FAQ content, process, risks, and CTAs remain present and usable; animation is enhancement only |
| Failure and recovery | Build/output absent | Run static validators with missing or zero-byte `out/` entries in isolated fixtures | Validator exits non-zero with aggregated route/file diagnostics rather than an unhandled exception |
| Failure and recovery | Repeated validation | Run deterministic validators twice against unchanged input | Exit code and diagnostics are identical; checks do not mutate sources or require fixture reset |
| Regression | Claim prohibitions | Search normalized visible content and structured data with negation-aware assertions | No guaranteed safety/privacy, universal attack prevention/detection, universal OWASP coverage, model-output truth proof, confidential-computing claim, or implication that blockchain creates confidentiality |
| Regression | Fabricated evidence | Search content for customers, testimonials, team members, deployments, certifications, revenue, funding/runway, performance statistics, pricing, and quantified outcomes | No unsupported instance is present; risk scenarios and principles are not styled or marked up as testimonials or client evidence |
| Regression | Capability separation | Inspect every capability/roadmap statement and its nearby status marker | Current, pilot, designed-for, and vision content is visibly and semantically distinguished on Home, About, Products, and product details |
| Regression | Product responsibility boundaries | Assert page-specific language and prohibited cross-claims | Hyper Tern owns execution control, Hyper-ABS owns exposure reduction, and Hyper-0x owns evidence/audit/settlement; no page assigns one product another's guarantee |
| Regression | Existing blog corpus | Build and navigate the six approved article slugs; inspect metadata, Article/Breadcrumb JSON-LD, and internal CTAs | All articles remain indexable, readable, internally linked, and unchanged in claim boundary unless deliberately sourced from the new data module |
| Regression | Custom 404 | Navigate root and nested missing URLs locally and under the Pages base path | Custom page renders with `noindex`, valid home recovery link, no ordinary header/footer chrome if that remains its contract, and real missing-route behavior |
| Regression | Official brand assets | Hash and inspect source dimensions; compare rendered proportions | Buckleson JPEG and Hyper-0x PNG retain approved hashes/dimensions and are not redrawn, recolored, cropped, stretched, or recompressed; derivatives do not replace sources |
| Regression | Removed presentation | Search imports, rendered output, test inventory, and CSS selectors after migration | Superseded hero/risk/platform presentation code and presentation-only tests/styles are absent; retained accessibility, 404, header, blog, and deployment behavior still pass |
| Concurrency | Multi-user/server state | N/A — the site is a deterministic static marketing export with no mutable server, account, or shared session state | Do not invent concurrency infrastructure or tests |
| Concurrency | Overlapping UI input | Rapidly alternate hover/focus/tap across mega menus, disclosures, rails, and bento tiles | Final state matches the latest user action; no duplicate panels, lost focus, stuck overlay, or uncaught transition error |
| Time | Animation timing | Use bounded polling and computed end-state checks rather than frame-perfect delays | Interactions settle within documented bounds without asserting a single frame or wall-clock timestamp |
| Time | Publication dates | Validate fixed ISO article dates and sitemap output syntactically | Tests do not depend on the current date; repeated builds do not rewrite dates |
| Randomness | Content, layout, and animation | Scan production code for random content/order and compare two builds where practical | Ordering and initial frames are deterministic; no `Math.random()` or random IDs drive public output |
| I/O | Local static delivery | Serve `out/` locally and observe all requests across principal routes | Site content and interaction require only local build assets; calendar/authority links are inert until user activation |
| I/O | Route-specific loading | Record homepage, product, detail, blog, and 404 script/image requests | Route-only animation/media chunks do not load on unrelated pages; first hero media is eager and below-fold media is lazy with reserved dimensions and async decoding |
| I/O | Remote reference isolation | Reject requests to Spartan, Framer, PAVii, reference CDNs, and other unapproved asset/font/script hosts | Zero runtime request and zero bundled copied asset from reference sites |
| Security | Static execution boundary | Inspect source/output for remote scripts/styles/fonts, inline handlers, `javascript:` URLs, unexpected forms, and unsafe target behavior | None are present; external links use safe semantics; Contact Us deliberately stays same-tab |
| Security | Dependency and content boundary | Inspect lockfile diff and run applicable audit without force-upgrading | No new runtime package beyond approved existing dependencies; known audit debt is reported accurately and not hidden by weakening gates |
| Security | JSON-LD serialization | Parse all structured data and inspect serialized source | Valid typed Organization, WebSite, Article, and Breadcrumb data uses authoritative local content and escapes raw `<` |
| Accessibility | Semantic document structure | Inspect landmark names, H1/heading order, lists, buttons vs links, image alternatives, and skip target | Each page has a coherent semantic outline, one main region, distinct navigation names, correct controls, and meaningful or intentionally empty alt text |
| Accessibility | Keyboard and focus | Traverse every navigation, menu, bento link, rail, disclosure, process control, CTA, and footer link | DOM order follows visual order; every action is reachable; focus is visible and never obscured or trapped except intentionally inside the open Sheet |
| Accessibility | Non-color meaning | Inspect status, risk, verified, and blocked treatments in grayscale/high contrast | Text or icon labels convey all states; violet, green, and red are never the sole differentiator |
| Accessibility | Motion preferences | Emulate reduced motion and inspect hero, media drift, bento, nav, rails, and disclosures | Continuous/parallax motion stops and traveling/staggered effects become immediate while complete content and state remain visible |
| Accessibility | Transparency/contrast preferences | Emulate reduced transparency and increased contrast where supported | Header/menu backgrounds become legible opaque surfaces; focus, borders, text, and controls maintain WCAG 2.2 AA contrast |
| Accessibility | Responsive containment | Test 320x568, 390x844, 844x390, 768x1024, 1024x768, 1366x768, 1440x900, and 1920x1080 | No horizontal overflow, clipped meaningful content, obscured focus, inaccessible controls, or internal section scrollbars; bento/rails stack or scroll as designed |
| Accessibility | Text enlargement | Apply 200% root text sizing at a 720x450 viewport and inspect principal routes | Content reflows without overlap/loss; navigation remains operable; short viewports grow naturally rather than clip |
| Accessibility | Automated audit | Run Axe on Home, About, Products, three product details, Services, Blog, one article, and 404 | No serious or critical violations; automated success does not replace keyboard/visual checks |
| Performance | Critical loading | Inspect priority/loading attributes, responsive derivatives, route chunks, and coverage | Only the first hero asset is eager; below-fold media is lazy; original assets retain hashes; no unnecessary site-wide animation bundle or preload is introduced |
| Performance | Layout stability | Observe initial load, font swap, media load, menu/disclosure transitions, and rail movement | CLS <= 0.10; explicit media dimensions and stable containers prevent content jumps |
| Performance | Mobile budgets | Run Lighthouse three times on the built homepage and use medians | Performance, Accessibility, Best Practices, and SEO are each >=95; LCP <=2.5s; TBT <=200ms; CLS <=0.10; any miss is reported, not reclassified as passing |
| Deployment | Static export and base path | Build with the GitHub Pages environment/base path and resolve HTML, chunks, CSS, images, links, favicon, sitemap, robots, and 404 | Every route and asset works both locally and at the repository subpath; no root-only URL breaks Pages |
| Deployment | Workflow and live provenance | Validate Pages workflow, artifact, deployed commit SHA, HTTP status, and representative live content after push | Workflow succeeds from `main`; deployed SHA matches the pushed commit; root, details, article, and missing route are verified live before completion is claimed |

## Required route inventory

- `/`
- `/about/`
- `/products/`
- `/products/hyper-tern/`
- `/products/hyper-abs/`
- `/products/hyper-0x/`
- `/services/`
- `/blog/`
- `/blog/ai-agent-security/`
- `/blog/prompt-injection-prevention/`
- `/blog/secure-ai-inference/`
- `/blog/llm-data-leakage/`
- `/blog/excessive-agency/`
- `/blog/ai-audit-trails/`
- `/robots.txt`
- `/sitemap.xml`
- `/404.html`

The build must not create `/contact/`, `/pricing/`, `/team/`, `/testimonials/`,
`/case-studies/`, `/privacy/`, or `/terms/` until real approved content exists.

## Smallest executable test additions

Add only these focused files, extending existing shared helpers and validators
instead of creating a second framework:

1. `src/content/buckleson-site-content.test.ts`
   - Unit-contract tests for required exports, exact order/cardinality,
     uniqueness, relations, URL safety, capability states, claim boundaries,
     prohibited assertions, and deterministic local data.
2. Extend `tests/Validate-ProductionWebsite.ps1`
   - Static export checks for the new product-detail routes, page registry,
     metadata/sitemap, exact content, prohibited routes/claims, official asset
     hashes, lazy-loading attributes, internal/base-path links, and remote
     reference isolation. Add malformed fixture cases to its existing fixture
     model rather than introducing another PowerShell validator.
3. `tests/e2e/rebuild-homepage.spec.ts`
   - Homepage order, cinematic hero/static fallback, responsibilities, product
     and risk rails, services/process/FAQ interactions, responsive containment,
     no-JS, reduced motion, route-only loading, and focused Axe coverage.
4. `tests/e2e/rebuild-products.spec.ts`
   - Bento geometry and interactions, all three detail routes, status and risk
     mappings, keyboard/touch parity, claim boundaries, blocked-image recovery,
     responsive/200% behavior, and focused Axe coverage.
5. Extend `tests/e2e/site-header-mega-menu.spec.ts`
   - New data-driven destinations while retaining the existing safe pointer
     corridor, keyboard/Escape/focus, centered desktop navigation, mobile
     Sheet, current route, letter motion, and Contact Us contract.

Existing `production-website.spec.ts`, article, 404, GitHub Pages, accessibility,
and Lighthouse suites remain regression gates; do not duplicate their generic
coverage in new files.

## Deliberate limits and N/A categories

- Authentication, authorization, accounts, persistence, database migrations,
  APIs, forms, payments, analytics, email, and booking submission are N/A: no
  such behavior is authorized.
- Multi-user concurrency and server recovery are N/A: the output is a static
  export. Only rapid overlapping client interactions need state-race coverage.
- Content-management workflows are N/A: content is typed, reviewed, and local.
- External service uptime is N/A: tests validate the exact Cal.com and cited
  HTTPS destinations without submitting or depending on them.
- Visual quality cannot be proven by DOM assertions alone. After automated
  gates pass, the independent runner must compare desktop, mobile, landscape,
  and product-detail captures against `DESIGN.md`, checking hierarchy,
  alignment, crop quality, motion restraint, and originality.
- Pixel-for-pixel equivalence to Spartan AI or PAVii is explicitly not an
  acceptance criterion. The required outcome is an original Buckleson design
  with analogous layout rhythm and interaction quality.
