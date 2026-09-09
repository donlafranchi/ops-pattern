---
purpose: Review — F066, the bulletin verb. Verdict PROCEED; held in the draft lane, and hard-blocked on F065 regardless.
layer: how
status: draft
---

# Review — F066: a Page owner posts to its followers

**Scenario:** [`scenario-F066-a-page-owner-posts-to-its-followers.md`](scenario-F066-a-page-owner-posts-to-its-followers.md)
**Reviewer:** `review` — 2026-09-07
**Verdict:** **PROCEED — held, and blocked.**

> **Two separate reasons this is not in an approved lane, and they should not be confused.** It is **held** because the PM has not scheduled it. It is **blocked** because its audience does not exist until [F065](scenario-F065-someone-follows-something.md) ships. **Scheduling it would not unblock it.**

## Gates

**Gate A / Gate B — clear.** The absolute — *a count is the audience answering; a roster is surveillance of the audience* — is State-tagged in the scenario, Ratified 2026-09-07.

## Binding notes

### 1. The feed union is the whole cost, and it is where "just make it an Item" will get proposed

Bulletins are not Items, and the feed reads an item-shaped index. **So the feed gains a second source and a card type** — that is the two days, not the composer.

**Someone will propose making a bulletin an Item to avoid this.** It would work, it would be cheaper, and it would put announcements into a browse index narrowed to Pages and gatherings on purpose. **Record the refusal in the ticket where the union is written**, because that is where the temptation lands.

### 2. Reactions copy the pattern, not the table

`item_responses` has a foreign key to items. **Reuse the handler shape, the control, the unique-per-person constraint and the accessibility work; do not reuse the table.** The increment is small precisely because the pattern is already built.

### 3. A bulletin in a feed is a new card type and needs to not look like a listing

**The feed's job is discovery; a bulletin is not discoverable.** It appears only for followers, so a member seeing one has already chosen the relationship. **If it renders like a listing, it reads as an ad from someone they did not ask to hear from** — which is the opposite of what following means. `design:design-critique` on the card, named in the ticket.

## Architecture (M1)

- **Two small tables, no new entity, no new primitive.** The restraint is right.
- **The dependency is structural, not sequencing preference.** "Who follows this Page" has no answer today.
- **Do not add a denormalized reaction counter to the bulletin row.** The count is derived, same as item responses; a stored counter is a third copy of a number that already has two derivations elsewhere.

## Accessibility (M3)

Fires — the composer and the feed card. The reaction control follows the same toggle recipe as the other two. **The card must announce its source** ("Update from {Page}") rather than relying on visual placement to say where it came from.

## Verdict

**PROCEED**, three binding notes. **Held in `backlog/` pending PM scheduling, and blocked on F065 independently of that.**
