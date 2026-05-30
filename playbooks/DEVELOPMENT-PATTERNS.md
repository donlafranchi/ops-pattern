---
purpose: Development decisions in force, with their intent. Includes pipeline patterns.
layer: how
status: active
---

# Development patterns

Decisions about HOW we build. Action layer, eval helpers, clean-slate rebuild, archive ownership, pipeline shape, M-gates, bundle lifecycle.

Each entry follows the pattern-doc shape: Decision (one sentence), Intent (one short paragraph naming what it protects against), Touches (one file or capability that owns the implementation). The decision is live by virtue of being in this doc — no status field, no editorial trail. If a decision becomes inoperative, the entry comes out.

> Sister docs: [DECISION-PATTERNS](DECISION-PATTERNS.md) for how new decisions get made, [PLATFORM-PATTERNS](PLATFORM-PATTERNS.md) for what-the-platform-is decisions.

---

### Ship on Next.js + Supabase + Mapbox + Vercel

**Decision.** The web app ships on Next.js App Router + TypeScript + Tailwind v4 (`@theme inline` tokens) + Supabase (Postgres + Auth + Realtime) + Mapbox GL JS, deployed on Vercel, with Playwright for evals and Vitest for unit tests.

**Intent.** A coherent stack picked row-by-row for stack-internal reasons — App Router's server-component model, Supabase's Postgres-plus-Auth-plus-RLS bundle matching the action-layer architecture, Mapbox's bottom-card UI model, Tailwind v4's tokenized design system. Constraining the stack to one row per concern prevents drift into a vendor zoo and keeps every migration plain SQL with Supabase-specific features named explicitly so a future swap can be scoped. Any row-level swap requires a new pattern entry; below-the-row tuning (style version, plan tier) does not.

**Touches.** `web/CLAUDE.md`

---

### Route every write through the action layer

**Decision.** Every write to every table the platform owns — human-initiated, agent-initiated, platform-initiated, federation-initiated — flows through a named, Zod-validated, transactional action handler that commits the data row and matching `*_events` row in the same transaction, populates audit fields (`acting_member_id NOT NULL`, `via_delegation_id` when an agent acted), and enforces the runtime trust substrate (scoped capabilities, closed-world scope catalog, approval gates, network-layer credential injection, per-turn credential selection, sandboxed Skill execution).

**Intent.** Direct table writes with `*_events` log writes as a separate concern have catastrophic and silent failure modes: a row that lands without its event-log entry leaves the audit trail incomplete, and downstream readers see state without provenance. The same-transaction invariant makes that failure impossible by construction. The runtime trust substrate is what lets agent assistance ship at b2 without re-architecting the floor — schema-enforced caps, structurally unbypassable confirmation gates, credentials that never reach the model. Web composer, in-app assistant, MCP server, and federation peers all become thin clients over the same handlers — code shared, security model shared, audit log shared.

**Touches.** `product/systems/action-layer.md`

---

### Make `public.members.id = auth.users.id` and Supabase Auth the only Member-creation path

**Decision.** Every `public.members` row has `id = auth.users.id` (PK equality, 1:1, lifetime-stable); the only path to a Member row is the post-signup trigger on `auth.users` that POSTs an HMAC-signed payload to an internal route, which invokes the `member.create` action handler; the system Member (`login_disabled = true`) is the only exception.

**Intent.** PK equality lets every RLS policy reference `auth.uid()` directly without a subquery lookup. The single-path-to-Member-creation invariant means there is no admin "create user" surface, no seed script bypassing the action layer, no Supabase Dashboard write — the audit chain stays unbroken. The PK choice also keeps the schema federation-portable at b3: a spawned platform with its own Supabase project can mirror a Member by mirroring the PK; the audit-field chain stays coherent across boundaries.

**Touches.** `product/systems/member.md`

---

### House eval helpers in `web/supabase/test-helpers/` with plpgsql failure-injection

**Decision.** Eval-only Postgres helpers (introspection RPCs, failure-injection RPCs, seed/teardown RPCs) live in `web/supabase/test-helpers/` and are applied by `web/scripts/bootstrap-eval-helpers.ts`, which hard-exits on non-local DATABASE_URLs; production schema in `web/supabase/migrations/` is untouched. The failure-injection helper reproduces the same-transaction invariant in plpgsql via subtransaction plus constraint violation; the Node action handler stays covered by Vitest.

