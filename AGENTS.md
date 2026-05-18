# AGENTS.md — Development Pipeline

> Project-wide pipeline definition. Lives at root (alongside `CLAUDE.md` and `JOURNAL.md`) because it describes agents that work across `product/`, `planning/`, `development/`, and `web/` — it is not a planning-stage concern. See [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) for the rationale and the full audit.

Seven specialized roles handle the full development lifecycle. Each is implemented as a skill in [`skills/`](skills/) and routed by `pipeline-router`. Process lives in skills, not in nested CLAUDE.md files.

## Pipeline Overview

```
Product (dream) → Planning (filter) → Review (pre-flight, optional) ──┐
                                                                       ├→ Build (execute) → Eval-run (verify)
                                            Eval-write (oracle) ───────┤
                                            Ticket (sequence) ─────────┘
```

The PM cycle is strict. Each role has one input, one output, and explicit firewalls. **Review** is optional but strongly recommended for any scenario that introduces a new surface, component, event type, or schema. **Eval-write** and **Ticket** run in parallel from the approved scenario; both feed Build.

For a worked example tracing F018 through every role with real artifacts at each stage, see [`planning/walkthroughs/F018-pipeline-trace.md`](planning/walkthroughs/F018-pipeline-trace.md).

## What every gate is guarding against

Every gate in this pipeline exists because under-annotated specs put downstream agents in one of two failure modes — and any gate's runner can fall into the same trap when reading the artifact in front of it.

1. **Over-fit on literal wording.** The spec says "no X." The agent treats the refusal as categorical when the project's stance is shape-specific ("no *impersonal* X"). Acceptance criteria over-fit to surface text rather than design intent. Tests pass for the wrong reason. Bullets in foundation docs become more rigid than the project's actual position.
2. **Reconstruct intent and drift.** The spec says *what*. The agent guesses *why*, gets it plausibly wrong, and acts on the reconstructed intent — which then propagates downstream as if it were the spec. Over many turns, the project's actual intent and the operating intent diverge silently.

Both failure modes look like the agent doing its job. Both are caught by the same discipline: every load-bearing decision should carry its **why** alongside its **what**, and every gate's runner should read the *why* before judging the *what*. See [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) F13 for the full framing and the on-2026-05-12 incident that surfaced it.

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

> **MANDATORY during the primitives rebuild.** Until Phase 4 of [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) (the rebuild plan) completes, every approved scenario goes through review. Optional only for trivial copy/CTA changes on existing surfaces. Rationale: [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) F3.

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
- `planning/reviews/F{NNN}-review.md`

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
- `planning/reviews/F{NNN}-review.md` if it exists (the architecture + design pre-flight from `pipeline-review`)
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

**Mandatory at ticket close** (see [`planning/PIPELINE-AUDIT.md`](planning/PIPELINE-AUDIT.md) F8/F9):
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

> Paired skills invoked by `pipeline-clarify-absolutes` when an absolute touches member-vs-platform tension surfaces (data collection / privacy, visibility defaults, monetization shape, agent permissions, moderation severity, signal availability). The PM adjudicates.

**Skills:** `pipeline-member-advocate` + `pipeline-platform-advocate`
**Model:** Claude Opus (cross-spec read, adversarial framing)
**Output:** one bullet (1–2 sentences) per advocate by default; expansion to 150–250 word position paper on PM request.

**`pipeline-member-advocate` lens:** P1 (well-being), P3 (no externalities), P6 (default-private), P7 (built so bad actors fail). Argues for the Member's interest — minimum data collection, maximum opt-out, refusal of attention-exploitation or social-comparison surfaces, protection from bad members.

**`pipeline-platform-advocate` lens:** P5 (federated), P8 (agent-native), platform utility AND financial durability. Carries the no-VC commitment and the multi-source-revenue-early-on imperative as equal weights with utility. Not "platform first, members second" — argues for what the platform needs in order to keep serving Members.

**Reads:**
- The target statement + surrounding context
- `product/foundation/` (especially `people-first.md`, `policy-framework.md`, `foundational-principles.md`)
- For platform-advocate also: `product/systems/payments.md`, `producer-growth.md`, `business-jurisdiction.md`
- For member-advocate also: relevant scenario(s) or canonical examples that involve the surface at stake

**Writes:** nothing by default. Output is consumed inline by `pipeline-clarify-absolutes` (or directly by the PM).

