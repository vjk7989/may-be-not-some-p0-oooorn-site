# Architecture and Context Record

Last updated: 2026-09-19

## Current project state

- The approved Oat wireframe is retained in Git history as the recoverable
  baseline at commit `0c047e2`; it is no longer the active application.
- The active implementation is a statically exported Next.js App Router site
  under `src/`, with deployable output generated in `out/`.
- The production information architecture comprises Home, Products, Services,
  About, Blog, and six statically generated article routes, plus `robots.txt`
  and `sitemap.xml`.
- A local Git repository is initialized at `D:\high-quality` on branch `main`;
  the selected publication target is
  `vjk7989/may-be-not-some-p0-oooorn-site` on GitHub Pages.
- Graft v0.18.0 is installed locally through the project's Node dependencies.
- Graft configuration is present in `package.json`, `package-lock.json`, `opencode.json`, `.gitignore`, and `graft/`.
- Production validation passes after the mega-menu change: the focused navbar
  suite passes 10/10, the Platform mobile-hover regression passes 1/1, the
  independent combined E2E suite passes 100/100, and the dedicated
  accessibility slice passes 11/11. The aggregate `npm test` gate also passes,
  including both deterministic validators, Vitest 4/4, and Playwright 100/100;
  `git diff --check` passes. Lighthouse was not rerun for this change. Its
  retained three-run mobile cohort has a median LCP of 2,829.375 ms against the
  active 2.5 s budget; publication carries the explicit user-authorized
  exception recorded in D-033. See
  `tests/PRODUCTION_WEBSITE_TEST_MATRIX.md` for the acceptance contract; the
  wireframe validators remain historical evidence only.

## Established decisions

### D-001 — Keep all project data on the D drive

All source, generated artifacts, dependencies, caches configured by this project, test outputs, and project documentation must remain under `D:\high-quality`. Do not intentionally create project files or install project dependencies on the C drive.

### D-002 — Apply YAGNI

Implement only behavior required by the current accepted task. Avoid speculative abstractions, features, dependencies, and configuration. Prefer the smallest clear implementation that satisfies the requirement and its tests.

### D-003 — Decompose work into small verified tasks

Split each user request into the smallest practical implementation units. Complete and verify one area before moving to dependent work so failures remain localized and context stays manageable.

### D-004 — Use staged test gates

For each implementation area:

1. Define tests and edge cases using a dedicated test-writing subagent.
2. Implement the smallest code needed for the area.
3. Use a separate test-running subagent to execute the relevant test suite.
4. If tests fail or unexpected behavior appears, use another subagent to diagnose the failure and produce a focused repair plan.
5. Fix and rerun tests; do not advance to the next area until all tests for the current area pass.

### D-005 — Use Graft for repository context

Use the locally installed Graft v0.18.0 context graph for discovery before broad source searches. Start new-repository orientation with `graft map`; use `graft ask`, `graft skeleton`, `graft callers`, and `graft grep` according to `AGENTS.md`. Run `graft build` after substantial code changes.

### D-006 — Maintain context artifacts

Keep this document current with architectural decisions, notable implementation context, and the compact codebase map. A separate handoff artifact should summarize only session-specific continuation context and reference this file instead of duplicating it.

### D-007 — Isolate Node tool writes inside the workspace

All npm and npx commands run through `scripts/Invoke-WorkspaceNodeTool.ps1`.
The wrapper applies process-scoped npm cache, user-config, and temporary paths
under `D:\high-quality`, so inherited machine variables cannot redirect project
writes elsewhere. It deliberately does not alter user or machine settings.

### D-008 — Use the existing workspace as the local Git repository

- **Date:** 2026-09-13
- **Status:** Accepted
- **Context:** The project needed local version control while retaining the established workspace-storage boundary.
- **Decision:** Initialize `D:\high-quality` as the Git repository root and use `main` as its branch. No remote is configured.
- **Rationale:** Using the existing workspace preserves the D-drive constraint and avoids introducing another directory or relocating project data.
- **Consequences:** The requested hosted label `may-be-not-some-p0\@oooorn-site` remains unresolved. Local Git has no repository-name field, and no provider-safe slug or repository visibility has been selected.
- **Affected paths:** `D:\high-quality\.git`

### D-009 — Use a static Oat-based homepage for the approval wireframe

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** The user requested a browser-rendered homepage mock before
  selecting final visual elements or a production stack.
- **Decision:** Implement a single responsive, semantic HTML homepage using
  Oat UI plus one project stylesheet. Keep the preview intentionally
  wireframe-like and avoid a framework, build pipeline, or application runtime.
- **Rationale:** Static HTML is the smallest complete implementation for content
  and layout approval and keeps the artifact deterministic and low-overhead.
- **Consequences:** Product pages and the full risk library are represented by
  explicit placeholders; forms, routing, publishing, and production-stack
  selection remain out of scope until the homepage is approved.
- **Affected paths:** `dist/index.html`, `dist/assets/wireframe.css`

### D-010 — Vendor and pin Oat locally

- **Date:** 2026-09-16
- **Status:** Accepted
- **Decision:** Store Oat CSS and JavaScript in `dist/vendor/oat/`, pinned to
  upstream revision `6ec225a8971fa38d2cfc5444d21e0c65487c7a4e`, with its
  license and provenance recorded in `VERSION.txt`.
- **Rationale:** Local assets make the approval preview independent of a CDN and
  preserve deterministic rendering within the D-drive workspace constraint.
- **Consequences:** Updating Oat is an explicit revision change. Remote scripts,
  styles, fonts, and inline event handlers are rejected by validation.
- **Affected paths:** `dist/vendor/oat/`

### D-011 — Keep public claims qualified and capability status explicit

- **Date:** 2026-09-16
- **Status:** Accepted
- **Decision:** Present Buckleson as enterprise AI trust and execution
  infrastructure. Use qualified language such as “helps reduce,” “controls,”
  and “supports auditability”; identify Hyper-0x as Buckleson’s in-house
  blockchain for verification, audit, and settlement; and visibly distinguish
  current, designed-for, in-progress, reported-current, and long-term-vision
  statements.
- **Rationale:** The wireframe must communicate the pitch-deck content without
  converting product intent into unsupported security guarantees.
- **Consequences:** Do not claim universal OWASP coverage, guaranteed privacy or
  security, confidential computing, cryptographically verified model
  computation, or expose confidential finance material. Secure inference means
  controls around the inference path. Source-defined risk names are retained.
- **Affected paths:** `dist/index.html`
- **References:** `tests/WIREFRAME_TEST_MATRIX.md`

### D-012 — Validate the wireframe with deterministic static and visual gates

- **Date:** 2026-09-16
- **Status:** Accepted
- **Decision:** Use `tests/Validate-Wireframe.ps1` as the repeatable contract
  check, then verify a local HTTP response and visually inspect representative
  desktop and mobile viewports.
- **Results:** The initial validator run exited `1` for three production-copy
  omissions: Healthcare, “supports auditability,” and Agentic T6. Independent
  failure analysis classified and corrected them without weakening tests. The
  rerun exited `0` with `PASS: Buckleson wireframe validation`. The final HTTP
  smoke returned `200`, `CONTENT_BYTES=17954`, `HAS_TITLE=True`, and
  `HAS_MAIN=True`. Desktop `1440x1000` and mobile `390x844` visual checks
  confirmed the hero and responsive risk diagram render correctly.
- **Consequences:** Any content, navigation, asset, accessibility, security, or
  responsive-layout change must rerun the same validator. Material layout
  changes also require desktop and mobile visual review.
- **Affected paths:** `tests/WIREFRAME_TEST_MATRIX.md`,
  `tests/Validate-Wireframe.ps1`

### D-013 — Expand the approval wireframe into a static multi-page site

- **Date:** 2026-09-16
- **Status:** Accepted; supersedes D-009 where it limits the artifact to one
  homepage
- **Context:** The user requested first-glance homepage clarity plus dedicated
  Products, Services, About, and Blog destinations without selecting a
  production framework or publishing the mock.
- **Decision:** Keep the locally vendored Oat and semantic static-HTML approach,
  but replace placeholder navigation with five real routes: Home, Products,
  Services, Blog, and About. Reuse one project stylesheet and the same pinned
  local Oat assets across every page.
- **Rationale:** Separate pages provide the requested information architecture
  while retaining the smallest deterministic, low-storage implementation for
  review. A framework, build pipeline, CMS, form backend, and individual blog
  articles are still unnecessary for this approval slice.
- **Consequences:** Navigation is now a tested cross-page contract. The preview
  remains local-only and intentionally wireframe-like; production-stack and
  publishing decisions remain deferred.
- **Affected paths:** `dist/index.html`, `dist/products.html`,
  `dist/services.html`, `dist/about.html`, `dist/blog/index.html`,
  `dist/assets/wireframe.css`
- **References:** `PRODUCT.md`,
  `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md`

### D-014 — Make the homepage promise and risk path immediately legible

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** The original homepage used oversized, dense copy and a central
  risk diagram that did not clearly show the complete path from agents through
  attacks and Buckleson to customer systems.