**Intent.** Folder separation makes accidental application of eval helpers to production unreachable rather than discouraged — a developer reading `migrations/` sees only what will hit prod. Postgres-side gates on every function (the rejected alternative) leave test-only entry points in `migrations/`, inverting the principle that the safest guard prevents the code from being there at all. Plpgsql failure-injection asserts the same-transaction property as a substrate invariant; the eval-writer firewall forbids importing `web/src/` from specs anyway, so the HTTP-hop alternative trades cost for coverage Vitest already supplies.

**Touches.** `web/supabase/test-helpers/`

---

### Rebuild the data layer clean-slate on the four primitives; preserve the framework foundation

**Decision.** Replace the `web/` schema, action handlers, and data-reading components from scratch on Person / Item / Location / Group primitives in four phases (Floor → Primitives → Surfaces → Federation-readiness → Cleanup). Preserve Next.js / Tailwind / Supabase / Mapbox / Playwright / Vitest framework and layout shells. No dual-write, no backfill, no rollback, no verification window.

**Intent.** The earlier dual-write / divergence-checker / two-week verification plan existed to protect a live system with users and data — `web/` today has no users, no production data, no bookmarked URLs. Every layer of migration safety becomes dead weight in their absence: dual-write doubles work without protecting anything, the divergence checker compares one in-development schema against another, the verification window delays shipping for a property trivially true on day one. The framework foundation has zero alignment problems with the primitives and would cost weeks to redo — rewriting below the framework targets the actual misalignment without rebuilding what already works.

**Touches.** `planning/bundles/b1-primitives-plan.md`

---

### Own retirement and non-release work locally per directory

**Decision.** Each working directory grows an `archive/` subdir on first need; retirements move to `{owning-dir}/archive/YYYY-MM-DD-{slug}/` instead of global `_attic/`. On shipped-version cut, each `{owning-dir}/archive/` wraps to `{owning-dir}/archive/vN-{slug}/` and resets empty for the next version. Non-bundle work packages (refactors, doc reorgs, strategy passes, phase plans) live under `planning/initiatives/{slug}/`. Legacy `_attic/` is frozen — pre-2026-05-28 retirements stay grandfathered.

**Intent.** The active half of the repo already organizes per-directory; archives were the one place that tried to be global, which created friction — "where did `foo.md` get retired to" required knowing the date, not the source directory, and `_attic/` accumulated mixed retirements with no per-dir ownership. Local archives mean every dir owns its lifecycle end-to-end. `bundles/` is a release-package construct bound to ship dates; audits and reorgs are process-package work, and using `bundles/` for both blurred the contract. A separate `initiatives/` umbrella keeps the release-package identity intact while giving non-release work the same atomization discipline.

**Touches.** `CLAUDE.md` (anti-sprawl rules + file-naming table)

---

## Pipeline patterns

How the solo-founder pipeline runs. Where each stage lives, when each gate fires, how work moves through.

### Split Cowork (thinking) from Claude Code (building)

**Decision.** Cowork runs `orient`, `explore`, `scope`, `weigh`, `memo`, `review`, `tidy` — anything that's prose, judgment, research, or coordination, and where MCP connectors and plugin skills live. Claude Code runs `ticket`, `test`, `build` — anything that touches the shell, runs against localhost services, or writes to the app repo. A session usually starts in Cowork, settles a direction, then Cowork produces a hand-off prompt the PM pastes into a Claude Code session.

**Intent.** Lock-file friction is real: Cowork's sandbox occasionally leaves `.git/index.lock` files that wedge subsequent git operations. Keeping git operations on the Claude Code side avoids the workaround tax. The firewall also separates coordination from execution — coordination skills can read across repos and MCPs without inheriting the build-side test infrastructure, and build skills stay focused on red-green-refactor without context-switching to research.

**Touches.** `AGENTS.md`

---

### Commit code with PM permission; never cross-commit between repos

**Decision.** `build` ends every ticket by asking the PM to confirm the commit message (`T###: short title`, one line, no body, no co-author tag); on confirmation, Claude Code runs the commit. Cowork does not commit code — when a Cowork skill edits docs in the parent repo, it hands the PM a commit message and a `clearlock` line to run from the Mac terminal. App code commits to the app repo (`web/`); pipeline/spec/docs commit to the parent repo; never stage files from both in one commit.

**Intent.** PM-confirmed commits keep ratification visible at the commit boundary — no agent commits a decision the PM hasn't seen. The cross-commit rule prevents history drift between the two-repo layout (parent local-only, `web/` pushed to GitHub) that the architecture relies on. `clearlock` exists because Cowork's sandbox can leave lock files; making it the PM's one-liner removes the workaround from agent flow.