**When to invoke:**
- `pipeline-clarify-absolutes` detects tension (per its 3c-bis check) and calls both advocates as sub-skills.
- PM says "run the dialectic on this statement" / "what's the Member view" / "what's the platform view."

**The contract.** Always invoked together — never one without the other. The PM reads both bullets, adjudicates, optionally requests expansion on one or both sides before deciding.

---

## 3.5. Review Absolute (Ticket-time pre-flight on encoded absolutes)

> **MANDATORY during the primitives rebuild** when a scenario about to be ticketed encodes one or more Category-2 absolutes in code (schema constraint, RLS policy, action-handler refusal, UI affordance removal, hard architectural floor). Fires *between* approved scenario and ticket-writing — the cheapest place to catch an unearned absolute is before code encodes it. The PM still adjudicates; the skill structures the adjudication.

**Skill:** `pipeline-review-absolute`
**Model:** Claude Opus (cross-spec read, rule application, careful framing of deferral triggers)
**Calls in:** `pipeline-member-advocate` and `pipeline-platform-advocate` (always both — never short-circuits one). Optionally `pipeline-clarify-absolutes` downstream when the recommended outcome is Revise and the wording change needs PM-ratified Intent before tickets land.

**Reads:**
- `skills/pipeline-member-advocate/SKILL.md`
- `skills/pipeline-platform-advocate/SKILL.md`
- The approved scenario at `planning/scenarios/F###-*.md` and any `planning/reviews/F###-review.md`
- The system spec(s) that define each absolute the scenario will encode
- `product/foundation/*.md` (especially `people-first.md`, `policy-framework.md`, `foundational-principles.md`)
- [`planning/archive/intent-audit-2026-05-12.md`](planning/archive/intent-audit-2026-05-12.md) (archived — historical reference for the Category-2 surface and the Intent-annotation pattern; live discipline lives in the clarify-absolutes and intent-check skills)
- `planning/DECISIONS.md` (when an ADR is the absolute's source of truth)

**Writes (default):** nothing. Output is the inline review record consumed by the PM. Ticket-writing waits on the PM's adjudication.

**Writes (on explicit PM request only):**
- `planning/DECISIONS.md` — when ratifying / revising / superseding the absolute creates a cross-cutting decision
- The target spec's **Policy posture** or **Decisions encoded here** section — when the absolute is single-system scope and the wording changes
- `planning/DEFERRED.md` — when the outcome is Defer; entry indexed by trigger so re-entry is automatic when the trigger fires

**Does NOT Read:**
- `web/` (code) — the absolute is being judged before code, not against it
- `development/tickets/` or `development/tickets/done/`
- `planning/scenarios-backlog/` (backlog firewall; the build agent's rule applies here too)

**Does NOT Write:**
- `web/` (code)
- `planning/scenarios-backlog/` or `planning/scenarios/` (cannot reshape scenarios; that's `pipeline-plan`'s job — escalate if Reject)
- `development/tickets/` (cannot produce tickets; that's `pipeline-ticket`'s job, which is paused while this skill runs)
- The target spec's substantive prose (only the explicit policy/decisions section on explicit PM request)

**Task:** When `pipeline-ticket` is about to write tickets for an approved scenario, scan the scenario + the system specs it references for Category-2 absolutes that will be encoded in code. For each, confirm tension shape (Member-vs-platform | One-vs-many | None), invoke both advocates, apply Gate 1 (platform survival — hard fail blocks ratify and blocks defer), apply maximization (net member benefit with neither lens taking significant harm), recommend one of four outcomes (Ratify | Revise | Defer | Reject). Deferral requires an observable, specific, bounded trigger.

**Outcome → ticket-writing consequence:**
- **Ratify** → tickets proceed as planned; the absolute lands in code.
- **Revise** → return to the system spec; revise the bullet + Intent; then resume ticket-writing on the new wording. `pipeline-clarify-absolutes` may be invoked for PM-ratified Intent landing.
- **Defer** → drop the ticket(s) that would encode the absolute from the slice; log the trigger in `planning/DEFERRED.md`; remaining tickets in the scenario continue.
- **Reject** → return the scenario to `pipeline-plan` for revision; ticket-writing does not proceed on this scenario.

**When to invoke:**
- `pipeline-ticket` pauses at the start of breaking down an approved scenario and scans for Category-2 absolutes the tickets will encode. For each, it invokes `pipeline-review-absolute` before writing any ticket that encodes it.
- PM says "audit the absolutes F### would encode" / "before tickets, review the absolutes" / "is this absolute earned at ticket-time" / "decide or defer the absolute before code."
- Out-of-band: the PM picks a single ticket-in-flight and asks to re-verify the absolute it encodes before merging.

**Hard constraints:**
- No scalar scores — surface tension texture, not numbers
- No deferral without an observable trigger — refuse and force the trigger conversation
- No Gate-1 deferral — survival-failing absolutes must be revised or rejected, never deferred
- Never short-circuit by skipping an advocate — both bullets must exist before the rule applies
- The PM adjudicates the outcome before any ticket lands — the skill recommends, never decides
- Override always available — the PM can override any step with cause logged

---

## Meta. Clarify Absolutes (Interactive PM clarifier)

> **MANDATORY during the primitives rebuild** on every Category-2 absolute (refusal / negation / "deliberately no X" / "we never" / "always" / "must" / "won't") in any foundation doc, system spec, or ADR — at the point the absolute is written or when `pipeline-intent-check` flags it. There is no purely-categorical refusal in this project per the [archived intent audit's](planning/archive/intent-audit-2026-05-12.md) revised addendum (2026-05-12); every absolute lands with PM-ratified Intent. (The audit is archived; the principle now lives in this skill.)

**Skill:** `pipeline-clarify-absolutes`
**Model:** Claude Opus (cross-spec read, careful PM ratification)

**Reads:**
- The target file (foundation doc / system spec / ADR / planning doc)
- [`planning/archive/intent-audit-2026-05-12.md`](planning/archive/intent-audit-2026-05-12.md) (archived; Category 2 in particular — the live framing lives in this skill)
- Related foundation/system docs for cross-spec context
- Recent JOURNAL entries (≤30 days) for related ratifications

**Writes:**
- The target file directly: bullet text revisions (when original wording was misleading) and `Intent:` annotations (always)
- One `JOURNAL.md` entry per session summarizing what was clarified

**Does NOT Read or Write:**
- `web/` (code)
- `development/tickets/`
- Scenarios, evals, BUILD-LOG.md

**Task:** Walk the PM through each absolute interactively, one statement at a time. Ask 1–2 free-form context questions per statement, propose a revision (bullet text if needed + Intent), ratify via AskUserQuestion, land directly to the source file. Refuses to batch-process; refuses to land without per-statement ratification.

**When to invoke:**
- PM says "clarify the absolutes in {file}" / "review every never-statement" / "every absolute needs intent."
- `pipeline-intent-check`'s ESCALATE verdict flagged Category-2 candidates.
- A new ADR or system spec contains absolute-language refusals and is about to be ratified — clarify before merging.

---

## Meta. Intent Check (Out-of-band quality gate)

> **MANDATORY during the primitives rebuild** before a new ADR lands in `planning/DECISIONS.md` and before `pipeline-plan` ratifies any scenario whose system-spec changes added Category-1–8 statements per the [archived intent audit](planning/archive/intent-audit-2026-05-12.md) (live discipline encoded in this skill).

**Skill:** `pipeline-intent-check`
**Model:** Claude Opus (cross-spec read, conservative flagging)

**Reads:**
- The target file(s): `product/foundation/*.md`, `product/systems/*.md`, or `planning/DECISIONS.md` ADR text
- [`planning/archive/intent-audit-2026-05-12.md`](planning/archive/intent-audit-2026-05-12.md) (archived; the eight categories — encoded directly in this skill's workflow)

**Writes:**
- `planning/reviews/intent-{target}-{YYYY-MM-DD}.md`

**Does NOT Read or Write:**
- `web/` (code)
- `development/tickets/`
- `planning/scenarios/` or `planning/scenarios-backlog/` (scenarios carry acceptance criteria, not Intent annotations)
- The target file itself is not edited; this skill flags + proposes shapes only.

**Task:** Verify that statements matching the eight Category shapes (per the [archived intent audit](planning/archive/intent-audit-2026-05-12.md), encoded in this skill's workflow §2) carry substantive `Intent:` annotations. Verdicts: **CLEAN** (zero misses), **PROPOSE** (PM lands the proposed lines, pipeline proceeds), **BLOCK** (load-bearing rationale missing on a refusal / schema-level commitment / cross-doc commitment whose local scope is unclear; pipeline pauses).

**When to invoke:** any new ADR, any new system spec, any foundation-doc change that introduces a refusal / numeric threshold / naming split / tier deferral / cross-doc commitment. Out-of-band; does not run during an open pipeline phase.

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
