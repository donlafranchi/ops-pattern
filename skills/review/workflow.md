# review — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | the approved scenario in `planning/` (`status: approved` or `building`), `product/systems/`, `product/ui/`, `product/foundation/` |
| **Writes** | `review-F{NNN}.md` in `planning/`, alongside the scenario |
| **Does NOT read** | code, a `draft` scenario |
| **Hands to** | `ticket` on PROCEED, `plan` on REVISE or EXTEND |

## When to invoke

Any scenario introducing a new surface, component, event type, table/column, or cross-system interaction. Skip for a copy/CTA edit on an existing surface — go straight to `ticket`, and say the skip was taken and why.

## Two checks, one document

**Architecture.** For each system touched: does it need columns/tables/events not in that system's "Data model implications"? Does it cross two systems cleanly? Does it foreclose a later tier? Does it introduce a shell entity that owns Items without being a Person or Group? Reference `product/systems/`, `product/foundation/nouns.md`, `product/foundation/principles.md`.

**Design.** Does the surface exist in the design language doc, or does it need a new entry? Are the components already named there? Does copy match `CLAUDE.md`'s language guidance? Are empty/loading/error states specified?

## Workflow

1. Confirm the scenario has `status: approved` or `building`. If `draft`, stop — not yet `plan`'s call to review.
2. Read the scenario and every system it references.
3. Read `product/ui/design-language.md`.
4. Run both checks; capture findings.
5. Write the verdict — **PROCEED**, **REVISE** (back to `plan`), or **EXTEND** (`plan` grows the spec first) — into `review-F{NNN}.md`, saved alongside the scenario in `planning/`.

A scenario can get a partial verdict (PROCEED on architecture, REVISE on design). Use the more severe as the overall verdict.

## Hand off

- **PROCEED** → `ticket` reads the scenario and this review together.
- **REVISE** / **EXTEND** → `plan`.

Never block silently — always produce the document, even a PROCEED with no findings.

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
