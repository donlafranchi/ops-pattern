# T133: Item creation stops requiring the filing Group to be a business

**Scenario:** `planning/now/scenario-F060-someone-starts-something-without-opening-a-shop.md`
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`), track A
**Depends on:** T132 (the founder role this ticket authorizes against does not exist until T132 lands)

**Serves:**
- **Loop:** 1 (Gather) — the wall named in the scenario as "the wall": a gathering cannot be filed under a run club at all.
- **Canonical example:** P1, and the run-club case it does not cover.
- **Primitive shape:** Person → Group (any kind) → Item. No new entity, no new table, no new event type — one authorization clause changes.

**Spec contract:** `product/systems/groups.md` § Roles per kind; scenario § "What actually blocks this today," branch 1.

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

- [ ] `src/actions/item/create.ts`'s owner-authorization query (currently `gm.role = 'owner' and gm.left_at is null and g.kind = 'business'`, lines 96–104) removes the `g.kind = 'business'` predicate entirely.
- [ ] The role predicate branches by the filing Group's kind, matching the pattern already shipped in `member_has_standing_presence` (`014_groups.sql:349-350`): `(g.kind = 'business' and gm.role = 'owner') or (g.kind <> 'business' and gm.role = 'steward')`. Do not simplify to `role in ('owner','steward')` — that would let a `member`-role person on a business Group file under it, which is a real hole the current clause closes and this ticket must not open.
- [ ] The `brand_label` lookup (the block immediately following, reading `group_businesses.display_name`) is unchanged in shape but now legitimately returns null for a non-business filing Group — confirm the existing downstream group-name fallback (the pattern in `resolve-gathering.ts:207-213`, `row.brand_label ?? scope.groupName`) is what consumes it. If `item.create`'s own response needs a brand label immediately, apply the same fallback here.
- [ ] Given a Member with an active `steward` membership on a non-business Group, filing any Item kind under that Group succeeds — was previously an `AuthorizationError`.
- [ ] Given a Member with only a `member`-role (not `steward`) on a non-business Group, filing an Item under it still throws `AuthorizationError` — the ownership check narrows, it does not disappear.
- [ ] Given a Member with a `member`-role (not `owner`) on a business Group, filing an Item under it still throws `AuthorizationError` — unchanged from today.
- [ ] Test: gathering filed under a non-business Group by its steward succeeds end-to-end (this is the scenario's own "hosting requires no shop" acceptance criterion).
- [ ] BUILD-LOG.md updated.

## Notes

**"Nothing gates selling" is the reviewed model — this ticket does not add a business check, it removes one.** The business record is a claim, not a permission (per `review-F060.md` § Architecture check). Do not add any `group_businesses` read to this authorization query; the only kind this ticket cares about is `groups.kind`, for choosing which role authorizes.
