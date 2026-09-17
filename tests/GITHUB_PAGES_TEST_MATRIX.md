# GitHub Pages Deployment Test Matrix

## Scope

Validate the smallest deterministic delivery path for publishing the existing
Next.js static export from `D:\high-quality` to GitHub Pages. The implementation
may add repository-aware static-export configuration and one GitHub Actions
workflow, then push the reviewed source to one explicitly resolved GitHub
repository. It must not add a runtime server, third-party deployment service,
custom domain, analytics, or application feature.

## Required deployment inputs

Resolve and record these values before any remote mutation:

- GitHub owner: the authenticated account or organization selected by the user.
- Repository name: one valid GitHub slug, expected to match
  `may-be-not-some-p0-oooorn-site` unless an existing remote establishes a
  different target.
- Repository visibility: explicit existing state or user-selected value for a
  newly created repository.
- Deployment branch: `main`.
- Pages URL:
  `https://<owner>.github.io/<repository>/` for a project site, or
  `https://<owner>.github.io/` only when the repository is exactly
  `<owner>.github.io`.

Do not guess the owner, overwrite an unrelated remote, force-push, or change an
existing repository's visibility.

## Acceptance matrix

| ID | Area | Deterministic check | Expected result |
| --- | --- | --- | --- |
| GP-01 | Baseline | Run `git status --short --branch`, `git branch --show-current`, and `git remote -v` before mutation. | Current branch, working-tree state, and all remotes are captured. Branch is `main`, or the discrepancy is resolved without rewriting history. |
| GP-02 | Target identity | Compare the resolved GitHub owner/repository with any existing `origin`, package name, and Pages URL. | Exactly one intended repository is selected. A conflicting `origin` stops the push until resolved; no duplicate remote is added. |
| GP-03 | Repository slug | Validate the selected repository name against GitHub naming rules and URL construction. | The repository slug contains no backslash, `@`, spaces, or URL-unsafe substitution. The expected project-site base path is `/<repository>`. |
| GP-04 | Authentication | Query GitHub CLI authentication and the target repository before creation/push. | Authentication is valid for the resolved owner and grants repository/workflow access. Missing auth or insufficient scope fails closed without changing local source or remote state. |
| GP-05 | Remote creation | When the target does not exist, create it once with the resolved visibility and source root. When it exists, verify ownership and identity instead. | No duplicate repository is created. Existing history is inspected before push; unrelated or divergent history is not overwritten. |
| GP-06 | Push safety | Inspect staged/unstaged/untracked files and secret-like paths before commit/push; run `git diff --check`. | Only intended project files are committed. Generated `out/`, caches, logs, screenshots, environment files, credentials, and machine-local tool state remain excluded. No force push is used. |
| GP-07 | Workflow trigger | Inspect `.github/workflows/deploy-pages.yml` (or the single chosen equivalent). | Workflow triggers on pushes to `main` and supports manual dispatch. It requests only `contents: read`, `pages: write`, and `id-token: write`; concurrent deployments cancel superseded in-progress runs. |
| GP-08 | Workflow determinism | Inspect workflow runtime and install/build commands. | Node version is pinned to one major version; install uses `npm ci`; every repository npm/npx command invoked locally still uses `scripts/Invoke-WorkspaceNodeTool.ps1`; Action revisions are pinned to stable major versions or immutable SHAs. |
| GP-09 | Pages artifact | Inspect workflow build and upload paths. | Build produces `out/`; Pages upload uses exactly `out/`; deployment uses the official Pages artifact/deploy actions. No branch-copy (`gh-pages`) dependency or runtime server is introduced. |
| GP-10 | Static export | Run the production build with the resolved Pages URL/repository context. | `next build` exits 0 and exports every existing route, six article routes, `robots.txt`, and `sitemap.xml` into `out/`. |
| GP-11 | Project base path | For a project site, inspect generated HTML, CSS, JS, image, favicon, internal-navigation, sitemap, robots, Open Graph, and structured-data URLs. | Deployment-owned paths are prefixed once with `/<repository>` where required. No root-relative asset points at another GitHub Pages site namespace, and no path is double-prefixed. |
| GP-12 | User-site base path | If and only if repository name is `<owner>.github.io`, build in user-site mode. | Base path is empty and generated paths do not contain the repository name. This conditional is otherwise not applicable. |
| GP-13 | Canonical origin | Build with `SITE_URL` equal to the exact final Pages URL, including the project path when applicable. | Canonical, Open Graph, JSON-LD, sitemap, and robots sitemap URLs use HTTPS, the resolved owner, and the correct repository path. No `.example`, localhost, or preview origin appears in `out/`. |
| GP-14 | Trailing slash | Request representative deployed routes with the project's trailing-slash convention: `/`, `/about/`, `/products/`, `/services/`, `/blog/`, and all article slugs. | Each resolves successfully without a redirect loop or a 404 caused by missing `.html`, base-path, or case mismatches. |
| GP-15 | Assets | Request all local font files, brand images, favicon, CSS, and Next-generated JS referenced by exported pages. | Every referenced asset returns 200 with non-zero content and an appropriate content type. Brand source bytes and dimensions remain unchanged. |
| GP-16 | Internal links | Crawl local built output and the deployed site from the project root. | All internal page, article, fragment, logo-home, product, and navigation links remain within the project base path and resolve. The calendar CTA remains the approved external same-tab URL. |
| GP-17 | No-JavaScript | Load representative deployed Home, Products, About, Blog, and one article route with JavaScript disabled. | Semantic content, navigation fallback, product panels, headings, CTA links, images, and styles are readable; no asset or route depends on client-side routing. |
| GP-18 | Platform interaction | With JavaScript enabled, run the focused platform-panel behavior checks against the Pages deployment or an equivalent base-path local server. | Initial, hover, focus, keyboard, tap, ARIA, reduced-motion, and one-open-panel behavior remains unchanged. |
| GP-19 | Responsive/accessibility regression | Execute the existing applicable Playwright/Axe gates at 320, 390, 768, 1024, and 1440 widths, including keyboard navigation and 200% zoom checks. | No new overflow, clipping, inaccessible navigation, serious/critical Axe violation, or missing focus indicator is introduced by base-path or workflow changes. |
| GP-20 | Claim/content regression | Run design lint, lint, typecheck, unit, content, links, SEO, build, E2E, accessibility, and aggregate test gates. | All existing qualified-claim, product-content, metadata, and route contracts pass without weakening or deleting tests. |
| GP-21 | Security | Search the commit and workflow diff for tokens, credentials, private keys, unsafe expression interpolation, `pull_request_target`, writable broad permissions, untrusted script downloads, and artifact paths outside `out/`. | No secret is committed or echoed. Workflow has least privilege, does not execute untrusted fork code with write credentials, and uploads only the static export. |
| GP-22 | Pages configuration | Inspect repository Pages settings and latest deployment environment after the first push. | Source is GitHub Actions. One successful `github-pages` deployment is recorded for the intended repository and commit SHA. |
| GP-23 | Live smoke | Fetch the final Pages root, representative subpages, one article, `robots.txt`, `sitemap.xml`, favicon, logo, and one `_next/static` asset. | Responses are successful, non-empty, and belong to the pushed commit. Browser title and homepage H1 match the Buckleson site. |
| GP-24 | Final provenance | Compare local `HEAD`, `origin/main`, and the deployed workflow SHA. | All three identify the same intended commit. The final report includes repository URL, commit SHA, Pages URL, workflow run URL/status, and any blocker. |

