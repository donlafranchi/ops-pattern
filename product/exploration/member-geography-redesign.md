---
purpose: Redesign the member↔geography awareness model; separate seller-locality, community-awareness, and follow.
layer: what
status: draft — pending plan ratification and ADR-0021
---

# Exploration: Member ↔ Geography Awareness Redesign

**Origin:** `planning/pending-ratifications.md` §7c item #19 (the six-kind `member_location_affinities` SOFTEN — *redesign* verdict, 2026-05-23). The enum (`lives`, `works`, `plays`, `visits`, `follows`, `liked`) fuses three distinct threads. Each thread wants a different shape, lifecycle, RLS posture, and consumer surface. This exploration takes them apart.

**Touches:** [`member.md`](../systems/member.md) · [`location.md`](../systems/location.md) · [`places.md`](../systems/places.md) · [`business-jurisdiction.md`](../systems/business-jurisdiction.md) · [`discovery.md`](../systems/discovery.md) · [`groups.md`](../systems/groups.md) · `item.md` (new "locally made" claim) · ADR-16 (scope change) · new ADR-0021 (this redesign).

**ADR flag:** **Yes — new ADR required.** The six-kind enum and the `member_location_affinities` table itself dissolve into three separately-owned substrates. ADR-16 (per-row privacy on affinities) needs supersession in scope, not in spirit — the privacy posture survives, but it now applies to `members.home_location_id` and the new `member_place_interests` table, not to a six-kind affinity table that no longer exists. Proposal: **ADR-0021 — Member↔Geography substrate split.**

---

## The diagnosis

The current model says: *a Member has affinities to Locations, kind-tagged six ways.* That sentence is structurally wrong on three counts.

1. **Wrong unit on two of the threads.** Community awareness wants a **Place** (the curated geographic scope per `places.md`), not a Location (a specific declared point). The Member who cares about "what's happening in Sacramento" cares about the city-as-Place, not about a row in `locations`. Forcing the relationship to attach to a Location row produces the question "which Location row stands for Sacramento?" — and the answer is *none, because Sacramento is a Place, not a Location* (per ADR-20).

