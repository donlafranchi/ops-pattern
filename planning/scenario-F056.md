---
id: F056
title: A producer edits a shop that already exists
status: approved
date: 2026-09-10
depends: [F061]
approved: 2026-09-07 — Gate A/B cleared; values statement cut per PM ruling
amended: 2026-10-01 — Don: Page creation lands on the draft Page, so address, neighbourhood and tags move here from F061 (criteria 6–8).
---
## Story

Maya's shop has a name and one product, but nothing she can change once the walkthrough ends. From You, she taps Edit shop: one page, four fields — image, name, about, and a self-written "what we stand for" line the platform never sources or infers. She saves once; her public shop page updates immediately.

## Acceptance

1. An owner can edit shop image, name, about, and a free-text values line from one prefilled page.
2. Only an active owner can save; the write runs through a named handler with its event row.
3. The values-statement column has no source/provenance field — nothing but the owner's own edit can write it.
4. The shop has a ≤120-char tagline separate from the long description, rendering on card/profile/link-preview.
5. A shop with every optional field empty still renders correctly, with nothing nagging about the absence.
6. **On the draft or live Page,** an address search resolves to real coordinates with a confirming map pin before it saves; an unresolvable address refuses loudly rather than defaulting to a placeholder point. *(Moved from F061 criterion 1, 2026-10-01.)*
7. A "give a neighbourhood instead" option sits beside the address, and a neighbourhood-mode Page exposes no street address anywhere. *(Moved from F061 criterion 2.)*
8. The owner picks or creates **tags** in their own words, editable at any time; no category is offered and no free-text "Something else" field exists. A Page needs at least one tag to publish. *(Moved from F061 criterion 3.)*
9. **The owner can add an optional public business phone and optional weekly hours.** The business phone is separate from the member's private phone and shows only if the owner gives it; both show to signed-in visitors, not on the signed-out front door (Don, 2026-10-01).

## Not this

Member profile editing (`/m/[handle]`). A values vocabulary or picker — free text only. Any consumer reaction to the declaration.
