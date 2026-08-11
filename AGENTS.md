---
purpose: Pipeline definition — agent roles, firewalls, gates, escalation.
layer: how
status: active
---

# AGENTS.md — Development Pipeline

> Project-resident pipeline. Lives at root (alongside `CLAUDE.md` and `JOURNAL.md`) because it describes agents working across `product/`, `planning/`, `development/`, and `web/`. The pattern itself is project-agnostic and is documented in [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md) (close-call rule) and [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) § Pipeline patterns (the working pattern). Every multi-step report opens with the Report Shape template — see [`CLAUDE.md` § Report shape](CLAUDE.md#report-shape).

Thirteen skills run the full lifecycle. Each is a role on a tight five-person dev team (PM, tech lead, engineer, designer, ops). Process lives in skills, not in nested CLAUDE.md files.

## The team in thirteen

| Skill | Role | Tool | The one question it forces |
|---|---|---|---|
| `orient` | PM at session start | Cowork | What drifted since last session |
| `explore` | Product researcher | Cowork | Whose need is this, who else is solving it |
| `scope` | Planning / scoping | Cowork | Smallest version that proves the bet |
| `weigh` | Tech-lead judgment call | Cowork | Which option stays reversible, who bears the cost |
| `review` | Architecture + design + security gate | Cowork | Will it scale, is it accessible, is it safe |
| `memo` | Decision-reversal recorder | Cowork | What user feedback contradicted the prior pattern entry |
| `atomize` | Plan-to-proposed bridge | Claude Code | What are the smallest independent items this becomes, and which skill picks each up |
| `ticket` | Sequencer | Claude Code | Smallest unit with a clear done condition |
| `test` | QA — write + run | Claude Code | Would a stranger know if this broke |
| `build` | Engineer — TDD | Claude Code | Simplest code that passes, fastest |
| `close` | Post-merge bookkeeper | Cowork | Is the paperwork done for this shipped ticket |
| `sync` | Progress reconciler | Cowork | Do the tracking docs match git reality |
| `tidy` | Anti-sprawl sweeper | Cowork | What's stale, what folds into what |

**Hard tool firewall.** Each stage runs in one tool only. No "Both." A stage that wants the other tool is a stage whose workflow has drifted — fix the workflow.

**Three folded sub-routines** — not standalone skills:
- **Security** lives inside `review` (auth, RLS, payment flow, PII surface).
- **User-voice** lives inside `explore` (pulls from `product/needs/use-cases.md` before any new system spec).
- **Simplify-review** lives inside `build` at step 14 (diff-level structural simplification — file-size/concern-density, repeated inline operations, missing shared models, boundary leaks). Runs on the staged diff after M2 code review and before the commit permission prompt. Not independently routable.

## Pipeline flow

```
                     COWORK                                CLAUDE CODE
                     ──────                                ───────────
session start  →  orient
                  explore  ←─── user-voice (sub-routine)
                  (PM drops a plan in _inbox/)  ─────────→ atomize
                                                          (stubs land in planning/backlog/)
                  ↑ PM ratifies each stub, moves it to next/ or now/
                  (then invokes the route: skill named in the stub)
                  scope
                  weigh ──────────────────╮
                  memo                    │  (hand-off prompt)
                  review  ← security ─────┤
                                          ↓
                                                          ticket
                                                          test  ←── parallel with ticket
                                                          build
                                                          (commit, with PM permission)
                  sync  ←────── post-build (auto) or standalone (PM-invoked)
                  tidy  ←────── end-of-session sweep
```

`ticket` and `test` run in parallel from the same approved scope, eyes-closed to each other. That separation is what keeps the test honest. `weigh`, `memo`, `review` fire as needed between `scope` and the hand-off. `atomize` sits at the front: it bridges Cowork plan-drops in `_inbox/` to the backlog lane in `planning/backlog/`, so multi-item plans don't stall in untriaged drafts. `sync` fires automatically after `build` merges (post-build mode) or on PM request (standalone mode) — it reconciles the three progress-tracking surfaces against git ground truth.

## What every gate is guarding against

Two failure modes show up under-annotated specs, and any gate's runner can fall into either:

1. **Over-fit on literal wording.** Spec says "no X." Agent treats it as categorical when the project's stance is shape-specific ("no *impersonal* X"). Tests pass for the wrong reason.
2. **Reconstruct intent and drift.** Spec says *what*. Agent guesses *why*, gets it plausibly wrong, propagates the reconstructed intent downstream as if it were the spec.

Both failure modes look like the agent doing its job. Both are caught by the same discipline: every load-bearing decision carries its **why** alongside its **what**, and every gate's runner reads the *why* before judging the *what*. See [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md) § How to spot an unearned absolute for the State-tagged Intent line discipline.

---

## 0. orient

**Tool:** Cowork. **Model:** Sonnet.

**Reads:** root `CLAUDE.md`, `JOURNAL.md`, `planning/now/bundle-1.md`, `planning/STAGE-LEDGER.md`, `planning/SPEC-PATCHES.md`, `planning/backlog/`, `planning/next/`, `planning/now/`, `planning/done/`, `web/BUILD-LOG.md`.

**Task:** Session-start orientation. Read state. Run the drift checklist (stale citations, empty `scenarios/` with live ticket refs, oversize DEVIATIONS, `{pending}` commit hashes, stalled SPEC-PATCHES, superseded-memo citations, stalled STAGE-LEDGER rows). Prune JOURNAL if it's heavy. Re-tag the work map if a sub-bundle closed since last session. Name the next decision. Does not act on it.

Absorbs the prior `pipeline-router`, `pipeline-prune`, and `pipeline-bundle-resync` work.

---

## 1. explore

**Tool:** Cowork. **Model:** Opus.

**Reads:** `product/foundation/`, `product/needs/use-cases.md` (mandatory anchor before any new spec), `product/exploration/`, `product/specs/`, `product/systems/`.

**Writes:** `product/capabilities/`, `product/systems/` (with mandatory "Data model implications" section), `product/ui/`, `product/exploration/`, `product/needs/use-cases.md` (extends with new real situations).

**Does NOT read:** `planning/`, `development/`, `web/`.

**Task:** Explore unconstrained. Write tiered systems (T1/T2/T3), capabilities, product files. Sub-routine: user-voice — surfaces the relevant use-cases before drafting, so the spec is anchored to a real situation. Refuses to prioritize, write tickets, or write scenarios.

---

## 2. scope

**Tool:** Cowork. **Model:** Opus.

**Reads:** `product/needs/use-cases.md`, `product/needs/member-journey.md`, `product/needs/producer-roadmap.md` (mandatory — refuses to write scenarios for "Won't" capabilities; every scenario's `## Capabilities unlocked` section traces to taxonomy categories), `product/foundation/primitives.md`, `product/systems/`, `product/capabilities/`, `planning/now/` (active bundle + surface sequence — `bundle-1.md`, `plan-b1-surface-sequence.md`).

**Writes:** `planning/backlog/` (drafts, as `scenario-F###-{slug}.md`; PM moves approved → `planning/next/`), `planning/now/` (bundle docs).

**Does NOT read:** `development/tickets/`, `web/`, `planning/next/` (the approved lane is read-only for reference).

**Task:** Convert systems into user-story-shaped scenarios anchored to canonical examples. Apply the 5 Deadly Sins filter (scope creep, gold plating, missing requirements, unrealistic schedules, poor communication). Surfaces the smallest version that proves the bet. Refuses to write tickets. Every scenario must include a `## Capabilities unlocked` section mapping to the producer capability taxonomy.

**Calls in:** `anthropic-skills:planning-filter` when ranking a sprawling backlog.

---

## 3. weigh

**Tool:** Cowork. **Model:** Opus.

> Replaces and folds in the prior `pipeline-intent-check`, `pipeline-ratify-absolute`, `pipeline-member-advocate`, `pipeline-platform-advocate`. One skill, four sub-routines preserved as workflow steps: **scan** (find unannotated absolutes), **dialectic** (member vs. platform advocate bullets when tension is Member-shaped), **ratify** (apply the close-call rule from DECISION-PATTERNS), **stamp** (land the State-tagged Intent line).

**Reads:** the target file, `product/foundation/principles.md`, `product/foundation/policy.md`, related system specs, recent `JOURNAL.md` entries.

**Writes:** the target file directly — bullet revisions and `Intent (State YYYY-MM-DD): {why}` annotations; one `JOURNAL.md` entry per session summarizing what was ratified, deferred, or rejected.

**Does NOT read or write:** `web/` code, `development/tickets/`, `planning/next/`.

**Task:** Walk the PM through each close-call or unratified absolute, one at a time. Apply the lexicographic close-call rule (see [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md)).

The single absolute — wealth circulation over wealth extraction — is the project's one categorical refusal ([`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md); rooted in [`product/foundation/principles.md`](product/foundation/principles.md)). Defaults with named exceptions are preferred to absolutes everywhere else.

**The State marker.** Co-located with every absolute:

| Line in spec | State |
|---|---|
| No `Intent:` line | Unratified de-facto — blocks Gate A and Gate B |
| `Intent: {why}` (no parenthetical) | Drafted, not adjudicated — blocks Gate A and Gate B |
| `Intent (Ratified YYYY-MM-DD): {why}` | Terminal-ratified |
| `Intent (Deferred until {trigger}; review by {horizon}): {posture}` | Terminal-deferred |

Rejected absolutes are deleted; the JOURNAL records the removal.

**Two gates `weigh` backstops:**
- **Gate A — `scope`.** A scenario cannot move from `backlog/` to `next/` if the spec sections it cites contain unratified absolutes the scenario would encode.
- **Gate B — `ticket`.** A ticket cannot be drafted if any spec section the ticket would *encode in code* (schema, RLS, action-handler, UI affordance removal) contains unratified absolutes.

**Hard constraints:** skip-if-ratified; no batch landing (per-statement walk); no scalar scores; no deferral without observable trigger + bounded review horizon; no Gate-1 deferral (safety-failing absolutes are revised or rejected, never deferred); both advocates run on Member-shaped tension or neither does; PM adjudicates (override permitted with cause logged).

---

## 4. review

**Tool:** Cowork. **Model:** Opus.

> Mandatory during the primitives rebuild on any scope that introduces a new surface, component, event type, table, column, or design pattern. Optional only for trivial copy/CTA changes.

**Reads:** `planning/next/` + `planning/now/` (the approved scope), `product/systems/`, `product/ui/`, `product/foundation/`, `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`, `planning/now/bundle-1.md`.

**Writes:** `review-F{NNN}.md` alongside its scenario, in the scenario's lane (`planning/next/` or `planning/now/`).

**Does NOT read:** `web/` code, `development/tickets/`, `planning/backlog/`.

**Task:** Three sub-routines in one skill:
- **Architecture** — does this fit existing systems? Does it need new schema, events, or columns? Calls in `engineering:architecture`.
- **Design** — does the surface fit the design language? Calls in `design:design-critique`, `design:design-system`, `design:accessibility-review` (mandatory on every new surface — M3 gate).
- **Security** — auth, RLS, payment flow, PII surface. Catches issues that turn into incidents post-launch.

Verdicts: **PROCEED** (continue to ticket + test), **REVISE** (back to scope), **EXTEND** (back to explore).

---

## 5. memo

**Tool:** Cowork. **Model:** Sonnet.

**Reads:** `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`, `playbooks/memos/`, related system specs.

**Writes:** `playbooks/memos/{NNNN}-{slug}.md`. Edits the pattern-doc entry being reversed (or removes it if the reversal is total).

**Task:** Write a memo **only when user feedback contradicts a prior pattern-doc entry** that is now in force. New decisions land directly as pattern-doc entries in `playbooks/{PLATFORM,DEVELOPMENT}-PATTERNS.md` — they do not need a memo. The memo's job is to record *why we changed direction*: what feedback came in, why the original Intent no longer holds, what the new pattern entry replaces.

**Format and lifecycle:** numbering continues from 0024 (new reversal memos start at memo-0024 onward).

---

## 6. atomize

**Tool:** Claude Code. **Model:** Sonnet.

> Bridge between Cowork strategy and Claude Code execution. Translates `_inbox/` plans and parked decisions into ratify-and-execute stubs in `planning/backlog/`. Closes the gap that left multi-item plans stalling in `_inbox/` because no skill knew how to decompose them.

**Reads:** `_inbox/{name}.md` (the target file), `_inbox/README.md`, `REGISTRY.md`, root `CLAUDE.md` (file-naming table), `planning/backlog/` (for slug collisions + sequence).

**Writes:** `planning/backlog/{slug}.md` (flat) or `planning/backlog/{plan-slug}/*.md` (grouped) + index `README.md`; archives parent plan to `_attic/YYYY-MM-DD-{parent-slug}/`; one `JOURNAL.md` paragraph.

**Does NOT read:** `web/` code, `development/tickets/`, `planning/next/`, `planning/now/`, system specs, `playbooks/`.

**Task:** Classify the inbox doc's shape (multi-item plan, single parked decision, single-feature draft, or wrong-shape reject). For each atom: produce a stub with frontmatter (`status: proposed`, `route: weigh|scope|tidy|ticket|explore`, `risk: low|medium|high`, `source:` pointer), Actions, Side effects, Risk. Group under `{plan-slug}/` for multi-item plans with an index README; flat for single atoms. Archive the parent on first pass. Hand PM a list of stubs + routes; PM ratifies and moves each to `planning/next/` or `planning/now/` then invokes the named `route:` skill.

**Routing rules (upstream-biased).** 1) Unratified absolute or close-call → `weigh`. 2) Net-new system/capability needing spec → `explore`. 3) User-facing surface needing scenarios → `scope`. 4) Mechanical doc move/rename/reorg → `tidy`. 5) Substrate-only code change with spec already in place → `ticket`. If two rules fire, take the lower number.

