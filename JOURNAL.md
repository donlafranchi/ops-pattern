---
purpose: PM reverse-chronological log — what shipped, what changed, what's next.
layer: how
status: active
---

# JOURNAL.md — PM Reverse-Chronological Log

**Latest entry at top.** Start here every session to understand project state.

> **Archive policy.** This file keeps only the most recent entry plus the pinned "Next session pickup" block. Older entries rotate to monthly archives so the live file stays fast to scan.
>
> Archives: [`_attic/2026-05-19/planning/JOURNAL-2026-05.md`](_attic/2026-05-19/planning/JOURNAL-2026-05.md) · [`_attic/2026-05-19/planning/JOURNAL-pre-mission-clarity-2026-05-08.md`](_attic/2026-05-19/planning/JOURNAL-pre-mission-clarity-2026-05-08.md)

---

## 2026-05-25 — URL & slug naming: ADR-0022 ratified; ADR-0023 (path compaction) drafted

PM session (Cowork) worked through the place-hierarchy "region tier" and URL/slug naming. Two ADRs resulted. **[ADR-0022 — URL & slug naming refinements](planning/adrs/ADR-0022-url-slug-naming-refinements.md)** — Status: **Accepted** (ratified 2026-05-25, intent-check CLEAN): county replaces MSA, entity slugs readable + random suffix, place slugs stay readable. **[ADR-0023 — URL path compaction](planning/adrs/ADR-0023-url-path-compaction.md)** — Status: **Proposed**: state 2-letter codes + a URL-transparent county tier (`/p/ca/sacramento/oak-park`). Both amend ADR-0020; its locality-scoped-URL architecture otherwise stands.

**Decisions captured:**

- **County replaces MSA** as the `places.kind` tier between `state` and `city`. Enum becomes `region / state / county / city / neighborhood`. MSAs leave ~1,200 rural counties with no anchor and merge sprawling metros into single tiles; counties tile the U.S. with no gaps (stable FIPS), with an admin-level-2 equivalent worldwide. The `region` kind stays for colloquial groupings ("the Bay Area"). Resolves the long-standing `places.md` open question "MSA vs metro-area definitions."
- **Entity slugs = readable + random suffix** (`summer-concert-7gx9`) for Items/Groups/Locations — readable for humans + agents, non-enumerable, collision-proof. `@handle` stays the one user-chosen vanity namespace.
- **Place slugs stay human-readable** (reaffirms ADR-0020). Readability and scrape-resistance are independent axes; the random suffix handles enumeration.
- **Design test recorded:** every naming/structural pattern is judged against *elegant, helpful, simple, reduce abuse*.

**Premise (accepted by ratifying ADR-0022):** the readable-slug rationale presumes the platform wants open-web + answer-engine discoverability.

**Status / next:**

1. ADR-0022 ratified; `places.md` patched to the county model; `DECISIONS.md` carries the ADR-22 row; ADR-0020 header + row marked "Amended by ADR-22."
2. ADR-0023 (URL path compaction) drafted **Proposed** — needs `pipeline-intent-check` then PM ratification; spec patches (`places.md` URL-rendering note, `CLAUDE.md` naming table, `location.md` / `groups.md` examples) follow ratification.
3. **Claude Code is implementing both ADRs** on web branch `t65` — handed a consolidated 8-item change set 2026-05-25 (msa→county across ~8 files + the URL compaction). T058–T064 are built but uncommitted on `t65`; this is a pre-commit fix. Clear the `web/.git/index.lock` before git ops.
4. **Open — `discovery.md` ripple (PM decision):** the community-awareness feed's wider-than-city opt-in was MSA-shaped (one opt-in reached a whole multi-county metro). `county` is narrower — the opt-in becomes county-depth, and metro-wide reach now needs a `region` row or extra `secondary` Place-interests. `discovery.md`, `member.md`, and scenarios F027–F029 say "MSA-depth opt-in" and must be re-expressed — a semantic change, not a rename.

---

## 2026-05-23 — Pipeline-plan: F026–F029 drafted; b1-work-map resynced for ADR-21

`pipeline-plan` ran on the four b1 candidates ADR-21 unblocked. All four scenarios in `planning/scenarios-backlog/` pending PM approval. The fifth candidate (`member_saved_searches` substrate at b1) lands as a **substrate ticket** per `CLAUDE.md` rule 14 — no F-number; binds to ADR-21 + `member.md` Saved searches section.

