---
id: F081
title: Everyone signs up the same way, and the zip sets the metro
status: approved
gates: launch
date: 2026-09-14
depends: [F076, F077]
approved: 2026-09-14 — Don's ruling; legal name, email, zip, display name, zip suggests the metro
amended: 2026-09-27 — Don: the zip determines the metro, and onboarding stops silently assigning a place. Criterion 3 restated, 7 added. The wider ruling that local means the whole metro is F094.
---
## Story

Maya follows a neighbour's link and signs up. One screen: her legal name, her email, her zip, and the display name everyone else will see. The screen tells her plainly that the platform does not sell her information, and that not doing that is the point of it. Her zip decides her metro, and the screen says which one — Sacramento — so she can see it rather than have it happen to her. Nothing is placed for her that she did not give. Nobody asks whether she is here to make things or find them — she is a member, and that is the whole question.

## Acceptance

1. Signup collects a zip code, alongside the legal name, email and display name F077 already requires. No field beyond those four exists in the flow.
2. The zip is stored, and never rendered on any surface another member or visitor can reach — profile, listing, search, map. **The counterparty disclosure of F077 criterion 6 covers the legal name only; it never carries the zip.**
3. **The zip determines the metro**, and the screen shows the person which metro that is. **Nothing else determines it** — not IP, not a pre-filled default, not a nearest match. *(Amended 2026-09-27: this read "the zip produces a shortlist… the person selects one"; Don ruled the zip decides.)*
4. Every US metro stays reachable from the same control, so a person whose shortlist is wrong is never stuck (F076 criterion 1 holds).
5. The screen carries a published line stating the platform does not sell member information, **and a second stating that people who interact see each other's real name** — disclosed as a term, not offered as a choice. Neither states a date, a feature, or a promise about the future.
6. No field, control, or string in signup asks or records whether the person makes things or finds them.
7. **Onboarding assigns no place the person did not give.** A member's home is the metro their zip determined; no default place is written on their behalf, seen or unseen. *(Added 2026-09-27. Today `DEFAULT_HOME_PLACE_ID` sets every new member's home to a fictional city whose box sits inside Sacramento, which is why every member resolves to Sacramento.)*

## Not this

Any verification, document, ID, or identity check — that is F082, and it happens later, not here. The waitlist popup and metro counts (F076). Storing anything derived from the zip beyond the metro it determined. A home place finer than the metro — local means the whole metro (F094). A street address — `product/systems/member.md` refuses one by default. The exact wording of the no-sale line, which is Don's call ([public-is-draft]).

## Why

### The zip decides (2026-09-27)

**Don reversed the 2026-09-14 shortlist-and-pick.** A zip is something the person told us, so a metro derived from it is not the platform choosing for them; what F076 criterion 2 forbids is choosing from something they did not give — IP, a default, a nearest match. **The unseen default place was the real violation**, and criterion 7 removes it.

[open-question owner=don raised=2026-09-27] What does a zip the crosswalk does not know do? It holds Sacramento only, and one zip maps to exactly one metro.

[open-question owner=don raised=2026-09-27] Which grain is "the metro" for a zip — the crosswalk's MSA 40900 (four counties) or the polygon's CSA 472 (six)? A Sutter or Yuba zip is inside the polygon and outside the crosswalk.

[open-question owner=don raised=2026-09-27] May a person override the metro their zip decided, through criterion 4's every-metro control?

[open-question owner=don raised=2026-09-27] What are the exact words of criterion 5's two lines — no sale, and real names between people who interact? Don's words ([public-is-draft]); a builder can wire placeholders only.

### Who sees a real name

**Settled 2026-09-14, both questions.** It runs **both ways** — two people who interacted each see the other's legal name. And it is **disclosure, not consent** — a term of interacting, stated plainly at signup, which is what criterion 5's copy has to carry alongside the no-sale line. **Interaction is the only path to a name:** nothing is reachable by lookup, search, or browsing. F077 criteria 6–8 carry the rule, the 12-month clock, and the refusals; F077 also states the roster tension and the one open question left (retention).

### Settled against F076

**F076 criterion 3 was amended 2026-09-14** so the make-or-find answer is a property of the waitlist entry, discarded when the metro opens — not an account field. Criterion 6 here and F076 criterion 3 now hold together.
