---
purpose: Scenario — a Member creates a Page that pins to a real address, declares one category, and carries a photo or honest generated art. Creation-time only; editing afterwards is F056.
layer: how
status: backlog
---

# F061: Someone creates a Page they'd actually show people

**Bundle:** launch ([`initiative-launch.md`](../now/initiative-launch.md))
**Loops:** 9 (Make a living locally), 7 (Buy close), 4 (Gather regularly) — a Page is the unit all three are found through
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
**Primitive shape:** Person → Page (`groups`), with an anchor Location, a category, and an image. **No new entity.** Two columns on the spine, one capture table, one bucket.
**Spec contract:** [`groups.md`](../../product/systems/groups.md) § What a Page carries at creation · [`policy.md`](../../product/foundation/policy.md) § Uploaded images · [`design-language.md`](../../product/ui/design-language.md) §§ Image picker, Default Page art, Multi-step composer · [`action-layer.md`](../../product/systems/action-layer.md) § Same-transaction row+event invariant · [`nouns.md`](../../product/foundation/nouns.md) § Page
**Status:** backlog

## The acceptance frame

**The founder creates his own Page and it looks like something.** Real address, one category, his own photograph, a description. If he can do that on a phone without help and the result is worth sending to a stranger, this scenario passed. If any part of it embarrasses him, it didn't.

## The Person

Don has a business he wants on the platform. He opens the composer, types the brand name, types his address, picks what he does, adds a photo of the front counter, writes two sentences, and publishes.

**Today three of those five steps are broken or missing.**

- **The address is decorative.** The location step accepts whatever he types and then stores a hard-coded downtown Sacramento point. His Page pins to a street he has never been to. The geocoder that would fix this already exists in the codebase and is already used by the retired vendor signup and the admin forms — it was simply never wired into this path.
- **There is nowhere to say what he does.** No category field exists on a Page in any form.
- **There is nowhere to put a photograph.** No storage bucket exists anywhere in the application, and a Page has no column to hold an image URL.

And when he leaves it half-finished, nothing tells him it was saved — **although it was.**

## The Story

Don taps **Start something** and the composer opens.

**Name.** He types the brand. Continue.

**Where.** Two ways to answer, both on the same step, neither buried.

He types a street address. As he types, suggestions appear beneath the field — real addresses, from the same geocoder the rest of the application already uses. He taps his. The field settles to the full address with a small map thumbnail beside it showing a pin **on his building**. Continue.

*(Beneath the address field, in the same step: **"Rather give a neighbourhood?"** — for a Page with no fixed address, or one whose owner works from home and will not put it on a public map. Tapping it swaps the field for a list of neighbourhoods. Picking one places the Page in that neighbourhood, with no street address at all. **Same step, two ways to answer.** Not a setting, not a later toggle.)*

*(And when what he was starting was a run club rather than a shop, the step **asks only for a neighbourhood** — no address field, because a club with nothing scheduled is not at an address. **One question instead of two.**)*

**What you do.** Twelve options, one column, plain words: Food & Drink, Growing, Home & Body, Textiles & Craft, Wood Metal & Repair, Art & Music, Classes & Workshops, Sport & Outdoors, Community & Mutual Aid, Music & Nightlife, Family & Kids, Faith & Culture. Underneath, a thirteenth: **Something else**. He taps his. Continue.

*(Had none of them fit, tapping **Something else** would open a single line: "In your own words — what do you do?" Whatever he wrote would appear on his Page as his own words, and people searching those words would find him. It would not become a filter, and no other Page would be sorted by it.)*

**A picture.** A wide **Add a photo** field. He taps it, his phone's picker opens, he chooses the counter. It appears, dimmed for a second, then sharp and square. Continue.

**About.** Two sentences. **Publish.**

His Page opens at its own address, with the photograph at the top, his name, the sentences, the category, and a pin on his building.

**Then he looks at everyone else's.** The four seeded Pages have no photographs, and none of them look broken — each has its own quiet gradient with its own initial on it. **They are recognizably placeholders and recognizably not stock photographs of somebody else's bakery.** Each Page has the same art every time he loads it.

**And what he never sees:** the browser downscaled and re-encoded his photograph, and in doing so discarded the metadata block — including the GPS coordinates of the counter, which for a home business is a home.

## Surfaces

