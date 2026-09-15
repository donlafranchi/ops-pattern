---
id: F060
title: Someone starts something without opening a shop
status: building
date: 2026-09-10
depends: [F057]
---
## Story

Priya convenes a Tuesday run; she's never sold anything. Today the only path to hosting is opening a shop first. At the create control she's asked one question — "What are you starting?" — makes/sells or hosts — never asked to classify herself as a business. She names it, sets where and when, and it's live under her own name. Later, wanting to sell singlets, she starts a second Page; the run club is untouched.

## Acceptance

1. A Member with no Page can create a hosted gathering with no business record and no document, ID, or ZIP check. F082's one-time self-attestation is the only thing that precedes it, and it is not a check. *(Amended 2026-09-14 — this read "no ZIP/verification step," which forbade F082 for hosts.)*
2. `/you/create`'s first question is what they're starting, not what they are — no self-classification anywhere in the flow. F082's attestation is a claim about the thing and its locality, made once before this flow, never a class the member picks. *(Clarified 2026-09-14.)*
3. No form field or string in the flow collects or shows entity type, formation date, or legal/tax language.
4. Starting a second Page is one tap from the end of the first, and leaves the first unchanged.
5. `/you/sell` redirects to `/you/create` preserving any query string.

## Not this

The business-claim surface itself. Converting one Page into another — rejected outright, not deferred. The standing/activity badge (paused).