## Failure and recovery gates

| Failure | Classification and required recovery |
| --- | --- |
| Missing GitHub authentication or insufficient scope | Environment/authorization failure. Stop before repository creation or push; report the exact missing capability. Never place a token in source, command history, or workflow YAML. |
| Repository already exists under another owner or `origin` targets a different URL | Target-identity failure. Do not repoint or overwrite automatically. Resolve the exact intended target first. |
| Remote contains commits not present locally | History divergence. Fetch and inspect read-only. Do not force-push or merge unrelated history merely to deploy. Escalate the ownership/history decision. |
| Build or local regression test fails | Production/test/toolchain failure. Stop before push, obtain independent failure analysis, apply the smallest fix, and rerun the failed gate plus applicable regression gates. |
| Workflow syntax or Actions build fails | Workflow/toolchain failure. Inspect the exact run log and failing step. Amend only the minimal workflow/configuration defect and push a new commit; do not retry blindly. |
| Deployment succeeds but routes/assets 404 | Base-path/asset-path production defect. Verify repository mode, `basePath`, asset prefixing, and canonical construction; repair and fully rebuild before redeploying. |
| Canonical/sitemap/robots use the wrong origin | Build-input/content defect. Correct the single `SITE_URL` value and rebuild; do not patch generated `out/` manually. |
| GitHub Pages environment is blocked or awaiting approval | Repository-settings/environment blocker. Report the exact state and required owner action; do not switch providers or weaken protection rules without authorization. |
| Live output does not match pushed SHA | Deployment/provenance failure. Do not claim success. Inspect run status and artifact provenance, then wait for or repair the intended deployment. |

## Applicability decisions

- **Input boundaries:** Applicable to owner, repository slug, repository mode
  (project site versus user site), base path, visibility, branch, and canonical
  URL because each changes the remote target or generated URLs.
- **Malformed or missing input:** Applicable to absent authentication, invalid
  repository names, conflicting remotes, missing `SITE_URL`, and unexpected
  remote history. Each must fail closed.
- **State transitions:** Applicable to local-only repository → remote repository
  → pushed `main` → queued workflow → successful Pages deployment.
- **Failure and recovery:** Applicable as specified above. Recovery creates a
  new reviewed commit; it never rewrites published history or edits generated
  output directly.
- **Regression:** Applicable at repository configuration, static export,
  routing, assets, SEO metadata, no-JavaScript behavior, platform interaction,
  responsive layout, accessibility, content, and security boundaries.
- **Concurrency:** Applicable only to GitHub Actions deployment runs. Configure
  one Pages concurrency group and cancel superseded in-progress runs. There is
  no application multi-user or shared mutable state.
- **Time:** Applicable only to asynchronous workflow/deployment completion and
  GitHub Pages propagation. Poll a bounded workflow status; do not use runtime
  clocks in application output or assert an exact publication duration.
- **Randomness:** Not applicable. Repository naming, build output, routes, and
  tests must use fixed resolved inputs; no random identifiers are needed.
- **I/O:** Applicable to Git/GitHub API operations, Actions artifact upload,
  static HTTP responses, and referenced assets. All local generated files,
  caches, and logs remain inside `D:\high-quality`.
- **Security:** Applicable to credentials, repository targeting, workflow
  permissions, third-party Actions, artifact scope, commit contents, and remote
  history safety. The static site introduces no server-side secret.
- **Accessibility:** Applicable as a regression concern because deployment path
  changes can break styles, scripts, navigation, images, focus management, and
  no-JavaScript fallbacks. No new accessibility interaction is introduced.

## Completion rule

Deployment is complete only when the local regression gates pass, `main` is
pushed without overwriting unrelated history, the GitHub Actions Pages run for
that exact commit succeeds, and the live project URL passes route, asset,
canonical, no-JavaScript, and provenance smoke checks. A successful local build
or push alone is not proof of a successful Pages deployment.
