---
id: F077
title: People who actually interact are not hidden from each other; everyone else sees a display name
status: approved
date: 2026-09-14
depends: []
approved: 2026-09-14 — Don's ruling, replaces member.md's rule that real names were encouraged but not required
amended: 2026-09-14 — Don's ruling: public-surface ban plus mutual counterparty disclosure, with interaction as the only path to a name
out-of-scope: 2026-09-30 — Don: real names between people who dealt with each other are out of scope, with `socialus-web` #219; revisit with legal counsel.
---
## Story

Rae signs up with her legal name and email; the platform records it and does not put it on a public surface. She picks a display name — "Rae," a nickname, whatever she wants — and that's what every other member sees on her posts, her Page, her responses. When she sells someone a jar of jam, the two of them stop being hidden from each other — the buyer learns who Rae is, and Rae learns who the buyer is. Same when someone turns up to something she hosted. Nobody can reach either name by looking, searching, or browsing; the only way to learn a name is to have dealt with the person. Everyone else, and every stranger, sees "Rae." If she ever does something worth reporting, the operator opens her record and sees the legal name behind the display name, not just a handle.

## Acceptance

1. Signup requires a full legal name field, separate from email; the account can't be created without it.
2. A member sets a display name, shown everywhere a peer would otherwise see their legal name — posts, Pages, responses, profile.
3. Legal name is not rendered on a public or discovery surface, or to any anonymous visitor — profile, listing, search, map popup. *(Amended 2026-09-14: the blanket peer-facing ban is narrowed to public surfaces; criterion 6 carries the exception.)*
4. The operator's report-review view (F058) shows the reported member's legal name alongside their display name.
5. Existing seeded/test members are backfilled with a legal name or flagged before this ships to real signups.
6. Two people who actually interacted — a completed sale, a recorded attendance — **each see the other's legal name**, bound to that interaction. **The interaction is a purchase or an RSVP that the seller or organiser has confirmed, with a date and both members on it** (Don, 2026-09-30). Buyer sees seller and seller sees buyer; neither is hidden from the other, and nobody else sees either name. This is a **term of interacting, stated plainly at signup — not a consent the member grants or withholds.**
7. **A legal name stays legible on an interaction record for 12 months, then the record shows the display name.** The clock runs from **the date of that interaction** — the sale completing, the gathering happening. **Not from last activity, not from the pair's most recent dealing, and not extended by a later interaction:** each interaction carries its own 12-month clock, so a regular customer's name from 2024 goes dark on schedule while this month's stays legible. *(Don's ruling, 2026-09-14.)*
8. **Interaction is the only path to a name.** The design refuses, and a surface that does any of these is wrong: searching or looking up a member by legal name; reverse lookup from a name to that person's activity; a durable, browsable list of counterparty names existing apart from the interactions that produced them; any rollup that turns repeated interaction into a roster of people. *(Criteria 6–8 added 2026-09-14 — Don's ruling.)*

## Why

### Out of scope (2026-09-30)

**Nothing here is built for launch; revisit with legal counsel.** We don't currently show legal names to other members or bring them up to the public, and we don't take part in disputes between members unless a court orders it. **What still holds comes from other rulings the same day:** the legal name is collected at signup (F081 criterion 1) and seen only by Don and operators, which carries criteria 1 and 4; members see a display name and avatar, which carries criterion 2. The rules below keep their intent for when this returns.

### The principle, in Don's words

*2026-09-14:* **"We want people who interact with each other to not be hidden. We don't want stalking. Anything that is similar to stalking needs to be reduced. Interaction should be open and honest. We also want to reduce negativity and vitriol. That's the idea behind when we share names and when we don't."**

**Criterion 8 is the load-bearing half, and the half that will be lost first.** Criterion 6 reads as a feature and will survive on its own; criterion 8 reads as an absence, and an absence is what gets quietly filled in by the next convenient surface. Mutual disclosure without the refusals is a name directory with extra steps — which is the stalking vector, not the accountability mechanism.

### The roster problem — stated, not papered over

**A busy seller or host interacts with many people, and per-interaction visibility can quietly become a customer list.** What the design refuses, and what it cannot:

**Refused.** A name renders on the interaction record and nowhere else — there is no person-level "people who bought from you" view. Order and attendance records are not sortable, filterable, or searchable by name. A name does not link to a profile, a Page, or any other surface. No export.

**Not preventable, and said out loud:** a seller scrolling their own order history still reads many names in sequence. That is inherent to having an order history at all and cannot be designed away without deleting the record. The asymmetry is real — a buyer accumulates a handful of names, a busy host accumulates hundreds — and the refusals above narrow it rather than close it. This is consistent with the 2026-09-08 ruling that a business may see its own audience and nobody else may; what is new is that these are legal names, not display names.

**Retention: 12 months, per interaction.** *(Don's ruling, 2026-09-14.)* This is what keeps the not-preventable part bounded — a seller's readable name history is one year deep, not the life of the business. An order list that ages out is a record; one that does not is the archive the roster refusal exists to prevent.

**Reversion means the name stops being rendered, not that anything is deleted — and that is a design consequence, not a choice between two stored copies.** The interaction record does not hold its own copy of a legal name; it references the member, and the name resolves at read time, gated on the interaction's age. So there is nothing to delete at 12 months — the gate simply closes. This is the reading that matches the principle: **the platform keeps knowing who someone is** (criterion 1 makes that the accountability floor, and criterion 4's operator view depends on it), while **the counterparty stops being able to browse it** — which is the stalking surface. Deleting the name outright would break the accountability floor to solve a problem the render gate already solves.

**Said honestly:** a counterparty who saw a name inside the 12 months can write it down, and nothing prevents that. The rule bounds what the product hands them, not what a person remembers.

### What counts as an interaction (2026-09-30)

**A confirmed purchase or RSVP, dated, with both members on it.** Purchases are not tracked yet and will be soon. **So the attendance half of criteria 6–7 ships first**, and the sale half waits on purchase tracking, which is parked.

## Not this

ID or document verification — self-attested is enough at launch. Any public or discovery surface showing the legal name — profile, listing, search, map. Disclosure to anyone a transaction or attendance did not make a counterparty. Name search, reverse lookup, or any roster built from counterparty names. Asking a member to consent to criterion 6 — it is a term, disclosed at signup. Retroactively verifying legal names already on file.

*("Any peer-facing surface showing the legal name" stood here until 2026-09-14; it was too wide and forbade the counterparty disclosure criterion 6 now requires.)*
