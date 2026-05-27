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

## The bundle wrap-up — replacing doc fatigue

After each bundle ships, run a one-session wrap-up. Produces `planning/bundles/b{N}-wrapup.md`, ~3–5 pages:

- **Decisions kept** — one paragraph per ratified memo, with a pointer to the source.
- **Decisions deferred** — what got punted to the next bundle and why.
- **Open questions for b{N+1}** — the things the next bundle has to answer.
- **What didn't work** — anti-patterns surfaced this bundle, folded into this doc's Anti-patterns section.

After the wrap-up lands, the next bundle reads only the wrap-up plus active specs. Old memos remain in `planning/memos/` as historical record; nothing references them by default. Stage-ledger and spec-patches archives per-bundle, not carried forward.

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

- *2026-05-26* — Initial draft after audit. Ten skills, new commit rule, M2 left of commit, bundle wrap-up convention.
