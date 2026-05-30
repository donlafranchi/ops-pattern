---
purpose: The ratified b1 build sequence — eight scenarios (F030–F037) plus three parallel substrate tickets that deliver the b1 user surface set in dependency order.
layer: how
status: active
---

# b1 Build Sequence — F030 → F037

**Status:** Ratified 2026-05-28. Supersedes the Phase 2 / Phase 3 sections of [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) (archived). Phase 0 / Phase 1 substrate is complete; Phase 4 doc cleanup is complete. This document is the active build sequence for the remaining b1 surface work.

**Companions:**
- [`b1-primitives-plan.md`](b1-primitives-plan.md) — b1 scoping doc (what ships at b1 in primitive / cluster / loop terms). Still load-bearing.
- [`../../product/needs/use-cases.md`](../../product/needs/use-cases.md) — canonical use-case list (restructured 2026-05-26). **Source of truth** for what each scenario must serve.
- [`../STAGE-LEDGER.md`](../STAGE-LEDGER.md) — pipeline stage tracker; new F-rows added as `scope` writes each scenario.

**Depends on:**
- [`use-cases.md`](../../product/needs/use-cases.md) — every F### scenario in this sequence anchors to exactly one MVP-tagged use case.
- [`member.md`](../../product/systems/member.md), [`groups.md`](../../product/systems/groups.md), [`item.md`](../../product/systems/item.md), [`location.md`](../../product/systems/location.md), [`places.md`](../../product/systems/places.md), [`business-jurisdiction.md`](../../product/systems/business-jurisdiction.md), [`discovery.md`](../../product/systems/discovery.md) — system specs.
- ADR-20, ADR-21, ADR-22, ADR-23 (ratified). **ADR-24** (Proposed; ratifies on its own track) — substrate gate for F036.

---

## What this document does

Defines the eight scenarios that take b1 from "substrate ratified" to "user surfaces live," in the order that builds functionality coherently. Each scenario adds exactly one layer to the prior. Three substrate tickets ship in parallel as their gates require.

The previous `rebuild-plan.md` organized work by phase (Phase 2 surfaces, Phase 3 index+Wonder). That framing accreted assumptions — Wonder at b1, MSA-depth opt-in, the F019–F024 scrapped scenarios still in exit criteria — that no longer match `use-cases.md`. This document organizes work by sequenced scenarios anchored to current use cases. The substrate that's done stays done; the surface work re-shapes around what people actually need.

## Decisions captured in this plan

- **`use-cases.md` is the source of truth.** Every F### in this sequence anchors to one MVP-tagged use case (per the Status column). The Build column tracks what each scenario delivers.
- **Sequence is by build dependency, not by use-cases.md natural order.** Producers and Organizers declare Items; Consumers consume them. Shipping consumer surfaces before any producer has declared anything yields an empty feed.
- **Wonder is OUT of b1.** O4 (Float an idea) is tagged Deferred (b2+) in `use-cases.md`. The prior rebuild-plan.md commitment to ship Wonder at b1 ("cheapest demonstration of the response-surface architecture") is superseded.
- **F025–F029 are archived.** Pre-rescope scenarios start fresh against the current primitives and rewritten use cases. See [`_attic/2026-05-28-pre-rescope-scenarios/`](../../_attic/2026-05-28-pre-rescope-scenarios/).
- **ADR-24 ratification runs on its own track.** Metro-polygon substrate work is referenced as a gate (S-metro) but the ADR ratification + DECISIONS.md update + `discovery.md` spec patch is handled separately.
- **F018 (Run Club) stays deferred.** OPEN-QUESTIONS #1 (flagship trace doc replacement) is independent of this sequence. F031 (O1) covers the recurring-gathering surface that F018 would have demoed.

---

## The sequence

