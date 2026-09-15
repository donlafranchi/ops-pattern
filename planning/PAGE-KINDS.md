# Four Page kinds

**Draft, 2026-09-15.** Don: **"People are either selling something"** · **"Offering a service for money or for free"** · **"gathering one or many times"** · **"looking to start something and want to test the waters to see if anyone is interested in their offering"**.

That is the whole taxonomy. It replaces the six `groups.kind` values.

Confirmed by Don the same day: **a class is a gathering. Tutoring is a service.**

## The four

**`selling` — someone selling something.**
A name, a location, a tag, a description, a photo. Products listed under it, with prices. The business claim, if they make one.

**`service` — someone offering a service, for money or free.**
The same Page fields. Services listed under it, with a rate — or with no charge at all.

**`gathering` — someone gathering people, once or many times.**
The same Page fields, plus a date and responses. **Once or many is a property of the Page, not a fifth kind** — a recurrence rule, present or absent.

**`testing interest` — someone with an idea, seeing who wants it before it exists.**
A description, and a way for people to say they want it. **It does not expire and it converts into nothing.** When the author is ready they create the new Page the ordinary way and announce or link it from the wonder.

**All four get:** announcing · a photo or default art · a location · tags · and either following or joining, decided by whether the Page is private.

## Testing interest already exists

**It is the `wonder` entry type, already specced with substrate shipped.** `ROADMAP.md`: *"the idea mechanic — specced and substrate shipped, composer/page missing."*

**Don stripped two of its mechanisms, 2026-09-15:** *"We don't need a 90 day expiration and we don't need a conversion. Whoever posted a wonder can create their new page and then announce or link the new page on the old page."*

**A wonder needs two things: a way to show interest, and a way for the author to point at the thing once it exists.** Nothing else.

**What that leaves `item_wonders` holding: nothing.** Drop `expires_at`, `conversion_target_kind` and `converted_to_item_id` and only `interest_count` remains — **a denormalised counter over `item_responses`, which already has `'interest'` in its `response_kind` list.** **So the child table goes entirely** and a wonder becomes a plain `items` row with `kind='wonder'`: interest through `item_responses`, removal through `items.state`, which already carries `withdrawn` and `closed`.

**Flagged, one line, Don's call:** with no expiry, a two-year-old wonder sits in Browse looking live. Author removal is one answer and a last-activity sort is another; Browse's past-date drop cannot help, because a wonder carries no date.

**So it is the existing entry type doing its job, not a new Page kind — the composer is the only missing piece.** It is also already the product's own pitch: *"Got an idea — a workshop, something homemade? Share it. Your neighbours can show they want it before you even start."*

## The free-service gap

**`item_services.rate_model` is `hourly · flat · quote · membership`. Nothing there means free** — and "for money or free" is half of what Don said a service is.

## The six existing values

- **`business`** → `selling`.
- **`place`** → `gathering`.
- **`interest`** → `gathering`.
- **`practice`** → `gathering`.
- **`event_anchored`** → `gathering`. Its provenance column survives as nullable.
- **`family`** → `gathering`, set to private. Privacy is already a separate axis, so nothing is lost.

## Cost

One check constraint, six values to three — **testing interest needs no new Page kind** — with a deterministic mapping and three seeded social groups behind it. Confirm the real row counts against production before running it. **The wonder composer is the only build this adds**, and it is smaller now: no expiry job, no conversion path.

## What this overturns

- **`nouns.md`:** *"A Page may sell, host, or both, and needs no business record to do either."* **Exclusive kinds contradicts "or both".**
- **`nouns.md`:** *"Six Page kinds: five affiliate … and one operate."*
- **`groups.md`:** the affiliate-versus-operate split, and its list of six.
- **`groups.md`:** *"A Group never changes kind"* — the gathering that starts selling is now the main path, not an edge. **The wonder no longer collides with this at all, because nothing converts.**
- **`item_services.rate_model`** — no value means free.
- **`PAGE-KIND-EVENT.md`** — `event` as its own kind is replaced by recurrence as a property.
- **The community-merge proposal** in `page-kind-tools.md` — subsumed.
