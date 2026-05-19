# JOURNAL.md — PM Reverse-Chronological Log

**Latest entry at top.** Start here every session to understand project state.

> **Archive policy.** This file keeps only the most recent entry plus the pinned "Next session pickup" block. Older entries rotate to monthly archives so the live file stays fast to scan.
>
> Archives: [`planning/archive/JOURNAL-2026-05.md`](planning/archive/JOURNAL-2026-05.md) · [`planning/archive/JOURNAL-pre-mission-clarity-2026-05-08.md`](planning/archive/JOURNAL-pre-mission-clarity-2026-05-08.md)

---

## 2026-05-18 — F018 deferred back to backlog; Phase 1 evals committed (web `0508576`)

**F018 deferred.** PM call: F018 (Run Club) moves back to `planning/scenarios-backlog/` and stays there until the b1 implementation plan explicitly recommends pulling it in. The 2026-05-18 pipeline-review REVISE verdict stands as the rewrite punch list (item.md state-enum reconciliation; design-language.md 3 component recipes; `/i/` → `/e/` + kind-label harmonization). Rationale: T045–T049 (Phase 1 schema tickets) do not depend on F018; they open against system specs directly. Holding F018 in `scenarios/` while it needs a rewrite was creating false pressure on the spec-blocker gates. Review file annotated; scenario front-matter status updated to "deferred (2026-05-18)."

**Phase 1 evals committed (web `0508576`).** Six spec files under `web/evals/phase-1/` — `floor.spec.ts`, `locations.spec.ts`, `members-affinities.spec.ts`, `members-agent-assistance.spec.ts`, `members-augmentation.spec.ts`, `members-interests-follows.spec.ts`. 1838 lines of T045–T049 schema/RLS/trigger/handler assertions. Plus `dotenv` + `playwright.config.ts` env-loading plumbing. Same commit folded the locations centroid regex fix (full-precision `ST_AsText` output — switched to parse-and-`toBeCloseTo(..., 4)`). 16/16 in `locations.spec.ts` pass against the current schema; the rest will turn green as T045–T049 land. M3 gate is on disk.

## 2026-05-18 — Reviewed F018 — verdict: REVISE + small EXTEND; see [`planning/reviews/F018-review.md`](planning/reviews/F018-review.md)

Fresh pipeline-review on the canonical Run Club scenario (supersedes the 2026-05-08 PROCEED). Architecture substrate is still in place (Item primitive, gathering child, Location, venue-page CTA). Three small things must land before tickets: (1) `item.md` `state` enum reconciliation with the publish-event semantics; (2) `design-language.md` adds three component recipes (kind picker, Share-link affordance, Event-page recurring-gathering surface); (3) F018 scenario fixes `/i/` → `/e/` (stale from before the 2026-05-11 naming pass) and harmonizes kind-picker labels with `event-host.md` (drops "gathering" from UI copy). Loop fidelity (1 + 4), shell-entity check, and policy posture all pass.

**Same-day — ADR backlog cleanup + JOURNAL prune.** While the Phase 1 eval-write was in flight on a parallel agent, completed two parent-repo housekeeping passes that don't touch `web/`:

1. **ADR stub backlog closed.** Six "pending file creation" ADR rows in `DECISIONS.md` now have canonical files: [`ADR-0001-tech-stack.md`](planning/adrs/ADR-0001-tech-stack.md), [`ADR-0002-bottom-anchored-ui.md`](planning/adrs/ADR-0002-bottom-anchored-ui.md), [`ADR-0005-markets-as-gathering-items.md`](planning/adrs/ADR-0005-markets-as-gathering-items.md), [`ADR-0006-agent-assistance.md`](planning/adrs/ADR-0006-agent-assistance.md), [`ADR-0007-action-layer.md`](planning/adrs/ADR-0007-action-layer.md), [`ADR-0009-policy-framework.md`](planning/adrs/ADR-0009-policy-framework.md). Each follows the `_template.md` shape; each cross-references its home doc (the home doc stays load-bearing; the ADR file is the canonical index entry per `adrs/README.md` § What belongs here). `DECISIONS.md` pointer rows lost the *(pending file creation)* markers; the closing-paragraph note rewritten to reflect the backlog closure.

2. **JOURNAL rotated.** Per the archive policy banner, May 11–17 entries (ADR organization restructured, payments.md walk, Intent-audit pass + clarify-absolutes / dialectic skills + groups.md walk, agent-commerce amendment, ADR-15/16 ratification, root-level philosophy moves, action-layer graduation + producer-* re-anchor + Phase 4 doc cleanup + naming pass) all moved to [`planning/archive/JOURNAL-2026-05.md`](planning/archive/JOURNAL-2026-05.md). Live file kept just this top entry + the pinned pickup. No silently-load-bearing decisions surfaced as unmemorialized — every commitment in the archived entries already has a home in a spec, ADR, or skill workflow.

---

## Next session pickup

*(Pinned. Rewritten at the close of every session. The list below is the *current* set, not history.)*

1. **Phase 0 — DONE 2026-05-10.** All four tickets shipped, runtime-verified end-to-end. Substrate installed: pgvector + postgis; members + member_events with audit fields; system Member; action layer + `member.create` handler with conformance check; auth signup hook reading Vault. Smoke test (curl-spawn fresh auth user → row + event appear in 2s with correct audit fields) passes. See `web/BUILD-LOG.md` for the full closing record.

