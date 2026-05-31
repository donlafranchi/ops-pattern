---
id: how-stage-ledger
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

## Features — Active

| F# | Concept | Stage | Product | Plan-backlog | Plan-approved | Reviewed | Eval-spec | Tickets | Eval-run | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| F030 | Newcomer signs up and lands in feed | `plan-backlog` | member.md, discovery.md, places.md; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1. Replaces archived F028. First scenario in the Phase 2 sequence. |
| F031 | Member manages place-interest scope | `plan-backlog` | member.md Place-interest scope; ADR-21, ADR-24 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C2. Replaces archived F029. Adds metro-polygon "wider scope" opt-in per ADR-24 — **S-metro substrate gate**. |
| F032 | Viewer finds Member page and follows | `plan-backlog` | member.md, member-profile.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1 (viewer side). Replaces archived F025 (Member-page half). |
| F033 | Viewer finds venue page | `plan-backlog` | location.md, member.md saved-searches; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1 + O2 (viewer side). New scenario — venue page was assumed-to-exist in F018. **S-saved-search substrate gate** (for "Follow this venue" CTA). |
| F034 | Member hosts recurring gathering | `plan-backlog` | item.md gathering, location.md, design-language.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1. Replaces archived F018; fixes the 3 REVISE blockers (state-enum, design-language recipes, /i/→/e/ + ADR-20/22 URL pattern). |
| F035 | Viewer finds Group public page | `plan-backlog` | groups.md, business-jurisdiction.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1 + P1. New scenario — split from archived F025 per ADR-20 reframe. Covers both community-kind + business-kind Group rendering. |
| F036 | Member creates business Group via Sell walkthrough | `building` 2026-05-31 (T070 + T071 done) | groups.md kind='business', member.md, location.md, action-layer.md, business-jurisdiction.md, ui/design-language.md (Multi-step composer + AddEntityDrawer) | 2026-05-28 → approved 2026-05-31 (Gate A cleared via weigh: 4 absolutes ratified) | written 2026-05-31 (`web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts`) | EXTEND 2026-05-31 (cleared by DLS extend 2026-05-31) | T070 (substrate ✅ commit `d8204c7`, merged `39b11df`) + T071 (`<MultiStepComposer>` ✅ on branch t071) + T072–T073 (F036, open) | T071 done; T072→T073 pending | — | Anchor: use-cases.md P1. T070 = lifecycle_state + draft handlers (merged to main); T071 = generic composer base (13/13 vitest GREEN, M2 PROCEED, M3 basic-level satisfied with full focus-trap deferred); T072/T073 still queued. Shop vs Group copy decision still pending (T073 defaults to "Shop"). |
| F037 | Producer claims Locally Owned (Tier 0) | `plan-backlog` | business-jurisdiction.md; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P4 (jurisdiction half). Replaces archived F026 (claim-lifecycle half). **S-jurisdictions substrate gate**. |
| F038 | Producer lists a product | `plan-backlog` | item.md kind='product', groups.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P1 + P3. New scenario — split from prior F027 broadening. Product composer end-to-end, provenance step's skip path tested here. |
| F039 | Producer claims Locally Made (Tier 0) | `plan-backlog` | item.md Provenance, places.md; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P4 (provenance half). Replaces archived F027 with focused scope intact. **S-jurisdictions substrate gate** (made_at_place_id column). |
| F040 | Producer lists a service | `plan-backlog` | item.md kind='service' | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P1 + P5 (b1 substrate only). New scenario — completes the three b1 Item composers. No Locally Made step (kind='product' only). |
| F041 | Producer generates QR card for Item | `plan-backlog` | item.md QR card, qr-onboarding.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P2 + P3 (farmers market wedge). New scenario — cross-cutting affordance for any Item kind. Print-quality PNG resolving to canonical URL. |
| F042 | Member follows producer, Group, venue | `plan-backlog` | member.md follows, groups.md, member.md saved-searches; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1. New scenario — cross-cutting follow CTA tests (Member follow tested in F032; this covers Group + Venue + the unified `/you/following` surface). |
| F043 | Newcomer completes journey under target | `plan-backlog` | cross-cutting; rebuild-plan.md Phase 2 exit | 2026-05-28 | — | — | — | — | — | Anchor: cross-cutting integration test (organizer + producer paths). Depends on all of F030–F040. 90s target flagged as arbitrary by reorg-plan.md §5; qualitative test ("no getting stuck") is the load-bearing form. |

## Features — Retired

