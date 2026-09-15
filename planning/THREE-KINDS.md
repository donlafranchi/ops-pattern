# Three Page kinds

**Draft, 2026-09-15.** Don: **"People are either selling something"** · **"Offering a service for money or for free"** · **"gathering one or many times"**.

That is the whole taxonomy. It replaces the six `groups.kind` values.

## The three

**`selling` — someone selling something.**
A name, a location, a tag, a description, a photo. Products listed under it, with prices. The business claim, if they make one.

**`service` — someone offering a service, for money or free.**
The same Page fields. Services listed under it, with a rate — or with no charge at all. **Free is not a price of zero; it is the absence of a charge, and `item_services.rate_model` has no value for it today.**

**`gathering` — someone gathering people, once or many times.**
The same Page fields, plus a date and responses. **Once or many is a property of the Page, not a fourth kind** — a recurrence rule, present or absent. Everything a one-off lacks follows from it happening once.

**All three get:** announcing · a photo or default art · a location · tags · and either following or joining, decided by whether the Page is private.

## The six existing values

- **`business`** → `selling`.
- **`place`** → `gathering`.
- **`interest`** → `gathering`.
- **`practice`** → `gathering`.
- **`event_anchored`** → `gathering`. Its provenance column survives as nullable.
- **`family`** → `gathering`, set to private. Privacy is already a separate axis, so nothing is lost.

## Cost

One check constraint, six values to three, with a deterministic mapping and three seeded social groups behind it — **confirm the real row counts against production before running it.**

## What this overturns

- **`nouns.md`:** *"A Page may sell, host, or both, and needs no business record to do either."* **Three exclusive kinds contradicts "or both".**
- **`nouns.md`:** *"Six Page kinds: five affiliate … and one operate."*
- **`groups.md`:** the affiliate-versus-operate split, and its list of six.
- **`groups.md`:** *"A Group never changes kind"* — the gathering that starts selling is now the main path, not an edge.
- **`item_services.rate_model`** — `hourly · flat · quote · membership`. **No value means free.**
- **`PAGE-KIND-EVENT.md`** — `event` as its own kind is replaced by recurrence as a property.
- **The community-merge proposal** in `page-kind-tools.md` — subsumed.
