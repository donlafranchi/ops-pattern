---
purpose: One-row-per-concept ledger tracking the pipeline stage of every F-number + substrate group. Closes the return path.
layer: how
status: active
---

# STAGE-LEDGER — pipeline stage tracker

> Fulfills `pipeline-process-audit-2026-05-22.md` **R4**. Renamed from the audit's proposed `planning/TRACE.md` to avoid collision with `product/TRACE.md` (feature lineage).
>
> **Two ledgers, two concerns.**
> - [`product/TRACE.md`](../product/TRACE.md) — *"where did this feature come from"* (need → loop → system → capability → ticket lineage).
> - **This file** — *"what stage is this concept at, and when did it last move"*.
>
> Together they answer both "is the architecture coherent" (MAP) + "is the lineage clean" (TRACE) + "is the work flowing" (this file).

---

## How this file works

**One row per F-number** in the Features table. **One row per substrate group** (by spec section or phase) in the Substrate table.

**Stage enum** (set by the skill that owns the transition):

| Stage | Set by | Meaning |
|---|---|---|
| `product` | `pipeline-product` | System spec exists, no scenario yet |
| `plan-backlog` | `pipeline-plan` (draft) | Scenario drafted in `planning/scenarios-backlog/` |
| `plan-approved` | `pipeline-plan` (approve, PM moves file) | Scenario in `planning/scenarios/` |
| `reviewed` | `pipeline-review` | `planning/history/F{NNN}-review.md` exists with verdict PROCEED/REVISE/EXTEND |
| `ticketed` | `pipeline-ticket` | ≥1 ticket exists referencing this scenario |
| `building` | `pipeline-build` | First ticket moved past initial commit |
| `eval` | `pipeline-eval` (run mode) | Build complete; running evals |
| `done` | `pipeline-eval` (run mode, pass) | Evals green; concept shipped |
| `deferred` | PM | Explicitly held back; carry the reason inline |

**Stamping rule.** Each pipeline skill writes its own stage transition as the final step of its workflow. The stamp value is the date of the transition. **Regressions append a new dated entry, they do not overwrite** — F018's two reviews show as two rows in the Review column. This makes round-trips visible.

**Substrate lane.** Substrate tickets (no F-number, see `pipeline-ticket` § Substrate lane) appear in the Substrate table grouped by spec section or rebuild phase. Same stage enum applies, minus `plan-*` and `reviewed`.

**Reading the ledger.** `pipeline-router` reads this file at session start and surfaces: any concept in `building` >14 days, any row with artifacts inconsistent with its stage (e.g. a ticket exists but the row never logged `plan-approved`), and everything in `deferred`.

---

## Features

| F# | Concept | Stage | Product | Plan-backlog | Plan-approved | Reviewed | Eval-spec | Tickets | Eval-run | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| F018 | Brian declares Run Club | `deferred` | event-host.md | 2026-04-? | 2026-05-07 → re-deferred 2026-05-18 | PROCEED 2026-05-08; REVISE 2026-05-18 | features/F018-* | T036–T040 *(archived)* | — | Two review cycles; deferred pending REVISE punch list. AGENTS.md still cites this as the flagship walkthrough — see OPEN-QUESTIONS.md. |
| F025 | Adaeze member public page | `plan-backlog` | member.md | 2026-05-12 | — | — | — | — | — | — |
| F026 | Maya claims Locally Owned (Tier 0) | `plan-backlog` | business-jurisdiction.md, groups.md; ADR-21 | 2026-05-23 | — | — | — | — | — | Sell walkthrough adds self-attested ZIP step; "Claimed local owner" badge surfaces on Group page. Anchor: use-cases.md #13. |
| F027 | Maya claims Locally Made (Tier 0) | `plan-backlog` | item.md Provenance, places.md; ADR-21 | 2026-05-23 | — | — | — | — | — | Product composer adds made_at_place_id step; viewer-side proximity rendering for "Claimed locally made" badge. Anchor: use-cases.md #13. |
| F028 | Sam lands in awareness feed | `plan-backlog` | discovery.md, member.md, places.md; ADR-21 | 2026-05-23 | — | — | — | — | — | Newcomer onboarding seeds primary_home → community-awareness feed has content on first land. Anchor: use-cases.md #12 newcomer variant. |
| F029 | Maya manages place-interest scope | `plan-backlog` | member.md Place-interest scope; ADR-21 | 2026-05-23 | — | — | — | — | — | /you/locality page — add/remove secondaries (≤5), promote/demote primary_home (atomic swap), change primary_home granularity. |

---

## Substrate

| Group | Stage | Tickets | Spec contract | Last activity | Notes |
|---|---|---|---|---|---|
| Phase 0 — extensions + embedding floor | `done` | T041 | product/foundation/primitives.md; ADRs as listed | 2026-05-? | — |
| Phase 1 — Members + Locations + Action layer + Groups substrate | `done` | T042–T053 | member.md, location.md, action-layer.md, groups.md; ADR-7, ADR-19 | 2026-05-19 | T056 spec-fix queued in SPEC-PATCHES.md |
| Phase 1 — Items substrate (states, materialized view) | `done` | T054–T057 | item.md; ADR-7, ADR-19 | 2026-05-19 | T056 reconciled enum; `item.md` text still divergent — SPEC-PATCH-0001 |
| Phase 2 — composers + surfaces | `product` | — | item.md, groups.md, member.md surfaces | — | Pending Phase 2 entry; F019 + F018 (if re-promoted) seed |
| Phase 1+ — Member↔Geography substrate (ADR-21) | `product` | — | member.md (member_place_interests, member_saved_searches); item.md (made_at_place_id, made_at_verification_source); business-jurisdiction.md (verification_source enum); ADR-21 | 2026-05-23 | Substrate-only tickets to retire the don't-create `007i_member_location_affinities.sql`, create `007i_member_place_interests.sql` + `007ii_member_saved_searches.sql`, add `made_at_*` columns + enum to `009_items.sql`, and rename `verification_source` enum values (sos_lookup → community_attested) in `member_business_jurisdictions`. Surface scenarios F026–F029 ride on top. |

---

## Maintenance

- **Backfill on first stamp.** When a skill stamps a row, if the row doesn't exist, create it with all known prior stages backfilled from artifact dates.
- **Do not delete rows.** Even retired/scrapped concepts stay (mark `deferred` with reason). The ledger is the project's stage history.
- **PM ratifies regressions.** A stage moving backwards (`plan-approved` → `plan-backlog`) is appended, not edited, and triggers a JOURNAL entry.
- **Audit reference.** Every check in this file is mirrored in `pipeline-router` § Drift check; the router is the alarm, this file is the source of truth.
