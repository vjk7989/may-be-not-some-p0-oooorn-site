<!-- codebase-memory-mcp:start -->
## Codebase Knowledge Graph (codebase-memory-mcp)

When codebase-memory MCP tools are available, use them before Graft or raw
search for code discovery, in this order: `search_graph`, `trace_path`,
`get_code_snippet`, `query_graph`, then `get_architecture`.

Use Graft next. Fall back to `rg` for string literals, errors, configuration,
non-code files, unavailable graph tools, or insufficient graph results.
<!-- codebase-memory-mcp:end -->

<!-- graft:start -->
## Graft — repo context graph

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `graft map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `graft ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `graft grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `graft skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `graft callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `graft/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `graft ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `graft build` (deterministic,
no API key, $0).
<!-- graft:end -->

## Project operating contract

These rules apply to every task in this repository.

### Scope and storage

- Treat `D:\high-quality` as the only writable workspace. Create source,
  dependencies, generated artifacts, caches, logs, temporary files, test
  outputs, and tool state inside this directory.
- Do not write project data or configure tools under `C:\`, the user profile,
  or any machine-global location. Prefer project-local dependencies and tools.
- Before running a tool that may write outside the workspace, redirect its
  cache, temp, output, and config paths into `D:\high-quality`. If that cannot
  be guaranteed, stop and ask the user before running it.
- Reading system-installed tools is allowed; writing outside the workspace is
  not. Do not perform global package installs.
- Run every npm or npx command, including MCP and test-runner commands, through
  `scripts/Invoke-WorkspaceNodeTool.ps1`. Do not invoke `npm`, `npm.cmd`, `npx`,
  or `npx.cmd` directly; the wrapper enforces workspace-local cache and temp
  paths and avoids the broken host PowerShell shim.

### Implementation principles

- Apply YAGNI: implement only behavior required by the current task and its
  acceptance criteria. Do not add speculative abstractions, compatibility
  layers, options, dependencies, or future-facing infrastructure.
- Preserve existing behavior unless the task explicitly changes it.
- Choose the smallest complete change. Keep interfaces and data flow explicit
  and deterministic; avoid hidden time, randomness, network, or environment
  dependencies unless required. When unavoidable, inject or pin them in tests.
- Record material design decisions and durable context in
  `docs/architecture/DECISIONS.md`; keep its codebase map current after
  structural changes.

### Deterministic task workflow

For each user task, execute these gates in order:

1. Read `docs/HANDOFF.md` and `docs/architecture/DECISIONS.md`. For code
   discovery, use codebase-memory MCP graph tools first when available
   (`search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, then
   `get_architecture`); otherwise use Graft. Fall back to raw search only for
   literals, non-code files, or when graph results are insufficient.
2. Restate the task as the smallest independently verifiable work items and
   express them as a compact dependency graph. Each node must record its work
   item, dependencies, affected boundary, acceptance criteria, and whether it
   is safe to run in parallel. A one-node task still uses this contract without
   adding ceremony. Keep the graph in the current plan or progress record; do
   not add a persistent orchestration system unless the task explicitly needs
   one.
   - A node is ready only when every dependency is known, complete, and passing
     its focused gate. Unknown dependencies keep the node blocked.
   - Detect cycles before implementation. Decompose a cycle into acyclic work
     or escalate the unresolved dependency instead of choosing an arbitrary
     execution order.
   - Run ready nodes in parallel only when their writable boundaries do not
     overlap. Shared read-only discovery is safe; overlapping writes must be
     serialized.
   - Update the graph when discovery reveals a new dependency, then continue in
     topological order. Do not expand scope beyond the user's acceptance
     criteria.
3. Assign an independent test-design subagent. It must produce a bounded,
   risk-based matrix covering: happy path; input boundaries; malformed or
   missing input; state transitions; failure and recovery; regression at each
   changed boundary; and concurrency, time, randomness, I/O, security, and
   accessibility only when relevant. Each omitted category must be marked not
   applicable with a reason. The implementation must satisfy every applicable
   case.
4. Implement ready nodes in topological order. After each node, run the
   narrowest relevant tests before unblocking any dependent node.
5. Assign a separate test-runner subagent to execute the relevant test suite and
   report exact commands, exit codes, and failures. The test runner must not
   modify production code or tests.
6. If any test fails, do not continue implementation. Assign a separate
   failure-analysis subagent to determine whether the defect is in production
   code, the test, the fixture, or the environment and write a minimal fix plan.
   Apply the plan, then return to step 5. Never weaken or delete a valid test
   merely to obtain a pass.
7. Continue to the next work item only when all tests through the current area
   pass. Before completion, run the broader relevant regression suite.
8. Refresh Graft after material code changes, update the architecture record,
   and update `docs/HANDOFF.md` with only session-specific state and next steps.

Subagent roles may run sequentially when concurrency is limited, but test
design, test execution, and failure analysis must remain independent roles.
For documentation-only or configuration-only tasks with no executable behavior,
the test designer defines deterministic validation checks and the test runner
executes those checks instead of inventing application tests. The
failure-analysis role is created only when a validation or test actually fails.

### Context management

- Architecture-record role: maintain `docs/architecture/DECISIONS.md` with
  decisions, constraints, consequences, important implementation notes, and a
  compact codebase map. Reference source paths rather than duplicating files.
- Handoff role: use this exact contract and write the result to
  `docs/HANDOFF.md`:

  ```yaml
  name: handoff
  description: Compact the current conversation into a handoff document for another agent to pick up.
  argument-hint: "What will the next session be used for?"
  disable-model-invocation: true
  ```

  Write a handoff document summarising the current conversation so a fresh
  agent can continue the work. Tailor it to the supplied next-session focus,
  include a `Suggested skills` section, and reference existing specs, plans,
  ADRs, issues, commits, and diffs instead of duplicating their content.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