**Hard constraints:** never produces scenarios, tickets, specs, or decisions — only routes. Never invokes downstream skills. Never re-atomizes an already-decomposed plan (collision check on `planning/backlog/{parent-slug}/`). Every stub carries a single `route:` field; if no route fits, the atom surfaces in the index README's "Open" section instead of getting an invented route.

---

## 7. ticket

**Tool:** Claude Code. **Model:** Opus.

> Was previously Both; now Claude Code only. Reasoning: tickets are immediately handed to `build`, and Claude Code owns the repo and git operations. No round-trip back to Cowork.

**Reads:** `planning/next/` + `planning/now/` (approved scenarios only), `review-F{NNN}.md` in the scenario's lane if it exists, `development/tickets/` and `done/` (for next T-number), `product/systems/{relevant}.md` ("Data model implications" only).

**Writes:** `development/tickets/`.

**Does NOT read:** `planning/backlog/`, `web/` code, eval test code.

**Task:** Break each approved scope into ordered, session-sized tickets (~1–3 hours, one cohesive commit each). Each ticket references exactly one scenario via `Scenario:`. If a scope produces 5+ tickets, escalate back to `scope` to split.

**Substrate lane.** Schema, RLS, action-handler scaffolding, eval helpers — floor-level work with no user-facing behavior — carries `Scenario: substrate` and binds to a system-spec section + memo(s) instead. Substrate is not a backdoor around the planner; if a user-facing surface exists, write a scenario.

