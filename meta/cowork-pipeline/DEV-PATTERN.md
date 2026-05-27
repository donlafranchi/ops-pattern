# DEV-PATTERN

How a solo founder uses Cowork + Claude Code to approximate a tight five-person dev team. Lives as a working document — edit as the pattern improves. Date every change.

> Sister docs: [README](README.md) (map of the ten skills), [DECISION-PATTERNS](DECISION-PATTERNS.md) (close-call rule + the one absolute).

---

## The split — Cowork thinks, Claude Code builds

Cowork is the meeting room. Claude Code is the workshop.

**Cowork is for:** orienting, exploring, scoping, weighing, reviewing, memo-writing, tidying. Anything that's prose, judgment, research, or coordination. MCP connectors live here. Web search lives here. Plugin skills (engineering, design, product-management, brand-voice) live here.

**Claude Code is for:** tickets, tests, code, evals, deploy checks. Anything that touches the shell, runs against localhost services, or writes to the app repo. Lock-file friction is real — keep git operations on this side.

A session usually starts in Cowork, settles a direction, then Cowork produces a hand-off prompt that the PM pastes into a Claude Code session.

---

## The stages and where they run

```
                    COWORK                          CLAUDE CODE
                    ──────                          ───────────
session start  →    orient
                    explore
                    scope
                    weigh ──────────────╮
                    memo               (handoff prompt)
                    review              │
                                        ↓
                                                    ticket
                                                    test  ←── runs in parallel with ticket
                                                    build
                                                    (commit, with permission)
                    tidy  ←───────────────────  end-of-session sweep
```

A scope can fan out into multiple build cycles (parallel) when the tickets are independent. Sequential is the default — parallel only when independence is verified.

---

## Working the pipeline — a typical session

**1. Orient (Cowork, 5–10 min).** "Where are we." `orient` reads the journal, the active bundle, the work map, the stage ledger, the spec-patches queue. Flags drift. Names the next decision. Does not act on it.

**2. Pick a direction (Cowork).** Either continue an open scope or open a new one. If new: run `explore` first to anchor the work in a real need (pulled from the project's use-cases catalog by `explore`'s user-voice sub-routine).

**3. Settle the scope (Cowork).** `scope` proposes 1–3 scenarios with binary pass/fail criteria. PM picks one. If the choice is close, `weigh` runs (see DECISION-PATTERNS).

**4. Architecture / design / accessibility / security gate (Cowork).** `review` runs on the chosen scope. Verdicts: PROCEED, REVISE (back to scope), EXTEND (back to explore). Security is a sub-routine inside `review`, not a separate stage.

**5. Memo if it's a real decision (Cowork).** `memo` writes a one-pager decision memo (formerly ADR-shaped) when the scope encodes a cross-cutting commitment: schema, event, contract, money flow, naming.

**6. Hand off to build (Cowork → Claude Code).** Cowork writes the hand-off prompt. PM pastes into Claude Code.

**7. Tickets + tests in parallel (Claude Code).** `ticket` breaks the scope into ordered session-sized tickets. `test` writes the eval spec from the same scope, eyes-closed to the tickets. The two streams meet at build.

**8. Build (Claude Code, TDD).** `build` implements one ticket at a time. Red → green → refactor. No improvisation — if reality diverges from spec, write a DEVIATIONS entry and surface for PM.

**9. Commit (Claude Code, with permission).** `build` asks: "Ready to commit T### on branch t### with message `T###: title`? (y/n)." On y, Claude Code commits. On n, PM amends or defers. Cowork does not commit code.

**10. Run tests (Claude Code).** `test` in run-mode executes the eval. Green → next ticket. Red → fix forward (no rollback).

**11. End-of-session tidy (Cowork).** `tidy` sweeps inbox, archives anything stale, reconciles ledger, prunes journal if heavy.

---

## The commit choreography

**Claude Code commits code.** Always asks first. Format: `T###: short title` — one line, no body, no co-author. PM says y/n; on y, `build` runs the commit. PM pastes back the hash for the ticket's Completion section if needed.

