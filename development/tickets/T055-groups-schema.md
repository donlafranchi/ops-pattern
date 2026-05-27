---
purpose: Ticket T055 — groups schema.
layer: how
status: active
---

# T055 — Phase 1: Groups schema (`014_groups.sql`)

**Scenario:** None. Phase 1 substrate — opens against `product/systems/groups.md` + ADR-13 + ADR-10 (event-log invariants) + ADR-7 (action-layer conformance) + ADR-6 (audit fields).
**Status:** Build complete; closed 2026-05-19
**Bundle:** b1 (Phase 1 substrate — Group primitive at T1 scope per `b1-primitives-plan.md`).
**Depends on:** T042 (members), T045 (locations — `anchor_location_id` FK).

**Serves:**
- **Loops:** 1 (Find your people), 4 (Gather regularly), 7 (Make and be found) — all Group-mediated discovery.
- **Primitive shape:** Group is the third primitive after Person + Item + Location. T1 surface ships full schema; surface composers ship at Phase 2.
- **Absolutes encoded** (per the Phase 1 absolutes audit, 2026-05-19): (a) family-kind defaults `discoverability='private'`; (b) Groups never auto-assigned (encoded by `group_memberships.source` enum + absence of any auto-membership-write trigger); (c) soft membership is query-time only (encoded by handler refusal at Phase 2; `source='soft_via_*'` rows are reserved at b1 substrate but written only via explicit user action); (d) `discoverability` gates RLS for anon reads.

## Workflow gates (mandatory during the rebuild phase)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI).
- [ ] **M4 — `engineering:deploy-checklist`** — **MANDATORY** (Phase 1+ migration).
- [ ] **DEVIATIONS.md entry** appended at close.

## What ships

**One migration file:** `web/supabase/migrations/014_groups.sql`.

Five tables + one view, in this order so the FKs resolve:

1. `public.groups` — spine.
2. `public.group_businesses` — child for `kind='business'`.
3. `public.group_event_anchored` — child for `kind='event_anchored'`. `seeded_by_item_id` reserved as nullable FK to items; the FK constraint adds at T056 (items) since items doesn't exist yet.
4. `public.group_memberships` — join table.
5. `public.group_events` — partitioned monthly per ADR-10.
6. `public.member_has_standing_presence` — view returning Member IDs with active business membership OR steward role in any non-business Group.

**Action handlers do NOT ship in this ticket.** Per the established Phase 1 pattern (T045–T053 shipped schema only; conformance passes trivially since no writers exist outside the action layer), Group handlers ship with their Phase 2 surface composer tickets (`/g/new`, the kind='business' Group walkthrough, etc.). T055 ships substrate only.

## Schema spec

### `public.groups` (spine)

```sql
create table public.groups (
  id                  uuid          not null default gen_random_uuid() primary key,
  name                text          not null,
  slug                text          not null unique,
  kind                text          not null
                                    check (kind in (
                                      'place','interest','practice',
                                      'event_anchored','family','business'
                                    )),
  anchor_location_id  uuid                   references public.locations(id) on delete set null,
  parent_group_id     uuid                   references public.groups(id)    on delete set null,
  founder_member_id   uuid          not null references public.members(id),
  description         text          not null default '',
  discoverability     text          not null
                                    check (discoverability in ('listed','unlisted','private')),
  metadata            jsonb         not null default '{}'::jsonb,
  established_on      date,
  dormant_at          timestamptz,
  dissolves_at        timestamptz,
  dissolved_at        timestamptz,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now()
);
```

**Default discoverability per kind** — enforced by a BEFORE INSERT trigger (the absolute-encoding for family-private default):

```sql
create or replace function public.groups_default_discoverability()
returns trigger language plpgsql as $$
begin
  if NEW.discoverability is null then
    NEW.discoverability := case NEW.kind when 'family' then 'private' else 'listed' end;
  end if;
  return NEW;
end $$;

create trigger trg_groups_default_discoverability
  before insert on public.groups
  for each row execute function public.groups_default_discoverability();
```

Per the absolute audit: the trigger is the encoding. The column-level default cannot vary by `kind`, so the trigger fills `discoverability` when `null` is passed at insert time. Apps that pass an explicit value (e.g., a Member opting their `family` Group `unlisted`) override the default.