- **Entry point:** the Page composer, reached from the create control on You.
- **Steps changed:** the location step gains address search; two new steps (category, photo) join the existing name, about and review steps.
- **Primary action:** publish once, at the end.
- **Discovery:** the category and photo render on the public Page and on the Page's card wherever Pages are listed. **This scenario ships the columns and the render on the Page's own surface. It does not build browse or search** — those consume what this creates.
- **Owner-only:** the *Add a photo* overlay on default art. Nothing marks a photo-less Page to the public.

## Data captured

| Field | Where | Notes |
|---|---|---|
| Anchor coordinates | `locations.geography` — **existing column, currently written with a constant** | **Address mode:** derived from the typed address via the existing geocoding module. **Neighbourhood mode:** a point derived from the Page id, placed inside the chosen neighbourhood's polygon. |
| Precision mode | `locations.kind` — **existing enum**, `'permanent'` or `'area'` | **No new column.** `'area'` already means exactly this and has since the Locations schema shipped. |
| Neighbourhood | **nothing new** — resolved geographically from the point via the existing `place_for_coords` path | `places` already carries `kind='neighborhood'` rows with polygons. **No new foreign key, no place id on the Location.** |
| Category | **new** `groups.category text`, indexed, nullable | On the spine. **Not `groups.metadata`** — that JSON column is unused and stays unused. Nullable because Pages created before this exist. |
| Free-text category | **new** `group_category_suggestions` — group id, member id, raw text, normalized copy, created_at; indexed on the normalized copy | Capture only. **No admin screen** — grouping the normalized column is the surface. |
| Page photo URL | **new** `groups.photo_url text`, nullable | Object in the shared media bucket. |
| Image object | Supabase Storage — the **one** bucket and the **one** upload module, path prefixed by member id | **Not a second bucket.** See § Boundaries. |

**New event types:** `group.photo_set` and `group.photo_removed` on `group_events`. The category is set during draft and carried by `group.activated` — it needs no event of its own.

**No new entity. No verification. No claim. No proof of anything.**

## Acceptance criteria

### An address becomes coordinates, or the step does not complete

**Given** a Member on the location step of the Page composer
**When** they type an address and choose a suggestion
**Then** the Location is created carrying the coordinates of that address, and the composer shows a map thumbnail with the pin on it before Continue is available.
*Why: a Page that pins somewhere its founder did not choose is a confident wrong answer, and the person misrepresented is the one who gets asked about it — `groups.md` § A real place.*

**Given** a Member types an address the geocoder cannot resolve
**When** they attempt to continue
**Then** the step refuses, saying it could not find that address and offering to let them try a nearby cross-street or landmark.
**And** no Location row is written.
*Why: the failure this replaces is silent. Refusing loudly is the whole point.*

**Given** any Location created through any composer
**When** the row is written
**Then** its geography is derived either from a typed address or from a chosen neighbourhood.
**And** no code path writes a default, placeholder, or city-centroid coordinate. *The existing constant is deleted, not made conditional.*

### A neighbourhood is a real answer, not a fallback

**Given** the location step
**When** it renders
**Then** both ways to answer are present on it — an address field, and a visible way to give a neighbourhood instead.
**And** neither is behind a setting, a later screen, or an advanced option.
*Why: the people who need this are the ones least likely to go looking for it — someone who won't publish their home address will abandon the step, not hunt for an alternative.*

**Given** a Member picks a neighbourhood
**When** the Page is published
**Then** its Location is `kind='area'` with a point **inside that neighbourhood's polygon**, and no street address is stored anywhere on the row.

**Given** the same Page in neighbourhood mode
**When** it is rendered any number of times, on any device, to any viewer
**Then** its point is identical every time.
*Why: a pin that moves cannot be recognised or returned to, and tells a visitor the page is untrustworthy. Same argument as default art.*

**Given** a neighbourhood polygon that is still an approximate rectangle
**When** a point is derived
**Then** it is drawn toward the polygon's interior rather than uniformly across its bounding box, so Pages do not land in the river or across a boundary.

**Given** a Page in neighbourhood mode
**When** its public surface renders
**Then** it shows the neighbourhood name, and **no street address appears anywhere on the page, in its metadata, or in any API response that serves it.**

**Given** a Page in neighbourhood mode
**When** the Place and metro are resolved
**Then** both resolve correctly from the point, by the same geographic path every other Page uses. *No special case: the point is inside the neighbourhood, which is inside the city, county and metro.*

**Given** a Page in neighbourhood mode
**When** it appears at someone else's Venue
**Then** the appearance works exactly as it does for a Page with an address.
*Why: an appearance is a relationship to someone else's Location and has never depended on having one of your own. The itinerant Page is the case this most obviously serves.*

### Position is resolved, not stored — built now, with the override's slot open

