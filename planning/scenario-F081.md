---
id: F081
title: Everyone signs up the same way, and the zip suggests the metro
status: approved
date: 2026-09-14
depends: [F076, F077]
approved: 2026-09-14 — Don's ruling; legal name, email, zip, display name, zip suggests the metro
---
## Story

Maya follows a neighbour's link and signs up. One screen: her legal name, her email, her zip, and the display name everyone else will see. The screen tells her plainly that the platform does not sell her information, and that not doing that is the point of it. Her zip produces a short list of metros; she picks hers. Nothing is picked for her, and if the list is wrong she reaches every other US metro from the same control. Nobody asks whether she is here to make things or find them — she is a member, and that is the whole question.

## Acceptance

1. Signup collects a zip code, alongside the legal name, email and display name F077 already requires. No field beyond those four exists in the flow.
2. The zip is stored, and never rendered on any surface another member or visitor can reach — profile, listing, search, map. **The counterparty disclosure of F077 criterion 6 covers the legal name only; it never carries the zip.**
3. The zip produces a shortlist of candidate metros. **The person selects one; no metro is selected for them** — not by zip, not by IP, not by a pre-filled default.
4. Every US metro stays reachable from the same control, so a person whose shortlist is wrong is never stuck (F076 criterion 1 holds).
5. The screen carries a published line stating the platform does not sell member information, **and a second stating that people who interact see each other's real name** — disclosed as a term, not offered as a choice. Neither states a date, a feature, or a promise about the future.
6. No field, control, or string in signup asks or records whether the person makes things or finds them.

## Not this

Any verification, document, ID, or identity check — that is F082, and it happens later, not here. The waitlist popup and metro counts (F076). Storing anything derived from the zip beyond the metro the person picked. A street address — `product/systems/member.md` refuses one by default. The exact wording of the no-sale line, which is Don's call ([public-is-draft]).

## Why

### Who sees a real name

**Settled 2026-09-14, both questions.** It runs **both ways** — two people who interacted each see the other's legal name. And it is **disclosure, not consent** — a term of interacting, stated plainly at signup, which is what criterion 5's copy has to carry alongside the no-sale line. **Interaction is the only path to a name:** nothing is reachable by lookup, search, or browsing. F077 criteria 6–8 carry the rule, the 12-month clock, and the refusals; F077 also states the roster tension and the one open question left (retention).

### Settled against F076

**F076 criterion 3 was amended 2026-09-14** so the make-or-find answer is a property of the waitlist entry, discarded when the metro opens — not an account field. Criterion 6 here and F076 criterion 3 now hold together.
