---
purpose: Audit every schema table against The Good Place seed; propose social links
layer: exploration
status: draft
---

# Showcase Completeness Audit — The Good Place

Two parts: (1) every-table audit against the seed, (2) social links proposal for producer profiles.

---

## Part 1: Full Schema Audit

38 tables in the schema. For each: current seed status, what's missing, and what to add.

### Legend

- **SEEDED** — has rows in `the-good-place.sql`
- **ADD** — empty, should populate for showcase completeness
- **SKIP** — intentionally empty (infrastructure, ML, or runtime-only)

---

### 1. `members` — SEEDED (8 rows)

Maya Okonkwo (baker), Theo Brandt (bike mechanic), Rosa Delgado (organizer), Sam Whitfield (gardener), Priya Raman (potter), Jonah Kessler (cold brew), Nadia Halim (questioner), Casey Lindqvist (retired teacher). Plus the system member from migration 002.

**Gaps:**

- `avatar_url` is null for all 8. Every profile page will show a blank avatar.
- `home_location_id` is null for all. Acceptable — `member_place_interests` with `primary_home` is the current pattern. But if any UI reads `home_location_id` directly, it'll be empty.
- `home_metro_id` is null for all. The TGP seed adds a `zip_metro_crosswalk` entry (ZIP 00001 → MSA 99999) but doesn't create a `metro_polygons` row for "The Good Place, TG" and doesn't backfill `home_metro_id`. Any metro-dependent feature (locality badge, metro feed) won't resolve for TGP members.
- `primary_group_id` is null for all. Could set Maya's to The Good Loaf and Rosa's to Pond Side Circle to show the "primary affiliation" line on profiles.

**Proposed additions:**

| Member | `avatar_url` | `primary_group_id` | `home_metro_id` |
|---|---|---|---|
| Maya | placeholder or Unsplash URL | The Good Loaf | TGP metro |
| Theo | placeholder | — | TGP metro |
| Rosa | placeholder | Pond Side Circle | TGP metro |
| Sam | placeholder | — | TGP metro |
| Priya | placeholder | — | TGP metro |
| Jonah | placeholder | — | TGP metro |
| Nadia | placeholder | — | TGP metro |
| Casey | placeholder | — | TGP metro |

Requires: one new `metro_polygons` row for "The Good Place" CSA (fictional polygon matching the TGP places geography), then UPDATE all 8 members' `home_metro_id`.

For avatars: use `https://api.dicebear.com/9.x/thumbs/svg?seed={handle}` or similar deterministic avatar service. These render without needing stored images.

---

### 2. `member_events` — SEEDED (derived)

The seed inserts `member.created` for each member. Adequate for showcase — event logs are infrastructure, not a user-facing page.

**No action needed.**

---

### 3. `member_privacy` — SEEDED (8 rows)

All set to `profile_visibility='public'`, `is_discoverable=true`, `show_items_on_profile=true`, `locality_precision='neighborhood'`. Good for showcase — every profile is visible and discoverable.

**No action needed.**

---

### 4. `member_handle_history` — SKIP

Tracks handle changes over time. No TGP member has changed their handle. Intentionally empty — the showcase doesn't need handle-change history to look alive. This table surfaces nowhere in the UI at b1.

---

### 5. `member_interests` — SEEDED (13 rows)

Tags per member: food/bakery (Maya), bicycles/repair (Theo), community/repair (Rosa), gardening/food (Sam), crafts (Priya), coffee (Jonah), community/sustainability (Nadia), education (Casey).

**Gap:** Only 1-2 tags per member. Profiles with more tags feel richer and help the interest-matching discovery surface.

**Proposed additions (2-3 more tags per member):**

| Member | Add tags |
|---|---|---|
| Maya | sourdough, local-grain, baking |
| Theo | sustainability, tools, diy |
| Rosa | organizing, markets, mutual-aid |
| Sam | composting, seeds, sustainability |
| Priya | pottery, teaching, ceramics |
| Jonah | coffee, small-batch, sustainability |
| Nadia | governance, questions, community |
| Casey | reading, mentoring, volunteering |

