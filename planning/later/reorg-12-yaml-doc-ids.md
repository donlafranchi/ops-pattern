---
purpose: Inject stable YAML `id:` fields into doc front-matter so REGISTRY.md becomes a reliable resolution table.
layer: how
status: parked
parked_on: 2026-05-30
parked_reason: Parked until reorg-04-retire-meta-and-housekeeping.md ships. The meta + housekeeping retire IS the structural churn; once that lands, YAML doc-id injection runs on a stable tree. Auto-flip to next/ when reorg-04 closes.
source: housekeeping/2026-05-28-repo-reorg/items/12-yaml-doc-ids.md (original)
risk: medium
---

# Stable YAML doc IDs (Phase A)

> **PARKED 2026-05-30.** Revisit after the structural reorg settles. The Phase A scope below is preserved verbatim from the original stub.

## Why parked

Parked until [`reorg-04-retire-meta-and-housekeeping.md`](../next/reorg-04-retire-meta-and-housekeeping.md) ships. The meta + housekeeping retire IS the structural churn; once that lands, YAML doc-id injection runs on a stable tree. Auto-flip to `next/` when reorg-04 closes.

## Phase A — Inject `id:` into front-matter (preserved)

Original scope, kept here for when this thaws:

- Script reads every `.md` file with front-matter under `product/`, `planning/`, `development/`, `standards/`, `meta/` (retiring), `skills/` (excluding `_attic/`, `housekeeping/` (retiring), `_inbox/`).
- Generates `id:` based on layer + filename slug:
  - `why-{slug}` for foundation docs
  - `what-{slug}` for needs / systems / capabilities / ui / exploration
  - `how-{slug}` for planning / development / standards / playbooks
- Injects `id:` into each file's YAML front-matter.
- Rebuilds REGISTRY.md as the resolution table.
- No link conversion yet — both path refs and IDs coexist.

Phase B (convert refs in the 15 most-cited docs) and Phase C (convert remaining refs + add `tidy` check) remain deferred even if Phase A lands.

## Thaw trigger

Auto-flip to `planning/next/` when `reorg-04-retire-meta-and-housekeeping.md` closes.

## Risk

Medium. Bulk YAML edits across many files; script needs to be idempotent. Risk is roughly constant whether executed now or after thaw — but executing now means re-running after each structural shift.

## Source

Housekeeping reorg item 12. PM did not explicitly direct on 2026-05-30; this disposition is the agent's call to park rather than promote, based on the structural churn the other reorg items will introduce.
