---
purpose: Queue of product/ spec patches flagged by the build agent. Closes the Build → Product return path.
layer: how
status: active
---

# SPEC-PATCHES — pending spec corrections

> Fulfills `pipeline-process-audit-2026-05-22.md` **R5** — closes the Build → Product loop that the audit found leaking.
>
> **The leak:** the build agent cannot write to `product/`. When it discovers a system spec is wrong (schema doesn't match, predicate is off, enum vocabulary diverged), it logs "flagged for `explore`" in DEVIATIONS and moves on. Nothing was the queue. Nothing was the gate. Patches accumulated; one (T056's `items.state` enum) ended up parked behind an indefinitely-deferred scenario, so `item.md` is *knowingly wrong* and every downstream reader inherits the error.
>
> **What this file is:** the queue. Drained as a **gate** by `explore` before each bundle phase opens (per audit R5). If you're starting Phase 2, this file must be empty (or every open entry must have a written disposition: drained, deferred-with-owner, or rescinded-with-reason).
>
> **What it is not:** a deviations log. DEVIATIONS records what happened during a single ticket. This file records what `product/` still owes — and is read end-to-end at phase boundaries.

---

## How to use this file

**Build agent writes an entry** when DEVIATIONS for a ticket includes a `Disposition: flag-for-spec-revision`. The entry is a one-line pointer; the full context lives in DEVIATIONS.

**`explore` drains an entry** by landing the spec patch and marking the row `landed YYYY-MM-DD` with the commit hash. If product judges the build agent was wrong (the spec is right, the code should change), mark `rescinded YYYY-MM-DD` with a one-line reason and open a follow-up ticket.

**Router surfaces non-empty entries** at session start when any open entry is older than the active bundle's open date — that signals the queue is not draining at phase cadence.

**Entry format.**

```
- [ ] {YYYY-MM-DD} · {spec path} § {section} — {one-line what's wrong}. Caught by T###. DEVIATIONS: {ticket-or-date pointer}.
```

Check the box and append `· landed YYYY-MM-DD ({commit hash})` when product patches.

---

## Open

- [ ] **SPEC-PATCH-0001** · 2026-05-19 · `product/systems/item.md` § State machine — `items.state` enum in spec text carries two divergent, both-wrong vocabularies; the schema and T056 reconciled to `draft / published / withdrawn / fulfilled / closed`. Spec must be patched to match. Caught by T056. DEVIATIONS: T056 entry 2026-05-19. **Notes:** audit E1/H3 — this was parked behind F018; do not wait on F018 to land this patch.
- [ ] **SPEC-PATCH-0002** · 2026-05-1x · `product/systems/member.md` § Delegations — partial-index predicate diverged from what T050 implemented. Caught by T050. DEVIATIONS: T050 entry. **Notes:** audit H3.
- [ ] **SPEC-PATCH-0003** · 2026-05-1x · `product/systems/member.md`, `product/systems/groups.md`, `product/foundation/policy.md` — three docs flagged by T049 for review against shipped member_location_affinities + group-membership behavior. Caught by T049. DEVIATIONS: T049 entry. **Notes:** audit H3.

## Landed

*(none yet — entries move here as `explore` patches them)*

## Rescinded

*(spec stands; code was wrong; follow-up ticket opened)*

---

## Gate

**`explore`** drains this queue as the first action when invoked for any phase-boundary work (`b{N}.x` sub-bundle transitions, new bundle entry, new ADR ratification touching a spec on this queue). The Open list must be empty (or every entry must have an explicit `deferred-until {trigger}` annotation with PM approval) before phase work proceeds.

**`orient`** flags any Open entry older than the active bundle's open date — if a patch has been sitting in queue across a phase boundary, the gate failed.