| F# | Anchor | Adds | Surfaces created | Substrate gate |
|---|---|---|---|---|
| **F030** | **P1** Producer profile + lists | Group composer (kind='business'), Item composers (product, service), Group page | `/p/[…]/g/[slug]`, business Group composer, product + service composers | — |
| **F031** | **O1** Recurring gathering | Item composer (kind='gathering') with recurring schedule, Location attachment, gathering page | `/p/[…]/g/[slug]/e/[slug]`, `/m/[handle]/e/[slug]`, gathering composer | — |
| **F032** | **C1** Locality feed + follow | Home + interests onboarding, locality feed, follow CTAs on Member / Group / Location pages, "Things you follow" | `/`, `/explore`, follow buttons, `/you/following` | — |
| **F033** | **O2** Venue's recurring program | Host = kind='business' Group (Item attaches to Group), cross-host feed aggregation | extends F031 + F032; venue-page "Host something here" CTA | — |
| **F034** | **P3** Variable cadence producer | Irregular Item cadence (one-off windows), recurring-temporary Locations, ambulatory area Locations, producer scheduling view | Item-composer cadence options, `/you/schedule` | — |
| **F035** | **P4** Locally Owned + Locally Made (Tier 0) | Tier 0 self-attested ZIP step on Group composer, `made_at_place_id` step on product composer, badge rendering on Group + Item pages | extends F030 composers + Group/Item pages | **S-jurisdictions** |
| **F036** | **C2** Multi-Place awareness | `/you/locality` (add/remove secondaries ≤5, promote/demote primary, metro-polygon "wider scope" opt-in) | `/you/locality`, metro-polygon scope picker | **S-metro** (ADR-24) |
| **F037** | **O3** Multi-venue series | Cross-host aggregation in C2 feed, `member_saved_searches` substrate (b1; composer UI deferred to b2) | extends F036; substrate-only at b1 | **S-saved-search** |

---

## Per-scenario detail

### F030 — Producer profile + lists (anchor: [P1](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services))

The foundation. Without this, no Item exists for anything else to surface.

**Distinct functionality.** Group composer for kind='business' (founder = creator, owner-role membership). Item composers for kind='product' (price, photo, availability) and kind='service' (rate, service area, hours). Public Group page at `/p/[…]/g/[slug]` listing the Group's Items with resolve-up rendering (owner Member, brand label). Selling-as-individual path: Item attaches to Member directly when no Group is filed.

**Action handlers needed.** `group.create`, `group.member_join` (founder auto-join with owner role), `item.create` for kind='product' + kind='service', `item.publish`, `item.attach_location`.

**Exit criterion.** A new Member can create a kind='business' Group + list a product Item + reach the Group page in <90 seconds. The product Item page resolves up to the Group correctly. Selling-as-individual path works without a Group.

### F031 — Recurring gathering (anchor: [O1](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place))

The wedge demo — the Run Club. Builds the gathering surface that the locality feed (F032) will populate.

**Distinct functionality.** Item composer for kind='gathering' with recurring schedule (weekly / monthly / by-day-of-week). Location attachment with optional sub-venue note. Gathering page at `/p/[…]/g/[group-slug]/e/[slug]` (when filed under a Group) or `/m/[handle]/e/[slug]` (when filed under a Member). Share-link surface — a clean URL that texts / chalks / flyers cleanly. Optional Group emergence: the gathering can spawn a kind='event_anchored' Group later (substrate; surface b2).

**Action handlers needed.** `item.create` for kind='gathering', `item.publish`, `item.attach_location`, RSVP / "I'd be in" via `item.respond`.

**Exit criterion.** A Member can create a recurring gathering Item + attach a Location + reach the gathering page in <90 seconds. The page surfaces the schedule, the host, the Location, and an RSVP CTA. The share URL works without auth.

### F032 — Locality feed + follow (anchor: [C1](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love))

Consumers enter. Reads from `discoverable_items` (Phase 1 substrate); follows fan out from F030 + F031 Items.

**Distinct functionality.** Member onboarding: set `home_location_id` + `member_place_interests.primary_home` + `member_interests` tags. Locality feed at `/` and `/explore` reading from `discoverable_items` materialized view, filtered by place-interest + interest tags. Follow CTAs on Member, Group, and Location pages writing to `member_follows`. "Things you follow" management surface at `/you/following`. **No-login `/explore`** browseable (the b1 hypothesis test from `principles.md`).

**Action handlers needed.** `member.follow` / `member.unfollow`, `member.place_interest.add`, `member.profile.update`, `member.locality.set`, `member.interests.add` / `.remove`.

**Exit criterion.** A new Member onboarding for the first time sees a populated feed within 60 seconds of completing home + interests. An anonymous visitor can land on `/explore` and browse Items near a stated point. Follow click on any of Member / Group / Location adds to "Things you follow" and surfaces that target's future Items in the feed.

### F033 — Venue's recurring program (anchor: [O2](../../product/needs/use-cases.md#o2-a-venues-recurring-program-becomes-findable-alongside-everything-nearby))

Extends F031 — host can now be a kind='business' Group, not just a Person. Cross-host aggregation in the feed (extends F032).

**Distinct functionality.** Item.create for kind='gathering' accepts `group_id` referencing a kind='business' Group as the host. Venue page (Location page) surfaces "What's happening here" — all gathering Items attached to this Location regardless of host. Locality feed shows gatherings from multiple hosts side-by-side.

**Action handlers needed.** No new handlers; existing `item.create` accepts `group_id` for kind='gathering'.

**Exit criterion.** A kind='business' Group can host a gathering Item. The venue page surfaces gatherings from multiple independent hosts. The feed aggregates across hosts.

### F034 — Variable cadence producer (anchor: [P3](../../product/needs/use-cases.md#p3-a-producer-with-variable-cadence-stays-findable-to-followers))

The Ferrari Fisheries / Dip Vendor / Food Truck case. Adds irregular and ambulatory cadence to the Item shape; surfaces the producer-level scheduling view.

**Distinct functionality.** Item composer accepts: (a) irregular cadence — one-off Item with a date and a window (Ferrari: "salmon, today only, here, until 4pm"); (b) recurring-temporary Location attachment (Dip Vendor at a farmers market session); (c) area Location attachment (Food Truck working a multi-stop region). Producer-level scheduling view at `/you/schedule` aggregating upcoming Items across Locations.

**Action handlers needed.** No new handlers; existing `item.create` + `item.attach_location` accept the three cadence shapes. Schema is ready (Location kind enum + `item_locations.schedule_kind`).

**Exit criterion.** A producer can declare an irregular Item with a date + window and have it surface to followers immediately. A producer can declare a recurring-temporary attachment without needing a permanent Location. A producer working multiple stops can declare them as a sequence and have the producer profile aggregate the view.

**Note.** Push-to-followers when a P3 Item is declared rides on the **P2 bulletin substrate** (deferred to b2). At b1, surfacing happens via the locality feed only — the followers see new Items when they refresh the feed, not by push.

### F035 — Locally Owned + Locally Made badges (Tier 0) (anchor: [P4](../../product/needs/use-cases.md#p4-a-locally-owned-locally-made-producer-earns-and-displays-both-badges))

Two badges, two substrates, Tier 0 self-attested. Substrate ships at b1; surface ratification of the badge UI rendering rule is part of this scenario.

**Distinct functionality.** Group composer (kind='business') adds a Tier 0 self-attested ZIP step → writes `member_business_jurisdictions(zip, verification_source='self_attested')`. Product composer (kind='product') adds an optional `made_at_place_id` step → writes the column on `items`. Badge rendering rule on Group page ("Claimed local owner") and Item page ("Claimed locally made") computed at query time via `public.zip_is_proximal_to_location()` and `places` proximity. Honest-preview path when the ZIP is outside metro. Skip-for-now graceful path.

**Action handlers needed.** `member.business_jurisdiction.add`, item.create accepts `made_at_place_id`.