---

### 6. `member_follows` — SEEDED (10 rows)

Current graph: Rosa/Nadia/Casey/Jonah → Maya. Maya/Theo/Sam/Priya → Rosa. Nadia → Sam. Rosa → Priya.

**Gap:** 10 edges for 8 nodes is sparse. A real small community has denser connections. Several members (Theo, Casey, Jonah) have zero inbound follows or very few connections.

**Proposed additions (~8 more edges):**

- Sam → Maya (fellow food person)
- Priya → Sam (fellow maker)
- Theo → Jonah (market neighbors)
- Jonah → Theo (reciprocal)
- Casey → Rosa (community elders)
- Maya → Sam (ingredient source)
- Nadia → Priya (curiosity)
- Casey → Sam (garden interest)

---

### 7. `member_self_records` — ADD

Agent assistance context — what the platform's assistant knows about each member. Currently empty. The `/you/data` page (b1 substrate surface) will be blank for every character.

**Proposed content (one row per member with realistic `document` JSONB):**

| Member | document summary |
|---|---|
| Maya | `{"preferences": {"baking_schedule": "Wed and Sat", "flour_source": "Central Milling, Petaluma", "oven_temp_unit": "fahrenheit"}, "notes": "Prefers to be reminded about cake orders 48h ahead. Allergic to tree nuts."}` |
| Theo | `{"preferences": {"tool_brands": ["Park Tool", "Knipex"], "repair_style": "teach the owner to fix it"}, "notes": "Busiest on Saturdays. Wants to learn welding."}` |
| Rosa | `{"preferences": {"event_format": "potluck preferred", "communication": "prefers text over calls"}, "notes": "Organizing since 2019. Tracks vendor RSVPs in a paper notebook."}` |
| Sam | `{"preferences": {"growing_zone": "9b", "seed_sources": ["Baker Creek", "Territorial"]}, "notes": "Has 6 raised beds. Shares surplus freely. Interested in permaculture."}` |
| Priya | `{"preferences": {"clay_type": "stoneware", "kiln": "electric cone 6", "class_size_max": 4}, "notes": "Only teaches on weekends. Looking for studio share partners."}` |
| Jonah | `{"preferences": {"roast_profile": "light-medium", "bean_origin": "Ethiopia Yirgacheffe"}, "notes": "Cart is parked at Pond Side Commons. Considering a brick-and-mortar."}` |
| Nadia | `{"preferences": {"question_style": "open-ended", "reading": "Ostrom, Jacobs, Putnam"}, "notes": "New to the neighborhood as of last year. Asks a lot of questions — it's how she connects."}` |
| Casey | `{"preferences": {"subjects": ["reading", "math", "history"], "age_range": "6-14"}, "notes": "Retired 2023. Volunteers at the library Tuesdays and Thursdays."}` |

All rows: `scratch_or_full = 'full'`.

---

### 8. `member_delegations` — ADD

Agent delegation — what actions a member has authorized the assistant to do on their behalf. Currently empty. Populating this shows the delegation management surface has content.

**Proposed content (3-4 delegations, varied scopes):**

| Member | grantee_label | scopes | notes |
|---|---|---|---|
| Maya | "Market-day assistant" | `{item.update, item.respond}` | Expires end of market season |
| Rosa | "Event coordinator helper" | `{item.create, item.update, item.respond}` | For managing Repair Cafe RSVPs |
| Sam | "Garden tracker" | `{item.update}` | Update seedling availability |
| Nadia | "Question monitor" | `{item.respond}` | Track interest on her wonders |

---

### 9. `member_place_interests` — SEEDED (8 rows)

Each member has one `primary_home` pointing to a TGP neighborhood. Good coverage.

