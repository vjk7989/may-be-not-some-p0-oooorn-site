# Buckleson favicon visibility validation matrix

## Scope

Replace the browser icon wrapper that references `buckleson-logo.jpg` at
runtime with one versioned, self-contained favicon. Preserve the approved
source JPEG byte-for-byte. The favicon must remain readable on both light and
dark browser chrome and resolve correctly in local previews and the
repository-scoped GitHub Pages export.

## Risk-based checks

| Category | Check | Acceptance |
| --- | --- | --- |
| Happy path | Metadata declaration | The rendered document exposes exactly one `rel="icon"` link to `/brand/buckleson-icon-v2.svg` locally and the same asset beneath the configured GitHub Pages base path in release output. |
| Happy path | Browser decode | Chromium successfully decodes the icon as an image with non-zero intrinsic dimensions. |
| Visibility | Light and dark chrome | Rendered pixels contain both a dark field and a high-contrast light mark; the icon does not become transparent or single-tone against either browser theme. |
| Self-containment | No dependent asset fetch | The SVG has no relative, root-relative, protocol-relative, HTTP(S), or file `href`/`src`. Any embedded raster payload is an inline `data:image/jpeg;base64,...` value. |
| Cache recovery | Versioned URL | Metadata moves to the new `buckleson-icon-v2.svg` filename so browsers are not required to invalidate a cached broken icon at the old URL. |
| Asset integrity | Original logo | `public/brand/buckleson-logo.jpg` remains SHA-256 `19C1C8EA72D395660AD59BFB05BBBD02F3473DE2C614D4740B3B2F67C1CD3481`; the favicon fix must not mutate or recompress it. |
| Export | Local and Pages artifacts | The versioned icon exists and is non-empty in `public/brand/` and `out/brand/`; the Pages-targeted HTML references an existing non-empty prefixed asset exactly once. |
| Missing/malformed input | Deterministic failure | A missing/empty icon, invalid SVG, missing view box, undecodable image, empty embedded payload, or stale metadata URL fails validation. |
| Security | SVG boundary | The icon contains no script, event attributes, `foreignObject`, remote URL, or filesystem URL. |
| Accessibility | Document semantics | N/A for alternative text: favicons are browser chrome, not document content. Existing accessible Buckleson logo links remain covered by the logo and E2E suites. |
| Regression | Social metadata | Open Graph, Twitter, and JSON-LD may continue to use the byte-preserved JPEG; only browser-icon metadata changes. |

## Applicability notes

- Input boundaries: applicable only to static asset bytes, URL shape, and SVG
  parsing; there is no user-provided input.
- State transitions: cache recovery is represented by the filename change;
  there is no application state.
- Failure and recovery: a previously cached broken favicon is bypassed by the
  versioned filename, while absence or malformed output fails deterministically.
- I/O: applicable to checked-in and exported static files and browser HTTP
  responses; no runtime network dependency is allowed.
- Security: applicable because SVG is an active-capable format; executable and
  external-resource constructs are forbidden.
- Accessibility: visual contrast is relevant to recognition, but DOM ARIA and
  keyboard behavior are not applicable to browser chrome.
- Concurrency, time, randomness, authentication, persistence, and multi-user
  state: not applicable to a deterministic static icon.

## Red-first expectation

The current implementation must fail because metadata still names
`buckleson-icon.svg` and that SVG references the relative
`buckleson-logo.jpg` asset instead of carrying all pixels within one response.
The source-JPEG integrity assertion should continue to pass.
