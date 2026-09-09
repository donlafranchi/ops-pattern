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

1. Joining a group-kind Page writes `relationship: 'member'`; following a business-kind Page writes `relationship: 'follower'` — one query serves both.
2. A business Page's followers are never visible to anyone, including the business's own visitors, except a count where it earns its place.
3. A social group's current members are visible to each other; members who left are not.
4. Neither relationship affects any authorization or role check — both hold every guard rail F065 already established.

## Not this

Converting one relationship into the other. Any benefit members get that followers don't — this column makes that cheap later, it isn't this scenario.