**Touches.** `CLAUDE.md` § Commit Rules

---

### Run M-gates in their stages, before commit

**Decision.** Four mandatory gates: **M1** architecture/system-design check fires inside `review` before scope is approved (on any scope introducing new schema, event, or component); **M2** code review fires inside `build` *before* the commit (every shipped ticket); **M3** accessibility review fires inside `review` on any new page or component; **M4** deploy checklist fires before any merge to main that touches the migration path.

**Intent.** M2 used to run after the commit landed, which produced either amend churn or a second fix-forward commit per ticket; pulling it left of commit catches issues while the diff is still soft and keeps the first commit honest. Each gate sits inside the skill that owns the stage, so the gate fires by virtue of the skill running — there's no separate enforcement layer to forget.

**Touches.** `CLAUDE.md` § rebuild-phase rules

---

### Default linear; parallelize tickets only when files are independent

**Decision.** Work one ticket through build → test → commit before starting the next. Parallel only when (a) tickets touch independent files and (b) tests don't share fixtures. Tickets and tests run in parallel against the same scope always — that parallelism keeps the test honest.

**Intent.** Linear minimizes context-switching and mid-stream conflicts when ticket scope is unclear. Parallel buys time at the cost of merge complexity; the cost wins only when independence is verified. Test-eyes-closed-to-ticket is non-negotiable — writing the eval after the code lets the eval drift to match the code instead of the scope.

**Touches.** `AGENTS.md`

---

### Track bundles by filename kind suffix + status frontmatter

**Decision.** Every bundle file carries a kind suffix in its filename (`-plan`, `-sprint`, `-work-map`, `-audit`, `-rebuild`, `-wrapup`) and a `status` in its frontmatter (`planned` / `active` / `done`). Parent: `bN-{slug}-plan.md`; phases: `bN.x-{slug}-{kind}.md`. Bundles that ship a user-visible release rename to `vN-{slug}` at archive time; non-shipping bundles archive without the `v` prefix.

**Intent.** The suffix tells Claude Code (and any human grepping) what kind of work the file holds without opening it; together with `status` it replaces directory-based state tracking, which had the same file in three "states" depending on which directory it sat in. Phases move through `planned → active → done` independently — you don't have to finish phase 1 before drafting phase 2. The `v` prefix at ship time distinguishes "we did work" from "we shipped a version," and reference summaries cite the `vN` name from that point on.

**Touches.** `CLAUDE.md` § file-naming table

---

### Atomize big plans with mixed-state items

**Decision.** When a plan has roughly 4+ distinct items independent enough that one can be picked up without the others, each item becomes its own file in a sibling `items/` dir with an indexing `README.md`. Done items archive immediately; untouched items keep `status: stub` until picked up; the original meta-doc archives to `{plan-area}/archive/YYYY-MM-DD-{slug}/` with a `RETIRED.md` mapping items to their new homes.

**Intent.** Re-reading a half-completed monolithic plan every time someone asks "what's left in this bundle" is the friction the pattern avoids — with atomization, the answer is the directory listing. Execution state does not gate the trigger; a freshly-landed 4-item plan and a half-completed 4-item plan are both candidates, because the friction shows up regardless of how many items are done. Coherent reference docs (system specs, directory conventions) are not candidates — they're single artifacts, not lists of work.

**Touches.** `skills/tidy/workflow.md` § sweep-docs finding #7

---

### Route work items by ratification need, not by lane default

**Decision.** Lane choice at write time depends on whether PM ratification adds a real call. Items carrying a real PM decision (close-call, route choice, unratified absolute, scope tradeoff, new pattern entry, system-spec change) land in `planning/proposed/`. Items that are mechanical with destination + content drafted and PM standing-approval covers them (doc-cite cleanups, frontmatter fixes, archive moves following ADR-25, drift sweeps executing previously-ratified renames, link rewrites after ratified path changes) land in `planning/next/` directly. When in doubt, `proposed/`. In `atomize` routing terms: `route: weigh | scope | explore` always lands in `proposed/`; `route: tidy | ticket` may land in `next/` if the content is drafted and the pattern is mechanical. Standing approval is revocable — narrow it in a future memo if any class of "mechanical" sweep proves consequential.

