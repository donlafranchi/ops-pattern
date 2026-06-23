---
purpose: Fix or quarantine F030 eval beat where onboarding interests step never renders
layer: how
status: draft
source: eval-suite-hygiene-post-t095.md (atomized 2026-06-21)
---

# Decision: F030 onboarding interests render failure

**Issue:** F030 eval — fresh signup→onboarding beat fails at step 3 (`onboarding-interests` never renders). Returning-member beat passes. Spec is byte-identical to main; not caused by T095.

**Options:**
- **A:** Debug and fix the onboarding step-3 render issue (likely a timing/hydration issue).
- **B:** Quarantine the beat until F036 eval re-run addresses it.

**Note:** This may resolve itself during the F036 eval re-run since forward-deps have since merged.
