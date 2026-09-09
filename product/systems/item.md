---
id: what-item
purpose: One kind-varying entity for everything Members declare — why one primitive instead of seven systems.
layer: what
status: active
---

# Item

Anything a Person declares — a product, a service, a gathering, an idea, an offer, an ask, an initiative — is one schema, varying by `kind`. A maker declaring sourdough and an organizer declaring a run club are the same act in different costumes: a person declares something, optionally anchored to a location and a schedule, with a discoverable page and responses from other people. Modeling these as separate systems means writing the same code seven times; modeling them as one primitive with kind variation means the locality index is one query, not a union across seven tables, and natural-language search has one consistent thing to embed.

## The kind vocabulary — schema durable, UI label translates

| Schema | UI label | UI verb |
|---|---|---|
| `product` | Product | Sell · Share |
| `service` | Service | Offer |
| `gathering` | Event | Host |
| `wonder` | Idea | Wonder · Float |
| `offer` | Offer | Offer up |
| `ask` | Ask | Ask |
| `initiative` | Initiative | Lead · Start |

"Item" is the spec/schema term only — it never reaches user-facing copy or a URL; the UI always uses the specific kind. Schema migrations are expensive (RLS, event-log replay, type generators); UI and URL renames are cheap. Locking the schema vocabulary to the most stable concept, not the prettiest word, keeps future rename work bounded to the surfaces that actually need it. "Gathering" and "Wonder" were the spec verbs that made loop discussions legible internally; "Event" and "Idea" are the everyday nouns a stranger recognizes immediately — the split lets the team keep spec language without imposing it on users. A new kind proposes all three columns (schema / UI label / UI verb) at once, never in isolation.

## Provenance claims — "Locally Made," a sibling to "Locally Owned"

A `kind='product'` Item carries an optional provenance claim, same evidence-ladder shape as the business-jurisdiction system but a different signal: jurisdiction answers "does the money go to a local owner," provenance answers "was this made here." They diverge often — a reseller of imported goods is Locally Owned but not Locally Made; a designer who assembles everything in their own studio is both. The claim defaults to `none` and is never auto-populated from any other field (the seller's jurisdiction ZIP, their home location, their business Group's anchor) — that would re-merge ownership and provenance, exactly the conflation the substrate split exists to prevent. The Member declares it; the community can attest to it later; the platform records both honestly, never infers either.

**A Member entering an Item's own location (address, neighbourhood, or Online) never touches this claim.** Where an Item *is* and where a product was *made* are different questions; an implementation that routes one into the other is refused.

## Recurring gatherings — one row, not one row per occurrence

A recurring gathering (Run Club every Thursday) is a single row whose `starts_at` always holds the *next* upcoming occurrence, derived from a stored recurrence rule — not thirteen pre-created rows for thirteen Thursdays. A rotation process advances `starts_at` once the current occurrence passes, which keeps the item perpetually discoverable without ever showing a stale date, and a follow on the series survives every rotation without anyone re-following.

## The `item.published` event is the one that matters downstream

Distinct from `item.created` (fires on insert, any state): `item.published` is what triggers the discovery-index refresh and follower notifications. Drafts and withdrawals never notify anyone — only the publish moment does. This split exists because two real listeners (discovery refresh, follower fan-out) only care about the publish moment, and conflating it with creation would mean drafts leak into feeds or trigger notifications nobody asked for.

## What this rules in and out

**Rules in:** one schema for every declared thing, with strong per-kind typing in child tables rather than a JSONB free-for-all; a natural-language description field written for humans that doubles as future embedding substrate; a Wonder converting into a Gathering or Initiative as a new linked row, never an in-place mutation that erases the original.

**Rules out:** a Business entity anywhere in the ownership chain — an Item belongs to the Person who made it, or to a Group of people, never to a corporate shell. Platform-generated QR codes for Items (retired 2026-09-03 with the platform-wide QR refusal). Auto-deriving a provenance or ownership claim from any other signal.
