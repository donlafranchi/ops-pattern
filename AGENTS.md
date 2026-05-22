# AGENTS.md — Development Pipeline

> Project-wide pipeline definition. Lives at root (alongside `CLAUDE.md` and `JOURNAL.md`) because it describes agents that work across `product/`, `planning/`, `development/`, and `web/` — it is not a planning-stage concern. See [`_attic/2026-05-19/planning/PIPELINE-AUDIT.md`](_attic/2026-05-19/planning/PIPELINE-AUDIT.md) for the rationale and the full audit.

Seven specialized roles handle the full development lifecycle. Each is implemented as a skill in [`skills/`](skills/) and routed by `pipeline-router`. Process lives in skills, not in nested CLAUDE.md files.

## Pipeline Overview

```
Product (dream) → Planning (filter) → Review (pre-flight, optional) ──┐
                                                                       ├→ Build (execute) → Eval-run (verify)
                                            Eval-write (oracle) ───────┤
                                            Ticket (sequence) ─────────┘
```

The PM cycle is strict. Each role has one input, one output, and explicit firewalls. **Review** is optional but strongly recommended for any scenario that introduces a new surface, component, event type, or schema. **Eval-write** and **Ticket** run in parallel from the approved scenario; both feed Build.

For a worked example tracing F018 through every role with real artifacts at each stage, see [`planning/history/F018-pipeline-trace.md`](planning/history/F018-pipeline-trace.md).

## What every gate is guarding against

Every gate in this pipeline exists because under-annotated specs put downstream agents in one of two failure modes — and any gate's runner can fall into the same trap when reading the artifact in front of it.

1. **Over-fit on literal wording.** The spec says "no X." The agent treats the refusal as categorical when the project's stance is shape-specific ("no *impersonal* X"). Acceptance criteria over-fit to surface text rather than design intent. Tests pass for the wrong reason. Bullets in foundation docs become more rigid than the project's actual position.
2. **Reconstruct intent and drift.** The spec says *what*. The agent guesses *why*, gets it plausibly wrong, and acts on the reconstructed intent — which then propagates downstream as if it were the spec. Over many turns, the project's actual intent and the operating intent diverge silently.

Both failure modes look like the agent doing its job. Both are caught by the same discipline: every load-bearing decision should carry its **why** alongside its **what**, and every gate's runner should read the *why* before judging the *what*. See [`_attic/2026-05-19/planning/PIPELINE-AUDIT.md`](_attic/2026-05-19/planning/PIPELINE-AUDIT.md) F13 for the full framing and the on-2026-05-12 incident that surfaced it.

## 0. Router

**Skill:** `pipeline-router`
**Model:** Claude Sonnet (orientation, no production work)

**Reads:**
- Root `CLAUDE.md`
- `JOURNAL.md`
- `planning/bundles/{active}.md`

**Task:** Session-start orientation. Identify what the user wants and route to the right downstream skill.

---

## 1. Product Agent

**Skill:** `pipeline-product`
**Model:** Claude Opus (creative, comprehensive)

**Reads:**
- `product/foundation/` (loops, primitives, people-first, canonical-examples)
- `product/exploration/`
- `product/specs/`

**Writes:**
- `product/capabilities/`
- `product/systems/` (with mandatory "Data model implications" section)
- `product/surfaces/`
- `product/exploration/`
- `product/templates/`
- `product/foundation/canonical-examples.md` (extends with new real situations)

**Does NOT Read:**
- `planning/`
- `development/`
- `web/`

**Task:** Explore unconstrained. Write tiered systems (T1/T2/T3), capabilities, product files. Refuses to prioritize, write tickets, or write scenarios — those are downstream.

---

## 2. Scenario Writer (Planning)

**Skill:** `pipeline-plan`
**Model:** Claude Opus (filter, comprehensive)

**Reads:**
- `product/foundation/canonical-examples.md` (mandatory anchor)
- `product/foundation/loops.md`
- `product/foundation/primitives.md`
- `product/systems/`
- `product/capabilities/`
- `planning/bundles/`

**Writes:**
- `planning/scenarios-backlog/` (PM moves approved → `planning/scenarios/`)
- `planning/bundles/`

**Does NOT Read:**
- `development/tickets/`
- `web/`
- `planning/scenarios/` (only for reference; never modifies)

**Task:** Convert systems into user-story-shaped scenarios anchored to canonical examples. Apply the 5 Deadly Sins filter (scope creep, gold plating, missing requirements, unrealistic schedules, poor communication). Refuses to write tickets or explore.

**Calls in:** Anthropic-provided `planning-filter` skill when ranking a sprawling backlog.

