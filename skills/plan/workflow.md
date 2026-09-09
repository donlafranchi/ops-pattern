# plan — workflow

## Step 0 — classify the work item. Do this before anything else.

Open `PIPELINE.md`. Read the five-kind table. Say out loud which row this work item is, and why, before writing a line:

| It is a… | when | you do |
|---|---|---|
| **Scenario** | a person experiences new behavior; it needs acceptance checks | continue at step 1 |
| **Change** | UX/copy/layout tweak to existing behavior | hand to `ticket` — Issue only, no scenario |
| **Bug** | built behavior doesn't match its scenario or the code's intent | hand to `ticket` — Issue only |
| **Chore** | deps, config, deploy, tooling; nothing a member sees | hand to `ticket` — Issue only |
| **Process** | this repo's structure, skills, rules, lint | one commit here + a `LESSONS.md` line naming the dated failure |

**The reclassification that actually happens:** a "Change" you can't describe without acceptance checks is a Scenario. Reclassify it and continue here. Don't ticket it as a Change.

If it fits none of the five, don't force it — log the gap in `LESSONS.md` and pick the nearest path.

## The pass

1. Read `STATUS.md`, `ROADMAP.md`, `RULES.md`. Skim `planning/*.md` frontmatter (`status:`) for what's draft/approved/building.
2. Research-shaped session (a new problem, a system needing a spec): read the relevant `product/` files, update the spec — *why* only, never what the schema already says (`trim` holds that discipline). Speculative? A one-line `IMAGINE.md` entry instead, never a scenario.
3. Scoping-shaped session: write the scenario to the atomic shape below. Apply the 5 Deadly Sins filter (scope creep, gold plating, missing requirements, unrealistic timeline, poor communication) before Don sees it.
4. Decision needed from Don: state it A/B/C, one line of tradeoff each, a recommendation. Log per § DECISIONS.md below.
5. On approval, flip `status: approved`, fill the `approved:` line, add the one-line `HANDOFF.md` entry.
6. Update `STATUS.md` (overwrite, one screen) and `ROADMAP.md` (Now/Next/Later/Won't) if either changed. If you touched a scenario or `ROADMAP.md`, `sync` re-runs `scripts/view.sh` — never hand-edit `README.md`.
7. Run `scripts/lint.sh`. Clean before reporting.

## The atomic scenario shape

`planning/scenario-F###.md`, ≤40 lines, exactly three `##` sections — Story, Acceptance, Not this. Nothing else. `scripts/lint.sh` enforces the cap and the section names.

```
---
id: F###
title: <plain-words outcome>
status: draft | approved | building
date: YYYY-MM-DD
depends: [F###, ...]
approved: YYYY-MM-DD — <≤15-word note>    # only when status: approved
---
## Story
## Acceptance
## Not this
```

- **Story** — 5–8 lines. One person, one outcome. Name them. No system names, no table or route names, no UI mechanics.
- **Acceptance** — ≤5 checks, numbered. Each answerable yes/no by using the app, not by reading code.
- **Not this** — what this scenario deliberately doesn't do, and what a review ruled out.
- `approved:` appears only on an approved scenario. One line, ≤15 words.

## Splitting an oversized scenario

A real situation needing more than 40 lines or more than 5 acceptance checks is two-or-more scenarios, not one crowded one.

1. Cut along the outcome, not the layer — never "the schema one" and "the UI one."
2. Each split gets a **fresh F-number**. Don't reuse the original's.
3. Link them with `depends:` — the later one depends on the earlier.
4. The most-progressed split keeps the original's `status` (and its `approved:` line if it had one); the rest start at `draft`.
5. Delete the original file. Git holds it.

`ticket` escalates back here when a scenario produces 5+ Issues — that's the same signal, caught later.

## DECISIONS.md — `plan` owns this file

One dated line per ruling, newest first, append-only. **A reversal is a new line saying what it replaces — never an edit to an old one.** Two things to do every session:

**Log every new ratified decision.** Not just the launch-tier ones. Anything a scenario's review or a Don ruling settles that would otherwise get re-argued gets one dated line, in `## Product & platform` or `## Build & stack` as fits. A ruling that isn't a line doesn't exist (rule 6).

**Keep `## Open — Don rules` answerable.** Every entry there ends in A/B/C options with a one-line tradeoff each and, where you have one, a recommendation. A bare open question with no framing is not an entry — frame it or drop it. When a new ruling resolves one, move it out of Open into the dated list above, noting what it replaces if it contradicts an older line.

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
