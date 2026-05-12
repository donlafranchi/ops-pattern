# T050 — Agent-assistance substrate (`012_member_agent_assistance.sql`)

**Scenario:** `notes/migration-to-primitives.md` § Phase 1 — Member surface (`007g_member_self_records.sql` + `007h_member_delegations.sql` in the plan; consolidated into `012_*`).
**Status:** Open
**Bundle:** b1
**Depends on:** T047 (`members` augmentation), T042 (`member_events` for the via_delegation_id FK retrofit), T045 (`location_events` for the via_delegation_id FK retrofit).

**Serves:**
- **Loop:** None directly at b1 — substrate only. All five loop families indirectly, because every write that flows through the action layer is audited via `acting_member_id` + `via_delegation_id` per ADR-6. This ticket closes the audit-field circle.
- **Canonical example:** Agent assistance is parked per `product/foundation/agent-assistance.md`; the substrate tables let future Member-owned context (`assistant-context.md`) and delegated agent surfaces (`delegation.md`) land without retrofit. The substrate exists at b1 even though no surface reads it yet.
- **Primitive shape:** Person → self-context-document; Person → Delegation → Skill / scoped capability. No shell entity.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

### Migration `web/supabase/migrations/012_member_agent_assistance.sql`

**`public.member_self_records` (per `member.md` line 351; the Member-owned context substrate):**

- [ ] `member_id uuid primary key references public.members(id) on delete cascade`
- [ ] `document jsonb not null default '{}'::jsonb`
- [ ] `scratch_or_full text not null default 'scratch' check (scratch_or_full in ('scratch','full'))`
- [ ] `updated_at timestamptz not null default now()`
- [ ] Updated-at trigger reusing `public.update_updated_at_column()`.
- [ ] RLS enabled. Policies:
  - [ ] `member_self_records_owner_read` — `for select using (member_id = auth.uid())`.
  - [ ] `member_self_records_owner_update` — `for update using (member_id = auth.uid())`.
  - [ ] No INSERT/DELETE policy — action-layer-only.
- [ ] **No bootstrap trigger.** A row is created only when a Member opts into agent assistance (b2+ surface). Members who never engage with the surface have zero rows here. This is the only Member-related table at b1 that intentionally has no row-per-Member at signup.

**`public.member_delegations` (per `member.md` line 360; the scoped permission grants):**

- [ ] `id uuid primary key default gen_random_uuid()`
- [ ] `member_id uuid not null references public.members(id) on delete cascade`
- [ ] `grantee_label text not null check (char_length(grantee_label) between 1 and 120)`
- [ ] `scopes text[] not null check (array_length(scopes, 1) >= 1)` — at least one scope required; the controlled vocabulary lives in the action layer.
- [ ] `granted_at timestamptz not null default now()`
- [ ] `expires_at timestamptz`
- [ ] `revoked_at timestamptz`
- [ ] `metadata jsonb not null default '{}'::jsonb`
- [ ] Index `idx_delegations_member_active on public.member_delegations (member_id) where revoked_at is null and (expires_at is null or expires_at > now())` (per `member.md` line 371). Note: this is a predicate-on-`now()` index — Postgres won't use it efficiently for time-bounded queries because the partial index predicate is evaluated at INSERT time, not query time. **Pattern decision: drop the `expires_at > now()` part of the WHERE clause; index on `(member_id) where revoked_at is null` only.** Query-time `expires_at` filter is applied by the action layer.
- [ ] Replacement index per the above note: `idx_delegations_member_active on public.member_delegations (member_id) where revoked_at is null`.
- [ ] RLS enabled. Policies:
  - [ ] `member_delegations_owner_read` — `for select using (member_id = auth.uid())`.
  - [ ] No public-read policy — delegations are private substrate.
  - [ ] No INSERT/UPDATE/DELETE policy — action-layer-only writes.

