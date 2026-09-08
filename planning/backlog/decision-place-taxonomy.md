---
purpose: Taxonomy decision awaiting PM ruling — the minimum terms that distinguish a fixed shop, an itinerant creator, a place that hosts others, and a one-time occasion; plus the price of the vendor-at-venue relationship.
layer: how
status: partly-ruled
---

# Decision — the minimum place vocabulary, and what the venue relationship costs

> **RULED 2026-09-07: the half-day shape is approved — item-level appearances, auto-approved.** Queued for build. **Auto-approval is now justified on its merits, not its price** — see [`../../product/foundation/promises.md`](../../product/foundation/promises.md) § How good faith is enforced. Vendor cards on the venue page are **sequenced after the profile editor**, not folded into the half-day; pricing below.

**Raised:** 2026-09-07. The PM's ruling that **each business location is its own Page** (a two-location bakery is two Pages), that **an itinerant creator is found through the Pages of the places they appear at**, and that **the vocabulary is collapsing three genuinely different things**.

**Grouping on the map is stopped.** One Page = one place makes pins naturally one-per-Page, so the grouping had nothing to do. Roughly 2–4 unspent hours; nothing to unwind.

---

## 1. Inventory — venues are already built, and more of this exists than expected

**Venues are a first-class, shipped surface.** `locations` with three child kinds — **permanent**, **recurring-temporary** (literally "a market that happens on Saturdays"), and **area**. A venue has a public page at its own place-scoped address, shipped and green, with two sections: *what's happening here* and *what's happening nearby*. Venues can be followed.

**The vendor-at-venue join already exists, with dates and approval.** `item_locations` links an Item to a Location and carries:

- `schedule_kind` — **one_time / recurring / ongoing / by_appointment**
- `schedule_metadata` — free-form JSON for the detail
- `status` — **pending / approved / declined**, described in the schema comment as being for *"cross-Member Location attachments (pending approval)"*
- `removed_at` — so an appearance can end

**This is the relationship the PM described, already modelled.** It was built for a producer's pickup point and it happens to be exactly the shape a food truck at a market needs.

### The three gaps, precisely

1. **The read excludes other people's items.** *What's happening here* filters to Items whose Page **is the venue's own owning Page**. A visiting food truck's Items are attached to the venue but belong to a different Page, so they fall through to *what's happening nearby* — **a radius query, not the attachment.** The relationship is stored and then not read.
2. **No composer can attach to someone else's venue.** The composers pass the member's own anchor location. There is no venue picker.
3. **No approval surface exists anywhere in the app.** `status` defaults to `approved`, and nothing renders or acts on `pending`.

---

## 2. The minimum term set — one new word, not four

**The four patterns the PM named are already expressible with three existing nouns. Only the relationship needs a name.**

| Pattern | Expressed as | New? |
|---|---|---|
| A fixed place that's always there — a bakery | **A Page anchored to a permanent Venue** | No |
| A place that hosts others — a farmers market | **A Venue** (already its own page, with its own sections) | No |
| A one-time occasion — this Saturday's swap | **An Item with a date** | No, ruled earlier today |
| An itinerant creator — a food truck, a market vendor | **A Page with no Venue of its own, whose Items *appear at* other people's Venues** | **The relationship needs the word** |

**Proposed: the word is *appearance*. A Page has appearances at Venues.**

- It is the word people already use — a vendor *appears at* a market.
- **It names the relationship rather than the entity**, which is what keeps the term count at one. Adding *itinerant Page* or *mobile seller* as a type would put the classification back on the person, which is the pigeonhole the whole day has been spent removing.
- **A Page is not typed by it.** A bakery with a stall at the Saturday market has both a Venue and appearances. Nothing has to choose.

**Why not four terms.** Each pattern is a combination of two facts already in the data — does the Page have its own Venue, and do its Items carry dates. **Naming the combinations creates types the schema does not have and the person did not choose.**

---

## 3. The price — and it depends entirely on one choice

### Option A — item-level appearances, auto-approved *(recommended for launch)*

**Half a day.** The join, the schedule and the dates all exist. The work is:

- **One read-function change** so *what's happening here* includes approved attachments from any Page, not only the venue's owner — plus a label distinguishing the venue's own from its visitors.
- The composer's existing location step gains other people's venues as options.

**A food truck posting "tacos, Saturday" attached to the market's venue appears on the market's page.** That is the PM's sentence, delivered.

**What it does not do:** a truck with no current Items is invisible; anyone can attach to any venue without the owner's consent.

### Option B — add owner approval

**Plus one to two days.** A pending queue, an approve/decline control, and a way to tell the venue owner something is waiting — **and no notification path of any kind exists**, so that has to be built or the queue is only seen by someone who goes looking.

### Option C — Page-level appearances

**Plus one to two days.** A new table linking Page to Venue with dates, independent of Items, so a truck is listed at the market whether or not it has posted anything. **This is genuine new modelling** — a table, a composer, a read path and a section on the venue page.

**Full shape: three to five days. Recommended shape: half a day.**

---

## 4. Against the schedule — stated plainly

**This is the first genuine scope addition of the session, and it lands in week one of eight.**

- **Half a day fits.** It is smaller than the map grouping it replaces, and it uses substrate already paid for.
- **Three to five days does not fit without something leaving.** The plan has roughly 38 working days against 28–34 of listed work, and the buffer is three days at the end.
- **If the full shape is wanted, the honest candidate to drop is the shop editor's free-text "where they'll be next" line** — appearances make it redundant, because a producer's appearances *are* where they will be next, structured and queryable. That trade is close to even in days and strictly better in outcome.
- **What must not absorb this: the entry-point work.** Appearances are a separate scenario with their own review, on the launch plan's own rule that a scenario renders a path and does not decide what else attaches to it.

---

## Vendor cards on the venue page — priced and sequenced, 2026-09-07

**The ask:** the venue's Page shows the **bios and blurbs of the vendors who will be there**, not only their Items.

### What the venue page can do today

Two sections, **both of Items**: *what's happening here* and *what's happening nearby*. **There is no section that renders Pages at all.** Vendor cards are a third section, new.

### Two gaps found, and one is the same bug twice

- **The venue read cannot name a Page.** `resolveOwningGroup` selects **`id` and nothing else** — no name, no blurb. **This is the identical gap found in the browse select list, in a second place.** Both are a column or two on a select; minutes each, but a vendor card with no name is not a card.
- **It also filters `kind = 'business'`** — a **fourth instance** of the condition the entry-point work is removing. It belongs on that list.

### What a vendor card can actually render — the dependency is narrower than expected

| Field | State today |
|---|---|
| Page name | Exists; the venue read just doesn't select it |
| **Business Page blurb** | **Already collected** — the shop walkthrough's *About* step writes `group_businesses.public_description`. **Business vendors have a blurb today.** |
| Non-business Page blurb | `groups.description` exists and defaults to empty; no composer writes it — **but the new create flow can ask, at create-time cost** |
| Member bio | Column exists, **no editor anywhere** — week-three work |
| Page image | **No upload exists anywhere** — week-two work |

**So the expectation that cards would render empty is half right.** A market of business vendors would render name + blurb **today**; images would be missing until week two, and personal bios until week three.

### Price and sequencing

- **The appearance read — approved, half a day.** Ships now, item-level, auto-approved.
- **Vendor cards — half a day to a day, after the profile editor.** A third section, a card component, and the two select fixes. **Same appearance data, no new modelling.**
- **Sequenced, not expanded.** Same feature, two arrivals, **no schedule hit** — and arriving second means the cards are full rather than skeletal on the day they appear.

