---
id: F067
title: A follower and a member are different things
status: draft
date: 2026-09-10
depends: [F065]
---
## Story

Today "follower" and "member" mean the same thing in the code, and the PM wants the words in place before the behavior diverges. A customer who follows a bakery is called a follower; someone who joins a run club is called a member — same row, one new column, and today neither gains any access the other doesn't already have.

## Acceptance

1. **Privacy decides which relationship is written**: a private Page is joined as `relationship: 'member'`, anything else is followed as `relationship: 'follower'`. One query serves both. *(Amended 2026-09-15, Don. The original keyed this on `kind` — business = follower, group = member. Superseded: a bakery and a run club can both be open to anyone, and what differs is whether the thing is closed, not what sort of thing it is.)*
2. **The Page's owner can see who follows it, by name.** Nobody else can: not a member of the Page, not another follower, not a stranger (Don, 2026-09-30). *(Amended 2026-09-15, Don. The original made the follower list visible to nobody, including the business's own visitors, except as a count where it earns its place — that is superseded: knowing who follows you is the point of being followed.)*
3. A social group's current members are visible to each other; members who left are not.
4. Neither relationship affects any authorization or role check — both hold every guard rail F065 already established.

## Not this

Converting one relationship into the other. Any benefit members get that followers don't — this column makes that cheap later, it isn't this scenario.