- **Decision:** Lead with “We help you use AI safely,” supported by “A Trust &
  Execution Layer for AI Infrastructure” and “We secure how AI runs — not what
  AI thinks.” The supporting hero lede addresses companies, organizations, and
  individual users. Replace the prior risk landscape with an ordered funnel:
  AI agents → source-defined attack types → Buckleson → users, servers,
  applications, and devices. Remove the “A controlled request path” section
  and remove Hyper Wallet from the product family.
- **Rationale:** The new hierarchy explains the company at first glance, and
  the directional funnel shows the security boundary without introducing an
  unverified claim or extra interaction.
- **Consequences:** The public product family in this wireframe consists of
  Hyper Tern, Hyper-ABS, and Hyper-0x. The risk vocabulary remains traceable to
  the supplied source material, while the diagram is an explanatory model and
  not a claim that every risk is eliminated.
- **Affected paths:** `dist/index.html`, `dist/products.html`,
  `dist/assets/wireframe.css`
- **References:** `PRODUCT.md`,
  `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md`

### D-015 — Bound Hyper-0x claims to evidence, audit, and settlement

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** The homepage needed to explain why Buckleson uses its own
  blockchain without implying that a ledger secures model reasoning or makes
  an AI answer true.
- **Decision:** Describe Hyper-0x as Buckleson’s in-house blockchain for
  tamper-evident execution records, verification, audit, and settlement.
  Describe data protection separately: Hyper-ABS protects against data exposure
  before inference, while Hyper-0x records evidence of controlled execution.
  Label roadmap or unverified blockchain properties as “Designed for.”
- **Rationale:** This separation communicates the architecture accurately and
  preserves the established qualified-claims policy in D-011.
- **Consequences:** Do not present blockchain as a confidentiality mechanism,
  proof that a model output is true, or a universal security guarantee. Public
  copy must keep current capabilities, designed-for properties, and long-term
  vision visibly distinct.
- **Affected paths:** `dist/index.html`, `dist/products.html`
- **References:** `PRODUCT.md`,
  `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md`

### D-016 — Validate the multi-page contract independently

- **Date:** 2026-09-16
- **Status:** Accepted
- **Decision:** Use `tests/Validate-MultipageWireframe.ps1` as the deterministic
  contract for the five routes, shared navigation, local assets, required
  content, removed content, funnel ordering, claim boundaries, responsive CSS,
  keyboard access, and relative-link resolution. Complement it with local HTTP
  and representative desktop/mobile browser checks.
- **Results:** `pwsh -NoProfile -File
  .\tests\Validate-MultipageWireframe.ps1` exited `0` with `PASS: Buckleson
  multi-page wireframe validation`. The HTTP smoke exited `0`; `/` (9,856
  bytes), `/products.html` (4,307 bytes), `/services.html` (3,925 bytes),
  `/about.html` (3,964 bytes), and `/blog/` (3,980 bytes) each returned `200`.
  Browser inspection at desktop `1440x1000` and mobile `390x844` confirmed the
  correct H1 and current-navigation state on all five routes, no horizontal
  overflow on supporting routes, and correct rendering of the homepage hero
  and risk funnel. A subsequent non-structural hero-lede refinement from
  “users” to “individual users” also passed the same validator and local live
  HTTP smoke check.
- **Consequences:** Future route, navigation, content, asset, claim, or layout
  changes must rerun the multi-page validator. Material visual changes still
  require desktop and mobile review; the homepage-only validator is retained as
  historical evidence rather than the current acceptance gate.
- **Affected paths:** `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md`,
  `tests/Validate-MultipageWireframe.ps1`

### D-017 — Preserve the animated Risk Landscape direction for a later section edit

- **Date:** 2026-09-16
- **Status:** Proposed; approved direction to remember, not implemented
- **Context:** The user supplied an AIR diagram as a visual reference and asked
  to retain its funnel-like movement when the Risk Landscape is edited during
  the forthcoming section-by-section review.
- **Decision:** The future Risk Landscape must communicate one ordered flow:
  AI agents on the left → approved source-defined attacks and agent activity in
  the middle → Buckleson as the policy, protection, and evidence boundary →
  individual users, servers, applications, and devices. On desktop, motion may
  reinforce the horizontal convergence and controlled expansion. The complete
  meaning must remain legible in a static first frame; reduced-motion users get
  a stable diagram or simple crossfade; and mobile uses the same semantic order
  as a vertical top-to-bottom flow rather than a compressed horizontal canvas.
- **Rationale:** This preserves the requested visual story without prematurely
  changing the approved wireframe or treating a third-party illustration as a
  design asset.
- **Consequences:** AIR is a composition and motion reference only. Do not copy
  its identity, wording, icons, colors, proprietary illustrations, exact
  composition, or percentages. Do not imply measured filtering efficacy or
  universal prevention without validated Buckleson evidence. Animated tokens
  are decorative, remain outside keyboard focus order, and cannot carry
  meaning that is unavailable in the static diagram.
- **Verification:** The current `dist/` artifact hashes were unchanged by this
  documentation-only decision, and deterministic documentation validation
  passed. No Risk Landscape implementation is claimed.
- **Affected paths:** `docs/design/RISK_LANDSCAPE_REFERENCE.md`
- **References:** `PRODUCT.md`, D-011, D-014, D-015

### D-018 — Preserve the user-designated Buckleson logo as a source asset

- **Date:** 2026-09-16
- **Status:** Accepted; asset intake only, not yet wired into the interface
- **Context:** The user identified a supplied JPEG as the official Buckleson
  logo. The current task is to preserve that source asset for later
  section-by-section visual work without changing the approved wireframe.
- **Decision:** Store the supplied file byte-for-byte at
  `dist/assets/brand/buckleson-logo.jpg`. Its verified properties are JPEG,
  322 × 308 pixels, 20,678 bytes, and SHA-256
  `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481`.
  Do not crop, recompress, recolor, trace, or otherwise derive a replacement
  without a separate approved design task.
- **Rationale:** Keeping the original bytes provides a deterministic brand
  source while deferring placement and presentation decisions until the
  relevant section is reviewed.
- **Consequences:** The asset is not referenced by any HTML or CSS yet, so the
  live interface remains unchanged. Future use, sizing, contrast treatment,
  and accessible alternative text must follow the brand and accessibility
  guidance in `PRODUCT.md`; decorative use must have empty alternative text,
  while meaningful use must receive context-appropriate accessible naming.
- **Verification:** Independent asset validation passed. The JPEG dimensions,
  byte count, and checksum matched the intake contract, and existing HTML and
  CSS remained unchanged.
- **Affected paths:** `dist/assets/brand/buckleson-logo.jpg`
- **References:** `PRODUCT.md`

### D-019 — Preserve the user-designated Hyper-0x logo as a source asset

- **Date:** 2026-09-16
- **Status:** Accepted; asset intake only, not yet wired into the interface
- **Context:** The user identified a supplied PNG as the official Hyper-0x
  logo. The current task is to preserve that source asset for later
  section-by-section visual work without changing the approved wireframe.
- **Decision:** Store the supplied file byte-for-byte at
  `dist/assets/brand/hyper-0x-logo.png`. Its verified properties are PNG,
  1254 × 1254 pixels, 770,771 bytes, and SHA-256
  `D54E012E3A323D284E5CF0AB9A41522F89A92B3AA3DF4D10316E5A06B267B6F8`.
  Do not crop, recompress, recolor, trace, or otherwise derive a replacement
  without a separate approved design task.
- **Rationale:** Keeping the original bytes provides a deterministic product
  brand source while deferring placement and presentation decisions until the
  relevant section is reviewed.
- **Consequences:** The asset is not referenced by any HTML or CSS yet, so the
  live interface remains unchanged. Future use, sizing, contrast treatment,
  and accessible alternative-text behavior must follow the brand and
  accessibility guidance in `PRODUCT.md`; decorative use must have empty
  alternative text, while meaningful use must receive context-appropriate
  accessible naming.
- **Verification:** Independent asset validation passed. The PNG dimensions,
  byte count, and checksum matched the intake contract, and all existing HTML,
  CSS, and brand assets remained unchanged.
- **Affected paths:** `dist/assets/brand/hyper-0x-logo.png`
- **References:** `PRODUCT.md`

### D-020 — Replace the approval artifact with a static Next.js production site

- **Date:** 2026-09-16
- **Status:** Accepted; supersedes D-013 as the active implementation
- **Context:** The approved multi-page wireframe established content and
  information architecture, but the production delivery requires indexable
  article routes, typed shared data, reusable accessible navigation, and a
  deterministic deployable build.
- **Decision:** Use Next.js App Router, React Server Components, TypeScript, and
  Tailwind CSS v4. Configure `output: "export"`, trailing-slash routes, and
  unoptimized local images so `next build` produces a host-agnostic static site
  in `out/`. Keep all runtime content local; do not add a server, database,
  authentication, analytics, or an owned contact form.
- **Rationale:** Static export provides the requested production routing and SEO
  surface while retaining the smallest operational model and the deterministic,
  low-storage constraints established in D-001 and D-002.
- **Consequences:** Runtime-dependent Next.js features are intentionally
  unavailable. The externally hosted Cal.com assessment URL is a normal
  same-tab link. Hosting and the real canonical domain remain separate release
  decisions; `SITE_URL` is the single build-time canonical-domain setting.
