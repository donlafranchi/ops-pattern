---
purpose: Provenance for the rebuild-plan.md archived 2026-05-28.
layer: how
status: archived
retired_from: planning/rebuild-plan.md
---

# rebuild-plan.md — archived 2026-05-28

## What's here

`rebuild-plan.md` — the four-phase clean-slate rebuild plan, approved 2026-05-10 (ADR-19), supersedes the original 7-phase migration plan.

## Why archived

PM call 2026-05-28. The plan's substantive value at this point is mostly historical:

- **Phase 0 — DONE 2026-05-10.** AI-native floor (action layer skeleton, system Member, pgvector + postgis, embedding tables, auth signup hook).
- **Phase 1 — DONE 2026-05-19 + b1.x extension DONE 2026-05-25.** Schema floor complete: 191/191 evals green, all primitive substrate shipped (Members + Locations + Groups + Items + discoverable_items, plus Places + ADR-21/22/23 substrates).
- **Phase 2 — never started; rescoped 2026-05-28.** Phase 2 "Cluster 1 surfaces" framing accreted assumptions (composer list bundled, F019–F024 references in exit criteria, no internal sequencing, no activation-energy ordering). Replaced by [`planning/bundles/b1-primitives-sequence.md`](../../planning/bundles/b1-primitives-sequence.md) (F030–F037 sequenced by build dependency, anchored to `use-cases.md` MVP rows).
- **Phase 3 — never started; rescoped 2026-05-28.** Phase 3 "Locality index + Wonder + thesis + Groups" conflated four independent surfaces. Wonder dropped from b1 (O4 is Deferred b2+ in `use-cases.md`); the rest split across F032, F036, F037 in the new sequence. ADR-24 (metro polygons as discovery overlay) supersedes the MSA-depth opt-in language.
- **Phase 4 — DONE 2026-05-11.** Doc cleanup. Already historical.

So Phases 0, 1, 4 are complete; Phases 2, 3 are superseded. The plan as a whole no longer carries forward work.

## What survives from this plan

Three commitments survive, restated in the new sequence doc:

1. **The platform's grammar.** "Person declares Item at Location; other Persons respond. People form Groups when they decide they are a group."
2. **Business serves people, not the other way around.** No Business entity in the schema.
3. **Groups are emergent, optional, never auto-assigned.**

The observability commitments, the "what we explicitly do NOT do" list, and the risks register are absorbed into the new sequence doc.

## Don't cite this as live

Cite [`planning/bundles/b1-primitives-sequence.md`](../../planning/bundles/b1-primitives-sequence.md) for the active build sequence. Cite [`planning/bundles/b1-primitives-plan.md`](../../planning/bundles/b1-primitives-plan.md) for b1 scoping in primitive / cluster / loop terms (still load-bearing).

## ADR-19 status

ADR-19 (clean-slate rebuild) stays Accepted. Its decision — that the rebuild is clean-slate, not migration — remains the basis for the current substrate. The phased structure was tactical; archiving the plan does not retract the decision.
