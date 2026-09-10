---
id: why-verbs
purpose: The verb × noun matrix — what each verb may do to each noun, and what it deliberately may not.
layer: why
status: active
---

# The verbs

> **Superseded in part by [`model.md`](model.md) (2026-09-10).** Don restated the model directly: there are no Items, and a post carries a time or it doesn't. The conflicts below are known and unfixed — this document has not yet been reconciled. Where the two disagree, `model.md` is right.

A verb is not one rule — it's a rule per noun it acts on. Following a Page, a person, and a venue are three different things. The forbidden column is the point: a verb list says what you can do, the matrix says what you can't and why — that's the discipline that stopped "selling" from quietly acquiring business-ness.

**●** built · **○** specced or ruled, unbuilt (includes postponed) · **✕** deliberately forbidden · **—** meaningless

| | Person | Page | Gathering | Product / Service | Venue | Announcement | Idea |
|---|---|---|---|---|---|---|---|
| **Create** | ● signup | ● | ● | ● | ● | ○ | ○ composer undesigned |
| **Edit** | ○ no editor yet | ● F056, save is publish | ○ | ○ | ○ | ✕ post is final | ○ |
| **Publish** | — | ● activate | ● | ● | — | ● = posting | ○ |
| **Retire** | ○ account delete | ○ | ○ | ○ | — | ✕ | ○ expires 90 days |
| **Follow** | ● F032 | = Join, by design | ✕ not a concept | ✕ not a concept | ● a saved search | — | — |
| **Respond** | — | — | ○ F063, RSVP | ○ | — | ○ one reaction | ○ = signal interest |
| **Join / leave** | — | ○ rules exist, CTA not yet built | — | — | — | — | — |
| **Appear at** | — | ○ Page-level | ● item-level | ● item-level | — | — | — |
| **Take down** | — | ○ F058 | ○ F058 | ○ F058 | — | ✕ | ○ |
| **Volunteer** | — | ○ postponed, a reply on the board | ○ postponed, needs the reply channel | — | — | — | — |
| **Message** | ○ postponed, no substrate | ○ postponed, inside a Page (ruled 2026-09-09) | ✕ | ✕ | ✕ | ○ reply = board increment one | ✕ |

*Signal acts on a category or an unbuilt feature — neither is a noun in this model, so it has no row and no foreign key (F064). Signal interest is a different verb: its subject is an Idea, a real row.*

## The forbidden cells, with reasons

- **Follow a product or service.** Ruled 2026-09-07 — people don't follow products. Removed as a concept, not deferred.
- **Edit or delete an announcement after posting.** A broadcast rewritable after people read it isn't a broadcast.
- **Rename an active Page's slug.** The name may change; the address doesn't follow it — a moved public URL is a broken link someone already shared.
- **Overlapping appearances.** A Page can't be in two places at once.
- **Message anyone, about anything, at large.** Replaced 2026-09-09 by the message-board ruling: conversation is forbidden between people at large, available inside a Page you've joined. No messages, threads, or comments exist anywhere in the product today — postponed with a settled shape, not refused. Why the cell stays forbidden while the board is built: `messaging-problem.md`.
- **A follow granting membership, role, read access, or satisfying any "is this person part of this Page" check.** F065.

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
