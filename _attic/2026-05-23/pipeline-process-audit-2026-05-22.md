---
purpose: Second audit of the agent pipeline (2026-05-22).
layer: how
status: historical
---

# Pipeline Process Audit — 2026-05-22

> Second audit of the agent pipeline, ~2 weeks after [`_attic/2026-05-19/planning/PIPELINE-AUDIT.md`](_attic/2026-05-19/planning/PIPELINE-AUDIT.md) (2026-05-09). That audit asked "is the pipeline well-designed?" This one asks three different questions: **did the first audit's fixes hold, where are the handoffs not airtight, and how would we track a concept moving through the pipeline?**
>
> A dated audit file kept at repo root, referenced from `CLAUDE.md`. Future pipeline audits follow the same `pipeline-process-audit-YYYY-MM-DD.md` convention at root — see Placement at the end.

---

## TL;DR

The pipeline architecture is sound — the 2026-05-09 audit was right about that, and most of its structural fixes held. The problem now is **the loop never closes**. Work flows downstream cleanly; nothing flows back to confirm the upstream artifact is still true. Three patterns repeat:

1. **Structural fixes stick; hygiene fixes rot.** Of the 13 findings in the last audit, the 9 that were one-time edits (rewrite a doc, add a gate, write a spec) all held. The 4 that require *ongoing* upkeep (keep BUILD-LOG fresh, don't accumulate worktrees, rotate DEVIATIONS, keep `scenarios/` honest) all failed or regressed. Nothing re-checks hygiene, so hygiene decays.

2. **Cleanup is never anyone's job.** Retired skills still sit on disk. Scrapped scenarios still have eval specs. A superseded ADR is still cited as live authority in three active tickets. Each downstream step produces; no step prunes.

3. **There is no way to see where a concept *is*.** The only end-to-end trace artifact (`F018-pipeline-trace.md`) is a hand-written one-off, and it has gone stale. To answer "what stage is F025 at?" today you must glob six directories and cross-reference dates in the journal.

The fixes below are mostly cheap. The single highest-leverage one is a **session-start drift check** that converts hygiene from "remember to do it" into "the router flags it" — that one mechanism would have caught most of what follows.

---

## Method

Read in full: `CLAUDE.md` (on-disk), `AGENTS.md`, `_attic/2026-05-19/planning/PIPELINE-AUDIT.md`, `JOURNAL.md`, `BUILD-LOG.md`, `planning/DECISIONS.md`, `skills/README.md`, `planning/history/F018-pipeline-trace.md`, `skills/pipeline-ticket/workflow.md`, ticket `T056`. Sampled `DEVIATIONS.md` (605 lines — too large to read whole, which is itself a finding). Traced F018 end-to-end and the T041–T057 substrate-ticket run. Cross-referenced every 2026-05-09 finding against current repo state. Verified each concrete claim below against the filesystem (see the Verification note at the end).

One correction surfaced during verification: the `CLAUDE.md` copy in my initial briefing still named the retired `pipeline-clarify-absolutes` / `pipeline-review-absolute` skills, but the **on-disk `CLAUDE.md` is correct** — it was updated to `pipeline-ratify-absolute`. No finding there. The drift is elsewhere (see H6).

---

## Part A — Did the 2026-05-09 fixes hold?

| # | 2026-05-09 finding | Fix type | Status today |
|---|---|---|---|
| F1 | `CLAUDE.md` wrong about which agents exist | structural | ✅ Held — rewritten, routing table present |
| F2 | No "which agent when" routing | structural | ✅ Held — 27-row routing table |
| F3 | `pipeline-review` optional, should be mandatory | structural | ✅ Held — CLAUDE.md rebuild rule 1 |
| F4 | F018 approved-but-stuck-in-backlog | hygiene | ⚠️ **Regressed** — fixed, then F018 round-tripped *back* to backlog (2026-05-18). `scenarios/` is now empty. |
| F5 | T028–T040 drafted pre-approval | structural | ✅ Mooted — STALE-banned; rebuild re-ticketed T041+ |
| F6 | No `member.md` | structural | ✅ Held — `product/systems/member.md` exists |
| F7 | Six pipeline gaps unowned | mixed | 🟡 Partial — a11y (M3) + migration safety (M4) landed; **cross-feature consistency still unowned**; perf / i18n / release-notes deferred |
| F8 | `DEVIATIONS.md` empty | hygiene | ⚠️ **Over-corrected** — now 605 lines / 49 entries, one file, no rotation policy |
| F9 | `BUILD-LOG.md` stale, broken bundle link | hygiene | ⚠️ **Partially regressed** — ticket table is current; prose sections rotted again; **the broken bundle link is still there** |
| F10 | No root `BUILD-LOG.md` symlink | structural | ✅ Held — symlink present |
| F11 | Worktree shadow | hygiene | ❌ **Recurred** — new worktree `jolly-hermann-31c513/`; `.claude/worktrees/` still not gitignored |
| F12 | Skills not installed globally | structural | ✅ Held |
| F13 | Co-locate *why* with *what* | structural | ✅ Held — landed in `pipeline-ticket`, `pipeline-build`, `pipeline-eval` workflows |

**Read the Fix-type column.** Every structural fix held. Every hygiene fix failed or regressed. This is not coincidence — it is the central diagnosis. The pipeline enforces one-time gates well and has **no mechanism at all** for recurring upkeep. Recommendation R1 addresses exactly this.

---

## Part B — Handoffs that are not airtight

The pipeline's firewalls (build can't read backlog, eval-write can't read code) are well specified. The weak handoffs are the *other* kind — the ones where a step is supposed to push state back upstream, or where two steps meet on an unenforced manual action.

### H1 — Plan → "approved" is a manual move with no receipt, and `scenarios/` is now empty

The PM manually moves a scenario from `scenarios-backlog/` to `scenarios/` to mark it approved. Nothing records *that the move happened* or *when*. The 2026-05-09 audit's F4 was this exact failure. It was fixed, then it re-broke: F018 went backlog → `scenarios/` → reviewed PROCEED (05-08) → re-reviewed REVISE (05-18) → deferred **back** to `scenarios-backlog/`. `scenarios/` now contains **zero** files.

Why this is not airtight: "approved" is the single most load-bearing state in the pipeline — `pipeline-eval` (write) and `pipeline-ticket` both read *only* from `scenarios/`. Today that folder is empty, so the entire "approved scenario" contract is vacuous, and the firewall that depends on it (a ticket may not reference a backlog scenario) is structurally re-armed to fail the moment a Phase 2 ticket is written against an un-promoted scenario.

### H2 — The substrate-ticket path is real, heavily used, and undocumented

Tickets T041–T057 — the entire Phase 0 + Phase 1 schema floor, ~17 tickets — carry `Scenario: None` and open directly against system specs + ADRs. This is a legitimate adaptation: schema substrate has no user-facing behavior, so there is no scenario to write. But:

- `AGENTS.md` describes only the scenario-driven flow (Product → Plan → Review → Eval-write/Ticket → Build).
- `skills/pipeline-ticket/workflow.md` step 4 *mandates* a `Scenario:` path and a `Serves:` line, and says "If you can't fill this in… escalate to `pipeline-plan`."

So the pipeline's own ticket-writer workflow forbids the exact path 17 tickets took. A fresh agent told "write tickets for the Groups schema" would either wrongly escalate or improvise. The practice is fine; the contract is silent on it. This is a handoff gap because **Plan → Ticket has two lanes and only one is written down.**

### H3 — Build → Product spec-sync has no closed loop

The build agent cannot write to `product/`. When it discovers the spec is wrong, it logs "flagged for `pipeline-product`" in DEVIATIONS and moves on. There is no gate, no owner, and no queue that forces those patches to land. Confirmed accumulation:

- **T049** — flagged `member.md`, `groups.md`, `policy.md` for patching.
- **T050** — flagged `member.md` (the delegations partial-index predicate).
- **T056** — reconciled `items.state` to `draft/published/withdrawn/fulfilled/closed`; `item.md` still carries two *conflicting, both-wrong* state vocabularies.

The T056 case is the sharpest. The schema and its spec are *knowingly* divergent, and the agreed fix is "land the text edit when F018 promotes" — but F018 is deferred indefinitely (H1). So a spec the pipeline treats as authoritative is wrong, and the correction is parked behind a scenario that may never return. Every downstream reader of `item.md` inherits the error.

### H4 — Build → ticket Completion: the commit hash is never backfilled

`CLAUDE.md` commit rules end with: "PM pastes back the commit hash for the agent to backfill into the ticket's Completion section." T055, T056, and T057 — the three most recent tickets — all still read `Commit (web): {pending}` / `Commit (parent): {pending}`. The hashes exist (`7f427b8`, `f5e7e5a`, `6090f71` in `web`; `1cf6a2b`, `9fdec35`, `47d03fe` in the parent). The ticket's Completion section is the permanent provenance record, and for the last three tickets it has a hole. This handoff step is simply being dropped.

### H5 — Cross-feature consistency has no owner

`F018-pipeline-trace.md` itself names this: "F018's `<GatheringComposer>` and F019's `<DropComposer>` should share a base — nobody's role is to notice that." The 2026-05-09 audit said it "rolls into the mandatory review." It does not — `pipeline-review` reviews *one* scenario against existing systems; it never compares two *new* scenarios to each other. `pipeline-bundle-resync` compares predicted vs. shipped scope, not design coherence. As Phase 2 fans out into many sibling composer/surface scenarios, this gap widens exactly when it matters most.

### H6 — Skill consolidation → filesystem: retired skills not removed

The 2026-05-19 consolidation retired `pipeline-clarify-absolutes` and `pipeline-review-absolute` into `pipeline-ratify-absolute`. `AGENTS.md`, `skills/README.md`, and `CLAUDE.md` were all updated correctly. But the two retired skill **directories still exist on disk** with their `SKILL.md` files intact. Claude Code auto-discovers skills by directory, and `skills/install.sh` symlinks them globally — so a fresh session still sees three absolutes-skills, two of them retired, and the retired two can still trigger on intent. The doc handoff completed; the filesystem handoff did not.

---

## Part C — Inefficiencies

### E1 — F018 consumed two full review cycles and left a stale flagship

F018 was reviewed PROCEED on 05-08, then re-reviewed REVISE on 05-18, then deferred. Two `pipeline-review` passes (each an Opus cross-system read) on a scenario that did not ship. Worse, F018 is the project's *flagship example*: `AGENTS.md` line 18 points to `F018-pipeline-trace.md` as "a worked example… with real artifacts at each stage." Those artifacts are now archived (tickets T036–T040 are in `tickets/archive/`), the scenario is deferred, and the URLs in the trace (`/i/[slug]`) predate the 2026-05-11 naming pass (now `/e/`). The walkthrough's own Status line claims "reproducible" — it is not. The canonical onboarding document for the entire pipeline is misleading.

### E2 — `DEVIATIONS.md` is unrotated and unreadable in one pass

605 lines, 49 entries, 2026-05-10 → 2026-05-19, single file, no archive policy. (Only 3 entries are "no deviations" — content quality is good; the problem is purely volume + no rotation.) `JOURNAL.md` has an explicit rotation policy and monthly archives; `DEVIATIONS.md` got the "always write an entry" half of the F8 fix but not the "keep the live file scannable" half. It is now too big for an agent to read whole — I hit the token ceiling on it.

### E3 — `BUILD-LOG.md` prose sections rotted again

The ticket table is current (142/142). Everything around it is not: the header and line 11/123 cite `planning/bundles/b1-mvp.md` **which does not exist** (active bundle is `b1-primitives.md`); "Remaining b1 MVP Work" lists T025/T026 as remaining though both are ✅ Complete in the table above it; "Latest Commits" stops at T046 (11 tickets behind); "Notes" says "51/51 passing." The F9 fix made the *table* a living surface and left four prose sections to decay — and the broken bundle link F9 explicitly called out is back.

### E4 — `web/evals/features/` is a graveyard

10 spec files for F001–F005 and F018 — every one a scrapped (F001–F017, per JOURNAL) or deferred (F018) scenario. Real testing now lives in `web/evals/phase-0/` and `phase-1/`. The eval-writer produced these specs; nothing's job was to remove them when the scenarios were scrapped.

### E5 — Per-ticket sandbox-runner duplication

Vitest 4 + rolldown segfaults under Linux x86_64 in the build sandbox, so tickets ship a hand-written `tNNN-sandbox-check.mjs` mirror of the Vitest suite. `t049`, `t050`, `t052` each have one. That is the same workaround re-authored per ticket. A single shared sandbox harness would remove the per-ticket reinvention.

### E6 — ADR reference rot; the retag sweep is half-done

ADR-10 and ADR-11 are superseded (correctly recorded in `DECISIONS.md`). But they are still cited as *live authority* — T055/T056/T057 all open against "ADR-10 (event-log invariants)," which has been superseded by ADR-19 with invariants moved to ADR-7. T050's M2 review already identified an "ADR-10 → ADR-7 retag sweep across 002/007/012." The sweep was noted and never finished; the ticket prose still cites the dead number.

### E7 — `planning/rebuild-plan.md` is half-moved

JOURNAL pickup item 10: the plan to relocate the rebuild plan into `planning/` is half-done — the riskiest move (the file itself, ~25 inbound references) was deferred to avoid breakage. It is the single most-referenced doc in the repo and now lives in a directory the project is actively trying to dissolve. Deferring it does not make it cheaper; it makes it cost more later.

### E8 — Stale worktree shadow (recurring)

`.claude/worktrees/jolly-hermann-31c513/` is a near-complete copy of the repo with an *older* ticket set and an *older* skill set (15 pipeline skills vs. 17 live; it still has the retired absolutes-skills and lacks `pipeline-bundle-resync` and `pipeline-ratify-absolute`). `.claude/worktrees/` is still not in `.gitignore`. Any agent that globs broadly and picks a path inside it reads stale instructions — a real hazard, and one this very audit had to filter around.

---

## Part D — Tracking a concept through the pipeline

This is the question with no current answer. The pipeline produces a predictable artifact set per concept, keyed by F-number:

```
capability ─▶ scenario ─▶ review ─▶ eval-spec ─▶ ticket(s) ─▶ eval-result
(product/   (scenarios-  (planning/ (web/evals/  (development/ (web/evals/
 capabilities) backlog→    reviews/) features/)   tickets/)     results/)
               scenarios/)
```

Back-links exist: a ticket names its `Scenario:` and its `Serves:` loop. **Forward-links and current state do not exist.** A scenario does not list its tickets. A capability does not name its scenario (only 2 of 11 capability files reference any F-number). Nothing anywhere records *what stage a concept is at* or *when it last moved*. The F018 walkthrough was the closest thing to a trace, and it is a stale hand-built one-off.

Consequence: you cannot answer "where is F025?" or "what's been stuck longest?" without globbing six directories and reading the journal. You also cannot *detect a broken handoff* — H1 (a ticket referencing an un-promoted scenario) is invisible until build fails on it.

### Recommendation: a trace ledger + stage stamps

**1. One ledger file — `planning/TRACE.md`.** One row per F-number. Stage is an enum; the rest are dates or pointers.

| F# | Concept | Stage | Product | Plan | Review | Eval-spec | Tickets | Eval-run |
|----|---------|-------|---------|------|--------|-----------|---------|----------|
| F018 | Brian declares Run Club | `deferred` | event-host.md | 05-07 | REVISE 05-18 | features/F018… | T036–40 *(archived)* | — |
| F025 | Adaeze member public page | `plan-backlog` | member-profile.md | 05-12 | — | — | — | — |

Stage enum: `product` · `plan-backlog` · `plan-approved` · `reviewed` · `ticketed` · `building` · `eval` · `done` · `deferred`. The value is a date; a regression (F018's second review) shows as a second dated entry rather than an overwrite, so round-trips are visible.

**2. Make the ledger self-maintaining — each skill stamps its own row as its last workflow step.** `pipeline-plan` sets `plan-backlog`/`plan-approved`; `pipeline-review` writes the verdict + date; `pipeline-ticket` lists the T-numbers; `pipeline-build` flips to `building`/`done`; `pipeline-eval` records the run. The stamp *is* the handoff receipt — the thing H1 and H4 are missing. This is a ~3-line addition to each workflow, not new infrastructure.

**3. `pipeline-router` reads the ledger at session start** (it already reads JOURNAL + bundle) and surfaces: longest time-in-stage, any row whose artifacts disagree with its stage, anything in `deferred`.

**What this buys you, against your three asks:**

- *Track a concept* — one table, one glance, instead of six globs.
- *Find inefficiencies* — time-in-stage falls out of date deltas. A concept sitting in `reviewed` for three weeks is now visible. F018's double review would have been a flashing light.
- *Find broken handoffs* — a one-line consistency check: if a stage-N+1 artifact exists (a ticket) but the row never recorded stage N (review/approval), that is a firewall breach. The empty `scenarios/` folder versus a row claiming `plan-approved` is an instant, automatic mismatch.

**Substrate work needs its own lane.** The ~17 `Scenario: None` tickets (H2) are invisible to F-numbering entirely. Give substrate a parallel namespace in the same ledger (an `S-`series, or a `kind: substrate` column) so schema work is trackable too — and document that lane in `AGENTS.md` and `pipeline-ticket`.

---

## Part E — Recommendations, prioritized

### P0 — do before Phase 2 opens

**R1 — Add a session-start drift check to `pipeline-router`.** This is the keystone fix; it converts every hygiene finding above from "remember to do it" into "the router flags it on day one." A fixed checklist, run at session start:

- `scenarios/` empty while any open ticket references a scenario → H1
- broken doc links in `BUILD-LOG.md` / pipeline docs → E3
- `.claude/worktrees/` non-empty → E8
- `DEVIATIONS.md` over ~400 lines → E2
- `{pending}` commit hashes in `done/` tickets → H4
- retired skill directories present on disk → H6

Had R1 existed two weeks ago, F4/F8/F9/F11 would not have silently regressed.

**R2 — Resolve F018 and the empty `scenarios/`.** Either re-promote F018 with its REVISE punch list done, or formally retire it as the flagship example. Then either point `AGENTS.md` line 18 at a *current* trace or regenerate `F018-pipeline-trace.md` against live artifacts. The pipeline should not advertise a stale walkthrough as canonical.

**R3 — Document the substrate-ticket lane.** Add the no-scenario path to `AGENTS.md` and `pipeline-ticket/workflow.md`: substrate tickets open against a system spec + ADRs, carry `Scenario: substrate`, and state which spec section is their contract. This legalizes what 17 tickets already did.

### P1 — this cycle

**R4 — Stand up the trace ledger (Part D).** Create `planning/TRACE.md`, backfill F018 + F025, add the one stamp step to each pipeline skill workflow.

**R5 — Close the Build → Product loop.** Give "flagged for `pipeline-product`" a real home: a `planning/SPEC-PATCHES.md` queue, drained as a gate before each phase opens. Land the `item.md` state-enum fix now — do not wait on F018 (H3).

**R6 — Give `DEVIATIONS.md` a rotation policy.** Mirror JOURNAL: live file keeps the current phase, older entries rotate to `development/archive/DEVIATIONS-{phase}.md`.

**R7 — Fix `BUILD-LOG.md` properly.** Correct the bundle link, delete or fold the stale prose sections, and make "everything below the table" either auto-generated or deleted. Stale prose is worse than no prose.

**R8 — Finish the cleanups already in flight.** Delete the two retired skill directories (H6); `.gitignore` `.claude/worktrees/` and remove the shadow (E8); finish the ADR-10→ADR-7 retag (E6); complete the `planning/rebuild-plan.md` move at the Phase 1→2 boundary as JOURNAL item 10 already plans (E7); clear `web/evals/features/` (E4).

### P2 — opportunistic

**R9 — Assign cross-feature consistency an owner (H5).** Add a "sibling-scenario check" trigger to `pipeline-review` for any 2+ new scenarios in the same loop family — relevant the moment Phase 2 fans out.

**R10 — Shared sandbox test harness (E5).** One `web/scripts/sandbox-check.mjs` that takes a ticket's assertion set, instead of a new `tNNN-` file per ticket.

---

## What this audit is not

Not a critique of the pipeline's *design* — seven roles with real firewalls is the right shape, and the 2026-05-09 audit's structural recommendations were correct and held. Not a call for more agents or stages. The gap is **the return path**: the pipeline pushes work downstream well and has almost no machinery for pushing *truth* back upstream — confirming an artifact still holds, flagging that a doc rotted, recording that a concept moved. R1 (the drift check) and R4 (the trace ledger) are both that return path. Build those two and most of the rest stops recurring on its own.

---

## Verification note

Every concrete claim was checked against the filesystem on 2026-05-22: the empty `scenarios/`; `b1-mvp.md` absent; `{pending}` in T055–T057; retired skill directories present; the worktree's 15-vs-17 skill count; `DEVIATIONS.md` at 605 lines / 49 entries; the on-disk `CLAUDE.md` correctly using `pipeline-ratify-absolute`; F13's *why*-annotation present in the ticket/build/eval workflows; `web/evals/features/` holding 10 scrapped-scenario specs. The one briefing-vs-disk discrepancy (CLAUDE.md absolutes skills) was run down and is *not* a finding — see Method.

## Placement

Resolved: this audit lives at repo root as `pipeline-process-audit-2026-05-22.md` and is referenced from `CLAUDE.md`. Future pipeline audits follow the same convention — one dated file per audit at repo root (`pipeline-process-audit-YYYY-MM-DD.md`) — rather than appending to a single growing file. The 2026-05-09 audit is archived at `_attic/2026-05-19/planning/PIPELINE-AUDIT.md`; audit history is read by walking the dated files in order, not from one consolidated doc.
