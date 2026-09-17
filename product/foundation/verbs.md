---
id: why-verbs
purpose: The verb × noun matrix — what each verb may do to each noun, and what it deliberately may not. Spine document: every cell carries its own status and holds both horizons, what ships now and what is intended later. The future version of a verb is a status in this matrix, never a second description elsewhere.
layer: why
status: active
---

# The verbs

> **Superseded in part by [`model.md`](model.md) (2026-09-10).** Don restated the model directly: there are no Items, and a post carries a time or it doesn't. The conflicts below are known and unfixed — this document has not yet been reconciled. Where the two disagree, `model.md` is right.

A verb is not one rule — it's a rule per noun it acts on. Following a Page, a person, and a venue are three different things. The forbidden column is the point: a verb list says what you can do, the matrix says what you can't and why — that's the discipline that stopped "selling" from quietly acquiring business-ness.

**●** built · **○** specced or ruled, unbuilt (includes postponed) · **✕** deliberately forbidden · **—** meaningless

### Index — the whole grid at a glance

*The one thing a matrix did well. Detail is in the per-verb sections below; this is for orientation only, never for citing.*

| | Person | Page | Gathering | Product / Service | Venue | Announcement | Idea |
|---|---|---|---|---|---|---|---|
| **Create** | ● | ● | ● | ● | ● | ○ | ○ |
| **Edit** | ○ | ● | ○ | ○ | ○ | ✕ | ○ |
| **Publish** | — | ● | ● | ● | — | ● | ○ |
| **Retire** | ○ | ○ | ○ | ○ | — | ✕ | ○ |
| **Follow** | ● | = Join | ✕ | ✕ | ● | — | — |
| **Respond** | — | — | ○ | ○ | — | ○ | ○ |
| **Join / leave** | — | ○ | — | — | — | — | — |
| **Appear at** | — | ○ | ● | ● | — | — | — |
| **Take down** | — | ○ | ○ | ○ | — | ✕ | ○ |
| **Volunteer** | — | ○ | ○ | — | — | — | — |
| **Message** | ○ | ○ | ✕ | ✕ | ✕ | ○ | ✕ |

## Create

- **Person** ● — signup.
- **Page** ●
- **Gathering** ●
- **Product / Service** ●
- **Venue** ●
- **Announcement** ○
- **Idea** ○ — composer undesigned.

## Edit

- **Person** ○ — no editor yet.
- **Page** ● — F056; save is publish.
- **Gathering** ○
- **Product / Service** ○
- **Venue** ○
- **Announcement** ✕ — post is final.
- **Idea** ○

## Publish

- **Person** — meaningless.
- **Page** ● — activate.
- **Gathering** ●
- **Product / Service** ●
- **Venue** — meaningless.
- **Announcement** ● — publishing *is* posting.
- **Idea** ○

## Retire

- **Person** ○ — account delete.
- **Page** ○
- **Gathering** ○
- **Product / Service** ○
- **Venue** — meaningless.
- **Announcement** ✕
- **Idea** ○ — expires 90 days.

## Follow

- **Person** ● — F032.
- **Page** — **superseded 2026-09-17.** "Following a Page and joining it are the same act" held while there was one link. There are now two, and neither is *join*: see § Support and get-updates below. Joining remains what `private` gives (§ Privacy decides the relationship).
- **Gathering** ✕ — not a concept.
- **Product / Service** ✕ — not a concept.
- **Venue** ● — a saved search.
- **Announcement** — meaningless.
- **Idea** — meaningless.

## Respond

- **Person** — meaningless.
- **Page** — meaningless.
- **Gathering** ○ — thumbs up now, four states later.
- **Product / Service** ○
- **Venue** — meaningless.
- **Announcement** ○ — one reaction.
- **Idea** ○ — signalling interest.

## Join / leave

- **Person** — meaningless.
- **Page** ○ — rules exist, CTA not yet built.
- **Gathering** — meaningless.
- **Product / Service** — meaningless.
- **Venue** — meaningless.
- **Announcement** — meaningless.
- **Idea** — meaningless.

## Appear at

- **Person** — meaningless.
- **Page** ○ — Page-level.
- **Gathering** ● — item-level.
- **Product / Service** ● — item-level.
- **Venue** — meaningless.
- **Announcement** — meaningless.
- **Idea** — meaningless.

## Take down

- **Person** — meaningless.
- **Page** ○ — F058.
- **Gathering** ○ — F058.
- **Product / Service** ○ — F058.
- **Venue** — meaningless.
- **Announcement** ✕
- **Idea** ○

## Volunteer

- **Person** — meaningless.
- **Page** ○ — postponed; a reply on the board.
- **Gathering** ○ — postponed; needs the reply channel.
- **Product / Service** — meaningless.
- **Venue** — meaningless.
- **Announcement** — meaningless.
- **Idea** — meaningless.

## Message

- **Person** ○ — postponed, no substrate.
- **Page** ○ — postponed; inside a Page *(ruled 2026-09-09)*.
- **Gathering** ✕
- **Product / Service** ✕
- **Venue** ✕
- **Announcement** ○ — reply = board increment one.
- **Idea** ✕

*Signal acts on a category or an unbuilt feature — neither is a noun in this model, so it has no entry and no foreign key (F064). Signal interest is a different verb: its subject is an Idea, a real row.*

