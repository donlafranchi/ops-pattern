---
purpose: ADR-20 — locality-scoped URL namespacing for Groups.
layer: how
status: active
---

# ADR-0020: Locality-scoped URLs — place is the organizing principle

**Status:** Accepted
**Date:** 2026-05-22
**Deciders:** PM
**Scope:** All public URLs on the platform — Members, places, Locations, Groups, Items.
**Touches:** `CLAUDE.md` § Naming conventions, `product/systems/item.md` § naming table, `product/systems/groups.md`, `product/systems/location.md`, `product/systems/member.md`, forthcoming `product/systems/places.md`, every Phase 2 route + composer scenario (F025+).
**Amended by:** ADR-0022 (place `kind` enum: `msa` → `county`; entity slug format) · ADR-0023 (URL path compaction — Accepted 2026-05-25).

## Decision

URLs are **locality-scoped wherever a place is the most stable anchor**. Members keep a single global handle (the auth identity). Everything geographically situated — Locations, Groups, Items filed under a Group — nests under a variable-depth place path derived from the resource's anchor `places` row. Slug uniqueness is scoped to `(parent_place_id, slug)` (parent-scoped) for places, and to `(anchor_place_id, resource_kind, slug)` for resources.

### The `places` primitive

`places` is a new, **hierarchical, platform-curated** primitive. Distinct from `locations` (which are user-declared specific points). Places are infrastructural — cities, neighborhoods, regions, metros — added by the platform as the platform expands geography. People do not create places; people anchor *to* them.

- **Hierarchy.** Each place has a parent place. A neighborhood's parent is a city; a city's parent is an MSA, region, or state. Self-referential.
- **Kind enum.** `region`, `state`, `msa`, `city`, `neighborhood`. Extensible. Granularities can be skipped (a town without a recognized MSA jumps city → state).
- **Polygons optional.** Cities and neighborhoods can carry a polygon for coordinate-containment lookups; regions/states may stay coordinate-free if the polygon would be unwieldy.
- **Parent-scoped slug uniqueness.** A place's `slug` is unique under its parent (`UNIQUE (parent_id, slug)`). "Oak Park" exists as a neighborhood under Sacramento *and* as a city under Illinois — different rows, no slug collision, no awkward `oak-park-sacramento` flattening.

### URL hierarchy

The path walks the place tree from outermost to innermost — variable depth depending on how specific the resource's anchor is.

| Resource | URL pattern | Slug uniqueness scope |
|---|---|---|
| Place landing | `/p/[…ancestor slugs]/[place-slug]` | Parent-scoped at every level (`places.parent_id` + `places.slug`) |
| Member | `/m/[handle]` | Global (`members.handle UNIQUE`) — Members are the auth identity, not place-anchored |
| Location | `/p/[…place path]/l/[slug]` | Unique per anchor place |
| Group | `/p/[…place path]/g/[slug]` | Unique per anchor place |
| Item (filed under a Group) | `/p/[…place path]/g/[group-slug]/[kind]/[item-slug]` | Unique per Group |
| Item (no Group, Member-owned) | `/m/[handle]/[kind]/[item-slug]` | Unique per Member |
| Hashtag feed | `/h/[hashtag]` | Global (free-form) — hashtags are intentionally cross-place |

**Item-kind path segments** retain the single-letter form from the prior naming table — `e` (event), `p` (product), `s` (service), `i` (idea), `o` (offer), `a` (ask), `initiative` (full word). At the inner layer `/p/` overloads (outer = place; inner = product) but the positions are unambiguous — the place path is everything between `/p/` and the resource-type segment (`/l/`, `/g/`, `/m/`).

**Variable depth examples:**
- `/p/sacramento/g/adaezes-kitchen` — Group anchored at city level.
- `/p/sacramento/oak-park/g/adaezes-kitchen` — same Group, neighborhood-anchored when the neighborhood place exists.
- `/p/sacramento-valley/g/permaculture-network` — region-anchored Group.
- `/p/sacramento/oak-park/l/drakes-bar` — Location in a neighborhood.
- `/p/sacramento/oak-park/g/oak-park-farmers-market/e/2026-06-04-market-day` — Item in a Group in a neighborhood.

**Member-owned Item URLs do NOT carry a place** — the Member is the anchor. The Member's home Location resolves a *display* locality for breadcrumbs / canonical-link metadata, but the URL stays `/m/[handle]/[kind]/[slug]`.

