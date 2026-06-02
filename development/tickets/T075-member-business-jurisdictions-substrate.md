---
id: how-t075-member-business-jurisdictions-substrate
purpose: Substrate ticket — land `member_business_jurisdictions` (Tier 0), the `public.zip_is_proximal_to_location()` proximity function, the `zip_metro_crosswalk` seed for the Sacramento metro, and the b1 jurisdiction action handlers. Unblocks F037 + F039 and greens the jurisdiction half of F036's `:266` eval.
layer: how
status: open
---

# T075 — `member_business_jurisdictions` Tier 0 substrate + proximity function

**Scenario:** substrate
**Binds to:** `product/systems/business-jurisdiction.md` § T1 — MVP Tier (b1) · § Data model implications · § Action handlers · `product/systems/action-layer.md` § Same-transaction row+event invariant · ADR-21
**Status:** Open
**Bundle:** b1 (sub-bundle b1.2 — Business Groups & makers; STAGE-LEDGER row `S-jurisdictions`)
**Depends on:** T055 (`groups` schema) · T070 (`groups.lifecycle_state` + owner-role checks) · T060 (places place_id substrate, MSA column)
**Repo / branch:** web / `t75`

**Serves:**
- **Loop:** 6 + 7 (Sell / Buy close) — gives kind='business' Groups a verifiable locality floor so the "Claimed local owner" claim can land on Group surfaces without forcing owners to expose a home address.
- **Spec sections:** `business-jurisdiction.md` § T1 (MVP Tier b1) is the contract; § Data model implications is the schema; § Action handlers is the handler contract.
- **Primitive shape:** Member(owner) → Group(kind='business') → ZIP (locality token). No shell entity; jurisdiction is keyed by (`member_id`, `group_id`), not by a separate Business row.
- **Failure mode this prevents:** F037 and F039 cannot promote out of `planning/backlog/` until the substrate they encode in code exists. F036's `:266` eval stays partial-pass until the jurisdiction half lands.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M3 — `design:accessibility-review`** — N/A (no UI in this ticket; F037 owns the surface).
- [ ] **M4 — `engineering:deploy-checklist`** before merge to main (new migration; SECURITY DEFINER function; RLS policies).
- [ ] **DEVIATIONS.md entry** at ticket close — even one line.
- [ ] **SPEC-PATCHES** entry if the build surfaces drift between this ticket's implementation and `business-jurisdiction.md` § Data model implications.

## Acceptance Criteria

### Schema — migration `024_member_business_jurisdictions.sql`

- [ ] Create `member_business_jurisdictions` table mirroring `business-jurisdiction.md` § Data model implications:
  - `id uuid primary key default gen_random_uuid()`
  - `member_id uuid not null references members(id) on delete cascade`
  - `group_id uuid not null references groups(id) on delete cascade`
  - `zip text not null check (zip ~ '^[0-9]{5}$')`
  - `state text check (state ~ '^[A-Z]{2}$')` — nullable; populated at Tier 2 (b2+)
  - `legal_entity_name text` — nullable; populated at Tier 2 (b2+)
  - `verification_source text not null check (verification_source in ('self_attested','community_attested','document_upload'))`
  - `verified_at timestamptz` — nullable; null for `self_attested`
  - `source_document_id uuid` — nullable; FK target table lands at T3
  - `created_at timestamptz not null default now()`
  - `updated_at timestamptz not null default now()`
  - `removed_at timestamptz`
- [ ] `create unique index ux_jurisdiction_member_group_active on member_business_jurisdictions (member_id, group_id) where removed_at is null;`
- [ ] `create index idx_jurisdiction_zip_active on member_business_jurisdictions (zip) where removed_at is null;`
- [ ] **Skip** the spec's `primary key_constraint_note text generated always as (...) stored` column — it is a documentation artifact, not a runtime constraint. Capture the rationale ("one active row per (member_id, group_id); soft-delete via removed_at") in the migration header comment instead. _Why: Postgres `generated always as (...) stored` evaluates a row expression; the spec's literal text is a fixed string and would not earn the column. The invariant lives in the unique partial index above; the comment carries the why._

### Schema — `zip_metro_crosswalk` (separate migration `025_zip_metro_crosswalk.sql`)

- [ ] Create `zip_metro_crosswalk` table:
  - `zip text primary key check (zip ~ '^[0-9]{5}$')`
  - `msa_code text not null` — HUD CBSA code (5 digits, e.g. `40900` for Sacramento–Roseville–Folsom)
  - `msa_name text not null`
  - `state text not null check (state ~ '^[A-Z]{2}$')`
  - `source text not null default 'HUD-USPS-2026Q1'` — provenance string for refresh tracking
  - `refreshed_at timestamptz not null default now()`
