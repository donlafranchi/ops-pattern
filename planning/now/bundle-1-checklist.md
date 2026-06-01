---
id: how-bundle-1-checklist
purpose: One-page progress scoreboard for the b1 MVP. Updated at session start and at ticket close.
layer: how
status: active
---

# Bundle 1 — MVP Checklist

> **What "shipped" means here.** A row is checked when the user-facing feature works end-to-end, tests pass, and the code is merged to main. Foundation rows check when the underlying tables, handlers, and migrations are in place. Items in build are marked `~`.
>
> **Companions.** Narrative + non-negotiables in [`mvp-goal.md`](mvp-goal.md). Per-feature stage detail in [`../STAGE-LEDGER.md`](../STAGE-LEDGER.md). Approval sequence in [`plan-b1-surface-sequence.md`](plan-b1-surface-sequence.md).

## The hypothesis we're testing

Ordinary people will step forward where they live, and their neighbors will show up for them.

---

## Foundations — the platform's data + write layer

- [x] Extensions, embedding floor, system Member seeded
- [x] Members, Locations, and the action layer
- [x] Items substrate (the four kinds; the locality-first materialized view)
- [x] Groups substrate (all six kinds)
- [ ] Geography substrate (places, member–place interests, made-at provenance) — *built, awaiting merge to main*
- [ ] Metro polygons — lets members opt into a wider "near me" scope
- [ ] "Follow this venue" wiring — the table exists; the button and handlers don't
- [ ] Jurisdiction badges substrate — powers the "Locally Owned" and "Locally Made" badges

## What producers can do

- [~] Create a business through the Sell walkthrough — *in build; walkthrough surface is the open piece*
- [ ] List a product
- [ ] List a service
- [ ] Claim the "Locally Owned" badge
- [ ] Claim the "Locally Made" badge
- [ ] Generate a printable QR card for any item

## What gatherers can do

- [ ] Host a recurring gathering
- [ ] Find a venue's public page and follow it
- [ ] Find a Group's public page

## What newcomers can do

- [ ] Sign up and land in a populated feed
- [ ] Find another Member's profile and follow them
- [ ] See everything they follow — people, Groups, venues — in one place
- [ ] Adjust how wide their "near me" reach is

## The integration test — gates MVP close

- [ ] A newcomer can complete the full journey — signup, profile, locality, feed, host a gathering at a venue, land on a shareable page — without getting stuck
- [ ] A producer can complete the full journey — signup, business Group, list a product, public page — without getting stuck

---

## Where we are right now

- **Foundations:** done except the four items above (one awaiting merge, three not yet built).
- **Producer surfaces:** Sell walkthrough is in build; the rest haven't started.
- **Gatherer + newcomer surfaces:** none started.
- **Integration test:** waits on everything above.

## What this scoreboard is not

- Not a ticket tracker — see [`../STAGE-LEDGER.md`](../STAGE-LEDGER.md) for per-feature stage detail.
- Not a scoping doc — see [`bundle-1.md`](bundle-1.md) for what's in / out.
- Not the build sequence — see [`plan-b1-surface-sequence.md`](plan-b1-surface-sequence.md) for dependency order.

This is the one page to glance at on Monday morning to know what's left.
