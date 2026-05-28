---
purpose: Phase 3 item stub — Wonder → Gathering / Wonder → Initiative conversion flow.
layer: how
status: stub
---

# Phase 3 — Wonder → Gathering / Wonder → Initiative conversion

## What this is

The flow that turns a successful Wonder (enough "I'd be in" responses) into either a recurring Gathering or an Initiative. The Wonder doesn't lose its history; the converted Item links back via `items.parent_item_id`. Pairs with [`wonder-composer.md`](wonder-composer.md) — together they complete the Loop 2 ("Float an idea") cycle.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"Wonder → Gathering / Wonder → Initiative conversion stub. T2 surface; data model entry only at b1 (the `parent_item_id` reservation)."*
- [`use-cases.md` O4](../../product/needs/use-cases.md#o4-a-member-floats-an-idea-to-test-interest-before-committing-to-host) — Deferred (b2+); the tipping-point flow is one of the three named open questions.
- `items.parent_item_id` already reserved in the Phase 1 schema (per `item.md`).

## Rough shape

- Trigger: Wonder author taps "Convert to Gathering" or "Convert to Initiative" on their Wonder's management surface. Threshold-based auto-prompt optional ("You have N responses; want to turn this into a real thing?").
- Composer for conversion: pre-fills title + description from the Wonder; asks for the kind-specific fields (recurrence for Gathering; pledge-substrate for Initiative).
- Writes: new Item row (kind='gathering' or 'initiative') with `parent_item_id` set to the Wonder's id; original Wonder's `converted_to_item_id` updates to the new Item's id.
- Notification (b2+): people who responded "I'd be in" to the Wonder get notified about the converted Item (depends on follow-stream substrate).
- The Wonder remains visible as the historical record.

## Depends on

- Wonder composer ([`wonder-composer.md`](wonder-composer.md)) — Wonders must exist before they can be converted.
- O4 design pass — same open questions (signaling, threshold, tipping-point).
- Initiative kind composer — not yet stubbed. Initiative is far-horizon per O6; this conversion's Initiative path may stay reserved-but-not-shipped until then.
- `items.parent_item_id` reservation (already in schema).

## Advance this by

1. PM call: ship both conversion targets (Gathering + Initiative) at the same time, or just Gathering at first (Initiative deferred per O6 far-horizon)?
2. Decide: is the conversion trigger threshold-based, author-discretion, or both?
3. Design the post-conversion view of the original Wonder — does it show "converted to: [new Item]" prominently, or quietly?
4. Decide whether responders are automatically followers of the new Item (privacy + UX call).
5. Promote to scenario after [`wonder-composer.md`](wonder-composer.md) is scoped.

## Out of scope for this stub

- The Initiative kind composer itself (pledge substrate, capital coordination) — far-horizon per [`use-cases.md` O6](../../product/needs/use-cases.md#o6-a-community-coordinates-around-a-vacant-space).
- Reverting a converted Wonder back to Wonder state — out (the Wonder is historical; the converted Item is its own thing).