**Indexes:**
- `idx_groups_kind_listed` on `(kind)` where `dissolved_at is null and discoverability='listed'` — the `/g` browse index.
- `idx_groups_anchor_active` on `(anchor_location_id)` where `dissolved_at is null` — Location → anchored Groups lookup.
- `idx_groups_founder` on `(founder_member_id) where dissolved_at is null` — Member's Groups lookup.

**`updated_at` trigger** — reuses `public.update_updated_at_column()` per the existing project pattern.

### `public.group_businesses`

```sql
create table public.group_businesses (
  group_id            uuid          not null primary key
                                    references public.groups(id) on delete cascade,
  display_name        text          not null,
  public_description  text          not null default '',
  legal_entity_kind   text                   check (legal_entity_kind in ('llc','sole_prop','partnership','other')),
  state_of_formation  text,
  formed_at           date
);
```

### `public.group_event_anchored`

```sql
create table public.group_event_anchored (
  group_id           uuid          not null primary key
                                   references public.groups(id) on delete cascade,
  seeded_by_item_id  uuid                   -- FK to items added in T056 (items doesn't exist yet)
);
```

File header documents the deferred FK; T056 will execute:
```sql
alter table public.group_event_anchored
  add constraint group_event_anchored_seeded_by_item_fkey
  foreign key (seeded_by_item_id) references public.items(id) on delete set null;
```

### `public.group_memberships`

```sql
create table public.group_memberships (
  group_id              uuid          not null references public.groups(id)  on delete cascade,
  member_id             uuid          not null references public.members(id) on delete cascade,
  role                  text          not null
                                      check (length(role) between 1 and 60),
  source                text          not null default 'explicit'
                                      check (source in ('explicit','soft_via_follow','soft_via_attendance')),
  joined_at             timestamptz   not null default now(),
  left_at               timestamptz,
  confirmed_by_member_id uuid                  references public.members(id) on delete set null,
  confirmed_at          timestamptz,
  primary key (group_id, member_id)
);
```

Role-per-kind validation is enforced **in the action handler at Phase 2**, not in schema (allows the same row to outlive role-vocabulary evolution). At b1, role values that the handlers will write are: `'steward'` and `'member'` for community kinds; `'owner'`, `'staff'`, `'member'` for `kind='business'`.

**Indexes:**
- `idx_memberships_member_explicit_active` on `(member_id, group_id)` where `left_at is null and source='explicit'` — addressability lookup.
- `idx_memberships_group_role_active` on `(group_id, role)` where `left_at is null` — roster.
- `idx_memberships_group_active` on `(group_id)` where `left_at is null` — count active members.

### `public.group_events` (partitioned monthly per ADR-10)

```sql
create table public.group_events (
  id                 uuid          not null default gen_random_uuid(),
  group_id           uuid          not null references public.groups(id) on delete cascade,
  event_kind         text          not null
                                   check (event_kind in (
                                     'group.created',
                                     'group.member_joined',
                                     'group.member_left',
                                     'group.role_changed',
                                     'group.steward_transferred',
                                     'group.dormant',
                                     'group.dormancy_extended',
                                     'group.revived',
                                     'group.dissolved'
                                   )),
  payload            jsonb         not null default '{}'::jsonb,
  acting_member_id   uuid          not null references public.members(id) on delete restrict,
  via_delegation_id  uuid                   references public.member_delegations(id) on delete set null,
  created_at         timestamptz   not null default now(),
  primary key (id, created_at)
) partition by range (created_at);
```

Audit fields per ADR-6. `via_delegation_id` FK lands inline (member_delegations exists as of T050).

