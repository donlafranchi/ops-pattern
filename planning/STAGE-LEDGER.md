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
| `plan-backlog` | `pipeline-plan` (draft) | Scenario drafted in `planning/backlog/` |
| `plan-approved` | `pipeline-plan` (approve, PM moves file) | Scenario in `planning/next/` |
| `reviewed` | `pipeline-review` | `review-F{NNN}.md` (alongside the scenario in its lane — `planning/next/` or `planning/now/`) exists with verdict PROCEED/REVISE/EXTEND |
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
| F030 | Newcomer signs up and lands in feed | `building` 2026-06-02 (built on branch `t-f030`, **unmerged**; eval authored, run pending) | member.md, discovery.md, places.md; ADR-21 | 2026-05-28 → moved → `planning/now/` 2026-06-02 (PM-directed) | — (review-F030 still pending — rebuild rule 1) | F030 spec authored 2026-06-02 (`evals/features/F030-…spec.ts` + fixture) | T086 · T087 · T088 · T089 (2026-06-02) | pending (no live server in build sandbox → downstream `test` run-mode) | Anchor: use-cases.md C1. Replaces archived F028. **Auth-method gate resolved (b1): magic-link primary, social b2, email/password = eval path.** Built T086 (`member.interests.add` + handler registration) · T087 (`locality_feed_items` SQL fn + `027` migration + read helper) · T088 (`LocalityFeed` at `/` + signup CTA + scope picker + empty-state) · T089 (3-step onboarding on `MultiStepComposer`). 42 new unit tests + 189 src GREEN; tsc/eslint/conformance clean. Deps now met (F034/F036/F038/F040 shipped). |
| F031 | Member manages place-interest scope | `plan-backlog` | member.md Place-interest scope; ADR-21, ADR-24 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C2. Replaces archived F029. Adds metro-polygon "wider scope" opt-in per ADR-24 — **S-metro substrate gate**. |
| F032 | Viewer finds Member page and follows | `plan-backlog` | member.md, member-profile.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1 (viewer side). Replaces archived F025 (Member-page half). |
| F033 | Viewer finds venue page | `plan-backlog` | location.md, member.md saved-searches; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md O1 + O2 (viewer side). New scenario — venue page was assumed-to-exist in F018. **S-saved-search substrate gate** (for "Follow this venue" CTA). |
| F034 | Member hosts recurring gathering | `done` 2026-06-02 (eval 5/5 PASS; merged → main `98c86d9`) | item.md gathering, location.md, design-language.md | 2026-05-28 | moved → `planning/now/` 2026-06-02 (direct build per PM, mirroring F038/F040) | — (no separate review-F034; PM-directed direct build) | written 2026-06-02 (`web/evals/features/F034-member-hosts-recurring-gathering.spec.ts` + fixture `evals/fixtures/F034-gathering.ts`) | T084 (gathering composer ✅) + T085 (gathering Item page + `/e/` dispatch ✅) — renumbered from T081/T082 to resolve the F040 ticket-number collision; built on branch `t-f034`, merged → main (catch-all conflict resolved: `/s/` + `/e/` dispatch coexist), branch deleted | 2026-06-02 PASS 5/5 | Anchor: use-cases.md O1. Replaces archived F018; fixes the 3 REVISE blockers (state-enum, design-language recipes, /i/→/e/ + ADR-20/22 URL pattern). Eval: 5 beats (group-filed brand+recurrence+venue+Free+Share, member-hosted, paid cost, draft-404, /you/sell reachability). |
| F035 | Viewer finds Group public page | `done` 2026-06-02 (eval 8/8 PASS) | groups.md, business-jurisdiction.md | 2026-05-28 → scenario drafted 2026-06-01 (`scenario-F035-rosa-finds-mayas-shop.md`; Gate A PASS) | moved → `planning/now/` 2026-06-02 (direct build per PM) | covered by `review-F036.md` (sibling `/p/.../g/[slug]` surface); no separate `review-F035.md` | written 2026-06-02 (`web/evals/features/F035-rosa-finds-mayas-shop.spec.ts` + fixture `evals/fixtures/F035-shop.ts`) | T074 (✅ built + merged → main `294f6ab`) | 2026-06-02 PASS 8/8 (`web/evals/results/F035-2026-06-02.md`) | Anchor: use-cases.md P1 (primary), C1 (secondary). Business-Group flavor built; community-Group flavor (Run Club) deferred to same F-number, different slug, after F034. All 6 beats green; Beat 2 badge verified at absent-branch (F037/S-jurisdictions forward-dep) and Beat 4 at affordance + deferred-write (F042 group-follow forward-dep) — flip both to positive branch when those ship. Harness fix: `signIn` now retries on the local-GoTrue "schema error" flake (helps all suites). |
| F036 | Member creates business Group via Sell walkthrough | `eval` 2026-06-01 (partial-pass 5/9; 4 forward-deps red) | groups.md kind='business', member.md, location.md, action-layer.md, business-jurisdiction.md, ui/design-language.md (Multi-step composer + AddEntityDrawer) | 2026-05-28 → approved 2026-05-31 (Gate A cleared via weigh: 4 absolutes ratified) | written 2026-05-31 (`web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts`) | EXTEND 2026-05-31 (cleared by DLS extend 2026-05-31) | T070 (substrate ✅ `d8204c7`→`39b11df`) + T071 (`<MultiStepComposer>` ✅ `d31f3ff`→`3c64571`) + T071a (dev-route gate ✅ `c7d9f3e`→`8da39a4`) + T072 (`<AddEntityDrawer>` ✅ `3276666`→`08d7667`) + T073 (✅ shipped + merged 2026-06-01) + T073b (✅ `c36759c`→`3ec3420` on web; `0224c8b`+`5e66fe6` on parent) | T070→T073b all done | 2026-06-01 partial: 5/9 passing; 4 forward-dep red (`:167` F035, `:224` F038/F040/F034, `:266` F037 S-jurisdictions, polygon-seed T058) | Anchor: use-cases.md P1. Shop label ratified 2026-06-01. T073b expanded scope mid-loop — two named bugs sat upstream of three latent fixes; eval surfaced the chain after the named ones unblocked. Stays `eval` until forward-deps ship and evals fully green; row flips to `done` then. |
| F037 | Producer claims Locally Owned (Tier 0) | `plan-backlog` | business-jurisdiction.md; ADR-21 | 2026-05-28 → scenario drafted 2026-06-01 (`scenario-F037-maya-claims-locally-owned.md`; Gate A PASS) | — | — | — | — | — | Anchor: use-cases.md P4 (jurisdiction half). ~~**S-jurisdictions substrate gate** prevents promotion to `next/`~~ → **substrate gate CLOSED 2026-06-02 (T075 built on `t75`)**; F037 may promote to `next/` once PM moves the file. Greens the jurisdiction half of `:266` once substrate + this surface ship. |
| F038 | Producer lists a product | `building` 2026-06-02 (eval pending; awaits `t77` merge) | item.md kind='product', groups.md | 2026-05-28 | moved → `planning/now/` 2026-06-02 (direct build per PM, mirroring F035) | — (no separate review-F038; PM-directed direct build) | — (Playwright eval pending PM merge of `t77`→main) | T077 (item handlers ✅ `5a23f70`) + T078 (product composer ✅ `845e354`) + T079 (Item page ✅ `2ea68a3`) — all on branch `t77`, merge to main pending PM y/n | — | Anchor: use-cases.md P1 + P3. Build-side complete: 3 commits, 47 new vitest, 121/121 src green, conformance OK, M2 PROCEED ×3, M3 basic. No migration (015/020 sufficient). DEVIATIONS: schedule_kind 'permanent'→'ongoing' (SPEC-PATCHES filed), id8 Item addressing, atomic-publish composer. Skip-provenance path tested; F039 lands the made claim. |
| F039 | Producer claims Locally Made (Tier 0) | `plan-backlog` | item.md Provenance, places.md; ADR-21 | 2026-05-28 → scenario drafted 2026-06-01 (`scenario-F039-maya-claims-locally-made.md`; Gate A PASS pending `item.md` § Provenance re-check at substrate ship) | — | — | — | — | — | Anchor: use-cases.md P4 (provenance half). **Two substrate gates**: S-jurisdictions (`made_at_place_id` column + `places` seed) — **CLOSED 2026-06-02 (T075 built; `made_at_place_id` already in 020, jurisdiction substrate + crosswalk shipped)** — AND F038 (product composer — the surface F039's field lives on). Cannot promote until F038 also ships. Greens the provenance half of `:266` once all three land. |
| F040 | Producer lists a service | `done` 2026-06-02 (eval 6/6 PASS; merged → main `2c9c0e7`) | item.md kind='service', groups.md | 2026-05-28 | moved → `planning/now/` 2026-06-02 (direct build per PM, mirroring F038) | — (no separate review-F040; PM-directed direct build) | written 2026-06-02 (`web/evals/features/F040-producer-lists-service.spec.ts` + fixture `evals/fixtures/F040-service.ts`) | T081 (service arm of item.create — service_area_geography ✅) + T082 (service composer ✅) + T083 (service Item page + `/s/` dispatch ✅) — branch `t-f040` merged → main, branch deleted | 2026-06-02 PASS 6/6 | Anchor: use-cases.md P1 + P5 (b1 substrate only). Completes the three b1 Item composers. No Locally Made step (kind='product' only). Build: 91 F040+regression vitest green; M2 PROCEED (2 low/note). DEVIATIONS: rate_model honors shipped enum (SPEC-PATCHES filed), free=null rate, anchor doubles as service-area center, static area render. Eval: 6 beats (brand+area+rate, Free, quote, individual, draft-404, /you/sell reachability). |
| F041 | Producer generates QR card for Item | `plan-backlog` | item.md QR card, qr-onboarding.md | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md P2 + P3 (farmers market wedge). New scenario — cross-cutting affordance for any Item kind. Print-quality PNG resolving to canonical URL. |
| F042 | Member follows producer, Group, venue | `plan-backlog` | member.md follows, groups.md, member.md saved-searches; ADR-21 | 2026-05-28 | — | — | — | — | — | Anchor: use-cases.md C1. New scenario — cross-cutting follow CTA tests (Member follow tested in F032; this covers Group + Venue + the unified `/you/following` surface). |
| F043 | Newcomer completes journey under target | `plan-backlog` | cross-cutting; rebuild-plan.md Phase 2 exit | 2026-05-28 | — | — | — | — | — | Anchor: cross-cutting integration test (organizer + producer paths). Depends on all of F030–F040. 90s target flagged as arbitrary by reorg-plan.md §5; qualitative test ("no getting stuck") is the load-bearing form. |

## Features — Retired

| F# | Concept | Stage | Notes |
|---|---|---|---|
| F018 | Brian declares Run Club | `deferred` 2026-05-18 → archived-as-source 2026-05-28 | Reframed and replaced by **F034** (recurring gathering at venue, drops persona, fixes 3 review blockers). AGENTS.md flagship-trace question now in `planning/backlog/decision-F018-flagship.md` (per reorg-11, 2026-05-30). |
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
| S-polygon — places polygon + centroid backfill (T076) | `building` 2026-06-02 (committed on branch `t76`, not merged) | T076 (✅ built; 42 vitest green; M2 PROCEED) | places.md § T1 + § Reverse-geocoder; PLATFORM-PATTERNS county tier (ADR-0022) + metro-overlay D3 | 2026-06-02 | Adds `places.centroid` + `idx_places_centroid`; backfills launch-market polygons (approx bbox — full-res replay → S-metro) + 3 new cities (Davis/Roseville/Folsom). Greens polygon-seed half of F036 `:266`. 4 deviations logged (approx polygons, Placer pre-exists, no centroid-tiebreak in 022, vitest=JS-geometry not live-DB). SPEC-PATCHES: line-26 (017 polygons) checked off; 3 new entries queued. Live-DB containment is the downstream Playwright `test`-skill step. |
| b1.x — ADR-20 + ADR-21 geography substrate sprint | `ready-to-merge` | T058–T064 — all 7 build + eval complete | places.md; member.md § Place-interest scope / § Saved searches; item.md § Provenance; ADR-20, ADR-21 | 2026-05-25 | All 7 items shipped 2026-05-25; 107/107 unit + 181/181 Phase 1 evals green; 0 conformance violations. Awaits PM sign-off + merge to main. `member_business_jurisdictions` deferred to b1.2/F026 (decision #3). |
| S-metro — Metro polygons (per ADR-24) | `product` | — | discovery.md; ADR-24 (Proposed) | 2026-05-28 | `metro_polygons` table + `members.home_metro_id` + Census CSA seed + home-metro resolution at coordinate-save. **Gates F031.** Blocked on ADR-24 ratification. |
| S-saved-search — `member_saved_searches` | `product` | — | member.md Saved searches; ADR-21 | 2026-05-28 | Surface enablement (the "Follow this venue" CTA needs the action handlers exposed). **Gates F033 + F042.** |
| S-jurisdictions — `member_business_jurisdictions` Tier 0 + `made_at` | `built` 2026-06-02 (committed on branch `t75`, not merged) | T075 (✅ built; 40 vitest green; live-DB migration + SQL-contract validation; M2 PROCEED — crosswalk RLS + inline-seed fixed before commit) | business-jurisdiction.md; item.md Provenance; ADR-21 | 2026-05-28 | Tier 0 (`verification_source='self_attested'`) `member_business_jurisdictions` table + RLS public-read + 2 handlers (`member.business_jurisdiction.set` / `.remove`) + `zip_metro_crosswalk` (90-row Sacramento seed) + `public.zip_is_proximal_to_location()`. `items.made_at_place_id` already shipped (020); the *provenance claim surface* is F039's, not this ticket's. Added `places.msa_code` + `locations.place_id` (spec assumed them — 2 SPEC-PATCHES filed). **Substrate gate for F037 + F039 now CLOSED** (both stay in `planning/backlog/`; PM promotes). F036 `:266` jurisdiction half greens on next eval re-run. |

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
