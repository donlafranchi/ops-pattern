# T056 — Phase 1: Items schema (`015_items.sql`)

**Scenario:** None. Phase 1 substrate — opens against `product/systems/item.md` + ADR-5 (markets-as-gathering) + ADR-10 (event-log invariants) + ADR-7 (action-layer conformance) + ADR-6 (audit fields).
**Status:** Build complete; closed 2026-05-19
**Bundle:** b1 (Phase 1 substrate — Item primitive at T1 scope per `b1-primitives.md`).
**Depends on:** T042 (members), T045 (locations — FK from `item_locations.location_id`), T055 (groups — FK from `items.group_id`; also closes T055's deferred `group_event_anchored.seeded_by_item_id` FK).

**Serves:**
- **Loops:** all five families. Item is the grammar — every loop terminates in an Item declaration.
- **Primitive shape:** Items are the third primitive that ships in Phase 1. Spine + 4 kind-children + 4 join tables + 1 event log. T1 scope only — `offer` / `ask` / `initiative` kinds reserved in the enum but no child tables.
- **Absolutes encoded:** none fresh (per the Phase 1 absolutes audit 2026-05-19). Items schema is structural — `kind` CHECK enum, `state` CHECK enum, soft-delete gate, audit fields. No Category-2 absolutes the absolute audit hasn't already covered.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked before commit.
- [ ] **M3 — N/A** (no UI).
- [ ] **M4 — `engineering:deploy-checklist`** — MANDATORY.
- [ ] **DEVIATIONS.md entry** appended at close — at minimum captures the `state`-enum reconciliation decision.

## What ships

**One migration file:** `web/supabase/migrations/015_items.sql`. Tables in dependency order:

1. `public.items` — spine.
2. `public.item_products` — 1:1 child for `kind='product'`.
3. `public.item_services` — 1:1 child for `kind='service'`. Uses PostGIS `geography(Polygon, 4326)` for `service_area_geography`.
4. `public.item_gatherings` — 1:1 child for `kind='gathering'`.
5. `public.item_wonders` — 1:1 child for `kind='wonder'`. `expires_at` default `now() + interval '90 days'`.
6. `public.item_locations` — M:N join.
7. `public.item_responses` — M:N join; `pledge` value reserved at b1 for Initiative cohort (b2+ surface).
8. `public.item_tags` — controlled vocabulary.
9. `public.item_hashtags` — free-form, normalized.
10. `public.item_events` — monthly partitioned per ADR-10.

**Plus:** close T055's deferred FK on `group_event_anchored.seeded_by_item_id` referencing `items(id) ON DELETE SET NULL`.

**Plus:** `updated_at` trigger on `items` reusing `public.update_updated_at_column()`.

**Action handlers do NOT ship** — Phase 2 lands them with composer surfaces.

## Key schema decisions

### `items.kind` enum

`('product','service','gathering','wonder','offer','ask','initiative')`. T1 ships the first four; the last three are reserved at schema. The Items spine permits all seven; child tables only ship for the first four. Inserting an Item with `kind='offer'` succeeds (substrate) but no child row exists — surface composers at b2 land the children.

### `items.state` enum — reconciled

Per the F018-review punch list (now deferred with F018), `item.md` carried two conflicting state vocabularies: line 99 `(active, fulfilled, withdrawn, closed)` and line 128 publish-semantics referencing `'draft'` → `'published'`. T056 reconciles to a single enum:

```sql
check (state in ('draft','published','withdrawn','fulfilled','closed'))
```

**Mapping:**
- `draft` — composer-saved, not surfaced publicly. Default on create.
- `published` — live and discoverable. Target of `item.published` event.
- `withdrawn` — temporarily off-surface; Member can re-publish.
- `fulfilled` — terminal-positive; Item did its job (gathering happened, product sold, wonder converted).
- `closed` — terminal-neutral; Member ended the Item without fulfillment.

**`active` is dropped** — redundant with `published`. Any spec reference to "state='active'" should be read as "state='published'" going forward; the F018 rewrite punch list (still pending in `planning/scenarios-backlog/`) will land the text edit when F018 promotes.

This is the **single deviation T056 introduces from `item.md` as written**. Logged in DEVIATIONS at close.

### `items.discoverability` — not present

Per `item.md`, Items inherit visibility from their Group (when filed under one) or are public by default (when standalone). There is **no `discoverability` column on `items`** at b1 — anon-readability is gated by `state='published' AND deleted_at IS NULL` (and, when `group_id` is set, by the Group's discoverability via RLS subquery using the `current_member_explicit_group_ids()` helper from T055).

### RLS shape

- `items_select_published` — anon + auth: `state='published' AND deleted_at IS NULL AND (group_id IS NULL OR group_id IN (select id from groups where discoverability='listed' AND dissolved_at IS NULL))`.
- `items_select_owner` — auth-self: `member_id = auth.uid()` (Members see their own drafts/withdrawals).
- `items_select_group_member` — auth: `group_id IN (select public.current_member_explicit_group_ids())` for `unlisted` / `private` Group Items.
- Child tables: `<child>_select_via_parent` — `item_id IN (select id from items)` (cascade visibility through parent RLS).
- `item_responses_select_owner` — responding Member sees their own responses (any state).
- `item_responses_select_public` — `item_id IN (select id from items where state='published')` (response counts visible on public Items).
- `item_events` — author-of-action OR Item-owner read; no public read.

### Event-kind enum at b1

Per `item.md` line 126:

```
'item.created', 'item.updated', 'item.published',
'item.location_attached', 'item.location_removed',
'item.responded', 'item.response_withdrawn',
'item.state_changed', 'item.fulfilled', 'item.deleted',
'item.group_changed', 'item.brand_label_changed',
'item.qr_card_requested'
```

T2+ reserved (not in the b1 CHECK): `item.converted`, `item.collaborator_added`.

### Indexes

- `items`: `(member_id) where deleted_at is null`; `(group_id) where deleted_at is null AND group_id is not null`; `(kind, state) where deleted_at is null`; `(state) where state='published' AND deleted_at is null` (hot path); `(brand_label) where brand_label is not null` for resolve-up.
- `item_products`: `(price_cents)` for browse sort.
- `item_services`: GIST `(service_area_geography)` for area-inclusion.
- `item_gatherings`: `(starts_at)` for the discovery feed; `(host_member_id)`.
- `item_wonders`: `(interest_count desc, expires_at)`.
- `item_locations`: `(item_id, removed_at)`; `(location_id, removed_at)`.
- `item_responses`: `(item_id, response_kind) where withdrawn_at is null`; `(responder_member_id, response_kind)`.
- `item_tags`: `(tag, item_id)` for facet queries.
- `item_hashtags`: `(hashtag, item_id)` for `/h/[hashtag]` feed; `(hashtag, created_at desc)` for trending.
- `item_events`: `(item_id, created_at desc)`; `(acting_member_id, created_at desc)`.

### Deferred constraint closure

End of migration:

```sql
alter table public.group_event_anchored
  add constraint group_event_anchored_seeded_by_item_fkey
  foreign key (seeded_by_item_id) references public.items(id) on delete set null;
```

## Acceptance Criteria

### Migration

- [ ] New file `web/supabase/migrations/015_items.sql`.
- [ ] All 10 tables created in dependency order with named CHECK constraints where the constraint is referenced semantically (kind, state, response_kind, schedule_kind, event_kind).
- [ ] PostGIS `geography(Polygon, 4326)` on `item_services.service_area_geography`.
- [ ] RLS enabled and policies named per spec on every table.
- [ ] Indexes per spec.
- [ ] Partition rotation pair for `item_events` mirroring `member_events` / `location_events` / `group_events`.
- [ ] `updated_at` trigger on `items`.
- [ ] `group_event_anchored.seeded_by_item_id` FK closed.
- [ ] File header documents the state-enum reconciliation (the single deviation).
- [ ] `comment on table` for every table.

### Eval coverage

New file `web/evals/phase-1/items.spec.ts`. Test set covers:

- [ ] Schema shape for all 10 tables (10 tests).
- [ ] Seven-kind CHECK rejects unknown kind.
- [ ] State enum CHECK rejects `'invalid'`.
- [ ] `state` default is `'draft'`.
- [ ] Inserting kind='offer' / 'ask' / 'initiative' succeeds at the spine but no child row required.
- [ ] response_kind CHECK accepts the 7 valid values (`interest, rsvp, follow, save, pledge, purchase, support`).
- [ ] schedule_kind CHECK accepts the 4 values.
- [ ] event_kind CHECK rejects unknown.
- [ ] RLS matrix: anon sees published; anon does NOT see draft / withdrawn / soft-deleted; owner sees own drafts; Group member sees private-Group Items.
- [ ] Partition existence (≥3 monthly partitions for `item_events`).
- [ ] NOT NULL audit fields on `item_events`.
- [ ] PostGIS column type for `item_services.service_area_geography`.
- [ ] Wonder default `expires_at` is ~90 days from now.
- [ ] Deferred FK closure: insert into `group_event_anchored` with an items-pointing FK succeeds; pointing at a nonexistent UUID fails with 23503.

### Conformance + integration

- [ ] `npm run check:action-layer` — `OK`.
- [ ] `supabase db reset && eval:bootstrap && playwright test evals/phase-1/items.spec.ts` — all green.
- [ ] Full `evals/phase-1/` continues green (105 prior + items test count).

## Notes

**Commit hygiene.** Suggested message: `T056: items schema (015_items.sql + items.spec.ts + group_event_anchored FK closure)`.

## Completion

Date: 2026-05-19
Commit (web): {pending}
Commit (parent): {pending}

**Build outcome:**

- `web/supabase/migrations/015_items.sql` (~440 lines) — 10 tables created in dependency order: `items` spine + 4 kind children (products / services / gatherings / wonders) + 4 join tables (locations / responses / tags / hashtags) + `item_events` partitioned monthly. Plus the deferred FK closure on `group_event_anchored.seeded_by_item_id`.
- `web/evals/phase-1/items.spec.ts` (~480 lines, 27 tests) — schema shape (10 tables), 7-kind enum CHECK including reserved offer/ask/initiative substrate-only, state-enum CHECK (with `'active'` explicitly rejected per the reconciliation), state default `'draft'`, RLS matrix (published / draft / withdrawn / soft-deleted / private-group-filed), PostGIS service_area_geography type, rate_model CHECK, gathering shape, wonder default `expires_at` (~90 days tolerance), schedule_kind / response_kind / event_kind CHECKs, all 7 response_kind values accepted, partition introspection, NOT NULL audit field, anon-events-RLS, both directions of the closed FK (real Item succeeds; nonexistent UUID rejects with 23503).
- `supabase db reset` → clean apply through `015_*.sql` on first attempt.
- `npm run eval:bootstrap` → conformance OK.
- **27/27 items tests green on first run.** Full Phase 1: **132/132 green** (105 prior + 27 new).
- `npm run check:action-layer` → `OK (no violations found)`. 124 files scanned; 32 protected tables (now covering all Phase 1 Member + Location + Group + Item tables).

**M2 verdict — `engineering:code-review`:** **PROCEED**. State-enum reconciliation called out and documented at the file header + eval; FKs all named where semantic; PostGIS column uses correct SRID 4326; RLS shape mirrors items.md (published+listed-group OR private-group-member); partition rotation mirrors the established pattern; deferred FK closes cleanly inside the same migration without altering T055.

**M4 verdict — `engineering:deploy-checklist`:** **PROCEED**. Phase 1+ migration on a clean slate. Forward-only. Full eval + conformance pass. No env / secret / config changes.

**DEVIATIONS.md entry:** appended 2026-05-19 — captures the `state`-enum reconciliation (dropping `'active'` in favor of `'published'`) and notes the F018-rewrite punch list dependency.