**Substrate gate.** **S-jurisdictions** — `member_business_jurisdictions` Tier 0 schema + `items.made_at_place_id` + `items.made_at_verification_source` + `zip_is_proximal_to_location()`. Lands before F035.

**Exit criterion.** A producer setting a Tier 0 ZIP claim sees the "Claimed local owner" badge surface on the Group page when proximity holds. A producer setting `made_at_place_id` on a product Item sees the "Claimed locally made" badge surface conditionally on viewer place-interest. Tier 1 (community-attested) + Tier 2 (document-supported) remain deferred.

### F036 — Multi-Place awareness (anchor: [C2](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places))

The Sacramento-spanning-multiple-Places member. Adds the locality management surface + ADR-24 metro-polygon scope.

**Distinct functionality.** `/you/locality` surface — add / remove secondary `member_place_interests` (≤5 cap, action-layer enforced), promote / demote primary_home (atomic swap, unique-primary-home invariant), change granularity. Metro-polygon "wider scope" opt-in: tap "Show me everything in Greater Sacramento" → reads `metro_polygons` via `ST_Contains` against the member's home coordinates.

**Action handlers needed.** `member.place_interest.add` / `.remove` / `.promote` / `.demote` (all already substrate; UI exposes them now).

**Substrate gate.** **S-metro** — `metro_polygons` table + Census CSA seed + `members.home_metro_id` + home-metro resolution at coordinate-save. Per ADR-24. Lands before F036.

**Exit criterion.** A Sacramento member can add Folsom as a secondary place-interest and see Folsom Items in the feed. Promote-demote works without breaking the unique-primary-home invariant. The metro-polygon "wider scope" opt-in surfaces a feed expanded to the metro CSA when the member's home is inside a metro polygon; surfaces "no metro available; using radius" otherwise (rural fallback).

### F037 — Multi-venue series (anchor: [O3](../../product/needs/use-cases.md#o3-a-multi-venue-series-spans-places-and-members-find-it-via-awareness-feed))

The Concerts-in-the-Park case. Substrate-shaped at b1 (saved-searches schema + cross-host aggregation in the feed); the saved-search composer UI is deferred to b2.

**Distinct functionality.** The feed (F036) aggregates gathering Items from multiple independent hosts when they share Place + interest match. `member_saved_searches` substrate ships at b1 so a member can have a narrower filter stored ("anything at Drake's") — but the composer UI + fan-out worker ship at b2. b1 surfaces the awareness via the F036 feed only; saved-searches are write-able programmatically (e.g., via "Follow this venue" CTA), not via a freeform composer.

**Action handlers needed.** `member.saved_search.create` / `.update` / `.remove` (all already substrate; b1 exposes the "Follow this venue" CTA on Location pages writing a default-labeled saved-search row).

**Substrate gate.** **S-saved-search** — `member_saved_searches` schema + action handlers. Per ADR-21. Lands before F037.

**Exit criterion.** A member's feed surfaces gatherings from every concert series across the Sacramento metro that match their place-interest + interest tags. The "Follow this venue" CTA on a Location page writes a saved-search row with the venue's `location_id` set. The saved-search composer is not yet built (b2 surface).

---

## Parallel substrate tickets

Three substrate tickets ship in parallel with the scenarios. They have no F-number; they bind to the spec contract listed and a memo. Per the substrate lane defined in CLAUDE.md rule 14.

### S-metro — Metro polygons (per ADR-24)

**Spec contract.** Per ADR-24 Implementation Notes. Adds: `metro_polygons (id, slug, display_name, geometry geography(MultiPolygon,4326), csa_source_id, curated_overrides_at, created_at, updated_at)`. Adds: `members.home_metro_id uuid nullable references metro_polygons(id)`. Seed job from Census CSA data. Home-metro resolution at coordinate-save time: `home_metro_id = (SELECT id FROM metro_polygons WHERE ST_Contains(geometry, :coords) LIMIT 1)` — NULL is legal (rural).

