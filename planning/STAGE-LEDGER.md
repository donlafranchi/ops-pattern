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
| `reviewed` | `pipeline-review` | `planning/reviews/F{NNN}-review.md` exists with verdict PROCEED/REVISE/EXTEND |
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
| F018 | Brian declares Run Club | `deferred` | event-host.md | 2026-04-? | 2026-05-07 → re-deferred 2026-05-18 → archived-as-source 2026-05-28 | PROCEED 2026-05-08; REVISE 2026-05-18 | features/F018-* | T036–T040 *(archived)* | — | Two review cycles; deferred pending REVISE punch list. Reframed and replaced by **F034** (recurring gathering at venue, drops persona, fixes 3 review blockers). AGENTS.md flagship-trace question remains in OPEN-QUESTIONS #1. |
| F025 | Adaeze member public page | `deferred` 2026-05-28 | member.md | 2026-05-12 | — | — | — | — | — | Archived to `_attic/2026-05-28-pre-rescope-scenarios/`. Folded into **F032** (Member page + follow) — same surface, drops persona. |
| F026 | Maya claims Locally Owned (Tier 0) | `deferred` 2026-05-28 | business-jurisdiction.md, groups.md; ADR-21 | 2026-05-23 | — | — | — | — | — | Archived. Split between **F036** (Sell walkthrough → business Group) + **F037** (Locally Owned claim lifecycle). |
| F027 | Maya claims Locally Made (Tier 0) | `deferred` 2026-05-28 | item.md Provenance, places.md; ADR-21 | 2026-05-23 | — | — | — | — | — | Archived. Folded into **F039** (Locally Made claim) with focused scope preserved. Product composer extracted to **F038**. |
| F028 | Sam lands in awareness feed | `deferred` 2026-05-28 | discovery.md, member.md, places.md; ADR-21 | 2026-05-23 | — | — | — | — | — | Archived. Folded into **F030** (newcomer signup + feed) with MSA-depth opt-in split to **F031** + metro-polygon per ADR-24 in **F031**. |
| F029 | Maya manages place-interest scope | `deferred` 2026-05-28 | member.md Place-interest scope; ADR-21 | 2026-05-23 | — | — | — | — | — | Archived. Folded into **F031** (place-interest scope management) — mostly a name scrub. |
| F030 | Newcomer signs up and lands in feed | `plan-backlog` | member.md, discovery.md, places.md; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1. Replaces archived F028. First scenario in the Phase 2 sequence. |
| F031 | Member manages place-interest scope | `plan-backlog` | member.md Place-interest scope; ADR-21, ADR-24 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C2. Replaces archived F029. Adds metro-polygon "wider scope" opt-in per ADR-24 — **S-metro substrate gate**. |
| F032 | Viewer finds Member page and follows | `plan-backlog` | member.md, member-profile.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1 (viewer side). Replaces archived F025 (Member-page half). |
| F033 | Viewer finds venue page | `plan-backlog` | location.md, member.md saved-searches; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1 + O2 (viewer side). New scenario — venue page was assumed-to-exist in F018. **S-saved-search substrate gate** (for "Follow this venue" CTA). |
| F034 | Member hosts recurring gathering | `plan-backlog` | item.md gathering, location.md, design-language.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1. Replaces archived F018; fixes the 3 REVISE blockers (state-enum, design-language recipes, /i/→/e/ + ADR-20/22 URL pattern). |
| F035 | Viewer finds Group public page | `plan-backlog` | groups.md, business-jurisdiction.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1 + P1. New scenario — split from archived F025 per ADR-20 reframe. Covers both community-kind + business-kind Group rendering. |
| F036 | Member creates business Group via Sell walkthrough | `plan-backlog` | groups.md kind='business', member.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P1. Replaces archived F026 (Group-creation half). Selling-tool affordances surface from Group membership per ADR-12. |
| F037 | Producer claims Locally Owned (Tier 0) | `plan-backlog` | business-jurisdiction.md; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P4 (jurisdiction half). Replaces archived F026 (claim-lifecycle half). **S-jurisdictions substrate gate**. |
| F038 | Producer lists a product | `plan-backlog` | item.md kind='product', groups.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P1 + P3. New scenario — split from prior F027 broadening. Product composer end-to-end, provenance step's skip path tested here. |
| F039 | Producer claims Locally Made (Tier 0) | `plan-backlog` | item.md Provenance, places.md; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P4 (provenance half). Replaces archived F027 with focused scope intact. **S-jurisdictions substrate gate** (made_at_place_id column). |
| F040 | Producer lists a service | `plan-backlog` | item.md kind='service' | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P1 + P5 (b1 substrate only). New scenario — completes the three b1 Item composers. No Locally Made step (kind='product' only). |
| F041 | Producer generates QR card for Item | `plan-backlog` | item.md QR card, qr-onboarding.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P2 + P3 (farmers market wedge). New scenario — cross-cutting affordance for any Item kind. Print-quality PNG resolving to canonical URL. |
| F042 | Member follows producer, Group, venue | `plan-backlog` | member.md follows, groups.md, member.md saved-searches; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1. New scenario — cross-cutting follow CTA tests (Member follow tested in F032; this covers Group + Venue + the unified `/you/following` surface). |
| F043 | Newcomer completes journey under target | `plan-backlog` | cross-cutting; rebuild-plan.md Phase 2 exit | 2026-05-28 | — | — | — | — | — | Anchor: cross-cutting integration test (organizer + producer paths). Depends on all of F030–F040. 90s target flagged as arbitrary by reorg-plan.md §5; qualitative test ("no getting stuck") is the load-bearing form. |

