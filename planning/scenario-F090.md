---
id: F090
title: A Page carries the work its owner already does elsewhere
status: draft
date: 2026-09-18
depends: [F070]
---
## Story

Priya already posts her pottery to TikTok and Instagram every week. She is not going to post it again here. On her Page she types `priyamakes` into a field already showing `tiktok.com/@`, does the same for Instagram, and pastes the URL of her Etsy shop into a third field. Her Page now shows where else to find her. She has typed three things, once, and she never maintains any of it again.

## Acceptance

1. A Page owner can record where else their work lives from the Page edit surface, in one pass, without leaving SocialUs.
2. **The cheapest possible action from the member.** They type a handle, not a URL, into a field that already shows the prefix. Judged against: does this ask more of them than they already do elsewhere? If yes, it fails.
3. Handle validation is permissive — what each platform actually allows, never stricter. A real handle is never refused. Nothing verifies the account exists.
4. A recorded destination renders on the public Page as a link out, with the platform named.
5. Nothing on the Page depends on a third party's script, and nothing breaks visibly when a third party changes or fails.
6. Removing a destination is one action and leaves nothing behind.
7. Every rendered destination is an https URL — the value reaches an `href` on a public page, so anything else is a script injection wearing a platform label. `[member-data-disclosure]`: a destination is published only because the owner typed it, never inferred, never imported.
8. Copy names platforms in the member's words and never says "creator". `[public-is-draft]` — wording here is Don's.

## Not this

Importing content wholesale. Follower counts, like counts or any borrowed vanity metric. Anything that requires the member to maintain a second presence, or to keep anything here in step with anything there. Embedding another company's interface inside a local business's Page.

## Why

### What the platforms actually allow, checked 2026-09-18

**TikTok** supports creator profile embeds via oEmbed — follower count, likes, up to ten recent videos. Private and underage accounts cannot be embedded at all.

**Instagram does not support profile embeds via oEmbed** — posts and reels only, tokenless since June 2026. A separate Instagram Profile Embed feature exists and is reported unreliable.

**The recommendation at launch is to link out rather than embed**, and it is not about effort: a third-party script costs phone load time, puts another company's interface on a local business's Page, and breaks silently when they change it. Embedding is available for one of the two platforms and unreliable for the other, so building it now buys an inconsistent surface with a maintenance tail.

### The open choice, recorded and NOT decided

Don: *"At the very minimum I'd like to only offer TikTok and Instagram for now or we leave it open and let them paste their own URLs etc."*

**A fixed short list versus open URL paste.** A list makes the field cheap — prefix shown, handle typed — and excludes the shop, the newsletter, the personal site. Open paste accepts anything and costs the member a full URL.

**The recommendation put to Don was both:** pre-filled handle fields for TikTok and Instagram, plus one generic other-link field. **That is a recommendation, not a ruling.** `[don-decides]`.

### What this supersedes

The current social-links field takes a full `https://` URL and refuses everything else — a real handle typed into it is rejected. That is a live bug, fixed separately; this scenario is what the field becomes, not the fix.
