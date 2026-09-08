# T136: Holding several Pages stops being a pathological state

**Scenario:** `planning/now/scenario-F060-someone-starts-something-without-opening-a-shop.md`
**Status:** Open
**Bundle:** launch (`planning/now/initiative-launch.md`), track A
**Depends on:** none

**Serves:**
- **Loop:** 7 (Make and be found) — Marcus (hot sauce + monthly swap) and Priya (run club, later a business) both end up holding more than one Page; today's code assumes one.
- **Canonical example:** P1, and the run-club case it does not cover.
- **Primitive shape:** Person → several Groups. No new entity, no new table — the schema already imposes no limit (verified in the scenario: `group_memberships` is many-to-many, `groups.founder_member_id` carries no unique constraint).

**Spec contract:** scenario § "Many Pages per person," § "Multi-Page consequences in the current build," acceptance criterion "Holding several Pages is ordinary, not an edge case."

## Workflow gates

- [ ] **M2 — `engineering:code-review`** on the diff before commit.
- [ ] **M4** — no migration.
- [ ] **DEVIATIONS.md entry** at close.
- [ ] **Close-out reconciliation** at close.

## Acceptance Criteria

**Draft-resume stops discarding a second draft:**
- [ ] `getDraftGroup` (`src/lib/sell/getDraftGroup.ts:100-109`) currently orders drafts by `created_at desc` and takes `limit(1)`, with a comment calling multiple drafts "pathological." Under this ruling, two business drafts in flight is a normal state (e.g. two owners on the same business each starting a draft, or one Member abandoning a draft and starting fresh without deleting the first).
- [ ] Change the read to return every open draft rather than silently picking the most recent, and update `SellRoutingSignal`/`DraftGroupSummary` (or add a list variant) so a caller can present more than one.
- [ ] `SellCta.tsx` (or whatever consumes the updated signal) does not silently discard a draft the Member hasn't seen — at minimum, do not regress the single-draft case; multi-draft display polish beyond "don't lose the Member's work" is not required by this ticket.
- [ ] Test: a Member with two open business drafts — both are visible in the routing signal; neither is silently dropped.

**The Sell CTA stops treating "no active business Group" as "you've started nothing":**
- [ ] `getDraftGroup` (`src/lib/sell/getDraftGroup.ts:76-92`) checks only `groups.kind = 'business'` for the active-membership signal — correct for deciding whether the *Sell* walkthrough should open, since selling and hosting are different creation processes. The bug is downstream: `SellCta.tsx`'s copy at line 174 ("Open a shop on SocialUs.") reads as "you have nothing yet" for a Member who already holds a non-business Page (a run club) and no business Page — which is false.
- [ ] Add a read for whether the Member holds any active non-business Group membership (steward role, per T132), and adjust the "fresh" branch copy in `SellCta.tsx` to acknowledge it when present — e.g. distinguishing "Open a shop" (genuinely nothing yet) from a variant that doesn't imply a blank slate for someone who already runs a Page. Exact copy is a build-time call; the acceptance bar is that the string does not claim the Member has started nothing when they have.
- [ ] The routing/destination behavior (which walkthrough opens) is unchanged — this is a copy-accuracy fix, not a re-routing.
- [ ] Test: `labelFor`/the rendered row's copy differs for a Member with an existing non-business Page vs. a Member with no Page of any kind.
- [ ] BUILD-LOG.md updated.

## Notes

**Neither fix is a rewrite.** The scenario's own audit confirms: the schema imposes no limit, the sell index already iterates rather than assuming one, no switch-context surface exists, no notifications exist. This ticket closes the two reads that hadn't caught up, not a redesign of the Sell entry point.

**Not in scope:** building `/you/create` or the two-way "what are you starting?" question (`Both` was dropped 2026-09-07 — it's two answers, not three) — that's the scenario's own centerpiece surface, ticketed separately as **T139**, not part of this ticket. This ticket only fixes the two existing reads named above. Aggregating messages or activity across a person's several Pages is parked (scenario § Parked) — do not build it here.