## The forbidden cells, with reasons

- **Follow a product or service.** Ruled 2026-09-07 — people don't follow products. Removed as a concept, not deferred.
- **~~Edit or delete an announcement after posting.~~ Editing is now allowed** *(ruled 2026-09-13, Don: "they can both be edited or replaced entirely")*. The reason this line gave — *a broadcast rewritable after people read it isn't a broadcast* — **is set aside, not satisfied**; it is left visible so the rule is not re-derived from it. **Deleting is still refused** and was not ruled on.
- **Rename an active Page's slug.** The name may change; the address doesn't follow it — a moved public URL is a broken link someone already shared.
- **Overlapping appearances.** A Page can't be in two places at once.
- **Message anyone, about anything, at large.** Replaced 2026-09-09 by the message-board ruling: conversation is forbidden between people at large, available inside a Page you've joined. No messages, threads, or comments exist anywhere in the product today — postponed with a settled shape, not refused. Why the cell stays forbidden while the board is built: `messaging-problem.md`.
- **A follow granting membership, role, read access, or satisfying any "is this person part of this Page" check.** F065.

## Support and get-updates — two links, and the difference is the inbox

*(Ruled by Don, 2026-09-17.)* **"Support is a like or a follow. I don't know if there's a difference yet."** / **"There could be a get updates button. This should be in place of emails from vendors with offers etc."** / **"Where a support is perhaps a softer signal."**

**Two distinct link types between the same pair of nouns — a Member and a Page.** That is the whole point, and it is why one `relationship` value cannot carry both: a person may do either, both, or neither.

| | **Support** (the ribbon) | **Get updates** |
|---|---|---|
| What it says | *I like that this exists* | *Tell me what this Page posts* |
| Commitment | one tap, soft | a subscription |
| Inbox consequence | **none — ever** | the Page's posts, **in the app** |
| Replaces | nothing | **promotional email from businesses** |
| Built? | **○ unbuilt** — no column, no handler, no control | **● the existing `group.follow`**, minus a reader |

**Support produces no notifications. If it ever does, it has stopped being support and become a subscription** — that single test is what keeps the ribbon compatible with the not-addicting constraint instead of being a pull-back loop in softer clothing. It sits under *no engagement optimization, anywhere* and under `metrics.md`'s refusal of notification open-rate.

**Get-updates is a privacy posture as much as a feature.** Its purpose is that a Page owner reaches subscribers **without holding their email address** — which answers the hatch `messaging-problem.md` names, an organizer publishing a contact address that is *"scrapeable, not revocable."*

**Open, and Don has to settle it:** the 2026-09-08 ruling says a business *"may see its own audience"*; F067's implementation writes followers as `source = 'soft_via_follow'` so the list is unreadable **by anyone, the owner included**. *Without their email* and *without knowing who they are* are different promises.

## Privacy decides the relationship — following versus joining

*(Ruled by Don, 2026-09-15.)* **"Anything private wouldn't have followers, they have members because you can't follow something. You'd have to become a member in order to see what's in it."**

**The rule, generalised: the relationship follows from the Page's discoverability, not from its Page kind.**

- **`private` → membership only.** There is nothing public to follow, and seeing inside requires being let in. **A follow relationship on a private Page is either meaningless or a hole.**
- **`listed` → following is available.** There is something public to follow. Joining may also exist where the Page kind has a roster.
- **`unlisted` → following is available.** Someone with the link can see it, so there is something to follow; it is simply not in search.

**This is not a special case for family Pages.** Family defaults to `private` by a `BEFORE INSERT` trigger, so the rule catches it — but the rule is about the setting, and **any Page set to private loses following, whatever its kind.** F067's single `relationship` column already carries both values, which is the schema this needs.

**What it corrects:** the tools mapping in `../systems/page-kind-tools.md` assigned following to `place`, `interest`, `practice` and `event_anchored` unconditionally. **Those four default to `listed` but can be set private, and when they are, following must stop.** Following is a per-Page property, not a per-kind one.

## Who can see whom

A second matrix — visibility between people is a rule per pair, not per verb.

| Viewer → sees | Followers of a business | Members of a social group | That group's conversations |
|---|---|---|---|
| The business itself | ● its own audience, numbers only | — | — |
| Follower of a business | ✕ forbidden | — | — |
| Member of a group | — | ● current members only | allowed, when built |
| Follower of a group | — | ✕ forbidden | ✕ forbidden |
| Anyone else, anonymous included | ✕ forbidden | ✕ | ✕ |

**A business Page never shows its followers publicly, to anyone** *(ratified 2026-09-08)* — a follower list on a business is a customer list, published; the business sees its own audience, nobody else has a reason to. This is stronger than "followers don't see each other." "Group" in this table means a social group, not a business — the two are routinely blurred in older docs and are different nouns with different rules. Rules: F067.

A follower of a business is a customer, and customers aren't an audience for each other — following a bakery tells the bakery something, it doesn't put you in a room with its other customers. A member of a social group has joined something, and knowing who else is in it is most of the reason to join.

Former members: you follow a group or you don't. A member leaves, or the Page owner prunes them — a stale membership nobody's cleaned up is tolerated, not a defect. Deferred, recorded not scoped: a group creator accepting/declining members, private groups, private members — see `groups.md` § What doesn't ship at b1.
