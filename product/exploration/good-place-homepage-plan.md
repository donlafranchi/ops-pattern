---
purpose: Technical plan for defaulting the home page to The Good Place for anonymous visitors and making the showcase items beautiful
layer: exploration
status: draft
---

# The Good Place as Home Page Default

## Problem

Anonymous visitors and signed-in members with no `primary_home` set currently land on a feed scoped to `sacramento` — a real place with no seeded content. The result is an empty-looking feed that communicates nothing about what the platform is. The Good Place is a fully-seeded fictional locality with 16 items across all 7 kinds, 8 members, 4 venues, and 3 groups. It should be the default showcase until real communities reach critical mass.

---

## Part 1: Route the Home Feed to The Good Place

### Current flow

`resolveFeedPlace()` in `web/src/lib/feed/feed-place.ts` resolves in order:

1. Authenticated member's `primary_home` (from `member_place_interests`)
2. Explicit `?place=<slug>` query param
3. Hardcoded `LAUNCH_PLACE_SLUG = 'sacramento'`

Anonymous visitors always hit step 3.

### Change

Replace the hardcoded constant with a configurable showcase slug and add awareness of the showcase mode to the feed UI.

#### 1. `feed-place.ts` — swap the constant

```
// before
export const LAUNCH_PLACE_SLUG = 'sacramento'

// after
export const SHOWCASE_PLACE_SLUG = 'the-good-place'
export const LAUNCH_PLACE_SLUG = SHOWCASE_PLACE_SLUG
```

The `resolveFeedPlace` function itself is unchanged — step 3 already calls `bySlug(supabase, LAUNCH_PLACE_SLUG)`. The slug `the-good-place` resolves to the city-level place row (id `10000000-…-0003`, kind `city`), which is the right polygon to match all seeded items via `ST_Intersects` in `locality_feed_items`.

No env var or feature flag needed at b1. The constant is the flag — changing it to a real place slug (or to an env-driven value) is the transition mechanism.

#### 2. `LocalityFeed.tsx` — showcase-aware banner

When the resolved place is the showcase, the anonymous banner should communicate that this is example content:

```
// Detect showcase mode
const isShowcase = place.slug === SHOWCASE_PLACE_SLUG && !user
```

Replace `MakeThisYoursBanner` copy for showcase mode:

- **Headline:** "See what a community looks like here"
- **Subtext:** "This is The Good Place — a fictional neighborhood showing what happens when people share, sell, fix, and organize together. Sign up to start one where you are."
- **CTA:** "Get started" → `/auth/login?next=/onboarding`

The `ScopePicker` should still render so visitors can navigate to real places if any exist.

#### 3. Feed heading

When in showcase mode, the feed heading should read "The Good Place" (not "Near The Good Place") and include a small "(example community)" qualifier beneath it.

### What the visitor sees

A fully-populated feed scoped to The Good Place's city polygon. The `locality_feed_items` RPC will return all 16 items because every seeded item has an `item_locations` row linking it to a venue inside that polygon. The feed renders in the existing 2-col / 3-col grid of `ItemFeedCard` components. The scope picker lets visitors browse to other places.

### Transition strategy

Three thresholds, evaluated in order:

1. **Manual switch.** When the first real community (likely Sacramento or another launch city) has ≥20 published items and ≥5 active members, change `LAUNCH_PLACE_SLUG` to that city's slug. The Good Place remains reachable at `/?place=the-good-place`.

2. **IP geolocation (b2).** When the deferred IP-geolocation path ships, the fallback constant only fires when geolocation fails. The Good Place becomes the true last resort.