- **Affected paths:** `next.config.mjs`, `src/app/`, `src/components/`,
  `src/lib/site-data.ts`
- **References:** `package.json`, `tests/PRODUCTION_WEBSITE_TEST_MATRIX.md`,
  baseline commit `0c047e2`

### D-021 — Treat DESIGN.md as the production interface contract

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** The production site needs a consistent visual system without a
  broad component framework or a generic AI/crypto aesthetic.
- **Decision:** Keep the semantic design tokens, typography, component rules,
  motion constraints, accessibility requirements, and rationale in root
  `DESIGN.md`, validated by `@google/design.md`. Use Onest through Next font
  handling, the documented neutral/violet/verified-green palette, and only the
  locally customized shadcn-style Button, Badge, Card, Separator, and Sheet
  primitives needed by the current routes.
- **Rationale:** One reviewable design contract and a small primitive set are
  sufficient for consistent implementation and preserve YAGNI.
- **Consequences:** No Aceternity runtime, Framer Motion, CDN scripts, remote
  runtime fonts, gradients, glass effects, or crypto-neon styling are included.
  Motion is limited to transform, opacity, and SVG properties and must have a
  complete reduced-motion state. New components must reuse the established
  tokens before introducing additional primitives.
- **Affected paths:** `DESIGN.md`, `src/app/globals.css`,
  `src/components/ui/`, `src/app/layout.tsx`
- **References:** `components.json`, `tests/PRODUCTION_WEBSITE_TEST_MATRIX.md`

### D-022 — Keep product, navigation, and editorial metadata typed and local

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** Shared claims, route metadata, and product-status labels must
  remain consistent across static pages without a CMS or runtime fetch.
- **Decision:** Define the public data contracts in `src/lib/types.ts` and keep
  the corresponding site configuration, navigation, products, services, risks,
  industries, and article registry in `src/lib/site-data.ts`. Store the six
  articles as explicitly imported local MDX documents and enumerate their
  routes with `generateStaticParams`.
- **Rationale:** Typed local content makes claim review and static generation
  deterministic while avoiding an unnecessary content service.
- **Consequences:** Adding or renaming an article requires coordinated updates
  to its MDX file and registry entry. Product status and designed-for features
  must stay explicit. The qualified-claims boundaries in D-011 and D-015 remain
  authoritative across pages and articles.
- **Affected paths:** `src/lib/types.ts`, `src/lib/site-data.ts`,
  `src/lib/articles.ts`, `src/content/articles/`,
  `src/app/blog/[slug]/page.tsx`
- **References:** `PRODUCT.md`, `tests/Validate-ProductionWebsite.ps1`

### D-023 — Centralize crawl metadata and safe structured-data serialization

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** Every indexable route needs consistent canonical, social, and
  structured metadata without allowing arbitrary markup into JSON-LD.
- **Decision:** Generate shared route metadata through
  `src/lib/metadata.ts`, serialize typed local structured data only through
  `src/lib/json-ld.tsx`, and generate the static sitemap and robots policy from
  App Router metadata routes.
- **Rationale:** A single reviewed boundary prevents metadata drift and makes
  the JSON-LD escaping rule testable.
- **Consequences:** JSON-LD inputs are repository-owned typed data and `<` is
  escaped before insertion. Articles emit BlogPosting and BreadcrumbList data;
  the root layout emits Organization and WebSite data. Canonical output depends
  on `SITE_URL`, so a real production domain must be supplied at release time.
- **Affected paths:** `src/lib/metadata.ts`, `src/lib/json-ld.tsx`,
  `src/app/layout.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/robots.ts`,
  `src/app/sitemap.ts`
- **References:** `tests/Validate-ProductionWebsite.ps1`

### D-024 — Implement the Risk Landscape as an accessible static-first funnel

- **Date:** 2026-09-16
- **Status:** Accepted; implements and supersedes the proposed state in D-017
- **Context:** The user approved an agents-to-risks-to-Buckleson-to-destinations
  composition and requested motion inspired by a supplied reference without
  copying third-party visual identity or efficacy claims.
- **Decision:** Implement the funnel with semantic HTML, SVG, and CSS. Preserve
  the complete story in the first frame and in an ordered text alternative;
  treat moving tokens as decorative; switch from horizontal desktop flow to a
  vertical mobile flow; and disable continuous movement for reduced-motion
  users.
- **Rationale:** The native implementation expresses the Buckleson architecture
  directly, works without JavaScript, and avoids an animation dependency.
- **Consequences:** Animation can reinforce but never carry meaning. AIR icons,
  branding, colors, copy, composition, and filtering percentages are excluded.
  The exact approved risk names remain part of the tested content contract.
- **Affected paths:** `src/components/risk-landscape.tsx`,
  `src/app/globals.css`, `src/lib/site-data.ts`
- **References:** `docs/design/RISK_LANDSCAPE_REFERENCE.md`,
  `tests/e2e/production-website.spec.ts`

### D-025 — Move immutable brand originals into the production public asset boundary

- **Date:** 2026-09-16
- **Status:** Accepted; supersedes the storage locations in D-018 and D-019
- **Context:** The production application needs the approved Buckleson and
  Hyper-0x marks while preserving the original bytes and proportions.
- **Decision:** Store the existing source files at
  `public/brand/buckleson-logo.jpg` and `public/brand/hyper-0x-logo.png` without
  recompression, cropping, recoloring, or redrawing. Reference the originals
  from the production interface and metadata.
- **Rationale:** Next static export copies `public/` predictably and no derived
  brand asset is needed.
- **Consequences:** The D-018 and D-019 hashes and dimensions remain the
  integrity contract at the new paths. Any future derivative requires a
  separately approved design task and must not replace these originals.
- **Affected paths:** `public/brand/buckleson-logo.jpg`,
  `public/brand/hyper-0x-logo.png`, `src/components/brand-logo.tsx`,
  `src/lib/metadata.ts`
- **References:** `PRODUCT.md`, `tests/Validate-ProductionWebsite.ps1`

### D-026 — Gate production delivery with static, browser, accessibility, and performance checks

- **Date:** 2026-09-16
- **Status:** Accepted
- **Context:** The production replacement changes routing, rendering, content,
  responsive behavior, and interactive navigation beyond the historical
  wireframe validator's scope.
- **Decision:** Use the risk-based matrix and production validator as the source
  acceptance contract, then run design lint, ESLint, TypeScript, unit checks,
  static build, content/link/SEO checks, Playwright E2E, the dedicated Axe
  accessibility slice, and three Lighthouse runs. Keep test execution separate
  from implementation and require independent failure analysis before repairs.
- **Verification:** Design lint, ESLint, TypeScript, unit/contract checks,
  static build, content, links, and SEO pass. Playwright passes 22/22 checks;
  the dedicated accessibility slice passes 11/11; the Lighthouse configuration
  passes its three-run thresholds. Graft build/check and a full codebase-memory
  reindex also pass. The independent final runner repeated every required gate
  in order, including the aggregate suite, with exit code 0 throughout.
- **Consequences:** The historical wireframe suites do not define production
  acceptance. Any route, shared content, metadata, navigation, risk-diagram,
  accessibility, or performance change must rerun the applicable production
  gates through `scripts/Invoke-WorkspaceNodeTool.ps1`.
- **Affected paths:** `tests/PRODUCTION_WEBSITE_TEST_MATRIX.md`,
  `tests/Validate-ProductionWebsite.ps1`, `tests/e2e/production-website.spec.ts`,
  `tests/playwright.config.ts`, `tests/lighthouserc.cjs`,
  `src/lib/site-data.test.ts`, `vitest.config.ts`
- **References:** `package.json`, `AGENTS.md`

### D-027 — Polish the homepage as connected infrastructure

- **Date:** 2026-09-17
- **Status:** Accepted
- **Context:** The production homepage was complete but its equal-card rhythm,
  translucent header, and oversized Hyper-0x spacing weakened the intended
  technical hierarchy.
- **Decision:** Present the outcomes as one connected sequence, services as an
  asymmetric ruled list, the sticky header as an opaque surface, and Hyper-0x
  at tighter vertical density. Preserve existing content, semantic order,
  accessibility behavior, capability boundaries, dependencies, and assets.
- **Rationale:** These CSS-and-markup refinements strengthen system legibility
  without expanding the product or runtime surface.
- **Verification:** The independent runner passes E2E 23/23 and accessibility
  11/11. The aggregate validator passes; Vitest passes 4/4 and Playwright
  passes 23/23.
  Three-run Lighthouse medians are Performance 98, Accessibility 100, Best
  Practices 96, SEO 100, LCP 2441.043 ms, CLS 0, and TBT 46.5 ms. The Graft
  wiring graph was refreshed and its check passes.
- **Affected paths:** `src/app/page.tsx`, `src/app/globals.css`,
  `tests/e2e/production-website.spec.ts`
- **References:** `DESIGN.md`, `tests/HOMEPAGE_POLISH_TEST_MATRIX.md`

### D-028 — Prevent late hero-text font swaps from resetting LCP

