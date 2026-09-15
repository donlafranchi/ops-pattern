---
id: F081
title: Everyone signs up the same way, and the zip suggests the metro
status: draft
date: 2026-09-14
depends: [F076, F077]
---
## Story

Maya follows a neighbour's link and signs up. One screen: her legal name, her email, her zip, and the display name everyone else will see. The screen tells her plainly that the platform does not sell her information, and that not doing that is the point of it. Her zip produces a short list of metros; she picks hers. Nothing is picked for her, and if the list is wrong she reaches every other US metro from the same control. Nobody asks whether she is here to make things or find them — she is a member, and that is the whole question.

## Acceptance

1. Signup collects a zip code, alongside the legal name, email and display name F077 already requires. No field beyond those four exists in the flow.
2. The zip is stored, and never rendered on any peer-facing or anonymous surface — profile, listing, search, map.
3. The zip produces a shortlist of candidate metros. **The person selects one; no metro is selected for them** — not by zip, not by IP, not by a pre-filled default.
4. Every US metro stays reachable from the same control, so a person whose shortlist is wrong is never stuck (F076 criterion 1 holds).
5. The screen carries a published line stating the platform does not sell member information. It states no date, no feature, and no promise about the future.
6. No field, control, or string in signup asks or records whether the person makes things or finds them.

## Not this

Any verification, document, ID, or identity check — that is F082, and it happens later, not here. The waitlist popup and metro counts (F076). Storing anything derived from the zip beyond the metro the person picked. A street address — `product/systems/member.md` refuses one by default. The exact wording of the no-sale line, which is Don's call (RULES rule 4).

## Unresolved against F076

**F076 criterion 3 records creator-or-patron at signup** to drive the 50/250 waitlist gate. Criterion 6 here says signup records no such thing. Both cannot hold. Don rules; a candidate reconciliation is that the role field belongs to the waitlist popup, not to account creation, and dies when a metro opens.