---

## 8. test

**Tool:** Claude Code. **Model:** Opus.

**Reads (write mode):** `planning/next/` + `planning/now/` (approved scenarios) only. **Reads (run mode):** `web/evals/`, `web/evals/results/`, `planning/next/` + `planning/now/` for traceability.

**Writes:** `web/evals/features/F{NNN}.spec.ts` (write mode); `web/evals/results/` (run mode).

**Does NOT read:** `web/` source code (write mode — no peeking at implementation), `planning/backlog/`, `development/tickets/`.

**Task:** Two modes.
- **Write:** translate every Given/When/Then in the approved scope into an automated test. Tests trace line-by-line back to scope clauses. Runs *before* `build` starts — this is what prevents teaching to test.
- **Run:** execute the F### evals after build. Report pass/fail per Given/When/Then clause. On fail, hand back to `build` (fix forward). On scenario-is-wrong, hand back to `scope`. Does not fix failing tests.

---

## 9. build

**Tool:** Claude Code. **Model:** Sonnet.

**Reads:** `development/tickets/`, `planning/next/` + `planning/now/` (the referenced scope), `product/systems/{name}.md` ("Data model implications" only), `product/ui/design-language.md` (for any UI work), `web/` code and tests.

**Writes:** `web/` code and tests, `development/tickets/` (Completion section, then move to `done/`), `web/BUILD-LOG.md`.