---

## Substrate

| Group | Stage | Tickets | Spec contract | Last activity | Notes |
|---|---|---|---|---|---|
| Phase 0 — extensions + embedding floor | `done` | T041 | product/foundation/primitives.md; ADRs as listed | 2026-05-? | — |
| Phase 1 — Members + Locations + Action layer + Groups substrate | `done` | T042–T053 | member.md, location.md, action-layer.md, groups.md; ADR-7, ADR-19 | 2026-05-19 | T050 partial-index spec drift drained 2026-05-27 (SPEC-PATCH-0002, b1.x-spec-drain-sprint). |
| Phase 1 — Items substrate (states, materialized view) | `done` | T054–T057 | item.md; ADR-7, ADR-19 | 2026-05-19 | T056 reconciled enum; spec text drained 2026-05-27 (SPEC-PATCH-0001, b1.x-spec-drain-sprint). |
| Phase 2 — composers + surfaces | `product` | — | item.md, groups.md, member.md surfaces | — | Pending Phase 2 entry; F019 + F018 (if re-promoted) seed |
| Phase 1+ — Member↔Geography substrate (ADR-21) | `product` | — | member.md (member_place_interests, member_saved_searches); item.md (made_at_place_id, made_at_verification_source); business-jurisdiction.md (verification_source enum); ADR-21 | 2026-05-23 | Superseded by b1.x sprint row below — kept for trace. The "rename `verification_source` (sos_lookup → community_attested) in `member_business_jurisdictions`" wording is stale: the table doesn't exist yet, so this is a create-it-right at b1.2/F026, not a rename. PM ratified the deferral 2026-05-25. |
| b1.x — ADR-20 + ADR-21 geography substrate sprint | `ready-to-merge` | T058, T059, T060, T061, T062, T063, T064 — all 7 build + eval complete | places.md; member.md § Place-interest scope / § Saved searches; item.md § Provenance; ADR-20, ADR-21 | 2026-05-25 | Sprint def: [`planning/bundles/b1.x-substrate-sprint.md`](bundles/b1.x-substrate-sprint.md). PM ratified 2026-05-25 (decisions 1/2/3 all = recommended). P1 + P2 closed. **All 7 work items shipped 2026-05-25:** 6 migrations (017–022) + 5 action handlers + reverse-geocoder TS + path resolver + breadcrumb + Next.js catch-all + test helper + 14 test files. **107/107 unit + 181/181 Phase 1 evals green.** action-layer conformance: 35 protected tables, 0 violations. **M2 Approve** (2 privacy-leak fixes auto-landed on saved_search update/remove). **M4 checklist** drafted at [`operations/deploy-checklist-b1x.md`](../operations/deploy-checklist-b1x.md). Awaits PM sign-off + merge to main. **`member_business_jurisdictions` deferred to b1.2/F026** (decision #3). |
| b1.x — SPEC-PATCHES drain (pre-Phase-2 gate) | `done` | — (Cowork-only; no `T###`) | item.md, member.md, primitives.md, payments.md, agent-assistance.md, affinity-derived-groups.md; ADR-21 | 2026-05-27 | Sprint def: [`planning/bundles/b1.x-spec-drain-sprint.md`](bundles/b1.x-spec-drain-sprint.md). `explore` drained SPEC-PATCHES queue: -0001 / -0002 / -0004 landed; -0003 rescinded (superseded by ADR-21). Caught + fixed four ADR-21 drift sites the original entries missed. **Phase 2 gate clear.** |
| S-metro — Metro polygons (per ADR-24) | `product` | — | discovery.md; ADR-24 (Proposed) | 2026-05-28 | Substrate ticket: `metro_polygons` table (geometry + slug + display_name + csa_source_id) + `members.home_metro_id` + Census CSA seed + home-metro resolution at coordinate-save. **Gates F031.** Blocked on ADR-24 ratification (currently Proposed). `discovery.md` spec patch required per ADR-24 Implementation Notes. |
| S-saved-search — `member_saved_searches` | `product` | — | member.md Saved searches; ADR-21 | 2026-05-28 | Substrate ticket: `member_saved_searches` table + indexes + RLS + action handlers (`member.saved_search.create` / `.update` / `.remove`) + events. Most of substrate exists per ADR-21 work; this row tracks the b1 surface enablement (the "Follow this venue" CTA needs the action handlers exposed). **Gates F033 + F042.** |
| S-jurisdictions — `member_business_jurisdictions` Tier 0 + `made_at` | `product` | — | business-jurisdiction.md; item.md Provenance; ADR-21 | 2026-05-28 | Substrate ticket: `member_business_jurisdictions` table Tier 0 (`verification_source='self_attested'`) + `items.made_at_place_id` + `items.made_at_verification_source` + `public.zip_is_proximal_to_location()` function + action handlers (`member.business_jurisdiction.add` / `.remove`) + events. **Gates F037 + F039.** |

---

## Maintenance

- **Backfill on first stamp.** When a skill stamps a row, if the row doesn't exist, create it with all known prior stages backfilled from artifact dates.
- **Do not delete rows.** Even retired/scrapped concepts stay (mark `deferred` with reason). The ledger is the project's stage history.
- **PM ratifies regressions.** A stage moving backwards (`plan-approved` → `plan-backlog`) is appended, not edited, and triggers a JOURNAL entry.
- **Audit reference.** Every check in this file is mirrored in `pipeline-router` § Drift check; the router is the alarm, this file is the source of truth.