**Intent.** The proposed lane exists to surface PM decisions; routing mechanical-with-drafted-content items through it adds a no-value ratify gate that buries the actual decisions in noise. Defaulting everything to `proposed/` made the lane's signal-to-noise ratio degrade with every audit-driven sweep, because audits surface a mix of decisions and execution items in the same pass. Routing by ratification need keeps the proposed lane's purpose intact: it is the PM-decision queue, not the work queue. The "when in doubt, proposed/" tiebreaker accepts the small cost of one extra ratify gate as cheaper than the cost of a mechanical sweep landing without PM sight on the rare case where it should not have been standing-approved. Ratified 2026-05-30 by PM override; `weigh` dialectic skipped at PM's discretion under AGENTS.md §3 ("PM adjudicates — override permitted with cause logged"). Cause logged: PM judgment that the rule is unambiguous enough to land without dialectic adjudication.

**Touches.** `skills/atomize/SKILL.md` § Routing rules

---

### Route work through `_inbox/` → `planning/` kanban → `playbooks/`

**Decision.** Every work item has exactly one path from raw idea to long-term pattern: a doc lands in `_inbox/` if untriaged → `atomize` (or `tidy:triage-inbox`) routes it to `planning/proposed/` → PM ratifies and promotes to `planning/next/` → execution moves it to `planning/now/` → close moves it to `planning/done/` → ratified patterns land in `playbooks/PLATFORM-PATTERNS.md` or `playbooks/DEVELOPMENT-PATTERNS.md` as the long-term home. Dated work-products that need provenance go to `_attic/YYYY-MM-DD-{slug}/` directly. The repo does not maintain parallel top-level dirs for in-flight process work or dated reorg artifacts.

**Intent.** Parallel lanes for process docs and in-flight project-shaping work split the work-state surface across multiple places and made "where does this go?" a multi-option question. They also let work hide — a half-completed reorg in a parallel dir looks like archived past work rather than active queue, and process-pattern drafts elsewhere compete with the playbooks endpoint for canonical-source status. One path keeps the kanban as the single source of truth for in-flight work and the playbooks as the single source of truth for ratified patterns.

**Touches.** `CLAUDE.md` § file-and-directory naming table + this doc.

---

### Default to BLUF reports: status + ask, withhold detail until asked

**Decision.** Every multi-step pipeline-skill close-out — and every Cowork or Claude Code response over ~50 words that reports completed work — opens with the three-line BLUF template: `Status: Done|Blocked|Question — <one-sentence summary>` / `Next: <ask, or "none">` / `Want detail? Say "expand."` Commit hashes, file lists, lane counts, per-step trace are withheld until the PM says "expand." Items are named in plain English; the ID can follow in parens. Running narration ("Now updating X. Committing Y.") is dropped from the report.

**Intent.** Play-by-play reports bury the headline (status arrives mid-message after the trace), and ID-heavy reports demand the PM remember slugs the agent invented this session. Both fail the same way: the PM has to read the whole thing to learn what's pending. The BLUF template inverts that — status and ask land in the first two lines, the rest is opt-in. If a fact wouldn't change the PM's next move, it doesn't belong in the headline. Withholding-by-default also keeps the cache window clean for the work that follows.

**Touches.** `CLAUDE.md` § Report shape + every `skills/*/workflow.md`.

---

## Pipeline anti-patterns

Things we learned by getting them wrong. Each is a default-to-avoid, named.

- **Commit-before-M2.** Running code review after the commit landed produced amend churn or fix-forward commits. Fix: M2 fires inside `build` before the commit, while the diff is still soft.
- **Teaching to test.** Writing the eval after the code lets the eval drift to match the code instead of the scope. Fix: `test` is eyes-closed to the ticket and the code; both come from the same approved scope.
- **Sandbox git lock.** Cowork's sandbox occasionally leaves `.git/index.lock`. Fix: Cowork hands the PM a `clearlock` line with every doc-commit instruction; Cowork never tries to run git itself.
- **Absolutist phrasing in specs.** "Never," "always," "must" in spec text led agents to over-fit on wording. Fix: every absolute carries a State-tagged Intent line, or it's softened to a default-with-named-exceptions.
- **One-stage-many-skills sprawl.** Four separate skills for "decide" let workflows drift. Fix: collapse into one skill with sub-routines preserved as workflow steps.
- **Half-completed big plans.** Items piled up in mixed states inside monolithic plan docs; "what's left" required re-reading the whole doc. Fix: atomize per the pattern above; `tidy` § sweep-docs surfaces violators.