- **Date:** 2026-09-17
- **Status:** Accepted
- **Context:** A late self-hosted font swap can redraw the hero heading and
  reset the measured Largest Contentful Paint.
- **Decision:** Load the self-hosted Onest font with `display: "optional"`
  instead of `swap`; retain Segoe UI as the fallback.
- **Rationale:** This is the smallest deterministic performance hardening and
  requires no dependency, asset, content, or layout change.
- **Consequences:** Onest remains preferred when immediately available; under
  constrained loading conditions the stable Segoe UI fallback may persist for
  that navigation instead of causing a late hero-text redraw.
- **Verification:** The final three-run Lighthouse medians meet the values
  recorded in D-027, including LCP 2441.043 ms and CLS 0.
- **Affected paths:** `src/app/layout.tsx`
- **References:** `DESIGN.md`, `tests/HOMEPAGE_POLISH_TEST_MATRIX.md`

### D-029 — Keep one ordered navigation contract across render modes

- **Date:** 2026-09-17
- **Status:** Accepted
- **Context:** The shared header must expose the same predictable route order
  across desktop, the mobile Sheet, and the no-JavaScript fallback while
  preserving narrow-screen reflow.
- **Decision:** Use the exact order Home, About, Products, Services, Blog,
  Contact Us everywhere. Contact Us opens the configured calendar URL in the
  same tab, and current-route semantics remain on applicable route links.
  Desktop ordinary-link selectors exclude `[data-slot="button"]`, and the
  responsive navigation gap uses `clamp()` to preserve 200% reflow.
- **Rationale:** One data-backed order and narrowly scoped responsive styling
  keep all navigation modes consistent without changing routing behavior.
- **Verification:** The independent runner passes E2E 27/27 and the dedicated
  accessibility slice 11/11. The aggregate validator passes; Vitest passes
  4/4 and Playwright passes 27/27. The Graft wiring graph was refreshed and
  its check passes.
- **Affected paths:** `src/components/site-header.tsx`,
  `src/app/globals.css`, `tests/e2e/production-website.spec.ts`
- **References:** `DESIGN.md`, `tests/NAVIGATION_TEST_MATRIX.md`

### D-030 — Use a resilient glass capsule for the shared navigation

- **Date:** 2026-09-17
- **Status:** Accepted; supersedes only D-027's requirement that the sticky
  header use an opaque surface
- **Context:** The shared header needed a more distinctive floating treatment
  while retaining the navigation, accessibility, and performance contracts
  established by D-029.
- **Decision:** Use an original, Pavii-inspired inset sticky capsule with a
  restrained Apple-like translucent material. Confine glass to the shared
  navbar; all other surfaces retain the solid-material rules in `DESIGN.md`.
  Provide explicit solid fallbacks when backdrop filtering is unsupported,
  transparency is reduced, or increased contrast is requested. Preserve the
  exact order Home, About, Products, Services, Blog, Contact Us in desktop,
  mobile Sheet, and no-JavaScript modes. The no-JavaScript fallback explicitly
  reveals its native links and hides the inert Sheet trigger.
- **Rationale:** This is the smallest visual change that adds hierarchy and
  depth without copying the reference, expanding the runtime, or weakening
  resilient navigation behavior.
- **Consequences:** No animation library or other runtime dependency is added.
  Hover and press feedback remain short, property-specific, and fine-pointer
  scoped; reduced-motion users retain a static usable state. The project-local
  Emil design-engineering and Apple design skills were installed and used to
  guide interaction feedback, translucent-material restraint, and fallbacks.
- **Validation:** The focused acceptance contract is documented in
  `tests/GLASS_NAVBAR_TEST_MATRIX.md`. Independent validation passes design
  lint, ESLint, TypeScript, unit tests, build, content, links, and SEO; E2E
  passes 29/29 and Axe passes 11/11. Three-run Lighthouse medians are
  Performance 98, Accessibility 100, Best Practices 96, SEO 100, LCP
  2450.391 ms, CLS 0, and TBT 31.5 ms. The aggregate npm test and
  `git diff --check` pass. Graft build/check pass with the wiring graph in sync.
- **Affected paths:** `src/components/site-header.tsx`,
  `src/app/globals.css`, `DESIGN.md`
- **References:** `tests/GLASS_NAVBAR_TEST_MATRIX.md`,
  `.codex/skills/emil-design-eng/SKILL.md`,
  `.codex/skills/apple-design/SKILL.md`

### D-031 — Round visible Buckleson logos without changing the source asset

- **Date:** 2026-09-17
- **Status:** Accepted
- **Context:** Visible Buckleson marks needed a consistent rounded presentation
  and a browser-safe favicon without mutating the user-designated source image
  or changing established metadata compatibility.
- **Decision:** Keep `public/brand/buckleson-logo.jpg` byte-for-byte unchanged at
  SHA-256 `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481`
  and preserve its 322:308 aspect ratio. Present
  visible Buckleson logo instances with a 15% rounded outer canvas. Use the
  local, inert `public/brand/buckleson-icon.svg` wrapper for the favicon; it
  clips the original JPEG and contains no scripts or remote references.
  Open Graph, Twitter, and JSON-LD metadata continue to use the original JPEG.
  The decorative boundary logo remains unlinked with `alt=""`; shared header
  and footer lockups remain accessible Buckleson home links.
- **Rationale:** Presentation-level rounding provides the requested visual
  consistency while preserving the canonical artwork, metadata behavior, and
  semantic distinction between decorative and navigational instances.
- **Validation:** Static build passes 15/15 routes, Vitest passes 4/4, E2E
  passes 31/31, Axe passes 11/11, and the aggregate test command passes. The
  favicon returns HTTP 200. Graft check passes with the wiring graph in sync.
- **Affected paths:** `public/brand/buckleson-icon.svg`,
  `src/components/brand-logo.tsx`, `src/app/globals.css`, `src/app/layout.tsx`
- **References:** `tests/LOGO_ROUNDING_TEST_MATRIX.md`, D-018

### D-032 — Contain interactive product disclosure inside PlatformShowcase

- **Date:** 2026-09-18
- **Status:** Accepted
- **Context:** The homepage needed a more legible way to compare Hyper Tern,
  Hyper-ABS, and Hyper-0x without changing their approved order, summaries,
  status boundaries, or product-page destinations.
- **Decision:** Encapsulate the interaction in one client component with one
  deterministic selected-product value. Hyper Tern is initially open; pointer
  hover, focus, Enter, Space, and click/tap select exactly one panel. Desktop
  uses progressive horizontal disclosure and narrow screens use a one-open
  accordion. Native buttons expose `aria-expanded` and `aria-controls`, while
  each illustrative diagram is decorative. A separate semantic no-JavaScript
  rendering exposes all three products and links, and reduced-motion CSS makes
  disclosure and diagram motion effectively static.
- **Rationale:** One local state boundary provides the requested interaction
  without changing typed product data, adding a dependency, introducing time or
  persistence, or making hover or JavaScript the only path to content.
- **Consequences:** Product meaning and navigation remain available in the
  first/static render. The interaction performs no network I/O and owns no
  shared state. Motion, responsive layout, 200% text enlargement, overflow,
  keyboard behavior, ARIA relationships, and no-JavaScript recovery remain
  explicit regression boundaries. The panel implementation is kept below the
  hero so its client-side code and decorative SVG work do not expand the hero's
  critical rendering path.
- **Validation:** The focused Playwright suite covers initial state, pointer,
  focus, keyboard, mobile, ARIA, no-JavaScript, reduced motion, supported
  widths, 200% text, CLS/overflow, claims, and destinations. The combined E2E
  suite passes 44/44 and the dedicated Axe slice passes 11/11; build, static
  validation, content, link, SEO, lint, type, and unit gates also pass.
- **Affected paths:** `src/components/platform-showcase.tsx`,
  `src/app/page.tsx`, `src/app/globals.css`,
  `tests/e2e/platform-panels.spec.ts`
- **References:** `tests/PLATFORM_PANELS_TEST_MATRIX.md`, D-022, D-026

### D-033 — Publish the static export as a repository-scoped GitHub Pages site

- **Date:** 2026-09-18
- **Status:** Accepted; deployment authorized with the recorded performance
  exception
- **Context:** The completed static site must be published from `main` to the
  GitHub repository `vjk7989/may-be-not-some-p0-oooorn-site`, whose project-site
  namespace requires every deployment-owned path and canonical URL to retain
  the repository prefix.
- **Decision:** Deploy `out/` with the official GitHub Pages Actions pipeline:
  configure Pages, build on Node 22 with `npm ci`, upload the Pages artifact,
  and deploy it with least-privilege `contents: read`, `pages: write`, and
  `id-token: write` permissions. Set `NEXT_PUBLIC_BASE_PATH` to
  `/may-be-not-some-p0-oooorn-site` and `SITE_URL` to
  `https://vjk7989.github.io/may-be-not-some-p0-oooorn-site` during the build.
  `next.config.mjs` applies the base path to the static export;
  `withBasePath()` prefixes local images, native links, and MDX-authored
  internal anchors exactly once. Keep `public/.nojekyll` in the exported
  artifact. Continue invoking npm through the cross-platform
  `scripts/Invoke-WorkspaceNodeTool.ps1`, which resolves the Windows command
  shim locally and the native executable in GitHub's Linux runner while keeping
  cache and temporary writes inside the workspace.
