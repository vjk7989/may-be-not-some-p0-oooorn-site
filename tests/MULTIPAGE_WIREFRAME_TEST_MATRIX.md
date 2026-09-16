# Buckleson multi-page wireframe validation matrix

## Contract

The revision is a deterministic, local-only Oat wireframe made of five real
HTML documents:

- `dist/index.html`
- `dist/products.html`
- `dist/services.html`
- `dist/about.html`
- `dist/blog/index.html`

Run the acceptance gate from the repository root:

```powershell
pwsh -NoProfile -File .\tests\Validate-MultipageWireframe.ps1
```

The command must exit `0` and print
`PASS: Buckleson multi-page wireframe validation`. It reads only files below
the supplied `DistRoot`, performs no network requests, and aggregates all
failures into one report.

## Risk-based matrix

| Category | Scenario | Deterministic assertion | Acceptance criterion |
| --- | --- | --- | --- |
| Happy path | Five-page site exists | Each contract page and shared local Oat/CSS asset is a non-empty file | All five pages can render from local files or the local HTTP server |
| Happy path | First-glance homepage | Exact visible hero statements identify the audience, category, and operating principle | The first screen contains “We help you use AI safely”, “A Trust & Execution Layer for AI Infrastructure”, and “We secure how AI runs — not what AI thinks” |
| Happy path | Homepage information architecture | Risk funnel, outcomes/products, blockchain explanation, services, assessment, industries, evidence, vision, and footer are present | Requested homepage areas exist; the removed controlled-request path does not |
| Happy path | Product page | Hyper Tern, Hyper-ABS, and Hyper-0x are present | No Hyper Wallet product appears anywhere in the site |
| Happy path | Service page | AI Security, Secure Inference, and Custom AI/fine-tuning are present | Secure Inference is explicitly described as controls around inference |
| Happy path | About page | Mission, vision, and qualified traction are present | MVP/pilot statements remain qualified and contain no confidential finance |
| Happy path | Blog index | The page identifies both OWASP LLM and agentic-AI risk sets as educational references | It does not claim complete coverage or remediation of all risks |
| Input boundaries | Missing or zero-byte artifact | Every required page and asset is checked before content assertions | A missing/empty file fails with its exact path rather than throwing or silently passing |
| Input boundaries | Short/simple hero | Visible primary heading length is bounded | Homepage `h1` is at most 60 visible characters and contains the concise approved promise |
| Input boundaries | Risk-funnel population | Four ordered stages and a minimum set of source-defined risks are required | Agents → attacks → Buckleson → destinations is explicit and readable without decorative interpretation |
| Malformed/missing input | Invalid document shell | Doctype, `lang`, charset, viewport, title, one `h1`, and semantic landmarks are checked per page | Every page has a valid minimum semantic shell |
| Malformed/missing input | Broken or unsafe path | Relative links and assets are resolved against the containing page and constrained to `dist` | Missing targets, traversal outside `dist`, empty `href`, CDN assets, and `javascript:` URLs fail |
| Navigation | Multi-page primary navigation | Each page’s primary nav resolves to Home, Products, Services, About, and Blog HTML files | Navigation uses real documents rather than homepage section placeholders |
| Navigation | Current location | Each page marks one link with `aria-current="page"` | Screen-reader users can identify the current page |
| State transitions | Keyboard navigation | Skip link and visible `:focus-visible` styling are required | Keyboard users can bypass navigation and retain visible focus |
| State transitions | Runtime application state | N/A — the wireframe has no form submission, modal, carousel, client-side router, authentication, or persisted state | No speculative state-transition test is introduced |
| Failure/recovery | Correcting a failed assertion | The validator is read-only, stateless, and aggregates failures | The same command can be rerun after a source correction without fixture reset |
| Regression | Removed homepage content returns | Site-wide text and homepage IDs are checked | Hyper Wallet and the controlled-request/how-it-works section cannot silently return |
| Regression | Product/service boundaries drift | Exact approved product/service names and bounded descriptions are checked on their dedicated pages | Multi-page expansion preserves the agreed offering model |
| Regression | Blockchain responsibilities blur | Homepage blockchain copy must assign data-exposure protection to Hyper-ABS and evidence/audit/settlement to Hyper-0x | Hyper-0x is not represented as validating AI truth or replacing privacy controls |
| Regression | Aspirational features become current claims | A visible “Designed for” status is required near forward-looking blockchain features | Speculative properties are not presented as shipped/current |
| Regression | Unsupported security claim appears | Case-insensitive forbidden-claim patterns are evaluated over visible site text | Absolute security/privacy, universal OWASP coverage, AI-truth verification, and unsubstantiated confidential-computing claims fail |
| Regression | Confidential business data appears | Finance-sensitive terms are rejected | Fundraising ask, runway, use of funds, and revenue projections remain absent |
| Concurrency | Shared mutable state or simultaneous writers | N/A — committed static files have no concurrent runtime behavior | No concurrency test is required |
| Time | Timers, expirations, or clock-derived content | N/A — the wireframe has no time-dependent behavior | No wall-clock dependency is introduced |
| Randomness | Generated copy, IDs, or layouts | N/A — all approved content and IDs are static | Output is identical between reads |
| I/O | Local page and asset loading | Validator performs only local filesystem reads; every referenced stylesheet/script resolves locally | Site validation and approved rendering require no third-party network access |
| Security | Static-page execution boundary | Remote executable assets, inline event handlers, inline scripts, unsafe URLs, and path traversal are rejected | Wireframe cannot execute unreviewed third-party or inline behavior |
| Accessibility | Semantic structure | Header, labelled primary nav, main, footer, ordered heading levels, skip target, and meaningful links are checked | Core navigation and page purpose are available without visual styling |
| Accessibility | Risk funnel alternative | The funnel is a labelled `figure` with a `figcaption`, ordered semantic stages, and readable stage text | Its meaning and direction are available to assistive technology |
| Accessibility | Responsive/reduced motion | Mobile breakpoint, overflow wrapping, focus visibility, and reduced-motion query are required | Narrow screens and motion preferences retain usable content |
| Accessibility | Images | Any image must include a non-empty `alt` attribute | No meaningful bitmap is exposed without a text alternative |

## Required source-defined funnel vocabulary

The funnel must identify AI agents before the threat stage and include at least
these exact source-defined attack labels:

- Prompt Injection
- Sensitive Information Disclosure
- Excessive Agency
- Intent Breaking & Goal Manipulation (Agentic T6)
- Tool Misuse (Agentic T2)
- Memory Poisoning (Agentic T1)

The output stage must name users, servers, applications, and devices. These
checks validate content accuracy and direction; visual spacing and polish still
require desktop/mobile browser inspection.

## Deliberate limitations

- Static assertions do not prove color contrast ratios, absence of horizontal
  scrolling at every viewport, or visual overlap. The independent runner must
  complement this suite with desktop and mobile browser inspection.
- No form-processing test is included because the contact/assessment action is
  an approval-stage navigation endpoint, not a production submission flow.
- No performance budget is asserted beyond local assets and static pages; the
  production stack has not been selected.
