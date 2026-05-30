---
purpose: Ratify the Member-discoverability default (default-private-as-person) with State-tagged Intent.
layer: how
status: proposed
route: weigh
source: _attic/2026-05-30-discoverability-default/2026-05-30-discoverability-default.md
risk: high
---

# Ratify default-private Member discoverability

## What this is

The parked decision flips the Member-discoverability default: a Member is *not discoverable as a person* until they opt in. Outputs (Items, Groups, public actions) stay visible per their own settings; the Member-as-searchable-entity is private by default. The decision encodes a new absolute on the Member primitive and aligns with the People-First principle and the anti-Nextdoor commitment already in `location.md`. `weigh` walks the PM through ratification, lands the State-tagged `Intent` line, and the recommendation produces a memo or a system-spec banner.

## Actions

- Invoke `weigh` on the parked recommendation (default + 3-tier opt-in + per-surface granularity at T2 + kind='business' Group public-by-default carve-out).
- Run the member + platform advocate sub-routines on the doxxing-risk shape (directory listing + autocomplete are the load-bearing surfaces).
- Decide each of the four open questions surfaced in the parked doc (Group owner-name display, follow-request UX, public-tier friction, grandfather vs. force-reset at flip).
- Land the ratified absolute as a State-tagged `Intent` line in `product/systems/member.md` (or in `playbooks/PLATFORM-PATTERNS.md` if the call is platform-wide).
- Record the decision via `memo` only if it reverses a prior pattern entry; otherwise a system-spec banner suffices.

## Side effects

- `product/systems/member.md` gains a discoverability section + State-tagged Intent.
- `product/foundation/principles.md` cross-reference may need a one-line pointer.
- `product/systems/location.md` anti-Nextdoor section gets a sibling pointer.
- Any active F-number that encodes the old default surfaces as a SPEC-PATCHES entry.
- Unblocks downstream scenario work on Member visibility surfaces (`scope` on `/m/[handle]`, search, directory).

## Risk

High — encodes a new absolute on the Member primitive, touches privacy surfaces, and may force-reset existing-Member visibility at flip time.

## Source

Parked 2026-05-30 during a parallel-agent session. Archived to [`_attic/2026-05-30-discoverability-default/`](../../_attic/2026-05-30-discoverability-default/2026-05-30-discoverability-default.md).
