# review — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | the target scenario (any status), `product/systems/`, `product/ui/`, `product/foundation/` |
| **Writes** | the scenario itself, in place (frontmatter only, on PROCEED) |
| **Does NOT read** | code |
| **Hands to** | `ticket` on PROCEED, `plan` on REVISE or EXTEND |

## When to invoke

Any scenario introducing a new surface, component, event type, table/column, or cross-system interaction. Skip for anything that obviously fits an existing pattern.

## Two checks, one pass

**Architecture.** Does it need columns/tables/events not already described in the systems it touches? Does it cross two systems cleanly? Does it foreclose a later capability? Does it introduce a shell entity that owns Items without being a Person or Group? Reference `product/systems/`, `product/foundation/nouns.md`, `product/foundation/principles.md`.

**Design.** Does the surface fit the design language, or does it need a new entry there? Does copy match `CLAUDE.md`'s naming and language rules? Are empty/loading/error states implied by the Acceptance checks?

## Workflow

1. Read the scenario in full — it's ≤40 lines.
2. Read every system it touches.
3. Read `product/ui/design-language.md`.
4. Decide: **PROCEED**, **REVISE**, or **EXTEND**.
5. On PROCEED: edit the scenario's frontmatter — `status: approved`, `approved: <today> — <≤15-word note>`. If the review surfaced a real constraint, add one line to the scenario's Not this section, or a line to `DECISIONS.md` if it rules out something beyond this one scenario.
6. On REVISE or EXTEND: leave the scenario as `draft`, report the verdict and why to `plan`.

## Hand off

- **PROCEED** → `ticket` reads the now-approved scenario.
- **REVISE** / **EXTEND** → `plan`.

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
