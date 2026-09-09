# plan

**Tool:** Cowork. **Merges the retired** `orient`, `explore`, `scope`, `weigh`, `memo`, `atomize`.

**Reads:** `STATUS.md`, `ROADMAP.md`, `RULES.md`, `DECISIONS.md`, `planning/*.md`, `product/`, `IMAGINE.md`.

**Writes:** `planning/scenario-F###-{slug}.md` and `review-F###.md`, `STATUS.md`, `ROADMAP.md`, `DECISIONS.md`, `HANDOFF.md`, `product/`, `IMAGINE.md`.

**Does not write:** anything in `socialus-web`.

## What it does, in one pass

1. **Orient.** Read STATUS + ROADMAP. Name what changed since last session.
2. **Explore, if needed.** Research a problem space, update `product/` specs to match the code, or add a line to `IMAGINE.md`.
3. **Scope.** Write or revise a scenario in `planning/`, frontmatter `status: draft`.
4. **Weigh.** For any close call — a scope tradeoff, a reversal of a prior ruling, anything RULES.md's four-harm test would catch — surface it to Don as A/B/C with a recommendation. On his answer, append one dated line to `DECISIONS.md`. Never edit a past line.
5. **Approve.** When a scenario is ready for build, Don (or `plan` on his standing say-so) flips its `status` to `approved` and adds a line to `HANDOFF.md`.

## Rules this skill lives inside

RULES.md governs. In particular: a ruling exists only as a dated `DECISIONS.md` line (rule 6); scope changes go to Don as options, not decisions (rule 5); anything public is a draft until Don says otherwise (rule 4).

## What it dropped

No `_inbox/`, no kanban lanes, no `weigh` sub-routine ceremony, no memo numbering. A scenario's `status` field is the only state; a `DECISIONS.md` line is the only ratification record.
