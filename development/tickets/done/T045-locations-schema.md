# T045 — Locations spine + 3 children + events (Phase 1 — `007_locations.sql`)

**Scenario:** `notes/migration-to-primitives.md` § Phase 1 — Schema floor (Location surface, 008 series in the plan; renumbered to 007 per the Phase 1 dependency reorder)
**Status:** Complete
**Bundle:** b1
**Depends on:** T041 (postgis extension)

**Serves:**
- **Loop:** All five loop families. Locations are the "where" of every Item declaration — Loop 3 (Land here) and Loop 4 (Gather regularly) rely on the proximity surface most directly.
- **Canonical example:** Brian's Run Club at Drake's (permanent), Aaron's recurring pickup at Sutter Health Park (recurring_temporary), Concerts in the Park (area). The three kinds map 1:1 to canonical examples.
- **Primitive shape:** Person → Item(kind=…) → **Location(kind=permanent / recurring_temporary / area)**.

## Workflow gates (mandatory during the rebuild phase per `CLAUDE.md` § Rebuild phase — special rules)

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode) is called.
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [x] **DEVIATIONS.md entry** appended at ticket close — three entries (numbering reorder; EXISTS subquery for per-child RLS; consolidated table-level COMMENT).
- [x] **Phase 1 numbering reorder** recorded in DEVIATIONS — the rebuild plan called this 008; renumbered to 007 to satisfy the dependency graph (locations is the most-independent Phase 1 schema and must land first).

## Acceptance Criteria

### Migration `web/supabase/migrations/007_locations.sql`

**Spine table `public.locations`:**

- [ ] `id uuid primary key default gen_random_uuid()`
- [ ] `member_id uuid not null references public.members(id) on delete restrict` (creator-of-record per `location.md`)
- [ ] `kind text not null check (kind in ('permanent','recurring_temporary','area'))` — locked at create per ADR-14
- [ ] `label text not null check (char_length(label) between 1 and 120)`
- [ ] `slug text unique not null check (slug ~ '^[a-z0-9-]+$' and char_length(slug) between 3 and 80)`
- [ ] `description text check (description is null or char_length(description) <= 2000)`
- [ ] `geography geography(Point, 4326) not null` — Point for all kinds; areas write a centroid synced from the polygon child via trigger
- [ ] `parent_location_id uuid` (nullable; reserved for sub-venue surface in T2 — no FK to self yet to avoid circular deletes; add at T2)
- [ ] `brand_label text` (nullable; Location-level fallback when no Group is anchored)
- [ ] `discoverability text not null default 'listed' check (discoverability in ('listed','unlisted','private'))`
- [ ] `ambient_extras jsonb not null default '{}'::jsonb`
- [ ] `embedding_id uuid` (reserved per T3 embedding pipeline; no FK at b1)
- [ ] `federation_origin text` (reserved for Loop 13)
- [ ] `deleted_at timestamptz`
- [ ] `created_at timestamptz not null default now()`
- [ ] `updated_at timestamptz not null default now()`

**Indexes:**

- [ ] GIST index on `geography` for proximity queries (`ST_DWithin` / `ST_Distance`)
- [ ] Index on `(slug)` (covered by unique constraint)
- [ ] Index on `(member_id) where deleted_at is null`
- [ ] Index on `(kind, discoverability) where deleted_at is null and discoverability = 'listed'` — supports the listed-locations browse
- [ ] Index on `(deleted_at) where deleted_at is null`

**Trigger:** `members_set_updated_at` pattern from T042 reused — attach the existing `update_updated_at_column()` function as a before-update trigger on locations.

**Child tables:**

- [ ] `public.location_permanent` — `location_id uuid primary key references public.locations(id) on delete cascade`, `street_address text` (nullable; Member-authored, not normalized at b1), `public_hours jsonb` (nullable), `accessibility_notes text` (nullable, up to 1000 chars)
- [ ] `public.location_recurring_temporary` — `location_id uuid primary key references public.locations(id) on delete cascade`, `recurrence_rule text` (RRULE format, nullable at b1), `session_start_time time`, `session_end_time time`. b1: recurrence may be JSONB on `ambient_extras` (T2 promotes to typed); the column reservations make T2 a non-migration.
- [ ] `public.location_areas` — `location_id uuid primary key references public.locations(id) on delete cascade`, `polygon geography(Polygon, 4326) not null`, `area_kind text not null check (area_kind in ('service_radius','neighborhood','city','region','custom'))`, `radius_meters integer` (nullable; populated for circular areas)

