---
purpose: Pipeline automation audit — skills, guardrails, missing triggers
layer: planning
status: proposed
route: weigh
---

# Pipeline Automation Gaps Audit

**Date:** 2026-06-02
**Scope:** All 12 pipeline skills, build commit/merge workflow, cross-cutting handoff patterns

---

## 1. Current State — What's Automated vs Manual

### Fully manual (PM invokes every time)
- **Every skill invocation.** No skill triggers another. The PM is the scheduler.
- **Every lane move.** `backlog/ → next/ → now/ → done/` — PM moves files.
- **STAGE-LEDGER stamps.** Each skill is *supposed* to stamp as its final step; no enforcement.
- **`_audit/` telemetry.** Explicitly documented as "no git hook owns this."
- **`bundle-1-checklist.md` updates.** Frontmatter claims "updated at ticket close" — nothing makes it happen.
- **JOURNAL entries.** Convention, not enforced.
- **`product/TRACE.md` lineage.** No skill is formally responsible.

### Enforced by skill workflow (agent discipline, not CI)
- **M2 code review** — `build` workflow mandates before commit y/n prompt.
- **PM y/n before commit** — `build` always asks.
- **PM y/n before merge** — `build` always asks.
- **Gate A** (unratified absolutes block `scope` approval) — `scope` workflow enforces.
- **Gate B** (unratified absolutes block `ticket` drafting) — `ticket` workflow enforces.

### Not enforced anywhere
- **Evals must pass before commit** — evals run *after* commit (step 13 in AGENTS.md).
- **Evals must pass before merge** — no explicit rule; PM judgment call.
- **Review must exist before ticket** — `ticket` says "read review *if it exists*."
- **Test-write must run before build** — no pre-check in `build` for eval file existence.
- **M3/M4 in build workflow** — listed in ticket templates but not in `build`'s workflow.md steps.

---

## 2. Guardrail A — Evals Must Pass Before Commit

### Current state

AGENTS.md § 9 PM Workflow:
> Step 11: `build` implements.
> Step 12: `build` asks PM permission, commits.
> Step 13: `test` runs evals **after commit**.

The sequence is: code-review (M2) → commit → evals. Failing evals trigger fix-forward, not rollback. STAGE-LEDGER confirms this: F038 and F040 are in `building` state with "eval pending PM merge."

### What to change

**Option A (recommended): Evals gate merge, not commit.**

Requiring evals before *commit* breaks the TDD loop — `build` commits incrementally on its branch while developing. The real protection point is the merge to main. Rule:

> **`build` must not request the merge y/n prompt until evals are green.** If evals fail, `build` fixes forward on the branch and re-runs. The merge prompt fires only after the final eval run passes.

**Files to edit:**

1. **`skills/build/workflow.md`** — In the "Ticket close" section, insert between M2 and the merge prompt:

   ```
   ## Eval gate (pre-merge)

   After M2 passes and the commit lands:
   1. Run `test` (run mode) for the scenario this ticket serves.
   2. If evals pass → proceed to merge prompt.
   3. If evals fail → fix forward on the same branch. Do NOT request merge.
   4. Loop steps 1–3 until green.

   The commit y/n prompt fires after M2.
   The merge y/n prompt fires after evals pass.
   These are two separate gates — never collapse them.
   ```

2. **`AGENTS.md` § 9. build** — Add to "Mandatory at ticket close":

   ```
   **Eval gate.** After the commit lands, run evals for the ticket's scenario.
   Merge prompt is blocked until evals pass. Fix forward if they fail.
   ```

3. **`AGENTS.md` § PM Workflow** — Reorder steps 12–14:

   ```
   12. build commits (after M2 + PM y/n).
   13. build runs evals. If fail → fix forward, re-commit, re-run.
   14. build requests merge (after evals green + PM y/n).
   ```

4. **Root `CLAUDE.md` § Commit Rules** — Add after the merge choreography paragraph:

   ```
   **Eval gate.** The merge y/n prompt fires only after the ticket's evals pass.
   Build fixes forward on the branch if evals fail; it does not request merge
   with red evals.
   ```

**Option B (stricter): Evals gate commit too.**

This means `build` cannot commit until evals pass. Cleaner but imposes a constraint: `build` must get the entire ticket to green in one pass before any commit. This eliminates incremental commits on the branch, which is viable for small tickets but painful for multi-file work. Not recommended for this project's ticket size.

---

## 3. Guardrail B — PM Approval Before Merge to Main

### Current state

**Already enforced.** Root CLAUDE.md § Commit Rules:
> "After the commit lands, `build` asks: 'Ready to merge t### into main and remove the worktree? (y/n).'"

AGENTS.md § Commit choreography:
> "Claude Code commits code. Always asks first."

### What's missing

