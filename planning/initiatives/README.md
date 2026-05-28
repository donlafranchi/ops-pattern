---
purpose: Home for non-bundle work packages — refactors, reorgs, strategy passes, phase-spanning plans.
layer: how
status: active
---

# planning/initiatives/ — non-bundle work packages

> Per [ADR-25 (local lifecycle ownership)](../adrs/ADR-0025-local-lifecycle-ownership.md). One subdirectory per initiative. Atomized by default.

## When to file here vs. `bundles/`

| Construct | Lives in | Bound to |
|---|---|---|
| Release package (b1, b2, b3) | [`../bundles/`](../bundles/) | A ship date. Carries scenarios, tickets, success metrics. |
| **Initiative** (audit, reorg, refactor, strategy pass, phase-spanning plan) | `initiatives/` (this dir) | A concern or process goal. Carries items. |

If the work ships a user-visible feature on a release date, it's a bundle. Everything else that needs coordinated multi-step planning is an initiative.

## Shape

Each initiative is a subdirectory:

```
planning/initiatives/
└── {slug}/
    ├── README.md           # what the initiative is, why, how items index
    ├── strategy.md         # optional — meta-narrative, sequencing, principles
    └── items/              # one file per pickable unit of work
        ├── 01-{slug}.md
        ├── 02-{slug}.md
        └── ...
```

The atomization mechanics live in [`meta/cowork-pipeline/DEV-PATTERN.md`](../../meta/cowork-pipeline/DEV-PATTERN.md) § Atomize big plans with mixed-state items. An initiative with 4+ items that are pickable independently should be atomized from the start — that is the whole point of filing here.

`strategy.md` is optional. Use it when the meta-narrative (rationale, sequencing logic, dependency reasoning) is itself load-bearing. Otherwise the `items/` directory listing is the index.

## Lifecycle

- **Active** — `README.md` frontmatter `status: active`. Items being picked up.
- **Done** — every item archived. The initiative subdir archives to `planning/archive/YYYY-MM-DD-{slug}/` per ADR-25.

Individual items follow the per-item stub lifecycle in DEV-PATTERN.md (`status: stub` → `status: active` → archived to `{plan-area}/archive/`).

## Existing initiatives

| Slug | Status | What it is |
|---|---|---|
| [`phase-3/`](phase-3/) | active | Phase 3 surfaces — `/explore` anonymous, Wonder composer/conversion, group browse/create, thesis page, stewardships, saved-search composer, onboarding group suggestion. Atomized: one item per surface. Strategy doc pending. |

(Renamed from `planning/phase-3-items/` on 2026-05-28 per ADR-25.)

## What does NOT go here

- Release-bound work → `bundles/`.
- Scenarios → `scenarios/` / `scenarios-backlog/`.
- ADRs → `adrs/`.
- Reviews → `reviews/`.
- Tickets → `development/tickets/`.
- Ongoing trackers (`STAGE-LEDGER.md`, `SPEC-PATCHES.md`, `OPEN-QUESTIONS.md`, `DECISIONS.md`, `RELEASES.md`) → `planning/` root.
- One-off audits with no atomization candidates → `housekeeping/{date}-{slug}/`.