**Does NOT read:** `planning/backlog/`, `product/` outside the system spec referenced by the ticket, eval test code (write-mode evals are an external oracle).

**Task:** Implement one ticket at a time via TDD (red → green → refactor). Never roll back; fix forward. Escalate ambiguity to `scope`.

**Mandatory at ticket close:**
- Run `engineering:code-review` on the diff. This is the **M2 gate, and it fires *before* the commit** — past mistake was committing first and reviewing after, which produced amend churn or a second fix-forward commit per ticket.
- Append a single-line entry to `development/DEVIATIONS.md` — even "no deviations." Empty is no longer the default.
- Update `web/BUILD-LOG.md`.
- **Ask PM permission to commit.** Format: `T###: short title` — one line, no body, no co-author. On y, `build` runs the commit. On n, PM amends or defers. Paste hash back into the ticket's Completion section.

**Calls in:** `engineering:code-review` (mandatory pre-commit), `engineering:debug` during reproduction, `anthropic-skills:docx/pptx/xlsx/pdf` when the deliverable is a non-code file.

---

## 10. close

**Tool:** Cowork. **Model:** Sonnet.

**Reads:** `development/tickets/T{NNN}-{slug}.md`, `development/tickets/done/`, `development/deviations/T{NNN}.md`, `planning/STAGE-LEDGER.md`, `planning/stage-ledger/{concept}.md`, `planning/now/bundle-1-checklist.md`, `planning/now/scenario-F###-*.md`, `planning/now/review-F###.md`, `web/BUILD-LOG.md`, git log + branch state in `web/` and parent repo.