**`/h/[hashtag]` stays global** — hashtags are deliberately cross-place discovery (#fermentation, #avian); locality-scoping them would defeat their purpose. Locality filtering on hashtag feeds happens through query params (`/h/fermentation?near=sacramento`) at Phase 3.

**Short-link form (optional, T2):** `msm.short/[8-char-id]` resolves to canonical via a redirect table. Not load-bearing on this ADR; acknowledged so QR/SMS use cases aren't blocked by long canonical paths.

### Anchoring rules

- **Every Location** anchors to its closest matching `places` row, via reverse-geocoding the coordinates or polygon containment when a place has a polygon.
- **Every Group** with an `anchor_location_id` inherits that Location's place anchor. Groups without anchor Locations fall back to the founder's home Location's place anchor.
- **Default anchor depth for kind='business' Groups: neighborhood when the neighborhood-place exists, city when only the city-place exists.** Granularity rolls up automatically — the platform doesn't ask the user to choose.
- **Federation / cross-place Groups** (a kind='interest' Group whose Members span multiple places, e.g., a state-wide cooperative): anchor at the **smallest common ancestor** place. If two cities have a common MSA, anchor at the MSA; if they don't, walk up to the region or state. Stored on the Group at create time; can be re-anchored if Membership shifts dramatically.
- **Every Item filed under a Group** inherits the Group's place anchor. Items not filed under a Group anchor under the Member URL form, not under a place.

### Group-of-Group relationship

A Group can be a "vendor / member / participant" of another Group. New many-to-many relationship distinct from Member-Group memberships:

- `(parent_group_id, child_group_id, role, source, joined_at, left_at)` — same shape as `group_memberships` but at the Group layer.
- A kind='business' Group (Adaeze's Kitchen) can be a vendor in multiple kind='place' or kind='event_anchored' Groups (Oak Park Farmers Market, Davis Farmers Market, East Sac Farmers Market) — one row per relationship.
- The child Group's public page can inherit event dates from each parent Group's attached Items (the food-truck-at-farmers-market pattern).

This relationship is separate from the place-anchor hierarchy. A Group anchored in Oak Park can still vendor at a Group anchored in Davis — its URL stays at Oak Park; its inherited event dates come from Davis.

## Options considered

### Place URL form

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen: variable-depth place path** | Walk the place tree from outermost to innermost in the URL. Slugs parent-scoped. | Chosen — matches how people read addresses, naturally accommodates skipping granularities, allows neighborhood when available without forcing it. |
| B | Single flat segment with encoded hierarchy (`/p/oak-park-sacramento/...`) | Rejected — defeats parent-scoping; reintroduces slug collisions in the encoding ("oak park" appearing in many parents); doesn't compose for federation Groups (`/p/sacramento-valley-permaculture-...`). |
| C | Global place slugs forced unique (`oak-park-sacramento-ca` everywhere) | Rejected — ugly URLs; defeats the point of place hierarchy as a navigation aid. |
| D | Geographic coordinates in path | Rejected — opaque, not memorable. |

### Resource scoping

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen: place-scoped resources** | Locations, Groups, Items-under-Group nest in the place tree. Slug-unique per place. | Chosen. |
| B | Global single-letter slugs (status quo) | Rejected — collides at scale; defeats share-link promise. |
| C | Member-scoped everything | Rejected — Items filed under a Group are organizationally owned by the Group, not the Member; routing them under `/m/[handle]` misrepresents the data model. |

### Place granularity policy

| Option | Description | Verdict |
|---|---|---|
| **A — Chosen: hierarchical, variable depth, skippable granularities** | Neighborhood when available, city otherwise; MSAs / regions / states available as parent levels. | Chosen — natural fit for how people think about place; expandable without retrofit. |
| B | City-only at b1, deeper later | Rejected — would require retrofitting neighborhood-scoping into existing URLs when added; better to admit the hierarchy on day one. |
| C | Neighborhood-mandatory | Rejected — most cities don't have universally-recognized neighborhood lists; would force the platform to make naming calls it shouldn't. |

## Trade-offs

**Why hierarchical place wins.** The platform's foundational premise is locality-first (`principles.md` P1). Place hierarchy is how humans actually think about geography ("I'm at Drake's, in Oak Park, in Sacramento"). Modeling that hierarchy directly in `places` + reflecting it in URLs aligns the platform's information architecture with everyday speech. The same architecture that prevents slug collisions at scale also signals what kind of platform this is to anyone reading a URL.

**Why parent-scoped slugs win.** Two Oak Parks (Sacramento, Illinois) exist as distinct places without name mangling. The hierarchy carries the disambiguation; the slug stays human-readable. Globally-unique slugs would force `oak-park-sacramento` / `oak-park-illinois` as a workaround, which leaks state into a name that shouldn't carry it.

**Why neighborhood-when-available wins as the default for businesses.** Most business activity is hyperlocal — "Adaeze's Kitchen in Oak Park" is more informative than "Adaeze's Kitchen in Sacramento." When the neighborhood-place exists, using it makes the URL more legible and the place-landing pages more useful. When it doesn't exist, the city is a perfectly good fallback. The platform picks; the user doesn't have to choose.

**Why smallest-common-ancestor for federation wins.** A Group whose Members span multiple places needs a single canonical URL. Anchoring at the deepest place that *contains* all the Members keeps the URL specific without making false claims (a Sacramento-and-Davis Group at `/p/sacramento-valley/g/...` is honest; the same Group at `/p/sacramento/g/...` would imply a Sacramento-only scope).

**Costs.**

- **Longer URLs.** `/p/sacramento/oak-park/g/adaezes-kitchen/p/tamarind-chutney` is ~60 chars vs `/p/tamarind-chutney` at ~20. SEO and human-readability win; SMS/QR contexts get the short-link form as a deliberate UX optimization.
- **Locality migration.** When a Group's anchor place changes (Group relocates, founder moves), URL changes. Mitigation: 301-redirect from old URL to new, sourced from a URL-history table per resource (analogous to `member_handle_history`).
- **Reverse-geocoding dependency.** "What place does this coordinate belong to?" needs an answer at Location creation. Mapbox provides this; cache aggressively.
- **Variable-depth routing.** Two URL patterns per Item kind (Member-anchored, Group-anchored), and each Group-anchored URL has variable depth. Next.js catch-all routes handle this; slight complexity tax.
- **The QR card promise** (per `item.md` + `qr-onboarding.md`) is unchanged in spirit — Items resolve to canonical URLs — but canonical URLs are longer. QR encoding handles long URLs (~150 chars at QR v10 high-error-correction); the short-link form is for human-paste contexts.

## Consequences

### Schema implications (conceptual — not ticketed yet)

- **New primitive `places`** — self-referential hierarchy, kind enum, parent-scoped slug uniqueness, optional polygon, platform-curated (no user create surface). Needs its own system spec at `product/systems/places.md`.
- **Locations gain a `places` FK** — every Location anchors to its closest matching place. Reverse-geocode at create; reclassifiable by admin.
- **Groups gain a derived place anchor** — for Groups with `anchor_location_id`, inherit from the Location. For anchorless Groups, fall back to founder's home Location. For federation Groups (cross-place membership), anchor at the smallest common ancestor place, stored on the Group at create.
- **Items inherit place anchor from their Group** — when filed under a Group. When not filed, Items don't get a place anchor; they use the Member-anchored URL form.
- **Slug uniqueness rewrites**:
  - `places`: `UNIQUE (parent_id, slug)` (with the root-parent case handled — top-level places like states or regions have NULL parent and slug-unique among NULL-parents).
  - `locations`: `UNIQUE (place_id, slug)` (replacing the global `UNIQUE (slug)`).
  - `groups`: `UNIQUE (place_id, slug)`.
  - `items`: `UNIQUE (group_id, kind, slug)` when filed; `UNIQUE (member_id, kind, slug)` when not.
- **URL history tables per resource** — `*_url_history` for Locations, Groups, and (if Items ever change parent) Items. Redirect middleware reads these.
- **`group_group_memberships` join** — the Group-of-Group relationship for the food-truck-at-farmers-market pattern. Separate from `group_memberships`.

### Spec / doc implications

- **CLAUDE.md** § Naming conventions table — rewrite the URL column to reflect variable-depth place paths.
- **`product/systems/item.md`** § Item Kinds naming table — match.
- **`product/systems/groups.md`** — add the URL pattern, slug-scoping rule, place anchoring (default neighborhood-when-available, smallest-common-ancestor for federation), and the Group-of-Group relationship.
- **`product/systems/location.md`** — add the place FK and the URL pattern.
- **`product/systems/member.md`** — confirm `/m/[handle]` is unchanged; note that Member-owned Items use the Member-anchored URL form.
- **New: `product/systems/places.md`** — the places primitive. Hierarchy rules, granularity policy (region / state / msa / city / neighborhood), curation policy (who adds places and when), parent-scoped slug uniqueness, polygon semantics, reverse-geocoding contract, URL-prefix derivation rules.

### Phase implications

- Phase 2 picks up a **"places + URL plumbing" stage** before the surface scenarios open. The exact ticket shape is downstream of this ADR; this ADR fixes only the *what*, not the *how*.
- F025 reframes as the **Group public page** (the producer / business / event-anchored surface), not the Member page. The Member page becomes a separate, lighter scenario.

### What this forecloses

- **Plain global short URLs** like `/p/tamarind-chutney` as a primary affordance. Short-link form (`msm.short/abc`) survives as an explicit UX optimization, not as a canonical.
- **User-created places.** Places are platform-curated; user-declared geographic scopes go through the `locations.kind='area'` surface, which is distinct from `places`.
- **Locality-free Group-anchored Items.** A Group with a place anchor has all its Items in that place's URL namespace; trying to file an Item "globally" within a Group is not possible at b1. Federation at T3 may revisit.

## Action Items

1. [x] Write `product/systems/places.md` (new system spec) — what a place is, hierarchy + kind enum, curation policy, granularity, polygon semantics, reverse-geocoding contract, URL-prefix derivation rules, redirect / history semantics. *(Landed; 208 lines covering T1/T2/T3 + Data model implications + ADR-20 encoding table.)*
2. [ ] Update `CLAUDE.md` § Naming conventions table to reflect variable-depth place paths.
3. [ ] Update `product/systems/item.md` § Item Kinds naming table to match.
4. [ ] Annotate `product/systems/groups.md` with the place-anchor inheritance rules (default neighborhood-when-available, smallest-common-ancestor for federation) and the Group-of-Group relationship.
5. [ ] Annotate `product/systems/location.md` with the place FK and the locality-scoped URL.
6. [ ] Revise F025 as the **Group producer page** (not the Member page), anchored under `/p/[…place path]/g/[slug]`.
7. [x] `pipeline-intent-check` on this ADR before ratification (per rebuild-phase rule #9 — ADRs land with Intent annotations on any Category-2 absolutes). *(Verdict: CLEAN, 2026-05-25 — see [`planning/history/intent-ADR-20-2026-05-25.md`](../history/intent-ADR-20-2026-05-25.md). All three Category-2 absolutes carry substantive Intent.)*

## Intent annotations

This ADR encodes three absolutes that need explicit `Intent:` annotations per `intent-audit.md`.

- **"URLs are locality-scoped wherever a place is the most stable anchor."**
  *Intent:* The platform's foundational commitment is locality-first (`principles.md` P1). URLs are the most public expression of that commitment — the schema choice for slug-scoping makes the platform's claim visible in every share-link. Reversing this later means rewriting every public URL the platform has ever issued, which destroys the durability of share links and SEO. We commit now because the cost of committing later is much higher than the cost of committing wrong now (we can always extend; we can never quietly un-commit).

- **"Members keep a single global handle."**
  *Intent:* The Member is the auth identity. Exactly one auth user per Member, one handle per Member, claimable across the lifetime of the platform. Members move — between neighborhoods, cities, countries — without losing identity. Scoping handles to places would force handle changes on every relocation, destroying identity continuity. The handle is one of the few intentionally global namespaces on the platform; the cost is bounded (handles are short, profanity-filtered, regex-constrained) and the benefit is high (one identity per human, durable across moves).

- **"Places are platform-curated, not user-created."**
  *Intent:* Places carry authority that user-declared Locations cannot. A "city" is a unit of recognized civic geography; allowing user-created "cities" would let one person fork the entire URL namespace by declaring their block a city. The user-creation surface for geographic scope is `locations.kind='area'` (service areas, custom polygons) — distinct from `places`. Platform-curation keeps the URL namespace stable and the place hierarchy trustworthy as a discovery aid.
