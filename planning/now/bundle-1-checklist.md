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
- [x] Geography substrate (places, member–place interests, made-at provenance)
- [x] Metro polygons — substrate for opting into a wider "near me" scope (the F031 opt-in surface still to come)
- [x] "Follow this venue" wiring — table, handlers, and button all shipped (T102)
- [x] Jurisdiction badges substrate — powers the "Locally Owned" and "Locally Made" badges

## What producers can do

- [~] Create a business through the Sell walkthrough — *built + merged; eval partial (5/9), forward-deps now merged, awaits eval re-run*
- [~] List a product — *merged; Playwright eval not yet run*
- [x] List a service
- [x] Claim the "Locally Owned" badge — *built + merged (F037, branch t-f037 → main 2026-06-04; eval 8/8 green)*
- [ ] ~~Claim the "Locally Made" badge~~ — *deferred (F039) — needs cross-category redesign before re-approach; branch deleted, tickets archived to `_attic/2026-06-19-f039-deferred/`*
- [x] Generate a printable QR card for any item

## What gatherers can do

- [x] Host a recurring gathering
- [~] Find a venue's public page and follow it — *venue page built + merged (T104/T105); eval not yet written*
- [x] Find a Group's public page

## What newcomers can do

- [x] Sign up and land in a populated feed
- [x] Find another Member's profile and follow them
- [x] See everything they follow — people, Groups, venues — in one place — *built + merged (T108/T109)*
- [ ] Adjust how wide their "near me" reach is — *backlog (F031)*

## The integration test — gates MVP close

- [ ] A newcomer can complete the full journey — signup, profile, locality, feed, host a gathering at a venue, land on a shareable page — without getting stuck
- [ ] A producer can complete the full journey — signup, business Group, list a product, public page — without getting stuck

---

## Where we are right now

- **Foundations:** complete. All substrate — members, locations, items, groups, geography, metro polygons, saved-search / follow-venue wiring, jurisdiction badges — is built and merged to main.
- **Producer surfaces:** *List a service* (F040) and the *QR card* generator (F041) are done end-to-end (evals green, merged). *List a product* (F038) is merged but its Playwright eval hasn't run. The *Sell walkthrough* (F036) is built and merged, eval partial (5/9) — its forward-deps have since merged, so it awaits a re-run. *Locally Owned* (F037) is built + merged (eval 8/8 green); *Locally Made* (F039) is **deferred** — needs cross-category redesign; branch deleted, tickets archived to `_attic/2026-06-19-f039-deferred/`.
- **Gatherer surfaces:** *Host a recurring gathering* (F034) and *Group public page* (F035) are done (evals green, merged). The *venue page* (F033) is built and merged (T104/T105) but its eval hasn't been written or run.
- **Newcomer surfaces:** signup → locality feed (F030) and *Member page + follow* (F032) are done (evals green, merged). The unified *follow everything* page (F042) is **done** — built + merged (T108/T109). *Adjust near-me reach* (F031) is still in backlog.
- **Integration test:** waits on remaining eval runs (F036 re-run, F038 run, F033 write+run), F031 scoping, and the two end-to-end journeys.
- **Board health:** 24 zombie tickets cleared to `done/` during board reconciliation (2026-06-21). No open branches.

## What this scoreboard is not

- Not a ticket tracker — see [`../STAGE-LEDGER.md`](../STAGE-LEDGER.md) for per-feature stage detail.
- Not a scoping doc — see [`bundle-1.md`](bundle-1.md) for what's in / out.
- Not the build sequence — see [`plan-b1-surface-sequence.md`](plan-b1-surface-sequence.md) for dependency order.

This is the one page to glance at on Monday morning to know what's left.