**Writes:** Moves ticket → `development/tickets/done/`, updates `planning/STAGE-LEDGER.md`, updates `planning/stage-ledger/{concept}.md`, updates `planning/now/bundle-1-checklist.md`, updates `web/BUILD-LOG.md`. When all tickets for an F-number are done, moves scenario + review → `planning/done/YYYY-MM-DD-f###-{slug}/`.

**Does NOT read:** `planning/backlog/`.

**Does NOT write:** Code, specs, JOURNAL. Does not commit — hands PM a clearlock + commit line.

**Task:** One-pass post-merge cleanup. Handles everything between "code merged" and "ticket closed on the board." Single-ticket mode ("close T###") and batch mode ("close all shipped tickets"). Verifies merge status, moves ticket to done, checks DEVIATIONS entry exists, stamps STAGE-LEDGER, updates checklist, updates BUILD-LOG, flags worktree cleanup, and archives scenario + review when a feature's last ticket ships.

---

## 11. sync

**Tool:** Cowork. **Model:** Sonnet.

**Reads:** `web/` git log + branch state, `planning/now/bundle-{N}-checklist.md`, `planning/STAGE-LEDGER.md`, `planning/stage-ledger/*.md`, `planning/now/bundle-{N}.md`, `development/tickets/done/`.

**Writes:** `planning/now/bundle-{N}-checklist.md`, `planning/STAGE-LEDGER.md`, `planning/stage-ledger/{concept}.md`.

**Does NOT write:** code, tickets, scenarios, specs, JOURNAL.

**Task:** Reconcile the three progress-tracking surfaces against git ground truth. Two modes: **post-build** (narrow — one concept, no PM ratification, fires after `build` merges) and **standalone** (full pass, PM ratifies before writes land). Git is the single source of truth; tracking docs are the derivative.

---

## 12. tidy

**Tool:** Cowork. **Model:** Sonnet.

> Three modes inside one skill: triage-inbox, sweep-docs, sweep-skills.

**Reads:** `_inbox/`, `_attic/`, root-level `.md` files, `skills/` (or `~/.claude/skills/`), `planning/STAGE-LEDGER.md`, `planning/SPEC-PATCHES.md`.

**Writes:** moves files between `_inbox/` → proper home, into `_attic/YYYY-MM-DD/` on retirement, JOURNAL entries summarizing the sweep.

**Task:** Three modes.
- **Triage-inbox** — drain `_inbox/`, give each file a home, name it per the file-and-directory conventions in `CLAUDE.md`.
- **Sweep-docs** — propagation check, find stale references (e.g., F018 still cited as flagship despite deferral), rotate oversize DEVIATIONS at phase boundaries, archive retired specs.
- **Sweep-skills** — check the `skills/` directory: are all listed skills still active? Has any skill not fired in three bundles (candidate for demotion to sub-routine)? Has any sub-routine earned standalone status?

---

## PM Workflow

```
1. "what's the state"                  → orient
2. "explore X" / "write a system for"  → explore
3. "scenarios for X"                   → scope
4. PM reviews; moves approved → planning/next/ (or scope does on instruction)
5. "weigh: is this close?" / "ratify"  → weigh  (Gate A — backstops scope)
6. "review F###"                       → review
   EXTEND → back to explore, re-review.
   REVISE → back to scope, re-review.
   PROCEED → continue.
7. "reverse this decision"             → memo  (only when user feedback contradicts a pattern entry; new decisions land directly in playbooks/)
8. (handoff to Claude Code)
   "atomize _inbox/{plan}.md"          → atomize  (plan or parked decision → planning/backlog/ stubs)
   PM ratifies each stub, moves to planning/next/ or planning/now/, invokes the named route: skill
9. "tickets for F###"                  → ticket  (Gate B — backstops ticket)
10. "tests for F###"                   → test (write)   ┐
11. "implement T###"                   → build          │ steps 10 + 11 parallel
12. "commit T###"                      → build asks PM  │
13. "run F### tests"                   → test (run)
14. On pass: PM picks next.
    On fail: build fixes forward.
    On scenario-is-wrong: scope revises; cycle restarts at step 5.
15. "tidy / sweep"                     → tidy   (end of session, end of bundle)
```

