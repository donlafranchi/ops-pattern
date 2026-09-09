---
purpose: Scenario — the moderation answer that arrives with photo upload. A member reports something; the operator can actually remove an image. Extends v1 workstream 9 rather than replacing it, and is a hard precondition for F055.
layer: how
status: approved
---

# F058: A member reports an image, and the operator can actually take it down

**Bundle:** b1 (SocialUs v1)
**Sub-bundle:** v1 workstream 9 (general report path) + workstream 10 (photo upload)
**Work-map item:** `bundle-1.md` § What ships in v1 — workstream 9. **This scenario states what upload adds to it and why it can no longer slip.**
**Loops:** 11 (Steward what we built) — the community-health side; a place people can report to is part of what makes a place liveable.
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the ordinary browsing member is who encounters this.
**Primitive shape:** Person → report → operator. **No new primitive.** A report is a message to the operator, not a declaration and not a vote.
**Spec contract:** `decision-producer-values-declaration.md` § 3 (*What v1 gets instead: a general report path*) · `decision-photo-upload.md` §§ 4 (A2), 5.1 · `decision-business-identity-impersonation.md`
**Status:** next — **approved 2026-09-07.** Gate B cleared: both upload absolutes ratified in `policy.md` § Uploaded images; the values-sourcing absolute dropped as moot with the feature.

