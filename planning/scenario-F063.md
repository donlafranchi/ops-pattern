---
id: F063
title: Someone says they're coming
status: approved
date: 2026-09-10
depends: []
approved: 2026-09-07
---
## Story

Rae finds a repair café three streets away on Saturday morning, but the page gives her nothing to press. She taps "I'm coming"; the count goes from 6 to 7. She changes her mind Thursday and taps again — it empties, no confirmation dialog. A friend who isn't signed in taps it, signs in, and lands back already marked as coming.

## Acceptance

1. Tapping the response control writes a response row and its event row in the same transaction; the count updates.
2. Tapping again withdraws the response with no confirmation dialog; a double-tap is a no-op enforced by a database constraint.
3. A signed-out tap survives the sign-in round trip and is recorded on return.
4. The count reflects distinct people, never rows.

## Not this

Notifications to the host. Capacity or waitlists. A list of who's coming shown to someone not involved — the count is what a stranger gets.

> **Changed 2026-09-13, and this file is still `approved` — Cowork's to take or reject.** The *Not this* previously read *"a visible list of who's coming"*, full stop. That is the wrong shape: the ruling is **scoped visibility, not absence** — the organizer sees names, Group members see who is coming from within their Group, everyone else sees the count. `product/foundation/policy.md` § Who sees who is involved. **Acceptance criterion 4 is unaffected** — the count still reflects distinct people.
