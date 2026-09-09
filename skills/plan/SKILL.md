# plan

**Tool:** Cowork. **Merges the retired** `orient`, `explore`, `scope`, `weigh`, `memo`, `atomize`.

**Reads:** `PIPELINE.md`, `STATUS.md`, `ROADMAP.md`, `RULES.md`, `DECISIONS.md`, `planning/*.md`, `product/`, `IMAGINE.md`.

**Writes:** `planning/scenario-F###.md` (≤40 lines: Story, Acceptance, Not this), `STATUS.md`, `ROADMAP.md`, `DECISIONS.md`, `HANDOFF.md`, `product/`, `IMAGINE.md`.

**Does not write:** anything in `socialus-web`. Never `README.md` — it is generated.

## What it does, in one pass

0. **Classify.** Read `PIPELINE.md`'s table and name which of the five kinds this is — before writing anything. Change/Bug/Chore leave here as Issues via `ticket`. A "Change" that needs acceptance checks to describe is a Scenario; keep it. See `workflow.md` § Step 0.
1. **Orient.** Read STATUS + ROADMAP. Name what changed since last session.
2. **Explore, if needed.** Research a problem space, update a `product/` spec to the *why* it holds, or add a line to `IMAGINE.md`.
3. **Scope.** Write `planning/scenario-F###.md` to the atomic shape: `status: draft`, ≤40 lines, three sections, Story 5–8 lines about one person, Acceptance ≤5 yes/no checks. Too big for that? Split it — fresh F-numbers, linked by `depends:`.
4. **Weigh.** For any close call — a scope tradeoff, a reversal, anything RULES.md's four-harm test catches — surface it to Don as A/B/C with a recommendation.
5. **Decide and log.** Every ratified ruling becomes one dated `DECISIONS.md` line, newest first, append-only. A reversal is a new line naming what it replaces. Resolved open questions move out of `## Open — Don rules`; the ones left there each carry A/B/C and a tradeoff.
6. **Approve.** When a scenario is ready for build, Don (or `plan` on his standing say-so) sets `status: approved`, fills `approved: <date> — <≤15-word note>`, and adds a `HANDOFF.md` line.

## Rules this skill lives inside

RULES.md governs. In particular: a ruling exists only as a dated `DECISIONS.md` line (rule 6); scope changes go to Don as options, not decisions (rule 5); anything public is a draft until Don says otherwise (rule 4).

## Related skills

- `review` — pre-flight on a draft scenario; approves it in place, no review file.
- `ticket` — takes Change/Bug/Chore straight to Issues, and approved scenarios to tickets.
- `trim` — the product-doc why-only sweep; `plan` writes `product/` to that standard as it goes.

## What it dropped

No `_inbox/`, no kanban lanes, no `weigh` sub-routine ceremony, no memo numbering. A scenario's `status` field is the only state; a `DECISIONS.md` line is the only ratification record.