| F# | Concept | Stage | Notes |
|---|---|---|---|
| F018 | Brian declares Run Club | `deferred` 2026-05-18 → archived-as-source 2026-05-28 | Reframed and replaced by **F034** (recurring gathering at venue, drops persona, fixes 3 review blockers). AGENTS.md flagship-trace question now in `planning/proposed/F018-flagship-decision.md` (per reorg-11, 2026-05-30). |
| F025 | Adaeze member public page | `deferred` 2026-05-28 | Folded into **F032** (Member page + follow). |
| F026 | Maya claims Locally Owned (Tier 0) | `deferred` 2026-05-28 | Split between **F036** (Sell walkthrough → business Group) + **F037** (Locally Owned claim lifecycle). |
| F027 | Maya claims Locally Made (Tier 0) | `deferred` 2026-05-28 | Folded into **F039** (Locally Made claim); product composer extracted to **F038**. |
| F028 | Sam lands in awareness feed | `deferred` 2026-05-28 | Folded into **F030** (newcomer signup + feed); MSA-depth opt-in split to **F031**. |
| F029 | Maya manages place-interest scope | `deferred` 2026-05-28 | Folded into **F031**. |

---

## Substrate — Active

| Group | Stage | Tickets | Spec contract | Last activity | Notes |
|---|---|---|---|---|---|
| Phase 2 — composers + surfaces | `product` | — | item.md, groups.md, member.md surfaces | — | Pending Phase 2 entry |
| b1.x — ADR-20 + ADR-21 geography substrate sprint | `ready-to-merge` | T058–T064 — all 7 build + eval complete | places.md; member.md § Place-interest scope / § Saved searches; item.md § Provenance; ADR-20, ADR-21 | 2026-05-25 | All 7 items shipped 2026-05-25; 107/107 unit + 181/181 Phase 1 evals green; 0 conformance violations. Awaits PM sign-off + merge to main. `member_business_jurisdictions` deferred to b1.2/F026 (decision #3). |
| S-metro — Metro polygons (per ADR-24) | `product` | — | discovery.md; ADR-24 (Proposed) | 2026-05-28 | `metro_polygons` table + `members.home_metro_id` + Census CSA seed + home-metro resolution at coordinate-save. **Gates F031.** Blocked on ADR-24 ratification. |
| S-saved-search — `member_saved_searches` | `product` | — | member.md Saved searches; ADR-21 | 2026-05-28 | Surface enablement (the "Follow this venue" CTA needs the action handlers exposed). **Gates F033 + F042.** |
| S-jurisdictions — `member_business_jurisdictions` Tier 0 + `made_at` | `product` | — | business-jurisdiction.md; item.md Provenance; ADR-21 | 2026-05-28 | Tier 0 (`verification_source='self_attested'`) + `items.made_at_place_id` + `public.zip_is_proximal_to_location()`. **Gates F037 + F039.** |

## Substrate — Retired

| Group | Stage | Notes |
|---|---|---|
| T067 — Report Shape rule | `done` | Installed report-shape template across CLAUDE.md, DEVELOPMENT-PATTERNS playbook, AGENTS.md, and 12 skill workflows. 2026-05-30. |
| Phase 0 — extensions + embedding floor | `done` | T041 shipped 2026-05-?. |
| Phase 1 — Members + Locations + Action layer + Groups substrate | `done` | T042–T053 shipped 2026-05-19. T050 partial-index drift drained 2026-05-27. |
| Phase 1 — Items substrate (states, materialized view) | `done` | T054–T057 shipped 2026-05-19. T056 enum reconciled; spec text drained 2026-05-27. |
| Phase 1+ — Member↔Geography substrate (ADR-21) | `superseded` | Superseded by the b1.x ADR-20+21 geography substrate sprint above. |
| b1.x — SPEC-PATCHES drain (pre-Phase-2 gate) | `done` | Drained -0001 / -0002 / -0004; rescinded -0003 (superseded by ADR-21). Phase 2 gate clear 2026-05-27. |

---

## Maintenance

- **Backfill on first stamp.** When a skill stamps a row, if the row doesn't exist, create it with all known prior stages backfilled from artifact dates.
- **Do not delete rows.** Even retired/scrapped concepts stay (mark `deferred` with reason). The ledger is the project's stage history.
- **PM ratifies regressions.** A stage moving backwards (`plan-approved` → `plan-backlog`) is appended, not edited, and triggers a JOURNAL entry.
- **Audit reference.** Every check in this file is mirrored in `pipeline-router` § Drift check; the router is the alarm, this file is the source of truth.
