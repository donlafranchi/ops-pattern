---
purpose: Decide whether to implement /test/reset seed route or retire the F018 eval spec
layer: how
status: done
source: eval-suite-hygiene-post-t095.md (atomized 2026-06-21)
resolution: Option B chosen 2026-06-21 — F018 spec retired; F034 fixture-based eval supersedes it. No /test/reset route built.
---

# Decision: F018 eval seed route

**Question:** F018 eval (`evals/features/F018-brian-declares-run-club.spec.ts`) — all 6 beats fail because `/test/reset?seed=f018` returns 404. The test-seed endpoint was never wired.

**Options:**
- **A:** Implement a gated `/test/reset` seed route (useful for all future evals that need deterministic state).
- **B:** Retire the F018 spec and rewrite it to self-seed via fixtures (matches the F030–F042 eval pattern).

**Recommendation:** B — the fixture pattern is proven across F030–F042. F018 is a pre-rebuild spec.
