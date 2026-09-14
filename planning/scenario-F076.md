---
id: F076
title: A person outside an open metro joins its waitlist
status: approved
date: 2026-09-14
depends: [F059]
approved: 2026-09-14 — Don's ruling; threshold 50 creators / 250 patrons, gated on creators, shown as one combined 300
---
## Story

Someone in Boise signs up. Boise is not open yet, so they pick it from the list — every US metro is there — and say whether they are here to make things or to find them. A small popup tells them where Boise stands: a number, and a line about what is still needed. They close it and get on with their day. When Boise opens, it opens because enough people did this.

## Acceptance

1. Every US metro is present and selectable at signup, before launch. A person cannot reach a state where their metro is absent from the list.
2. A person outside an open metro picks one. **No metro is selected for them** — not by IP, not by a default, not by nearest-match.
3. Signup records exactly one of two roles for that person: **creator** or **patron**. Neither is pre-selected.
4. Joining is idempotent: one person counts once in one metro. Re-signup, re-visit or a second device does not increment anything.
5. Changing the selected metro moves that person's count from the old metro to the new one, leaving neither double-counted nor stranded.
6. **Creator and patron counts are stored separately** per metro, and both are readable independently of what is displayed.
7. After joining, a **popup** shows a count and a message. Not a page, not a tab, not a new surface.
8. The popup shows **one combined number** — creators plus patrons, against 300. The 50/250 split does not appear in it.
9. The message states what is still needed. **It never states or implies a date, a timeline, or a promise that the metro will open.**
10. A metro is eligible to open only when it has **at least 50 creators and at least 250 patrons**. Meeting the combined 300 with fewer than 50 creators does not make it eligible.
11. The thresholds are **configurable per metro** without a migration or a deploy.
12. Opening a metro is a deliberate act. **Crossing the threshold never opens a metro on its own.**

## The threshold, and why it is split

**50 creators and 250 patrons. Gated on the creators. Displayed as one combined 300.**

**A combined-only gate can be satisfied by 495 patrons and 5 creators** — which opens a metro with nothing in it. Browse is complete and shows what is actually there *(F059 criterion 2)*; with five creators, what is actually there is five Pages, and the first thing a newcomer learns about SocialUs is that it is empty. **Creators are what make Browse non-empty, so creators are the real gate.** Patrons are the reason opening is worth doing; creators are the reason it is possible.

**The member sees one number because Don asked for one number.** A popup with a count and a message stays a popup with a count and a message. The split is how the platform decides; 300 is what the person reads.

**These are starting values and are expected to move.** A dense metro and a thin one do not need the same floor, which is why criterion 11 makes them per-metro configuration rather than a constant. **Nothing about the number is a commitment to the member** — criterion 9 is the guard: the message says what is needed, never when it will arrive.

## Not this

A waitlist surface, a progress bar, a leaderboard, or a referral mechanic. Notifying people when a metro opens — worth doing, needs a messaging path that does not exist, and is its own scenario. Ranking or displaying who joined. Opening a metro automatically. Charging for a place in line, or selling one.
