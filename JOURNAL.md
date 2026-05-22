# JOURNAL.md — PM Reverse-Chronological Log

**Latest entry at top.** Start here every session to understand project state.

> **Archive policy.** This file keeps only the most recent entry plus the pinned "Next session pickup" block. Older entries rotate to monthly archives so the live file stays fast to scan.
>
> Archives: [`_attic/2026-05-19/planning/JOURNAL-2026-05.md`](_attic/2026-05-19/planning/JOURNAL-2026-05.md) · [`_attic/2026-05-19/planning/JOURNAL-pre-mission-clarity-2026-05-08.md`](_attic/2026-05-19/planning/JOURNAL-pre-mission-clarity-2026-05-08.md)

---

## 2026-05-19 — Phase 1 substrate CLOSED — 142/142 evals green; ready for Phase 2

**Phase 1 done.** T054–T057 shipped end-to-end in a single session. Final state of the rebuild's schema floor:

- **T054** (web `678f5df`) — `member_delegations` empty-scopes CHECK fix (`cardinality()` idiom replaces broken `array_length`).
- **T055** (web `7f427b8`) — Groups schema: spine + 2 children + memberships + partitioned events + standing-tier view. Cross-table RLS recursion (SQLSTATE 42P17) caught at first apply and resolved via `current_member_explicit_group_ids()` SECURITY DEFINER helper. 25 tests.
- **T056** (web `f5e7e5a`) — Items schema: spine + 4 kind children + 4 join tables + partitioned events. State-enum reconciliation (`active` dropped; `draft`/`published`/`withdrawn`/`fulfilled`/`closed`) — single deviation from `item.md`, logged in DEVIATIONS; F018 rewrite punch list will land the matching spec text edit when F018 promotes. Closes T055's deferred FK on `group_event_anchored.seeded_by_item_id`. 27 tests, first-run clean.
- **T057** (web `6090f71`) — `discoverable_items` materialized view + `item.published` refresh trigger + browse indexes + anon-grant. Synchronous CONCURRENTLY refresh per ADR-10. SECURITY DEFINER on the refresh function because materialized views don't honor RLS — the view's own WHERE clause is the public-surface gate. 10 tests.

**Phase 1 ledger:**

| Surface | Tables | Tests |
|---|---|---|
| Members + auth + privacy + interests + follows + handles + delegations + affinities | 13 | 60 |
| Locations spine + 3 children + events | 5 | 16 |
| Groups spine + 2 children + memberships + events + standing view | 6 | 25 |
| Items spine + 4 kind children + 4 joins + events | 10 | 27 |
| Discoverable-items view + refresh trigger | 1 | 10 |
| Phase 0 floor (extensions, system Member, action layer, signup hook, conformance) | n/a | 4 |
| **Totals** | **~35 tables** | **142/142** |

Conformance check clean across 125 files / 32 protected tables; no writes outside the action layer. Action handlers do not exist yet for Locations / Groups / Items per the established Phase 1 pattern — they ship with Phase 2 surface composers that need them.

**Two going-forward rules added to DEVIATIONS at T055/T057 close:**

1. **RLS recursion** — Any policy that subqueries a table with its own RLS pointing back at the first table will infinite-loop. Use a SECURITY DEFINER helper that filters strictly on `auth.uid()`. Candidate trigger for a future `engineering:code-review` checklist.
2. **`eval_indexes_for_table` returns `pg_indexes` column names** (`indexname`, `indexdef`) — not camelCase. To assert uniqueness, regex `indexdef` for `CREATE UNIQUE INDEX`.

