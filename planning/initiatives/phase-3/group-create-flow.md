---
purpose: Phase 3 item stub — the `/g/new` Group create flow for non-business kinds.
layer: how
status: stub
---

# Phase 3 — `/g/new` Group create flow (non-business kinds)

## What this is

A guided flow at `/g/new` for creating Groups of any kind. F036 ships the kind='business' walkthrough specifically; this stub covers the other five kinds — `place`, `interest`, `practice`, `event_anchored`, `family` — each with kind-specific role validation per `groups.md`.

## Where it came from

- Archived [`_attic/2026-05-28-rebuild-plan/rebuild-plan.md`](../../_attic/2026-05-28-rebuild-plan/rebuild-plan.md) Phase 3 — *"`/g/new` — Group create flow. Six kinds; each kind walks role-per-kind validity (e.g., kind='business' creates founder owner-role membership)."*
- F036 (already in `scenarios-backlog/`) covers kind='business' as the Sell walkthrough; the other five kinds were not folded in.

## Rough shape

- URL: `/g/new` — auth-gated.
- Kind picker — five non-business kinds, each with a one-line description:
  - `place` — a Group rooted at a Place (neighborhood association, civic group)
  - `interest` — a Group united by shared interest (book club, run club regulars)
  - `practice` — a Group practicing something together (tool library, repair café)
  - `event_anchored` — a Group that emerged from a recurring gathering
  - `family` — a private Group; default `discoverability='private'`
- Kind-specific role assignment:
  - `place` / `interest` / `practice` — creator gets role `steward` or `organizer` (per groups.md spec)
  - `event_anchored` — creator gets `organizer`; `seeded_by_item_id` optional FK to an existing gathering Item
  - `family` — creator gets `member`; private by default
- Anchor Location: optional for most kinds; required for `place`-kind.

## Depends on

- F036 (kind='business' walkthrough) as the design reference — same composer pattern, different kind branches.
- F035 (Group public page) — destination after create.
- `groups.md` role-per-kind validation table — authoritative source for which roles are valid for each kind.
- `groups.discoverability` defaults per kind (family → private; others → listed).

## Advance this by

1. PM decides: one F### per kind (5 scenarios) or one F### covering all five via the kind picker (1 scenario)? Likely 1 scenario with kind-specific assertions in the acceptance criteria.
2. Confirm role-per-kind validation in `groups.md` is current and matches what the walkthrough should enforce.
3. Decide the secondary entries — is `/g/new` reachable from `/g` browse, from `/you`, from both?
4. Affinity-first Group discovery (C6) is adjacent — does `/g/new` get a "suggested Groups you might be starting" affordance? Likely no at b1, but design call.
5. Promote to `planning/scenarios-backlog/F###-group-create-non-business.md` via `scope`.

## Out of scope for this stub

- kind='business' walkthrough — covered by F036.
- Family Group invitation surface (how do other family members join a private Group) — separate stub if it ever lands.
- Stewardship rotation for `place` / `practice` Groups — that's a separate stub (see `stewardships.md`).
