# review — workflow

## Cheat sheet

| | |
|---|---|
| **Reads** | `planning/next/scenario-F{NNN}-{slug}.md` or `planning/now/scenario-F{NNN}-{slug}.md` (approved), `product/systems/`, `product/ui/`, `product/foundation/`, `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`, `planning/now/bundle-{N}.md` (active bundle) |
| **Writes** | `review-F{NNN}.md` in the scenario's lane (`planning/next/` or `planning/now/`) |
| **Templates** | `templates/review.md` |
| **Does NOT read** | `web/` (code), `development/tickets/`, `planning/backlog/` |
| **Hands to** | `ticket` on PROCEED, `scope` on REVISE, `explore` on EXTEND |

## When to invoke

Optional but recommended for scenarios that introduce any of the following:

- A **new surface** (a route or page that doesn't exist yet).
- A **new component** that isn't in the existing UI inventory.
- A **new event type** in the event log.
- A **new table** or new column on an existing table.
- A **cross-system interaction** that touches more than one `product/systems/{name}.md` doc.
- A **new pattern** the design language doesn't yet describe (modal, sheet, picker, drawer, etc.).

If none of the above apply, skip review and go straight to `ticket`.

## Two checks, one document

The review covers two checks. Both run; one document captures both verdicts plus a combined recommendation.

### Architecture check

For each system the scenario touches:

1. **Schema fit.** Does the scenario require columns / tables / event types not in the system's "Data model implications" section? List them. If yes → flag for `explore` to extend the system.
2. **Existing capability fit.** Does the scenario align with how this system is used by other capabilities? If it introduces a new mode of use, flag it.
3. **Cross-system consistency.** If the scenario crosses two systems (e.g., Item + Location + Community), check that each system's spec already accounts for the interaction. Flag any system that doesn't.
4. **Forward-looking concerns.** Will this scenario make a future tier (T2, T3) of the system harder? E.g., "this T1 design makes the T3 federated handoff impossible" — flag for `explore`.
5. **Loop fidelity.** Quote the relevant loop's stated pain point from `product/needs/member-journey.md` and write one sentence explaining how this scenario advances it. If the loop named in the scenario does not match the scenario's actual mechanic (e.g. tagged Loop 4 but actually serves engagement-driven retention), flag REVISE.
6. **Shell-entity check.** Does any column, relationship, or user-facing label introduce an entity that owns Items without being a Person or a Community? Vocabulary to flag: "vendor," "business," "merchant," "establishment," "operator." If any column reads as `*_id` pointing to a non-Person/Community entity holding Items, flag EXTEND. People-first compliance is structural, not aspirational.
7. **Policy posture present.** If the scenario touches data sharing, monetary flow, agent permissions, or visibility (Member→Member, Member→third-party, Member→platform), the relevant `product/systems/{name}.md` MUST have a "Policy posture" section with the three-filter analysis written out per ADR-9. If absent, verdict is EXTEND — back to `explore` to write it before tickets open. Default-on data sharing or unanalyzed opt-ins are auto-EXTEND.

Reference: `product/systems/`, `product/foundation/primitives.md`, `product/foundation/principles.md`, `product/needs/member-journey.md`, `product/foundation/policy.md`, `playbooks/PLATFORM-PATTERNS.md`, `playbooks/DEVELOPMENT-PATTERNS.md`.

### Design check

For each surface the scenario names:

1. **Surface exists?** Does the surface (venue page, Maker page, Item page) already exist in the UI inventory? If new, the design language doc needs an entry.
2. **Components exist?** For every interaction in the scenario (CTA, composer, list row, modal), is the component in `product/ui/design-language.md`? List components needed.
3. **CTA placement consistency.** Does the CTA (button label, position, prominence) match the established pattern for this surface? Quote the design language section that establishes the pattern; flag any deviation.
4. **Tone & copy.** Does the user-facing copy match the project's voice and the language guidance in the root `CLAUDE.md`?
5. **Empty / loading / error states.** Does the scenario describe these? Are they consistent with patterns elsewhere?

Reference: `product/ui/design-language.md`, root `CLAUDE.md` "Language & Framing" section.

### Sibling-scenario consistency check (audit R9)

Fulfills `pipeline-process-audit-2026-05-22.md` **R9** — closes the H5 gap (cross-feature consistency had no owner; F018's `<GatheringComposer>` and F019's `<DropComposer>` were called out as the canonical case nobody was checking).

**Trigger.** Run this check whenever the scenario under review is **the 2nd-or-later sibling** in the same loop family (per `product/needs/member-journey.md`) approved within the current bundle phase, OR introduces a composer / list row / detail surface that has a structurally analogous counterpart in another approved scenario.

**Reads.** Every other approved scenario in `planning/next/` and `planning/now/` plus any other `review-F{NNN}.md` in those lanes from this phase.

**What to check.**

1. **Shared base components.** If this scenario introduces `<XComposer>` / `<XListRow>` / `<XDetail>` and a sibling already introduces `<YComposer>` / `<YListRow>` / `<YDetail>` for an analogous Item kind, name the shared base (`<KindComposer>`, `<ItemListRow>`) the ticket writer should extract. Flag if the two surfaces would diverge on copy, layout, or interaction without justification.
2. **Vocabulary alignment.** Confirm both scenarios use the same UI label for the same database entity per the root `CLAUDE.md` naming-conventions table (Event/Product/Service/Idea/Offer/Ask/Initiative). Flag any scenario calling the same kind two different things.
3. **Loop-shape alignment.** If both serve the same loop, confirm they don't fork its mechanic (one optimizes for friction-down, the other for stake-up — surface the tradeoff to the PM).
4. **Empty / loading / error state consistency.** If sibling defines a pattern, this scenario should match or explicitly justify divergence.

**Output.** A bordered "Sibling-consistency findings" section in the review document, listing each sibling F-number checked and any divergence flagged. Verdict integrates with the overall PROCEED/REVISE/EXTEND. Divergence that requires extracting a shared base is **PROCEED-with-extract-note** — the ticket writer extracts the base in the first ticket touching either composer.

If no sibling exists yet, write one line: "First in family — no sibling check applicable."

## Workflow

1. Read the approved scenario at `planning/next/scenario-F{NNN}-{slug}.md` (or `planning/now/scenario-F{NNN}-{slug}.md`).
2. Read every system the scenario references.
3. Read `product/ui/design-language.md`.
4. Run the architecture check; capture findings in the review template.
5. Run the design check; capture findings in the review template.
6. Write the verdict (PROCEED / REVISE / EXTEND) and the recommended next skill.
7. Save to `review-F{NNN}.md` in the scenario's lane (`planning/next/` or `planning/now/`).
8. Update `JOURNAL.md` with a one-line entry: "Reviewed F### — verdict: {PROCEED / REVISE / EXTEND}; see review."
9. **STAGE-LEDGER stamp.** Append (or update) the F-number's row in `planning/STAGE-LEDGER.md` Reviewed column: `{VERDICT} YYYY-MM-DD`. A second review appends, does not overwrite, so two-cycle reviews like F018 are visible.

## Verdict semantics

- **PROCEED** — the scenario fits existing systems and design. Ticket writing can begin. Note any minor recommendations the ticket writer should consider.
- **REVISE** — the scenario has internal inconsistency or a soft conflict with the design language. The scenario itself needs revision; the underlying systems are fine.
- **EXTEND** — the scenario is sound but requires a new schema column, new component, new event type, or a new design-language pattern. A `product/systems/{name}.md` or `product/ui/design-language.md` doc must be extended before ticket writing.

A scenario can have a partial verdict (PROCEED on architecture, REVISE on design — or vice versa). Document both; use the more severe of the two as the overall verdict.

## Hand off

- **PROCEED** → tell `ticket` to start. The ticket writer reads both the scenario AND your review.
- **REVISE** → escalate to `scope`. Plan revises; cycle returns here.
- **EXTEND** → escalate to `explore`. Product extends; plan re-confirms; cycle returns here.

Never block silently. Always produce the review document with a clear verdict, even if the verdict is PROCEED with no findings.

## Final report

Default report shape is three lines:

    Status: Done | Blocked | Question — <plain-English one-sentence summary>
    Next: <ask, or "none">
    Want detail? Say "expand."

Drop running narration ("Now doing X." "Starting Y." "Committing Z."). Name items in plain English; put the ID in parens if it matters. Withhold commit hashes, file lists, lane counts, per-step trace until the PM says "expand." On "expand," return detail in priority order — ask → high-level outcomes → references → notes — stopping at each section for "more."