- **Rationale:** Repository-scoped static export plus the provider's official
  artifact deployment is the smallest delivery architecture; it needs no
  runtime server, `gh-pages` branch, custom domain, or third-party deployer.
- **Consequences:** Local builds may omit the prefix, but release builds must
  supply both environment values together. All new root-relative images,
  native anchors, and MDX links must pass through the shared base-path helper.
  Canonical, Open Graph, JSON-LD, sitemap, and robots output derive from the
  release `SITE_URL`. The workflow runs on `main` pushes and manual dispatch,
  and its Pages concurrency group cancels superseded runs.
- **Validation:** `tests/Validate-GitHubPages.ps1` checks repository identity,
  workflow permissions and official Actions, project base path, single-prefix
  asset/link output, canonical metadata, trailing-slash routes, sitemap,
  robots, exported assets, and `out/.nojekyll`. The Pages-targeted build and all
  functional, accessibility, content, link, SEO, build, and static gates pass.
  GitHub Pages is enabled with `build_type: workflow`. The first CI execution
  exposed a Linux-only wrapper ambiguity: `Get-Command` returned multiple npm
  matches from `PATH`. The wrapper now deterministically selects the first
  application result with `Select-Object -First 1`, and the Pages validator
  asserts that behavior to prevent regression. The corrected deployment
  succeeded at
  `https://github.com/vjk7989/may-be-not-some-p0-oooorn-site/actions/runs/35265549056`.
  At verification time, the live site at
  `https://vjk7989.github.io/may-be-not-some-p0-oooorn-site/` served commit
  `b4c8d87`, matching the intended deployed SHA.
  The latest isolated mobile Lighthouse run measured LCP at approximately
  2.611 s against the established 2.5 s budget; this exception does not change
  the budget or mark the performance gate as passing. Deployment proceeds only
  because the user explicitly instructed the team to proceed after the failure
  was reported; future work must treat the 2.5 s threshold as active rather
  than silently adopting 2.611 s as a new baseline.
- **Affected paths:** `.github/workflows/deploy-pages.yml`, `next.config.mjs`,
  `src/lib/site-data.ts`, `src/mdx-components.tsx`, `src/app/layout.tsx`,
  `src/app/page.tsx`, `src/app/products/page.tsx`,
  `src/components/brand-logo.tsx`, `src/components/site-header.tsx`,
  `public/.nojekyll`, `scripts/Invoke-WorkspaceNodeTool.ps1`
- **References:** `tests/GITHUB_PAGES_TEST_MATRIX.md`,
  `tests/Validate-GitHubPages.ps1`, D-020, D-023, D-026

### D-034 — Embed the official raster in a versioned favicon wrapper

- **Date:** 2026-09-18
- **Status:** Accepted
- **Context:** The existing `buckleson-icon.svg` referenced the official JPEG
  through an external relative URL. Browsers could load the SVG favicon without
  resolving that dependent raster request, leaving the browser-tab icon
  effectively invisible.
- **Decision:** Point favicon metadata to the versioned
  `public/brand/buckleson-icon-v2.svg`. The replacement keeps the same rounded
  clip and embeds the byte-unchanged official Buckleson JPEG as a `data:` URI
  instead of depending on a second favicon fetch. The new filename also
  cache-busts previously cached invisible favicon metadata and content.
- **Rationale:** A self-contained, inert SVG is the smallest reliable fix. It
  preserves the approved source artwork and rounded presentation while removing
  browser-dependent relative-resource loading from the favicon path.
- **Consequences:** Future favicon changes must remain self-contained and use a
  new versioned URL when cached browser state must be invalidated. The canonical
  JPEG remains unchanged at SHA-256
  `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481`.
  The generated v2 SVG is 27,987 bytes with SHA-256
  `914CD106F10D35AB078366412092B4ADE763E57C00A2ADAC27E3FDBF545B2FD5`.
- **Validation:** The focused favicon browser check passes 1/1, the combined
  Playwright suite passes 44/44, the aggregate test command passes, and the
  GitHub Pages validator passes. Commit `f18058f` deployed successfully in
  GitHub Actions run `35268875126`; the live versioned favicon URL returns HTTP
  200 with 27,986 bytes and is self-contained.
- **Affected paths:** `public/brand/buckleson-icon-v2.svg`,
  `src/app/layout.tsx`, `tests/e2e/production-website.spec.ts`,
  `tests/Validate-GitHubPages.ps1`
- **References:** `tests/FAVICON_VISIBILITY_TEST_MATRIX.md`, D-031, D-033

### D-035 — Use shared CSS-only electric-violet navigation cells

- **Date:** 2026-09-18
- **Status:** Accepted historically; its boxed-cell presentation is superseded
  by D-036. The pre-existing Lighthouse LCP exception remains recorded in
  D-033.
- **Context:** The shared glass header needed a more compact, squared visual
  rhythm and clear interactive feedback while preserving the established route
  order, mobile Sheet, no-JavaScript recovery, accessibility, and static Pages
  architecture.
- **Decision:** Keep the translucent header as a moderately rounded rectangular
  shell and render every desktop and mobile destination, including Contact Us,
  through one `nav-cell`/`NavLabel` presentation. Each label has one semantic
  copy plus an `aria-hidden` duplicate. CSS pseudo-elements, transforms, and
  opacity provide the electric-violet fill, vertical label roll, and press
  feedback without a motion dependency. Inactive cells transition from a
  white translucent surface to violet; the `aria-current="page"` cell remains
  violet in every state. Mobile links retain touch-sized rectangular cells;
  no-JavaScript links remain native; reduced-motion, reduced-transparency, and
  increased-contrast preferences retain immediate, legible states; wrapping
  prevents header overflow and reflow failures at supported viewport and zoom
  sizes.
- **Rationale:** Shared semantic markup and CSS-only motion are the smallest
  implementation that gives every navigation surface the same state language
  without duplicating behavior or adding client runtime weight.
- **Consequences:** New header destinations must use `NavLabel` and the
  `nav-cell` state contract. The duplicated label must remain hidden from the
  accessibility tree, focus indication must stay above the animated fill, and
  current-route styling must never reverse to white on interaction.
- **Validation:** Design lint, lint, typecheck, unit, build, content, links, and
  SEO checks pass. Focused navbar coverage passes 34/34, combined E2E passes
  47/47, and dedicated Axe coverage passes 11/11. Lighthouse meets every
  configured budget except mobile LCP, whose median remains approximately
  2.611 s—the same pre-existing D-033 baseline—so the performance gate is not
  recorded as passing. A `preload: false` experiment worsened the median to
  approximately 2.835 s and was reverted.
- **Affected paths:** `src/components/site-header.tsx`, `src/app/globals.css`,
  `tests/GLASS_NAVBAR_TEST_MATRIX.md`,
  `tests/e2e/production-website.spec.ts`
- **References:** `tests/GLASS_NAVBAR_TEST_MATRIX.md`, D-030, D-033

### D-036 — Use unboxed rolling labels inside one glass navigation shell

- **Date:** 2026-09-18
- **Status:** Accepted; supersedes the boxed-cell presentation in D-035
- **Context:** The user approved the navbar's single rounded rectangular glass
  shell but clarified that individual destinations must not look like separate
  square buttons. The desired reference behavior is the vertical label motion,
  not a filled cell around every link.
- **Decision:** Preserve one moderately rounded glass header shell and make all
  desktop and mobile navigation targets transparent, borderless, and
  shadowless. Retain the shared semantic label plus one `aria-hidden` duplicate
  and animate only their vertical transforms. Inactive labels transition from
  ink to electric violet on hover or keyboard focus; the current-route label
  remains electric violet before, during, and after interaction. Mobile
  destinations remain full-width, touch-sized, unboxed targets. Reduced-motion
  presentation hides the duplicate and keeps one static, immediately colored
  label. The interaction adds no dependency, persistent state, network I/O, or
  client runtime beyond the existing header behavior.
- **Rationale:** Removing per-link surfaces matches the approved visual intent
  while preserving the existing navigation semantics, route state, generous
  hit areas, and CSS-only motion architecture.
- **Consequences:** New header destinations must use the rolling-label contract
  without adding per-item fill, borders, or shadows. Focus indication remains
  visible outside the label, Contact Us uses the same unboxed treatment, and
  no-JavaScript, contrast, transparency, zoom, and reduced-motion fallbacks
  remain required regression boundaries.
- **Validation:** Focused navbar coverage passes 34/34, the standalone combined
  E2E suite passes 47/47, and dedicated Axe coverage passes 11/11. The first
  aggregate run encountered one non-navbar transient PlatformShowcase assertion;
  independent analysis classified it outside this change, its exact focused
  test passed 10/10, and the aggregate E2E rerun passed 47/47. Design lint,
  lint, typecheck, unit, build, content, links, SEO, static validation, and Graft
  checks pass. The known mobile Lighthouse LCP of approximately 2.611 s remains
  separate, above the 2.5 s budget, and is not recorded as green.