**b1-work-map.md resync** (preliminary, in lockstep with this skill rather than escalating to `pipeline-bundle-resync`):
- **b1.0** — added 🟢 "Place-interest scope" and 🟢 "Community-awareness feed (per ADR-21)" alongside the existing locality default.
- **b1.2** — retired "Become a Maker" / "Maker mode toggle" lines (already retired by ADR-12 supersession 2026-05-12; the work map had not been updated). Clarified that the existing "Claimed local owner" badge line reads `member_business_jurisdictions` per `business-jurisdiction.md`.
- **b1.4** — added 🟢 "Locally Made claim (Tier 0)" and 🟢 "`member_saved_searches` substrate (no surface)"; retired "Follow a Location" as a standalone item (per ADR-21, it's a saved-search shape now; surface at b2).

**Scenarios drafted (all in `scenarios-backlog/`, stamped in STAGE-LEDGER.md):**

- **[F026 — Maya claims Locally Owned](planning/scenarios-backlog/F026-maya-claims-locally-owned.md)** (b1.2). Sell walkthrough adds Tier 0 self-attested ZIP step → "Claimed local owner" badge surfaces on Group page when proximity test passes. Includes the "ZIP outside metro" honest-preview path and the "Skip for now" graceful-no-claim path.
- **[F027 — Maya claims Locally Made](planning/scenarios-backlog/F027-maya-claims-locally-made.md)** (b1.4). Product composer adds optional `made_at_place_id` step → "Claimed locally made" badge surfaces on Item page conditional on viewer's place-interest proximity. Asserts the sibling-badges-with-different-proximity-context behavior from `use-cases.md` #13.
- **[F028 — Sam lands in awareness feed](planning/scenarios-backlog/F028-sam-lands-in-awareness-feed.md)** (b1.0). Newcomer's onboarding seeds `primary_home` → feed has content on first land. Asserts the city-default traversal, the MSA-depth opt-in, the secondary-Place expansion, and the anonymous-visitor IP fallback.
- **[F029 — Maya manages place-interest scope](planning/scenarios-backlog/F029-maya-manages-place-interest-scope.md)** (b1.0). `/you/locality` surface — add/remove secondaries (≤5 cap action-layer-enforced), promote/demote via atomic swap (unique-primary-home invariant), change granularity. Companion to F028; together they deliver the b1.0 place-interest commitment.

**Gate A** (pipeline-plan workflow step 9 — ratified-Intent precondition): all four scenarios cite spec sections that carry Ratified or substantive `Intent` lines as of the 2026-05-23 intent-check CLEAN re-run. Gate A passes; PM can move from `scenarios-backlog/` to `scenarios/` when ready.

**Substrate-ticket lane (per CLAUDE.md rule 14):** `member_saved_searches` ships at b1 as a substrate ticket. No F-number; the ticket binds to ADR-21 + `member.md` Saved searches section. The ticket creates the table + indexes + RLS + action handlers (`member.saved_search.create` / `.update` / `.remove`) + event log entries. No UI ships at b1; the b2 surface (saved-search composer + fan-out worker + "Follow this venue" affordance) reads this substrate. Also queued in the same lane: `make_at_*` column additions to `009_items.sql` and the enum rename (`sos_lookup` → `community_attested`) on `member_business_jurisdictions`. STAGE-LEDGER row added under Substrate: "Phase 1+ — Member↔Geography substrate (ADR-21)."

**5 Deadly Sins filter applied:**
- *Scope creep* — F026/F027 don't include Tier 1 community-attestation (correctly b2+). F028 doesn't include the b1.4 "discover" page surface (separate scenario). F029 doesn't include cross-Place navigation filters (deferred).
- *Gold plating* — no Place-interest aggregate insights, no scope-sharing between Members, no bulk import.
- *Missing requirements* — all four scenarios anchor to use-cases.md (#12 or #13), name the surface, name the primitive shape, and have testable Given/When/Then beats with `Why:` annotations on non-obvious clauses.
- *Unrealistic schedules* — each scenario produces an estimated 2–5 tickets (well within the workflow's "split if 5+" rule). F029 has the most beats but each beat is small.
- *Poor communication* — every Then-clause carries either obvious-mechanics or a `Why:` annotation pointing to the foundation/system doc that justifies it.

**Pipeline state:** Ready for PM approval. After PM moves files to `scenarios/`, `pipeline-review` runs (mandatory during rebuild phase per CLAUDE.md rule 1), then `pipeline-ticket` and `pipeline-eval` (write mode) in parallel, then `pipeline-build`.

**Next session pickup:**
1. PM reviews F026–F029; approves (move to `scenarios/`) or annotates for revision.
2. `pipeline-review` on each approved scenario (architecture / design pre-flight; mandatory in rebuild phase).
3. `pipeline-ticket` breaks each into 2–5 tickets; substrate-lane tickets for the schema work land in parallel.
4. `pipeline-eval` write mode writes Playwright specs from each scenario.
5. `pipeline-build` implements; `pipeline-eval` run mode verifies.

---

## 2026-05-23 — All intent-check flags ratified; verification ladder reshape; ADR-16 fully superseded

Closing pass on the [`intent-ADR-21-and-spec-patches-2026-05-23.md`](planning/history/intent-ADR-21-and-spec-patches-2026-05-23.md) review. All 8 flags resolved; verification ladder reshaped per PM direction; ADR-16 fully (not partially) superseded by ADR-21.

**Flags resolved (Intent landed):**

- **Flag 1 — `member.md` ≤5 secondary place-interests.** Soft commitment — 5 is a starting point; revisit as Members hit the cap. Action-layer-enforced, tuneable without migration.
- **Flag 2 — `member.md` saved-search label + `discovery.md` search vision.** Labeled-saved-search is a *starting point*. Larger vision per PM: rich, LLM-enhanced search as "probably the platform's most helpful tool" — search patterns feed consumer-wants intelligence, seed Member-authored Wonders + new Groups + business proposals. New "Search as the load-bearing surface" section added to `discovery.md` covering the b1 → T3 progression.
- **Flag 3 — `discovery.md` city-depth traversal default.** Intent landed as proposed (city = legible-locality default; MSA = opt-in).
- **Flag 4 — `business-jurisdiction.md` Tier 0 b1 floor.** Intent landed against the *new* ladder shape (community-attestation Tier 1, not SOS). The b2+ deferral is about interaction-graph density, not integration cost.
- **Flag 5 — `member.md` unique primary_home (reframed).** PM observation: the constraint isn't about scope SIZE (a Place can be a neighborhood, city, or MSA), it's about the AWARENESS DEFAULT ANCHOR. Members pick their own granularity; the single primary_home enforces *one default*. Intent reframed accordingly.
- **Flag 6 — `item.md` made_at default `'none'`.** Intent landed against the new ladder; explicit `community_attested` Tier 1.
- **Flags 7+8 — full supersession of ADR-16.** Per PM direction: no "partial" disambiguation; ADR-16 is superseded by ADR-21 outright. The owner-only-RLS posture for private Member geography substrates belongs to ADR-21 now. Updates landed across `DECISIONS.md`, ADR-0016 (status: superseded), ADR-0021 (Supersedes: in full), `member.md`, `business-jurisdiction.md`, `groups.md`, `places.md`, `policy.md`, `ADR-0006-agent-assistance.md`, and `rebuild-plan.md`. ADR-16 file is now historical-record only.

**Verification-ladder reshape (PM ratification 2026-05-23) — major architecture change.** Both "Locally Owned" (jurisdiction) and "Locally Made" (provenance) share the same three-tier ladder:

- **Tier 0** — self-attested. Seller declares own jurisdiction / provenance. (b1)
- **Tier 1** — **community-attested.** Buyers and community Members attest to the seller's claim via friction-light prompts after qualifying interactions ("Does this Group operate locally?" — confirm / dissent). "Peer pressure for the greater good." Substrate (`member_business_jurisdiction_attestations`, `item_made_at_attestations`) + threshold worker + buyer-side surface ship at b2+ when the interaction graph reaches density.
- **Tier 2** — document-supported. Strongest evidence path. (b2+/b3)

The original Tier 1 framing for jurisdiction (SOS API lookup) is **retired** — community-attestation carries ground-truth that public records can't. The substrate is platform-internal (no third-party integration), structurally aligned with the two-signal framing PM ratified earlier today on E2.

Files updated for the ladder reshape: `business-jurisdiction.md` T2 (full rewrite SOS → community-attestation; new Intent block), enum values (`sos_lookup` → `community_attested`), action handlers (`verify_via_sos` → `attest_community`), event log, Policy posture three-filter analysis, Open Questions; `item.md` Provenance section (enum extended with `community_attested`; new action handler `item.attest_made_at_community`; new event); ADR-0021 Consequences (ladder reshape memorialized); `rebuild-plan.md` b1 commitments (item #8 added); `use-cases.md` #13 Maya table (updated to new tier labels).

**Pipeline state:** ESCALATE / PROPOSE cleared. Intent-check re-run pending (next session) to confirm CLEAN verdict. Once CLEAN, `pipeline-plan` can scenarioize.

**Next session pickup:**
1. Re-run `pipeline-intent-check` on ADR-21 + the seven (now eight: + `policy.md`) patched specs for CLEAN verdict.
2. If CLEAN, hand off to `pipeline-plan` for F-numbers. Likely first scenarios:
   - **Locally Owned + Locally Made badges (Tier 0 self-attested)** — substrate already specced; surface ratification needed.
   - **Community-awareness feed** — b1 surface over `member_place_interests` × `member_interests` + Place-hierarchy traversal.
   - **Saved-search composer + fan-out (b2)** — substrate ships at b1; surface at b2.
   - **Community-attestation surface + threshold worker (b2)** — Tier 1 promotion for both badges.

---

## 2026-05-23 — Category-2 absolutes from ADR-21 ratified via `pipeline-ratify-absolute` (soft-framing posture applied)

**3 statements walked, 3 revised + ratified with State-tagged Intent.** Output of `pipeline-intent-check` review [`planning/history/intent-ADR-21-and-spec-patches-2026-05-23.md`](planning/history/intent-ADR-21-and-spec-patches-2026-05-23.md). PM directed soft-framing posture across all three — no categorical refusals; commitments are "we don't do X by default, unless a defined benefit emerges, with safety measures landing alongside if X ever does."

- **E1 — `product/systems/member.md` (no stored addresses + three-substrate split).** Revised wording from "Members do not have stored addresses" to a soft commitment that the platform doesn't store street addresses at b1, revisits only on defined Member benefit, and pre-commits to safety mechanisms (per-Member opt-in, granular precision, anti-bulk-exfiltration) if addresses ever land. Intent (Ratified 2026-05-23 — soft commitment) lands as a block-quote on the *Not a Location* paragraph.
- **E2 — `product/systems/business-jurisdiction.md` + `product/systems/groups.md` (only signal → first signal + community corroboration).** Major reframe: the jurisdiction substrate is the **first signal** at b1, not the *only* signal. A **second signal** — community-member corroboration via interaction reconnaissance — comes online at b2+ when the interaction graph reaches enough density. "Peer pressure for the greater good": badge tier reflects both signals when both are present. Updated text in `business-jurisdiction.md` *What this system is* + Comments + Decisions encoded; propagated to `groups.md` Locality-and-promotion rule + pseudocode comment.
- **E3 — `product/systems/discovery.md` (no stored follow-edge for awareness feed).** Soft commitment: computation-not-storage is the b1 shape; the platform revisits only if cost / quality argues for materialization, and any stored follow-edge would land as a *performance cache* under the existing query — never as a competing product surface or follow-graph optimized for engagement. Intent block-quote landed in the *Community-awareness feed* section.

**Posture:** "No more absolutes" (PM directive 2026-05-23) — consistent with the standing soft-framing-over-absolutes preference. All three statements are now soft commitments with explicit test-for-future-proposals criteria, not categorical refusals.

**Pipeline state:** ESCALATE verdict cleared. The 5 Category-1/5/6 PROPOSE flags from the intent-check review still pending (numeric caps, label range, traversal depth, Tier 0 floor, default-`'none'`) — landable in-line by the PM without dialectic. The 2 Category-7 cross-doc flags (ADR-16 partially-superseded references in member.md and business-jurisdiction.md) likewise pending. Once those land, re-run `pipeline-intent-check` for a CLEAN verdict; then `pipeline-plan` can scenarioize.

**Next session pickup:** Land the 5 PROPOSE + 2 Category-7 Intent lines from the intent-check review. Re-run intent-check. Then pipeline-plan on F-numbers for the awareness feed, saved-search composer, and Locally Made badge UI.

---

## 2026-05-23 — ADR-21 accepted; member↔geography substrate split; six-kind affinity enum retired

**`member_location_affinities` dissolves. Three purpose-owned substrates land in its place.** Routed from `pending-ratifications.md` §7c #19 (the SOFTEN-redesign verdict earlier in the day), explored end-to-end via `pipeline-product`, ratified as ADR-0021.

- **Exploration written** — [`product/exploration/member-geography-redesign.md`](product/exploration/member-geography-redesign.md). Names the diagnosis (the six-kind enum fused three threads with different units, lifecycles, RLS postures), proposes the three-substrate split, resolves the five PM-routed questions, lists the seven spec-patch shapes.
- **ADR-0021 accepted** — [`planning/adrs/ADR-0021-member-geography-substrate-split.md`](planning/adrs/ADR-0021-member-geography-substrate-split.md). Decision, options A–D, trade-offs, consequences, 8 action items. Partially supersedes ADR-16 (privacy posture survives; table-specific text retires).
- **DECISIONS.md** — ADR-21 pointer row added; ADR-16 row updated to "Partially superseded by ADR-21."
- **`pending-ratifications.md` §7c** — item #19 (affinity-kind enum) → **RATIFIED — RETIRED**; item #22 (ADR-16) → **PARTIALLY SUPERSEDED by ADR-21**.
- **Spec patches landed** across seven docs (member, location, places, business-jurisdiction, groups, discovery, item):
  - `member.md` — *Multi-Location belonging* section retired; replaced with *Place-interest scope* (`member_place_interests` table — one `primary_home` + up to 5 `secondary` Places) and *Saved searches* (`member_saved_searches` — generalized labeled-filter shape; absorbs "follow this venue"). Old `member_location_affinities` DDL removed. RLS sketch + action handlers + event log + integration points + decisions-encoded all updated.
  - `location.md` — *Person↔Location relationship* rewritten (Items + Groups + saved-searches; no per-Location affinity row). *Member-following-Location* section rewritten as a saved-search affordance. Location-page follower rollups dropped.
  - `places.md` — `member_place_interests` integration note added; private per ADR-16-carried-forward posture.
  - `business-jurisdiction.md` — locality derivation rewrite (this spec is now the *only* substrate); "Locally Made" companion-claim cross-reference added; affinity-table notes retired.
  - `groups.md` — *Locality and promotion* pseudocode rewritten to read `member_business_jurisdictions` via `zip_is_proximal_to_location()` exclusively; `member_is_local_to_location()` references retired; the Location-vs-Group Nextdoor-pattern Intent rewritten in saved-search terms.
  - `discovery.md` — *Community-awareness feed* section added to T1 (reads `member_place_interests` × `member_interests` × `places.parent_id` traversal); candidate generation reordered.
  - `item.md` — new *Provenance claims — "Locally Made"* section: `made_at_place_id`, `made_at_verification_source` enum, action handlers, event log. Substrate at b1; surface deferred pending verification-ladder design.
- **Locally Made vs Locally Owned now sibling badges by design.** Jurisdiction answers "does the money go to a local owner?"; provenance answers "is the product made here?" Same evidence-ladder shape, different signal.

**Migration impact (clean-slate; no live data).** The migration ticket sequence in `planning/rebuild-plan.md` needs updating: don't create `member_location_affinities`; do create `member_place_interests` + `member_saved_searches` + the two new columns on `items`. Drop the three RLS-helper migration steps tied to ADR-16's named functions. **Pending — not yet done as part of this ratification.**

**Pipeline-intent-check pending.** ADR-21 + the seven patched specs introduced new absolute statements ("the Member never declares `lives`/`works` for any platform purpose," "no stored follow row drives the awareness feed," etc.) that need State-tagged `Intent:` lines. Schedule the check.

**Next session pickup.** Update `planning/rebuild-plan.md` ticket sequence; extend `product/needs/use-cases.md` with the "Locally Made" canonical anchor; run `pipeline-intent-check` on ADR-21 + patched specs; then `pipeline-plan` can scenarioize.

---

## 2026-05-23 — ADR-20 accepted; Places primitive finalized; location.md reconciled

**Places is now the platform's locality organizing principle.** Surfaced mid-walkthrough of `pending-ratifications.md` (item #17, city picker source) and ratified by PM direction.

- **ADR-20 accepted** (Proposed → Accepted, in `DECISIONS.md` and the ADR file). Locality-scoped URLs; the `places` primitive — hierarchical, platform-curated, parent-scoped slug uniqueness.
- **`places.md` finalized** — draft → active; stale pre-consolidation refs fixed (`foundational-principles.md` → `principles.md`, `policy-framework.md` → `policy.md`); ADR-20 banner updated to Accepted. Still git-untracked — commit pending.
- **`location.md` reconciled with Places** (~15 edits). Locations now carry `place_id` (anchor Place, reverse-geocoded at create); slug uniqueness moved global → `UNIQUE (place_id, slug)`; canonical URL is place-scoped (`/p/[…path]/l/[slug]`). The `location_areas.area_kind` enum **dropped `city` and `region`** — civic geography is the Places primitive, not a Member-declared area Location; `service_radius` / `neighborhood` / `custom` remain. Open question #5 (city picker source) resolved; status banner, decisions-encoded footer, integration points updated. Stale "ADR-14 pending formal write-up" claims corrected (ADR-14 is Accepted).
- **`pending-ratifications.md`** — items #16 (address normalization — deferral ratified, Intent line in `location.md`) and #17 (city picker source — curation ratified, source superseded by Places) recorded.
- **ADR-20 propagated to the naming-table docs** — `CLAUDE.md` § Naming conventions (URL column → place-scoped paths; new `places` row; `locations` UI label "Place"→"Venue" so `places` can take "Place"; rule 6 added), `item.md` naming table (resource-segment form + ADR-20 nesting note), `groups.md` (new **Place anchoring** + **Group-of-Group** sections — `groups.place_id`, per-Place slug uniqueness, `group_group_memberships` join table; stale "ADR-13 pending write-up" status corrected to Accepted), `member.md` (`/m/[handle]` confirmed global; Member-owned Item URL form noted). `area_kind` enum drop (`city`/`region` out) confirmed by PM.

**Next session pickup:**

1. **F025 reframe** — the one ADR-20 Action Item still open (AI-6). ADR-20 recommends F025's slot become the Group public page (`/p/[…place path]/g/[slug]`), with the Member public page split into a separate lighter scenario. F025 now carries an ADR-20 banner flagging this; the reframe itself is a `pipeline-plan` call for the PM. The spec-doc propagation (CLAUDE.md, item.md, groups.md, member.md) is done.
2. **Schema follow-up** — when build picks it up, the `locations` migration needs `place_id` + `UNIQUE (place_id, slug)` + the `area_kind` enum change; the `places` table is new Phase 2 work per ADR-20.
3. **Resume the `pending-ratifications.md` walkthrough** — paused at §7c (Location/Group kinds) and §9 (Sacramento seed rows).

---

## 2026-05-22 — Doc Consolidation effort CLOSED (R01–R10, 10 phases, all green)

**The doc tree is now in its consolidated shape.** Ten phases ran sequentially, each one commit on `main`:

- **R01** (`98da758`) — Every `*/archive/` folder + four individually-stale files swept into `_attic/2026-05-19/`. 100+ files moved via `git mv` (history preserved); 14 dir/file moves + 20 cross-reference rewrites.
- **R02** (`e86caaf`) — `stewardships.md` → `product/systems/`; `community-platform.md` → `product/ui/`; empty `product/surfaces/` retired.
- **R03** (`14f6696`) — `planning/reviews/` + `handoffs/` + `walkthroughs/` consolidated into `planning/history/`. 7 files moved + 19 cross-ref rewrites.
- **R04** (`903a100`) — `notes/` dissolved (`migration-to-primitives.md` → `planning/rebuild-plan.md`; two dead files to attic); `standards/` scaffolded with 5 stubs (safety / security / accessibility / performance / responsiveness) + README. 41 files touched.
- **R05** (`bcb6eb6`) — WHY layer merged: `foundational-principles.md` + `people-first.md` → `principles.md` (the constitution + the People-First Principle as Part 2). `community-design-philosophy.md` → `design-philosophy.md` (kept the rubric per mid-phase course correction; modernized references; added subject-to-change note). `policy-framework.md` → `policy.md` (rename only). 59 files touched.
- **R06** (`cc96215`) — Systems merged: four agent-stack docs (`foundation/agent-assistance.md` + `delegation.md` + `assistant-context.md` + `skills.md`) → one `systems/agent-assistance.md` with sections + shared substrate. Two producer docs (`producer-bulletin.md` + `producer-growth.md`) → one `producer-tools.md`. 35 files touched.
- **R07** (`a83bdcb`) — Capabilities + exploration consolidated: discovery triangle (`consumer-feed.md` + `locality-browse.md`) folded into `ui/community-platform.md`. `shareable-listing.md` folded into `item-view.md` + `member-profile.md` (with stale URL fix `/p/` → `/m/` and Communities → Groups). Two accountability framings merged into `exploration/accountability.md` (intentionally non-reconciling). `business-intelligence-platform.md` got a "Kept — under PM review" banner.
- **R08** (`325f818`) — `product/needs/` layer built: `canonical-examples.md` → `needs/use-cases.md` (relocated with banner); `loops.md` → `needs/member-journey.md` (relocated with banner). Two new drafts: `people.md` (8 personas + 4 TBD) and `needs.md` (13 needs in plain voice, traced to loop / system / capability / persona). 40 files touched.
- **R09** (`ef5e597`) — Document registry installed. 117 files received `purpose` + `layer` + `status` YAML front-matter via a generator script. `REGISTRY.md` at the repo root catalogs all of them grouped by WHY / WHAT / HOW. `pipeline-router` workflow + SKILL updated with a session-start registry-conformance check (lightweight; orientation, not gating).
- **R10** (this entry's commit) — Closing sweep. New `product/TRACE.md` traces every capability from need to ticket. `product/MAP.md` refreshed with a Needs section, Standards line, TRACE/REGISTRY pointers, and unified attic-paths. `CLAUDE.md` refreshed: reading order adds TRACE + REGISTRY; authoritative-docs table updated; producer-tools / agent-assistance duplications collapsed; retired-specs paragraph unified across all 2026-05 consolidations. `AGENTS.md` + skills/ audited zero broken refs. Front-matter added to CLAUDE / AGENTS / JOURNAL / MAP / TRACE / REGISTRY. JOURNAL entry (this one).

**Net headline.** 40 narrative docs across `product/` and `planning/` consolidated to 26. Seven overlap clusters dissolved. 117 docs catalogued. The repo now has a front door (MAP + TRACE + REGISTRY) and a "doc with no distinct purpose cannot quietly exist" discipline (the registry-conformance check).

**The effort folder** `housekeeping/doc-consolidation-2026-05/` retains the plan, the inventory, the reorg proposal, the 10 R-tickets with their Completion notes, and the running [PM: confirm] backlog (~18 items spanning the merge phases). Every Completion note names what was [PM: confirm]-flagged.

**[PM: confirm] backlog highlights** for the PM to walk:
- 4 TBD personas in `people.md` (Idea-Floater, Mutual-Aid Member, Trades-Pro Seeker, Community Steward) — resolve when the four `[TODO]` use-cases in `use-cases.md` get real instances.
- The standards/ stubs need content.
- The accountability merge is intentionally non-reconciled (two framings; PM picks at graduation).
- Various small wording issues flagged in the per-ticket Completion notes.

**Next session pickup:**

1. The Doc Consolidation effort is closed. Review the 10 R-ticket Completion notes for [PM: confirm] items you want to address next.
2. `product/systems/places.md` is still untracked (PM directive: another agent's workflow). Commit when ready.
3. If returning to feature work: `pipeline-router` will surface the b1 work map and the registry-conformance check at session start.

---

## 2026-05-19 — Phase 1 substrate CLOSED — 142/142 evals green; ready for Phase 2

**Phase 1 done.** T054–T057 shipped end-to-end in a single session. Final state of the rebuild's schema floor:

- **T054** (web `678f5df`) — `member_delegations` empty-scopes CHECK fix (`cardinality()` idiom replaces broken `array_length`).
- **T055** (web `7f427b8`) — Groups schema: spine + 2 children + memberships + partitioned events + standing-tier view. Cross-table RLS recursion (SQLSTATE 42P17) caught at first apply and resolved via `current_member_explicit_group_ids()` SECURITY DEFINER helper. 25 tests.
- **T056** (web `f5e7e5a`) — Items schema: spine + 4 kind children + 4 join tables + partitioned events. State-enum reconciliation (`active` dropped; `draft`/`published`/`withdrawn`/`fulfilled`/`closed`) — single deviation from `item.md`, logged in DEVIATIONS; F018 rewrite punch list will land the matching spec text edit when F018 promotes. Closes T055's deferred FK on `group_event_anchored.seeded_by_item_id`. 27 tests, first-run clean.
- **T057** (web `6090f71`) — `discoverable_items` materialized view + `item.published` refresh trigger + browse indexes + anon-grant. Synchronous CONCURRENTLY refresh per ADR-10. SECURITY DEFINER on the refresh function because materialized views don't honor RLS — the view's own WHERE clause is the public-surface gate. 10 tests.

**Phase 1 ledger:**

| Surface | Tables | Tests |
|---|---|---|
| Members + auth + privacy + interests + follows + handles + delegations + affinities | 13 | 60 |
| Locations spine + 3 children + events | 5 | 16 |
| Groups spine + 2 children + memberships + events + standing view | 6 | 25 |
| Items spine + 4 kind children + 4 joins + events | 10 | 27 |
| Discoverable-items view + refresh trigger | 1 | 10 |
| Phase 0 floor (extensions, system Member, action layer, signup hook, conformance) | n/a | 4 |
| **Totals** | **~35 tables** | **142/142** |

Conformance check clean across 125 files / 32 protected tables; no writes outside the action layer. Action handlers do not exist yet for Locations / Groups / Items per the established Phase 1 pattern — they ship with Phase 2 surface composers that need them.

**Two going-forward rules added to DEVIATIONS at T055/T057 close:**

1. **RLS recursion** — Any policy that subqueries a table with its own RLS pointing back at the first table will infinite-loop. Use a SECURITY DEFINER helper that filters strictly on `auth.uid()`. Candidate trigger for a future `engineering:code-review` checklist.
2. **`eval_indexes_for_table` returns `pg_indexes` column names** (`indexname`, `indexdef`) — not camelCase. To assert uniqueness, regex `indexdef` for `CREATE UNIQUE INDEX`.

**Next:** Phase 2 — Cluster 1 surfaces. Per the migration plan: `/m/[handle]`, kind-specific Item URLs (`/p/`, `/s/`, `/e/`, `/i/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (no `/new` picker), Item-level QR card affordance, "Sell" CTA → kind='business' Group walkthrough. Phase 2 needs fresh F-numbered scenarios authored via `pipeline-product` → `pipeline-plan` against the now-closed Phase 1 substrate. F018 (Run Club, gathering composer) remains deferred in backlog as the rewrite candidate when the b1 implementation plan recommends pulling it in.

## 2026-05-18 — F018 deferred back to backlog; Phase 1 evals committed (web `0508576`)

**F018 deferred.** PM call: F018 (Run Club) moves back to `planning/scenarios-backlog/` and stays there until the b1 implementation plan explicitly recommends pulling it in. The 2026-05-18 pipeline-review REVISE verdict stands as the rewrite punch list (item.md state-enum reconciliation; design-language.md 3 component recipes; `/i/` → `/e/` + kind-label harmonization). Rationale: T045–T049 (Phase 1 schema tickets) do not depend on F018; they open against system specs directly. Holding F018 in `scenarios/` while it needs a rewrite was creating false pressure on the spec-blocker gates. Review file annotated; scenario front-matter status updated to "deferred (2026-05-18)."

**Phase 1 evals committed (web `0508576`).** Six spec files under `web/evals/phase-1/` — `floor.spec.ts`, `locations.spec.ts`, `members-affinities.spec.ts`, `members-agent-assistance.spec.ts`, `members-augmentation.spec.ts`, `members-interests-follows.spec.ts`. 1838 lines of T045–T049 schema/RLS/trigger/handler assertions. Plus `dotenv` + `playwright.config.ts` env-loading plumbing. Same commit folded the locations centroid regex fix (full-precision `ST_AsText` output — switched to parse-and-`toBeCloseTo(..., 4)`). 16/16 in `locations.spec.ts` pass against the current schema; the rest will turn green as T045–T049 land. M3 gate is on disk.

## 2026-05-18 — Reviewed F018 — verdict: REVISE + small EXTEND; see [`planning/history/F018-review.md`](planning/history/F018-review.md)

Fresh pipeline-review on the canonical Run Club scenario (supersedes the 2026-05-08 PROCEED). Architecture substrate is still in place (Item primitive, gathering child, Location, venue-page CTA). Three small things must land before tickets: (1) `item.md` `state` enum reconciliation with the publish-event semantics; (2) `design-language.md` adds three component recipes (kind picker, Share-link affordance, Event-page recurring-gathering surface); (3) F018 scenario fixes `/i/` → `/e/` (stale from before the 2026-05-11 naming pass) and harmonizes kind-picker labels with `event-host.md` (drops "gathering" from UI copy). Loop fidelity (1 + 4), shell-entity check, and policy posture all pass.

**Same-day — ADR backlog cleanup + JOURNAL prune.** While the Phase 1 eval-write was in flight on a parallel agent, completed two parent-repo housekeeping passes that don't touch `web/`:

1. **ADR stub backlog closed.** Six "pending file creation" ADR rows in `DECISIONS.md` now have canonical files: [`ADR-0001-tech-stack.md`](planning/adrs/ADR-0001-tech-stack.md), [`ADR-0002-bottom-anchored-ui.md`](planning/adrs/ADR-0002-bottom-anchored-ui.md), [`ADR-0005-markets-as-gathering-items.md`](planning/adrs/ADR-0005-markets-as-gathering-items.md), [`ADR-0006-agent-assistance.md`](planning/adrs/ADR-0006-agent-assistance.md), [`ADR-0007-action-layer.md`](planning/adrs/ADR-0007-action-layer.md), [`ADR-0009-policy.md`](planning/adrs/ADR-0009-policy.md). Each follows the `_template.md` shape; each cross-references its home doc (the home doc stays load-bearing; the ADR file is the canonical index entry per `adrs/README.md` § What belongs here). `DECISIONS.md` pointer rows lost the *(pending file creation)* markers; the closing-paragraph note rewritten to reflect the backlog closure.

2. **JOURNAL rotated.** Per the archive policy banner, May 11–17 entries (ADR organization restructured, payments.md walk, Intent-audit pass + clarify-absolutes / dialectic skills + groups.md walk, agent-commerce amendment, ADR-15/16 ratification, root-level philosophy moves, action-layer graduation + producer-* re-anchor + Phase 4 doc cleanup + naming pass) all moved to [`_attic/2026-05-19/planning/JOURNAL-2026-05.md`](_attic/2026-05-19/planning/JOURNAL-2026-05.md). Live file kept just this top entry + the pinned pickup. No silently-load-bearing decisions surfaced as unmemorialized — every commitment in the archived entries already has a home in a spec, ADR, or skill workflow.

---

## Next session pickup

*(Pinned. Rewritten at the close of every session. The list below is the *current* set, not history.)*

1. **Phase 0 — DONE 2026-05-10.** All four tickets shipped, runtime-verified end-to-end. Substrate installed: pgvector + postgis; members + member_events with audit fields; system Member; action layer + `member.create` handler with conformance check; auth signup hook reading Vault. Smoke test (curl-spawn fresh auth user → row + event appear in 2s with correct audit fields) passes. See `web/BUILD-LOG.md` for the full closing record.

2. **Phase 1 — DONE 2026-05-19.** Substrate complete: Members + Locations + Groups + Items + discoverable_items. T041–T057 all shipped. Phase 1 eval suite **142/142 green**. Conformance: 0 violations across 125 files / 32 protected tables. Tickets T054–T057 shipped end-to-end this session: T054 (delegations CHECK fix), T055 (Groups schema + SECURITY DEFINER helper for cross-table RLS), T056 (Items schema + state-enum reconciliation + deferred-FK closure), T057 (discoverable_items view + refresh trigger). See top JOURNAL entry for the full closing summary.

3. **Phase 2 — NEXT.** Fresh F-numbered scenarios authored at Phase 2 open. Surfaces per the migration plan: `/m/[handle]`, kind-specific Item URLs (`/p/`, `/s/`, `/e/`, `/i/`, `/o/`, `/a/`, `/initiative/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (no `/new` picker), "Sell" CTA → kind='business' Group walkthrough, Item-level QR card affordance. Action handlers for Members / Locations / Groups / Items land alongside the surfaces that need them. F018 (Run Club, gathering composer) is the rewrite candidate when the b1 implementation plan recommends pulling it in.

4. **Phase 1 numbering deviation** — the rebuild plan listed migrations 007–011 by primitive (members augment → locations → items → groups → discoverable_items). Dependency-driven actual order: 007 locations → 008 locations RLS → 009 members_phase1 → 010 member interests/follows → 011 member affinities → 012 agent assistance → 013 delegations CHECK fix → 014 groups → 015 items → 016 discoverable_items. No spec changes; closed cleanly.

5. **Eval-helper RPCs** — all shipped under T052 (Phase 0) and T053 (Phase 1): `eval_pg_extensions`, `eval_table_shape`, `eval_is_partitioned`, `eval_partition_count`, `eval_indexes_for_table`, `eval_foreign_keys_for_table`, `eval_conformance_check_result`, `eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`, `eval_seed_auth_user_only`, `eval_location_geography_text`. Bootstrap script in `web/scripts/bootstrap-eval-helpers.ts`.

6. **F018 deferred (2026-05-18).** Scenario back in `planning/scenarios-backlog/`; rewrite candidate for the Phase 2 gathering composer. Punch list ([F018-review.md](planning/history/F018-review.md)) — `item.md` state-enum text edit (T056 reconciled to `draft/published/withdrawn/fulfilled/closed` already; the spec text still needs aligning), three `design-language.md` component recipes (kind picker, Share-link, Event-page recurring surface), `/i/` → `/e/` URL pass + kind-label harmonization with `event-host.md`.

7. **All pre-primitives scenarios archived as of 2026-05-11.** F019-F024 scrapped 2026-05-10; F001-F017 scrapped 2026-05-11 (PRE-PRIMITIVES-AUDIT-2026-05-11.md in `_attic/2026-05-19/planning-scenarios-backlog/` documents the mapping). Live `planning/scenarios/` contains only F018 (canonical post-primitives example). Fresh Phase 2/3 scenarios will be authored under the current primitives when those phases open. F-numbers continue from F025+.

8. **Phase 2/3 scenarios to author fresh** (when Phase 0+1 close): per the rebuild plan, Phase 2 surfaces are `/m/[handle]`, kind-specific Item URLs (`/e/`, `/p/`, `/s/`, `/i/`, `/o/`, `/a/`, `/initiative/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (event / product / service), "Sell" walkthrough (creates kind='business' Group), Item-level QR card affordance. Phase 3 surfaces are `/explore` (no-login), `/g`, `/g/new`, `/why`, Wonder composer, Concerts-in-the-Park feed, anonymous Loop 3 path. Each gets a fresh F-numbered scenario via `pipeline-product` → `pipeline-plan`.

9. **Phase 4 doc cleanup — DONE 2026-05-11.** All items completed. Live `product/` tree has no stale pre-primitives framing.

10. **Deferred doc cleanup — pick up at the Phase 1 → Phase 2 boundary (after T049 closes).** The `notes/` → `planning/` migration is half-done as of 2026-05-11; the riskiest piece (moving `planning/rebuild-plan.md` itself, which every STALE-banned ticket and the active T045–T049 tickets reference) was deferred to avoid mid-phase reference breakage. Remaining work: (a) `mv planning/rebuild-plan.md planning/rebuild-plan.md`; (b) update ~25 references in STALE banners on tickets T028–T040, DEVIATIONS.md (lines 60 + 112), PIPELINE-AUDIT.md (5 spots), DECISIONS.md (ADR-10 row), `product/foundation/platform-promise.md` (line 11), `product/systems/location.md` (line 166), the CLAUDE.md "What ships in the rebuild MVP" row; (c) `rmdir notes/` once empty; (d) move `_attic/2026-05-19/notes/skills-migration-plan.md` → `_attic/2026-05-19/planning/skills-migration-plan.md`.
