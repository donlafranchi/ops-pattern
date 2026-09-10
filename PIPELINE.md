# Pipeline — how work moves

Five kinds of work. Each has its own path; only one goes through design. Everything that isn't listed here is one of these five, or it's a decision (`DECISIONS.md`).

| Kind | What it is | Opened by | Approval | Tracked as |
|---|---|---|---|---|
| **Scenario** | New feature or behavior a person experiences | Cowork, from IMAGINE or Don | Cowork approves the scenario; Don rules only on scope or a contested call | `planning/scenario-*.md` → Issues labeled `scenario` |
| **Change** | UX/UI polish, copy, layout, a small tweak to existing behavior | Anyone | User-facing copy: Don (rule 4). Otherwise none | Issue labeled `change` |
| **Bug** | Something built doesn't do what its scenario or the code intends | Anyone | None. `launch-blocking` label if it is | Issue labeled `bug` |
| **Process** | A change to this repo's structure, rules, or lint — or to a skill in `~/Projects/skills` | Cowork, Code or Don | Must name the failure with a dated example (`LESSONS.md`) | A PR in the repo that owns the file + a line in `LESSONS.md`. Cowork merges |
| **Chore** | Dependencies, config, deploy, tooling — nothing a member sees | Code | None unless it touches production (rule 3) | Issue labeled `chore` |

## Paths

- **Scenario:** `IMAGINE.md` → `planning/scenario-*.md` (draft) → Cowork review flips it to approved → `HANDOFF.md` → Code writes the architecture note in an Issue and builds → all acceptance checks closed → `sync` deletes the scenario.
- **Change / Bug / Chore:** Issue → Code builds → PR closes it. No scenario, no handoff, no review file. Don sees a preview link, not a document.
- **Process:** name the failure, make the change on a branch, open the PR, log it. Cowork merges. Small fixes any time. A reorganisation of the tree is rare, in one session, with a git tag first.

## Rules of the road (guidelines)

- Anyone may open an Issue in `socialus-web`, including Cowork via Dispatch. Only Code commits code there.
- A scenario is ≤40 lines with three sections: Story, Acceptance, Not this. If it needs more, it's two scenarios.
- If a Change starts needing acceptance checks, it's a Scenario. If a Bug fix changes what a scenario promises, it's a Change to the scenario first.
- Launch-blocking work displaces everything else. When a new launch-blocker lands, `sync` names what moved to Next.
- When something arrives that fits none of the five, don't force it — log it in `LESSONS.md` as a gap and pick the nearest path for now.

## Verified or not

A claim that something works is worth what the check behind it was worth. So say which check ran.

- **Every PR states how it was verified**, in one line: `live DB`, `local Postgres`, `unit tests only`, or `not verified`. Security and migration work must say it; everything else should.
- **Unverified work opens as a draft PR**, with the missing check named at the top of the body and what would clear it. Ready-for-review means the check ran.
- "Tests pass" from a laptop is `unit tests only` until CI says otherwise. There is no test workflow yet — see `LESSONS.md` 19.

## Accepted risk

A lint finding ruled acceptable gets recorded once and stops being re-argued. The ruling is the dated line in `DECISIONS.md`; `accepted-risks.json` is the machine-readable index that lets an advisor run be diffed against it — `scripts/advisor-diff.sh` takes an advisor JSON export and prints only what isn't already ruled on.

- An entry needs a `decision` (the `DECISIONS.md` date it points at), a `revisit_if` (the observable condition that reopens it), and a `review_by` date.
- `revisit_if` is a fact about the world, not a feeling — "the view's WHERE clause changes", not "if we get worried".
- A past `review_by` is reported by the diff script on every run. An entry nobody will re-argue is deleted, not renewed silently; renewing it is a new dated line.
- This is the one register the repo keeps, and it earns it by being diffed rather than read (`CLAUDE.md` § Naming, lesson 2).