**Cowork does not commit code.** When Cowork edits docs in the parent repo, it produces a commit message and a `clearlock` line for the PM to run from the Mac terminal. Format:

```
docs(pipeline): short description

# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add path/to/file && git commit -m "docs(pipeline): short description"
```

The `clearlock` exists because Cowork's sandbox can leave `.git/index.lock` files that wedge subsequent git operations. PM runs it once per Cowork-driven commit.

**Never cross-commit.** App code goes to the app repo (`web/` or equivalent). Pipeline/spec/docs go to the parent repo. Don't stage files from both in one commit.

---

## The M-gates — when each gate fires

| Gate | What | When | Mandatory? |
|---|---|---|---|
| M1 | Architecture / system-design check | Inside `review`, before scope is approved | On any scope introducing new schema, event, or component |
| M2 | Code review | Inside `build`, **before** the commit | Every shipped ticket — left of commit, not after |
| M3 | Accessibility | Inside `review`, on any new surface | Every new page or component |
| M4 | Deploy checklist | Before any merge to main | Every release that touches the migration path |

M2 runs **before** the commit. Past mistake: committing first, then running M2, then fixing forward — that doubled the commit count and made the first commit a lie. The new pattern catches issues while the diff is still soft.

---

## Parallel vs linear — rule of thumb

- **Linear** is the default. One ticket through build → test → commit before starting the next. Less context-switching, fewer mid-stream conflicts.
- **Parallel** only when (a) tickets touch independent files and (b) tests for each don't share fixtures. When in doubt, run linear.
- **Tickets and tests in parallel against the same scope is always-on.** That parallelism is what keeps the test honest.

---

## The bundle lifecycle — how a package of work moves through

A bundle is a package of work in flight: scope, sequencing, execution, ship. Lives in `planning/bundles/` until shipped, then archives to `_attic/`. Every bundle file carries a kind suffix in its filename and a status in its frontmatter — together they replace dir-based state tracking. `planning/bundles/` retires.

**Filename kind suffixes.** Borrowed from agile/PM vocabulary that already has loaded meaning — the suffix tells Claude Code (and you, grepping) what kind of work the file holds without opening it.

| Suffix | Meaning |
|---|---|
| `-plan` | Forward-looking scope, what we're going to do |
| `-sprint` | Time-bounded execution chunk, tickets attached |
| `-work-map` | Scope inventory, what's in vs out (the menu) |
| `-audit` | Retrospective or process review |
| `-rebuild` | Phased reconstruction (special-case plan) |
| `-wrapup` | End-of-bundle synthesis (see next section) |

**Frontmatter state.** The `status` field tells you where the file is in its lifecycle.

- `status: planned` — exists, no tickets yet
- `status: active` — tickets being drafted or built
- `status: done` — all tickets shipped, PM ratified

**File shape.** A bundle has one plan + zero-or-more phase docs sharing the bundle ID.

- Parent: `bN-{slug}-plan.md`
- Phases: `bN.x-{slug}-{kind}.md` (e.g., `b1.0-foundation-sprint.md`, `b1-primitives-work-map.md`)

Phases move through `planned → active → done` independently. You don't have to finish phase 1 before drafting phase 2. Some bundles keep all phases inline in the plan (e.g., `rebuild-plan.md`) — per-doc judgment, both shapes are legal.

**Lifecycle stages.**

1. Cowork drafts `bN-{slug}-plan.md` with `status: planned`.
2. PM ratifies → `status: active`. Phase docs created as needed.
3. Each phase doc moves `planned → active → done` independently.
4. When all phases are `status: done`, run the bundle wrap-up (next section).
5. `tidy` archives the whole bundle to `_attic/YYYY-MM-DD-{slug}/` — or `_attic/YYYY-MM-DD-vN-{slug}/` if the bundle shipped a user-visible version.
6. `orient` surfaces active bundles + active phase docs at session start.

**Lookup — the trackability lever.**

- "What bundles are active?" → `grep -l 'status: active' planning/bundles/*-plan.md`
- "What sprints are open?" → `grep -l 'status: active' planning/bundles/*-sprint.md`
- "What's pending?" → `orient` lists `status: planned` and `status: active` at session start, by age.

