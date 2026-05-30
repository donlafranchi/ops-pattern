# T063: `member_saved_searches` table + action handlers

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane B wave 1)
**Depends on:** T058 (FK → places); `locations` table exists per 007.

**Serves:**
- **Spec:** [`product/systems/member.md`](../../product/systems/member.md) § Saved searches.
- **ADRs:** [ADR-0021](../../planning/adrs/ADR-0021-member-geography-substrate-split.md) (Ratified 2026-05-23), [ADR-0007](../../planning/adrs/ADR-0007-action-layer.md), [ADR-0010](../../planning/adrs/ADR-0010-events-from-day-one.md).
- **Sprint:** [`planning/bundles/b1.x-substrate-sprint.md`](../../planning/bundles/b1.x-substrate-sprint.md) § B3.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main.
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/019_member_saved_searches.sql`.
- [ ] `public.member_saved_searches` table: `id uuid pk default gen_random_uuid()`, `member_id uuid not null references public.members(id) on delete cascade`, `label text not null check (char_length(label) between 1 and 80)`, `place_id uuid null references public.places(id) on delete restrict`, `location_id uuid null references public.locations(id) on delete restrict`, `interest_tags text[] not null default '{}'`, `item_kinds text[] not null default '{}'`, `created_at timestamptz not null default now()`, `updated_at timestamptz not null default now()`, `removed_at timestamptz null`.
- [ ] Table-level CHECK constraint `at_least_one_filter`: `(place_id is not null or location_id is not null or array_length(interest_tags, 1) is not null)`.
  _Why: a saved search with no filters is a wildcard that would fan out to every Item — disallowed at the schema level. `array_length(NULL, 1)` is NULL, so the predicate naturally rejects an empty array. (`item_kinds` alone does **not** count as a filter — too broad on its own per member.md § Saved searches.)_
- [ ] Indexes: `(member_id) WHERE removed_at IS NULL` for Member-scoped reads; `(place_id) WHERE place_id IS NOT NULL AND removed_at IS NULL` and `(location_id) WHERE location_id IS NOT NULL AND removed_at IS NULL` for the future b2 fan-out worker.
- [ ] RLS enabled. **`member_saved_searches_owner_read`** policy: `USING (member_id = auth.uid())`. **No INSERT/UPDATE/DELETE policies** — action-layer-only.
  _Why: ADR-21 owner-only at row level (recheck CLEAN 2026-05-23). The b2 fan-out worker reads via service-role; Members never see other Members' saved searches._
- [ ] Extend `public.member_events` `event_kind` CHECK to include `member.saved_search.created`, `member.saved_search.updated`, `member.saved_search.removed`.
- [ ] New action handlers under `web/src/actions/member/`:
  - `saved-search-create.ts` — `member.saved_search.create` — inputs `{ label, placeId?, locationId?, interestTags?: string[], itemKinds?: string[] }`. Validates the CHECK invariant at the action layer too (fail-fast before DB), with `ValidationError`.
  - `saved-search-update.ts` — `member.saved_search.update` — inputs `{ id, ...partial }`. Owner check; same invariant.
  - `saved-search-remove.ts` — `member.saved_search.remove` — sets `removed_at`. Idempotent.
  - Barrel-export from `web/src/actions/member/index.ts`.
- [ ] Vitest: `tests/member-saved-searches-schema.test.ts` — column shape, CHECK rejects all-filters-null insert, label length CHECK (0 and 81 reject; 1 and 80 accept), owner-only RLS matrix, FK rejections.
- [ ] Vitest: `tests/member-saved-searches-handlers.test.ts` — (a) create with only `interest_tags=['organic']` → row + event; (b) create with all filters null → `ValidationError` *before* DB; (c) update by non-owner → `AuthError`; (d) remove sets `removed_at` and emits event; (e) `npm run check:action-layer` clean for the three handlers.
- [ ] `BUILD-LOG.md` updated.

## Notes

- **No surface at b1** (sprint § B3) — substrate only. The b2 composer + fan-out worker are downstream features. This ticket ships the writeable substrate so b1 can already record saved searches if a future composer surfaces; no UI is built here.
- `interest_tags` is `text[]`, not a normalized join — at b1 tags are free-form Member input. A b2 tag-normalization pass may emerge, but at b1 the array is the source of truth.
- `item_kinds` array values are validated client-side only at b1 — the action handler may add a Zod refinement that values are in the `items.kind` enum. Adding a DB CHECK on array contents is possible but brittle if the enum extends; defer.
- Encodes ratified absolutes:
  - ADR-21 `member_saved_searches` owner-only RLS (recheck CLEAN 2026-05-23).
  - "At least one filter required" — member.md § Saved searches Intent.

## Completion

Date:
Commit:
