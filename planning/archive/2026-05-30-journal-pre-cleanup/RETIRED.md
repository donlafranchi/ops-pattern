---
purpose: Provenance for the JOURNAL.md content predating the pointer-log contract.
layer: how
status: archived
retired_from: JOURNAL.md
---

# JOURNAL.md — content predating the pointer-log contract (retired 2026-05-30)

The 381-line JOURNAL.md that lived at repo root before 2026-05-30 was a reverse-chronological session log holding many durable facts mixed with session prose. Per the new JOURNAL contract (see `playbooks/writing-docs.md` § JOURNAL entry), JOURNAL is now pointer-log only — never the load-bearing copy of any decision or fact.

The durable facts the previous JOURNAL carried had already landed in their right homes by the time of retirement:
- **Phase 0/1 status, T041–T057 completion, eval suite counts** → `planning/STAGE-LEDGER.md` § Substrate — Retired
- **F018 deferral, F025–F029 deferrals, fold-into mappings** → `planning/STAGE-LEDGER.md` § Features — Retired
- **ADR ratifications (ADR-0001 → ADR-0025)** → `playbooks/PLATFORM-PATTERNS.md` and `playbooks/DEVELOPMENT-PATTERNS.md` as pattern-doc entries; original ADR files at `planning/adrs/` for reference until the PM's review-and-delete pass
- **SPEC-PATCHES drain results** → `planning/bundles/archive/b1.x-spec-drain-sprint/spec-patches-landed.md`
- **Intent-check verdicts, verification ladder reshape, anti-Nextdoor softening** → embedded in the relevant system specs (`business-jurisdiction.md`, `item.md`, `policy.md`, `member.md`); the verdict files themselves at `planning/archive/2026-05-30-intent-reviews/`
- **Pipeline patterns, bundle lifecycle, M-gates, anti-patterns** → `playbooks/DEVELOPMENT-PATTERNS.md` § Pipeline patterns + § Pipeline anti-patterns

If you find a fact in this archived JOURNAL that needs to be true today but isn't reflected anywhere else, lift it into its proper durable home and add a line to the active JOURNAL noting the lift.