The rule is stated but only applies to the `web/` repo implicitly (the parent repo has Cowork commit choreography, not Claude Code). To make this explicit:

**File to edit: `AGENTS.md` § Commit choreography** — Add:

```
**Merge restriction.** The merge y/n prompt applies ONLY to the `web/` repo.
The parent repo (product/, planning/, development/, skills/) follows Cowork
commit choreography — PM runs clearlock + git from terminal. Parent repo
branches may merge freely; the gate is the PM running the command.
```

This codifies the asymmetry the PM described.

---

## 4. Missing Triggers — Ranked by Value

### HIGH — should implement in next tidy pass

| # | Gap | Currently | Proposed trigger | Files to edit |
|---|---|---|---|---|
| **H1** | Evals gate merge | Evals run post-commit, no merge gate | Guardrail A above | `skills/build/workflow.md`, `AGENTS.md`, `CLAUDE.md` |
| **H2** | `build` doesn't verify eval file exists before TDD loop | Process order only — PM could invoke `build` before `test` (write) | `build` pre-flight: check `{app}/evals/features/F{NNN}*.spec.ts` exists; if missing, stop and tell PM to run `test` (write mode) first | `skills/build/workflow.md` § Lock pre-flight |
| **H3** | `ticket` proceeds without `review` during rebuild phase | `ticket` says "read review *if it exists*" — optional phrasing | During rebuild phase: `ticket` checks for `review-F{NNN}.md` in the scenario's lane; if absent, stop and tell PM to run `review` first | `skills/ticket/workflow.md` § Inputs |
| **H4** | M3 + M4 not in `build` workflow steps | Listed in ticket templates, implied in skill | Add explicit steps to `skills/build/workflow.md`: M3 after any new page/component, M4 before merge prompt | `skills/build/workflow.md` |

### MEDIUM — implement when convenient

| # | Gap | Currently | Proposed trigger | Files to edit |
|---|---|---|---|---|
| **M1** | STAGE-LEDGER stamps skipped | Each skill is supposed to stamp; no enforcement | Add "STAGE-LEDGER stamp" as a mandatory checklist item in `tidy:sweep-skills` finding #3's explicit check list. On next `tidy:sweep-skills`, flag any skill missing the stamp step. | `skills/tidy/workflow.md` § sweep-skills finding #3 |
| **M2** | `explore` has no STAGE-LEDGER stamp | Only pipeline skill without one | Add STAGE-LEDGER stamp step to `skills/explore/workflow.md` — stamp `spec-extended` or `spec-created` | `skills/explore/workflow.md` |
| **M3** | `weigh` has no STAGE-LEDGER stamp | Gate-clearing events invisible to ledger | Add stamp step: `gate-cleared` with Gate A/B reference | `skills/weigh/workflow.md` |
| **M4** | `bundle-1-checklist.md` stale after ticket close | Frontmatter claims auto-update; doesn't happen | Add step to `build` workflow: after ticket moves to `done/`, update the checklist row for the relevant scenario/theme | `skills/build/workflow.md` |
| **M5** | `explore` doesn't drain SPEC-PATCHES | CLAUDE.md says it should; no workflow step | Add explicit step to `skills/explore/workflow.md`: on invocation, read `planning/SPEC-PATCHES.md`; process open entries; clear resolved ones | `skills/explore/workflow.md` |
| **M6** | SPEC-PATCHES ↔ DEVIATIONS coupling unverified | `build` is supposed to create both; nothing cross-checks | Add to `orient` drift checklist: scan DEVIATIONS for `flag-for-spec-revision` entries; verify each has a SPEC-PATCHES row | `skills/orient/workflow.md` § drift checklist |

### LOW — nice to have, defer to post-b1

| # | Gap | Currently | Proposed trigger | Files to edit |
|---|---|---|---|---|
| **L1** | `_audit/` telemetry on scenario done-flip | Manual, explicitly no git hook | Post-b1: add a `done-flip` sub-routine to `orient` that runs the telemetry commands when it detects a scenario moved to `done/` since last session | `skills/orient/workflow.md` |
| **L2** | Scenarios don't auto-move when ledger flips | PM moves files; ledger is the record | Keep manual. Lane membership IS the state; auto-move risks silent state changes the PM didn't ratify. The cost of manual moves is low and the PM wants to inspect each one. | No change |
| **L3** | Gate A not re-checked when specs update after approval | Approved scenarios pass silently if spec gains new unratified absolute | Add to `orient` drift checklist: for each scenario in `next/` or `now/`, verify cited spec sections haven't gained unratified absolutes since approval date | `skills/orient/workflow.md` § drift checklist |
| **L4** | Substrate tickets skip test-write with no explicit handling | `build` workflow assumes scenario + eval exist | Add substrate-ticket branch to `build` workflow: "If `Scenario: substrate`, skip eval-file pre-flight; unit tests against spec section are the red phase" | `skills/build/workflow.md` |
| **L5** | `review` decisions not verified as landed in playbooks | Review doc has "Decisions captured" section; nothing confirms propagation | Add to `tidy:sweep-docs`: scan `review-F###.md` files for "Decisions captured" entries; verify each has a corresponding playbook entry | `skills/tidy/workflow.md` § sweep-docs |
| **L6** | `weigh` intent categories anchored to archived file | Categories defined in `_attic/` doc; drift risk | Extract the 8 categories into a live doc section (e.g., `playbooks/DECISION-PATTERNS.md` § Intent categories) and update `weigh` workflow to reference it | `playbooks/DECISION-PATTERNS.md`, `skills/weigh/workflow.md` |

