---
purpose: Untriaged eval-suite regressions/obsolete specs surfaced during T095 verification — not T095-caused; for atomize to decompose into backlog items.
layer: how
status: inbox
---

# Eval-suite hygiene — surfaced during T095 (2026-06-03)

Three pre-existing issues found while running the full Playwright suite for T095. None are T095-caused (T095 touched member privacy + item attribution only). Surfaced for triage; do not bundle with T095.

- **F018 (`evals/features/F018-brian-declares-run-club.spec.ts`) — all 6 beats fail: `/test/reset?seed=f018` returns 404; the test-seed endpoint does not exist in source.** Early scaffold spec never wired to a reset endpoint. Decide: implement a gated `/test/reset` seed route, or retire/rewrite the spec to self-seed via fixtures.
- **F030 (`evals/features/F030-newcomer-signs-up-and-lands-in-feed.spec.ts`) — fresh signup→onboarding beat fails at step 3 (`onboarding-interests` never renders); returning-member beat passes.** Onboarding interests step; spec byte-identical to main, no T095 onboarding code. Repro + fix the onboarding step-3 render, or quarantine the beat.
- **F001–F005 (map/registration/share/report specs) — obsolete: depend on a `markets` table removed in the primitives rebuild (`supabase/seed-markets.sql` errors `relation "markets" does not exist`).** Retire or rewrite against the current places/groups/items model.
