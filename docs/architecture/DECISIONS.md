# Architecture and Context Record

Last updated: 2026-09-16

## Current project state

- The current website implementation slice is complete: a local, responsive,
  five-page Buckleson wireframe under `dist/`.
- The wireframe is an approval artifact, not the final production design or
  application stack.
- A local Git repository is initialized at `D:\high-quality` on branch `main`; no remote is configured.
- Graft v0.18.0 is installed locally through the project's Node dependencies.
- Graft configuration is present in `package.json`, `package-lock.json`, `opencode.json`, `.gitignore`, and `graft/`.
- Deterministic static validation and browser smoke checks pass for the current
  multi-page wireframe. See `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md` and
  `tests/Validate-MultipageWireframe.ps1`. The original homepage-only contract
  remains as historical test context.

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

## Compact codebase map

| Path | Purpose | Current status |
| --- | --- | --- |
| `AGENTS.md` | Repository-specific discovery and Graft workflow instructions | Active |
| `package.json` | Local Node tooling and Graft scripts/dependency declaration | Active |
| `package-lock.json` | Deterministic Node dependency resolution | Active |
| `opencode.json` | Project tool configuration | Active |
| `.gitignore` | Repository ignore rules | Active |
| `.npmrc` | Keeps npm's cache inside the workspace | Active |
| `scripts/Invoke-WorkspaceNodeTool.ps1` | Enforces workspace-local npm/npx cache and temp paths | Active |
| `.ignore` | Tool/search ignore rules | Active |
| `graft/` | Generated repository context graph | Present; no application nodes yet |
| `docs/architecture/DECISIONS.md` | Durable architecture decisions and codebase map | This document |
| `docs/design/RISK_LANDSCAPE_REFERENCE.md` | Approved future composition, motion, responsive, and accessibility direction for the Risk Landscape | Direction recorded; not implemented |
| `PRODUCT.md` | Product intent, audience, voice, claim policy, visual constraints, and accessibility baseline | Active |
| `dist/index.html` | Concise homepage, agent-to-destination risk funnel, product summary, blockchain explanation, services, and calls to action | Approval preview complete |
| `dist/products.html` | Hyper Tern, Hyper-ABS, and Hyper-0x product-family route | Approval preview complete |
| `dist/services.html` | AI Security, Secure Inference, and Custom AI service route | Approval preview complete |
| `dist/about.html` | Mission, current capability, pilot stage, and long-term vision route | Approval preview complete |
| `dist/blog/index.html` | Educational AI-risk and mitigation article index | Approval preview complete; individual articles deferred |
| `dist/assets/brand/buckleson-logo.jpg` | User-designated official Buckleson logo source; exact 322 × 308 JPEG retained for later approved UI placement | Preserved; independently validated; not wired into HTML/CSS |
| `dist/assets/brand/hyper-0x-logo.png` | User-designated official Hyper-0x logo source; exact 1254 × 1254 PNG retained for later approved UI placement | Preserved; independently validated; not wired into HTML/CSS |
| `dist/assets/wireframe.css` | Shared responsive grayscale wireframe styling, funnel, page layouts, focus states, and reduced-motion behavior | Active |
| `dist/vendor/oat/` | Locally pinned Oat assets, license, and provenance | Revision `6ec225a` |
| `tests/MULTIPAGE_WIREFRAME_TEST_MATRIX.md` | Current risk-based five-page acceptance contract | Active |
| `tests/Validate-MultipageWireframe.ps1` | Deterministic multi-page static validator | Passing |
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