**FK retrofits on existing event-log tables — close the via_delegation_id circle (per T042's DEVIATIONS):**

- [ ] `alter table public.member_events add constraint member_events_via_delegation_fkey foreign key (via_delegation_id) references public.member_delegations(id) on delete set null not valid;` then `alter table public.member_events validate constraint member_events_via_delegation_fkey;`. T042 reserved the column without FK; this ticket fills it in.
- [ ] Same retrofit for `public.location_events.via_delegation_id` from T045 — `alter table public.location_events add constraint location_events_via_delegation_fkey foreign key (via_delegation_id) references public.member_delegations(id) on delete set null not valid;` then `validate`.

### Tests / build-side assertions

- [ ] `web/tests/migrations-t050.test.ts` — file-shape suite (~22 assertions: directory state has 012, member_self_records shape + RLS + updated_at trigger + no bootstrap trigger, member_delegations shape + scopes-array CHECK + simplified partial index (no `now()` predicate) + RLS owner-read + no public-read + no I/U/D, two FK retrofits on event-log tables with `not valid` + `validate` pattern).
- [ ] Sandbox `node` smoke run matches Vitest suite.
- [ ] `supabase db reset` runs cleanly with all eleven migrations.
- [ ] Studio smoke verification (after build):
  - [ ] `select count(*) from public.member_self_records;` — returns 0 (no bootstrap).
  - [ ] `select count(*) from public.member_delegations;` — returns 0.
  - [ ] `select indexdef from pg_indexes where indexname = 'idx_delegations_member_active';` — confirms WHERE clause is `(revoked_at IS NULL)` only, no `now()` predicate.
  - [ ] `select conname from pg_constraint where conrelid = 'public.member_events'::regclass and contype = 'f' and conname like '%via_delegation%';` — confirms the FK retrofit landed.
  - [ ] Same for `public.location_events`.
- [ ] BUILD-LOG.md updated.

## Notes

**Schema-spec divergence — partial index predicate.** `member.md` line 371 declares the partial index with `expires_at is null or expires_at > now()` in the WHERE clause. Postgres evaluates partial-index predicates at INSERT time, not query time — so a row inserted today with `expires_at = today + 1 day` is in the index, but tomorrow when `now()` has advanced past `expires_at`, the row is still in the index until the next INSERT recomputes (which it won't, for that row). The predicate is misleading at best, incorrect at worst.

The fix: drop the time predicate; index on `(member_id) where revoked_at is null` only. The action layer applies the `expires_at` filter at query time. Slightly larger index, but correct.

Record in DEVIATIONS at close. If `member.md` should be updated, hand back to `pipeline-product`.

**`scopes` is a text[] not a separate join table.** `member.md` line 364 declares `scopes text[]`. The controlled vocabulary (`item.read`, `item.create.draft`, `item.publish`, etc. per `delegation.md`) is enforced by the action layer's `member.delegation.grant` handler, not by the schema. The handler rejects any scope not in the published enum. Trade-off: stable additive enum updates require no migration; the cost is no DB-level enforcement of the enum. This matches the `member_interests.tag` pattern.

**No bootstrap for `member_self_records`.** Most Members will never opt into agent assistance at b1. Auto-creating a row per Member would create N empty rows for no purpose. Pattern: row exists when the Member writes to it; absent otherwise. The action handler `member.self_record.update` does the insert-or-update.

**Why retrofit the FKs here.** T042's `via_delegation_id` column was reserved without FK because `member_delegations` didn't exist yet. T045's `via_delegation_id` for the same reason. This ticket lands `member_delegations`, so both FKs can now point at it. Doing the retrofit in the same migration keeps the audit-field promise (ADR-6) atomic — the moment `member_delegations` exists, the FK constraints are live.

**`on delete set null` on the FK retrofits.** A revoked delegation should not cascade-delete the event-log rows that reference it (those are append-only per ADR-10). Setting `via_delegation_id` to null preserves the event row with the audit field's truth that "this write was originally delegated but the delegation has been hard-deleted." Hard delete of a delegation row is admin-only per the soft-delete model; b1 won't actually hard-delete any.

**Event log entries — none added in this ticket.** `member.delegation_granted` / `member.delegation_revoked` / `member.self_record_updated` are already in T042's `member_events` enum. No event-log shape changes needed.

**Numbering.** Rebuild plan numbered these `007g_member_self_records.sql` + `007h_member_delegations.sql`. Consolidated to `012_member_agent_assistance.sql` because (a) Supabase CLI rejects alpha-suffixed numbering, (b) the two tables ship together and gate each other's FK retrofits on event-log tables. Record in DEVIATIONS at close.

## Completion

Date:
Commit:
