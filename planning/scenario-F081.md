---
id: F081
title: Everyone signs up the same way, and the zip sets the metro
status: approved
gates: launch
date: 2026-09-14
depends: [F076, F077]
approved: 2026-09-14 — Don's ruling; legal name, email, zip, display name, zip suggests the metro
amended: 2026-09-30 — Don: every US zip known before launch, an unknown one refused; the metro is the MSA; the zip is kept and changed on /you; every member is verified as a person, method open; no "we never sell" line, a placeholder about what the app is for instead. Story and criteria 1, 4 and 5 restated, 8 added.
---
## Story

Maya follows a neighbour's link and signs up. One screen: her legal name, her email, her zip, and the display name everyone else will see. The screen tells her what the app is for: good and decent people finding, connecting with and supporting each other. Her zip decides her metro, and the screen says which one — Sacramento — so she can see it rather than have it happen to her. Nothing is placed for her that she did not give. Nobody asks whether she is here to make things or find them — she is a member, and that is the whole question.

## Acceptance

1. **Signup collects legal name, email, zip and display name, and verifies the email.** Every member is verified as a person; how is open (Why). No other field exists in the flow. The legal name, email and phone are seen only by Don and operators, and are currently handed over only under a court order (2026-09-30).
2. The zip is stored, and never rendered on any surface another member or visitor can reach — profile, listing, search, map.
3. **The zip determines the metro**, and the screen shows the person which metro that is. **Nothing else determines it** — not IP, not a pre-filled default, not a nearest match. *(Amended 2026-09-27: this read "the zip produces a shortlist… the person selects one"; Don ruled the zip decides.)*
4. **Nobody picks a metro at signup.** A member who moves changes their zip on `/you`, and their metro follows from it. It is not one-and-done.
5. The screen carries a line saying what the app is for, **and no line about not selling member information.** Placeholder, Don's words ([public-is-draft]): *"This is a community building app. It was made for good and decent people to find, connect with and support other good and decent people. We are here to build a better future together."* It states no date, feature, or promise about the future.
6. No field, control, or string in signup asks or records whether the person makes things or finds them.
7. **Onboarding assigns no place the person did not give.** A member's home is the metro their zip determined; no default place is written on their behalf, seen or unseen. *(Added 2026-09-27. Today `DEFAULT_HOME_PLACE_ID` sets every new member's home to a fictional city whose box sits inside Sacramento, which is why every member resolves to Sacramento.)*
8. **Every US zip resolves, before launch, through the national HUD-USPS crosswalk, to the MSA that contains it.** A zip the crosswalk does not know is refused with *"We don't recognize that zip, try again."* A person whose zip is in no MSA chooses a metro to view; their zip is kept, to tell them when their own MSA opens.

## Not this

Choosing the person-verification method, which is open. The waitlist popup and metro counts (F076). Storing anything derived from the zip beyond the metro it determined. A home place finer than the metro — local means the whole metro (F094). A street address — `product/systems/member.md` refuses one by default. Any line about not selling member information (2026-09-30). Covering zips outside every MSA, Yuba and Sutter among them: growing MSA boundaries is parked for a later scenario.

## Why

### The zip decides (2026-09-27)

**Don reversed the 2026-09-14 shortlist-and-pick.** A zip is something the person told us, so a metro derived from it is not the platform choosing for them; what F076 criterion 2 forbids is choosing from something they did not give — IP, a default, a nearest match. **The unseen default place was the real violation**, and criterion 7 removes it.

**The metro is the MSA** (Don, 2026-09-30): Sacramento is MSA 40900, not CSA 472. Yuba and Sutter are not their own MSA and are not covered at launch. A member whose zip is in no MSA can choose a metro to view; the value is kept for records and to tell them when their own MSA opens.

**The zip is kept** (Don, 2026-09-30): *"How will we know what's going on in their area without it."* So criterion 2 stands, and changing the zip is how a member changes metro.

**Criterion 5's line ships as the placeholder, Don's words** (Don, 2026-10-01). He may change it any time after launch.

### Who sees a real name

**Out of scope 2026-09-30; revisit with legal counsel** (F077). Signup says nothing about showing legal names to anyone.

**A person is verified by a text-message code to their phone, at signup** (Don, 2026-10-01). At signup because every member is verified (2026-09-30). Today the code has no phone field, email-only sign-in, and Supabase SMS switched off — that is the build.

[open-question owner=don raised=2026-10-01] For counsel: what must the Terms and Privacy pages say? Privacy must disclose that we collect legal names, verified phones (the text-message code, 2026-10-01) and verified emails (California privacy duties); signup collects them from day one (criterion 1), and both pages are launch scope and due before the first signup (2026-10-01). **Can they ship as a plain-language draft before counsel reviews them?** There is no counsel today (2026-10-01). A) **Yes:** a plain-language draft, marked as such, ships at launch and counsel reviews it when engaged. B) No: launch waits on counsel's review. *Recommend A;* an honest plain draft is better than no page, and B puts the launch date on a hire nobody has scheduled. **Recommended path:** adapt GitHub's site-policy (reusable without conditions) and Basecamp's policies (with attribution); drafts by 2026-10-15, live 2026-10-30, counsel review after launch. Don's 14-fact checklist is due 2026-10-08. Starter kit: [Terms & Privacy starter kit](https://claude.ai/code/artifact/b70649b1-25d9-4027-a9e3-a19f78c9e191).

[open-question owner=don raised=2026-10-01] The 2026-09-30 ruling says what we collect is handed over "only under a court order"; the law reaches further, to any valid legal process — subpoenas, and emergencies where someone may be hurt. Which wording does the privacy policy use? A) **"Valid legal process"**, with counsel to settle the exact terms. B) Keep "court order" and refuse anything less, accepting the risk of contesting a valid subpoena. *Recommend A;* B promises something the law may not let us keep.

### Settled against F076

**F076 criterion 3 was amended 2026-09-14** so the make-or-find answer is a property of the waitlist entry, discarded when the metro opens — not an account field. Criterion 6 here and F076 criterion 3 now hold together.
