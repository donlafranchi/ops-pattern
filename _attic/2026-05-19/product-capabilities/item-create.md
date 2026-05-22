# Item Create — *superseded by loop-specific capabilities*

> **Status:** This capability has been split. It described a single unified composer at `/new` with a four-button kind picker, which conflicts with the people-first / surface-specific-entry stance the loops framing requires. See [memory note](../../) and the F018 lesson in [`JOURNAL.md`](../../JOURNAL.md).

The single "Item Create" capability has been split into loop-specific capabilities, each tied to its own surface and persona:

| New capability | Loops | Canonical example | Status |
|---|---|---|---|
| [`event-host.md`](event-host.md) | 1, 4 | Run Club at Drake's | Drafted |
| (future) `product-make-and-sell.md` | 7, 8 | Ferrari Fisheries | TODO |
| (future) `service-offer.md` | 9 | (find-a-pro example, TBD) | TODO |
| (future) `wonder-float.md` | 2 | (TBD canonical example) | TODO |

Each of these has its own surface (venue page, Maker page, etc.), its own composer shape, and its own discovery path. The Item *primitive* and the spine + child-table *schema* are unchanged — the change is at the UX/capability layer.

## Why this split happened

A unified `/new` composer with a kind picker (even with intent-button copy like "I'm hosting something") puts the entire taxonomy decision up front. Members don't arrive thinking "I'm declaring an Item" — they arrive at a venue page wanting to host something there, or at their Maker page wanting to drop something now, or at a hashtag page wanting to float an idea. The surface should pick the kind; the persona should never see the four-way choice.

See [`F018-brian-declares-run-club.md`](../../planning/scenarios/F018-brian-declares-run-club.md) for the canonical replacement.

## What still applies from the old version

- Kind-specific metadata fields (product / service / gathering / wonder) — same fields, same schema, just collected through surface-specific composers instead of one unified one.
- Sibling-clone flow for multi-location same-owner — still useful, lives now under the relevant loop-specific capability (`product-make-and-sell.md` will inherit it for makers like Ferrari Fisheries with multiple pickup points).
- `item.created` event log entry, public kind-specific URL (per `item.md` naming table), draft state — all unchanged.
