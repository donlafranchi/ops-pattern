---
purpose: Retire or rewrite F001–F005 eval specs that depend on the removed markets table
layer: how
status: done
source: eval-suite-hygiene-post-t095.md (atomized 2026-06-21)
resolution: Retired 2026-06-21 — F001–F005 spec files deleted from web/evals/features/.
---

# Decision: Retire F001–F005 eval specs

**Issue:** F001–F005 (map/registration/share/report specs) are obsolete — they depend on a `markets` table removed in the primitives rebuild (`supabase/seed-markets.sql` errors `relation "markets" does not exist`).

**Recommendation:** Retire. These are pre-rebuild specs. The features they tested have been redesigned and re-evaluated under F030–F042. Delete the spec files and remove from the eval runner.