- [ ] Seed the Sacramento metro (CBSA 40900) at minimum — all ZIPs in Sacramento, Placer, El Dorado, Yolo counties. Source = HUD-USPS ZIP-to-CBSA crosswalk (most recent quarterly release). Seed lives in `web/supabase/seeds/zip_metro_crosswalk_sacramento.sql` and is loaded by the migration via `\i` or inlined `insert`.
  _Why: the test fixtures and F037 evals will exercise Sacramento-area ZIPs first. Seeding the metro keeps the proximity function honest for evals without committing the full ~42k-row national crosswalk to the migration. National seed lands in a later ticket when more metros are needed._
- [ ] Add a Location → MSA join path. Confirm whether `places` already carries an `msa_code` column (per T066) and the anchor Location resolves to a Place via `locations.place_id`. If `msa_code` is **absent** on `places`, add it via this migration (`alter table places add column msa_code text;`) and populate for seeded Sacramento Places. **Surface this in DEVIATIONS** if the alter is needed; flag SPEC-PATCHES against `location.md` if `places.msa_code` was not in the spec.

### Function — `public.zip_is_proximal_to_location(zip text, location_id uuid) returns boolean`

- [ ] `SECURITY DEFINER`, `STABLE`, `language sql`. Owned by the migration role; `grant execute … to authenticated, anon`.
- [ ] Behavior: returns `true` when the input ZIP's `msa_code` (from `zip_metro_crosswalk`) equals the `msa_code` of the Location's anchored Place (`locations.place_id → places.msa_code`). Returns `false` on any null in the join chain (unknown ZIP, Location with no Place, Place with no MSA). Returns `false` on empty/malformed ZIP — caller responsibility but defensive.
  _Why: same-MSA = passes is the working answer from `business-jurisdiction.md` § Open questions #1. Rural cross-MSA tie-break is parked at b1; null-safe false is the conservative default — a missing-data row never earns the badge. Cross-MSA proximity radius is a future tightening, not a b1 loosener._
- [ ] One Postgres test in `web/supabase/tests/zip_is_proximal_to_location.sql` (or vitest-driven SQL spec, whichever already exists in the repo) covering: same-MSA → true; different-MSA → false; unknown ZIP → false; Location with null `place_id` → false; Place with null `msa_code` → false.

### RLS — `member_business_jurisdictions`

- [ ] `enable row level security`.
- [ ] Policy `mbj_select_public_active`: `for select using (removed_at is null)`. Anonymous + authenticated both readable.
  _Why: per `business-jurisdiction.md` § RLS — the jurisdiction record is a *public* claim by deliberate contrast with the private `member_place_interests` / `member_saved_searches` substrates. The Group surface renders the claim; readability is the point._
- [ ] **No** direct INSERT / UPDATE / DELETE policy from client roles. All writes go through the action handlers in the action layer (per ADR-7 + `action-layer.md`). Handlers run with the service role inside `withTransaction` and bypass RLS by design.
- [ ] No RLS policy on `zip_metro_crosswalk` (public read; no writes from clients).

### Action handlers — `web/src/actions/member/business-jurisdiction-*.ts`

- [ ] `member.business_jurisdiction.set({ groupId, zip, state?, legalEntityName? })` — handler at `web/src/actions/member/business-jurisdiction-set.ts`:
  - Validates the caller is an active owner-role membership in `groupId` for a kind='business' Group. Reject `AuthorizationError` otherwise.
  - Validates `zip ~ '^[0-9]{5}$'` (Zod). Reject `ValidationError` on miss.
  - Inside `withTransaction`: soft-delete the prior active row (`update member_business_jurisdictions set removed_at = now(), updated_at = now() where member_id = $member and group_id = $group and removed_at is null`), then insert a fresh row with `verification_source = 'self_attested'`, `verified_at = null`. Append a `member.business_jurisdiction_set` event with the diff (`old_zip` → `new_zip`, `old_source` → `new_source`) in the same transaction via `appendEvent` (per `action-layer.md` § same-transaction row+event invariant).
  - This handler covers both *first set* (no prior row) and *update* (prior row exists). The user-spec listed `.set / .updated / .removed`; the spec's b1 contract folds update into `.set` via soft-replace, preserving the audit chain in the historical row. _Why: a separate `.update` handler would duplicate `.set`'s validation + transaction shape and split the event-emission path. The soft-replace pattern is already how the spec encodes the audit chain (`business-jurisdiction.md` § Soft delete)._
