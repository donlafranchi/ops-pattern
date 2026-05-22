# Product Format: How the App Works

## The Model

Movers, Makers & Shakers is a **local food marketplace** — not a social network, not a review site, not a map app. The closest analogues are Etsy and Bandcamp: producer-owned storefronts arranged for consumer browsing, with the platform providing discovery and structure but never inserting itself into the relationship.

The key difference: everything is **local and seasonal.** The content changes with the calendar, the weather, and what's in the ground. The app feels alive because local food *is* alive — it has rhythms that the platform surfaces rather than manufactures.

### What We Are

| Attribute | Our approach |
|---|---|
| Discovery model | Curated browsing — structured collections, not search-first |
| Content | Producer-generated (stories, video, availability) + event listings |
| Tone | Farmers market on a Saturday morning — friendly, unhurried, real |
| Relationship | Direct: consumer ↔ producer. Platform never intermediates. |
| Revenue | Flat fee to producers, never a cut of sales |
| Rhythm | Seasonal and weekly — what's available *now*, what's happening *this weekend* |

### What We Are Not

| Anti-pattern | Why not |
|---|---|
| Yelp (search + reviews) | We don't rate. Discovery is browsing, not searching for a known need. |
| Instagram (algorithmic feed) | We don't optimize for engagement. No infinite scroll, no algorithm. |
| DoorDash (delivery logistics) | We don't deliver. We connect and get out of the way. |
| Whole Foods (premium grocery) | We don't sell. Producers sell. We don't curate for "quality." |

---

## Home Screen: The Marketplace

The home screen is a **curated, structured browse experience** — not a map, not a feed, not a search bar. Think Etsy's home page: organized collections that invite exploration.

### Sections (top to bottom)

**1. Seasonal Spotlight**
One hero card. Rotates weekly. "It's asparagus season — 12 farms within 30 miles have it this week." Or: "Peach harvest is here. Meet the growers." Tapping opens a collection of relevant farms with their availability.

**2. This Weekend**
Events happening in the next 7 days within range. Farmers markets, farm tours, tastings, festivals. Each card shows: event name, date/time, location, distance, and how many producers are attending. Tapping opens the event page.

Examples:
- "Folsom Farmers Market — Saturday 8am–1pm — 14 producers"
- "Gilroy Garlic Festival — Fri–Sun — 40+ vendors"
- "Clarksburg Cheese & Wine Tasting — Sunday 2pm"

**3. New Farms Near You**
Recently registered producers within range. Card shows: farm name, distance, what they produce, one-line bio. Keeps the home screen fresh as the platform grows.

**4. Collections**
Editorially grouped (initially by the platform, eventually community-contributed):
- "Pasture-Raised Eggs Near Sacramento"
- "Grass-Fed Beef — Order by the Quarter"
- "Small-Batch Honey Within 50 Miles"
- "Farm Boxes & CSAs Accepting New Members"

**5. Know Your Brands**
Entry point to the brand transparency scanner. "Scan something from your pantry. See where it comes from." One tap opens the camera.

**6. Map**
Persistent bottom nav tab (not the home screen). Full-screen map with farm pins, event pins, and pickup point pins. Available anytime but not the default landing.

### Design Principles

- **No infinite scroll.** The home screen has a bottom. You can see everything relevant without getting lost.
- **No algorithm.** Sections are structured by proximity, seasonality, and recency — not engagement optimization.
- **Weekly cadence.** The Seasonal Spotlight and This Weekend sections change naturally, giving people a reason to come back without push notifications or engagement tricks.
- **Browse-first.** The home screen answers "what's around me and what's happening" before the consumer asks a specific question.

---

## Events: First-Class Citizens

Events are not metadata on farm profiles — they are **standalone, discoverable entities** equal in status to farms themselves. Events are discovery engines: someone attends a farmers market, meets a producer, and becomes a repeat customer through the app.

### Event Types

| Type | Example | Cadence |
|---|---|---|
| Farmers market | Folsom Farmers Market, Midtown Farmers Market | Weekly/recurring |
| Festival | Gilroy Garlic Festival, Sacramento Farm-to-Fork Festival | Annual |
| Tasting / tour | Clarksburg wine & cheese, Capay Valley farm tour | One-time or seasonal |
| Farm event | Open barn day, U-pick strawberries, harvest dinner | One-time |
| DIT group buy | Neighborhood quarter-cow split, egg share pickup | Scheduled |

### Event Page Structure

**Header:** Event name, date/time, location, distance from consumer