---

## 5. Skills Audit Summary

| Skill | STAGE-LEDGER stamp? | JOURNAL entry? | Downstream handoff | Key gap |
|---|---|---|---|---|
| `orient` | N/A (reads, doesn't produce) | Optional | Routes to correct skill (manual) | No staleness threshold on SPEC-PATCHES age |
| `explore` | **No** | **No** | Manual → `scope` | Missing STAGE-LEDGER + SPEC-PATCHES drain |
| `scope` | Yes (`plan-backlog`) | Yes | Manual → PM moves → `review`/`ticket` | Gate A not re-checked on spec updates |
| `weigh` | **No** | Yes | Manual → re-run failed gate | Gate-clearing events invisible to ledger |
| `review` | Yes (`reviewed`) | Yes | Manual → `ticket` (PROCEED) / `scope` (REVISE) / `explore` (EXTEND) | Decisions-captured not verified as propagated |
| `memo` | **No** | Yes (after ratification) | Manual → downstream re-run | No mechanism to invalidate cached gate results |
| `atomize` | **No** | Yes | Manual → PM ratifies stubs | No REGISTRY row guidance for new stubs |
| `ticket` | Yes (`ticketed`) | Implicit | Manual → `test` (write) + `build` | Proceeds without review during rebuild |
| `test` | Yes (`eval-spec` / `done`) | Implicit | Manual → `build` (write→build) or PM (run→done) | No enforcement that write ran before build |
| `build` | Yes (`building` / `done`) | Implicit | Commit y/n → merge y/n (manual) | **Evals don't gate merge** |
| `tidy` | N/A (maintenance) | N/A | None | Quiescence guard doesn't distinguish ticket states |
| `loop-designer` | No (utility) | No | Manual | No file-system integration |

---

## 6. Recommended Implementation Order

### Phase 1 — Before next ticket (30 min)
1. **H1** — Add eval gate to merge prompt in `build` workflow + `AGENTS.md` + `CLAUDE.md`
2. **H2** — Add eval-file pre-flight to `build` workflow
3. **Guardrail B clarification** — Add merge restriction note to `AGENTS.md`

### Phase 2 — Next tidy pass (1 hr)
4. **H3** — Make `ticket` enforce review existence during rebuild
5. **H4** — Add M3/M4 explicit steps to `build` workflow
6. **M1** — Add STAGE-LEDGER stamp to `tidy:sweep-skills` mandatory-step check list
7. **M2** — Add STAGE-LEDGER stamp to `explore`
8. **M3** — Add STAGE-LEDGER stamp to `weigh`

### Phase 3 — Batch with next checklist resync (30 min)
9. **M4** — Add checklist-update step to `build` workflow
10. **M5** — Add SPEC-PATCHES drain to `explore`
11. **M6** — Add DEVIATIONS↔SPEC-PATCHES cross-check to `orient`

### Phase 4 — Post-b1
12. L1–L6 — defer; capture in `planning/backlog/` as individual stubs if desired

---

## 7. Cross-cutting Observations

**The pipeline has no "push" mode.** Every skill waits for PM invocation. This is appropriate for a solo founder — the PM IS the scheduler, and auto-triggering skills risks silent state changes. The value is in **gates** (preventing bad transitions) not **triggers** (auto-starting good ones).

**The biggest risk is not missing automation — it's missing gates.** The pipeline's manual nature is fine. What's dangerous is that `build` can commit and request a merge with failing evals, and `ticket` can proceed without a mandatory review. Fixing H1–H4 closes the safety gaps; the rest is convenience.

**STAGE-LEDGER is the coordination layer but it's not load-bearing.** Nothing reads STAGE-LEDGER to gate a transition — it's a record, not a lock. Making it load-bearing (e.g., `build` refuses to start unless STAGE-LEDGER shows `reviewed` for the scenario) would add enforcement but also brittleness. The current approach — `orient` flags drift at session start — is the right trade-off for a solo team.
