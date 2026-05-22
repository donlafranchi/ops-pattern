# Pre-primitives scenarios audit — 2026-05-11

The seventeen `F001`–`F013` scenarios moved into this archive on 2026-05-11 predate the primitives ratification (Person / Item / Location / Group) and the related ADRs (ADR-5 a market is a gathering Item, ADR-12 Maker mode is explicit, ADR-13 Group consolidation, the 2026-05-11 producer-* re-anchor). They reference retired specs and encode mental models that the rebuild plan in `notes/migration-to-primitives.md` explicitly replaces.

Per the JOURNAL.md precedent set 2026-05-10 for `F019`–`F024` ("we're rebuilding, not migrating — these scenarios encode the wrong mental model and aren't worth salvaging"), Phase 2/3 scenarios will be authored fresh under the current primitives via `pipeline-product` → `pipeline-plan`. F-numbers continue from the highest archived value.

## What was archived and what replaces it

| Archived scenario | Pre-primitives mental model | Current replacement |
|---|---|---|
| `F001-map-view-colored-pins.md` | Colored pins by ownership tier (independent / PE-corporate / mission-driven) | Map view of Items + Locations per [`location.md`](../../../product/systems/location.md); ownership-classification primitive retired entirely |
| `F001-map-view-pin-clustering.md` | Pin clustering for business listings | Clustering applies to Locations + Items in the locality-first index per [`discovery.md`](../../../product/systems/discovery.md) |
| `F001-map-view-search.md` | Map-view search across businesses | Search across Items / Members / Locations / Groups per [`discovery.md`](../../../product/systems/discovery.md) |
| `F002-business-detail-card.md` | Detail card for a Business with ownership tier badge | Item detail (`/i/[slug]`), Member page (`/m/[handle]`), or Location page (`/l/[slug]`) per the canonical surfaces |
| `F003-business-registration.md` | Owner registers a Business record in <5 min | Member sign-up (per [`member.md`](../../../product/systems/member.md)) + optional kind='business' Group creation (per [`groups.md`](../../../product/systems/groups.md)) via the "Become a Maker" CTA |
| `F003-registration-auth.md` | Auth flow gated on Business registration | Anonymous-to-Member bridge per `member.md`; "Become a Maker" is a separate, later step |
| `F004-shareable-listing.md` | `/business/{slug}` with OG metadata | Per [`shareable-listing.md`](../../../product/capabilities/shareable-listing.md) — every Item/Member/Location/Group has a stable URL with OG (`/i/`, `/m/`, `/l/`, `/g/`) |
| `F005-report-concern.md` | "Report concern" flag on a business | Anti-Nextdoor commitment in [`policy-framework.md`](../../../product/foundation/policy-framework.md): complaint downvote/removal + "create an Item to lead the fix" replacement; categorical-line reports use a separate flow with explicit moderator review |
| `F005-support-button.md` | ❤️ Support button (monetary support of a Business) | Item-response surface (per [`item.md`](../../../product/systems/item.md)) with kind-appropriate response verbs (RSVP / pledge / follow / order — never a generic "support") |
| `F006-landing-page.md` | Landing page → map view → discover businesses | Per [`landing-page.md`](../../../product/capabilities/landing-page.md) — landing routes to locality feed with anonymous Loop 3 path |
| `F007-search-results-list.md` | Search results list across businesses | Per [`discovery.md`](../../../product/systems/discovery.md) — locality-first index across Items/Members/Locations/Groups |
| `F008-home-feed.md` | "Etsy-style modular feed with local market anchor" | Per [`consumer-feed.md`](../../../product/capabilities/consumer-feed.md) (renamed Locality Feed) — locality-aware Item feed; "market anchor" replaced by the multi-Location-affinity surface per [`member.md`](../../../product/systems/member.md) |
| `F009-market-selection.md` | "Select your market" pill on home | Markets are gathering Items per ADR-5; locality is `home_location_id` per ADR-4 plus multi-Location affinities; no separate market-selection surface |
| `F010-product-search-filter.md` | Filter search results by product category | Products are Items with `kind=product`; filtering uses the Item tag/category vocabulary per `item.md` |
| `F011-vendor-profile.md` | Vendor profile page with market schedule | Member page (`/m/[handle]`) with Maker affordances when `maker_mode_enabled = true`; kind='business' Group page (`/g/[slug]`) for the operating-context label |
| `F012-follow-vendor.md` | Follow a vendor for updates | Follow a Member via `member_follows` per `member.md`; Member-to-Member, never Member-to-Business-shell |
| `F013-bottom-navigation.md` | Bottom nav with Home / Search / Favorites / Profile tabs | Bottom nav per ADR-2 (per [`design-language.md`](../../../product/ui/design-language.md)); current tabs are Home / Explore / You (per [`community-platform.md`](../../../product/products/community-platform.md)) |

## What this means for the active backlog

The active `planning/scenarios/` tree now contains only post-primitives scenarios — `F018-brian-declares-run-club.md` is the live anchor. Phase 2/3 scenarios will be authored fresh per the rebuild plan, with F-numbers continuing from F024+ (F019-F024 were the earlier scrap; F018 stands alone as the canonical post-primitives example).

## Scrap pattern

This is the second pass of pre-primitives scrap (the first was 2026-05-10 for F019-F024). The pattern is:
1. Verify each scenario references retired specs or encodes a primitive that no longer exists.
2. Build a mapping table showing what current spec/surface replaces what.
3. Move scenarios to `scenarios-backlog/archive/` as a batch.
4. Do not attempt in-place updates — re-authoring under the new primitives is cheaper and produces cleaner output.

If a future PM session decides the rebuild plan's "author fresh" approach is wrong, the archived scenarios are preserved verbatim and can be salvaged individually.