**Key invariants:**
- Tests are **written** before build (step 10) and **run** after build (step 13). Eyes-closed in between.
- `review` fires before any new surface reaches `ticket`.
- Code review (M2) fires before the commit, not after.
- Cowork never commits code. Claude Code commits code, always with PM permission.

---

## Commit choreography

**Claude Code commits code.** Always asks first.

Format: `T###: short title` — one line, no body, no co-author tag.

Where:
- Web/app changes → `web/` repo.
- Pipeline/spec/docs in this project → parent repo.
- Pipeline-doc changes (CLAUDE.md, AGENTS.md, MAP, TRACE, REGISTRY, skill workflows) → parent repo with `docs(pipeline): …` — no T-number.

Never cross-commit (no staging files from both repos in one commit).

**Cowork does not commit code.** When `weigh`, `memo`, `explore`, `scope`, `review`, or `tidy` edits a doc in the parent repo, Cowork produces a commit message and a `clearlock` line for the PM to run from the Mac terminal. Format:

```
docs(pipeline): short description

# Run from Mac terminal:
clearlock && cd /Users/don/Projects/community && \
  git add path/to/file && git commit -m "docs(pipeline): short description"
```

The `clearlock` exists because Cowork's sandbox can leave `.git/index.lock` files that wedge subsequent git operations. The skill ends with the message; the PM runs it.

**Lock pre-flight (Claude Code only).** Before any read-or-write work, `build` runs `ls web/.git/index.lock 2>/dev/null; ls .git/index.lock 2>/dev/null`. If either prints a path, stop and ask the PM to run `clearlock` from the Mac terminal before proceeding. Do not attempt to remove the lock — the sandbox lacks the permission.

---

## Solo-team multiplier gates (M1–M4)

| Gate | What | When | Mandatory? |
|---|---|---|---|
| **M1** | Architecture / system-design check | Inside `review` | Any scope introducing new schema, event, or component |
| **M2** | Code review | Inside `build`, **before** the commit | Every shipped ticket |
| **M3** | Accessibility | Inside `review` | Every new page or component |
| **M4** | Deploy checklist | Before any merge to main | Every release touching the migration path |

Plugin skills invoked at each: `engineering:architecture` + `engineering:system-design` (M1), `engineering:code-review` (M2), `design:accessibility-review` (M3), `engineering:deploy-checklist` (M4). See [`skills/EXTERNAL-SKILLS.md`](skills/EXTERNAL-SKILLS.md).

---

## Escalation contacts

- **Product questions** → `explore` (via PM).
- **Spec ambiguity** → flag in `development/DEVIATIONS.md`, escalate to `scope`.
- **Architecture / design drift suspected** → `review`.
- **Reprioritization** → `scope`.
- **Feature redesign** → `scope` → `explore`.
- **Test failure that requires scope change** → `scope` revises; cycle restarts at step 6.
- **Migration / auth / RLS change** → `review` runs security sub-routine before `ticket`; Anthropic's `security-review` skill optional before commit (build).
- **Non-code deliverables** (report, deck, spreadsheet, PDF) → build invokes `anthropic-skills:docx/pptx/xlsx/pdf`.
- **Close-call decision** → `weigh` (applies the lexicographic rule; see [`playbooks/DECISION-PATTERNS.md`](playbooks/DECISION-PATTERNS.md)).

---

## Bundle wrap-up

After each bundle ships, run a one-session wrap-up. Produces `planning/now/bundle-{N}-wrapup.md` (archives to `planning/done/` with the bundle), ~3–5 pages:

- **Decisions kept** — one paragraph per pattern-doc entry that landed this bundle, with a pointer into `playbooks/`.
- **Decisions deferred** — what got punted to the next bundle and why.
- **Open questions for b{N+1}** — what the next bundle has to answer.
- **What didn't work** — anti-patterns surfaced this bundle, folded into [`playbooks/DEVELOPMENT-PATTERNS.md`](playbooks/DEVELOPMENT-PATTERNS.md) § Pipeline anti-patterns.

After the wrap-up lands, the next bundle reads only the wrap-up plus active specs and the playbooks. STAGE-LEDGER and SPEC-PATCHES archive per bundle, not carried forward. The playbooks carry the durable decisions; the wrap-up carries the synthesized brief.