3. **Retirement.** When ≥3 real metro areas each have ≥20 items, the showcase has served its purpose. The seed data can stay (it's clearly tagged `demo_seed: "the-good-place"`) but the constant can switch to a generic "pick your place" empty state or the strongest real metro.

No automated user-count check needed at b1. The switch is a one-line constant change, deployed as a normal commit.

---

## Part 2: Showcase Item Briefs

The feed card (`ItemFeedCard.tsx`) is currently text-only — no image field. The `photo_urls` column exists on `item_products` but is empty (`array[]::text[]`) for all seed items, and the feed card component doesn't render images at all. Making items "look beautiful" means two things: (a) adding photos to the seed data and wiring the feed card to show them, and (b) tightening copy so each item reads as a compelling real listing.

### Image strategy

Images should be stored in Supabase Storage (public bucket, e.g. `showcase-images/`) and referenced by URL in:
- `item_products.photo_urls` for products
- A new `photo_url` column on `items` (or in `ambient_extras` as `{"photo_url": "..."}`) for non-product kinds

The feed card gets a conditional image block above the text when a photo URL is present. This is a small ticket — add the field to `discoverable_items`, pass it through `locality_feed_items`, render in `ItemFeedCard`.

### Per-kind showcase items

Below: the single best item per kind, with image brief and copy polish. Items are identified by their seed titles.

---

#### Product: "Country Sourdough Loaf"

**Why this one.** It's the anchor product of The Good Loaf (the only seeded Shop). Bread is universal, photogenic, and immediately legible as "local commerce."

**Image brief.** A single round sourdough boule on a flour-dusted wooden board, deeply scored with an ear, dark golden crust, shot from above at a slight angle. Natural light from a window. Background: the edge of a linen cloth and a wooden counter. Warm tones. No hands, no knife, no slice — the whole uncut loaf is the hero. Aspect ratio 4:3 landscape to fill the card width.

**Copy polish.** Title is good as-is. Description tweak — tighten the second sentence:

> Before: "Thirty-six hour ferment, stone-milled flour from two valleys over, baked dark. Wednesday and Saturday only. Bring your own bag if you remember."
>
> After: "Thirty-six-hour ferment, stone-milled flour from two valleys over. Wednesdays and Saturdays at the market. Bring a bag."

**Card fields.** Kind chip: "Product" · Title: Country Sourdough Loaf · Owner: The Good Loaf · Venue: The Good Market · Price: $9/loaf

---

#### Service: "Saturday Bike Tune-Up"

**Why this one.** Services need a human doing the thing. A bike tune-up at a market stall is specific, local, and immediately understood. More visually interesting than a cake quote or tutoring.

**Image brief.** A pair of hands adjusting a rear derailleur on an upside-down bicycle, outdoors under dappled shade (suggesting the market oak). The mechanic wears a canvas apron. In the soft background: market stalls, bunting, people walking. Mid-morning light. Shot tight on the hands and wheel, not a portrait. Aspect ratio 4:3 landscape.

**Copy polish.** Good as-is. One small tighten:

> Before: "Brakes, gears, chain, true the wheels. Flat rate, done while you do the market. Bring the bike, not an appointment."
>
> After: "Brakes, gears, chain, wheels trued. Flat rate, done while you shop the market. Bring the bike, not an appointment."

**Card fields.** Kind chip: "Service" · Title: Saturday Bike Tune-Up · Owner: Theo Brandt · Venue: The Good Market · Rate: $45 flat

---

#### Gathering: "The Good Market"

**Why this one.** It's the anchor gathering and the physical heart of the seed world — the recurring Saturday market. More photogenic and communal than the Repair Cafe or Seed Swap.

**Image brief.** An aerial-ish shot (slightly elevated, not drone) of a small outdoor market in a tree-lined square. Ten to fifteen canopy-covered stalls in two rows, a scattering of people between them. Morning light, long shadows. One stall has bread on display, another has plants. A coffee cart is visible at the edge. A large oak tree anchors one corner. Warm palette — greens, whites, wood tones. Aspect ratio 16:9 landscape (wider to convey the scene).

**Copy polish.**

> Before: "Every Saturday, eight until one, rain or shine. Thirty-odd stalls, live music after eleven, and a bike stand under the oak."
>
> After: "Every Saturday, 8 AM – 1 PM, rain or shine. Thirty-odd stalls, live music after eleven, a bike repair stand under the oak."

**Card fields.** Kind chip: "Event" · Title: The Good Market · Owner: Rosa Delgado · Venue: The Good Market · Next: [computed Saturday] · Free

---

#### Idea (Wonder): "What if we had a tool library?"

**Why this one.** It's the more interesting of the two wonders — tangible, relatable, shows the platform's "float an idea and see who bites" loop. The Wednesday-market wonder is too meta (it's about the platform's own market).

**Image brief.** A tidy wall of tools in a garage or shed — hammers, saws, drills, a circular saw — hung on pegboard hooks. A simple hand-lettered sign or label says "BORROW" on a piece of tape. Natural light from an open garage door. Tools are well-used but organized. Warm, practical, not Pinterest-perfect. Aspect ratio 4:3 landscape.

**Copy polish.** Title is perfect — the question mark is doing work. Description tweak for flow:

> Before: "I own a tile saw I have used twice. Theo owns a pressure washer. Between the eleven of us on this street there is probably a whole hardware store sitting in sheds. Somewhere to put it and a sign-out sheet is most of the work."
>
> After: "I own a tile saw I've used twice. Theo has a pressure washer. Between eleven of us on this street there's probably a whole hardware store sitting in sheds. A shelf, a sign-out sheet, and a neighbor who says yes is most of the work."

**Card fields.** Kind chip: "Idea" · Title: What if we had a tool library? · Owner: Nadia Halim · Venue: Pond Side Commons · Interest: 4 people

---

#### Offer: "Free plums — come pick"

**Why this one.** It's the only seeded offer, and it's excellent — generous, seasonal, no-strings. The copy already sings.

**Image brief.** A loaded Santa Rosa plum tree, fruit deep red-purple, some branches hanging low. A wooden ladder leans against the trunk. Late-afternoon golden light. A simple fence and an open gate in the background. Shallow depth of field — the nearest plums are sharp, the background is soft. Aspect ratio 4:3 landscape.

**Copy polish.** Already great. One tiny tighten:

> Before: "The Santa Rosa is going over faster than I can use it. Ladder is against the fence, gate is unlocked, take as much as you can carry."
>
> After: "The Santa Rosa is ripening faster than I can use it. Ladder's against the fence, gate's unlocked — take as much as you can carry."

**Card fields.** Kind chip: "Offer" · Title: Free plums — come pick · Owner: Sam Whitfield · Venue: Orchard Hill Community Kitchen · 1 interested

---

#### Ask: "Folding table to borrow for market day"

**Why this one.** It's the only seeded ask, and it demonstrates the ask↔support response loop (Rosa already responded "I have one in the shed").

**Image brief.** A simple six-foot white folding table, partially set up, on grass next to a canvas market stall. A hand is unfolding one leg. Early morning, dew on the grass. The table is the hero — utilitarian, humble. In the background: empty market stalls being set up, a person carrying a crate. Aspect ratio 4:3 landscape.

**Copy polish.** Good. Minor:

> Before: "Six foot if anyone has one. Just for Saturday, back by two, I will bring it to wherever you are."
>
> After: "Six-foot, if anyone has one. Just for Saturday — back by two. I'll bring it to you."

**Card fields.** Kind chip: "Ask" · Title: Folding table to borrow for market day · Owner: Nadia Halim · Venue: The Good Market · 1 response ("I have one in the shed")

---

#### Initiative: "Neighborhood solar co-buy"

**Why this one.** It's the only seeded initiative, and it's the most ambitious item in the seed set — shows the platform's "organize together" potential. Has 4 pledges and 1 interest response already.

**Image brief.** A residential rooftop with solar panels being installed — two workers positioning a panel while a homeowner watches from the yard below. A suburban street of modest houses stretches behind, two other roofs already have panels. Bright midday sun, blue sky. The composition emphasizes the neighborhood scale (multiple houses) over the single install. Aspect ratio 16:9 landscape.

**Copy polish.** Strong. One tighten:

> Before: "Twenty roofs buying together gets a materially better price than twenty roofs buying alone. I am collecting names, not deposits. At twenty I will get three real quotes and put them in front of everyone."
>
> After: "Twenty roofs buying together beats twenty roofs buying alone. I'm collecting names, not deposits. At twenty I'll get three real quotes and put them in front of everyone."

**Card fields.** Kind chip: "Initiative" · Title: Neighborhood solar co-buy · Owner: Nadia Halim · Venue: Pond Side Commons · 4 pledged · 1 interested

---

## Implementation sequence

1. **Swap the constant** — change `LAUNCH_PLACE_SLUG` to `the-good-place` in `feed-place.ts`. One-line change, instant effect. No migration.
2. **Showcase banner** — update `MakeThisYoursBanner` (or a wrapper) to detect showcase mode and show the "example community" framing.
3. **Add image support to feed cards** — add `photo_url` to `discoverable_items`, pass through `locality_feed_items`, render in `ItemFeedCard` with a fallback gradient when absent.
4. **Source or generate images** — 7 images per the briefs above. Upload to Supabase Storage.
5. **Update seed SQL** — populate `photo_urls` / `photo_url` fields and apply the copy tweaks.
6. **Polish the detail pages** — the individual item pages (`/p/…/p/…`, `/m/…/s/…`, etc.) should render the photos and updated copy. This is already handled by existing detail-page components once the data is present.

Steps 1–2 are a single ticket. Step 3 is a separate card-enhancement ticket. Steps 4–5 are a seed-update ticket. Step 6 is verification only.