> **The dependency moved on 2026-09-07 and got sooner.** Item photos are deferred; **Page photos ship first**, in [F061](scenario-F061-someone-creates-a-page-worth-showing-people.md). The takedown commitment is unchanged, so **no photograph of any kind is accepted in production until this report path is live.**
>
> **Boundary:** this scenario owns the **report path** (the control, the sheet, the table, the operator's route) and photo removal on **Items**. **F061 owns photo removal on Pages** — different table, different event log. F061 adds no reporting surface of its own. Bucket is `media`, not `item-media`. See [`review-F058.md`](review-F058.md).

## Why this is a dependency, not a companion

`bundle-1.md` calls the report path *"the smallest item here and the only one whose absence has no workaround."* Both halves are still true. What changed on 2026-09-04 is that its absence now blocks something else.

**A public local application that accepts member-uploaded images will eventually receive one that should not be there.** The answer *"the operator handles it via the report path"* is a legitimate answer for a solo operator, and it is the answer this scenario adopts. But it is only true if the operator **can** — and today they cannot. There is no report path, no `item.update`, no `item.delete`, no storage delete, and no admin surface. Removing one photograph currently means connecting to Postgres by hand and then to the storage API by hand.

> **A2 (`decision-photo-upload.md` § 4): the platform never serves an image it cannot take down. A takedown path exists before the first upload is accepted.**

**F055 cannot ship before this does.** That is the single largest consequence of the scope change and it should be stated before anything else about the schedule.

## The Person

Two people, in sequence.

**Rae** is browsing the Sunday feed and taps a listing. The photograph on it is not of a product. It is not obviously illegal and it is not obviously spam; it is just wrong to have on a neighbourhood app, and it is the kind of thing that makes someone quietly stop opening an app.

**The operator** — the founder, on a phone, on a Saturday. They get one message. They need to look at the thing and remove the picture, in under a minute, without a laptop and without SQL.

## The Story

Rae taps the small **⋯** at the bottom of the listing. One item in the menu: **Report to the operator.**

A short sheet: a line saying *"This goes to a person, not a queue. Tell us what's wrong in your own words."* A text area. Optionally, a one-line reason. **Send.**

The sheet closes. A brief confirmation: *"Sent. Thanks — someone will look."* Nothing about the listing changes. There is no counter, no flag, no visible state, and the producer is not told. Rae can report the same thing again and nothing about the interface treats her differently.

The operator gets it wherever reports go. They open the listing on their phone, and — because they are signed in as the operator — the listing carries one control the producer's own page does not: **Remove photo.** They tap it. They confirm. The image is gone from the card, gone from the page, and the object is deleted from storage. The listing itself is untouched.

## Surfaces

- **Entry point:** a discreet **⋯** on Item detail pages and producer shop pages.
- **Primary action:** free-text report → the operator.
- **Operator action:** **Remove photo** on any Item, visible only to the operator.
- **Completion:** the reporter gets a confirmation; the operator gets the report; the image can be removed in one action.
- **Discovery:** none. **No public counter, no visible state, nothing the reported party or any other member can see.**

## Data Captured

| Field | Where | Notes |
|---|---|---|
| Report body | **new** `reports` table — reporter member id, subject (item or group id), free text, optional light reason, created_at | **Not** the vendor-era `reports` table from the pre-rebuild schema; that one is in the deletion sweep. Same name, new shape, new lineage. |
| Photo removal | `items.photo_url` → null; storage object deleted | Via a new `item.remove_photo` handler, emitting an `item_events` row in the same transaction. |

**Free text with a light reason, not a fixed taxonomy** — the ratified shape. At this density the operator learns more from what people write than from categories guessed in advance; a taxonomy, if ever warranted, is derived from the free text rather than invented ahead of it.

## Acceptance Criteria

### Any member can reach the operator from the thing they are looking at

**Given** a signed-in member on an Item page or a producer shop page
**When** they open the **⋯** menu
**Then** a report affordance is present, opens a free-text form, and sends. _Why: there is currently **no channel at all** for a member to tell the operator anything. That gap exists from the first user, not the thousandth, and it does not scale into existence the way a voting signal does. It is also the front door to the impersonation path that `decision-business-identity-impersonation.md` flagged as needed and unscoped._

### A report changes nothing anyone can see

**Given** a submitted report
**When** any member — including the reported producer — views the reported thing
**Then** nothing differs. No counter, no badge, no flag, no ordering change, no notification to the producer. _Why: a visible report state is a brigading vector on a small local business, and it converts a private message to the operator into a public act. The asymmetry argument that deferred the oppose control applies here in full._

### The operator can remove a photo in one action, on a phone

**Given** the operator, signed in, on any Item page
**When** they use **Remove photo** and confirm
**Then** `items.photo_url` is nulled through a named action handler, the storage object is deleted, the materialized view refreshes, and the card falls back to the kind glyph. The Item itself is not deleted, not unpublished, and not otherwise altered. _Why: this is **A2's entire cost** and it is the difference between a stated moderation answer and a hope. Removing the photo rather than the listing is the proportionate action for the common case: the listing is usually fine and the picture is not. Confirming rather than one-tapping matters because this control appears on every Item the operator browses._

### Only the operator sees the removal control

**Given** any member who is not the operator — including the Item's own owner
**When** they view the Item
**Then** the control is absent, and a direct call to the handler is rejected. _Why: absence in the UI is not authorization. This is the project's first operator-privileged write and it sets the pattern for every later one — the check belongs in the handler._

### The report goes somewhere a person reads

**Given** a submitted report
**When** it is stored
**Then** it is also delivered to the operator's named destination, and the destination is recorded in the runbook. _Why: **the ship condition, restated because it is the part that gets skipped.** A report channel nobody answers is worse than no report channel — it teaches members that telling the operator anything is pointless, and that lesson is expensive to unlearn. This is an operating commitment from the PM, not an engineering task, and it gates the workstream._

### Removal is recorded

**Given** a photo removal
**When** it completes
**Then** an `item_events` row records it with `acting_member_id` set to the operator. _Why: same-transaction row+event is binding on every write (`bundle-1.md` § Non-negotiable data-model commitments), and a moderation action is exactly the kind of write that has to be reconstructable later._

## Edge Cases

- **Anonymous reporting** — not v1. Report requires sign-in. The trade is stated: a signed-in-only channel misses the visitor who has not converted, and an anonymous one is a spam surface with no rate-limit substrate behind it.
- **Repeat reports of the same thing** — stored as separate rows. No dedupe, no counter. The operator sees three messages and draws the obvious conclusion.
- **Report volume** — at v1 density this is a handful of rows. No queue UI, no triage, no assignment.
- **Removing a photo from an Item whose producer then re-uploads it** — nothing prevents this in v1. The escalation (suspend the Item, suspend the Member) does not exist and is not v1. **Stated as a known limit, not solved.**
- **A soft-deleted Item's image** — the file stays publicly fetchable at its URL (`decision-photo-upload.md` § 5.4). **Removal via this path deletes the object; deleting the listing does not.** These behave differently and the copy must not imply otherwise.
- **Accessibility** — M3 fires: a new form and a new menu. The **⋯** needs a real accessible name (*"More options"*), the sheet needs focus management and an escape, and the confirmation needs a live region.

## Assumptions

- **The PM has named the report destination and a rough response commitment.** This is a ship condition, it is unnamed as of 2026-09-04, and it now gates two workstreams instead of one. **It is the only blocker on this scenario that is not engineering.**
- The operator is identifiable in the system. **Not verified** — there is a seeded System Member for platform-emitted events, but no operator role. The ticket must resolve how the operator is recognized before the privileged control is built; a hardcoded member id is an acceptable v1 answer if it is written down as one.
- `item_events` and the same-transaction event helper are shipped. **Verified.**

## Out of Scope

- **Automated image classification.** Not at this density, not with this budget.
- **A moderation queue, triage, assignment, or a dashboard.** The operator reads messages.
- **Appeals, strikes, suspensions, bans.** No enforcement ladder in v1.
- **Hash matching or known-content detection.**
- **Removing a producer's shop image** — the same handler shape applied to `group_businesses.image_url`. **Small, and deliberately deferred**: shop images are far less likely to be the first problem, and the Item path is the one that gates F055. Add it if F056 lands first.
- **Producer-side photo editing.** A producer cannot change a photo after publish in v1 ([F055](scenario-F055-producer-puts-a-photo-on-what-they-sell.md) § Out of Scope). The operator's removal path is not a general edit path and must not become one by accident.
- **Reporting anything other than an Item or a shop** — members, comments, messages. No surfaces for those exist yet.

## Capabilities unlocked

- **Community health** — the first channel from a member to the operator, at all, in any context. Covers bad actors, impersonation, and ordinary feedback with one small feature.
- **The precondition for photo upload.** Without this, the platform serves user-supplied images with no way for anyone to say so and no way for anyone to act.
