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
4. Removing a photo stops every surface serving it and writes a decision row naming who decided, when, and why — the listing itself survives untouched. **The URL and the storage object are deliberately left intact, which is what makes the removal reversible.**
5. The report is actually delivered somewhere a person reads it, not just stored in a table.

6. Every decision is reversible from the item itself, at any time, by recording a new decision — never by editing or deleting the old one. The reviewer sees what happened before and who did it.

## Not this

Automated image classification or a moderation queue. Appeals, strikes, or bans. Reporting anything other than an item or a shop.

## Why

### Criterion 4 was wrong in both halves — amended 2026-09-17 *(the reversible review, #12)*

It used to read *"nulls the URL, deletes the storage object"*.

**The second half was never true.** The media bucket's delete policy is `media authenticated delete own folder` (migration 039): a member may delete their own folder and nobody else's, so the operator's key cannot remove another member's object. Nothing in this project has ever deleted photo bytes.

**The first half is now deliberately false.** Nulling `photo_url` destroyed the URL, so there was nothing to restore a removal *to* — reversibility was not a missing feature on top of that shape, it was impossible in it. Removal now sets `photo_removed_at`, exactly as hiding sets `photo_hidden_at`, and the read path refuses both. Don's clarification: *"We actually want two buttons. And perhaps a record of what happened in order to reverse."*

**The cost, recorded rather than left to be discovered:** removed content stays fetchable by anyone holding the direct storage URL, permanently. For ordinary bad content that is the right trade. For illegal content it is not, and a separate irreversible **purge** is specified in `socialus-web docs/purge-proposal.md` — not built, because it needs a storage policy migration Don should run knowingly.

### The operator is singular, and that is load-bearing

This scenario says *"the operator"* throughout, and criterion 3 turns on it. **Delegated reviewers are an amendment to this scenario, not a ticket under it** — flagged 2026-09-17 and not yet made.

### Still open: is the member told?

Criterion 2 says a *report* changes nothing visible to the reported party. **It says nothing about the outcome.** Every preset reason is written so it could be sent to the member in plain words, because a reason nobody can be told is a reason that cannot be appealed — but whether they are told is unruled and needs Don.
