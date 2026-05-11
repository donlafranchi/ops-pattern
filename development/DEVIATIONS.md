# DEVIATIONS.md — Implementation Drift Log

When implementation diverges from spec, log it here with context.

**Format:**

```markdown
## {Date} — {Ticket} — {Title}

**Deviation:** {What differs from spec}

**Reason:** {Why}

**Impact:** {What changes for downstream?}

**Escalation:** Escalated to {Planning / Product}

**Resolution:** {How was it resolved?}
```

(Log entries as they occur)

## 2026-05-10 — T041 — Migrations wipe absorbed into Phase 0 (rebuild-plan ordering bug)

**Deviation:** The rebuild plan (`notes/migration-to-primitives.md`) places the "drop all existing migrations" pre-step in Phase 1, but the existing `web/supabase/migrations/001_initial_schema.sql` through `006_rollup_vendor_stats.sql` collide with Phase 0's new 001–006 numbering. T041 cannot land its migrations without the wipe happening first.

**Reason:** The rebuild plan was drafted before the new 001–006 numbering was finalized. The plan's Phase 1 pre-step language ("drop all existing migrations") logically must precede Phase 0's first migration; the placement in Phase 1 is a sequencing oversight.

**Impact:** T041 now performs the migrations-directory wipe as an explicit first pre-step before writing 001_extensions.sql / 004_item_embeddings.sql / 005_member_embeddings.sql. The development database must be reset (`supabase db reset`) after T041's pre-step. No app code under `web/src/` is touched in T041 — Phase 1+ tickets handle code deletion of routes / business-logic / components that referenced the legacy schema.

**Escalation:** Flagged for `pipeline-plan` to amend the rebuild plan's section ordering when convenient. The work itself is unblocked.

**Resolution:** T041 pre-step deletes the six legacy migration files. T041's three new migrations land in their place. The Phase 0 invariant spec at `web/evals/phase-0/floor.spec.ts` is the runtime oracle; the build-side file-shape assertions are in `web/tests/migrations-phase-0.test.ts` (15/15 passing 2026-05-10).

## 2026-05-10 — T041 — No FK to items/members on embedding tables (deferred)

**Deviation:** `item_embeddings.item_id` and `member_embeddings.member_id` are declared as plain `uuid` columns at Phase 0, without foreign-key constraints to `items(id)` / `members(id)`.

**Reason:** The rebuild plan numbers Phase 0 migrations 001–006 before Phase 1's full schema (007+ for items/members augmentation). The `items` table does not exist until Phase 1's items-spine ticket. T042 lands the minimal `members` table immediately after T041; the `member_embeddings` FK could be added by T042 or deferred to Phase 1 alongside the items FK addition.

**Impact:** Embedding-row inserts are technically possible without a parent row at Phase 0. Acceptable because (a) no embedding-write surface ships at b1 — these tables are reserved substrate; (b) the FK lands before any T3 embedding pipeline runs.

**Escalation:** None — recorded for traceability. The deferred FK addition is documented inline in both migration files as a `-- alter table ... add constraint ...` comment block.

**Resolution:** FK constraints added by the Phase 1 ticket that creates `items` (for item_embeddings) and either T042 or the Phase 1 members-augmentation ticket (for member_embeddings).

