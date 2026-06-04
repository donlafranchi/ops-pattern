---
id: spec-patch-2026-06-01-locality-step-substrate
purpose: Spec patch — T073 acceptance line 36 contradicts review-F036 on locality substrate.
layer: how
status: open
filed: 2026-06-01
caught_by: T073
deviation_pointer: 2026-06-01 — T073
target_spec: development/tickets/T073-*.md
target_section: § Acceptance line 36 + review-F036.md § cross-system consistency
---

# Locality step writes `member_business_jurisdictions` row contradicts review

**What's wrong:** T073's acceptance line 36 says step 4 writes a `member_business_jurisdictions` row, but review-F036.md § cross-system consistency states "F036 does NOT need that substrate." Two sources of truth diverged.

**The fix:** Pick one. Implementation chose UI-only at b1 (substrate ships with F037). Either rewrite T073 line 36 to match the UI-only b1 path, or revise the review to acknowledge the substrate dependency.

**Caught by:** T073 during build

**Deviation pointer:** [`development/deviations/T073.md`](../../development/deviations/T073.md) § 2026-06-01 entry
