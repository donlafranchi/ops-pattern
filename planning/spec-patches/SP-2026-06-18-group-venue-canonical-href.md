---
id: spec-patch-2026-06-18-group-venue-canonical-href
purpose: Spec patch — F042 follow cards link Groups/Venues by slug-only short path; canonical place-scoped hrefs need a forward place-path resolver (also fixes the Member page's non-linked Group chips).
layer: how
status: open
filed: 2026-06-18
caught_by: T108
deviation_pointer: 2026-06-18 — T108
target_spec: product/systems/location.md
target_section: § URL derivation (+ groups.md § URL, ui place-path helpers)
---

# Group/Venue hrefs use slug-only short path, not the canonical place-scoped URL

**What's wrong:** F042's unified follows reader (`web/src/lib/follows/get-member-follows.ts`) links followed Groups to `/p/g/[slug]` and Venues to `/p/l/[slug]` instead of the canonical `/p/[…place]/g/[slug]` / `/p/[…place]/l/[slug]`. This works because `/p/[...slug]` resolves Groups/Venues off the globally-unique slug alone (place path is breadcrumb context), but the URLs are non-canonical. The same gap is why the public Member page (`MemberPublicPage.tsx`) renders Group memberships as **non-linked chips** — there's no forward place-path builder.

**The fix:** Build a shared `groupHref(group)` / `venueHref(location)` helper that resolves the full place path (from `anchor_location_id` → `locations.place_id` → `places` ancestors, once `locations.place_id` has a population path — see `SP-2026-06-02-places-msa-code` / location.md place_id patch). Then point both the follow cards and the Member-page Group chips at it. Until then the slug-only short path is the accepted interim.

**Caught by:** T108 during build.
