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
A description, and a way for people to say they want it. It expires. If enough people want it, it becomes one of the other three.

**All four get:** announcing · a photo or default art · a location · tags · and either following or joining, decided by whether the Page is private.

## Testing interest already exists

**It is the `wonder` entry type, already specced with substrate shipped.** `item_wonders` carries an interest count, a 90-day expiry, and a conversion into a gathering or initiative. `ROADMAP.md`: *"the idea mechanic — specced and substrate shipped, composer/page missing."*

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

One check constraint, six values to three — **testing interest needs no new Page kind** — with a deterministic mapping and three seeded social groups behind it. Confirm the real row counts against production before running it. **The wonder composer is the only build this adds.**

## What this overturns

- **`nouns.md`:** *"A Page may sell, host, or both, and needs no business record to do either."* **Exclusive kinds contradicts "or both".**
- **`nouns.md`:** *"Six Page kinds: five affiliate … and one operate."*
- **`groups.md`:** the affiliate-versus-operate split, and its list of six.
- **`groups.md`:** *"A Group never changes kind"* — the gathering that starts selling is now the main path, not an edge. **And a wonder converting into one of the other three is the same case.**
- **`item_services.rate_model`** — no value means free.
- **`PAGE-KIND-EVENT.md`** — `event` as its own kind is replaced by recurrence as a property.
- **The community-merge proposal** in `page-kind-tools.md` — subsumed.