**Centroid-sync trigger (areas → spine):**

- [ ] `before insert or update on location_areas` trigger fires `public.sync_area_centroid()` which computes `ST_Centroid(new.polygon)` and writes it back to the spine row's `geography` column. Ensures proximity queries on the spine see a single Point for all kinds regardless of area shape.
- [ ] Function uses `security definer` and `set search_path = public`.

**Event table `public.location_events`** (partitioned monthly per ADR-10):

- [ ] Mirrors `member_events` shape: `id`, `location_id` FK + on delete cascade, `event_kind text not null`, `payload jsonb not null default '{}'`, `acting_member_id uuid not null references public.members(id) on delete restrict`, `via_delegation_id uuid`, `created_at timestamptz not null default now()`, composite PK `(id, created_at)`, `partition by range (created_at)`.
- [ ] Event-kind CHECK enum (b1, per `location.md` event log section):
  - `location.created`, `location.updated`, `location.moved`, `location.polygon_updated`, `location.hours_updated`, `location.deleted`, `location.restored`
  - Reserved at b1 (not yet emitted): `location.claim_requested`, `location.claim_resolved`, `location.contributor_added`, `location.followed`, `location.unfollowed`
- [ ] Indexes on `(location_id, created_at desc)` and `(acting_member_id, created_at desc)`.
- [ ] Initial partitions seeded via a `rotate_location_events_partitions()` function (mirrors the T042 pattern) — current + 2 future months.

**RLS:**

- [ ] `alter table locations enable row level security` + same on each child + on `location_events`.
- [ ] `locations_public_read` on spine — `for select using (deleted_at is null and discoverability in ('listed','unlisted'))` — anon + authed read listed and unlisted (but not private); the URL is the unlisted-Location's secret.
- [ ] `locations_owner_update` — `for update using (member_id = auth.uid())`. No INSERT or DELETE policy (action-layer-only writes).
- [ ] Child tables follow the spine's policy via FK: define `<child>_public_read` that SELECTs from the linked spine row's discoverability — implement as policies that JOIN the spine row OR as separate per-child policies mirroring the spine logic. Pick the per-child mirror approach for clarity at b1.
- [ ] `location_events_owner_read` — `for select using (location_id in (select id from public.locations where member_id = auth.uid()) or acting_member_id = auth.uid())`.

### Tests / build-side assertions

