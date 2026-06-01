---
purpose: Landed and rescinded SPEC-PATCH entries from the b1.x-spec-drain-sprint.
layer: how
status: archived
retired_from: planning/SPEC-PATCHES.md
---

# Spec patches landed during b1.x-spec-drain-sprint

Archive of the four patches drained by `explore` during the 2026-05-27 sprint. Open queue lives at `planning/SPEC-PATCHES.md`.

## Landed

- **SPEC-PATCH-0001** · 2026-05-19 · `product/systems/item.md` § State machine — `items.state` enum reconciled to `draft / published / withdrawn / fulfilled / closed`. Landed 2026-05-27 (4fed43f).
- **SPEC-PATCH-0002** · 2026-05-1x · `product/systems/member.md` § Delegations — partial-index predicate matched to T050 shipped (`where revoked_at is null` only). Landed 2026-05-27 (4fed43f).
- **SPEC-PATCH-0004** · 2026-05-27 · ADR-21 drift sweep — four sites rewritten to ADR-21 substrates (`member_place_interests` / `member_saved_searches` / `member_business_jurisdictions` + `zip_is_proximal_to_location`). Landed 2026-05-27 (4fed43f).

## Rescinded

- **SPEC-PATCH-0003** · 2026-05-1x · Rescinded 2026-05-27 — superseded by ADR-0021. Targets referenced text and identifiers ADR-21 retired; genuine drift captured under SPEC-PATCH-0004.
