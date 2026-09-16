# Buckleson homepage wireframe validation matrix

## Contract

The approval slice is a static, browser-rendered homepage with this tracked
layout:

- `dist/index.html`
- `dist/assets/wireframe.css`
- `dist/vendor/oat/oat.min.css`
- `dist/vendor/oat/oat.min.js`

Run the deterministic validator from the repository root:

```powershell
pwsh -NoProfile -File .\tests\Validate-Wireframe.ps1
```

The command must exit `0` and print `PASS: Buckleson wireframe validation`.
Any failed assertion is printed independently and the command exits `1`, so a
fix can be verified by rerunning exactly the same command.

## Risk-based matrix

| Category | Scenario | Deterministic assertion | Acceptance criterion |
| --- | --- | --- | --- |
| Happy path | Complete homepage | Required files, landmarks, sections, copy, diagrams, Oat references, and CSS hooks exist | All assertions pass |
| Happy path | Content coverage | Hero, platform flow, outcomes, six-step flow, products, services, assessment, industries, risk previews, traction, vision, and footer are present | No required section or approved product/service label is absent |
| Input boundaries | Empty or zero-byte artifact | Each contract file is checked for existence and non-zero length | Missing or empty files fail with the exact path |
| Input boundaries | Internal navigation boundary | Every local fragment link is resolved against a unique element ID | No empty `href="#"`, missing target, or duplicate ID |
| Malformed/missing input | Invalid page shell | Doctype, language, encoding, viewport, title, and exactly one `h1` are checked | Malformed or incomplete shell fails |
| Malformed/missing input | Incomplete content | Each required section ID and required phrase is checked independently | Validator identifies every missing item in one run |
| State transitions | Keyboard focus | Skip link and visible `:focus-visible` styling are required | Keyboard users can reach content and see focus |
| State transitions | Interactive application state | N/A: approved wireframe has no form submission, dialog, carousel, menu toggle, or client-side routing | No speculative interaction test is added |
| Failure/recovery | Correct a failed assertion | Validator aggregates failures and has no mutable fixtures, network calls, or snapshots | Same command passes after source correction; tests need no reset |
| Regression: content | Product/service terminology changes | Exact approved names and qualified security language are asserted | Copy cannot silently lose approved offerings or qualifiers |
| Regression: claims | Unsupported marketing claim introduced | Case-insensitive forbidden-claim patterns are checked | “100% secure,” guarantees, universal OWASP coverage, confidential-computing claims, and confidential finance material fail |
| Regression: Oat boundary | Asset moved to CDN or omitted | Exact local stylesheet/script references and non-empty vendored assets are required; remote CSS/JS/font imports are rejected | Page is renderable without third-party network assets |
| Regression: navigation | Placeholder or section link changes | All local anchors must resolve, including `#wireframe-notice` | No broken homepage route placeholder |
| Regression: layout | Desktop/mobile CSS removed | Layout hooks, mobile media query, wrapping, and diagram classes are asserted | CSS retains desktop and narrow-screen behavior |
| Concurrency | Multiple writers or asynchronous state | N/A: static read-only artifacts have no shared mutable runtime state | No concurrency test is needed |
| Time | Timers, dates, animation timing | N/A: page behavior is not time-dependent; reduced-motion handling is checked under accessibility | No wall-clock dependency is allowed |
| Randomness | Generated IDs/content | N/A: committed HTML and CSS are deterministic | No random content or identifier generation is allowed |
| I/O | Local asset loading | Only the four contract files are read; HTML/CSS network asset URLs are rejected | Validation and approved render require no network |
| Security | Static-page injection and external execution | Inline event handlers, `javascript:` URLs, remote scripts/styles/fonts, and unsafe external navigation are rejected | No executable inline handler or unapproved third-party dependency |
| Accessibility | Semantic structure | Header, nav, main, sections, footer, heading hierarchy hooks, named diagrams, and meaningful link text are checked | Semantic landmarks and diagram labels are present |
| Accessibility | Images and diagrams | Every image needs non-empty alt text; diagrams need `figure`, `figcaption`, and accessible names | Visual information has a textual equivalent |
| Accessibility | Responsive and motion preferences | Viewport, mobile breakpoint, overflow wrapping, and `prefers-reduced-motion` are required | Content remains readable at narrow widths and motion can be suppressed |

## Required content vocabulary

The static validator intentionally checks only wording established by the
approved plan. It does not assess visual polish or invent claims.

- Hero: “Control what AI can access”, “Govern what it can do”, and “Prove what
  happened”.
- Products: Hyper Tern, Hyper-ABS, Hyper-0x, and Hyper Wallet.
- Services: AI Security, Secure Inference, and Custom AI.
- Qualified outcomes: “helps reduce”, “controls”, and “supports auditability”.
- Hyper-0x: identified as Buckleson’s in-house blockchain and described with
  verification, audit, and settlement.
- Secure inference: protection/control around inference, without claiming a
  trusted execution environment, confidential computing, or homomorphic
  encryption.
- Selected source-defined risks: Prompt Injection, Sensitive Information
  Disclosure, Excessive Agency, Intent Breaking & Goal Manipulation (Agentic
  T6), Tool Misuse (Agentic T2), and Memory Poisoning (Agentic T1).
- Capability status: current capability, designed-for capability, and
  long-term vision are visibly distinguished.