> **Amended 2026-09-07 by review addendum 3** — a placement is a **point or an area**, not always a point. The scenario stays approved; the delta is reviewed in [`review-F061.md`](review-F061.md) § Third addendum. **The rendering of an area is not in this scenario** — it routes to the map work.

**Given** any Page anywhere its placement is needed — map, card, public surface
**When** that placement is determined
**Then** it comes from a single resolver that returns **a list of placements, each carrying its source and whether it is a point or an area**, evaluated at read time.
**And** no column, cache, or materialized view stores a Page's resolved position.
*Why: an appearance starting or ending changes the answer with no write to the Page. Anything precomputed is stale from that moment. This is the one part of the design that cannot be retrofitted cheaply, which is why it lands now rather than with appearances.*

**Given** the resolver at launch, before appearances exist
**When** it runs
**Then** it returns exactly one placement — the Page's own anchor — **typed as a point when the Page gave an address and as an area when it gave a neighbourhood.**
**And** the precedence branch above it is present and unreachable, not absent.
*Why: adding a higher-precedence source later must be an addition to a list, not a change to a return type — and a placement that can only be a point is the same trap one axis over.*

**Given** a Page whose anchor is a neighbourhood
**When** the resolver runs with no active appearance
**Then** the placement is the **neighbourhood**, identified by its Place, not a coordinate standing in for it.
*Why: a point asserts something is at a place. A club with nothing scheduled is not anywhere in particular, and a pin tells a passer-by they will find something there.*

**Given** a Page whose anchor is a neighbourhood **because its owner has an address they will not publish**
**When** its Place, metro, or distance ordering is computed
**Then** the derived point inside the polygon is used for that computation only, and is never returned as a placement.
*Why: the scattered point narrows to one job. A genuinely area-shaped Page needs none — its Place resolves from the neighbourhood, because the neighbourhood is a Place.*

**Given** a Page with one or more active appearances *(when appearances land)*
**When** the resolver runs
**Then** it returns one pin per active appearance, at each Venue's real address.
**And** the Page's own anchor is **not** among them — the precedence replaces, it does not add.
**And** the Page's own address is never exposed by an appearance.

**Given** an appearance that has ended
**When** the resolver runs
**Then** the Page returns to its anchor with no cleanup step, no job, and no write.
*Why: it falls out of the same time window that drops a finished gathering from the feed. If it needs a sweep, it was built wrong.*

**Given** any Page
**When** its public surface renders
**Then** it states where it currently resolves to — the neighbourhood name, the address, or the Venue it is at right now — **visible to everyone, not only the owner.**
*Why: it is already public by virtue of being on the map. Hiding it on the page would conceal it only from the person most affected. Nobody should be surprised by where they are pinned.*

### One category, chosen at creation

**Given** the category step
**When** it renders
**Then** the twelve terms appear in one scrolling column with a thirteenth, **Something else**, visually separated at the bottom.
**And** exactly one may be chosen. **And** the step cannot be skipped.
*Why: the category is what search matches and what the vocabulary grows from. A Page with none is a Page that can't be found by what it does.*

**Given** a Member chooses a category
**When** the Page is published
**Then** the value is written to the indexed column on the spine and renders on the public Page.

**Given** a Member chooses **Something else** and types free text
**When** the Page is published
**Then** a row lands in the capture table with the raw text and a normalized copy, in the same transaction as the Page write.
**And** the typed words render on the Page as the Member's own words.
**And** the category column holds no vocabulary term.
**And** the text creates no filter, no browsable category, and no vocabulary entry.
*Why: promotion is a deliberate human act. No volume of identical entries promotes itself — `groups.md` § Other, and why the escape hatch is the instrument.*

**Given** the operator queries the capture table grouped by the normalized column
**When** they order by count
**Then** they see what people said they do, most-common first, **without any screen being built for it.**

### A photo, optional, one path

**Given** the photo step
**When** it renders
**Then** the image picker recipe is used unmodified, the field is marked optional, and the composer completes without it.

**Given** a photograph carrying GPS metadata
**When** it is uploaded
**Then** the stored object's **bytes** contain no metadata block.
*A test asserting the resize function was called does not satisfy this and must not be written in its place.*

**Given** any attempt to write to the bucket that bypasses the client module — a raw JPEG, an SVG, an oversized file, another member's path prefix
**When** it is made with a valid token
**Then** it is rejected **by the storage API**, not by application code.

