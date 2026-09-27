---
id: F076
title: A person outside an open metro joins its waitlist
status: approved
date: 2026-09-14
depends: [F059]
approved: 2026-09-14 — Don's ruling; threshold 50 creators / 250 patrons, gated on creators, shown as one combined 300
amended: 2026-09-21 — Don: someone may leave an email to be told when a metro opens, without signing up. Criterion 4 reopened, 13-15 added, the Not-this line struck.
amended: 2026-09-22 — criterion 14 cannot be met by a live count at all; an anonymous submitter is shown none. Found by running the handler against a real database while the unit test stayed green.
amended: 2026-09-23 — Don reverses the line above: the count comes back, CACHED rather than live, and metros sort by it. The oracle was real and the stakes were overstated. Criteria 7, 8 and 14 restated; criterion 16 added.
amended: 2026-09-27 — Don (with F081): a member's zip determines their metro. Criterion 2 annotated.
---
## Story

Someone in Boise signs up. Boise is not open yet, so they pick it from the list — every US metro is there — and say whether they are here to make things or to find them. A small popup tells them where Boise stands: a number, and a line about what is still needed. They close it and get on with their day. When Boise opens, it opens because enough people did this.

## Acceptance

1. Every US metro is present and selectable at signup, before launch. A person cannot reach a state where their metro is absent from the list.
2. A person outside an open metro picks one. The platform **may suggest** a shortlist, derived from the person's zip, and **never selects for them** — no IP-derived metro, no pre-filled default, no auto-assignment on a nearest match. *(Criterion amended 2026-09-14 to permit suggestion; auto-selection stays forbidden.)* **Amended 2026-09-27 (F081): a signing-up member's zip determines their metro.** A metro derived from the person's own zip is not a selection made for them; IP, a default, and a nearest match stay forbidden.
3. The waitlist entry records whether the person is here to make things or to find them. Neither is pre-selected. **This is a property of the waitlist entry, not of the account** — no role is stored on the member, and the answer is discarded when the metro opens. *(Amended 2026-09-14: this read "Signup records exactly one of two roles for that person," which stored a role the platform refuses to store.)*
4. Joining is idempotent: **one person counts once in one metro, whether they signed up or only left an email.** Re-signup, re-visit or a second device does not increment anything. *(Amended 2026-09-21: `member_id unique` no longer carries this, because an anonymous entry has no member. The uniqueness key becomes the identity the entry actually has — the normalised email, per metro.)*
5. Changing the selected metro moves that person's count from the old metro to the new one, leaving neither double-counted nor stranded.
6. **Creator and patron counts are stored separately** per metro, and both are readable independently of what is displayed.
7. After joining, a **popup** shows a count and a message. Not a page, not a tab, not a new surface. **Everyone sees a count, anonymous submitter included** — it is the CACHED figure, never one read in response to the submission. *(Amended 2026-09-22 to withhold the count from an anonymous submitter; **that amendment is reversed 2026-09-23** — see criterion 14.)*
8. The popup shows **one combined number** — creators plus patrons, against 300. The 50/250 split does not appear in it. **The same figure the metro picker orders by**, and the same figure everywhere: a second, fresher number on any surface reopens what criterion 14 closes.
9. The message states what is still needed. **It never states or implies a date, a timeline, or a promise that the metro will open.**
10. A metro is eligible to open only when it has **at least 50 creators and at least 250 patrons**. Meeting the combined 300 with fewer than 50 creators does not make it eligible.
11. The thresholds are **configurable per metro** without a migration or a deploy.
12. Opening a metro is a deliberate act. **Crossing the threshold never opens a metro on its own.**
13. **A person who picks a metro that is not open can leave an email address to be told when it opens, without creating an account.** No password, no name, no second step. Signing up stays available and is not the price of being told.
14. **The response is identical whether or not that address was already on the list** — same words, same status, **and the same number**. A person who submits twice cannot tell that they had already submitted, and neither can anyone else. **This is met by the number not being a function of the submission**, not by there being no number: the count shown is a cached figure, at most an hour old, shared with the metro picker's ordering, and a submission does not move it. *(Amended 2026-09-22 to "no count at all"; **that amendment is reversed 2026-09-23 by Don** — see the Why section. The mechanism the 2026-09-22 reading identified is real; what it discloses is that an address expressed interest in a local app before launch, which does not justify removing the count.)*
15. **An address left this way is used to say that the metro opened, and for nothing else.** Not marketing, not a newsletter, not a second message about something else. It is discarded when the metro opens and the message has been sent.

16. **Metros are ordered by how many people are waiting**, using that same cached figure. Ordering is the strictest test of criterion 14 — a sorted list exposes every metro at once — so a live count anywhere in the ordering path fails this criterion rather than merely being wasteful.

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

**REVERSED 2026-09-23 — Don, and this is the ruling that stands.** Everything above about the mechanism is correct and is kept, because the mechanism did not change. What changed is the ruling about the stakes:

> *"how would anyone know about anybody elses emails with just a count? that seems a bit too over the top for privacy. Nobody would be able to know anything else except someone else somewhere else also found this site. they could have even chosen the wrong area. also it would be cool to sort those metros by number of people signed up."*

**The count is back, and it is CACHED rather than live.** The leak was never the number existing — it was the number being **recomputed and re-displayed in response to your own write**. Read it before the write and two submissions differ; read it after and a single probe differs. Either way the figure shown is a function of what the reader just did. **A cached figure is not.** One read serves every surface — the popup and the picker's ordering — and a submission does not move it, so there is nothing to difference across submissions.

**What a cache does not close, stated here so nobody re-derives it as new.** After the window expires the figure refreshes. In a metro where nothing else happened inside that window, someone who submitted and waited could see it move by one and attribute that to themselves. That is inherent to a cache and no window length removes it: longer makes it rarer and staler, shorter makes it fresher and more attributable. It is weakest where there is real demand and strongest in an empty metro, which is where the answer is least interesting. **Ruled acceptable.**

**And it buys the thing Don asked for in the same breath:** metros sorted by how many are waiting (criterion 16). A sorted list is the strictest test of criterion 14, because it exposes every metro at once — which is why the ordering reads the same cached figure and not a fresher one.

**Hashing the address does not help here and should not be reached for.** The address has to be readable to send the one message criterion 15 permits, so it is stored as an address; a hash would buy nothing and cost the feature.

**This needs a migration**, and per [production-asks-don] Don applies it. **Today's outage came from merging ahead of one** — the code reached production before the schema it required. The migration lands and is applied before the surface that depends on it merges, not alongside it.

## Not this

A waitlist surface, a progress bar, a leaderboard, or a referral mechanic. ~~Notifying people when a metro opens~~ — **struck 2026-09-21, Don ruled it in; it is criteria 13-15.** [superseded-in-part-by 2026-09-21: Someone who picks a metro] Ranking or displaying who joined. Any use of a left address other than the one message criterion 15 permits. Opening a metro automatically. Charging for a place in line, or selling one.
