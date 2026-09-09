---
id: F058
title: A member reports something, and the operator can take a photo down
status: approved
date: 2026-09-10
depends: []
approved: 2026-09-07 — Gate B cleared; hard precondition for any photo upload
---
## Story

Rae sees a photo on a listing that doesn't belong on a neighbourhood app. She taps the menu, writes what's wrong in her own words, sends — no counter, no visible change, the producer isn't told. The operator, on their phone, opens the listing and sees a control the producer's own page doesn't have: Remove photo. One tap, one confirm, the image is gone.

## Acceptance

1. Any signed-in member can send a free-text report to the operator from an item or shop page.
2. A submitted report changes nothing visible to anyone, including the reported party.
3. Only the operator sees or can invoke "Remove photo"; a direct call from anyone else is rejected by the handler.
4. Removing a photo nulls the URL, deletes the storage object, and writes an event row — the listing itself survives untouched.
5. The report is actually delivered somewhere a person reads it, not just stored in a table.

## Not this

Automated image classification or a moderation queue. Appeals, strikes, or bans. Reporting anything other than an item or a shop.