**Given** a stored Page photo
**When** the operator removes it
**Then** the column is nulled, the object is deleted, and one event row is written in the same transaction.
*Why: the platform never serves an image it cannot take down — `policy.md` § Uploaded images. This is the Page-side half of the commitment F058 established for Items.*

### Art on every Page from the first day

**Given** a Page with no photograph
**When** it renders anywhere — its own surface or a card
**Then** generated art derived from the Page id renders in the frame a photograph would occupy.
**And** the same Page renders the same art on every load, on every device, to every viewer.
*Why: art that reshuffles on reload tells a visitor the page is unstable.*

**Given** a viewer who cannot edit the Page
**When** they see default art
**Then** nothing marks the Page as incomplete — no "no photo" text, no placeholder icon, no prompt.

**Given** a Member who can edit the Page
**When** they see default art
**Then** a quiet **Add a photo** overlay is present and reaches the picker.

**Given** default art
**When** it is inspected
**Then** it is a gradient and a letterform — no photograph, no illustration, no depiction of a place, and nothing sourced from a stock library.

### The composer says what it already does

**Given** a Member part-way through the composer
**When** they close it and return later
**Then** they resume at **the first step they have not completed** — including the review step. *Today resume never returns past the third step, so a Member who left at review re-walks two steps they had already done.*

**Given** any step after the first
**When** it renders
**Then** it states that progress is saved and they can finish later.
*Why: the saving is already real and has been since the walkthrough shipped. Nobody knows, so nobody uses it.*

## Boundaries — what this scenario does not own

**These are the collisions, named so two scenarios do not build the same thing twice.**

| Neighbour | Owns | This scenario |
|---|---|---|
| **[F056 — a producer gives their shop a face](../next/scenario-F056-producer-gives-their-shop-a-face-and-says-what-they-stand-for.md)** | **Editing a Page that is already live** — the edit surface, the update handler, replacing the photo, changing the category later. Save is publish there. | **Creation only.** F061 ships the columns, the bucket, the upload module and the picker; **F056 consumes all four and adds nothing storage-shaped.** |
| **[F055 — a producer puts a photo on what they sell](../next/scenario-F055-producer-puts-a-photo-on-what-they-sell.md)** | Photos on **Items**. **Deferred 2026-09-07** — the Page is the unit that carries a face. | The bucket and upload module **move here**, because they now land with Pages first. When F055 resumes, the substrate already exists and it is a composer field. |
| **[F058 — a member reports an image](../next/scenario-F058-a-member-reports-an-image-and-the-operator-takes-it-down.md)** | The **report path**, and photo removal on **Items**. | Photo removal on **Pages**. F058's report path is a **hard precondition** — the takedown commitment must hold before the first upload is accepted, and that is F058's, not this one's. |

| **Appearances at Venues** *(not yet scenarioed)* | The **appearance itself** — attaching a Page to someone else's Venue, with dates, and reading it back on the Venue's page. | **The resolver that an appearance will override.** F061 ships it with one rule and the higher-precedence branch left open. **F061 does not depend on appearances existing** — see the review. |

**Also explicitly not here:** browse, search, the map's use of any of this, item categories, verification of any kind, unclaimed Pages, ownership transfer, and multiple images.

## Edge cases

- **Pages that already exist have no category and no photo.** Both columns are nullable; existing Pages render default art and no category line. **No backfill, no forced prompt.**
- **A Member abandons the composer after the photo step.** The object is already in storage under their prefix, orphaned. Acceptable at launch volume; noted rather than solved.
- **The geocoder is down.** The location step refuses and says so. It does not fall back to a default coordinate — that is the failure being removed. **The neighbourhood path still works**, because it touches no external service.
- **Only five neighbourhoods exist, all in Sacramento, and their outlines are approximate rectangles** rather than true boundaries. Acceptable at launch: the mode's whole purpose is imprecision. **The interior-drawn point is what keeps a rectangle from putting someone in the river.** A Member outside those five picks an address or waits.
- **A Page in neighbourhood mode whose neighbourhood polygon is later corrected** keeps its point if the point is still inside; otherwise it re-derives. Either way it does not move on its own between renders.
- **A Page name starting with a non-letter** — the default art uses the first character that has a glyph, and a neutral mark if there is none.
- **Two Members type the same free-text category.** Two rows. Normalization makes them count together; nothing deduplicates at write time.

## Capabilities unlocked

- A Page can be found at the place it actually is *(precondition for the map being truthful)*.
- A Page can say what it does in a term the platform can match *(precondition for search and for browse)*.
- The platform can see what it is being used for, from evidence rather than assumption.
- Every Page has a face on day one.
