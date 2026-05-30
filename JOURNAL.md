---
purpose: Thin session pointer log. Never the load-bearing copy of any decision or fact.
layer: how
status: active
---

# JOURNAL.md

One block per session, newest at top. Two to three sentences naming the durable docs that changed, plus the commit hash. No decisions, no "next session pickup" blocks, no current-state inventories — if a session produced a fact that needs to be true next quarter, the fact lives in its capability, pattern, or system spec; the JOURNAL line just notes that the file changed.

Rotation: anything older than 30 days moves to a monthly archive. Pre-2026-05-30 entries archived at [`planning/archive/2026-05-30-journal-pre-cleanup/`](planning/archive/2026-05-30-journal-pre-cleanup/).

---

## 2026-05-30 — Reorg-12 Phase A: stable doc IDs injected; REGISTRY rebuilt; b1 surface sequence pulled to `now/`

Injected `id:` front-matter into 148 narrative docs across `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, `skills/` via `scripts/inject-doc-ids.py` (idempotent; `why-` / `what-` / `how-` prefixes by layer; generic README.md / SKILL.md disambiguated by parent dir). Rebuilt `REGISTRY.md` via `scripts/rebuild-registry.py` — 150 docs (5 why, 30 what, 115 how). Archived 9 closed kanban items from `planning/done/` to `_attic/2026-05-30-kanban-done-batch/` with RETIRED.md index. Moved `reorg-12-yaml-doc-ids` to `done/`; pulled `plan-b1-surface-sequence` into `now/`. Phase B (convert refs in top-15 cited docs) and Phase C (full ref conversion + `tidy` check) remain deferred per the reorg-12 spec. Next: route F036 to `scope` to open the b1 surface build. Commit: c43101c.

## 2026-05-30 — Ratified lane-routing rule + default-private Member discoverability (PM override; weigh skipped)

PM exercised override under AGENTS.md §3 to ratify two decisions without `weigh` dialectic. New entries in `playbooks/DEVELOPMENT-PATTERNS.md` ("Route work items by ratification need") and `playbooks/PLATFORM-PATTERNS.md` ("Default Member discoverability to private"). Stubs moved from `planning/next/` to `planning/done/`. Implementation follow-ups for the Member discoverability decision park in `product/systems/member.md` spec work.

## 2026-05-30 — Scaffolded `playbooks/`; migrated 19 ADRs; demoted JOURNAL to pointer-log

Stood up `playbooks/` with `DECISION-PATTERNS.md`, `PLATFORM-PATTERNS.md`, `DEVELOPMENT-PATTERNS.md`, `writing-docs.md`, `repo-tidying.md`. Migrated ADR-0001 → ADR-0025 (ratified) as pattern-doc entries: 12 platform, 6 development; ADR-0016 left alone for PM review-pass; ADR-0024 ratified inline. Absorbed `meta/cowork-pipeline/DEV-PATTERN.md` into DEVELOPMENT-PATTERNS § Pipeline patterns + § Pipeline anti-patterns; original at `meta/cowork-pipeline/archive/2026-05-30-dev-pattern/`. Archived 6 review files (`planning/archive/2026-05-30-intent-reviews/`), 2 done sprints (`planning/bundles/archive/`), `pending-ratifications.md` (`planning/archive/2026-05-30-pending-ratifications/`), `phase-2-scenario-strategy.md` (`planning/archive/2026-05-30-phase-2-historical/`). Trimmed RELEASES, SPEC-PATCHES, OPEN-QUESTIONS, STAGE-LEDGER, b1-primitives-plan. Rewrote CLAUDE.md + AGENTS.md doc-map. Commit: {pending}.
