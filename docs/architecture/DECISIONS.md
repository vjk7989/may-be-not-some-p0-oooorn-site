# Architecture and Context Record

Last updated: 2026-09-18

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
- Production gates currently pass for design-system linting, ESLint,
  TypeScript, unit and contract checks, static build, content, links, SEO,
  Playwright end-to-end coverage (44/44), and the dedicated accessibility slice
  (11/11). The latest isolated Lighthouse LCP is approximately 2.611 s against
  the active 2.5 s budget; publication carries the explicit user-authorized
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

## Compact codebase map

| Path | Purpose | Current status |
| --- | --- | --- |
| `AGENTS.md` | Repository operating contract, graph-first discovery, storage boundary, and gated workflow | Active |
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
| `src/app/layout.tsx` | Root semantic shell, font, shared header/footer, metadata, and Organization/WebSite JSON-LD | Active |
| `src/app/page.tsx` | Production homepage and section ordering | Active; statically exported |
| `src/app/products/page.tsx` | Hyper Tern, Hyper-ABS, and Hyper-0x product route with status boundaries | Active; statically exported |
| `src/app/services/page.tsx` | AI Security, Secure Inference, and Custom AI/fine-tuning service route | Active; statically exported |
| `src/app/about/page.tsx` | Mission, protection layers, responsibilities, capability status, and vision route | Active; statically exported |
| `src/app/blog/page.tsx` | Educational article index | Active; statically exported |
| `src/app/blog/[slug]/page.tsx` | Six statically generated MDX article routes, article metadata, and structured data | Active |
| `src/app/robots.ts` | Static crawl policy metadata route | Active |
| `src/app/sitemap.ts` | Static sitemap for pages and articles | Active |
| `src/app/globals.css` | Production tokens, responsive layouts, focus styles, funnel motion, shared-navbar glass/fallbacks, and reduced-motion behavior | Active |
| `src/components/site-header.tsx` | Shared ordered desktop, mobile Sheet, and no-JavaScript navigation shell | Active |
| `src/components/platform-showcase.tsx` | One-open product disclosure with keyboard, pointer, mobile, reduced-motion, and no-JavaScript paths | Active |
| `src/components/` | Shared assessment CTA, logo, status, risk funnel, header, and local UI primitives | Active |
| `src/lib/types.ts` | Static public-content interfaces | Active |
| `src/lib/site-data.ts` | Single source for configuration, navigation, product, service, risk, industry, and article metadata | Active |
| `src/mdx-components.tsx` | MDX component boundary that prefixes internal anchors for repository-scoped Pages output | Active |
| `src/lib/articles.ts` | Explicit local MDX loader registry | Active |
| `src/lib/metadata.ts` | Shared page metadata and canonical URL construction | Active |
| `src/lib/json-ld.tsx` | Typed structured-data serialization and `<` escaping boundary | Active |
| `src/content/articles/` | Six original local MDX articles | Active; no runtime fetch |
| `public/brand/` | Byte-preserved official Buckleson and Hyper-0x source artwork | Active; hash validated |
| `public/brand/buckleson-icon.svg` | Local safe favicon wrapper that rounds the unchanged Buckleson JPEG | Active; HTTP 200 |
| `public/.nojekyll` | Prevents GitHub Pages/Jekyll from filtering Next static-export paths | Active; copied into `out/` |
| `out/` | Generated deployable static export | Build output; not source |
| `tests/PRODUCTION_WEBSITE_TEST_MATRIX.md` | Current risk-based production acceptance contract | Active |
| `tests/Validate-ProductionWebsite.ps1` | Deterministic route, content, asset, link, metadata, SEO, and claim validator | Passing |
| `tests/e2e/production-website.spec.ts` | Responsive, keyboard, reduced-motion, route, CTA, logo, and Axe browser coverage | Passing 31/31; dedicated a11y 11/11 |
| `tests/e2e/platform-panels.spec.ts` | Focused PlatformShowcase state, keyboard, mobile, no-JavaScript, reduced-motion, and layout coverage | Passing as part of 44/44 combined E2E |
| `tests/GLASS_NAVBAR_TEST_MATRIX.md` | Focused material, fallback, navigation, responsive, and accessibility contract for the shared navbar | Active; final runner totals pending |
| `tests/LOGO_ROUNDING_TEST_MATRIX.md` | Source-integrity, rounded presentation, favicon safety, metadata, and logo-semantics contract | Active; passing |
| `tests/PLATFORM_PANELS_TEST_MATRIX.md` | Focused progressive-disclosure acceptance and applicability contract | Active; passing |
| `tests/GITHUB_PAGES_TEST_MATRIX.md` | Repository identity, deployment, routing, asset, metadata, security, and live-provenance contract | Active |
| `tests/Validate-GitHubPages.ps1` | Deterministic GitHub Pages workflow and exported-output validator | Passing locally |
| `tests/lighthouserc.cjs` | Three-run mobile Lighthouse thresholds | LCP budget remains 2.5 s; latest isolated run ~2.611 s under explicit deployment exception |
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
