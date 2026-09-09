# ticket — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `HANDOFF.md`, the approved scenario in `planning/` (`status: approved`), open Issues in `socialus-web` (`gh issue list`) |
| **Writes** | one GitHub Issue per ticket in `socialus-web`, labeled `approved` |
| **Does NOT read** | a `draft` scenario, code |
| **Hands to** | `build` |

## Workflow

1. Confirm the scenario has `status: approved` and a line in `HANDOFF.md`. If not, stop — route to `plan`.
2. Read the scenario. Identify each distinct unit of work — a migration, an endpoint, a component, a notification path — and map to one Issue each, or group small ones.
3. Check `gh issue list -R donlafranchi/socialus-web` so you don't duplicate open work.
4. For each unit, `gh issue create` with:
   - Title: `T{NNN}: {short title}` (next number = highest existing T-number + 1).
   - Body: `Scenario:` the F-number and one line, `Depends on:` other Issue numbers if any, an acceptance-criteria checklist (file paths, table/column names, component names, route paths — the implementation contract, not a restatement of the Given/When/Then).
   - Any ticket touching schema, RLS, or routes: a ≤20-line architecture note at the top of the body.
   - Label: `approved`.
5. Sequence dependencies via `Depends on:` — schema first, then API, then UI, then notifications.
6. If a scenario produces 5+ Issues, stop — it's too big. Escalate to `plan` to split the scenario.
7. If the scenario is `draft`, do not ticket it — route to `plan` for approval first.

## Escalation

| Situation | Action |
|---|---|
| Scenario is ambiguous | Comment on the scenario file's git blame / flag to `plan` before opening Issues. |
| Scenario produces 5+ tickets | Stop. Escalate to `plan` to split it. |
| Schema change needed but no system spec covers it | Stop. Ask `plan` to extend `product/systems/{name}.md` first. |

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
