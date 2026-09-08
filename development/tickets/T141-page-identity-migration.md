# T141: One migration for category, photo column, and the new event types

**Scenario:** substrate — no user-facing surface. Backs `planning/next/scenario-F061-someone-creates-a-page-worth-showing-people.md`.
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`)
**Depends on:** nothing. **Blocks:** T144, T145.

**Serves:**
- **System spec:** `product/systems/groups.md` § *What a Page carries at creation* (category, photo) and § *Editing an active Page* (the `group.updated` event the editor scenario needs). Both sections carry State-tagged Intent — cited below.
- **Primitive shape:** two nullable columns on the existing `groups` spine, one capture table with no foreign-key fan-out, three new members of the existing `group_events` kind constraint. **No new entity.**

## Checklist 2 — writing tickets

- [x] **Gate C — substrate, exempt.** No Member-visible surface; the columns render nothing until T144/T145 read them.
- [x] **Gate B — clear.** Every absolute this migration's shape encodes is State-tagged: `groups.md:279` (category, Ratified 2026-09-07), `groups.md:301` (photo, Ratified 2026-09-07). Neither the vocabulary nor the free-text table is enforced in the schema — see below.
- [x] **All Serves lines resolve.**
- [x] **Cited spec last-changed dates.** `product/systems/groups.md` — current as of this session (§ *What a Page carries at creation* and § *Editing an active Page* both added 2026-09-07).
- [x] **Review binding note 5** (`planning/next/review-F061.md`): *"Fold them into one migration... three separate hand-pushes across two scenarios is three chances to forget one."* This ticket is that fold.

## What changes

One migration. Nothing else.

## Acceptance Criteria

- [ ] `groups.category text`, nullable, with a plain btree index. **No `CHECK`, no enum.**
  _Why: review binding note 2 — the twelve-term vocabulary will grow to thirteen and beyond; encoding it as a database constraint makes every vocabulary change a migration, and migrations are currently applied to production by hand. The vocabulary lives as a named constant in the action handler (T144), validated there. Nullable because Pages created before this exist and are not backfilled; the handler, not the column, is what makes the field required at publish (review binding note 3)._
- [ ] `group_category_suggestions`: `id uuid pk`, `group_id` fk → `groups`, `member_id` fk → `members`, `raw_text text`, `normalized_text text`, `created_at timestamptz default now()`. Index on `normalized_text`.
  _Why: `groups.md` § *Other* — "the escape hatch is how the vocabulary earns its next term." No `status`, no `promoted` flag — promotion is a human reading the table, per the ratified Intent. Adding either column would quietly build the automatic-promotion path the Intent refuses._
- [ ] `groups.photo_url text`, nullable.
- [ ] `group_events` kind constraint gains three members: `group.photo_set`, `group.photo_removed`, `group.updated`. `group.updated` is not consumed by any ticket in this stretch — it is F056's (the editor), landing here per binding note 5 so the editor's later migration doesn't need its own hand-push.
- [ ] Single migration file, e.g. `0NN_page_identity.sql`. `supabase/config.toml` needs no change (no new bucket, no new extension).
- [ ] `BUILD-LOG.md` updated, noting this migration is **written, not yet applied to production** until the session-end push per the drift check (T140).

## Workflow gates

- [ ] **M2 — `engineering:code-review`** before commit.
- [ ] **M3** — N/A, no surface.
- [ ] **M4 — `engineering:deploy-checklist`** — fires. New migration.
- [ ] **Migration applied to production** — per T140's drift check, not this ticket. Do not hand-push from inside this ticket's close-out; the drift check is the mechanism now.
- [ ] **DEVIATIONS.md entry** at close — even one line.

## Notes

- **Do not add `values_statement` or `tagline` here.** Those are F056's (the editor) and belong to its own migration cycle if F056 builds before this one ships — check `development/tickets/T126-edit-shop-image-and-values.md` before writing that migration to avoid a second `group_businesses`-vs-`groups` collision.
- **`group.photo_removed` is used by both T145 (Page) and the existing `item.photo_removed`** (Item, T122) — different tables, same event vocabulary shape. Not a collision; `group_events` and `item_events` are separate partitioned tables.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