2. **Phase 1 evals in flight (2026-05-18).** Parallel agent writing `web/evals/phase-1/floor.spec.ts` — six tickets' worth of schema / RLS / trigger / handler assertions plus traceability comments, sized comparably to Phase 0's `floor.spec.ts` (22 tests). M3 gate; runs *before* tickets open. When the eval write closes, PM commits the web/ changes; then `pipeline-review-absolute` runs per rebuild-rule #11 on any Category-2 absolutes the Phase 1 tickets will encode.

3. **Phase 1 ticket queue (renumbered by dependency, not by rebuild-plan section):**
   - **T045 — `007_locations.sql`** — Location spine + 3 children (permanent / recurring_temporary / areas) + events. Per `location.md` + ADR-14.
   - **T046 — `008_groups.sql`** — Groups spine + `group_businesses` + `group_event_anchored` + memberships + events. Per `groups.md` + ADR-13. Depends on T045 (`anchor_location_id` FK).
   - **T047 — `009_items.sql`** — Items spine + 4 kind children (product/service/gathering/wonder) + `item_locations` + `item_responses` + `item_tags` + `item_hashtags` + events. Per `item.md`. Depends on T045 + T046.
   - **T048 — `010_members_augment.sql`** — Adds FKs from `members.home_location_id` → locations and `members.primary_group_id` → groups; adds child tables (privacy, interests, follows, handle history, threads + messages + participants, self-records, delegations, location affinities). Depends on T045 + T046.
   - **T049 — `011_discoverable_items.sql`** — Materialized view + `item.published` refresh trigger + indexes. Depends on T045 + T046 + T047 + T048.

4. **Phase 1 numbering note** — the rebuild plan listed Phase 1 by primitive (007 members augmentation, 008 locations, 009 items, 010 groups, 011 discoverable_items). The dependency graph (`members.home_location_id` → locations; `groups.anchor_location_id` → locations; `items.group_id` → groups) requires the order above. Numbering shift recorded in DEVIATIONS at T045 ticket open.

5. **Build-agent provisions test-only RPC helpers** alongside the Phase 1 tickets (called from the Phase 0 eval, never inspected per the firewall): `eval_pg_extensions`, `eval_table_shape`, `eval_is_partitioned`, `eval_conformance_check_result`, `eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`. Could fold into T048 (members augmentation) since it touches the same surface.

6. **F018 deferred (2026-05-18).** Scenario back in `planning/scenarios-backlog/`; no longer a gate on T045–T049. Rewrite punch list ([F018-review.md](planning/reviews/F018-review.md)) stands for when the b1 implementation plan recommends pulling F018 back in: `item.md` state-enum reconciliation, three `design-language.md` component recipes (kind picker, Share-link, Event-page recurring surface), `/i/` → `/e/` + kind-label harmonization with `event-host.md`.

7. **All pre-primitives scenarios archived as of 2026-05-11.** F019-F024 scrapped 2026-05-10; F001-F017 scrapped 2026-05-11 (PRE-PRIMITIVES-AUDIT-2026-05-11.md in `planning/scenarios-backlog/archive/` documents the mapping). Live `planning/scenarios/` contains only F018 (canonical post-primitives example). Fresh Phase 2/3 scenarios will be authored under the current primitives when those phases open. F-numbers continue from F025+.

8. **Phase 2/3 scenarios to author fresh** (when Phase 0+1 close): per the rebuild plan, Phase 2 surfaces are `/m/[handle]`, kind-specific Item URLs (`/e/`, `/p/`, `/s/`, `/i/`, `/o/`, `/a/`, `/initiative/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (event / product / service), "Sell" walkthrough (creates kind='business' Group), Item-level QR card affordance. Phase 3 surfaces are `/explore` (no-login), `/g`, `/g/new`, `/why`, Wonder composer, Concerts-in-the-Park feed, anonymous Loop 3 path. Each gets a fresh F-numbered scenario via `pipeline-product` → `pipeline-plan`.

9. **Phase 4 doc cleanup — DONE 2026-05-11.** All items completed. Live `product/` tree has no stale pre-primitives framing.

10. **Deferred doc cleanup — pick up at the Phase 1 → Phase 2 boundary (after T049 closes).** The `notes/` → `planning/` migration is half-done as of 2026-05-11; the riskiest piece (moving `notes/migration-to-primitives.md` itself, which every STALE-banned ticket and the active T045–T049 tickets reference) was deferred to avoid mid-phase reference breakage. Remaining work: (a) `mv notes/migration-to-primitives.md planning/migration-to-primitives.md`; (b) update ~25 references in STALE banners on tickets T028–T040, DEVIATIONS.md (lines 60 + 112), PIPELINE-AUDIT.md (5 spots), DECISIONS.md (ADR-10 row), `product/foundation/platform-promise.md` (line 11), `product/systems/location.md` (line 166), the CLAUDE.md "What ships in the rebuild MVP" row; (c) `rmdir notes/` once empty; (d) move `notes/archive/skills-migration-plan.md` → `planning/archive/skills-migration-plan.md`.
