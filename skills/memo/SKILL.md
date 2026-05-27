---
name: pipeline-adr
description: Walks the PM through writing, ratifying, or superseding an ADR following the project's `planning/adrs/` conventions. Use when the user says "write an ADR for X", "record this decision", "ratify ADR-N", "supersede ADR-M", "what's the next ADR number", or after a `pipeline-product` / `pipeline-plan` / `pipeline-review` session surfaces a load-bearing decision that needs canonical documentation. Allocates the next ADR number, drafts from the template, runs `pipeline-intent-check` on the draft, lands the pointer line in `DECISIONS.md`, and updates spec/foundation cross-references where applicable. Reads `planning/adrs/`, `planning/adrs/README.md`, `planning/DECISIONS.md`, and the spec/foundation files the ADR will touch. Writes one new file under `planning/adrs/` and one updated line in `DECISIONS.md`. Refuses to write code or implementation tickets — that's `pipeline-ticket` / `pipeline-build`.
---

# pipeline-adr

Project-resident skill for writing, ratifying, and superseding Architectural Decision Records. The single canonical workflow for landing an ADR in the project's `planning/adrs/` directory.

The point of this skill: ADR creation is currently informal — read DECISIONS.md, infer the format, decide which of three homes the decision belongs in, pick a number, hope you got it right. This skill collapses those steps into one path with zero per-ADR judgment calls. Consistency stops being a discipline problem and becomes a structural property.

## When to use

- User says "write an ADR for X" / "record this decision as an ADR" / "I need an ADR for Y."
- User says "ratify ADR-N" — flip an existing ADR from Proposed → Accepted.
- User says "supersede ADR-M with a new decision."
- User says "what's the next ADR number" — read `planning/DECISIONS.md` pointer index and return.
- After `pipeline-product` writes or extends a system spec that introduces a load-bearing architectural decision (especially when the decision touches multiple specs or creates a forbearance).
- After `pipeline-review` flags a scenario whose verdict introduces a new schema, event type, capability, or absolute that should be ratified before the scenario enters ticket writing (rebuild-phase rule #2).
- Before any merge to main that introduces a Category-1–8 statement requiring `Intent:` annotation (rebuild-phase rule #9).
- After `pipeline-prune` surfaces an invariant that has matured beyond an inline note and deserves a formal ADR.

## When NOT to use

- For *implementation* decisions inside a single ticket — those live in the ticket itself or in `development/DEVIATIONS.md`.
- For scenario acceptance criteria — those are `pipeline-plan`'s output.
- For UI microcopy or design-language extensions — those go directly into `product/ui/design-language.md` per `design-system` (Cowork plugin skill).
- To *retroactively* write ADRs for decisions that are already encoded in spec banners and need no further surface area (the spec banner is sufficient until the decision is referenced cross-cuttingly).

## Constraints (hard)

- Allocate the next free ADR number from `planning/DECISIONS.md` pointer index. **Never reuse a number** — even for rejected drafts.
- Write exactly one new file: `planning/adrs/ADR-{NNNN}-{slug}.md`. Use the format in [`templates/adr.md`](templates/adr.md), which mirrors `planning/adrs/_template.md`.
- Update `planning/DECISIONS.md` pointer index with one new row.
- When the ADR is spec-resident or foundation-resident, also update the home doc's status banner / "Decisions encoded here" footer to cross-reference.
- When the ADR supersedes another ADR, update both the new ADR's `Supersedes:` header and the old ADR's `Superseded by:` header. Both arrows or none.
- Run `pipeline-intent-check` on the draft before flipping Status to Accepted. The audit's Category-1–8 statements need `Intent:` annotations.
- Do NOT write code, implementation tickets, or scenarios. That's `pipeline-ticket` / `pipeline-build` / `pipeline-plan`.
- Do NOT edit accepted ADRs. Supersede with a new ADR if the decision changes.

## Workflow

See [`workflow.md`](workflow.md).

## Templates

- [`templates/adr.md`](templates/adr.md) — the canonical ADR shape, mirrors `planning/adrs/_template.md`. Status / Date / Deciders / Scope / Touches / Supersedes? / Decision / Options / Trade-offs / Consequences / Action Items.

## Hand off

**You produced:** a new file at `planning/adrs/ADR-{NNNN}-{slug}.md` with `Status: Proposed`, plus a one-line addition to `planning/DECISIONS.md` pointer index, plus (when applicable) a cross-reference update in the spec/foundation home doc.

**Next step (PM ratifies):** PM reviews; if accepted, flip Status from Proposed → Accepted; commit. After ratification the file is immutable.

**Next skill (intent gap detected):** `pipeline-intent-check` — already wired into this skill's workflow; if it surfaces missing Intent annotations, PM lands them before the Accepted flip.

**Next skill (architectural concern surfaced during drafting):** `pipeline-ratify-absolute` if the ADR is encoding a Category-2 absolute (a "never / always / no X / must" claim); `pipeline-product` if the ADR requires extending a system spec first.

**On supersession:** the old ADR stays in `planning/adrs/` with Status: Superseded and a `Superseded by: ADR-M` header line. The file does not move to archive — the Status banner is the indicator.

## Related skills

- `pipeline-intent-check` — gates ADR ratification; runs automatically per workflow.
- `pipeline-ratify-absolute` — invoked when the ADR encodes a Category-2 absolute or its bullets include unratified absolute statements; walks each interactively, applies the lexicographic decision rule, lands the State-tagged Intent.
- `pipeline-product` — invoked when the ADR can't be ratified without extending a system spec first.
- `pipeline-prune` — quarterly retro of every ADR; flags ones that need supersession or promotion.
- `pipeline-router` — orient before invoking; ensure no open phase is in flight that would conflict with an ADR landing.

## Quarterly retro

`pipeline-adr` itself does not run the quarterly retro — that's a sibling skill (`pipeline-adr-retro`) or an extension of `pipeline-prune`. Per `planning/adrs/README.md`, the retro walks every Accepted ADR, asks "still load-bearing? spec drift? pending banners that need to be promoted?" and emits a one-line journal entry per ADR plus any required supersession ADRs.