---

## 2.5. Reviewer (Architecture + Design pre-flight)

> **MANDATORY during the primitives rebuild.** Until Phase 4 of [`planning/rebuild-plan.md`](planning/rebuild-plan.md) (the rebuild plan) completes, every approved scenario goes through review. Optional only for trivial copy/CTA changes on existing surfaces. Rationale: [`_attic/2026-05-19/planning/PIPELINE-AUDIT.md`](_attic/2026-05-19/planning/PIPELINE-AUDIT.md) F3.

**Skill:** `pipeline-review`
**Model:** Claude Opus (cross-system check, comprehensive)
**Calls in:** `design:design-critique`, `design:design-system`, `design:accessibility-review` (mandatory on every new surface), `engineering:architecture` (re-evaluates ADR fit when one exists).

**Reads:**
- `planning/scenarios/` (the approved scenario)
- `product/systems/`
- `product/ui/`
- `product/foundation/`
- `planning/DECISIONS.md`
- `planning/bundles/{active}.md`

**Writes:**
- `planning/history/F{NNN}-review.md`

**Does NOT Read:**
- `web/` (code)
- `development/tickets/`
- `planning/scenarios-backlog/`

**Task:** Architecture check (does this scenario fit existing systems? new schema/events/columns required?) + Design check (does the surface fit the design language? new components needed? CTA placement consistent?). Output: a review document with verdict **PROCEED** (continue), **REVISE** (back to plan), or **EXTEND** (back to product to extend a system or design doc).

**When to invoke:** any scenario that introduces a new surface, component, event type, table, column, or design pattern. Skip for trivial additions to existing forms/pages.

---

## 3. Eval Writer (Pre-build oracle)

**Skill:** `pipeline-eval` (write mode)
**Model:** Claude Opus (comprehensive, thorough)

**Reads:**
- `planning/scenarios/` (approved only)

**Writes:**
- `web/evals/features/F{NNN}.spec.ts` (or framework equivalent)

**Does NOT Read:**
- `web/` source code (no peeking at implementation)
- `planning/scenarios-backlog/`
- `development/tickets/`

**Task:** Translate every Given/When/Then in the approved scenario into an automated test. Tests must trace line-by-line back to scenario clauses.

**Critical firewall:** runs *before* the build agent starts. This is what prevents teaching to test.

---

## 4. Ticket Writer

**Skill:** `pipeline-ticket`
**Model:** Claude Opus (systematic, clear)

**Reads:**
- `planning/scenarios/` (approved only)
- `planning/history/F{NNN}-review.md` if it exists (the architecture + design pre-flight from `pipeline-review`)
- `development/tickets/` and `development/tickets/done/` (for the next T-number and to learn what exists)
- `product/systems/{relevant-system}.md` (only the "Data model implications" section)

**Writes:**
- `development/tickets/`

**Does NOT Read:**
- `planning/scenarios-backlog/`
- `web/` (code)
- Eval test code

**Task:** Break each approved scenario into ordered, session-sized tickets (~1–3 hours, one cohesive commit each). Each ticket references exactly one scenario via `Scenario:`. If a scenario produces 5+ tickets, escalate to `pipeline-plan` to split.

---

## 5. Build Agent

**Skill:** `pipeline-build`
**Model:** Claude Sonnet (fast, execution-focused)

**Reads:**
- `development/tickets/`
- `planning/scenarios/` (the scenario the ticket references)
- `product/systems/{name}.md` (Data model implications only)
- `product/ui/design-language.md` (for any UI work)
- `web/` (code, tests)

**Writes:**
- `web/` (code and tests)
- `development/tickets/` (Completion section, then move to `done/`)
- `BUILD-LOG.md`

**Does NOT Read:**
- `planning/scenarios-backlog/` (not approved — prevents teaching to test)
- `product/` outside the system spec referenced by the ticket
- Eval test code (write mode evals are an external oracle; build writes its own unit tests)

**Task:** Implement one ticket at a time via TDD (red → green → refactor). Never roll back; fix forward. Escalate ambiguity to `pipeline-plan`. Does NOT write tickets — `pipeline-ticket` does.

**Mandatory at ticket close** (see [`_attic/2026-05-19/planning/PIPELINE-AUDIT.md`](_attic/2026-05-19/planning/PIPELINE-AUDIT.md) F8/F9):
- Append a single-line entry to `development/DEVIATIONS.md` — even "no deviations." Empty is no longer the default.
- Update `web/BUILD-LOG.md` with current ticket status.
- Run `engineering:code-review` on the diff before invoking `pipeline-eval` (run mode). This is the M2 solo-team multiplier.

