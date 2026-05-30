---
id: how-t049-member-location-affinities
purpose: Ticket T049 — member location affinities.
layer: how
status: reference
---

# T049 — Member location affinities (`011_member_location_affinities.sql`)

**Scenario:** `planning/rebuild-plan.md` § Phase 1 — Member surface (`007i_member_location_affinities.sql` in the plan; renumbered to `011_*`).
**Status:** Complete
**Completed:** 2026-05-17T12:08:29-07:00
**Bundle:** b1
**Depends on:** T047 (`members` augmentation), T045 (`locations` spine — for `location_id` FK target), T046 (locations RLS fix-forward).

**Serves:**
- **Loop:** Loop 3 (Land here) — the multi-affinity substrate that lets a Member declare `lives` at West Sac, `works` at Folsom, `plays` in midtown. Loop 4 (Gather regularly) — `affinity_kind='follows'` is the substrate for the Concerts-in-the-Park surface (Members follow Locations, get a feed when new Items attach). All five loop families read from this table for the locally-owned-and-operated derivation in `groups.md`.
- **Canonical example:** Concerts in the Park (Member follows Capitol Mall, Cesar Chavez Plaza — `affinity_kind='follows'`); Folsom-business-with-West-Sac-resident-owner (owner Member has `affinity_kind='works'` at Folsom — qualifies the business Group as locally owned per `groups.md`'s locality-promotion derivation).
- **Primitive shape:** Person ↔ Location (affinity), kind-typed. The lateral relation that lets every other surface read "where is this Member relative to this place."

## Workflow gates

- [ ] **M2 — `engineering:code-review`** invoked on the diff before `pipeline-eval` (run mode).
- [x] **M3 — `design:accessibility-review`** — N/A (no UI surface).
- [ ] **M4 — `engineering:deploy-checklist`** — applies.
- [ ] **DEVIATIONS.md entry** appended at ticket close.

## Acceptance Criteria

### Migration `web/supabase/migrations/011_member_location_affinities.sql`

**Table `public.member_location_affinities` (per `member.md` line 261):**

- [ ] `member_id uuid not null references public.members(id) on delete cascade`
- [ ] `location_id uuid not null references public.locations(id) on delete cascade`
- [ ] `affinity_kind text not null check (affinity_kind in ('lives','works','plays','visits','follows','liked'))` — locked enum per `member.md` line 268
- [ ] `created_at timestamptz not null default now()`
- [ ] `removed_at timestamptz` — soft-remove pattern mirroring `member_follows.unfollowed_at`
- [ ] Composite PK on `(member_id, location_id, affinity_kind)` — a Member can hold multiple kinds of affinity for the same Location.

**Indexes (per `member.md` lines 274-280):**

- [ ] `idx_affinity_member_active on public.member_location_affinities (member_id, affinity_kind) where removed_at is null` — Member's own profile surfaces ("places I live / work / play").
- [ ] `idx_affinity_location_followers on public.member_location_affinities (location_id) where affinity_kind = 'follows' and removed_at is null` — Concerts-in-the-Park feed read pattern.
- [ ] `idx_affinity_location_locals on public.member_location_affinities (location_id, affinity_kind) where affinity_kind in ('lives','works') and removed_at is null` — locally-owned-and-operated derivation in `groups.md` (any of `lives` / `works` qualifies a Member as a local owner of a Group anchored to this Location).

**RLS — owner-only per ADR-16:**

- [ ] `member_location_affinities_owner_read` — `for select using (member_id = auth.uid())`. **Single policy.** All six `affinity_kind` values are owner-only at the row level — no peer-Member access, no anon access, no per-kind public-read. Per ADR-16.

  _Intent: Affinity rows exist to power the Member's own surfaces — alerts about Locations they Live/Work/Play/Follow, and the taste signal feeding their own discovery from Likes — plus platform-side aggregations (locally-owned derivation in `groups.md`; follower/like counts on Location pages). No current peer-discoverability use case justifies the doxxing surface area of peer-readable rows. The door is left open via the SECURITY DEFINER function pattern: if a future use case emerges, the path is a new function returning the narrowest possible scalar, not opening RLS on the underlying table. PM-ratified 2026-05-13._

- [ ] No INSERT/UPDATE/DELETE policy — action-layer-only writes.

  _Intent: All writes flow through the action layer per ADR-7 so every row insert carries `acting_member_id` + (eventually) `via_delegation_id` audit fields and emits the corresponding `member.location_affinity_*` event in the same transaction. Direct table writes would bypass the audit trail that the agent-assistance substrate depends on. T051 CI enforcement makes this a project-wide invariant._

**Three SECURITY DEFINER functions per ADR-16:**

- [ ] `public.member_is_local_to_location(p_member_id uuid, p_location_id uuid) returns boolean` — true when the Member has an active (`removed_at is null`) `lives` or `works` affinity at the Location. `security definer set search_path = public`, `STABLE`. Used by `groups.md`'s locally-owned-and-operated derivation. Grant `execute` to `authenticated` and `anon`.
- [ ] `public.count_likes_for_location(p_location_id uuid) returns integer` — count of active `liked` affinity rows for the Location. `security definer set search_path = public`, `STABLE`. Used by Location-page rollups ("N Members liked this place"). Grant `execute` to `authenticated` and `anon`.
- [ ] `public.count_followers_for_location(p_location_id uuid) returns integer` — count of active `follows` affinity rows for the Location. `security definer set search_path = public`, `STABLE`. Used by Location-page rollups ("N Members follow this place") and (via service_role) the notification-fanout pattern. Grant `execute` to `authenticated` and `anon`.
- [ ] All three functions are the only paths public/anon/peer callers ever use to learn anything about the underlying rows. Backend services (recommendation engine, embedding pipeline) read raw rows via `service_role`, which bypasses RLS per ADR-16's Layer 3.

  _Intent: The three functions are the b1 catalog because the b1 use cases are bounded — Member's own surfaces, locality derivation, aggregate counts. The catalog is intentionally extensible: future use cases land as new SECURITY DEFINER functions with their own narrowly-scoped scalar returns, not by opening the table to direct reads. "Closed catalog" means closed-by-default, not closed-forever. PM-ratified 2026-05-13._

### Tests / build-side assertions

- [ ] `web/tests/migrations-t049.test.ts` — file-shape suite (~22 assertions: directory state has 011, table shape + composite PK + affinity_kind enum, three partial indexes, RLS enabled, single owner-read policy present, three SECURITY DEFINER functions (member_is_local_to_location + count_likes_for_location + count_followers_for_location) with STABLE + search_path + grants to authenticated/anon, no INSERT/UPDATE/DELETE policies on the table, no public-read policy on the table).
- [ ] Sandbox `node` smoke run matches Vitest suite.
- [ ] `supabase db reset` runs cleanly with all ten migrations.
- [ ] Studio smoke verification (after build):
  - [ ] `select count(*) from public.member_location_affinities;` — returns 0.
  - [ ] `\df public.member_is_local_to_location` — confirms `STABLE`, `security definer`, returns boolean.
  - [ ] `\df public.count_likes_for_location` — confirms `STABLE`, `security definer`, returns integer.
  - [ ] `\df public.count_followers_for_location` — confirms `STABLE`, `security definer`, returns integer.
  - [ ] Insert a row directly with an unknown `affinity_kind` — verify CHECK rejects.
  - [ ] `select polname from pg_policies where tablename = 'member_location_affinities';` — returns exactly one row (`member_location_affinities_owner_read`). No public-read policy.
- [ ] BUILD-LOG.md updated.

## Notes

**The privacy posture is ratified in ADR-16** (`planning/DECISIONS.md`). Read it before implementing. The three-layer architecture: (1) RLS = owner-only row access for public/anon/peer queries; (2) SECURITY DEFINER functions = controlled public-facing reads that return scalars only; (3) service_role = unrestricted backend reads for the recommendation engine and embedding pipeline. Output to users from layer 3 is always anonymized aggregates — never per-Member attribution.

**Why a single policy, not per-kind.** All six affinity_kinds are equally sensitive at the row level: `liked`/`follows` could narrow geography for someone watching the platform with patience; `lives`/`works`/`plays`/`visits` more directly. ADR-16's call: owner-only across the board; aggregates and locality go through named functions. Simpler RLS shape, stronger privacy floor.

**Aggregate-count functions.** `count_likes_for_location` and `count_followers_for_location` power the rollups on Location pages ("12 Members like this place"). They count `where removed_at is null`. They return zero for Locations with no matching rows. They never reveal which Members.

_Intent: Likes and follows are personal signals — they shape the Member's own feed and aggregate into platform-side ranking, not peer visibility. Aggregation is the anonymizer. If a future surface needs per-Member attribution (e.g., "your followed Members like this place"), it lands as a new SECURITY DEFINER function with its own access logic and scoping decisions, not by extending the count functions. PM-ratified 2026-05-13._

**Schema-spec divergence — RLS shape.** `member.md`'s RLS section is sketchier than what ADR-16 mandates. The patch is `pipeline-product`'s job: update `member.md` RLS section, `groups.md` locally-owned-derivation pseudocode, and `policy.md` anti-doxxing language. T049 implements the schema; the spec patches catch up. Record the divergence in DEVIATIONS at close.

**Bootstrap — handler-side, not trigger-side.** T049 ships the table only; no Postgres trigger auto-creates rows. The auto-derivation lives in the action handler: when `members.home_location_id` is set (via `member.create` or `member.locality.set`), the same transaction inserts a `lives` affinity row at the corresponding Location and emits `member.location_affinity_added`. The Member can remove the auto-inserted row via `member.location_affinity.remove` — derivation is the default, not the destiny. Updating `home_location_id` to a new Location inserts a `lives` row at the new Location; the prior row stays until the Member removes it explicitly (a Member may still live partly at the old place).

_Intent: Setting a home is a stronger signal than "this is my fallback locality for the feed" — it's a claim about where the Member actually lives. Auto-deriving a `lives` affinity captures that claim into the affinity substrate without making the Member do duplicate data entry, while leaving them in full control to remove or amend it. The action handler owns the side effect (not a Postgres trigger) to preserve the ADR-7 same-transaction invariant and ensure the standard `member.location_affinity_added` event fires with full audit fields. PM-ratified 2026-05-13._

**Forward-pointer to handler ticket.** The auto-derivation above is action-handler work, not migration work. T049 itself stays schema-only. The downstream handler ticket (covering `member.locality.set` and the `member.create` extension) is where this Intent is implemented and tested. Carry this Intent forward when that ticket is scoped.

**`affinity_kind='follows'` is the Concerts-in-the-Park substrate.** When the Location-follow feed surface ships (b2), it reads from `idx_affinity_location_followers`. Index is in place at b1 so the surface lands without a schema retrofit.

**Event log.** `member.location_affinity_added` / `member.location_affinity_removed` are already in T042's `member_events` enum. No event-log changes needed in this ticket; the action handlers (`member.location_affinity.add` / `.remove`) will emit them when they ship.

## Completion

Date: 2026-05-17
Commit: (set on push)

**Build summary.** Single migration `web/supabase/migrations/011_member_location_affinities.sql` lands the table (composite PK, six-value `affinity_kind` CHECK, `removed_at` soft-remove), the three partial indexes (`idx_affinity_member_active`, `idx_affinity_location_followers`, `idx_affinity_location_locals`), the single owner-read RLS policy keyed by `auth.uid()` per ADR-16, and the three SECURITY DEFINER scalar functions (`member_is_local_to_location` boolean, `count_likes_for_location` integer, `count_followers_for_location` integer — all `language sql`, `stable`, `set search_path = public`, granted to `authenticated, anon`). No INSERT/UPDATE/DELETE policies — action-layer-only writes per ADR-7. No public-read policy on the table.

**Tests.** `web/tests/migrations-t049.test.ts` (Vitest, file-shape, ~22 cases). `web/scripts/t049-sandbox-check.mjs` (plain-node mirror, 49 atomic checks — Vitest segfaults under Linux x86_64 in the build sandbox per BUILD-LOG T051; the script is the sandbox verifier). All 49 passing.

**Conformance.** `npm run check:action-layer` clean (32 protected tables, 0 violations). The new table inherits the project-wide RLS-coverage gate from T051.

**Deviations.** Three entries appended to `development/DEVIATIONS.md` (2026-05-17): sandbox runner committed alongside the Vitest suite; functions implemented `language sql` not `plpgsql` (planner-inlining win, identical ADR-16 semantics); schema-spec RLS divergence flagged for `pipeline-product` follow-up on `member.md` / `groups.md` / `policy.md`.

**Forward-pointers.**
- Action-handler ticket (covering `member.locality.set` + the `member.create` extension that auto-inserts a `lives` affinity when `home_location_id` is set, plus `member.location_affinity.add` / `.remove`) is the next layer up — not landed by T049 per the ticket's "Forward-pointer to handler ticket" note. PM to scope.
- Spec patches: `pipeline-product` to update `member.md` RLS section to cite ADR-16 verbatim; `groups.md` locally-owned-derivation pseudocode to call `public.member_is_local_to_location()` rather than JOINing the table directly; `policy.md` anti-doxxing language to point at the RLS floor.

**Studio smoke verification.** Pending — runs against the user's local Supabase Studio after `supabase db reset`. All five Studio probes from the ticket are listed in the acceptance criteria; they exercise the runtime shape that the file-shape suite cannot.
