---
id: how-review-f033
purpose: Pre-ticket architecture and design review for F033 (venue page).
layer: how
status: active
---

# F033 review — Viewer finds a venue page and sees what's happening there

**Scenario:** [`scenario-F033-viewer-finds-venue-page.md`](./scenario-F033-viewer-finds-venue-page.md)
**Reviewer:** review
**Date:** 2026-06-15
**Bundle:** b1
**Verdict:** PROCEED

## Verdict summary

The scenario fits existing schema and substrate cleanly — all required tables, columns, indexes, and action handlers already exist. The Host/Venue filtering model is architecturally sound and uses only shipped FKs. One mandatory pre-condition: `product/ui/design-language.md` § Venue page must be updated before the first ticket opens (CTA hierarchy change + section restructuring to match this scenario). Accessibility notes below for the ticket writer.

**Next skill:** `ticket` — reads both the approved scenario and this review. DLS update can be bundled as ticket T0 (a doc-only ticket preceding the build tickets) or handled inline as the first ticket's deliverable.

## Architecture check

### Systems touched

- `product/systems/location.md` — the venue page IS the Location's public surface. F033 reads the `locations` spine (label, slug, geography, description, discoverability) and the `location_permanent` child table (street_address, accessibility_notes). The `discoverability` enum gates access (private → 404). All columns exist in migration `007_locations.sql`.
- `product/systems/groups.md` — `groups.anchor_location_id` identifies the venue's owning kind='business' Group. The join `locations.id = groups.anchor_location_id WHERE groups.kind = 'business'` is the structural mechanism for the Host/Venue filtering. Column + index exist in migration `014_groups.sql`.
- `product/systems/item.md` — "What's happening here" reads `items` filtered by `items.group_id = owning_group.id`. "What's happening nearby" reads items via the `discoverable_items` MV with a geography proximity filter excluding the owning Group. Both paths use existing columns and indexes.
- `product/systems/member.md` — distance derivation reads `member_place_interests` where `scope_kind='primary_home'` → `places.centroid`. Follow writes to `member_saved_searches`. Both tables exist (migrations `018_member_place_interests.sql`, `019_member_saved_searches.sql`).

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | **none** | All tables exist: `locations`, `groups`, `items`, `item_locations`, `member_saved_searches`, `member_place_interests`, `places`. |
| New columns required? | **none** | `groups.anchor_location_id`, `items.group_id`, `item_locations.location_id`, `member_place_interests.scope_kind`, `places.centroid` — all shipped. |
| New event types required? | **none** | `member.saved_search.created` already defined; `followVenueAction`/`unfollowVenueAction` already built (T102, gate closed 2026-06-11). |
| Forward-tier impact | **clear** | T2 sub-venue surface (`parent_location_id` reserved), T2 claim flow, T2 photo galleries — none made harder. The Host/Venue filtering model naturally extends to sub-venues (a sub-venue's owning Group would be resolved via its own `anchor_location_id` or inherited from the parent). |
| Shell-entity smell | **clean** | No new entity introduced. The "owning Group" is a kind='business' Group (people), resolved via existing FK. The venue page reads Location + Group + Items using existing primitives. No "venue" entity, no "merchant" entity, no "establishment" entity. |
| Loop fidelity | **matched** | **Loop 1** (Find your people): *"the only way to find these groups is to physically be there and ask"* — the venue page makes the venue's recurring gatherings searchable and findable. **Loop 3** (Land here): *"what's happening within walking distance this week, that they could just show up to"* — the venue page is the venue-scoped version of this surface. **Loop 4** (Gather regularly): *"a public group page anchored to a place and a recurring time"* — "What's happening here" is the Group's recurring Item list scoped to the venue. **Loop 8** (Follow what you love): *"Follow, the standing form of a small public commitment"* — "Follow this venue" is the primary CTA. All four loops match the scenario's mechanics. |
| Policy posture present | **present** | `location.md` carries a full Policy posture section per ADR-9 (three-filter analysis, personal-Location privacy via `discoverability='unlisted'`, no Location-scoped messaging). The venue page is a read surface; the only write is `member_saved_searches` (owner-only RLS per `member.md`). No new data-sharing, monetary, or visibility surface introduced. |

### Cross-system consistency

- **Location ↔ Group:** `location.md` § Integration points documents `groups.anchor_location_id` and states "Locations have no symmetrical pointer back; Groups discover their anchored Location via the FK, the Location page lists anchored Groups via reverse query." F033 implements exactly this reverse query. Consistent.
- **Location ↔ Item:** `location.md` § Integration points: "`item_locations` (per `item.md`) attaches Items to Locations with a per-attachment schedule." F033 uses `item_locations.location_id` for both "What's happening here" (additionally filtered by `items.group_id`) and "What's happening nearby" (proximity-based). Consistent.
- **Item ↔ Group:** `item.md` § Data model: "`group_id` (nullable FK to `groups.id`). Set when the Item is filed under a Group; null for one-off sales." F033's Host/Venue distinction reads this FK correctly — the Group is the Host, the Location is the Venue, and they're resolved via separate columns. Consistent.
- **Member ↔ Location (saved-search):** `location.md` § Person↔Location relationship: "The 'Follow this venue' UI affordance on a Location page creates a `member_saved_searches` row with `location_id` set." F033 implements this exactly. Consistent.
- **Distance derivation:** `location.md` § Locality semantics documents `member_place_interests` as the community-awareness feed source (ADR-21). F033's distance derivation (`member_place_interests` where `scope_kind='primary_home'` → `places.centroid`) is consistent with this and with F030's implementation.

### Architecture verdict

**PROCEED.** All schema exists. The Host/Venue filtering model uses existing FKs and indexes cleanly. No new tables, columns, or event types required.

---

## Design check

### Surfaces touched

- **Venue page (`/p/[…place]/l/[slug]`)** — **new route** (no route exists in `web/src/app/`; existing `FollowVenueButton` component exists from T102).

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| Venue page header (hero + name + address + distance) | **yes** (DLS § Venue page header) | Existing recipe covers layout. Distance line is new copy but follows the `14px / 400 muted` pattern with `·` separator. |
| `<FollowVenueButton>` (primary CTA — Follow/Following toggle) | **yes** (built in T102) | Component exists. **DLS conflict:** DLS § Venue page currently documents "Host something here" as the primary CTA. F033 elevates Follow to primary. See § DLS update below. |
| "Host something here" (secondary CTA) | **yes** (Button — secondary recipe) | Uses existing `Button — secondary` recipe. Links to F034 gathering composer with Location pre-attached. |
| "What's happening here" Item list section | **no** (new section) | List of ItemCards filtered by venue-owning Group. Follows existing Card recipe. Section heading in 22px / 600. Empty state: "Nothing scheduled yet." |
| "What's happening nearby" expandable section | **no** (new component) | Expandable/collapsible section. Must use proper ARIA (see accessibility notes). Not a new DLS *pattern* — collapsible sections are standard; the recipe can be documented inline with the ticket. |
| Venue About block | **yes** (DLS § Venue page § About) | Existing section — description, hours, Location kind tag. |

### CTA placement

| Surface | CTA | Established pattern | Match? |
|---|---|---|---|
| Venue page | "Follow this venue" (primary) | DLS § CTA pattern #4: "Only one accent-filled button visible at a time." | **yes** — one primary (Follow), one secondary (Host). |
| Venue page | "Host something here" (secondary) | DLS § Button — secondary recipe | **yes** — white bg, border, secondary weight. |

**DLS § Venue page drift — mandatory update.** The current DLS § Venue page documents "Host something here" as the primary CTA and omits the Host/Venue section split. F033 reverses the CTA hierarchy (Follow primary, Host secondary) and restructures sections ("What's happening here" scoped to venue-hosted Items, "What's happening nearby" as expandable secondary). The DLS section must be updated before the first ticket opens. This is a revision of an existing section (~20 lines), not a new pattern. Recommended: ticket writer updates the DLS as the first deliverable of the first ticket, or a standalone doc-only ticket precedes the build tickets.

### Copy & tone

- "Follow this venue" / "Following" — clear, verb-first, no jargon. Matches the platform's direct tone.
- "What's happening here" / "What's happening nearby" — plain English, question-shaped headers. Good.
- "Nothing scheduled yet." — honest empty state, no false encouragement. Matches `principles.md` people-first (doesn't push the viewer to host — the venue owner creates their own content).
- "Host something here" — verb-first, surface-anchored. Matches existing DLS copy pattern.
- No "declare," "item," or schema terms in UI copy. Naming conventions honored.

### Empty / loading / error states

- **No venue-hosted Items** → "Nothing scheduled yet." — described (AC: Venue with no venue-hosted Items).
- **No anchored business Group** → minimal page, "What's happening here" absent — described (AC: Venue with no anchored business Group).
- **Private Location** → 404 — described (Edge Cases).
- **Dissolved owning Group** → section absent — described (Edge Cases).
- **Anon visitor** → distance omitted, auth gating on Follow/Host taps — described (ACs: anon distance, anon Follow, anon Host).
- **Loading / error states** not explicitly described in the scenario. **Ticket writer should specify:** skeleton loading for Item lists, toast on Follow write failure, error boundary for the page. Standard patterns — not a scenario-level gap.

### Accessibility review (M3 — mandatory)

New page with multiple interactive elements. Ticket writer must address:

1. **"Follow this venue" toggle button.** Must communicate state to screen readers. Use `aria-pressed="true|false"` or update `aria-label` to reflect "Following — tap to unfollow" vs. "Follow this venue." The existing `<FollowVenueButton>` (T102) should already handle this — verify during build.

2. **"What's happening nearby" expandable section.** Must use `<details>`/`<summary>` (native HTML, free accessibility) or a custom implementation with `aria-expanded`, `aria-controls`, and keyboard Enter/Space toggle. Recommend `<details>`/`<summary>` for simplicity at b1.

3. **Item cards.** Must be keyboard-navigable. Each card should be a semantic link (`<a>`) wrapping the card content, with a visible focus ring (`2px --color-focus`). Tab order: Follow CTA → Host CTA → first Item card in "What's happening here" → expandable nearby toggle → first Item card in "What's happening nearby" → About section.

4. **Hero image.** Requires `alt` text (venue name or "Photo of [venue name]"). If no image, the hero space should collapse (not render an empty container with an ARIA role).

5. **Distance line.** Text-based, in the normal document flow — no accessibility concern beyond ensuring it's not a tooltip-only or icon-only rendering.

6. **Empty states.** Use a heading or `aria-live="polite"` region so screen readers announce the empty state when the section loads.

7. **Auth-gated actions.** When an anon visitor taps Follow or Host and the auth flow opens, focus must return to the originating button after auth completes (the return-URL pattern handles navigation; focus management on the destination page is the concern).

8. **Pre-existing DLS concern (not F033-specific).** The primary button's color contrast — white text (#FFF) on `--pistachio-500` (#A0B49A) — should be verified against WCAG AA 4.5:1 for normal text. This affects all primary buttons platform-wide, not just this page. If it fails, the DLS color needs adjustment (e.g., darken to `--pistachio-600` for CTA fill). Flag for a DLS-wide audit, not as an F033 blocker.

### Design verdict

**PROCEED** — with mandatory DLS update (§ Venue page CTA hierarchy + section restructuring) as the first ticket deliverable.

---

## Sibling-consistency findings

**Siblings checked:**

- **F034 (Member hosts recurring gathering)** — `done`. Same Family 1 (Gathering). F034 introduced the `<GatheringComposer>` and the gathering Item page (`/e/[slug]`). F033's "What's happening here" renders gathering Items using the same `ItemCard` component the locality feed and F034's Item page use. No divergence — F033 is the read-discovery surface for what F034 creates.

- **F035 (Viewer finds Group public page)** — `done`. Adjacent surface. The Group page shows all Items filed under the Group; the venue page's "What's happening here" shows the same Items filtered to those also attached to this Location. Both should use the same `ItemCard` rendering. No divergence — the venue page is the location-scoped complement to the Group page.

**Vocabulary alignment:** Both F034 and F035 use "Event" as the UI label for kind='gathering' Items. F033 is consistent — the scenario never uses "gathering" in user-facing copy.

**Empty-state consistency:** F035's Group page uses "No products or events yet" for an empty Group. F033 uses "Nothing scheduled yet." for an empty venue. Justified divergence — the Group page covers all Item kinds; the venue page is focused on what the venue *hosts* (the word "scheduled" is appropriate). No conflict.

**Shared base components:** The `ItemCard` component is the shared base across F033/F034/F035. The ticket writer should confirm F033 reuses the existing `ItemCard` rather than building a venue-specific card variant.

---

## Recommendations for the ticket writer

### Mandatory pre-condition

1. **Update `product/ui/design-language.md` § Venue page** before building. Changes needed:
   - Primary CTA: "Follow this venue" (accent-filled, `Button — primary`). Replace "Host something here" as primary.
   - Secondary CTA: "Host something here" (white bg, `Button — secondary`).
   - Section 1: "What's happening here" — scoped to venue-hosted Items (where `items.group_id` matches the owning kind='business' Group AND `item_locations.location_id` = this Location). Replace the current "gatherings ≤ 30 days" description.
   - Section 2 (new): "What's happening nearby" — expandable secondary section, public Items by proximity excluding the venue's owning Group.
   - Section 3: "About" — unchanged.
   - Remove "Items here" as a separate section (subsumed by "What's happening here" which now covers all Item kinds, not just gatherings).
   - Add the "no anchored business Group → minimal page" variant.

### Query implementation notes

2. **"What's happening here" must query base tables, not the MV.** The `discoverable_items` MV only carries `nearest_location_id` (the first-created `item_locations` row). An Item hosted by the owning Group at multiple Locations could have a different Location as its "nearest." The venue-hosted query should join `items` → `item_locations` (where `location_id = this_venue`) → filter `items.group_id = owning_group.id` AND `items.state = 'published'`. At b1 scale this is fine — the base-table query is simple and the existing indexes support it.

3. **"What's happening nearby" CAN use the MV.** The `discoverable_items` MV has a GIST index on `nearest_location_geography`. The nearby query: `SELECT * FROM discoverable_items WHERE ST_DWithin(nearest_location_geography, venue.geography, radius) AND (group_id != owning_group_id OR group_id IS NULL)`. Efficient at b1 scale. Radius is a ticket-writer implementation decision per the scenario's Out of Scope.

4. **Multiple owning Groups edge case.** The scenario acknowledges "Multiple kind='business' Groups anchored at the same Location" and says "use the first active Group." The query should use `ORDER BY groups.created_at ASC LIMIT 1` for deterministic resolution. Document this in the ticket so b2 can revisit if collisions occur.

### Accessibility (M3)

5. **Expandable section:** Use `<details>`/`<summary>` for "What's happening nearby." Native HTML, free a11y.

6. **Follow button state:** Verify the existing `<FollowVenueButton>` (T102) communicates toggle state to screen readers (`aria-pressed` or equivalent).

7. **Focus management after auth:** When an anon visitor completes auth from a Follow/Host tap, ensure focus returns to the venue page and the action completes.

### Routing

8. **Place-scoped URL resolver.** The `/p/[…place]/l/[slug]` route needs to be wired up. The `[…place]` catch-all segment resolves the Place hierarchy; the `/l/[slug]` segment resolves the Location within that Place. Check whether the existing place-path resolver (used by `/p/[…place]/g/[slug]` for Group pages) can be extended, or if a new route segment is needed. Likely a parallel `app/p/[...place]/l/[slug]/page.tsx` file.

### Reuse

9. **Reuse `ItemCard`.** The "What's happening here" and "What's happening nearby" sections should render Items using the same `ItemCard` component used in the locality feed, the Group page, and the gathering Item page. No venue-specific card variant.

---

## Decisions captured

- **Host/Venue distinction is structural, not surface-level.** The venue page's "What's happening here" is scoped by Host (`items.group_id`), not by Venue attachment (`item_locations.location_id`). This is the correct reading of the existing schema — `group_id` determines who organized the event; `item_locations` determines where it happens. These are distinct roles. This distinction should be noted in `playbooks/PLATFORM-PATTERNS.md` as a pattern-doc entry:

  > **Decision:** Venue pages scope "What's happening here" to the Host (the venue's owning business Group via `items.group_id`), not to all Items attached to the Location via `item_locations`.
  > **Intent:** The venue page is the venue's own storefront — it shows what the venue itself hosts, not everything that happens at the venue's coordinates. A birthday party at Drake's is hosted by a Member, not by Drake's; it belongs on the Host's page, not on Drake's venue page. The Host/Venue distinction is structural: `items.group_id` = Host; `item_locations.location_id` = Venue.
  > **Touches:** `product/ui/design-language.md` § Venue page, `product/systems/location.md` § Integration points.

- **"Follow this venue" is the primary CTA on the venue page; "Host something here" is secondary.** Reverses the DLS's original assumption. Rationale: most venue-page visitors are consuming (browsing, following), not creating. Follow serves the majority visitor and lights up Loop 8 (Follow what you love). Host is the minority action. Per `principles.md` people-first — the primary CTA serves the majority visitor.
