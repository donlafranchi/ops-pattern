# ticket — workflow

## Step 0 — classify the work item. Do this before opening anything.

Open `PIPELINE.md`. Read the five-kind table. Name the row this work item is, and why, before a single `gh issue create`:

| It is a… | Title shape | Labels | Needs a scenario? |
|---|---|---|---|
| **Scenario** | `F### · T### · plain name` | `scenario` | yes — `status: approved` + a `HANDOFF.md` line |
| **Change** | `change · T### · plain name` | `change` | no |
| **Bug** | `bug · T### · plain name` | `bug` | no |
| **Chore** | `chore · T### · plain name` | `chore` | no |
| **Process** | not an Issue | — | a commit in `ops-pattern` + a `LESSONS.md` line |

Add `deferred` or `launch-blocking` when either is true, on any kind.

**The reclassification that actually happens:** a "Change" you can't write acceptance criteria for without inventing new user-facing behavior is a Scenario. **Stop. Route it to `plan`.** Do not open it as a Change and let the scenario get written backwards from the ticket.

**Never invent an F-number.** A chore/bug/change with no real scenario tie is titled by its kind, even when that means a `chore`-labeled Issue whose title starts `chore ·` and not `F###`. A fake F-number breaks `scripts/view.sh` — it reads F-numbers out of Issue titles to build README.md's Built/Building lists.

## Cheat sheet

| | |
|---|---|
| **Reads** | `PIPELINE.md`, `HANDOFF.md`, the approved scenario in `planning/` (`status: approved`), open Issues in `socialus-web` (`gh issue list`) |
| **Writes** | one GitHub Issue per ticket in `socialus-web` |
| **Does NOT read** | a `draft` scenario, code |
| **Hands to** | `build` |

## Workflow

1. Classify per Step 0.
2. Scenario work: confirm `status: approved` and a `HANDOFF.md` line. If it's `draft`, stop — route to `plan`.
3. Read the scenario. Identify each distinct unit of work — a migration, an endpoint, a component, a notification path — one Issue each, or group the small ones.
4. Check `gh issue list -R donlafranchi/socialus-web` so you don't duplicate open work.
5. For each unit, `gh issue create` with:
   - **Title:** per the Step 0 table. Next T-number = highest existing + 1.
   - **Body:** `Scenario: F###` (or `Scenario: none`), `Depends on:` other Issue numbers if any, and an acceptance-criteria checklist — file paths, table/column names, component names, route paths. The implementation contract, not a restatement of the Story.
   - Any ticket touching schema, RLS, or routes: a ≤20-line architecture note at the top of the body.
   - **Labels:** per the Step 0 table, plus `deferred` / `launch-blocking` when true.
6. Sequence dependencies via `Depends on:` — schema first, then API, then UI, then notifications.
7. If a scenario produces 5+ Issues, stop — it's too big. Escalate to `plan` to split it (fresh F-numbers, linked by `depends:`).

## Escalation

| Situation | Action |
|---|---|
| A "Change" needs acceptance checks | Stop. Route to `plan` as a Scenario. |
| Scenario is ambiguous | Flag to `plan` before opening Issues. |
| Scenario produces 5+ tickets | Stop. Escalate to `plan` to split it. |
| Schema change needed but no system spec covers it | Stop. Ask `plan` to extend `product/systems/{name}.md` first. |

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