**Bundle vs version — the rename on ship.** "Bundle" is the provisional name for a package of work in flight. "Version" is the durable name for a shipped release. The rename happens once, at ship, encoded by the archive directory name.

- In flight: `planning/bundles/b1-primitives-plan.md`
- On ship to production: archives to `_attic/YYYY-MM-DD-v1-primitives/` (the directory name carries the version identifier; all bundle files preserved inside).
- Non-shipping bundles (substrate sprints, audits, internal-only work) archive without the `v` prefix: `_attic/YYYY-MM-DD-{slug}/`.

The `v` prefix is reserved for bundles that ship a user-visible release. Distinguishes "we did work" from "we shipped a version." Reference summaries and any doc citing the shipped bundle use the `vN` name from that point on.

**Release indexing.** Each shipped version writes a `RELEASE.md` at the root of its archive directory — the inline doc, narrative of what shipped, what didn't, what changed mid-flight. `planning/RELEASES.md` carries the indexed list: one line per shipped version + link to the inline release doc. `tidy` drafts both at archival time using the plan + ticket history + DEVIATIONS; PM ratifies before close.

**Commit-time clarity.** When `build` commits a ticket tied to a phase doc, the commit message can cite the phase by its slug (`T067: foo (b1.x-substrate-sprint)`). The kind suffix tells the git log what scope this ticket is in.

---

## The bundle wrap-up — replacing doc fatigue

After each bundle ships, run a one-session wrap-up. Produces `planning/bundles/b{N}-{slug}-wrapup.md`, ~3–5 pages:

- **Decisions kept** — one paragraph per ratified memo, with a pointer to the source.
- **Decisions deferred** — what got punted to the next bundle and why.
- **Open questions for b{N+1}** — the things the next bundle has to answer.
- **What didn't work** — anti-patterns surfaced this bundle, folded into this doc's Anti-patterns section.

After the wrap-up lands, the next bundle reads only the wrap-up plus active specs. Old memos remain in `planning/memos/` as historical record; nothing references them by default. Stage-ledger and spec-patches archives per-bundle, not carried forward. The wrap-up doc archives with the rest of the bundle to `_attic/YYYY-MM-DD-{slug}/` (or `_attic/YYYY-MM-DD-vN-{slug}/` if the bundle shipped a version).

---

## Anti-patterns — the things we learned by getting them wrong

Each entry: name, date discovered, what went wrong, the fix.

- **Commit-before-M2** *(discovered 2026-05)* — running code review after the commit landed meant either amend churn or a second "fix-forward" commit per ticket. Fix: M2 fires inside `build`, before the commit, while the diff is still soft.
- **Teaching to test** *(discovered 2026-05)* — writing the eval after the code lets the eval drift to match the code instead of the scope. Fix: `test` is eyes-closed to the ticket and the code; both come from the same approved scope.
- **Sandbox git lock** *(discovered 2026-05)* — Cowork's sandbox occasionally leaves `.git/index.lock`. Fix: Cowork hands the PM a `clearlock` line with every doc-commit instruction; Cowork never tries to run git itself.
- **Absolutist phrasing in specs** *(discovered 2026-05)* — "never," "always," "must" in spec text led agents to over-fit on wording. Fix: every absolute carries a State-tagged Intent line, or it's softened to a default-with-named-exceptions.
- **One-stage-many-skills sprawl** *(discovered 2026-05)* — four separate skills for "decide" let workflows drift. Fix: collapsed into `weigh`; sub-routines preserved as workflow steps.

Add to this list whenever a new friction surfaces. Date it. Name it. Write the fix.

---

## Update log

- *2026-05-27* — Added bundle lifecycle section: filename kind suffixes (`-plan` / `-sprint` / `-work-map` / `-audit` / `-rebuild` / `-wrapup`), `status` frontmatter (`planned` / `active` / `done`), phase decomposition rule, `vN-{slug}` rename on ship, unified `_attic/` archival, `RELEASES.md` indexing. Retired `bundles/`.
- *2026-05-26* — Initial draft after audit. Ten skills, new commit rule, M2 left of commit, bundle wrap-up convention.
