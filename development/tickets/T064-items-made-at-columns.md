# T064: `items.made_at_*` columns + event-kind extension

**Scenario:** substrate
**Status:** Open
**Bundle:** b1 (b1.x — Substrate sprint, Lane B wave 1)
**Depends on:** T058 (FK → places); existing `items` table (015).

**Serves:**
- **Spec:** [`product/systems/item.md`](../../product/systems/item.md) § Provenance claims — "Locally Made".
- **ADRs:** [ADR-0021](../../planning/adrs/ADR-0021-member-geography-substrate-split.md) (Ratified 2026-05-23), [ADR-0010](../../planning/adrs/ADR-0010-events-from-day-one.md), [ADR-0019](../../planning/adrs/ADR-0019-clean-slate-rebuild.md) b1 rule 8.
- **Sprint:** [`planning/bundles/b1x-substrate-sprint.md`](../../planning/bundles/b1x-substrate-sprint.md) § B4.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before commit.
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main.
- [ ] **DEVIATIONS.md entry** appended at close.

## Acceptance Criteria

- [ ] New migration `web/supabase/migrations/020_items_made_at.sql` altering `public.items`:
  - Add `made_at_place_id uuid null references public.places(id) on delete restrict`.
  - Add `made_at_verification_source text not null default 'none' check (made_at_verification_source in ('none','self_attested','community_attested','document_supported'))`.
  _Why: four-value form per `rebuild-plan.md` rule 8 (authoritative) + ADR-21 verification-ladder reshape. The sprint doc flags that `rebuild-plan.md:148` shows the older three-value form without `community_attested` — see "Doc-patch" below to correct it as part of this ticket._
- [ ] Add a CHECK guarding the surface invariant: `made_at_place_id IS NULL OR kind = 'product'`. Constraint name `items_made_at_only_on_products`.
  _Why: item.md § Provenance — `made_at_*` is meaningful only on `kind='product'`. The CHECK keeps the column honest at the schema level so a buggy composer can't stamp a `made_at_place_id` onto a `kind='service'` row._
- [ ] Extend `public.item_events` `event_kind` CHECK at [`015_items.sql:378`](../../web/supabase/migrations/015_items.sql) to add `item.made_at_set`, `item.made_at_removed`, `item.made_at_verified`. (Migration rewrites the constraint via `drop constraint` + `add constraint` — see T061 notes on CHECK constraint mutation.)
- [ ] **Doc-patch (in same ticket, parent repo):** `planning/rebuild-plan.md:148` — update the `verification_source` CHECK enum from the three-value form to the four-value form including `community_attested`. Add a one-line note: "_Corrected via T064 2026-05-25; ADR-21 verification-ladder reshape supersedes the original three-value form._"
  _Why: rule 8 is authoritative per the sprint doc, but the CHECK example below it shows the stale enum. Drift between rule and example is exactly what gate-13's drift check is supposed to catch — fix at ticket time, not via a separate housekeeping pass._
- [ ] Vitest: `tests/items-made-at-schema.test.ts` — (a) CHECK accepts each of the four `verification_source` values; (b) CHECK rejects a fifth value; (c) `made_at_place_id` FK rejects a non-existent place id; (d) the `items_made_at_only_on_products` CHECK rejects a `kind='service'` row with non-null `made_at_place_id`; (e) the three new `item_events` event kinds are accepted by the rewritten CHECK.
- [ ] `npm run check:action-layer && npm run lint && npm test` green.
- [ ] `BUILD-LOG.md` updated.

## Notes

- No action-handler changes ship at this ticket — `item.create`/`update` handlers don't exist yet at b1 (the composer is F-numbered surface work). When those handlers land, they'll be the surface that emits `item.made_at_set/.removed/.verified`. The b1.x ticket just installs the event-kind allow-list so those future handlers don't trip the CHECK.
- The default `made_at_verification_source = 'none'` keeps existing rows untouched and makes the column NOT-NULL-from-day-one rather than allowing accidental NULL provenance. Encodes the ADR-21 Flag-6 default Intent landed in `item.md` § Provenance.
- No surface at b1 — the "Locally Made" badge is F027 (b1.2). This is substrate-only schema.
- Encodes ratified absolutes:
  - 4-value verification ladder: ADR-21 verification-ladder reshape (Ratified 2026-05-23, recheck CLEAN).
  - `made_at_*` only on products: item.md § Provenance Intent.

## Completion

Date:
Commit:
