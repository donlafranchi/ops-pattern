# review — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | the target scenario (any status), `product/systems/`, `product/ui/`, `product/foundation/` |
| **Writes** | the scenario itself, in place (frontmatter, and its Not this line); `DECISIONS.md` for a ruling that outlives this scenario |
| **Does NOT read** | code |
| **Does NOT write** | a review file — there is no such file |
| **Hands to** | `ticket` on PROCEED, `plan` on REVISE / EXTEND / SPLIT |

## When to invoke

Any scenario introducing a new surface, component, event type, table/column, or cross-system interaction. Skip for anything that obviously fits an existing pattern.

## Three checks, one pass

**Shape.** Is it the atomic form? ≤40 lines, exactly three `##` sections (Story, Acceptance, Not this), frontmatter `id / title / status / date / depends`. Story 5–8 lines, one person, one outcome, no system names. Acceptance ≤5 checks, each answerable yes/no by using the app. If the real situation can't fit that, the verdict is **SPLIT**, not a longer file.

**Architecture.** Does it need columns/tables/events not already described in the systems it touches? Does it cross two systems cleanly? Does it foreclose a later capability? Does it introduce a shell entity that owns Items without being a Person or Group? Reference `product/systems/`, `product/foundation/nouns.md`, `product/foundation/principles.md`.

**Design.** Does the surface fit the design language, or does it need a new entry there? Does copy match `CLAUDE.md`'s naming and language rules? Are empty/loading/error states implied by the Acceptance checks?

## Workflow

1. Read the scenario in full — it's ≤40 lines.
2. Read every system it touches.
3. Read `product/ui/design-language.md`.
4. Decide: **PROCEED**, **REVISE**, **EXTEND**, or **SPLIT**.
5. On PROCEED: edit the scenario's frontmatter — `status: approved`, `approved: <today> — <≤15-word note>`. If the review surfaced a real constraint, put it in the scenario's own Not this section; if it rules out something beyond this one scenario, it's a dated `DECISIONS.md` line instead. Never both, never a review doc.
6. On REVISE or EXTEND: leave the scenario `draft`, report the verdict and why to `plan`.
7. On SPLIT: leave the scenario `draft`, report to `plan` with the cut line you'd take — split along the outcome, never along the layer. `plan` does the split (fresh F-numbers, `depends:` link, most-progressed split keeps the status).
8. Run `scripts/lint.sh` before reporting — it catches a line-cap or section-name violation you introduced.

## The rule that used to be a file

There is no `review-F###.md`. A review that produced no change to the scenario, no Not-this line, and no `DECISIONS.md` line produced nothing worth keeping — report the verdict and move on. Anything durable it surfaced belongs in one of those three places, where the next reader will actually meet it.

## Hand off

- **PROCEED** → `ticket` reads the now-approved scenario.
- **REVISE** / **EXTEND** / **SPLIT** → `plan`.

## Final report

    Status: Done | Blocked | Question — <one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."