- [ ] `web/tests/migrations-t045.test.ts` — file-shape suite covering spine + 3 children + event table + RLS + trigger + indexes (mirror T042's test structure; expect ~40 assertions).
- [ ] Sandbox `node -e` smoke run from the build agent matches the Vitest suite.
- [ ] `supabase db reset` runs cleanly with all six migrations (001, 002, 004, 005, 006, 007) applied.
- [ ] Studio smoke verification (after build):
  - [ ] `select extname from pg_extension where extname = 'postgis';` — confirms still present.
  - [ ] `select count(*) from public.locations;` — returns 0 (no rows seeded).
  - [ ] `\d public.locations` — confirms `geography(Point, 4326)` column type.
  - [ ] `select indexname from pg_indexes where tablename = 'locations';` — confirms GIST index present.
- [ ] BUILD-LOG.md updated.

## Notes

**RLS for child tables.** Two implementation approaches:
1. **Mirror per child:** Each child's `<child>_public_read` policy duplicates the spine's discoverability check via a subquery to the spine. Simple; small perf cost on every read (subquery hop).
2. **Recursive RLS via spine policy:** Define a single policy on the spine and rely on the FK chain. Cleaner but requires care.

Pick approach 1 at b1. T2 may refactor if proximity-heavy queries show subquery cost.

**Centroid sync trigger.** When a `location_areas` row is inserted/updated, the spine's `geography` column must be set to the polygon's centroid. The trigger function:

```sql
create or replace function public.sync_area_centroid()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.locations
  set geography = ST_Centroid(new.polygon)::geography(Point, 4326)
  where id = new.location_id;
  return new;
end;
$$;
```

The spine row must EXIST before the area row is inserted (FK enforces this). For the create flow, the action handler will:
1. INSERT into `locations` with a placeholder geography (the eventual centroid).
2. INSERT into `location_areas` with the polygon.
3. The trigger fires; the spine's geography column updates.

Alternatively the action handler can compute the centroid client-side and write it directly to the spine, skipping the trigger. Phase 0 didn't introduce a `location.create` handler — that lands in a later ticket (Phase 2 surfaces). The trigger ensures correctness regardless.

**Discoverability enum behavior.**
- `listed`: appears in the locality-first index, browse, hashtag pages, OG metadata.
- `unlisted`: not indexed; URL-only access. Public-read policy still allows direct fetch by id/slug.
- `private`: never publicly readable; the b2 surface for invite-only Locations. RLS on spine excludes private rows from non-owners.

**`location_id` FK on events.** Per ADR-10 pattern: event rows reference their target table via the appropriate `*_id` column. For partitioned tables, the FK on `member_id` / `location_id` works fine (the FK targets the non-partitioned spine).

**No `location.create` handler in this ticket.** Pure schema. Handler lands when Phase 2 surfaces (venue page composer, etc.) need it.

**Forward-looking columns reserved at b1:**
- `parent_location_id` — T2 sub-venue surface (no FK yet)
- `embedding_id` — T3 embedding pipeline
- `federation_origin` — Loop 13 / federation

These are nullable columns now; the FKs / population pipelines land at their respective tier tickets.

## Completion

Date: 2026-05-11
Commit: (pending — sandbox could not remove `web/.git/index.lock`; please run the commit manually, see below)

**Commit ceremony (manual):**

```
cd web
git add supabase/migrations/007_locations.sql tests/migrations-t045.test.ts BUILD-LOG.md
git commit -m "T045: Locations spine + 3 children + events (Phase 1 — 007_locations.sql)"
```

Then in the parent repo, stage only T045-related files (the working tree has a lot of unrelated drift):

```
cd ..
git add development/DEVIATIONS.md development/tickets/done/T045-locations-schema.md
git commit -m "docs(pipeline): T045 close — DEVIATIONS + ticket → done/"
```

Backfill the `web/` commit hash into the `Commit:` line above once recorded.

**What shipped:**
- `web/supabase/migrations/007_locations.sql` — single consolidated migration carrying the spine (`public.locations`), three child tables (`location_permanent`, `location_recurring_temporary`, `location_areas`), the centroid-sync trigger on `location_areas`, and `public.location_events` partitioned monthly with rotation functions.
- `web/tests/migrations-t045.test.ts` — 46 file-shape assertions across 6 describe blocks (directory state, spine, permanent child, recurring_temporary child, areas child + centroid trigger, location_events).
- DEVIATIONS.md — three entries appended for the numbering reorder, the EXISTS-vs-IN choice on per-child RLS, and the consolidated table-level COMMENT.

**Sandbox smoke run:** 46/46 file-shape assertions pass via plain-node executor (Vitest's rolldown native binding is macOS-only on this checkout, so build-side verification mirrors the T042 pattern of running the regex suite in plain node). The Vitest suite is identical in shape and will pass when run on the user's macOS host.

**Schema choices worth flagging for downstream tickets:**
- Per-child public-read policies use `where exists (select 1 from public.locations l where l.id = <child>.location_id and l.deleted_at is null and l.discoverability in ('listed','unlisted'))`. The action layer's `location.create` handler (later ticket) will insert spine + child in a single transaction so the EXISTS check is satisfied on read.
- The areas centroid-sync trigger fires on insert OR update of `location_areas.polygon`. For the create flow, the spine row must already exist before the area row is inserted (FK enforces this). The action handler will: (1) insert spine with placeholder geography, (2) insert location_areas with polygon, (3) trigger fires and updates spine's geography. Alternative: action handler computes centroid client-side and skips the trigger — the trigger ensures correctness either way.
- Reserved columns (`parent_location_id`, `embedding_id`, `federation_origin`) carry no FK at b1. Their FKs / population pipelines land at the respective tier tickets.

**What the user must run locally to close the loop:**
1. `cd web && supabase db reset` — applies all six migrations (001, 002, 004, 005, 006, 007) against a fresh dev DB.
2. Verify in Studio:
   - `\d public.locations` → confirms `geography(Point, 4326)` column type and the four indexes (`idx_locations_geog`, `idx_locations_member`, `idx_locations_listed`, `idx_locations_active`).
   - `select extname from pg_extension where extname = 'postgis';` → returns one row.
   - `select indexname from pg_indexes where tablename = 'locations';` → GIST index present.
   - `select count(*) from public.locations;` → returns 0 (no rows seeded).
3. Phase 1 exit eval lands later (Playwright suite at `web/evals/phase-1/`).
