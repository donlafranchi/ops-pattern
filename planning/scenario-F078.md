---
id: F078
title: Flagged content hides itself immediately, and the poster is told why
status: approved
date: 2026-09-14
depends: [F058, F077]
approved: 2026-09-14 — Don's ruling
amended: 2026-09-27 — Don rejects a fixed confidence number. The hide bar is per-metro configuration, starting at zero — every report hides, as today — and tightens as volume grows without a code change. Criteria 2 and 6 restated, 7 and 8 added.
---
## Story

A photo gets reported. An agent reads the report and the content and tags a category and a confidence score. Whether it hides depends on where the metro's bar sits. At launch the bar is at zero, so it hides right then, whatever the score, because there are few enough reports that Don can look at every one. The poster gets a message within seconds: what was hidden, and why, in plain words. If they think it's wrong, they write back explaining themselves. Later, when reports outnumber the time to read them, the bar rises and a low-confidence report only queues.

## Acceptance

1. A submitted report triggers agent classification: category (harassment, nudity, spam, violence, children, other) and a confidence/severity score.
2. **Content hides automatically when its score is at or above its metro's hide bar** — the same mechanism F058's Remove-photo control uses, triggered by the agent, not a person. *(Amended 2026-09-27: this read "the disallowed bar", with no number and no owner.)*
3. The poster is notified immediately, in-app (never email), with the specific category and a plain-language reason.
4. The poster can submit one explanation; submitting is the only thing that creates work for a person — an unanswered takedown stays hidden and closes itself.
5. Credible-threat or children-category flags text Don's phone (SMS) immediately regardless of confidence; everything else queues in a mobile review view for whenever he's free.
6. Below the bar, nothing happens automatically — it still lands in the same queue for an unhurried look. **At the launch value nothing is below the bar.**
7. **The hide bar is configurable per metro without a migration or a deploy**, the way F076 criterion 11 makes the waitlist thresholds — a value on the metro, changed as data. **Its starting value is zero: every report hides, exactly as the 2026-09-13 hide-on-report behaviour does today.** Content whose metro cannot be resolved uses zero.
8. **A children-category flag hides regardless of the bar.** Pictures of children are not permitted (F080), so no bar setting may leave one up.

## Not this

A public-facing appeals board or an SLA promise. Building the classification logic itself (Code's implementation detail). Bulk actions on the queue (F079). Per-category bars — one number per metro until volume shows one is not enough. Raising the bar automatically from volume: it moves when Don moves it.

## Why

### A bar that starts at zero

**Don rejected a fixed confidence number (2026-09-27), because the right bar depends on volume.** At launch there are few members and fewer reports; hiding on every report costs almost nothing, because a person can look at all of them. With more people the same rule buries the queue, and the bar has to rise. **One constant cannot be right at both ends, so the bar is data on the metro, not a number in code** — and metros open at different times with different volume, which is why it is per metro rather than global.

**This keeps the 2026-09-13 hide-on-report ruling intact at launch rather than softening it.** #220 asked Don to confirm a trade: dropping hide-on-report for below-bar content. With the bar at zero there is no below-bar content, so the trade does not happen at launch. It happens only when Don raises a metro's bar — a deliberate act, per metro, with the volume in front of him.

**Unresolvable metro uses zero** so the fallback leans toward hiding, never toward leaving something up.
