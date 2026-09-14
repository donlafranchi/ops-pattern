---
id: F078
title: Flagged content hides itself immediately, and the poster is told why
status: approved
date: 2026-09-14
depends: [F058, F077]
approved: 2026-09-14 — Don's ruling
---
## Story

A photo gets reported. An agent reads the report and the content, tags a category and a confidence score, and — at or above the disallowed bar — hides it right then, no human in the loop yet. The poster gets a message within seconds: what was hidden, and why, in plain words. If they think it's wrong, they write back explaining themselves; that explanation is the only thing that reaches a person. Nothing they don't contest ever costs staff a minute.

## Acceptance

1. A submitted report triggers agent classification: category (harassment, nudity, spam, violence, children, other) and a confidence/severity score.
2. At or above the disallowed bar, the content is hidden automatically — the same mechanism F058's Remove-photo control uses, triggered by the agent, not a person.
3. The poster is notified immediately, in-app (never email), with the specific category and a plain-language reason.
4. The poster can submit one explanation; submitting is the only thing that creates work for a person — an unanswered takedown stays hidden and closes itself.
5. Credible-threat or children-category flags text Don's phone (SMS) immediately regardless of confidence; everything else queues in a mobile review view for whenever he's free.
6. Below the disallowed bar, nothing happens automatically — it still lands in the same queue for an unhurried look.

## Not this

A public-facing appeals board or an SLA promise. Building the classification logic itself (Code's implementation detail). Bulk actions on the queue (F079). The stronger verification tier that would ever let children-content be allowed (F080).
