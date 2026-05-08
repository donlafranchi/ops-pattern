# Item Create

**Tier:** T1
**Bundle:** b1
**Primitive:** Item
**Loops served:** 2, 4, 7, 9

## What a Member can do

A Member declares a new Item using a single composer with a kind picker at the top. The four kinds at b1 are product, service, gathering, and wonder. Selecting a kind reveals shared fields (title, description, category, hashtags) plus kind-specific fields below. The whole flow — kind selection, metadata, Location attachment — takes under 90 seconds. For Members who already operate under a brand label (Oak Park Sourdough, Ferrari Fisheries), the composer offers a sibling-clone shortcut: select an existing Item, inherit its label and metadata, and provide only the new Location.

## T1 scope (ships at b1)

- Kind picker (product / service / gathering / wonder) — one picker, four paths
- Kind-specific metadata: Product (price, unit, composition, photos, available_until), Service (rate_model, rate_cents, service_area, hours, license_info, on_call, accepts_new_clients), Gathering (starts_at, ends_at, recurrence_rule, capacity, cost_cents, what_to_bring, rsvp_cutoff), Wonder (expires_at, conversion_target_kind)
- Location attachment (optional for Wonders, recommended for all others)
- Optional Community scoping (`community_id`; defaults to `primary_community_id` if set)
- Optional brand label (powers resolve-up rendering on the Item page)
- Sibling-clone flow for multi-location same-owner
- Draft save (item in `state='withdrawn'` until published)
- Item gets a stable public URL at `/i/[slug]` on publish
- `item.created` event logged

## Deferred

- Offer, Ask, Initiative kinds (reserved in schema; UI surfaces at b2)
- Photo upload UI (schema column exists at T1; upload flow is a separate ticket)
- Bulk Item creation (b2)
- Item scheduling / queued publish (b2)

## Acceptance signal

A new Member signs up, opens `/new`, selects "Gathering", fills the form, attaches a Location, and reaches a public Item page in under 90 seconds.