**Calls in:** Anthropic-provided `docx`, `pptx`, `xlsx`, `pdf` skills when the deliverable is a non-code file. `engineering:debug` during reproduction. `engineering:code-review` mandatory before eval-run.

---

## 6. Eval Runner

**Skill:** `pipeline-eval` (run mode)
**Model:** Claude Opus (comprehensive, thorough)

**Reads:**
- `web/evals/`
- `web/evals/results/`
- `planning/scenarios/` (for traceability)

**Writes:**
- `web/evals/results/`

**Task:** Run F### evals after build, report pass/fail per Given/When/Then clause. On fail, hand back to `pipeline-build` to fix forward. On scenario-is-wrong, hand back to `pipeline-plan`. Does NOT fix failing tests.

---

## Meta. Member / Platform Dialectic (Adversarial reasoning for tension-shaped decisions)

> Paired skills invoked by `pipeline-ratify-absolute` when an absolute touches member-vs-platform tension surfaces (data collection / privacy, visibility defaults, monetization shape, agent permissions, moderation severity, signal availability). The PM adjudicates.

**Skills:** `pipeline-member-advocate` + `pipeline-platform-advocate`
**Model:** Claude Opus (cross-spec read, adversarial framing)
**Output:** one bullet (1–2 sentences) per advocate by default; expansion to 150–250 word position paper on PM request.

**`pipeline-member-advocate` lens:** P1 (well-being), P3 (no externalities), P6 (default-private), P7 (built so bad actors fail). Argues for the Member's interest — minimum data collection, maximum opt-out, refusal of attention-exploitation or social-comparison surfaces, protection from bad members.

**`pipeline-platform-advocate` lens:** P5 (federated), P8 (agent-native), platform utility AND financial durability. Carries the no-VC commitment and the multi-source-revenue-early-on imperative as equal weights with utility. Not "platform first, members second" — argues for what the platform needs in order to keep serving Members.

**Reads:**
- The target statement + surrounding context
- `product/foundation/` (especially `principles.md`, `policy.md`, `principles.md`)
- For platform-advocate also: `product/systems/payments.md`, `producer-tools.md`, `business-jurisdiction.md`
- For member-advocate also: relevant scenario(s) or canonical examples that involve the surface at stake

**Writes:** nothing by default. Output is consumed inline by `pipeline-ratify-absolute` (or directly by the PM).

**When to invoke:**
- `pipeline-ratify-absolute` detects Member-shaped tension on a statement and calls both advocates as sub-skills.
- PM says "run the dialectic on this statement" / "what's the Member view" / "what's the platform view."

**The contract.** Always invoked together — never one without the other. The PM reads both bullets, adjudicates, optionally requests expansion on one or both sides before deciding.

---

## Meta. Ratify Absolute (Single adjudicator for unratified absolutes)

> **MANDATORY during the primitives rebuild** at two gates and out-of-band on every absolute-language statement ("Never / won't / doesn't / cannot / refuses / always / must / no X / deliberately no") in any foundation doc, system spec, or ADR. There is no purely-categorical refusal in this project — every absolute carries a State-tagged `Intent` line co-located with the bullet, or it blocks downstream pipeline. This skill is the single adjudicator that lands the State tag.

**Skill:** `pipeline-ratify-absolute` (folds in and replaces both `pipeline-clarify-absolutes` and `pipeline-review-absolute`, retired 2026-05-19)
**Model:** Claude Opus (cross-spec read, rule application, careful PM ratification)
**Calls in:** `pipeline-member-advocate` and `pipeline-platform-advocate` (always both — never short-circuits one) on every statement with Member-shaped tension.

**The State marker.** Co-located with every absolute, exactly one line encodes its state:

| Line in spec | State |
|---|---|
| No `Intent:` line | **Unratified de-facto** — blocks Gates A and B |
| `Intent: {why}` (no parenthetical tag) | **Drafted, not yet adjudicated** — blocks Gates A and B |
| `Intent (Ratified YYYY-MM-DD): {why}` | **Terminal-ratified** — downstream relies on the Intent |
| `Intent (Deferred until {trigger}; review by {horizon}): {interim posture}` | **Terminal-deferred** — current default until trigger fires |

Rejected absolutes are deleted from the spec; the JOURNAL entry records the removal.

**Reads:**
- The target file (foundation doc / system spec / ADR / planning doc)
- `product/foundation/*.md` (especially `principles.md`, `policy.md`, `principles.md`)
- Related foundation/system docs for cross-spec context
- Recent `JOURNAL.md` entries (≤30 days) for related ratifications
- [`_attic/2026-05-19/planning/intent-audit-2026-05-12.md`](_attic/2026-05-19/planning/intent-audit-2026-05-12.md) (archived; Category 2 in particular — the live framing lives in this skill)
- `planning/DECISIONS.md` when an ADR is the absolute's source of truth