**Discovery.md spec patch.** Replace MSA-depth opt-in language with metro-polygon scope; document the radius / metro / isochrone trio (isochrone deferred T2/T3).

**Gate for.** F036.

**Memo binding.** ADR-24 (Proposed → Accepted; separate track).

### S-saved-search — `member_saved_searches`

**Spec contract.** Per `member.md` Saved searches section + ADR-21. Table: `member_saved_searches (id uuid pk, member_id, label, place_id nullable fk, location_id nullable fk, interest_tags text[], item_kinds text[], soft-delete, timestamps)`. Check: at least one of `place_id` / `location_id` / non-empty `interest_tags`. Indexes on `(member_id) where removed_at is null`, `(place_id) where place_id is not null`, `(location_id) where location_id is not null`. Owner-only RLS. Action handlers: `member.saved_search.create` / `.update` / `.remove`. Events: `member.saved_search.created` / `.updated` / `.removed`.

**Gate for.** F037 ("Follow this venue" CTA writes a default-labeled row).

**Memo binding.** ADR-21.

### S-jurisdictions — `member_business_jurisdictions` Tier 0 + `made_at`

**Spec contract.** Per `business-jurisdiction.md` Tier 0 + ADR-21. Table: `member_business_jurisdictions (id, member_id, zip text, group_id nullable fk, verification_source enum('self_attested','community_attested','document_upload') default 'self_attested', verified_at, soft-delete, timestamps)`. b1 only writes `self_attested`; other enum values reserved. Function: `public.zip_is_proximal_to_location(zip text, anchor_location_id uuid) returns boolean` — derives proximity via `places` hierarchy. Item column: `items.made_at_place_id uuid nullable references places(id)` (meaningful only when `kind='product'`). Item column: `items.made_at_verification_source text default 'none'` check `in ('none','self_attested','community_attested','document_supported')`. Action handlers: `member.business_jurisdiction.add` / `.remove`. Events: `member.business_jurisdiction.claimed` / `.removed` / `.verified`.

**Gate for.** F035.

**Memo binding.** ADR-21.

---

## Sequence rationale

- **F030 first** because nothing else has anything to display until a producer declares an Item. Empty composers stress-test the schema; empty feeds stress-test nothing.
- **F031 second** because the gathering surface is the wedge demo (Run Club) and the second source of Items for the feed.
- **F032 third** because consumers entering before there's content yields a hollow demo. By F032 we have both product/service Items (F030) and gathering Items (F031) to feed-surface.
- **F033 fourth** because it's a small delta on F031 (host shape change) and F032 (feed aggregation) — no new substrate, just extending the surface to support kind='business' Group as host.
- **F034 fifth** because variable cadence is the hardest Item shape and is best exercised after the simpler P1-shaped Items are stable.
- **F035 sixth** because badges are an opt-in producer affordance — they decorate Items + Groups that already exist. Gating substrate (S-jurisdictions) is independent and can land any time before F035.
- **F036 seventh** because multi-Place awareness depends on enough Items being declared across enough Locations to make the multi-Place selection meaningful. Gating substrate (S-metro, ADR-24) lands independently.
- **F037 last** because cross-host aggregation in the feed is a small delta on F036 + the saved-search substrate, and the surface composer is deferred to b2 anyway. The b1 contract here is substrate + the "Follow this venue" affordance.

The sequence is conservative — each step is the smallest addition to the prior that still ships something demoable. Deviations are escalable; the sequence is not a contract on internal ordering of tickets within a scenario.

---

## What was scrapped from rebuild-plan.md