**Producers Attending:** List of farm/producer cards — each links to their full profile. This is the key bridge: the event introduces the consumer to the producer, the app keeps the relationship going.

**About:** Short description, organizer info, what to expect

**Map Pin:** Events appear on the map alongside farms. Different pin style (calendar icon or similar) so they're visually distinct but equally prominent.

**Sharing:** Events are shareable with the same flow as farm profiles. "Gilroy Garlic Festival — 40+ local producers. See who's there."

### How Events Connect to Producers

```
Consumer sees event on home screen
  → taps to see event page
    → sees list of attending producers
      → taps a producer → sees their farm profile
        → orders from that producer for next week's pickup
```

The event is the **top of the funnel.** The producer profile is the **ongoing relationship.** The app's job is to make that handoff seamless.

### Who Creates Events

- **Producers** create their own farm events (U-pick days, open barns, harvest dinners)
- **Event organizers** create markets and festivals (farmers market managers, festival committees)
- **Platform seeds** well-known recurring events initially (Sacramento Farm-to-Fork, Gilroy Garlic, major regional farmers markets) to have content at launch
- **Community members** can suggest events (moderated before publish) in later phases

---

## Producer Profiles: The Storefront

Each farm/ranch has a profile that functions as their **digital storefront** — like a Bandcamp artist page. It's theirs. They control it.

### Profile Structure

**Hero:** Farm name, location, distance, one-line bio. Hero image or embedded TikTok/Instagram video.

**Story:** In the farmer's own words. "Third-generation ranch. Grass-fed beef, no hormones, no feedlot." This is the emotional hook — meeting a neighbor, not reading a certification.

**Available This Week:** Product cards with name, price, quantity available. Updated by the farmer from their phone. This section changes weekly — it's the living, seasonal heartbeat of the profile.

**Pickup & Delivery:** Where and when to get their products. On-farm, shared drop points, delivery areas. With schedules.

**Upcoming Events:** Events this producer is attending or hosting. "Find us at the Midtown Farmers Market this Saturday, booth 12."

**Social Content:** Auto-pulled TikTok/Instagram posts. The farmer's content in their voice, embedded natively. No re-hosting, no re-branding.

**About the Farm:** Optional details — acreage, practices (pasture-raised, no-spray, regenerative), years in operation. Facts, not certifications. Displayed plainly.

---

## Navigation

### Bottom Nav (4 tabs)

| Tab | Purpose |
|---|---|
| **Home** | Marketplace browse — seasonal spotlight, events, collections |
| **Map** | Full-screen map with farm pins, event pins, pickup points |
| **Scan** | Brand transparency scanner (camera opens immediately) |
| **Profile** | Consumer: orders, saved farms, group buys. Producer: manage profile, availability, analytics |

### Key Flows

**Consumer discovery:**
Home → browse collections or events → tap farm → see profile → order for pickup

**Event discovery:**
Home → This Weekend → tap event → see producers → tap producer → ongoing relationship

**Brand comparison:**
Scan tab → scan barcode → see brand info → see local alternative → tap farm → order

**Producer management:**
Profile tab → update availability → set pickup schedule → view analytics

---

## Seasonal Rhythm

The app should feel like it **breathes with the seasons.** This isn't manufactured engagement — it's the natural cadence of local food.

| Season | What changes |
|---|---|
| Spring | Asparagus, strawberries, spring greens. CSA sign-ups. Farm tour season opens. |
| Summer | Stone fruit, tomatoes, corn. Festival season (Garlic Festival, Farm-to-Fork). U-pick days. |
| Fall | Apples, squash, pumpkins. Harvest dinners. Beef/pork processing season (quarter/half orders). |
| Winter | Root vegetables, citrus, preserved goods. Holiday farm boxes. Planning for next year's CSA. |

The Seasonal Spotlight on the home screen reflects this naturally. No editorial calendar needed — the farms themselves drive what's featured by updating their availability.

---

## What This Format Enables

1. **Producers get discovered** without marketing, SEO, or social media strategy — the marketplace structure puts them in front of browsing consumers
2. **Events drive acquisition** — festivals and markets introduce consumers to producers they'd never search for
3. **Seasonal rhythm drives retention** — the app changes weekly because the food changes weekly
4. **No engagement tricks** — no infinite scroll, no push notifications begging for attention, no algorithm deciding what you see. Structure and seasonality do the work.
5. **Expansion-ready** — the same marketplace format (collections, events, profiles) works for any local business category when Phase 2 arrives
