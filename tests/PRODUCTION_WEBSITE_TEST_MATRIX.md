# Buckleson production website test matrix

## Acceptance contract

The production artifact is a deterministic Next.js static export rooted at
`out/`. Run the dependency-free contract after a successful build:

```powershell
pwsh -NoProfile -File .\tests\Validate-ProductionWebsite.ps1
pwsh -NoProfile -File .\tests\Validate-ProductionWebsite.ps1 -SelfTest
```

Both commands must exit `0`. The first reads only `out/`; the second validates
the validator against `tests/fixtures/production-metadata-cases.json` and does
not require a build. Neither command makes a network request.

Browser checks are defined in `tests/e2e/production-website.spec.ts`. They must
run against the built static export through a local HTTP server. Lighthouse
budgets are in `tests/lighthouserc.cjs`.

## Risk-based matrix

| Category | Scenario | Deterministic check | Acceptance criterion |
| --- | --- | --- | --- |
| Happy path | Required routes | Resolve `/`, Products, Services, About, Blog, and all six article slugs from either `route.html` or `route/index.html` | Every route is present and non-empty in `out/` |
| Happy path | First-glance message | Inspect visible homepage text and H1 | Exact approved hero, audience, supporting title, and positioning line appear; H1 is concise |
| Happy path | Products and services | Inspect dedicated route text | Hyper Tern, Hyper-ABS, Hyper-0x, AI Security, Secure Inference, Custom AI, and fine-tuning are present |
| Happy path | Risk landscape | Inspect source-defined vocabulary and semantic ordering | Agents precede risks, which precede Buckleson and then users/servers/apps/devices |
| Happy path | Calendar conversion path | Inspect all exact calendar links and CTA text | At least one assessment CTA per primary conversion route uses `https://cal.com/buckleson-group/30min` in the same tab |
| Happy path | SEO articles | Validate slug, H1, metadata, JSON-LD, and index links | Six unique, indexable articles exist and are linked by the Blog index |
| Input boundaries | Empty/missing artifacts | Check route and asset size before parsing | Missing and zero-byte artifacts fail with an exact path/route |
| Input boundaries | Metadata length | Count visible title and description characters | Title is 15–65 characters; description is 70–170 characters |
| Input boundaries | Heading count | Count visible H1s | Every indexable document has exactly one non-empty H1 |
| Input boundaries | Asset identity | Hash exported official files | Buckleson JPEG and Hyper-0x PNG retain the approved SHA-256 hashes |
| Malformed or missing input | SEO metadata | Require one title, description, canonical, viewport, UTF-8, language, and robots policy | Missing, duplicated, local, malformed, or inconsistent metadata fails |
| Malformed or missing input | Structured data | Parse every `application/ld+json` block as JSON | Invalid JSON, missing Organization/WebSite/Article/Breadcrumb data, raw `<` in serialized JSON, and article/H1 mismatch fail |
| Malformed or missing input | Validator regression | Run valid and deliberately malformed HTML fixtures | Every fixture produces its declared result and issue codes |
| State transitions | Mobile navigation | Playwright opens the menu, checks its accessible state, follows a route, and closes via Escape when supported | Navigation is keyboard operable and focus is not trapped or lost |
| State transitions | Skip navigation | Use Tab and Enter from a fresh page | Focus moves to `#main-content` |
| State transitions | Assessment action | Follow CTA in same tab | Browser reaches the exact approved Cal.com URL; no `_blank` is used |
| Failure and recovery | Read-only repeatability | Run validators twice against unchanged output | Results are identical; no fixture reset is needed |
| Failure and recovery | Build absent | Run static validator without `out/` | Clean aggregated failure and exit `1`, not an unhandled exception |
| Regression | Removed concepts | Search visible site text | “Hyper Wallet” and “A controlled request path” remain absent |
| Regression | Claim drift | Search affirmative visible claims with negation awareness | No absolute security/privacy, universal OWASP, AI-truth, confidential-computing, or finance claims |
| Regression | Capability status | Inspect Products and About labels | Current, pilot/in-progress, designed-for, and vision content stay distinguishable |
| Regression | Secure inference boundary | Inspect Services text | Secure Inference is protection/control around inference, not confidential computing |
| Regression | Hyper-0x boundary | Inspect Products/About/Home text | Hyper-0x is evidence, verification, audit, and settlement infrastructure—not confidentiality or model-truth proof |
| Regression | Navigation and links | Resolve local `href`, `src`, stylesheet, script, image, sitemap, and fragment targets inside `out/` | No broken internal links, traversal, empty links, JavaScript URLs, or remote executable assets |
| Concurrency | Shared runtime state | N/A: exported marketing pages have no mutable server or multi-user state | No concurrency test is introduced |
| Time | Publication metadata | Fixed ISO dates are checked syntactically only | Tests never compare with the wall clock; output is deterministic |
| Randomness | Generated IDs/layout/content | N/A: build content is static and no random contract is authorized | Repeated reads produce the same assertions |
| I/O | Static local delivery | Serve `out/` locally and navigate every route | No application content requires a third-party request; the calendar and cited authorities are links only |
| Security | Static execution boundary | Inspect HTML and browser requests | No inline event handlers, `javascript:` URLs, remote scripts/styles/fonts, or unexpected form submissions |
| Security | JSON-LD injection boundary | Reject raw `<` inside JSON-LD payloads | Typed structured-data output is escaped before insertion |
| Accessibility | Semantic shell | Require `lang`, header/nav/main/footer, skip target, headings, named links/buttons, and image `alt` | Core meaning and navigation work without styling |
| Accessibility | Diagram alternative | Require a labelled Risk Landscape plus an ordered textual explanation | Assistive technology receives the same agent→risk→boundary→destination story |
| Accessibility | Keyboard and Axe | Playwright keyboard checks plus Axe | No serious or critical Axe violations; focus remains visible |
| Accessibility | Responsive/zoom | Browser viewports 320, 390, 768, 1024, 1440 and a 200% zoom-equivalent viewport | No document-level horizontal overflow or obscured H1/navigation/CTA |
| Accessibility | Reduced motion | Emulate `prefers-reduced-motion: reduce` and inspect animated elements | Animation duration is effectively disabled and the complete funnel remains visible |
| Performance | Production mobile budgets | Lighthouse three times on `/`, use the median | Performance, Accessibility, Best Practices, SEO ≥95; LCP ≤2500ms; CLS ≤0.10; TBT ≤200ms |

## Required routes and article slugs

- `/`
- `/products`
- `/services`
- `/about`
- `/blog`
- `/blog/ai-agent-security`
- `/blog/prompt-injection-prevention`
- `/blog/secure-ai-inference`
- `/blog/llm-data-leakage`
- `/blog/excessive-agency`
- `/blog/ai-audit-trails`

## Deliberate limits

- Static checks do not claim visual quality. The independent runner must review
  desktop and mobile captures after the automated browser suite passes.
- External educational citations are checked for safe HTTPS markup, not fetched;
  network availability cannot make the local build fail.
- Calendar service availability is outside this repository. The suite validates
  the exact destination and same-tab behavior without submitting a booking.
- No form, authentication, database, payment, analytics, API, or deployment
  behavior exists in scope, so those test categories are not applicable.
