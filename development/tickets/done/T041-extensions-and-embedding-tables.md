---
purpose: Ticket T041 — extensions and embedding tables.
layer: how
status: reference
---

# T041 — Postgres extensions + embedding tables (Phase 0 floor — pgvector, postgis)

**Scenario:** `planning/rebuild-plan.md` § Phase 0 — AI-native floor
**Status:** Complete *(build-side; runtime verification pending `pipeline-eval` run-mode against `web/evals/phase-0/floor.spec.ts`)*
**Completed:** 2026-05-11T04:19:28+00:00
**Bundle:** b1
**Depends on:** none

**Serves:**
- **Loop:** All five loop families (substrate). Phase 0 has no user-visible surface; this ticket installs the database substrate every later loop reads from or writes to.
- **Canonical example:** All — every later canonical-example surface (Run Club, Oak Park Sourdough, Cafe Capricho's successor, Aaron's fish drop, Concerts in the Park) depends on PostGIS for proximity and reserves pgvector for T3 semantic surfaces.
- **Primitive shape:** None directly. Reserves embedding-vector substrate for future Item + Member embedding rows (per `item.md` AI/LLM section and `member.md` T3).

## Workflow gates (mandatory during the rebuild phase per `CLAUDE.md` § Rebuild phase — special rules)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode) is called.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies; this ticket touches the migration sequence on a merge to main.
- [ ] **DEVIATIONS.md entry** appended at ticket close — even one line saying "no deviations." Empty is no longer the default.

## Pre-step (mandatory — runs before any new migration lands)

The rebuild plan places this wipe in Phase 1, but the existing `web/supabase/migrations/001_initial_schema.sql` through `006_rollup_vendor_stats.sql` collide with Phase 0's new 001–006 numbering. The wipe has to happen first.

- [ ] Delete all existing files under `web/supabase/migrations/` (currently: `001_initial_schema.sql`, `002_markets_and_follows.sql`, `003_foundational_schema.sql`, `004_system_runs.sql`, `005_bulletin_mutes.sql`, `006_rollup_vendor_stats.sql`). Verify with `ls web/supabase/migrations/` — directory should be empty after.
- [ ] `supabase db reset` runs cleanly against the empty migrations directory (development DB is wiped).
- [ ] No app code under `web/src/` is touched in this ticket — Phase 1+ tickets handle code deletion of routes / business-logic / components that referenced the old schema. T041 is migrations only.
- [ ] DEVIATIONS.md entry records: "T041 absorbs Phase 1 pre-step (migrations wipe) because the new 001 series collides with the legacy 001 series. Rebuild plan ordering bug — flagged."

## Acceptance Criteria

- [ ] `web/supabase/migrations/001_extensions.sql` created. Body:
  - [ ] `create extension if not exists vector;`
  - [ ] `create extension if not exists postgis;`
- [ ] `web/supabase/migrations/004_item_embeddings.sql` created. Defines `item_embeddings` with columns `item_id uuid not null`, `model_version text not null`, `embedding vector(1536) not null`, `created_at timestamptz not null default now()`. Composite PK on `(item_id, model_version)`. **No FK to `items` at this point** — the `items` table does not exist yet (lands in Phase 1 T-TBD). Add a note in the SQL that the FK is added when the items spine lands.
- [ ] `web/supabase/migrations/005_member_embeddings.sql` created. Mirrors `004` for Members: `member_id uuid not null`, `model_version text not null`, `embedding vector(1536) not null`, `created_at timestamptz not null default now()`. Composite PK on `(member_id, model_version)`. No FK to `members` yet (Phase 0 T042 lands `members` after this).
- [ ] No `embedding_id` columns added to `items` / `members` in this ticket — those are reserved per the rebuild plan and added by the Phase 1 schema-floor tickets when those tables exist.
- [ ] `supabase db reset` runs cleanly with these three migrations applied.
- [ ] `select extname from pg_extension where extname in ('vector','postgis');` returns both rows.
- [ ] `\d item_embeddings` and `\d member_embeddings` show the columns above with `vector(1536)` type.
- [ ] BUILD-LOG.md updated.

## Notes

This is the cheapest, most independent ticket in Phase 0 — pure DDL, no app-code coupling. Land it first so T042 (members floor) can be developed against a database that already has pgvector and PostGIS enabled (later Phase 1 migrations will add `geography(Point, 4326)` columns and PostGIS GIST indexes).

**Why split the embedding tables into separate migrations** (vs. lumping into `001`): future tier T3 may evolve the embedding-row shape per primitive independently (e.g., `model_version` semantics, multi-model rows). Keeping the per-primitive migration boundary now makes that evolution clean.

**Why no FK to `items` / `members` in the embedding tables yet:** the rebuild plan numbers migrations 001 → 006 (Phase 0) before 007+ (Phase 1's full schema). The embedding tables are reserved substrate; their FK constraints land alongside the Phase 1 ticket that creates the parent tables, OR T042 (members) adds the FK from `member_embeddings.member_id` once `members` exists. Document this in the migration body so the FK addition isn't forgotten.

**Per ADR-10:** these tables do not write event-log rows (they're substrate, not action-layer outputs). No `*_events` partition needed.

No RLS policies in this ticket — embeddings are server-side substrate. RLS lands when T3 ships an embedding-write surface, not before.

## Completion

Date: 2026-05-10
Commit: `923d2ef` (web repo)

**What landed:**
- Wiped six legacy migrations: `001_initial_schema.sql`, `002_markets_and_follows.sql`, `003_foundational_schema.sql`, `004_system_runs.sql`, `005_bulletin_mutes.sql`, `006_rollup_vendor_stats.sql`.
- Wrote three Phase 0 migrations: `001_extensions.sql` (pgvector + postgis), `004_item_embeddings.sql` (composite PK on `(item_id, model_version)`, `vector(1536)`, deferred FK comment), `005_member_embeddings.sql` (composite PK on `(member_id, model_version)`, `vector(1536)`, deferred FK comment).
- Wrote build-side tests: `web/tests/migrations-phase-0.test.ts` — 15 file-shape assertions (file count + correct legacy wipe + per-migration body checks). All passing.
- DEVIATIONS.md: two entries (migrations wipe absorbed into Phase 0; deferred FKs on embedding tables).

**What the user must run locally to close the loop:**
1. `cd web && supabase db reset` — applies the three new migrations against a fresh dev DB.
2. `npm test -- migrations-phase-0` — confirms the file-shape suite still passes on darwin (sandbox ran via plain node because of native-binding mismatch).
3. `pipeline-eval` run-mode against `web/evals/phase-0/floor.spec.ts` — the T041 portion (`Postgres extensions + embedding tables` describe block) should pass once the build-agent test helpers (`eval_pg_extensions`, `eval_table_shape`) are provisioned by T042+ work.