- **Phase 2 "Cluster 1 surfaces"** — replaced by F030–F035 + parallel substrate. The Phase 2 surface list (Member page + Location page + Group page + Item kind-specific URLs + composers) is delivered piecewise across F030–F035 with explicit dependencies between them, not bundled.
- **Phase 3 "Locality index + Wonder + thesis + Group surfaces"** — split:
  - Locality index → F032.
  - Wonder → **dropped from b1.** O4 is Deferred (b2+) in `use-cases.md`. The Wonder primitive (Item kind enum value, child table reservation) stays in the schema; no surface ships at b1.
  - Thesis page → doc-only work, not a scenario. Treated as a tidy-pass item.
  - Group surfaces (`/g`, `/g/new`) → folded into F030 (kind='business' Group composer) + F031 (kind='event_anchored' soft emergence). Other Group kinds (place, interest, practice, family) defer their composers to b2 unless a real case forces one earlier — that re-opens via `explore` not via this sequence.
  - Concerts-in-the-Park → F036 + F037.
  - Anonymous Loop 3 path → F032 (the no-login `/explore` is part of F032's exit).
- **Phase exit criteria referencing F019–F024** — those scenarios are scrapped per the 2026-05-11 audit. The exit criteria become per-F### scenario exits in this document.
- **Sequencing/timeline table** — replaced by the F-numbered sequence. Effort estimate: 8 scenarios × ~5–10 tickets each = ~40–80 tickets. Total b1 surface work ~8–12 weeks of build, paralleled with substrate work.

## What stays in `b1-primitives-plan.md`

The scoping doc remains load-bearing. It defines what b1 ships in primitive / cluster / loop terms, names what defers, lists the data-model floor, and holds the open questions + risks register. Phase-shaped language inside that doc is now stale and a `tidy` pass should refresh: the "Suggested build sequence" section (line 125–129) should point at this document instead of `bundle-themes.md` for the next sequencing layer.

`bundle-themes.md` (cross-bundle sequencer with b1.0–b1.6 slices) and `b1-primitives-work-map.md` (menu of work per sub-bundle, tagged 🟢/🟡/⚪) remain as historical sub-bundle slicings. Their tag-level work items either map cleanly into this sequence's F-numbers or retire. A `tidy` pass should reconcile or formally retire both docs once F030 lands.

---

## ADR-24 — separate track

The metro-polygon discovery overlay (ADR-24, Proposed 2026-05-26) is referenced as the substrate gate for F036. Its ratification path is independent of this sequence and proceeds on its own:

1. PM ratifies ADR-24 (flip Proposed → Accepted).
2. Add ADR-24 row to [`planning/DECISIONS.md`](../DECISIONS.md).
3. Refine ADR-22's "Foreclosed: MSA" note to point at ADR-24 (refined-as-discovery-overlay clarification).
4. Patch [`discovery.md`](../../product/systems/discovery.md) per ADR-24 Implementation Notes — replace MSA-depth opt-in language with metro-polygon scope; document the radius / metro / isochrone trio. Add a SPEC-PATCHES row for the discovery.md edit.

Once ADR-24 is Accepted, the S-metro substrate ticket can proceed against a binding ADR. Until then, S-metro is blocked.

---

## Open inconsistencies flagged

- **P2 status mismatch in use-cases.md.** P2 (Producer bulletins) is tagged "MVP (b1)" in the Status column but "⬜ Not built — bulletin composer + delivery are b2" in the Build column. This sequence treats P2 as **substrate-at-b1, surface-at-b2** — no F-number in this pass. The bulletin push-to-followers that P3 depends on does not ship at b1; P3 followers see new Items via the locality feed only. PM to confirm the use-cases.md row should be re-tagged "MVP substrate; surface deferred" to match this sequence's treatment.

- **`region`-kind in `places`.** ADR-24 notes that `region` may drop out of the tree entirely if no URL-browsable region surfaces in b1. This sequence does not introduce a region-browse surface. ADR-24 follow-up call: drop `region` kind in a b2 ADR if no use case materializes by F037 close.

---

## Eval coverage per scenario

Each F### scenario produces Playwright + RLS-matrix evals per the standard pipeline. Eval expectations called out by scenario:

- **F030–F031** — composer flow timing (<90 seconds), public page reachability, kind-specific metadata persistence, action-handler conformance (no direct writes).
- **F032** — anonymous Loop 3 path (no-login `/explore` works); place-interest × interest-tag feed math; follow CTA writes correctly to `member_follows`.
- **F033** — host = kind='business' Group writes correct `group_id`; feed aggregates across hosts.
- **F034** — irregular-cadence Item with date + window surfaces correctly; recurring-temporary + area Location attachments persist; producer schedule view aggregates.
- **F035** — Tier 0 ZIP claim writes `member_business_jurisdictions` row with correct `verification_source`; badge surfaces conditionally on proximity test; `made_at_place_id` round-trips; viewer-side proximity rendering for Locally Made badge.
- **F036** — secondary place-interest cap enforced (≤5); promote/demote atomic-swap holds unique-primary-home invariant; metro-polygon "wider scope" works inside a metro and gracefully falls back outside one.
- **F037** — saved-search row written by "Follow this venue" CTA; feed aggregates gathering Items across multiple Place-matched hosts.

---

## What we explicitly do NOT do during F030–F037

- Ship Offer, Ask, Wonder, or Initiative kinds at a surface level. Schema reservations remain.
- Ship the Wonder→Gathering / Wonder→Initiative conversion stub. Reserved at `parent_item_id`.
- Ship the bulletin composer + push-to-followers (P2 surface). Deferred to b2.
- Ship the saved-search composer + fan-out worker. Substrate at b1 (S-saved-search); surface b2.
- Ship Tier 1 (community-attested) or Tier 2 (document-supported) verification for jurisdictions or provenance.
- Ship Group composers for kind='place', kind='interest', kind='practice', kind='family' beyond schema. Composers for these defer to b2 unless a real case forces one earlier (re-opens via `explore`).
- Ship payments / commerce rails. Items at b1 surface availability + contact; transaction is off-platform.
- Ship reviews or ratings. Permanently deferred per `service-provider.md`.
- Ship the thesis page as a scenario. Doc-only work, handled out of band.
- Ship affinity-first Group discovery (C6). Defers to b2 pending design work on "Groups cannot be auto-assigned" without violating the principle.
- Ship attestation surface (C5). Defers to b2; gates Tier 1 verification work.
- Ship service-provider trust signals (C3 / P5). Defers to b2.
- Ship stewardship tooling (O5). Defers to b2.
- Ship anything in the Cafe Capricho case (O6). Far-horizon deferred per the 2026-05-26 PM call.

Each of those is real, downstream, and not the work of this sequence.

---

## What this plan commits to

Three structural truths that survive from `rebuild-plan.md` and remain non-negotiable:

1. **The platform's grammar is "Person declares Item at Location; other Persons respond. People form Groups when they decide they are a group."** Every PR in F030–F037 produces code that reads like that grammar.

2. **Business serves people, not the other way around.** No Business entity in the schema. No `business_name` column on Members. No "Brand" abstraction beyond `brand_label` on Items / `group_businesses.display_name` on kind='business' Groups. Every reviewer holds the line.

3. **Groups are emergent, optional, never auto-assigned.** F030 creates a kind='business' Group as an explicit producer action. F033 attaches a gathering to a Group as an explicit host action. F031's kind='event_anchored' Group emergence is opt-in. The platform never enrolls a Member in a Group based on geography, follows, or attendance.

If at any scenario a proposed change requires any of these to bend, escalate to the PM, not to the data model.

---

## Approval

PM signed off on this sequence 2026-05-28. Supersedes the Phase 2 + Phase 3 sections of the prior `rebuild-plan.md` (archived). Scenarios are written one at a time via `scope`; the sequence is not a contract on internal ticket ordering inside a scenario but is a contract on the order in which scenarios open. Deviations require a JOURNAL entry naming the dependency that justifies re-ordering.
