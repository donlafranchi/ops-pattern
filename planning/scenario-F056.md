---
id: F056
title: A producer edits a shop that already exists
status: approved
date: 2026-09-10
depends: [F061]
approved: 2026-09-07 — Gate A/B cleared; values statement cut per PM ruling
---
## Story

Maya's shop has a name and one product, but nothing she can change once the walkthrough ends. From You, she taps Edit shop: one page, four fields — image, name, about, and a self-written "what we stand for" line the platform does not source or infer. She saves once; her public shop page updates immediately.

## Acceptance

1. An owner can edit shop image, name, about, and a free-text values line from one prefilled page.
2. Only an active owner can save; the write runs through a named handler with its event row.
3. The values-statement column has no source/provenance field — nothing but the owner's own edit can write it.
4. The shop has a ≤120-char tagline separate from the long description, rendering on card/profile/link-preview.
5. A shop with every optional field empty still renders correctly, with nothing nagging about the absence.

## Not this

Member profile editing (`/m/[handle]`). A values vocabulary or picker — free text only. Any consumer reaction to the declaration.
