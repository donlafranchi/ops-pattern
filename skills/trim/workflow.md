# trim — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `product/**`, `socialus-web` code (read-only, to check whether a claim is already answered there), `DECISIONS.md` |
| **Writes** | `product/**`, one-line `IMAGINE.md` entries |
| **Does NOT write** | `socialus-web`, scenarios, Issues, `DECISIONS.md` |
| **Pauses** | before any deletion in `product/systems/` |

## Line budgets — a signal, not a quota

Checked on a sweep. Over budget means *look*, not *cut to fit*. Under budget is not a target to pad toward.

| Path | Budget | Why that number |
|---|---|---|
| `product/foundation/*.md` | 80–120 lines | Invariants and refusals. Longer usually means examples that repeat the rule. |
| `product/needs/*.md` | 80–120 lines | Journeys and use cases. Longer usually means UI mechanics that belong in a scenario. |
| `product/systems/*.md` | wherever the genuine invariant content runs out | Typically 25–90, depending on how much of the file was *why* versus schema. No number to hit. |
| `product/ui/design-language.md` | tokens-as-source-of-truth + the *why* behind component rules | A full component spec is code's job. |
| `product/ui/surfaces.md` | **kept whole** | Already screen-shaped, not schema-shaped. Not a trim target. |

## Workflow

1. **Measure.** `wc -l product/*/*.md | sort -n`. Note what's over budget — that's where to read, not what to cut.
2. **Read each candidate against the test.** Would a competent engineer reading `socialus-web` already know this paragraph? Mark it cut. Grep the code when you're unsure; don't guess.
3. **Rescue the speculative.** Anything genuinely speculative found on the way — a whole doc, or a section — gets **one line in `IMAGINE.md`** before it's deleted. One line per idea, no more. It's not a commitment and a scenario may not cite it.
4. **Rescue the ratified.** A cut paragraph that turns out to be a real ruling with no `DECISIONS.md` line isn't a cut — hand it to `plan` to log, then cut it.
5. **Pause on `product/systems/`.** Before running those deletions, list per file what stays and what goes — **≤3 lines per file** — and get a yes/no. Same pause `plan` takes before a scope change.

   ```
   product/systems/groups.md — stays: the member/follower same-row invariant, the no-auto-assignment refusal
                               goes: the groups/group_members column list, the RLS policy walkthrough
   ```

   These files hold the densest ratified reasoning in the repo. **Do not skip this because it is now a named step rather than an improvised one.** Trim `product/foundation`, `product/needs`, and `product/ui` without the pause.
6. **Cut.** Delete whole sections rather than tightening sentences — half a schema description is worse than none.
7. **Check the links.** A deleted section may have been someone's anchor. Run `scripts/lint.sh`; it catches dead links from root docs and `planning/`.
8. **Commit** as `docs: …` naming what was trimmed.

## Escalation

| Situation | Action |
|---|---|
| A cut paragraph is a ruling with no `DECISIONS.md` line | Hand to `plan` to log it first. |
| The doc contradicts the code | Not a trim. The doc is wrong — fix it, same session (`CLAUDE.md`). |
| A whole system doc looks speculative | One `IMAGINE.md` line, then the pause, then delete. Never delete it unasked. |

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