**Gap:** No `secondary` scope_kind entries. Adding a few would show the multi-place awareness feature.

**Proposed additions (secondary interests):**

| Member | Place | scope_kind |
|---|---|---|
| Maya | Market Square | secondary |
| Rosa | Orchard Hill | secondary |
| Rosa | Pond Side | secondary |
| Theo | Pond Side | secondary |
| Sam | Market Square | secondary |

---

### 10. `member_saved_searches` — ADD

Saved searches / subscriptions — the generalized follow mechanism. Currently empty. This is a key discovery feature with no showcase data.

**Proposed content (5-6 saved searches):**

| Member | label | Filters |
|---|---|---|
| Nadia | "New ideas in The Good Place" | place_id=TGP city, item_kinds={wonder, initiative} |
| Maya | "Food at Market Square" | place_id=Market Square, interest_tags={food} |
| Casey | "Events for kids" | place_id=TGP city, item_kinds={gathering}, interest_tags={education} |
| Theo | "Repair and tools" | place_id=TGP city, interest_tags={repair, tools} |
| Sam | "Gardening stuff nearby" | place_id=Orchard Hill, interest_tags={gardening} |
| Priya | "Craft events" | place_id=TGP city, item_kinds={gathering}, interest_tags={crafts} |

---

### 11. `member_business_jurisdictions` — SEEDED (1 row)

Maya's self-attested locality claim for The Good Loaf at ZIP 00001. Sufficient — only one kind='business' Group exists.

**No action needed** unless we add another business Group (see Groups section below).

---

### 12. `member_prompts` — SKIP

Runtime-triggered UX prompts (e.g., "Turn on discoverability?"). These fire from user actions, not seed data. Intentionally empty — populating would show stale prompt state that doesn't match user flow.

---

### 13. `member_embeddings` — SKIP

ML vector embeddings for member similarity search. Infrastructure table — populated by background jobs, not seed data. Deny-all RLS.

---

### 14. `locations` — SEEDED (4 rows)

The Good Market (recurring_temporary), Pond Side Commons (permanent), Orchard Hill Community Kitchen (permanent), The Good Place Library (permanent).

**Gap:** No kind='area' location. Service areas (Theo's bike repair radius, Sam's seedling delivery zone) would show this Location kind is alive.

**Proposed additions (1-2 area locations):**

| Label | Kind | Owner | Description |
|---|---|---|---|
| Theo's Repair Radius | area | Theo | "I'll come to you within 3 miles of Market Square for tune-ups" |
| Sam's Seedling Delivery | area | Sam | "Free seedling delivery within the Good Place city limits" |

Each gets a `location_areas` child row with a polygon or radius.

---

### 15. `location_permanent` — SEEDED (3 rows)

Pond Side Commons, Orchard Hill Kitchen, Library. Each has street address, public hours (JSONB), and accessibility notes.

**No action needed.**

---

### 16. `location_recurring_temporary` — SEEDED (1 row)

The Good Market: `FREQ=WEEKLY;BYDAY=SA`, 08:00-13:00.

**No action needed.**

---

### 17. `location_areas` — ADD

Empty. No area-type locations in the seed. See item 14 above — adding area locations would populate this.

**Proposed content:**

| Location | area_kind | radius_meters |
|---|---|---|
| Theo's Repair Radius | service_radius | 4828 (3 miles) |
| Sam's Seedling Delivery | service_radius | 8047 (5 miles) |

---

### 18. `location_events` — SEEDED (derived)

`location.created` events for each location. Adequate.

**No action needed.**

---

### 19. `groups` — SEEDED (3 rows)

The Good Loaf (business), Pond Side Circle (interest), Repair Cafe Regulars (event_anchored).

**Gap:** Only 3 of 6 Group kinds are represented. Missing: place, practice, family. Since b1 ships all six kinds, the showcase should demonstrate at least 4-5.

**Proposed additions:**