2. **Wrong primitive for "owner locality."** `lives` and `works` were doing double duty: half-private signal of where the Member spends time, half-public input to the "Locally Owned" derivation in `groups.md`. ADR-16 already noticed the privacy half is incompatible with the public half and moved the public half to `member_business_jurisdictions` (per `business-jurisdiction.md`). The redesign finishes the migration: `lives` / `works` exit `member_location_affinities` entirely. The private half (a Member's own record of "places I belong to") was never a feature need — no surface consumes it except the public locality derivation, which is now jurisdiction-served.

3. **Wrong shape for "follow."** A raw `follows` row on a Location is a thin, low-signal subscription — what is a Member subscribing *to*? Items posted at that Location. But Items posted at a Location almost always belong to a Group anchored at that Location, or a Member the follower already follows, or a kind ('outdoor live music gathering') the follower's `member_interests` already covers. The `follows` row was redundant with the existing follow graph plus interests plus Place — except for the residual case of "I want notifications for *this specific venue*'s events even though no Group anchors here," which is a saved-search shape, not a separate affinity kind.

**Net:** the six-kind enum collapses. `plays`, `visits`, `liked` are dropped (no consumer surface ever earned them — they were aspirational substrate that never grew a feature). `lives` and `works` move to `member_business_jurisdictions`. `follows` becomes a saved-search on the Discovery substrate. What remains of "the Member ↔ geography relationship" is three things, each in its right home.

---

## The three threads, separately

### Thread A — Seller locality (Owner residence + Product provenance)

**Owner residence — "Locally Owned" badge.** Lives in `member_business_jurisdictions` per [`business-jurisdiction.md`](../systems/business-jurisdiction.md). This is the only substrate the platform consults to decide whether a kind='business' Group is *locally owned*. The Member declares a ZIP (Tier 0 self-attested → Tier 1 SOS-verified → Tier 2 document-uploaded); the proximity test runs via `public.zip_is_proximal_to_location()` against the Group's anchor Location. No `member_location_affinities` row is consulted for this derivation any longer. The current `groups.md` pseudocode that reads `lives` / `works` via `public.member_is_local_to_location()` is **superseded** — the derivation now reads `member_business_jurisdictions` exclusively.

**Spec patch — `groups.md` (Locality and promotion section):** replace the "any of `lives` / `works`" rule with "any owner Member holds a `member_business_jurisdictions` row that passes `zip_is_proximal_to_location()`." Function `public.member_is_local_to_location()` is removed; the only locality-derivation path is `zip_is_proximal_to_location()` through the jurisdiction substrate.

**Product provenance — "Locally Made" badge.** A distinct claim from owner residence, and a new one. *Locally Owned* answers "does the money go to a local owner?" *Locally Made* answers "is the product made here?" The two diverge often — a Sacramento Member who imports finished goods from overseas is locally owned, not locally made; a Member who designs and stitches every piece in their Oak Park studio is both. A national chain franchise is neither, but the franchisee owner may be locally resident, surfacing as locally owned only.

  Substrate: a new column on `items` (kind='product' only — services don't have a "made-at" location in the same sense, though a follow-on exploration may extend the shape to "service area" or "service-from"). Shape:

  - `items.made_at_place_id` (nullable FK to `places`) — the Place the Member declares the product is made in. Self-attested at Tier 0; same evidence ladder as jurisdiction (Tier 0 self → Tier 2 document-supported, e.g., facility lease, manufacturing-source attestation) at higher tiers.
  - `items.made_at_verification_source` enum: `none` / `self_attested` / `document_supported`. Default `none` for kind='product' Items where the seller has not made a claim; `self_attested` once they declare.

  The "Locally Made" badge surfaces on the Item page (and on Item cards in discovery) when:
  - `made_at_place_id` exists, AND
  - the viewer's home Place is proximal to `made_at_place_id` (same proximity test as jurisdiction, but Place-to-Place instead of ZIP-to-Place — the substrate is already there in `places.parent_id` containment).

**Spec patch — new `item.md` section "Provenance claims":** introduces `made_at_place_id`, the verification-source enum, the Member action handler `item.set_made_at`, the event log entries (`item.made_at_set`, `item.made_at_removed`, `item.made_at_verified`). Reserved at b1 schema; surface ratification deferred — *the "Locally Made" badge is product-policy ground that needs PM design (verification ladder shape, edge cases like "assembled in California from imported components") before pipeline-plan can scenarioize it.* Open question at the bottom of this exploration.

**Net for Thread A:** seller locality is fully out of `member_location_affinities`. The substrate is jurisdiction (owner side, existing) + Item provenance (product side, new). Both are *public claims with public evidence tiers* — different from the private affinity model the old enum tried to be. The privacy story is cleaner: the Member declares jurisdictions and provenance because they want the badge; the platform stores ZIPs and Places, never addresses.

### Thread B — Community awareness (computed feed, anchored on Place + interests)

The feed of *relevant happenings near me* is computed from two inputs:

1. The Member's set of **Places they care about** — primary home Place plus a small set of secondary Places. New substrate (below).
2. The Member's `member_interests` tags — the existing controlled-vocabulary affinity list per Member.

No stored "follow Location X" row participates in feed generation. The feed is **computed at query time** from Items whose anchor Place (resolved through their attached Locations) is in the Member's Place-interest set and whose tags / kind overlap the Member's interests. This is the surface that delivers the canonical "Concerts in the Park" use case — the *kind* of thing (outdoor live music gathering) at the *Places* the Member follows (parks in the Sacramento MSA), without needing a row per park.

**New substrate — `member_place_interests`** (replaces the `follows` affinity kind for the community-awareness purpose):

```sql
create table member_place_interests (
  member_id   uuid not null references members(id) on delete cascade,
  place_id    uuid not null references places(id) on delete cascade,
  scope_kind  text not null
    check (scope_kind in ('primary_home','secondary')),
  created_at  timestamptz not null default now(),
  removed_at  timestamptz,
  primary key (member_id, place_id, scope_kind)
);
```

- `primary_home` — the single Place that's the Member's "home scope," the locality default for the community-awareness feed. Derived from `home_location_id`'s `place_id` at onboarding; mutable. One row per Member; the trigger that maintains it lives in the `member.locality.set` action handler.
- `secondary` — additional Places the Member opts into ("I live in Oak Park but I care about all of Sacramento" → primary_home = Oak Park, secondary = Sacramento; "I work in Davis and live in Sac" → primary_home = Sac, secondary = Davis). Capped at 5 at b1 (cap is a working answer; the cap exists so feed-cost stays bounded). Member-managed from the locality settings.

**Why "several Places" instead of "one Place"?** A Member who lives in a neighborhood almost always *also* cares about their city, often *also* cares about their MSA. A single-Place model forces a granularity choice the Member doesn't want to make. The hierarchy (`places.parent_id`) provides the structural answer — `primary_home` is the most specific Place; the awareness feed traverses up to the city level by default. `secondary` is for the cross-Place case (a Member with a meaningful relationship to a separate place — a vacation city, a work city, a hometown). Three rows, not 30.

**Why not just "compute from `home_location_id` upward"?** Because that misses the cross-Place case. A Member who works in Folsom and lives in West Sac has a real interest in Folsom news; that's a *secondary* Place, not a parent of their home. The traversal handles the within-hierarchy case; the secondary set handles the cross-hierarchy case.

**Spec patch — `discovery.md`:** community-awareness feed reads:
- Items whose attached Location's `place_id` (or any ancestor via `places.parent_id`) is in `(member_place_interests where scope_kind in ('primary_home','secondary') and removed_at is null)`.
- Filtered by `member_interests` tag overlap and by Item kind (the Member who tagged `live-music` sees gathering Items more than product Items at the same Places).
- Scored per the existing Discovery rubric — locality decay falls out naturally because the candidate set is already Place-bounded.

The current `member_location_affinities` `affinity_kind='follows'` substrate that `discovery.md` and `location.md` reference (the "Concerts in the Park" surface, the `idx_affinity_location_followers` index, the `public.count_followers_for_location()` aggregate) is **retired**. The aggregate function disappears with the table; the Location page's "N Members follow this Location" rollup either disappears entirely or, if a surface still wants it, re-derives from saved-searches scoped to that Location (Thread C below). PM call: drop the rollup at b1; the count-of-followers surface was speculative anyway.

### Thread C — Follow (Group, Member, saved interest-in-a-Place)

Following has always been a relationship to a *thing that posts* — a Member, a Group, or a query that resolves to a stream of Items. Following a bare Location was the leakiest form because Locations don't post; Items get attached to them, and those Items have authors and Group anchors that are already followable.

**Three follow surfaces survive:**

1. **Follow a Member** — existing `member_follows` substrate, unchanged. The Member I want updates from.
2. **Follow a Group** — existing `group_memberships.source='soft_via_follow'` substrate, unchanged. Public-facing: I subscribe to a Group's stream without joining as a member.
3. **Follow an interest-in-a-Place** — new substrate, the saved-search shape:

```sql
create table member_saved_searches (
  id            uuid primary key default gen_random_uuid(),
  member_id     uuid not null references members(id) on delete cascade,
  label         text not null check (char_length(label) between 1 and 80),
  place_id      uuid references places(id),
  location_id   uuid references locations(id),
  interest_tags text[] not null default '{}',
  item_kinds    text[] not null default '{}',
  created_at    timestamptz not null default now(),
  removed_at    timestamptz,
  check (place_id is not null or location_id is not null or array_length(interest_tags,1) > 0)
);
```

A saved search is the *generalized* follow primitive. It can be Place-scoped (`place_id=Capitol Park's Place`), Location-scoped (`location_id=Drake's`, for the rare "I want anything at this specific venue" case), interest-scoped (`interest_tags=['outdoor','live-music']`), or any combination. The check constraint enforces that at least one filter is set. The Member labels the search ("Concerts in the parks I like," "Anything at Drake's," "Sourdough drops in Oak Park").

  The "follow a venue" case **survives as a Location-scoped saved-search**, not as a distinct affinity kind. The UI affordance ("Follow this venue") on a Location page creates a `member_saved_searches` row with `location_id` set and label auto-derived from the venue's name. A Member who wants the same shape via a one-tap button gets the same behavior; the substrate is general rather than special-cased.

**Why one general substrate instead of a Location-follow table plus a saved-search table?** Because the saved-search is what the Member *meant* in every case. "Follow Drake's" really meant "show me Items at Drake's." The Location row alone doesn't carry the *interest filter* the Member needs to make the subscription useful — if Drake's hosts 12 distinct things, only 3 of which the Member cares about, the bare follow row over-subscribes. A saved-search makes the filter explicit.

**Notification fan-out:** a new Item attached to Location L fires `item.attached_to_location`. The fan-out job evaluates each `member_saved_searches` row whose `(place_id, location_id, interest_tags, item_kinds)` matches the new Item, and notifies the saving Member. The fan-out is *pull-shaped* (match-at-fire) rather than *push-shaped* (precomputed follower set), which is fine at b1's scale; pushing precomputation in is a T2/T3 question.

**Spec patch — new `member.md` section "Saved searches":** introduces `member_saved_searches`, the action handlers (`member.saved_search.create`, `.update`, `.remove`), the event log entries, and the b1 substrate-only commitment (the surface ships at b2 alongside DM and follow-stream surfaces). The `member_follows` and `group_memberships` substrates are unchanged.

**Spec patch — `location.md`:** the "Member-following-Location" section is rewritten — Location-follow is no longer a distinct affinity row; it's a UI affordance over the saved-search substrate. The Location page may surface a "Follow this venue" button that opens the saved-search composer pre-filled with `location_id` and an interest-tag picker. The "N Members follow this Location" rollup is dropped (or, if a surface insists, computed over `member_saved_searches where location_id = $L` — but that count is approximate, not authoritative, because saved-searches are general).

---

## Resolutions to the routed questions

1. **Does follow-a-venue survive?** Yes, as a Location-scoped saved-search, not as a distinct affinity kind. The substrate is `member_saved_searches`; the UI affordance is a "Follow this venue" button on the Location page that pre-fills the composer.

2. **Is community-scope one Place or several?** Several. One `primary_home` Place + up to 5 `secondary` Places, in `member_place_interests`. The hierarchy in `places.parent_id` handles the within-hierarchy traversal; the secondary set handles cross-Place interests (work city, hometown, vacation city).

3. **Is the feed fully computed from home-Place + interests, or is there a stored follow row?** **Fully computed.** No stored follow row drives the awareness feed. The Member's `member_place_interests` rows + `member_interests` tags + the existing Group / Member follows fully determine the candidate set. Saved-searches (Thread C) are a *separate* surface — a stream of notifications for narrow, Member-labeled filters — not the feed.

4. **Where exactly do lives/works land in `business-jurisdiction.md`?** They don't land — they were already gone in spirit (ADR-16 moved the public derivation to `member_business_jurisdictions`). This exploration finishes the move: `lives` and `works` exit `member_location_affinities` entirely. The Member never declares them again; the seller does declare a *jurisdiction ZIP* in `member_business_jurisdictions`, which serves the same public derivation purpose with public evidence. The `home_location_id` column on `members` stays (private locality default per ADR-4), unchanged.

5. **What survives of "multi-location belonging"?** As stored substrate, very little — and that's correct.
   - `members.home_location_id` — the private locality default (ADR-4). One per Member. Stays.
   - `member_place_interests` — multi-Place awareness scope. Up to 6 per Member. New.
   - `member_business_jurisdictions` — seller-only, public, evidence-tiered. Existing.
   - `member_saved_searches` — generalized follow / interest-in-a-Place. New.
   - Group memberships (any kind) — explicit affiliations, unchanged.

  What *doesn't* survive: the `member_location_affinities` table itself. The six-kind enum is retired. The three SECURITY DEFINER functions named in ADR-16 (`public.count_likes_for_location`, `public.count_followers_for_location`, `public.member_is_local_to_location`) are retired with it — none have surviving consumers under the redesign. The privacy posture ADR-16 established (owner-only RLS on per-Member geographic substrate) carries over to `member_place_interests`: a Member's place-interests are *private* (owner-only RLS), because that substrate carries the same "where I spend my attention" signal `lives` / `plays` were trying to carry, and the same doxxing-prevention rationale applies.

---

## Spec-patch summary

For pipeline-plan to scenarioize this redesign, the following spec edits land first (this exploration is the source-of-record until ratified):

| Spec | Patch shape |
|---|---|
| `member.md` | Retire the *Multi-Location belonging* section. Replace with two sections: *Place-interest scope* (the `member_place_interests` substrate + `primary_home` / `secondary` semantics + RLS) and *Saved searches* (the `member_saved_searches` substrate, b1-substrate-only). Retire the `member_location_affinities` DDL and the three SECURITY DEFINER function references. Update RLS sketch. Update *Decisions encoded* to reflect ADR-16 scope change. Mark ADR-16 as **partially superseded** (privacy posture survives; the table it applied to dissolves). |
| `location.md` | Rewrite the *Person↔Location relationship* section: drop the six-kind affinity enum; replace with "Members relate to Locations through Items attached, Groups anchored, and saved-searches (per `member.md`)." Drop the "Member-following-Location" subsection's affinity-table substrate; rewrite as a UI affordance over saved-searches. Drop the `count_followers_for_location()` / `count_likes_for_location()` Location-page rollups (or annotate them as deferred until a real surface needs them). |
| `places.md` | Add an *Integration* note: `member_place_interests` references `places.id`; place-interest scope is the substrate for community-awareness feeds. Reinforce that `member_place_interests` is *private* (per the ADR-16-style privacy posture, carried over). |
| `business-jurisdiction.md` | Drop the *Note on relationship to `member_location_affinities`* paragraph (the table is dissolving; the note becomes moot). Update the locality-derivation pseudocode in `groups.md` (the patch lands in `groups.md`, not here, but this spec references that derivation — confirm wording stays consistent). Add a brief reference to the new "Locally Made" companion claim in `item.md` — they're sibling badges, designed together. |
| `groups.md` | Replace the *Locality and promotion* derivation: drop the `any of lives / works` path; the only derivation reads `member_business_jurisdictions` via `zip_is_proximal_to_location()`. Drop the `public.member_is_local_to_location()` reference. |
| `discovery.md` | Add a *Community-awareness feed* section to T1: candidate set scoped by `member_place_interests` + traversal up `places.parent_id` to the city level by default; secondary Places treated as parallel scopes; filtered by `member_interests` and Item kind. Drop the `affinity_kind='follows'` substrate references. |
| `item.md` | Add a *Provenance claims — "Locally Made"* section: `items.made_at_place_id`, `items.made_at_verification_source`, action handlers (`item.set_made_at`, `item.remove_made_at`, `item.verify_made_at_document`), event log entries. Substrate at b1; surface ratification deferred (the verification ladder shape is open product policy). |

---

## Data model implications

**Required at MVP — retrofit is the failure mode.**

- **New table:** `member_place_interests` (above). Cheap to land at b1; consumers (Discovery community-awareness feed at T1) are immediate.
- **New table:** `member_saved_searches` (above). Reserved at b1; the surface ships at b2 alongside DM and follow-stream. The b1 commitment is the schema, the RLS posture, and the action handlers — no surface, no fan-out job.
- **New columns on `items`** (kind='product' rows only — enforced by partial check or by application-layer guard): `made_at_place_id` (nullable FK to `places`), `made_at_verification_source` (enum). Reserved at b1; surface (the "Locally Made" badge) ratifies through `pipeline-product` design pass before pipeline-plan scenarioizes.
- **Drop:** `member_location_affinities` table, its three indexes, the three SECURITY DEFINER functions. Affinity-write action handlers (`member.location_affinity.add`, `.remove`) and their event-log entries retire. Because this redesign predates any b1 ticket that creates `member_location_affinities`, the *drop* is really a *don't-create*: the migration ticket sequence in `planning/rebuild-plan.md` removes the affinity-table creation steps before they run.
- **ADR-16 scope change:** the privacy posture (owner-only RLS, named privileged paths for cross-Member computation, service-role bypass for backend pipelines) survives and applies to `member_place_interests`. The named functions disappear because no consumer survives (`member_is_local_to_location` is replaced by `zip_is_proximal_to_location` in `business-jurisdiction.md`; the count rollups are dropped). ADR-16's table-specific text is **superseded in scope by ADR-0021;** the posture carries over.
- **Event log entries (new at b1):**
  - `member.place_interest_added`, `member.place_interest_removed`, `member.place_interest_promoted` (a secondary becomes primary_home), `member.place_interest_demoted`.
  - `member.saved_search.created`, `member.saved_search.updated`, `member.saved_search.removed` — reserved at b1; the surface and fan-out are b2.
  - `item.made_at_set`, `item.made_at_removed`, `item.made_at_verified` — reserved at b1; the surface is gated on PM ratification of the verification ladder.
- **Event log entries (retired before they land):** `member.location_affinity_added`, `member.location_affinity_removed`. Replaced by the place-interest events above.

---

## Policy posture (per ADR-9)

The redesign tightens the privacy story across all three threads.

- **Seller locality.** Jurisdiction substrate is *public by design* (a ZIP claim under a public evidence tier). The substrate's privacy posture is unchanged from `business-jurisdiction.md`. Item provenance (`made_at_place_id`) is also public by design — the Member declares it precisely because they want the "Locally Made" badge.
- **Community awareness.** `member_place_interests` is *owner-only at the row level* (carries the ADR-16-style posture forward). The Place-interest set is "where the Member spends attention" — same doxxing-prevention rationale as `lives` / `works` carried. Aggregate computation over place-interests (e.g., "how many Members opted into Sacramento as a secondary place?") flows through a named SECURITY DEFINER function (TBD when a consumer surface earns it) rather than direct SELECT.
- **Follow / saved-search.** `member_saved_searches` is *owner-only*. Saved-search labels carry Member intent and are private. (A Member's followed Groups and Members are governed by the existing `show_following` / `show_followers` privacy toggles on `member_privacy`; the saved-search substrate stays separate from that follow-graph visibility.)

The three-filter test:

- *Helpful?* Yes on all three. Seller locality drives the "Locally Owned" + "Locally Made" badges (the platform's single most consequential commercial affordance). Community awareness drives the locality-first feed (Loop 3, the canonical *find what's happening near me* surface). Follow / saved-search drives Loop 8 (subscriptions) and gives Members the granular notification control the platform's anti-Nextdoor commitments need (no Location wall, no Location feed — but yes, a Member-curated stream of "Items at this venue I care about" via saved-search).
- *Harms others?* Seller locality is public-by-Member-declaration. Community awareness and follow / saved-search are owner-only. No surface exposes another Member's place-interests, saved-searches, or follow streams without that Member's explicit opt-in.
- *Abusable?* The redesign closes the abuse vector the six-kind enum carried — a Member couldn't fudge `lives` to game the locally-owned badge because the badge derivation moved off the affinity table to jurisdiction in ADR-16, and this redesign makes that the only path. Community awareness can't be used as an addressability surface (no `send-to: members in Place X` exists; `member_place_interests` is *read* by feed candidate generation, never *consulted* for messaging targets). Saved-searches are personal; they don't create constituencies.

---

## Open questions

1. **"Locally Made" verification ladder shape.** Tier 0 self-attested is straightforward; Tier 2 document-supported (facility lease, manufacturing-source attestation) needs design — different evidence than the SOS / EIN-letter ladder for jurisdiction. Routed back to `pipeline-product` once a real seller case forces the question.

2. **Edge case — "designed in Sacramento, assembled in Vietnam."** Common pattern; does the "Locally Made" badge require both? Working answer: the badge reads on `made_at_place_id` (where final assembly happens). A "designed in" surface is a separate, lower-trust signal — possibly an Item-level free-text field, not a badge. Defer to seller-case scrutiny.

3. **Edge case — services with no "made-at" place.** A plumber's service has no physical provenance. Working answer: "Locally Made" only applies to kind='product' Items; services are covered by "Locally Owned" via the kind='business' Group anchor. Don't extend `made_at_place_id` to services.

4. **`member_place_interests` secondary cap.** Working answer: 5 secondaries. The cap exists to bound the feed candidate-set cost. Revisit if Members consistently hit the cap.

5. **Saved-search fan-out shape.** Pull (match-at-fire) is fine at b1's scale; precomputed (push) becomes necessary when a popular Location attracts hundreds of saved-searches. Don't precompute at b1.

6. **What replaces the `count_followers_for_location` rollup on the Location page?** Working answer: drop the rollup. The "N Members follow this venue" count was speculative; the surface adds no value over the Items-attached-here listing. If a real case earns the rollup at b2, derive from `member_saved_searches where location_id = $L`.

7. **Hierarchy traversal default depth.** The community-awareness feed traverses from `primary_home` up the `places.parent_id` chain. Default depth: stop at city. Allow Member-configurable depth (city / MSA / state)? Working answer: city default, MSA opt-in via a setting, state never (too noisy). Confirm before T1 community-awareness surface ships.

8. **Interaction with `member_interests` controlled vocabulary.** Saved-searches reference `interest_tags` as `text[]`. Are these the same vocabulary as `member_interests`? Working answer: yes — same controlled list. Drift between the two would split discovery surfaces; keep them aligned.

9. **Migration cost.** Because no production data exists (`rebuild-plan.md` is a clean-slate rebuild, not a live migration), the cost of this redesign is *spec edits + the four affected migration tickets* — not data migration. Confirm with the build agent that no in-flight ticket has already created `member_location_affinities`; if it has, retire-before-ship rather than drop-and-recreate.

---

## Canonical example anchor (for pipeline-plan)

The redesign should land scenarios anchored to these `product/needs/use-cases.md` cases:

- **Concerts in the Park** (community-awareness feed: Member's place-interests cross with `live-music` + `outdoor` tags; surfaces gathering Items attached to any park Place under Sacramento MSA without requiring per-park follow rows).
- **Maya at Oak Park Sourdough** ("Locally Owned" via jurisdiction; "Locally Made" via `items.made_at_place_id` set to Oak Park; both badges surface on her Product Items).
- **A Member who follows Drake's** (saved-search created via the "Follow this venue" UI affordance on Drake's Location page; receives notifications for new gathering Items at Drake's; no Group required).
- **Brian declares the Run Club at Drake's** (the event_anchored Group at Drake's; following the Group is the recommended path; saved-search-on-Drake's-Location is the fallback for venues without a Group).

If a use-case isn't yet in `use-cases.md` in the shape pipeline-plan needs (specifically the "Locally Made" Item-provenance case), add a canonical anchor before handoff.

---

## ADR proposal

**ADR-0021 — Member↔Geography substrate split.**

- **Decision:** Retire `member_location_affinities` and its six-kind enum. Replace with three substrates, each owned by its appropriate spec:
  - Seller locality → `member_business_jurisdictions` (existing) + `items.made_at_place_id` (new, kind='product').
  - Community awareness → `member_place_interests` (new) + `member_interests` (existing).
  - Follow / saved-search → `member_saved_searches` (new) + `member_follows` / `group_memberships` (existing).
- **Supersedes (in scope, not in spirit):** ADR-16. The per-row-privacy posture survives; the named functions and the table they protected dissolve.
- **Status:** Proposed (this exploration). Awaiting `pipeline-plan` ratification and `pipeline-intent-check` on the redesign's absolute statements (e.g., "the Member never declares `lives`/`works` for any platform purpose" needs a State-tagged Intent line).
- **ADR file:** `planning/adrs/ADR-0021-member-geography-substrate-split.md` (TBD).

Once ADR-0021 lands and the spec patches above are made, the redesign is fully ratified. The build agent can then sequence: (a) retire-or-don't-create `member_location_affinities` in the migration plan, (b) create `member_place_interests` + `member_saved_searches` + the Item provenance columns, (c) update `groups.md` locality-derivation to read jurisdiction exclusively.

---

## Comments

The six-kind affinity enum tried to model "a Member's geographic life" as a single relationship to Locations. The redesign acknowledges that *geographic life* is at least three things — *where my business is registered*, *where my attention goes*, *what I want notifications about* — each with a different unit, lifecycle, RLS posture, and consumer surface. Fusing them into one table forced the table to be private (because residence is private), but then the public-derivation use case (locally-owned badge) couldn't read it without a SECURITY DEFINER escape hatch. That escape hatch is what ADR-16 grudgingly built. This redesign removes the need for it by putting each thread in its right home.

The "Locally Made" claim is the new piece. It's not in scope for the original ratification item #19, but the PM note that surfaced during ratification — *"Locally Made" is a distinct claim from "Locally Owned"* — names a real product-policy hole the redesign should fill while it's already in the geography substrate. Treating them as sibling badges, designed together, lets the platform answer the two questions ("does the money go to a local owner?" and "is the product made here?") with structurally-honest signals at every evidence tier. That's the same posture `business-jurisdiction.md` brought to "Locally Owned"; the redesign extends it to "Locally Made" before two specs end up answering the same question differently.

The discipline this exploration is enforcing: *every absolute or commitment we make about the Member↔geography relationship should map to exactly one substrate that owns it*. Three substrates, three owners (jurisdiction lives in `business-jurisdiction.md`, place-interests live in `member.md` / `discovery.md`, saved-searches live in `member.md`). When the next geographic feature lands — say a "service area" for kind='service' Items — the question becomes *"which substrate owns this?"* and the answer is *"its own, modeled after the same posture."* That clarity was missing in the six-kind enum; the redesign restores it.