- [ ] `member.business_jurisdiction.remove({ groupId })` — handler at `web/src/actions/member/business-jurisdiction-remove.ts`:
  - Validates active owner-role in `groupId`. Reject `AuthorizationError` otherwise. `NotFoundError` if no active jurisdiction row exists.
  - Inside `withTransaction`: `update ... set removed_at = now(), updated_at = now()` for the active row. Append `member.business_jurisdiction_removed` event with the removed ZIP in the same transaction.
- [ ] Both handlers exported via `web/src/actions/member/index.ts`.
- [ ] **Defer to b2+ (do not implement here):** `member.business_jurisdiction.attest_community` (Tier 1 — needs `member_business_jurisdiction_attestations` table + threshold worker) and `member.business_jurisdiction.upload_document` (Tier 2 — needs docs table + OCR pipeline). Per `business-jurisdiction.md` § What does not ship at b1.

### Tests

- [ ] Vitest unit tests for `business-jurisdiction-set.ts`:
  - First set inserts a row with `verification_source='self_attested'` and fires `member.business_jurisdiction_set`.
  - Re-set with a different ZIP soft-deletes the prior row, inserts a fresh row, and the event diff carries both old and new ZIP.
  - Non-owner Member calling `.set` against the Group → `AuthorizationError`, no row written, no event fired.
  - Invalid ZIP (`'9999'`, `'abcde'`) → `ValidationError`.
- [ ] Vitest unit tests for `business-jurisdiction-remove.ts`:
  - Active row → soft-deletes, fires `member.business_jurisdiction_removed`.
  - No active row → `NotFoundError`.
  - Non-owner → `AuthorizationError`.
- [ ] SQL test for `public.zip_is_proximal_to_location` (covered under Function section above).
- [ ] At least one same-transaction-invariant test confirming event-log row count and jurisdiction row count move together — drop event-log insert from the handler, expect transaction rollback. (Mirror the pattern used by T070's group-handler tests.)

### BUILD-LOG + STAGE-LEDGER

- [ ] BUILD-LOG.md updated with T075 ship line.
- [ ] STAGE-LEDGER row `S-jurisdictions` stamped `building` on start, `built` on commit. F037 + F039 rows annotated that their substrate gate is closed (do **not** auto-promote them out of `planning/backlog/` — PM moves files; this ticket only un-blocks).

## Notes

- **No UI.** F037 and F039 own the surfaces. This ticket lands the floor.
- **Action-handler conventions.** Mirror `web/src/actions/group/activate.ts` (T070) for handler shape (`defineHandler` + `withTransaction` + `appendEvent`). Owner-role check lives alongside the existing checks in `_lib/context.ts` if a helper already exists; otherwise inline against `group_memberships`.
- **Owner-role precondition.** A kind='business' Group's owners are Members with `group_memberships.role = 'owner'` AND `group_memberships.removed_at is null` for that `group_id`. Confirm against T070's schema; do not invent a new role string.
- **Event names.** `member.business_jurisdiction_set` and `member.business_jurisdiction_removed`. Underscored verb form per existing event-log convention (e.g. `group.activated`).
- **Encodes ratified absolute:** `product/systems/business-jurisdiction.md:109` — Intent (Ratified 2026-05-23) — Tier 1 is community-attestation, not external SOS lookup. This ticket's b2-deferral of `.attest_community` honors that Intent literally; the handler stub does not exist at b1, so no code path can be accidentally pointed at an external SOS API.
- **Encodes ratified absolute:** ADR-21 (the locality-derivation reads `member_business_jurisdictions` as the first signal at b1, with `member_location_affinities` retired). This substrate is exactly that first signal.
- **F036 eval impact.** Once this ticket merges, F036's `:266` eval needs a re-run — the jurisdiction half of the failure is expected to green. The provenance half (`items.made_at_place_id`) is **out of scope** for T075 and lives in a sibling substrate ticket per the STAGE-LEDGER `S-jurisdictions` row.
- **What's deliberately deferred:** Tier 1 attestation substrate (`member_business_jurisdiction_attestations`), Tier 2 document upload + OCR, attestation-threshold worker, public verification-source filter, multi-jurisdiction surface affordance, family-business co-jurisdiction surface. All per `business-jurisdiction.md` § What does not ship at b1.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
