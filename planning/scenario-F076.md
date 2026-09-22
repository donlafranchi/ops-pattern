---
id: F076
title: A person outside an open metro joins its waitlist
status: approved
date: 2026-09-14
depends: [F059]
approved: 2026-09-14 — Don's ruling; threshold 50 creators / 250 patrons, gated on creators, shown as one combined 300
amended: 2026-09-21 — Don: someone may leave an email to be told when a metro opens, without signing up. Criterion 4 reopened, 13-15 added, the Not-this line struck.
amended: 2026-09-22 — criterion 14 cannot be met by a live count at all; an anonymous submitter is shown none. Found by running the handler against a real database while the unit test stayed green.
---
## Story

Someone in Boise signs up. Boise is not open yet, so they pick it from the list — every US metro is there — and say whether they are here to make things or to find them. A small popup tells them where Boise stands: a number, and a line about what is still needed. They close it and get on with their day. When Boise opens, it opens because enough people did this.

## Acceptance

1. Every US metro is present and selectable at signup, before launch. A person cannot reach a state where their metro is absent from the list.
2. A person outside an open metro picks one. The platform **may suggest** a shortlist, derived from the person's zip, and **never selects for them** — no IP-derived metro, no pre-filled default, no auto-assignment on a nearest match. *(Criterion amended 2026-09-14 to permit suggestion; auto-selection stays forbidden.)*
3. The waitlist entry records whether the person is here to make things or to find them. Neither is pre-selected. **This is a property of the waitlist entry, not of the account** — no role is stored on the member, and the answer is discarded when the metro opens. *(Amended 2026-09-14: this read "Signup records exactly one of two roles for that person," which stored a role the platform refuses to store.)*
4. Joining is idempotent: **one person counts once in one metro, whether they signed up or only left an email.** Re-signup, re-visit or a second device does not increment anything. *(Amended 2026-09-21: `member_id unique` no longer carries this, because an anonymous entry has no member. The uniqueness key becomes the identity the entry actually has — the normalised email, per metro.)*
5. Changing the selected metro moves that person's count from the old metro to the new one, leaving neither double-counted nor stranded.
6. **Creator and patron counts are stored separately** per metro, and both are readable independently of what is displayed.
7. After joining, a **popup** shows a count and a message. Not a page, not a tab, not a new surface. *(Amended 2026-09-22: a count for a signed-in member; for an anonymous submitter, the message alone — see criterion 14.)*
8. The popup shows **one combined number** — creators plus patrons, against 300. The 50/250 split does not appear in it.
9. The message states what is still needed. **It never states or implies a date, a timeline, or a promise that the metro will open.**
10. A metro is eligible to open only when it has **at least 50 creators and at least 250 patrons**. Meeting the combined 300 with fewer than 50 creators does not make it eligible.
11. The thresholds are **configurable per metro** without a migration or a deploy.
12. Opening a metro is a deliberate act. **Crossing the threshold never opens a metro on its own.**
13. **A person who picks a metro that is not open can leave an email address to be told when it opens, without creating an account.** No password, no name, no second step. Signing up stays available and is not the price of being told.
14. **The response is identical whether or not that address was already on the list** — same words, same status. A person who submits twice cannot tell that they had already submitted, and neither can anyone else. *(Amended 2026-09-22: "same count" struck, and no count is shown to an anonymous submitter at all. Any truthful live count leaks membership by differencing — see the Why section. The criterion is met by showing no number, not by choosing when to read one.)*
15. **An address left this way is used to say that the metro opened, and for nothing else.** Not marketing, not a newsletter, not a second message about something else. It is discarded when the metro opens and the message has been sent.

## Why

### The threshold, and why it is split

**50 creators and 250 patrons. Gated on the creators. Displayed as one combined 300.**

**A combined-only gate can be satisfied by 495 patrons and 5 creators** — which opens a metro with nothing in it. Browse is complete and shows what is actually there *(F059 criterion 2)*; with five creators, what is actually there is five Pages, and the first thing a newcomer learns about SocialUs is that it is empty. **Creators are what make Browse non-empty, so creators are the real gate.** Patrons are the reason opening is worth doing; creators are the reason it is possible.

**The member sees one number because Don asked for one number.** A popup with a count and a message stays a popup with a count and a message. The split is how the platform decides; 300 is what the person reads.

**These are starting values and are expected to move.** A dense metro and a thin one do not need the same floor, which is why criterion 11 makes them per-metro configuration rather than a constant. **Nothing about the number is a commitment to the member** — criterion 9 is the guard: the message says what is needed, never when it will arrive.

### Leaving an email, and the thing it makes answerable

**Don ruled this in on 2026-09-21**, answering the open question `MetroNotCoveredPanel` already carried in a comment: someone who picks a closed metro should be able to say *tell me when it opens* without signing up.

**It breaks criterion 4's enforcement, which is the real change.** Idempotency was carried by `member_id unique`, and **an anonymous entry has no member**. The replacement is uniqueness on the normalised email per metro — and **that is a privacy consequence, not just a constraint swap: a unique key on an email makes *is this address already on the list* a question the endpoint can answer.** Anyone who can reach it can test an address they did not supply.

**The mitigation is criterion 14 and it is the only one that works: the endpoint must not distinguish the two cases.** Same words, same status, whether the row was inserted or already there.

**Corrected 2026-09-22 — the paragraph that stood here prescribed a fix that does not work.** It said the count shown "must be the metro's current count either way rather than a before-and-after", which became the instruction to read the count *before* the write. That is not a mitigation; it is the thing that gets diffed. The first submission inserts a row, so a second submission's pre-write read returns one higher — verified against Postgres while building the handler, 0 then 1. The unit test asserting the two responses were identical passed the whole time, because a mocked count is fixed however it is called.

Reading *after* the write inverts the problem rather than solving it: two submissions of one address then agree, but a single probe of an address you do not own returns a different number depending on whether it was already there — one request instead of two, so a cheaper attack than the one it closes.

**Any truthful live count leaks membership by differencing.** The leak is in the number, not in when it is read, and no ordering of the read and the write removes it.

**Ruled 2026-09-22: an anonymous submitter is shown no count at all** — not a rounded one, not a stale one, none. Just the confirmation message. The handler does not read the counts, so there is no read order left to get wrong, and criterion 14 holds by construction rather than by care. **The count was never load-bearing for this person**: it teaches a creator on the composer's audience switch who they are reaching, and it teaches someone leaving an address nothing they can act on. A signed-in member still sees it, because a member is entitled to see themselves counted.

**Hashing the address does not help here and should not be reached for.** The address has to be readable to send the one message criterion 15 permits, so it is stored as an address; a hash would buy nothing and cost the feature.

**This needs a migration**, and per [production-asks-don] Don applies it. **Today's outage came from merging ahead of one** — the code reached production before the schema it required. The migration lands and is applied before the surface that depends on it merges, not alongside it.

## Not this

A waitlist surface, a progress bar, a leaderboard, or a referral mechanic. ~~Notifying people when a metro opens~~ — **struck 2026-09-21, Don ruled it in; it is criteria 13-15.** Ranking or displaying who joined. Any use of a left address other than the one message criterion 15 permits. Opening a metro automatically. Charging for a place in line, or selling one.