| Name | Kind | Founder | Description | Anchor Location |
|---|---|---|---|---|
| Market Square Neighbors | place | Rosa | "People who live around and care about Market Square" | — (place-anchored, not location-anchored) |
| Morning Yoga by the Pond | practice | Priya | "Tuesday and Thursday mornings, all levels, bring a mat" | Pond Side Commons |

Family kind intentionally skipped — it's privacy-sensitive and showing fictional family relationships in a demo feels off.

Each new Group needs: `group_memberships` rows, `group_events` (created + activated), and for `place` kind, appropriate members.

---

### 20. `group_businesses` — SEEDED (1 row)

The Good Loaf: sole_prop, state TG, public_description about sourdough and cakes.

**Gap:** Consider adding Jonah's cold brew as a second business Group. This would show that the business-group pattern works for more than one producer and populate a second shop page.

**Proposed addition:**

| Name | Display Name | Legal Entity | Description |
|---|---|---|---|
| Pond Side Coffee | Pond Side Coffee | sole_prop | "Single-origin cold brew, brewed slow and served by the growler. Cart parked at Pond Side Commons." |

Requires: new `groups` row (kind='business'), new `group_businesses` row, `group_memberships` (Jonah as owner), `member_business_jurisdictions` (Jonah at ZIP 00001), `group_events`. Jonah's Cold Brew product and service items could be re-filed under this Group with `brand_label = 'Pond Side Coffee'`.

---

### 21. `group_event_anchored` — SEEDED (1 row)

Repair Cafe Regulars with `seeded_by_item_id` pointing to the Repair Cafe gathering item.

**No action needed.**

---

### 22. `group_memberships` — SEEDED (10 rows)

Three Groups × their respective members. Roles are varied (owner, baker, steward, member, host, fixer).

**Additions needed** for any new Groups proposed above. For the two proposed Groups:

- Market Square Neighbors: Rosa (steward), Maya (member), Theo (member), Jonah (member), Nadia (member)
- Morning Yoga by the Pond: Priya (instructor), Rosa (member), Sam (member)
- Pond Side Coffee (if added): Jonah (owner)

---

### 23. `group_events` — SEEDED (derived)

`group.created` and `group.activated` for each Group. Adequate.

**Extend** for any new Groups.

---

### 24. `items` — SEEDED (16 rows)

4 products, 4 services, 3 gatherings, 2 wonders, 1 offer, 1 ask, 1 initiative. All 7 item kinds are represented — excellent coverage.

**Gap:** `photo_url` is null for all items. Feed cards and item detail pages will show no images. This is the single biggest visual gap in the showcase.

**Proposed:** Add `photo_url` values using Unsplash source URLs or placeholder image service URLs (e.g., `https://images.unsplash.com/photo-{id}?w=600&h=400&fit=crop`). At minimum, products and gatherings should have photos.

| Item | Suggested photo subject |
|---|---|
| Country Sourdough Loaf | Artisan sourdough loaf on wooden board |
| Seeded Rye Loaf | Dark rye bread with seeds |
| Cold Brew by the Growler | Glass growler of cold brew coffee |
| Tomato and Pepper Seedlings | Small seedling pots in a tray |
| The Good Market | Outdoor farmers market scene |
| Repair Cafe | People repairing items at tables |
| Spring Seed Swap | Seed packets spread on a table |

**Gap:** `made_at_place_id` is null for all products. Maya's bread is explicitly "made in Orchard Hill" per her bio, so her products should have `made_at_place_id` set to the Orchard Hill neighborhood place, with `made_at_verification_source = 'self_attested'`. This lights up the "Locally Made" badge.

**Gap:** `established_on` is null on all Groups — minor but the "Est. 2023" line on a shop page adds character.

---

### 25. `item_products` — SEEDED (4 rows)

Country Sourdough ($9/loaf), Seeded Rye ($10/loaf), Cold Brew ($18/growler), Seedlings ($4/pot).

