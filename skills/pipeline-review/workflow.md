# pipeline-review — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `planning/scenarios/F{NNN}-{slug}.md` (approved), `product/systems/`, `product/ui/`, `product/foundation/`, `planning/DECISIONS.md`, `planning/bundles/{active}.md` |
| **Writes** | `planning/history/F{NNN}-review.md` |
| **Templates** | `templates/review.md` |
| **Does NOT read** | `web/` (code), `development/tickets/`, `planning/scenarios-backlog/` |
| **Hands to** | `pipeline-ticket` on PROCEED, `pipeline-plan` on REVISE, `pipeline-product` on EXTEND |

## When to invoke

Optional but recommended for scenarios that introduce any of the following:

- A **new surface** (a route or page that doesn't exist yet).
- A **new component** that isn't in the existing UI inventory.
- A **new event type** in the event log.
- A **new table** or new column on an existing table.
- A **cross-system interaction** that touches more than one `product/systems/{name}.md` doc.
- A **new pattern** the design language doesn't yet describe (modal, sheet, picker, drawer, etc.).

If none of the above apply, skip review and go straight to `pipeline-ticket`.

## Two checks, one document

The review covers two checks. Both run; one document captures both verdicts plus a combined recommendation.

### Architecture check

For each system the scenario touches:

1. **Schema fit.** Does the scenario require columns / tables / event types not in the system's "Data model implications" section? List them. If yes → flag for `pipeline-product` to extend the system.
2. **Existing capability fit.** Does the scenario align with how this system is used by other capabilities? If it introduces a new mode of use, flag it.
3. **Cross-system consistency.** If the scenario crosses two systems (e.g., Item + Location + Community), check that each system's spec already accounts for the interaction. Flag any system that doesn't.
4. **Forward-looking concerns.** Will this scenario make a future tier (T2, T3) of the system harder? E.g., "this T1 design makes the T3 federated handoff impossible" — flag for `pipeline-product`.
5. **Loop fidelity.** Quote the relevant loop's stated pain point from `product/foundation/loops.md` and write one sentence explaining how this scenario advances it. If the loop named in the scenario does not match the scenario's actual mechanic (e.g. tagged Loop 4 but actually serves engagement-driven retention), flag REVISE.
6. **Shell-entity check.** Does any column, relationship, or user-facing label introduce an entity that owns Items without being a Person or a Community? Vocabulary to flag: "vendor," "business," "merchant," "establishment," "operator." If any column reads as `*_id` pointing to a non-Person/Community entity holding Items, flag EXTEND. People-first compliance is structural, not aspirational.
7. **Policy posture present.** If the scenario touches data sharing, monetary flow, agent permissions, or visibility (Member→Member, Member→third-party, Member→platform), the relevant `product/systems/{name}.md` MUST have a "Policy posture" section with the three-filter analysis written out per ADR-9. If absent, verdict is EXTEND — back to `pipeline-product` to write it before tickets open. Default-on data sharing or unanalyzed opt-ins are auto-EXTEND.

Reference: `product/systems/`, `product/foundation/primitives.md`, `product/foundation/principles.md`, `product/foundation/loops.md`, `product/foundation/policy.md`, `planning/DECISIONS.md`.

### Design check

For each surface the scenario names:

1. **Surface exists?** Does the surface (venue page, Maker page, Item page) already exist in the UI inventory? If new, the design language doc needs an entry.
2. **Components exist?** For every interaction in the scenario (CTA, composer, list row, modal), is the component in `product/ui/design-language.md`? List components needed.
3. **CTA placement consistency.** Does the CTA (button label, position, prominence) match the established pattern for this surface? Quote the design language section that establishes the pattern; flag any deviation.
4. **Tone & copy.** Does the user-facing copy match the project's voice and the language guidance in the root `CLAUDE.md`?
5. **Empty / loading / error states.** Does the scenario describe these? Are they consistent with patterns elsewhere?

Reference: `product/ui/design-language.md`, root `CLAUDE.md` "Language & Framing" section.

## Workflow

1. Read the approved scenario at `planning/scenarios/F{NNN}-{slug}.md`.
2. Read every system the scenario references.
3. Read `product/ui/design-language.md`.
4. Run the architecture check; capture findings in the review template.
5. Run the design check; capture findings in the review template.
6. Write the verdict (PROCEED / REVISE / EXTEND) and the recommended next skill.
7. Save to `planning/history/F{NNN}-review.md`.
8. Update `JOURNAL.md` with a one-line entry: "Reviewed F### — verdict: {PROCEED / REVISE / EXTEND}; see review."

## Verdict semantics

- **PROCEED** — the scenario fits existing systems and design. Ticket writing can begin. Note any minor recommendations the ticket writer should consider.
- **REVISE** — the scenario has internal inconsistency or a soft conflict with the design language. The scenario itself needs revision; the underlying systems are fine.
- **EXTEND** — the scenario is sound but requires a new schema column, new component, new event type, or a new design-language pattern. A `product/systems/{name}.md` or `product/ui/design-language.md` doc must be extended before ticket writing.

A scenario can have a partial verdict (PROCEED on architecture, REVISE on design — or vice versa). Document both; use the more severe of the two as the overall verdict.

## Hand off

- **PROCEED** → tell `pipeline-ticket` to start. The ticket writer reads both the scenario AND your review.
- **REVISE** → escalate to `pipeline-plan`. Plan revises; cycle returns here.
- **EXTEND** → escalate to `pipeline-product`. Product extends; plan re-confirms; cycle returns here.

Never block silently. Always produce the review document with a clear verdict, even if the verdict is PROCEED with no findings.