**Writes:**
- The target file directly: bullet text revisions (only when original wording is misleading or fails Gate 1) + `Intent (State YYYY-MM-DD): {why}` annotations (always, on every ratified statement)
- For Rejected outcomes: removes the bullet entirely
- One `JOURNAL.md` entry per session summarizing what was ratified / deferred / rejected, with `file:line` pointers

**Does NOT Read or Write:**
- `web/` (code) — the absolute is being judged before code, not against it
- `development/tickets/` — ticketing is paused while this skill runs
- `planning/scenarios/` or `planning/scenarios-backlog/` — cannot reshape scenarios

**Task:** Walk the PM through each unratified absolute, one statement at a time. Detect tension shape (Member-vs-platform | One-Member-vs-many-Members | None). On Member-shaped tension, invoke both advocates and surface their bullets. Apply the lexicographic decision rule — **Gate 1** (platform survival — hard fail blocks Ratify and blocks Defer) then **Maximization** (net member benefit with neither lens taking significant unrecoverable harm). Recommend one outcome (Ratify | Revise | Defer | Reject). Deferral requires observable + specific + bounded trigger and review horizon. Ratify via AskUserQuestion per statement; land the State-tagged Intent directly to the source file.

**The two gates this skill backstops:**
- **Gate A — `pipeline-plan`.** A scenario cannot move from `scenarios-backlog/` to `scenarios/` if the spec sections it cites contain unratified absolutes the scenario would encode. PM runs this skill on those absolutes first; then plan approves.
- **Gate B — `pipeline-ticket`.** A ticket cannot be drafted if any spec section the ticket would *encode in code* (schema, RLS, action-handler, UI affordance removal) contains unratified absolutes. `pipeline-ticket` stops, surfaces the unratified statements, and routes to this skill.

**When to invoke:**
- Gate A or Gate B fails — invoked by the gate caller
- PM says "ratify the absolutes in {file}" / "review every never-statement" / "audit our absolutes" / "is this earned" / "decide or defer on X" / "every absolute needs Intent"
- `pipeline-intent-check`'s ESCALATE verdict flagged Category-2 candidates
- A new ADR or system spec contains absolute-language refusals and is about to be merged — ratify before merging

**Hard constraints:**
- **Skip-if-ratified.** Statements already carrying `Intent (Ratified ...)` or `Intent (Deferred ...)` are skipped; surface count to PM at start
- **No batch landing.** Per-statement walk only; PM ratifies each before moving to the next
- **No scalar scores.** Surface tension texture, not numbers
- **No deferral without observable trigger + bounded review horizon.** "Decide later" is a punt
- **No Gate-1 deferral.** Survival-failing absolutes must be Revised or Rejected, never Deferred
- **Never short-circuit an advocate.** Both bullets must exist before the rule applies, on every Member-shaped tension
- **PM adjudicates.** Skill recommends; PM ratifies. Override permitted with cause logged.

---

## Meta. Intent Check (Out-of-band quality gate)

> **MANDATORY during the primitives rebuild** before a new ADR lands in `planning/DECISIONS.md` and before `pipeline-plan` ratifies any scenario whose system-spec changes added Category-1–8 statements per the [archived intent audit](_attic/2026-05-19/planning/intent-audit-2026-05-12.md) (live discipline encoded in this skill).

**Skill:** `pipeline-intent-check`
**Model:** Claude Opus (cross-spec read, conservative flagging)