**Gap:** `photo_urls` array is `'{}'` for all products. This is the kind-specific photo field (separate from spine `photo_url`). Should populate with at least one URL per product.

**Gap:** `composition` (ingredients) is null for food products. Maya's bread should list ingredients — this is a real thing buyers look at.

**Proposed additions:**

| Product | composition |
|---|---|
| Country Sourdough | "Organic bread flour, water, sea salt, wild yeast starter" |
| Seeded Rye | "Rye flour, bread flour, water, caraway seeds, sunflower seeds, flax seeds, sea salt, starter" |
| Cold Brew | "Single-origin Ethiopian Yirgacheffe, filtered water" |
| Seedlings | — (not applicable) |

---

### 26. `item_services` — SEEDED (4 rows)

Cake (quote), Bike Tune-Up ($45 flat), Wheel-Throwing ($55/hr), Homework Help ($30/hr).

**Gap:** `hours` is `'{}'` for all services. Populating weekly availability hours would make service pages feel real.

**Proposed:**

| Service | hours |
|---|---|
| Custom Celebration Cake | `{"wednesday": [{"open": "09:00", "close": "15:00"}], "friday": [{"open": "09:00", "close": "15:00"}]}` |
| Saturday Bike Tune-Up | `{"saturday": [{"open": "08:00", "close": "13:00"}]}` |
| Wheel-Throwing Basics | `{"saturday": [{"open": "10:00", "close": "16:00"}], "sunday": [{"open": "10:00", "close": "14:00"}]}` |
| Homework Help | `{"tuesday": [{"open": "15:00", "close": "17:00"}], "thursday": [{"open": "15:00", "close": "17:00"}]}` |

---

### 27. `item_gatherings` — SEEDED (3 rows)

Good Market (weekly, free), Repair Cafe (monthly, cap 40, free), Seed Swap (one-time, cap 40, free).

**Gap:** `what_to_bring` is null for all gatherings.

**Proposed:**

| Gathering | what_to_bring |
|---|---|
| The Good Market | "Your own bags. Cash and card accepted at most stalls." |
| Repair Cafe | "Broken items you'd like to fix. Tools provided." |
| Spring Seed Swap | "Labeled seed packets or seedlings to trade. Bring your own containers." |

---

### 28. `item_wonders` — SEEDED (2 rows)

Tool library idea (Nadia, 4 interest) and Wednesday evening market question (Rosa, 3 interest).

**No action needed.** Two wonders is sufficient for the showcase.

---

### 29. `item_locations` — SEEDED (17 rows)

All items are linked to venues with appropriate schedule kinds. Good coverage.

**Extend** for any new items or locations added.

---

### 30. `item_responses` — SEEDED (34 rows)

Varied response kinds: save, purchase, interest, rsvp, follow, support, pledge. Creates realistic engagement across items.

