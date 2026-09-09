---
purpose: Review — F065, the follow verb. Verdict PROCEED; held in the draft lane pending scheduling.
layer: how
status: backlog
---

# Review — F065: someone follows something

**Scenario:** [`scenario-F065-someone-follows-something.md`](scenario-F065-someone-follows-something.md)
**Reviewer:** `review` — 2026-09-07
**Verdict:** **PROCEED — and held.**

> **Reviewed but not advanced, deliberately.** The verdict clears the work; **the PM has not scheduled it.** It stays in the draft lane because the build agent may pick up anything in an approved lane. **A future reader should read this as "ready and waiting," not "unfinished."**

## Gates

**Gate A / Gate B — clear.** The one absolute this encodes — *interest and belonging are different relationships and must not share a row* — is State-tagged in the scenario, Ratified 2026-09-07.

## Binding notes

### 1. The three access refusals get tests, not comments

The scenario's guard rail is that following grants nothing. **Three of the four refusals close problems that would otherwise be real:** the member roster read, the unlisted-Page read, and the Sell routing that filters kind and lifecycle but not role.

**Each gets a test asserting the refusal directly.** Not "no code grants this" — an actual follower, an actual check, an actual denial. **An access guarantee inferred from the absence of code is the kind that gets removed by a later refactor nobody connects to it.**

### 2. The Sell routing bug is live and independent — fix it whether or not this ships

The membership query behind the Sell control filters on kind and lifecycle and **not on role.** That is wrong today, before any follow exists — a `role='member'` membership already routes someone to the shop index as though they owned one.

**Do not let it ride on this scenario.** If F065 slips, the routing fix should not slip with it.

### 3. Migrating venue follows out of saved searches touches a shipped surface

Person follows copy trivially and Page follows do not exist. **Venue follows are the real migration** — they live as saved searches with a location set, and the saved-search surface is shipped and owner-only.

**Say in the ticket whether a migrated venue follow leaves its saved search behind or removes it.** Leaving both is how one venue appears twice in a following list.

## Architecture (M1)

- **Three nullable foreign keys with an exclusive CHECK is the right shape** and the reasoning belongs in the migration comment, because the obvious alternative — one polymorphic column — is what most people reach for and it silently discards cascade deletes.
- **Net code removal.** The unified reader's three-way union is deleted, not extended; its own comment says its purpose is stopping the three-substrate distinction leaking into divergent queries. **That purpose disappears, which is the sign this is the right change.**
- **Watch the index shape.** "Who follows this Page" is on the hot path of any audience feature; it needs a reverse index per subject column, not one composite.

## Accessibility (M3)

Fires — the follow control is a toggle with a pressed state exposed to assistive technology, an accessible name that changes with state, and an announced change. **Same recipe as the response control; build them to the same pattern rather than two.**

## Verdict

**PROCEED**, three binding notes. **Held in `backlog/` pending PM scheduling.**