- **Affected paths:** `src/components/site-header.tsx`, `src/app/globals.css`,
  `tests/GLASS_NAVBAR_TEST_MATRIX.md`,
  `tests/e2e/production-website.spec.ts`
- **References:** `tests/GLASS_NAVBAR_TEST_MATRIX.md`, D-030, D-033, D-035

### D-037 — Stagger the navigation roll per character

- **Date:** 2026-09-18
- **Status:** Accepted; refines D-036 without changing its unboxed navigation
  contract
- **Context:** The user requested that each navigation word roll letter by
  letter, then requested an exact 12% slowdown to the established timing and
  an additional exact 18% slowdown to those interim values.
- **Decision:** Render one complete `sr-only` semantic label and mark both
  visual character layers `aria-hidden`. Animate each visible character with a
  449.344 ms transform transition and a deterministic 37.0048 ms index-based
  stagger, exactly 18% slower than the interim 380.8 ms duration and 31.36 ms
  stagger. The longest navigation label, Contact Us, settles at 745.3824 ms.
  These current values supersede the interim 12%-slower values. Whitespace
  remains in layout without receiving an additional stagger beat. Easing,
  transform-only motion, semantics, and reduced-motion behavior remain
  unchanged; under reduced motion, use `transition: none` and present the
  complete static label without travel.
- **Rationale:** Per-character timing supplies the requested rhythm while the
  single semantic copy preserves an uninterrupted accessible name. CSS timing
  and explicit character indices keep the behavior deterministic and avoid a
  motion dependency or client-side interaction state.
- **Consequences:** Navigation labels must preserve the semantic/visual-layer
  separation, character order, whitespace width, easing, and interaction
  semantics. New destinations inherit the same timing contract. Reduced-motion
  behavior remains unchanged. No dependency, network work, or persistent
  runtime state is added. The known mobile Lighthouse LCP of approximately 2.611 s
  remains separate from this refinement and above the active 2.5 s budget.
- **Affected paths:** `src/components/site-header.tsx`, `src/app/globals.css`,
  `tests/GLASS_NAVBAR_TEST_MATRIX.md`,
  `tests/e2e/production-website.spec.ts`
- **References:** `tests/GLASS_NAVBAR_TEST_MATRIX.md`, D-033, D-036

### D-038 — Fit homepage scenes to the usable viewport when content allows

- **Date:** 2026-09-18
- **Status:** Accepted
- **Context:** Homepage sections used large fixed spacing and intrinsic layouts
  that often required a small extra scroll to reveal otherwise compact content.
  The requested behavior was one complete section per browser window across
  desktop, tablet, mobile, landscape, and accessibility-scale conditions,
  without clipping dense content or forcing slide-like navigation.
- **Decision:** Introduce the local semantic `ViewportSection` primitive and
  apply it to the homepage's nine content sections only. Its CSS contract uses
  `min-block-size: calc(100svh - var(--viewport-header-footprint))`, centers
  content within that usable height when it fits, and allows the section to
  expand naturally when its intrinsic content is taller. Fluid scene padding
  compacts the existing layouts without removing copy or functionality.
  Section targets receive sticky-header scroll clearance. The Risk Landscape
  grid permits min-content shrinkage at 200% text scaling, and header/navigation
  tracks may wrap or shrink rather than widening the document.
- **Rationale:** A reusable semantic wrapper plus CSS minimum sizing is the
  smallest deterministic solution. It needs no client measurement, runtime
  observer, new dependency, or viewport-specific content fork, and preserves
  useful static HTML when JavaScript is unavailable.
- **Consequences:** A homepage scene equals the usable viewport within the
  tested tolerance only when its complete readable content fits; short screens,
  accessibility text scaling, and intrinsically dense scenes use normal page
  growth. Fixed heights, internal section scrollbars, clipped meaningful
  content, scroll snapping, and forced full-screen slides remain unsupported.
  Supporting pages and articles retain natural document flow, and the footer
  remains ordinary site chrome. Existing shadcn primitives are retained;
  Aceternity and other layout dependencies are intentionally not added.
- **Validation:** Focused Playwright coverage passes 18/18 across 320×568,
  390×844, 844×390, 768×1024, 1024×768, 1366×768, 1440×900,
  1920×1080, and the 720×450 zoom-equivalent viewport. It also covers
  resize and orientation changes, every Platform active state, no-JavaScript
  content, blocked-image recovery, reduced motion, anchor clearance, 200% root
  text scaling, section containment, internal-scroll rejection, and horizontal
  overflow. Design lint, lint, typecheck, unit, build, content, links, SEO,
  combined E2E, Axe, aggregate tests, and GitHub Pages validation pass. The
  latest three-run Lighthouse mobile median LCP is 2,856.9 ms, above the active
  2.5 s budget; performance remains explicit debt and is not recorded as green.
- **Affected paths:** `src/components/ui/viewport-section.tsx`,
  `src/app/page.tsx`, `src/components/risk-landscape.tsx`,
  `src/components/assessment-cta.tsx`, `src/components/site-header.tsx`,
  `src/app/globals.css`, `tests/e2e/viewport-sections.spec.ts`
- **References:** `tests/VIEWPORT_SECTIONS_TEST_MATRIX.md`, D-020, D-033

### D-039 — Make graph-driven dependency ordering the repository task workflow

- **Date:** 2026-09-19
- **Status:** Accepted
- **Context:** Future tasks need a deterministic way to discover affected code,
  expose ordering constraints, parallelize only independent work, and preserve
  the existing test and context-management gates without adding orchestration
  infrastructure.
- **Decision:** The repository operating contract in `AGENTS.md` now requires
  code discovery through codebase-memory MCP first and Graft second. Every task
  is represented by a compact dependency graph whose nodes record the work
  item, dependencies, affected boundary, acceptance criteria, and parallel
  safety. Nodes become ready only when all dependencies are known, complete,
  and passing; work proceeds in topological order. Unknown dependencies block
  their consumers, cycles must be decomposed or escalated, and parallel writes
  are allowed only across disjoint boundaries. Each completed node passes its
  focused gate before dependents start. Independent agents own test design and
  test execution, with failure analysis added only after an actual failure.
  Material work completes with broader regression checks, Graft refresh, and
  architecture and handoff updates.
- **Rationale:** A lightweight task DAG makes dependencies and safe concurrency
  explicit while preserving YAGNI. Keeping it in the active plan or progress
  record avoids a speculative scheduler, persistent task database, or new
  runtime dependency.
- **Consequences:** A one-node task still records the same minimum fields
  without extra ceremony. Discovery may add dependencies and update the graph,
  but may not expand scope beyond current acceptance criteria. Documentation-
  only changes use deterministic validation rather than application tests.
  Overlapping writes remain serialized, and valid tests cannot be weakened to
  unblock downstream work. `AGENTS.md` is the authoritative detailed contract;
  this decision records the durable architectural choice without duplicating
  its full procedure.
- **Affected paths:** `AGENTS.md`, `docs/architecture/DECISIONS.md`
- **References:** `AGENTS.md`

### D-040 — Isolate animated 404 recovery and defer non-critical rendering

- **Date:** 2026-09-19
- **Status:** Accepted
- **Context:** The site needed a distinctive static-export 404 experience
  without loading animation code on normal routes, plus a measured performance
  pass that preserved eager identity and navigation content while restoring
  below-fold rendering deferral.
- **Decision:** Keep `src/app/not-found.tsx` server-rendered and make its first
  frame, recovery copy, CTA, and decorative SVG complete without JavaScript.
  A single route-local client island dynamically imports the exactly pinned
  Anime.js 4.5.0 runtime, owns a deterministic scoped timeline, and reverts it
  on cleanup. Reduced-motion users retain the finished static SVG. The 404
  surface hides shared header, footer, and skip link only when its page marker
  is present. Optional socials use a typed HTTPS-only `SocialLink` list that is
  empty, and therefore renders no placeholder rail, until approved links are
  supplied. Homepage non-hero scenes again use `content-visibility: auto` with
  their existing intrinsic-size reservations; critical hero, header, font,
  and identity content remain eager. Small WebP display derivatives serve
  repeated logo artwork while the official source files remain byte-identical.
  Root metadata supplies shared fields but not route title/indexability;
  indexable routes own absolute titles and robots metadata so the 404 title and
  noindex state cannot be overwritten during hydration.
- **Rationale:** A server shell, static-first SVG, and one route-scoped dynamic
  import provide the requested motion with no normal-route Anime.js transfer.
  CSS rendering deferral and immutable display derivatives address measured
  costs without observer infrastructure, broad dynamic imports, or replacing
  the accessible navigation implementation.
- **Consequences:** The 404 remains meaningful with scripts disabled and its
  motion adds no semantic dependency. Normal routes must not preload or request
  the Anime.js chunk. New public pages must explicitly own their title and
  indexability through the shared metadata helper or route metadata. Brand
  integrity tests continue to hash and dimension-check original artwork;
  derivatives are presentation assets only. Social links remain absent until
  real HTTPS destinations are supplied. Performance success still requires a
  fresh three-run Lighthouse median meeting the active thresholds.