**Next:** Phase 2 — Cluster 1 surfaces. Per the migration plan: `/m/[handle]`, kind-specific Item URLs (`/p/`, `/s/`, `/e/`, `/i/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (no `/new` picker), Item-level QR card affordance, "Sell" CTA → kind='business' Group walkthrough. Phase 2 needs fresh F-numbered scenarios authored via `pipeline-product` → `pipeline-plan` against the now-closed Phase 1 substrate. F018 (Run Club, gathering composer) remains deferred in backlog as the rewrite candidate when the b1 implementation plan recommends pulling it in.

## 2026-05-18 — F018 deferred back to backlog; Phase 1 evals committed (web `0508576`)

**F018 deferred.** PM call: F018 (Run Club) moves back to `planning/scenarios-backlog/` and stays there until the b1 implementation plan explicitly recommends pulling it in. The 2026-05-18 pipeline-review REVISE verdict stands as the rewrite punch list (item.md state-enum reconciliation; design-language.md 3 component recipes; `/i/` → `/e/` + kind-label harmonization). Rationale: T045–T049 (Phase 1 schema tickets) do not depend on F018; they open against system specs directly. Holding F018 in `scenarios/` while it needs a rewrite was creating false pressure on the spec-blocker gates. Review file annotated; scenario front-matter status updated to "deferred (2026-05-18)."

**Phase 1 evals committed (web `0508576`).** Six spec files under `web/evals/phase-1/` — `floor.spec.ts`, `locations.spec.ts`, `members-affinities.spec.ts`, `members-agent-assistance.spec.ts`, `members-augmentation.spec.ts`, `members-interests-follows.spec.ts`. 1838 lines of T045–T049 schema/RLS/trigger/handler assertions. Plus `dotenv` + `playwright.config.ts` env-loading plumbing. Same commit folded the locations centroid regex fix (full-precision `ST_AsText` output — switched to parse-and-`toBeCloseTo(..., 4)`). 16/16 in `locations.spec.ts` pass against the current schema; the rest will turn green as T045–T049 land. M3 gate is on disk.

## 2026-05-18 — Reviewed F018 — verdict: REVISE + small EXTEND; see [`planning/history/F018-review.md`](planning/history/F018-review.md)

Fresh pipeline-review on the canonical Run Club scenario (supersedes the 2026-05-08 PROCEED). Architecture substrate is still in place (Item primitive, gathering child, Location, venue-page CTA). Three small things must land before tickets: (1) `item.md` `state` enum reconciliation with the publish-event semantics; (2) `design-language.md` adds three component recipes (kind picker, Share-link affordance, Event-page recurring-gathering surface); (3) F018 scenario fixes `/i/` → `/e/` (stale from before the 2026-05-11 naming pass) and harmonizes kind-picker labels with `event-host.md` (drops "gathering" from UI copy). Loop fidelity (1 + 4), shell-entity check, and policy posture all pass.

**Same-day — ADR backlog cleanup + JOURNAL prune.** While the Phase 1 eval-write was in flight on a parallel agent, completed two parent-repo housekeeping passes that don't touch `web/`:

1. **ADR stub backlog closed.** Six "pending file creation" ADR rows in `DECISIONS.md` now have canonical files: [`ADR-0001-tech-stack.md`](planning/adrs/ADR-0001-tech-stack.md), [`ADR-0002-bottom-anchored-ui.md`](planning/adrs/ADR-0002-bottom-anchored-ui.md), [`ADR-0005-markets-as-gathering-items.md`](planning/adrs/ADR-0005-markets-as-gathering-items.md), [`ADR-0006-agent-assistance.md`](planning/adrs/ADR-0006-agent-assistance.md), [`ADR-0007-action-layer.md`](planning/adrs/ADR-0007-action-layer.md), [`ADR-0009-policy.md`](planning/adrs/ADR-0009-policy.md). Each follows the `_template.md` shape; each cross-references its home doc (the home doc stays load-bearing; the ADR file is the canonical index entry per `adrs/README.md` § What belongs here). `DECISIONS.md` pointer rows lost the *(pending file creation)* markers; the closing-paragraph note rewritten to reflect the backlog closure.

2. **JOURNAL rotated.** Per the archive policy banner, May 11–17 entries (ADR organization restructured, payments.md walk, Intent-audit pass + clarify-absolutes / dialectic skills + groups.md walk, agent-commerce amendment, ADR-15/16 ratification, root-level philosophy moves, action-layer graduation + producer-* re-anchor + Phase 4 doc cleanup + naming pass) all moved to [`_attic/2026-05-19/planning/JOURNAL-2026-05.md`](_attic/2026-05-19/planning/JOURNAL-2026-05.md). Live file kept just this top entry + the pinned pickup. No silently-load-bearing decisions surfaced as unmemorialized — every commitment in the archived entries already has a home in a spec, ADR, or skill workflow.

---

## Next session pickup

*(Pinned. Rewritten at the close of every session. The list below is the *current* set, not history.)*

1. **Phase 0 — DONE 2026-05-10.** All four tickets shipped, runtime-verified end-to-end. Substrate installed: pgvector + postgis; members + member_events with audit fields; system Member; action layer + `member.create` handler with conformance check; auth signup hook reading Vault. Smoke test (curl-spawn fresh auth user → row + event appear in 2s with correct audit fields) passes. See `web/BUILD-LOG.md` for the full closing record.

2. **Phase 1 — DONE 2026-05-19.** Substrate complete: Members + Locations + Groups + Items + discoverable_items. T041–T057 all shipped. Phase 1 eval suite **142/142 green**. Conformance: 0 violations across 125 files / 32 protected tables. Tickets T054–T057 shipped end-to-end this session: T054 (delegations CHECK fix), T055 (Groups schema + SECURITY DEFINER helper for cross-table RLS), T056 (Items schema + state-enum reconciliation + deferred-FK closure), T057 (discoverable_items view + refresh trigger). See top JOURNAL entry for the full closing summary.

3. **Phase 2 — NEXT.** Fresh F-numbered scenarios authored at Phase 2 open. Surfaces per the migration plan: `/m/[handle]`, kind-specific Item URLs (`/p/`, `/s/`, `/e/`, `/i/`, `/o/`, `/a/`, `/initiative/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (no `/new` picker), "Sell" CTA → kind='business' Group walkthrough, Item-level QR card affordance. Action handlers for Members / Locations / Groups / Items land alongside the surfaces that need them. F018 (Run Club, gathering composer) is the rewrite candidate when the b1 implementation plan recommends pulling it in.

4. **Phase 1 numbering deviation** — the rebuild plan listed migrations 007–011 by primitive (members augment → locations → items → groups → discoverable_items). Dependency-driven actual order: 007 locations → 008 locations RLS → 009 members_phase1 → 010 member interests/follows → 011 member affinities → 012 agent assistance → 013 delegations CHECK fix → 014 groups → 015 items → 016 discoverable_items. No spec changes; closed cleanly.

5. **Eval-helper RPCs** — all shipped under T052 (Phase 0) and T053 (Phase 1): `eval_pg_extensions`, `eval_table_shape`, `eval_is_partitioned`, `eval_partition_count`, `eval_indexes_for_table`, `eval_foreign_keys_for_table`, `eval_conformance_check_result`, `eval_member_create_with_failure_injection`, `eval_seed_handle_collision_range`, `eval_clear_handle_collision_range`, `eval_seed_auth_user_only`, `eval_location_geography_text`. Bootstrap script in `web/scripts/bootstrap-eval-helpers.ts`.

6. **F018 deferred (2026-05-18).** Scenario back in `planning/scenarios-backlog/`; rewrite candidate for the Phase 2 gathering composer. Punch list ([F018-review.md](planning/history/F018-review.md)) — `item.md` state-enum text edit (T056 reconciled to `draft/published/withdrawn/fulfilled/closed` already; the spec text still needs aligning), three `design-language.md` component recipes (kind picker, Share-link, Event-page recurring surface), `/i/` → `/e/` URL pass + kind-label harmonization with `event-host.md`.

7. **All pre-primitives scenarios archived as of 2026-05-11.** F019-F024 scrapped 2026-05-10; F001-F017 scrapped 2026-05-11 (PRE-PRIMITIVES-AUDIT-2026-05-11.md in `_attic/2026-05-19/planning-scenarios-backlog/` documents the mapping). Live `planning/scenarios/` contains only F018 (canonical post-primitives example). Fresh Phase 2/3 scenarios will be authored under the current primitives when those phases open. F-numbers continue from F025+.

8. **Phase 2/3 scenarios to author fresh** (when Phase 0+1 close): per the rebuild plan, Phase 2 surfaces are `/m/[handle]`, kind-specific Item URLs (`/e/`, `/p/`, `/s/`, `/i/`, `/o/`, `/a/`, `/initiative/`), `/l/[slug]`, `/g/[slug]`, surface-specific composers (event / product / service), "Sell" walkthrough (creates kind='business' Group), Item-level QR card affordance. Phase 3 surfaces are `/explore` (no-login), `/g`, `/g/new`, `/why`, Wonder composer, Concerts-in-the-Park feed, anonymous Loop 3 path. Each gets a fresh F-numbered scenario via `pipeline-product` → `pipeline-plan`.

9. **Phase 4 doc cleanup — DONE 2026-05-11.** All items completed. Live `product/` tree has no stale pre-primitives framing.

10. **Deferred doc cleanup — pick up at the Phase 1 → Phase 2 boundary (after T049 closes).** The `notes/` → `planning/` migration is half-done as of 2026-05-11; the riskiest piece (moving `planning/rebuild-plan.md` itself, which every STALE-banned ticket and the active T045–T049 tickets reference) was deferred to avoid mid-phase reference breakage. Remaining work: (a) `mv planning/rebuild-plan.md planning/rebuild-plan.md`; (b) update ~25 references in STALE banners on tickets T028–T040, DEVIATIONS.md (lines 60 + 112), PIPELINE-AUDIT.md (5 spots), DECISIONS.md (ADR-10 row), `product/foundation/platform-promise.md` (line 11), `product/systems/location.md` (line 166), the CLAUDE.md "What ships in the rebuild MVP" row; (c) `rmdir notes/` once empty; (d) move `_attic/2026-05-19/notes/skills-migration-plan.md` → `_attic/2026-05-19/planning/skills-migration-plan.md`.
