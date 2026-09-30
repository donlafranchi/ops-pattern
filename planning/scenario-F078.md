---
id: F078
title: Flagged content hides itself immediately, and the poster is told why
status: approved
gates: launch
date: 2026-09-14
depends: [F058, F077]
approved: 2026-09-14 — Don's ruling
amended: 2026-09-30 — Don: everything a member posts is reportable; "threat of harm" is a seventh category that hides at any bar; the bar rises when his daily review passes 30 minutes; the reporter picks a reason the poster sees and can rebut, and is told misuse costs a strike (after three, their reports stop auto-hiding). Criteria 1, 3, 5 and 8 restated, 9–11 added. (2026-09-27: the hide bar is per-metro data starting at zero.)
---
## Story

A photo gets reported. The reporter picks a reason, and is told kindly that reports are for keeping everyone safe and that misusing them has consequences. An agent reads the report and the content and tags a category and a confidence score. Whether it hides depends on where the metro's bar sits. At launch the bar is at zero, so it hides right then, whatever the score, because there are few enough reports that Don can look at every one. The poster gets a message within seconds: what was hidden, and the reason the reporter gave, in plain words. If they think it's wrong, they write back explaining themselves. Later, when Don's daily review runs past half an hour, he raises the bar and a low-confidence report only queues.

## Acceptance

1. **Anything a member can post is reportable: photos, Pages, announcements and posts.** A submitted report triggers agent classification: category (harassment, nudity, spam, violence, children, threat of harm, other) and a confidence/severity score.
2. **Content hides automatically when its score is at or above its metro's hide bar** — the same mechanism F058's Remove-photo control uses, triggered by the agent, not a person. *(Amended 2026-09-27: this read "the disallowed bar", with no number and no owner.)*
3. The poster is notified immediately, in-app (not email), with the specific category, **the reason the reporter chose**, and a plain-language explanation.
4. The poster can submit one explanation, rebutting the reason; submitting is the only thing that creates work for a person — an unanswered takedown stays hidden and closes itself.
5. Threat-of-harm or children-category flags text Don's phone (SMS) immediately regardless of confidence; everything else queues in a mobile review view for whenever he's free.
6. Below the bar, nothing happens automatically — it still lands in the same queue for an unhurried look. **At the launch value nothing is below the bar.**
7. **The hide bar is configurable per metro without a migration or a deploy**, the way F076 criterion 11 makes the waitlist thresholds — a value on the metro, changed as data. **Its starting value is zero: every report hides, exactly as the 2026-09-13 hide-on-report behaviour does today.** Content whose metro cannot be resolved uses zero.
8. **A children or threat-of-harm flag hides regardless of the bar.** Pictures of children are not permitted (F080), and a threat of harm cannot wait on a score, so no bar setting may leave either up.
9. **A report cannot be sent without a reason the reporter chose.**
10. **Before sending, the reporter is told that misusing reports has consequences: each report Don rejects is a strike, and after three, that person's reports stop hiding anything and go to his queue.**
11. **Every string in the report path, to reporter and poster alike, is kind and gracious** — Don: *"help us all be good to one another."* Wording is Don's ([public-is-draft]).

## Not this

A public-facing appeals board or an SLA promise. Building the classification logic itself (Code's implementation detail). Bulk actions on the queue (F079). Per-category bars — one number per metro until volume shows one is not enough. Raising the bar automatically from volume or time: it moves when Don moves it.

## Why

### A bar that starts at zero

**Don rejected a fixed confidence number (2026-09-27), because the right bar depends on volume.** At launch there are few members and fewer reports; hiding on every report costs almost nothing, because a person can look at all of them. With more people the same rule buries the queue, and the bar has to rise. **One constant cannot be right at both ends, so the bar is data on the metro, not a number in code** — and metros open at different times with different volume, which is why it is per metro rather than global.

**This keeps the 2026-09-13 hide-on-report ruling intact at launch rather than softening it.** #220 asked Don to confirm a trade: dropping hide-on-report for below-bar content. With the bar at zero there is no below-bar content, so the trade does not happen at launch. It happens only when Don raises a metro's bar — a deliberate act, per metro, with the volume in front of him.

### When the bar rises (2026-09-30)

**When Don's daily review runs past 30 minutes**, he raises that metro's bar. His time is the signal, not a queue size or a count, because his time is what a buried queue costs.

### Threat of harm (2026-09-30)

Don delegated what a credible threat is to Cowork. **A seventh category, not a score threshold inside one**, so the text to Don doesn't wait on a confidence number, and the reporter can name it directly.

### Misuse (2026-09-30)

**We don't currently share a misusing reporter's identity with the person they reported** (Don, 2026-09-30): it would make the platform a party to a dispute between members. Three strikes is the consequence. Revisit later.

**Unresolvable metro uses zero** so the fallback leans toward hiding, not toward leaving something up.