**Reads:**
- The target file(s): `product/foundation/*.md`, `product/systems/*.md`, or `planning/DECISIONS.md` ADR text
- [`_attic/2026-05-19/planning/intent-audit-2026-05-12.md`](_attic/2026-05-19/planning/intent-audit-2026-05-12.md) (archived; the eight categories — encoded directly in this skill's workflow)

**Writes:**
- `planning/history/intent-{target}-{YYYY-MM-DD}.md`

**Does NOT Read or Write:**
- `web/` (code)
- `development/tickets/`
- `planning/scenarios/` or `planning/scenarios-backlog/` (scenarios carry acceptance criteria, not Intent annotations)
- The target file itself is not edited; this skill flags + proposes shapes only.

**Task:** Verify that statements matching the eight Category shapes (per the [archived intent audit](_attic/2026-05-19/planning/intent-audit-2026-05-12.md), encoded in this skill's workflow §2) carry substantive `Intent:` annotations. Verdicts: **CLEAN** (zero misses), **PROPOSE** (PM lands the proposed lines, pipeline proceeds), **BLOCK** (load-bearing rationale missing on a refusal / schema-level commitment / cross-doc commitment whose local scope is unclear; pipeline pauses).

**When to invoke:** any new ADR, any new system spec, any foundation-doc change that introduces a refusal / numeric threshold / naming split / tier deferral / cross-doc commitment. Out-of-band; does not run during an open pipeline phase.

---

## Meta. Bundle Resync (Closed loop between build reality and the roadmap)

> **Recommended at every sub-bundle close** and **mandatory** after any DEVIATIONS.md entry that names a work-map item. The map is allowed to be wrong; pretending it isn't is the failure mode.

**Skill:** `pipeline-bundle-resync`
**Model:** Claude Sonnet (audit + propose; conservative on structural edits)

**Reads:**
- `web/BUILD-LOG.md`
- `development/tickets/done/` (the just-closed sub-bundle's tickets)
- `development/DEVIATIONS.md`
- `JOURNAL.md` (last 4 weeks)
- `planning/scenarios/F*.md` (active sub-bundle only)
- `planning/bundles/{active}.md`, `planning/bundles/bundle-themes.md`, `planning/bundles/b{N}-work-map.md`
- `planning/DECISIONS.md` (header status only — does not edit)

**Writes:**
- `planning/bundles/bundle-themes.md` (re-tag / re-sequence)
- `planning/bundles/b{N}-work-map.md` (re-tag / add proposed entries)
- One `JOURNAL.md` entry per run

**Does NOT Read or Write:**
- `product/` — the resync never invents scope.
- `web/` (code) beyond `BUILD-LOG.md`.
- Scenarios or tickets — those flow back through `pipeline-plan` / `pipeline-ticket` if the resync produces an EXPAND.

**Task:** Compare the work the just-closed sub-bundle was predicted to ship (per `b{N}-work-map.md`) to what actually shipped (per BUILD-LOG, done-tickets, DEVIATIONS). Diagnose drift as RE-TAG, RE-SEQUENCE, EXPAND, or ESCALATE. Apply non-structural edits directly; route structural drift to `pipeline-adr` / `pipeline-product` / `pipeline-plan`. CLEAN is a common and correct verdict.

**Verdicts:** CLEAN | RE-TAG | RE-SEQUENCE | EXPAND | ESCALATE.

**When to invoke:**
- At every sub-bundle close (PM-initiated).
- Mandatory after any DEVIATIONS.md entry referencing a work-map item.
- PM says "resync the work map" / "what's drifted" / "did anything shift after T###" / "scope sync" / "did the menu change."

---

## PM Workflow

```
1. "Write/extend system for X"               → pipeline-product
2. "Write scenarios for F###"                → pipeline-plan
3. PM reviews, moves to planning/scenarios/  (manual; or pipeline-plan on instruction)
4. "Review F###"                             → pipeline-review (optional)
   On EXTEND: → pipeline-product, then re-review.
   On REVISE: → pipeline-plan, then re-review.
   On PROCEED: continue.
5. "Write evals for F###"                    → pipeline-eval (write mode)
6. "Write tickets for F###"                  → pipeline-ticket
   (steps 5 and 6 run in parallel from the approved scenario)
7. "Implement T###"                          → pipeline-build
8. "Run evals for F###"                      → pipeline-eval (run mode)
9. On pass: PM picks next.
   On fail: pipeline-build fixes forward.
   On scenario-is-wrong: pipeline-plan revises; cycle restarts at step 4.
```

**Key invariant:** evals are *written* before build (step 5) and *run* after build (step 8). The split is what makes the pipeline trustworthy. The review stage (step 4) prevents architectural and design drift from sneaking into the build stage.

---

## Escalation Contacts

- **Product questions** → escalate to `pipeline-product` (via PM).
- **Spec ambiguity** → flag in `development/DEVIATIONS.md` and escalate to `pipeline-plan`.
- **Architecture / design drift suspected** → `pipeline-review`.
- **Reprioritization** → escalate to `pipeline-plan`.
- **Feature redesign** → escalate to `pipeline-plan` → `pipeline-product`.
- **Eval failure that requires scenario change** → `pipeline-plan` revises; cycle restarts at review.
- **Migration / auth / RLS change** → consider invoking Anthropic's `security-review` skill before commit (build agent).
- **Non-code deliverables** (report, deck, spreadsheet, PDF) → build agent invokes the matching Anthropic skill (`docx`, `pptx`, `xlsx`, `pdf`).