**Gap:** Could add a few more to make response counts feel natural. Specifically, the Market and Repair Cafe should have more RSVPs (they're community staples), and Maya's products should have more purchase responses.

**Proposed additions (~10 more responses):**

- 3 more RSVPs for The Good Market (Priya, Casey, Sam)
- 2 more RSVPs for Repair Cafe (Nadia, Casey)
- 2 more purchases for Country Sourdough (Casey, Nadia)
- 1 more interest on Tool Library wonder (Casey)
- 2 more follows on Spring Seed Swap (Maya, Priya)

---

### 31. `item_tags` — SEEDED (24 rows)

Controlled vocabulary tags per item. Good coverage.

**No action needed.**

---

### 32. `item_hashtags` — SEEDED (10 rows)

Free-form hashtags across items. Good coverage.

**No action needed.**

---

### 33. `item_events` — SEEDED (derived)

`item.created` and `item.published` for each item. Adequate.

**Extend** for any new items.

---

### 34. `item_embeddings` — SKIP

ML vector embeddings for item similarity. Infrastructure — populated by background jobs. Deny-all RLS.

---

### 35. `places` — SEEDED (6 rows)

TGP hierarchy: state → county → city → 3 neighborhoods (Market Square, Pond Side, Orchard Hill). Plus real Sacramento data from migration 017/026.

**No action needed.**

---

### 36. `place_events` — SEEDED (derived)

`place.created` for each TGP place. Adequate.

**No action needed.**

---

### 37. `zip_metro_crosswalk` — SEEDED (1 row for TGP)

ZIP 00001 → MSA 99999 "The Good Place, TG". Plus real Sacramento ZIPs from migration 025.

**No action needed.**

---

### 38. `metro_polygons` — ADD (for TGP)

Has the Sacramento-Roseville CSA from migration 031, but **no TGP metro polygon**. This means TGP members can't resolve `home_metro_id`, and any metro-scoped feature (locality badge, metro feed) won't work.

**Proposed:** Add one row:

| name | slug | csa_code | geography | centroid |
|---|---|---|---|---|
| The Good Place | the-good-place | 99999 | (polygon matching TGP state boundary) | (derived) |

Then UPDATE all 8 TGP members to set `home_metro_id` to this row's ID.

---

### Summary Scorecard

| Status | Count | Tables |
|---|---|---|
| **SEEDED — adequate** | 24 | members, member_events, member_privacy, member_interests, member_follows, member_place_interests, member_business_jurisdictions, locations, location_permanent, location_recurring_temporary, location_events, groups, group_businesses, group_event_anchored, group_memberships, group_events, items, item_products, item_services, item_gatherings, item_wonders, item_locations, item_responses, item_tags, item_hashtags, item_events, places, place_events, zip_metro_crosswalk |
| **SEEDED — needs enrichment** | 7 | members (avatars, metro), member_interests (more tags), member_follows (more edges), items (photos, made_at), item_products (composition, photos), item_services (hours), item_gatherings (what_to_bring) |
| **ADD — should populate** | 5 | member_self_records, member_delegations, member_saved_searches, location_areas, metro_polygons (TGP row) |
| **ADD — new Groups** | 2-3 | place kind, practice kind, optional second business |
| **SKIP — intentionally empty** | 4 | member_handle_history, member_prompts, member_embeddings, item_embeddings |

### Priority Order for Implementation

1. **Photo URLs on items and item_products** — biggest visual impact
2. **Avatar URLs on members** — every profile page benefits
3. **TGP metro_polygons row + home_metro_id backfill** — unlocks metro features
4. **member_self_records** — shows agent assistance substrate is alive
5. **member_saved_searches** — shows discovery/subscription surface
6. **Additional Groups (place + practice kinds)** — demonstrates all Group kinds
7. **Enrichments** (composition, hours, what_to_bring, more follows/interests) — depth
8. **member_delegations** — shows delegation management
9. **location_areas** — demonstrates area-type locations
10. **Pond Side Coffee business Group** — second shop page

---

## Part 2: Social Links Proposal

### The Message

"This isn't another social media platform you have to manage. Bring what you already have."

Social links let producers and members surface their existing online presence — Instagram, Etsy shop, personal website, YouTube channel — directly on their platform profile. We link out; we don't pull in. The platform is where the coordination happens; the existing social accounts are where the brand already lives.

### Current Schema Coverage

**None.** The `members` table has no columns for external URLs, social handles, or website links. Neither `member.md` nor `producer-tools.md` mentions social links at any tier. This is a gap — every comparable local-producer platform (Etsy, Square, Faire) surfaces the seller's social presence.

### Proposed Schema

New table: `member_social_links`. Follows the project's normalized pattern (one row per link, not a JSONB blob) for queryability and clean RLS.

```sql
CREATE TABLE member_social_links (
  member_id   uuid        NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  platform    text        NOT NULL,
  url         text        NOT NULL,
  display_label text,                    -- optional custom label, e.g. "My Etsy Shop"
  display_order smallint  NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  removed_at  timestamptz,
  PRIMARY KEY (member_id, platform)
);

-- One active link per platform per member
CREATE UNIQUE INDEX ux_social_links_active
  ON member_social_links (member_id, platform)
  WHERE removed_at IS NULL;

-- RLS: public read of active links, owner write
ALTER TABLE member_social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_links_public_read ON member_social_links
  FOR SELECT USING (removed_at IS NULL);

CREATE POLICY social_links_owner_write ON member_social_links
  FOR ALL USING (member_id = auth.uid());
```

**Controlled platform values** (CHECK constraint or application-level validation):

| Platform key | Display name | Icon |
|---|---|---|
| `instagram` | Instagram | Instagram glyph |
| `facebook` | Facebook | Facebook glyph |
| `tiktok` | TikTok | TikTok glyph |
| `youtube` | YouTube | YouTube glyph |
| `x` | X | X glyph |
| `threads` | Threads | Threads glyph |
| `bluesky` | Bluesky | Bluesky glyph |
| `mastodon` | Mastodon | Mastodon glyph |
| `linkedin` | LinkedIn | LinkedIn glyph |
| `pinterest` | Pinterest | Pinterest glyph |
| `etsy` | Etsy | Etsy glyph |
| `substack` | Substack | Substack glyph |
| `patreon` | Patreon | Patreon glyph |
| `website` | Website | Globe/link icon |

Use a CHECK constraint on `platform` to enforce this list. New platforms are a migration to extend the CHECK — intentional friction to prevent sprawl.

**Event log entry:** Add `member.social_link_added` and `member.social_link_removed` to `member_events` CHECK constraint.

### Where It Renders

**Member profile page (`/m/[handle]`):**
- Icon row below bio, above the Items section
- Each icon links out to the external URL in a new tab
- Hover/tap shows the `display_label` (or platform name if no label)
- `display_order` controls left-to-right sequence
- Only shown when `profile_visibility` is public or unlisted (respects existing privacy controls)

**Shop page (kind='business' Group page):**
- The Group founder/owner's social links render in the shop sidebar, under the "About" section
- Labeled as the Group's brand name, not the member's name — "Follow The Good Loaf" not "Follow Maya"
- Links are from the owner member's `member_social_links`, not a separate Group-level table. Groups don't have their own social presence — the human behind the Group does.

**Item detail pages:**
- Not rendered. The attribution line already links to the profile or shop page, which has the social links. Avoid duplication.

### Content Strategy: Link Out, Don't Pull In

**b1:** Link-out only. Icon + external URL. No API integration, no content embedding, no oauth with social platforms.

**Why not pull in content:**
- Social platform APIs are fragile, rate-limited, and change without notice
- OAuth per user per platform is a massive auth surface to maintain
- Embedding Instagram photos or TikTok videos creates CDN dependencies and copyright exposure
- The platform's value prop is coordination, not aggregation — we don't need to be a social media dashboard

**b2 consideration:** Open Graph preview cards for the `website` platform type. Fetch og:title, og:description, og:image at link-save time and cache. Low maintenance, high visual impact. Only for `website` — social platforms' OG tags are unreliable.

**b3 consideration:** Optional Instagram grid widget (3-6 recent photos) using Instagram Basic Display API. Opt-in per member. Graceful degradation when the API token expires — show the link icon, hide the grid.

### Seed Data for The Good Place

```sql
INSERT INTO member_social_links (member_id, platform, url, display_label, display_order)
VALUES
  -- Maya Okonkwo (baker)
  ('...maya-uuid...', 'instagram', 'https://instagram.com/thegoodloaf', '@thegoodloaf', 1),
  ('...maya-uuid...', 'website', 'https://thegoodloaf.example.com', 'thegoodloaf.com', 2),

  -- Theo Brandt (bike mechanic)
  ('...theo-uuid...', 'instagram', 'https://instagram.com/theo.wrenches', '@theo.wrenches', 1),
  ('...theo-uuid...', 'youtube', 'https://youtube.com/@theofixesit', 'Theo Fixes It', 2),

  -- Rosa Delgado (organizer)
  ('...rosa-uuid...', 'facebook', 'https://facebook.com/thegoodmarket', 'The Good Market', 1),
  ('...rosa-uuid...', 'instagram', 'https://instagram.com/rosa.convenes', '@rosa.convenes', 2),

  -- Sam Whitfield (gardener)
  ('...sam-uuid...', 'instagram', 'https://instagram.com/samsgarden', '@samsgarden', 1),
  ('...sam-uuid...', 'tiktok', 'https://tiktok.com/@seedling.sam', '@seedling.sam', 2),

  -- Priya Raman (potter)
  ('...priya-uuid...', 'instagram', 'https://instagram.com/priya.throws', '@priya.throws', 1),
  ('...priya-uuid...', 'etsy', 'https://etsy.com/shop/priyapottery', 'Priya Pottery on Etsy', 2),

  -- Jonah Kessler (cold brew)
  ('...jonah-uuid...', 'instagram', 'https://instagram.com/pondside.coffee', '@pondside.coffee', 1),
  ('...jonah-uuid...', 'tiktok', 'https://tiktok.com/@coldbrewjonah', '@coldbrewjonah', 2),

  -- Nadia Halim (questioner)
  ('...nadia-uuid...', 'bluesky', 'https://bsky.app/profile/nadia.halim', '@nadia.halim', 1),

  -- Casey Lindqvist (retired teacher)
  ('...casey-uuid...', 'website', 'https://caseyreads.example.com', 'caseyreads.com', 1)
ON CONFLICT (member_id, platform) DO NOTHING;
```

**Character rationale:** Each member's social presence matches their personality. Maya and Jonah (food/beverage producers) lead with Instagram — visual products. Theo has a YouTube repair channel. Rosa uses Facebook for community organizing (her demographic). Priya sells pottery on Etsy. Sam and Jonah are on TikTok (younger, trend-aware). Nadia is on Bluesky (intellectual, early-adopter). Casey has a simple website (older, less social-media-native). Nobody has every platform — that's realistic.

### Naming Convention Entry

| Schema (durable) | URL | UI label | UI verb |
|---|---|---|---|
| `member_social_links` | n/a (not a standalone page) | **Links** or **Find me elsewhere** | Add link |

### Spec Updates Required

If this proposal is accepted:

1. **`product/systems/member.md`** — add `member_social_links` to the Identity fields section at b1. Note: link-out only, controlled platform list, one per platform, respects profile visibility.
2. **`product/ui/community-platform.md`** — add social links icon row to Member Profile page wireframe.
3. **`product/systems/producer-tools.md`** — mention social links rendering on shop page sidebar.
4. **Migration** — new migration `037_member_social_links.sql`.
5. **Seed** — extend `the-good-place.sql` with the INSERT above.

### Design Considerations

**Icon rendering:** Use Lucide icons where available (Globe for website, matching glyphs for major platforms). For platforms without a Lucide icon, use a simple colored circle with the platform's first letter. Keep the icon row compact — 6-8 icons max visible, overflow into a "+N more" popover.

**URL validation:** Validate URL format on insert. Don't validate that the URL actually resolves — links break, and we don't want to ping external services on every profile save.

**Privacy:** Social links inherit the member's `profile_visibility` setting. If a profile is `members_only`, social links are only visible to authenticated members. If `private`, links are hidden. No separate per-link visibility toggle at b1.

**Abuse surface:** URLs are user-submitted. Display as text links with `rel="noopener noreferrer ugc"`. Never render as iframes or embed external content. The platform name in the `platform` column is from the controlled list, so it can't be spoofed — but the URL could point anywhere. Standard link-safety applies.
