---
id: what-qr-onboarding
purpose: Producer-generated QR for a business — an open, unscoped future capability. Platform-generated QR is ratified out.
layer: what
status: open
---

# Producer QR (open capability)

**Tier:** unscoped
**Bundle:** not b1 — likely b2 or later
**Primitive:** Group (kind='business')
**Loops served:** 7 (Make and be found), and any loop where being-findable-in-the-physical-world matters.

> **Filename note.** This file is still named `qr-onboarding.md` for the cites that point at it. The capability is no longer onboarding-shaped; `tidy` should propose the rename.

## Status — what was decided, 2026-09-03

**The platform does not generate QR codes.** Not for Items, not for joining, not for onboarding. Sharing is phone to phone: a link, copied or sent. The shipped Item-level QR-card affordance (F041) and the `/join` signup QR were removed, along with the `qrcode` dependency. Full reasoning — including the physical-world counter-argument, which was raised and is not dismissed — in [`../../playbooks/PLATFORM-PATTERNS.md`](../../playbooks/PLATFORM-PATTERNS.md) § *No platform-generated QR codes; producer-generated business QR stays open*.

**What stays open is narrower and differently shaped.** A business owner may want to generate a QR for **their own business** — a card on a noticeboard, a flyer at a stall. That is a *producer tool on the You surface*, not a platform feature: one durable subject, one owner who chose to print it, one artifact they control. It is unscoped and undesigned.

**If it is built, it is built fresh.** The retired implementation was Item-scoped and welded to the vendor-era surfaces being retired alongside it. Do not recover it from git history — treat the deleted code as unavailable, not as a starting point.

## Open question before anything is scoped

**A hashtag-style handle may be the better shareable identifier** — instead of a QR, or alongside one. Raised 2026-09-03, not decided. It opens a naming question that has not been worked through: how such a handle relates to the Member handle at `/m/[handle]` and to Group slugs, and which of the three a stranger in the physical world should be given. Resolve this before assuming QR is the answer.

## What the old capability was

Retained as context for whoever picks this up. Any Member could request a print-quality QR card for any Item they owned; it resolved to that Item's canonical kind-specific page. Shipped at F041 (T093 + T094), owner-only on the product / service / gathering pages, merged 2026-06-18, removed 2026-09-03. The vendor-booth framing it started from was already retired once, on 2026-05-10, in favour of the Item-level shape — which is itself now retired.
