---
id: F080
title: No pictures of children, from anyone
status: approved
date: 2026-09-14
depends: [F077]
approved: 2026-09-14 — Don's ruling
amended: 2026-09-27 — Don: there is no stronger verification and none is being built, so there is no unlock. The same day he defined the rule: no pictures of children, full stop. A photo rule, not a topic rule. Where it is detected is open, below.
---
## Story

Maya runs a Saturday kids' craft table at the farmers market. She writes a post about it — ages, times, what to bring — and it publishes like any other. She goes to add a photo from last week, and it shows the children at the table. That photo cannot go up: not for her, not for anyone, at any standing. A photo of the table and the finished crafts can. Nothing unlocks pictures of children — no tier, no request — and nothing is being built that would.

## Acceptance

1. **No image containing a child is published, by any member.** "Published" means visible to anyone other than the uploader: a photo on an active Page, a photo added to an active Page, a Page activated with photos from its draft.
2. **Text is not in scope.** A Page, post or description about a children's activity publishes normally; only an image containing a child is refused.
3. **No toggle, setting, tier, request or workaround allows it**, for any member. None exists and none is planned; allowing it later needs a new ruling, not a configuration change.
4. A published image reported as containing a child is caught by F078: a children-category flag hides at any bar (F078 criterion 8) and texts Don.

## Not this

Any rule about text, topics, or Pages that serve children. Building any verification tier. Building an automated image classifier — none exists in the repo; whether to build one is part of the open question below.

## Why

### Open — Don rules: where is it detected?

**Nothing in the repo can see what is in a picture.** Every Page photo goes through one path (`src/lib/media/upload-image.ts`, used by `PagePhotoPicker` and `update-draft.ts`), which uploads **from the browser to a public bucket and returns a public URL** at upload time. So criterion 1 needs a detection point, and today it can only be a person or the uploader's own word.

| | **Where** | **Consequence** |
|---|---|---|
| **A · Human review before visible** | Every photo holds until Don (or whoever he names) looks | Real enforcement. Every photo waits on a person; publishing stops being instant. Feasible at launch volume, a queue later. Needs a held state the upload path lacks — the file is at a public URL the moment it uploads. |
| **B · Uploader attests, per photo** | At upload: *"This photo has no children in it"* | No delay, no staff time. Checks nothing; relies on the uploader and on reports (criterion 4). A picture of a child is public until someone reports it. |
| **C · One attestation, then reports** | Once, in F082's step | Cheapest. Weakest: a one-time promise cannot speak for photos not yet taken, and it misses anyone uploading who never took F082's step. |
| **D · Automated image check** | At upload | Not in the repo; would be built or bought. Its false positives refuse ordinary photos, and today there is no recourse for a refused upload. |

**Upload versus publish.** Enforcing only at publish leaves an uploaded draft photo at a public, unlisted URL until then. Enforcing at upload closes that but means every upload is checked, including ones never published. **Photos added to an active Page are published at upload**, so for them the two points are the same.

**Not a builder's call.** Until Don rules, wire nothing that claims to detect; the report backstop (criterion 4) is the only enforcement that exists.

*(#221 carries this question. F082's step is discussed as a home for it in F082 § Why.)*
