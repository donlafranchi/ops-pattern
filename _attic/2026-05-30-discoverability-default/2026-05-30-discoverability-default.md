---
purpose: Park a discoverability-default decision for `weigh` after the running agent clears
layer: planning
status: parked
captured: 2026-05-30
---

# Member discoverability default

## Decision needed

Current behavior appears to make Member profiles publicly searchable by default. PM wants the default flipped: a Member is *not discoverable as a person* until they opt in.

## Recommendation

- **Default: not discoverable as a person.** Outputs (Items, Groups, public actions) remain visible per their own settings. The Member-as-searchable-entity is private.
- **Opt-in tiers (3):** members-only / followers-only / public.
- **Per-surface granularity at T2:** search, directory, handle-direct, and autocomplete are separate switches. The doxxing risk lives in directory listing + autocomplete (algorithmic surfacing of strangers). Handle lookup is closer to "I told you who I am."
- **kind='business' Group remains public-by-default** for commerce. The Member-behind-the-Group is a separate, default-private setting. Stall is findable; home address is not.

## Why default-private aligns with platform shape

People are discovered through their outputs, not by searching them. That's already how the loops work — Items, Groups, events drive discovery. Default-private-Person fits the People-First principle and the anti-Nextdoor commitment in `location.md` (absence of frictionless surfacing is the safety feature in that design).

## Tier progression

- **T1:** single switch (off / members-only), default off.
- **T2:** per-surface controls (search vs. directory vs. handle-direct vs. autocomplete).
- **T3:** add followers-only and public-with-friction (rate-limit, signup-wall on `/m/[handle]` for non-Members).

## Open questions for PM

- Does kind='business' Group display the owner Member name by default, or just the Group name?
- Follow-request UX when a Member is not discoverable: notify-but-don't-reveal when followed by handle?
- Public-tier friction: rate-limit, captcha, or signup-wall on the `/m/[handle]` route?
- Existing Members at flip time: grandfather their current visibility, or force-reset to default and notify?

## Path

`weigh` (ratify the absolute with State-tagged Intent) → memo recording the decision (or system-spec banner in `product/systems/member.md`) → spec update → scenario / ticket update if any active F-number encodes the old default.

## Cross-references

- `product/systems/member.md` — Member entity, multi-Location affinities, DM substrate
- `product/foundation/principles.md` — People-First Principle
- `product/systems/location.md` — anti-Nextdoor commitment (analogous shape)
- `product/needs/member-journey.md` — Loops 1–4 (Gathering / Sharing); discovery still works via outputs

## Provenance

Captured 2026-05-30 during a parallel-agent session. PM ratified the BLUF approach in chat; full ratification deferred to `weigh` after the running agent clears.