**Indexes** (per ADR-10's pattern from member_events / location_events):
- `idx_group_events_group` on `(group_id, created_at desc)`.
- `idx_group_events_acting` on `(acting_member_id, created_at desc)`.

**Partition rotation** — mirror the existing `ensure_*_events_partition` / `rotate_*_events_partitions` pair pattern. Seed current + next-2 months on migration apply.

**RLS** — public-read on `group_events` is rejected (per the locations / members pattern). Auth-self read via `acting_member_id = auth.uid()` OR via membership in the Group.

### `public.member_has_standing_presence` (view)

```sql
create or replace view public.member_has_standing_presence as
  select distinct m.id as member_id
  from public.members m
  join public.group_memberships gm on gm.member_id = m.id and gm.left_at is null
  join public.groups g            on g.id = gm.group_id  and g.dissolved_at is null
  where (g.kind = 'business' and gm.role in ('owner','staff'))
     or (g.kind <> 'business' and gm.role = 'steward');
```

View definition follows `groups.md` § standing tier. Underlying tables' RLS still applies.

## RLS policy matrix

For each table, the policy set:

### `public.groups`

- `groups_select_listed` — `for select using (discoverability = 'listed' and dissolved_at is null)`.
- `groups_select_member` — `for select using (id in (select group_id from public.group_memberships where member_id = auth.uid() and left_at is null))`.
- `groups_select_founder` — `for select using (founder_member_id = auth.uid())`.
- **No INSERT/UPDATE/DELETE policies** — action-layer-only per ADR-7.

### `public.group_businesses`, `public.group_event_anchored`

Mirror parent visibility:
- `<child>_select_via_parent` — `for select using (group_id in (select id from public.groups))` (RLS on `public.groups` cascades the visibility set).

### `public.group_memberships`

- `memberships_select_self` — `for select using (member_id = auth.uid())`.
- `memberships_select_member_of_group` — `for select using (group_id in (select group_id from public.group_memberships where member_id = auth.uid() and left_at is null))`.
- `memberships_select_listed_group` — `for select using (group_id in (select id from public.groups where discoverability = 'listed' and dissolved_at is null) and left_at is null and source = 'explicit')` — `/g/[slug]` page can show the public roster for listed Groups; private/unlisted Group rosters are members-only.

### `public.group_events`

- `events_select_self_acting` — `for select using (acting_member_id = auth.uid())`.
- `events_select_member_of_group` — `for select using (group_id in (select group_id from public.group_memberships where member_id = auth.uid() and left_at is null))`.

No public-read on events per the locations / members precedent.

## Acceptance Criteria

### Migration

- [ ] New file `web/supabase/migrations/014_groups.sql` (next in sequence after `013_*`).
- [ ] File header comment block with ticket reference (T055), spec anchors (groups.md, ADR-13, ADR-10, ADR-7, ADR-6), and a note about the absolutes encoded (family default, soft-source enum, RLS shape).
- [ ] All five tables + one view created in dependency order.
- [ ] All RLS policies named and enabled.
- [ ] All indexes named per the spec.
- [ ] `updated_at` trigger on `groups` reuses `public.update_updated_at_column()`.
- [ ] BEFORE INSERT trigger on `groups` enforces the family→private default.
- [ ] Partition rotation functions + seed for current+2 months.
- [ ] `comment on table` / `comment on view` per the existing project pattern.

### Eval coverage

New file `web/evals/phase-1/groups.spec.ts` mirroring the locations.spec.ts shape:

- [ ] **Schema shape** — every table's columns + nullability + types match the spec (call `eval_table_shape` introspection RPC).
- [ ] **Six-kinds CHECK** — insert with `kind='invalid'` rejected with 23514.
- [ ] **Discoverability default** — insert `kind='family'` with `discoverability` unset → row reads back as `'private'`; same for `kind='business'` → `'listed'`.
- [ ] **Soft-source values accepted in schema** — insert with `source='soft_via_follow'` succeeds (per Absolute 2 — schema permits, handler refuses at Phase 2).
- [ ] **Standing-tier view** — insert business owner membership → view returns the Member; delete the membership → view returns zero rows; insert steward membership in a non-business Group → view returns the Member.
- [ ] **RLS matrix** — anon vs auth-self vs auth-other for listed/unlisted/private Groups; ensure private Group is invisible to non-members; ensure listed Group roster is visible to anon but private Group roster is not.
- [ ] **Event-log audit fields** — `acting_member_id` `NOT NULL`; `via_delegation_id` nullable FK to member_delegations.
- [ ] **Partition existence** — at least 3 monthly partitions exist after migration apply.
- [ ] **No public-read on events** — anon `select` returns zero rows.

### Conformance + integration

- [ ] `npm run check:action-layer` — `OK (no violations found)`. (No new writers in the action layer; the conformance check should remain trivially clean.)
- [ ] `supabase db reset && npm run eval:bootstrap && npx playwright test evals/phase-1/groups.spec.ts` — all green.
- [ ] Full `evals/phase-1/` suite continues at 80/80 + however many tests `groups.spec.ts` adds.

### Tests

- [ ] No Vitest tests required (schema-only ticket).
- [ ] Manual smoke documented in Completion section.
- [ ] BUILD-LOG.md updated.

## Notes

**Deferred FK to items.** `group_event_anchored.seeded_by_item_id` has no FK constraint at T055 because `public.items` does not yet exist. T056 (Items schema) appends the FK constraint:
```sql
alter table public.group_event_anchored
  add constraint group_event_anchored_seeded_by_item_fkey
  foreign key (seeded_by_item_id) references public.items(id) on delete set null;
```
Documenting this in both T055's migration header and T056's ticket prevents drift.

**Why no role enum.** Roles vary by kind (`owner` / `staff` / `member` for business; `steward` / `member` for community kinds). A single enum column would be a leaky abstraction; a per-kind enum would be six enums. The pattern matches `members.kind`-style typing in other primitives where the discriminator gates the vocabulary in handler code.

**Why `length(role) between 1 and 60`.** Defensive lower bound to prevent empty-string role inserts; upper bound matches similar text columns. Action handlers at Phase 2 will narrow to the valid vocabulary.

**Why no `cooperative_*` columns.** Dropped per Groups consolidation (ADR-13). Cooperative-shape coordination ships as kind='business' with multiple owner-role memberships at b1; capital-flow primitives defer indefinitely.

**Commit hygiene.** Single web commit at close. Suggested message: `T055: groups schema (014_groups.sql + groups.spec.ts)`.

## Completion

Date: 2026-05-19
Commit (web): {pending}
Commit (parent): {pending — DEVIATIONS + ticket close}

**Build outcome:**

- `web/supabase/migrations/014_groups.sql` (~340 lines) — 5 tables + 1 helper function + 1 view + RLS policies + partition rotation. Created in two passes: first attempt hit RLS recursion (SQLSTATE 42P17 — `groups_select_member` and `memberships_select_member_of_group` both queried `group_memberships`, whose own RLS triggered the same lookup). Resolved via `public.current_member_explicit_group_ids()` SECURITY DEFINER function: bypasses RLS for the membership lookup while remaining safe (filters strictly on `auth.uid()`). The function's table reference forced restructuring so it's defined after `group_memberships` exists.
- `web/evals/phase-1/groups.spec.ts` (~640 lines, 25 tests) — schema shape (5 tables), six-kinds CHECK, family-private trigger, business-listed trigger, explicit-discoverability override, all-six-kinds insert, listed/private/dissolved RLS matrix, `group_businesses` child shape, `group_event_anchored` child shape, source-CHECK enforcement, soft-source-permitted-in-schema, members-RLS matrix (private vs listed roster), partition introspection, event_kind CHECK, NOT NULL audit fields, anon-zero-rows on events, three standing-tier view cases (business owner / steward / plain member).
- `supabase db reset` → clean apply through `014_*.sql`.
- `npm run eval:bootstrap` → conformance OK.
- **`evals/phase-1/groups.spec.ts` → 25/25 green.**
- **`evals/phase-1/` full → 105/105 green** (80 prior + 25 new).
- `npm run check:action-layer` → `OK (no violations found)`. 123 files scanned; 32 protected tables.

**M2 verdict — `engineering:code-review`:** **PROCEED** (self-review). RLS recursion caught at first apply and resolved with the canonical SECURITY DEFINER pattern; helper function filters on `auth.uid()` (safe); cross-table policies use the helper consistently; partition rotation mirrors established `member_events` / `location_events` shape; absolutes encoded as designed (family-private trigger; soft-source enum reserved but not auto-written; discoverability gates RLS).

**M4 verdict — `engineering:deploy-checklist`:** **PROCEED**. Phase 1+ migration on tables that don't yet have production rows. Forward-only. Full eval suite passes. No env / secret / config changes.

**DEVIATIONS.md entry:** Appended 2026-05-19 — captures the RLS-recursion pattern (cross-table policies that subquery each other's tables → SQLSTATE 42P17) and the canonical fix (SECURITY DEFINER helper) as a going-forward rule for future tables that need cross-table membership checks.