- **Affected paths:** `src/app/not-found.tsx`,
  `src/components/not-found-motion.tsx`, `src/app/globals.css`,
  `src/app/layout.tsx`, `src/lib/metadata.ts`, `src/lib/site-data.ts`,
  `src/lib/types.ts`, `src/components/brand-logo.tsx`,
  `src/components/site-header.tsx`, `src/app/page.tsx`,
  `src/app/products/page.tsx`, `public/brand/buckleson-logo-display.webp`,
  `public/brand/hyper-0x-logo-display.webp`, `package.json`
- **References:** `tests/ANIMATED_404_PERFORMANCE_TEST_MATRIX.md`,
  `tests/Validate-404Performance.ps1`,
  `tests/e2e/not-found-performance.spec.ts`, D-025, D-028, D-038

### D-041 — Retain the existing rendering configuration after measured CSS experiment

- **Date:** 2026-09-19
- **Status:** Accepted
- **Context:** The animated-404 performance pass required a fresh three-run
  mobile Lighthouse cohort and a bounded experiment against the remaining LCP
  failure while preserving the accessible Radix navigation and existing client
  islands.
- **Decision:** Retain the current configuration. Its LCP runs measured
  2,960.977 ms, 2,802.940 ms, and 2,829.375 ms (median 2,829.375 ms), which
  fails the 2,500 ms budget. CLS is 0 and passes; median TBT is 35 ms and
  passes. Reject Next.js `experimental.inlineCss`: its post-experiment cohort
  produced a 2,824.575 ms median LCP, only a 4.8 ms improvement, while FCP
  regressed by 114.8 ms, median TBT increased to 64 ms, and transfer grew by
  29%. The setting was reverted.
- **Rationale:** The negligible LCP change does not justify the measured FCP,
  blocking-time, and transfer regressions. No further small, evidence-backed
  fix remains within the protected Radix-navigation and client-island
  constraints.
- **Consequences:** The 2.5 s LCP budget remains active performance debt and is
  not recorded as passing. Any future attempt needs new evidence or authority
  to change the protected interaction boundaries; CLS and TBT remain green.
- **Affected paths:** `next.config.mjs`, `tests/lighthouserc.cjs`
- **References:** D-033, D-038, D-040,
  `tests/ANIMATED_404_PERFORMANCE_TEST_MATRIX.md`

### D-042 — Add progressive mega-menu navigation without replacing route links

- **Date:** 2026-09-19
- **Status:** Accepted
- **Context:** The shared glass header needed Cloudflare-inspired previews for
  About, Products, Services, and Blog while preserving the existing top-level
  destinations, ordered navigation, active-route semantics, static export, and
  unboxed rolling-label treatment. Contact Us also needed a persistent,
  high-visibility violet treatment without becoming an application route.
- **Decision:** Keep each top-level item as a real Next.js link and add one
  associated disclosure panel for About, Products, Services, and Blog. A small
  typed presentation map in `site-header.tsx` supplies each panel's introduction
  and destination links, reusing product, service, and article data where it
  already exists. Desktop panels open on fine-pointer hover or keyboard focus,
  keep at most one panel open, close when focus or the pointer leaves the
  navigation, and return focus to the trigger on Escape. Closed panels remain
  in the DOM but are `aria-hidden` and inert. Mobile keeps the existing Sheet
  and exposes the same destinations as readable grouped links rather than
  reproducing hover behavior. The no-JavaScript navigation also includes every
  grouped destination with base-path-safe links. Contact Us remains an external
  Cal.com link and uses a violet oval outline that inverts to a violet fill with
  white text on hover, focus, and press. The panel is a single restrained,
  ruled technical surface—not a grid of standalone promotional cards—and uses
  the existing Buckleson tokens and transparency, contrast, and reduced-motion
  fallbacks.
- **Rationale:** Enhancing real links preserves direct navigation and
  progressive enhancement while revealing useful route structure before a
  click. Deriving content from existing typed data avoids a second product,
  service, or article source. One local state boundary is the smallest complete
  implementation; no menu framework, content system, new route, or dependency
  is required.
- **Consequences:** Route changes reset the open disclosure. Blog article paths
  continue to select Blog through existing current-route logic. Any new grouped
  destination must be keyboard reachable, base-path safe, present in the
  mobile and no-JavaScript paths, and must not make hidden desktop content
  discoverable to assistive technology. Hover is an enhancement only; every
  destination remains available without it. Focus rings stay above panel and
  CTA effects. The focused navbar suite passes 10/10, the independent combined
  E2E suite passes 100/100, the dedicated accessibility slice passes 11/11,
  and the aggregate `npm test` gate passes. Lighthouse was not rerun; the
  retained LCP debt remains separate.
- **Affected paths:** `src/components/site-header.tsx`,
  `src/app/globals.css`, `tests/CLOUDFLARE_NAVBAR_TEST_MATRIX.md`,
  `tests/e2e/site-header-mega-menu.spec.ts`
- **References:** D-016, D-035, D-036, D-037,
  `tests/CLOUDFLARE_NAVBAR_TEST_MATRIX.md`

### D-043 — Guard Platform hover state by actual desktop pointer capability

- **Date:** 2026-09-19
- **Status:** Accepted
- **Context:** Navbar browser validation exposed a pre-existing interaction
  boundary in `PlatformShowcase`: Playwright can dispatch a mouse-enter event
  at a mobile viewport even when the production device has no hover-capable
  fine pointer. The unguarded handler could change the open mobile accordion
  panel through a desktop-only interaction path.
- **Decision:** Before applying panel activation from `onMouseEnter`, require
  the same desktop-capable media conditions used by the visual interaction:
  `min-width: 48.0625rem`, `hover: hover`, and `pointer: fine`. Button activation
  remains the mobile, touch, and keyboard path; the initial and one-open state
  contracts are unchanged.
- **Rationale:** Matching the event handler to the interaction's real input and
  breakpoint boundary removes accidental cross-mode state changes without a
  second state model, listener, dependency, or user-agent detection.
- **Consequences:** Synthetic or hybrid environments that do not report all
  three desktop conditions cannot activate a product through mouse enter, but
  retain the explicit button path. The focused mobile regression passes 1/1,
  the independent combined E2E suite passes 100/100, and the aggregate
  `npm test` gate passes.
- **Affected paths:** `src/components/platform-showcase.tsx`,
  `tests/e2e/platform-panels.spec.ts`
- **References:** D-029, D-030,
  `tests/PLATFORM_PANELS_TEST_MATRIX.md`

### D-044 — Do not block the static release on development-tool audit findings

- **Date:** 2026-09-19
- **Status:** Accepted
- **Context:** The current dependency audit reports 1 critical, 13 high,
  19 moderate, and 4 low findings. Every critical and high root belongs to
  development tooling and is absent from the generated static `out/` artifact.
  The deployment workflow invokes PostCSS only against trusted, checked-in CSS;
  it does not process untrusted user input.
- **Decision:** Do not block this static release on the current audit report and
  do not run `npm audit fix --force`. Track a later exact, independently tested
  toolchain patch to `@playwright/test` 1.55.1, `postcss` 8.5.28,
  `serve` 14.2.6, and `vitest` 3.2.7. Keep `@lhci/cli` unchanged for now:
  version 0.15.1 pins a vulnerable Lighthouse dependency and has no safe
  isolated patch under the project's Node 22.18 runtime.
- **Rationale:** The critical and high findings are not shipped to visitors and
  the only identified build-time PostCSS path operates on trusted repository
  content. Forced audit remediation would permit breaking transitive upgrades
  without addressing a runtime exposure in the deployed static site. Exact
  patches can be validated as a separate bounded change.
- **Consequences:** This is a documented release-risk acceptance, not a claim
  that the dependency tree is vulnerability-free. CI and local development
  tooling remain exposed to their applicable advisories until the exact patch
  set is tested. Any future untrusted CSS input, runtime server deployment, or
  production inclusion of these packages invalidates this assessment and
  requires reevaluation. The retained Lighthouse LCP debt in D-041 remains
  unchanged and separate from this dependency decision. No push or deployment
  status is implied.
- **Affected paths:** `package.json`, `package-lock.json`,
  `.github/workflows/deploy-pages.yml`, `out/`
- **References:** D-041

## Compact codebase map

| Path | Purpose | Current status |
| --- | --- | --- |
| `AGENTS.md` | Repository operating contract for graph-first discovery, compact task DAGs, topological and disjoint-write execution, storage boundaries, independent test gates, and context completion | Active; authoritative workflow |
| `DESIGN.md` | Machine-linted production design system, interaction rules, and accessibility baseline | Active; `design:lint` passing |
| `PRODUCT.md` | Product intent, audience, brand register, voice, claim policy, and public-content boundaries | Active |
| `package.json` | Pinned production dependencies and build, validation, preview, and Graft scripts | Active |
| `package-lock.json` | Deterministic Node dependency resolution | Active |
| `next.config.mjs` | MDX-enabled, trailing-slash static export with environment-driven GitHub Pages base path | Active |
| `tsconfig.json` | Strict TypeScript and `@/` source alias configuration | Active |
| `eslint.config.mjs` | Next.js and TypeScript lint configuration | Active |
| `postcss.config.mjs` | Tailwind CSS v4 PostCSS integration | Active |
| `components.json` | Local shadcn component-generation conventions | Active |
| `opencode.json` | Project tool configuration | Active |
| `.gitignore` | Repository ignore rules | Active |
| `.npmrc` | Keeps npm's cache inside the workspace | Active |
| `scripts/Invoke-WorkspaceNodeTool.ps1` | Enforces workspace-local npm/npx cache and temp paths | Active |
| `.github/workflows/deploy-pages.yml` | Official two-job GitHub Pages build, artifact upload, and deployment pipeline for `main` | Active |
| `.ignore` | Tool/search ignore rules | Active |
| `graft/` | Generated repository context graph for the production TypeScript/React application | Refreshed; build/check passing |
| `.codex/skills/` | Project-local Emil design-engineering and Apple design guidance used for the shared glass navbar | Active; documentation-only skills |
| `docs/architecture/DECISIONS.md` | Durable architecture decisions and codebase map | This document |
| `docs/design/RISK_LANDSCAPE_REFERENCE.md` | Source brief for the implemented funnel's composition, motion, responsive, and accessibility constraints | Implemented by `src/components/risk-landscape.tsx` |
| `src/app/layout.tsx` | Root semantic shell, font, shared header/footer, shared metadata fields, and Organization/WebSite JSON-LD; route titles and indexability remain page-owned | Active |
| `src/app/page.tsx` | Production homepage and section ordering | Active; statically exported |
| `src/app/not-found.tsx` | Server-rendered custom 404 shell with static-first recovery content, CTA, diagram, noindex title state, and optional empty social boundary | Active; exported as `out/404.html` |
| `src/app/products/page.tsx` | Hyper Tern, Hyper-ABS, and Hyper-0x product route with status boundaries | Active; statically exported |
| `src/app/services/page.tsx` | AI Security, Secure Inference, and Custom AI/fine-tuning service route | Active; statically exported |
| `src/app/about/page.tsx` | Mission, protection layers, responsibilities, capability status, and vision route | Active; statically exported |
| `src/app/blog/page.tsx` | Educational article index | Active; statically exported |
| `src/app/blog/[slug]/page.tsx` | Six statically generated MDX article routes, article metadata, and structured data | Active |
| `src/app/robots.ts` | Static crawl policy metadata route | Active |
| `src/app/sitemap.ts` | Static sitemap for pages and articles | Active |
| `src/app/globals.css` | Production tokens, responsive layouts, restored below-fold content visibility, 404-only chrome/layout rules, mega-menu and Contact CTA presentation, focus styles, motion, and preference fallbacks | Active |
| `src/components/site-header.tsx` | Shared ordered navigation with real top-level links, one-open desktop mega-menu previews, grouped mobile Sheet and no-JavaScript destinations, current-route semantics, and the external violet Contact CTA | Active; focused navbar 10/10 and combined E2E 100/100 passing |
| `src/components/not-found-motion.tsx` | Route-local client island that dynamically imports Anime.js 4.5.0, scopes deterministic SVG motion, and cleans up without affecting normal routes | Active |
| `src/components/platform-showcase.tsx` | One-open product disclosure with keyboard, pointer, mobile, reduced-motion, and no-JavaScript paths; hover activation is restricted to desktop-width fine pointers that report hover capability | Active; focused mobile guard 1/1 and combined E2E 100/100 passing |
| `src/components/ui/viewport-section.tsx` | Semantic homepage scene boundary with stable test hook and CSS-driven usable-viewport minimum | Active; no client measurement or dependency |
| `src/components/` | Shared assessment CTA, logo, status, risk funnel, header, and local UI primitives | Active |
| `src/lib/types.ts` | Static public-content interfaces, including the HTTPS-only 404 social-link contract | Active |
| `src/lib/site-data.ts` | Single source for configuration, navigation, product, service, risk, industry, article metadata, and currently empty 404 social links | Active |
| `src/mdx-components.tsx` | MDX component boundary that prefixes internal anchors for repository-scoped Pages output | Active |
| `src/lib/articles.ts` | Explicit local MDX loader registry | Active |
| `src/lib/metadata.ts` | Shared absolute page-title metadata and canonical URL construction | Active |
| `src/lib/json-ld.tsx` | Typed structured-data serialization and `<` escaping boundary | Active |
| `src/content/articles/` | Six original local MDX articles | Active; no runtime fetch |
| `public/brand/` | Byte-preserved official Buckleson and Hyper-0x source artwork plus proportion-preserving WebP display derivatives | Active; originals remain hash validated |
| `public/brand/buckleson-icon-v2.svg` | Versioned, self-contained favicon wrapper embedding the unchanged Buckleson JPEG under the rounded clip | Active; focused browser check and Pages validation passing |
| `public/.nojekyll` | Prevents GitHub Pages/Jekyll from filtering Next static-export paths | Active; copied into `out/` |
| `out/` | Generated deployable static export | Build output; not source |
| `tests/PRODUCTION_WEBSITE_TEST_MATRIX.md` | Current risk-based production acceptance contract | Active |
| `tests/Validate-ProductionWebsite.ps1` | Deterministic route, content, asset, link, metadata, SEO, and claim validator | Passing |
| `tests/ANIMATED_404_PERFORMANCE_TEST_MATRIX.md` | Risk-based contract for 404 semantics, animation isolation, fallbacks, responsive behavior, derivatives, and rendering deferral | Active |
| `tests/Validate-404Performance.ps1` | Deterministic static validator for 404 content, Anime.js isolation, metadata, social-link, brand-integrity, and performance-source contracts | Active |
| `tests/e2e/not-found-performance.spec.ts` | Focused browser coverage for missing routes, static/reduced-motion behavior, responsive containment, chunk isolation, image loading, and accessibility | Active |
| `tests/CLOUDFLARE_NAVBAR_TEST_MATRIX.md` | Risk-based contract for mega-menu structure, hover and keyboard state, mobile and no-JavaScript parity, Contact CTA treatment, responsive containment, preferences, and accessibility | Active |
| `tests/e2e/site-header-mega-menu.spec.ts` | Focused browser coverage for link order, one-open panels, hover corridor, focus/Escape behavior, route state, Contact CTA, mobile grouping, reduced motion, reflow, Axe, and no-JavaScript destinations | Passing 10/10; included in combined E2E 100/100 |
| `tests/e2e/production-website.spec.ts` | Responsive, navigation interaction, keyboard, reduced-motion, route, CTA, logo, and Axe browser coverage | Combined E2E passing 100/100; dedicated a11y 11/11 |
| `tests/e2e/platform-panels.spec.ts` | Focused PlatformShowcase state, keyboard, guarded desktop-hover, mobile, no-JavaScript, reduced-motion, and layout coverage | Mobile hover-guard check passing 1/1; included in combined E2E 100/100 |
| `tests/e2e/viewport-sections.spec.ts` | Homepage usable-height, natural-overflow, containment, resize, text-scale, fallback, Platform-state, and anchor coverage | Passing 18/18 |
| `tests/VIEWPORT_SECTIONS_TEST_MATRIX.md` | Risk-based acceptance and applicability contract for homepage viewport scenes | Active |
| `tests/GLASS_NAVBAR_TEST_MATRIX.md` | Focused single-shell geometry, unboxed per-character label motion, active-route, fallback, responsive, and accessibility contract for the shared navbar | Active |
| `tests/LOGO_ROUNDING_TEST_MATRIX.md` | Source-integrity, rounded presentation, favicon safety, metadata, and logo-semantics contract | Active; passing |
| `tests/PLATFORM_PANELS_TEST_MATRIX.md` | Focused progressive-disclosure acceptance and applicability contract | Active; passing |
| `tests/GITHUB_PAGES_TEST_MATRIX.md` | Repository identity, deployment, routing, asset, metadata, security, and live-provenance contract | Active |
| `tests/Validate-GitHubPages.ps1` | Deterministic GitHub Pages workflow and exported-output validator | Passing locally |
| `tests/lighthouserc.cjs` | Three-run mobile Lighthouse thresholds | Retained cohort: LCP median 2,829.375 ms fails the active 2.5 s budget; CLS 0 and TBT median 35 ms pass |
| `src/lib/site-data.test.ts` | Unit checks for local public-data contracts | Passing |
| `vitest.config.ts` | Unit-test discovery and source alias configuration | Active |
| `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md` | Previous five-page wireframe acceptance contract | Historical |
| `tests/Validate-MultipageWireframe.ps1` | Previous multi-page static validator | Historical |
| `tests/WIREFRAME_TEST_MATRIX.md` | Original homepage-only validation contract | Historical |
| `tests/Validate-Wireframe.ps1` | Original homepage-only static validator | Historical |

Update this table whenever a new top-level subsystem, application, test suite, or operational component is introduced.

## Future decision entry template

Copy this section for each material decision. Keep entries concise and reference existing specs, plans, issues, commits, or diffs instead of duplicating them.

```markdown
### D-NNN — Decision title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded
- **Context:** What constraint or problem required a decision?
- **Decision:** What was chosen?
- **Rationale:** Why is this the smallest suitable choice?
- **Consequences:** What becomes easier, harder, required, or intentionally unsupported?
- **Affected paths:** `path/to/file`
- **References:** Links or repository paths to relevant artifacts
```
