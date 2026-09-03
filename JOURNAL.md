---
purpose: Session log — one plain-English headline + pointer per entry. Never the load-bearing copy of any decision or fact.
layer: how
status: active
---

# JOURNAL.md

One block per session, newest at top. Each entry leads with a **one-sentence plain-English headline** naming what changed — readable cold, no F-numbers / T-numbers / schema identifiers in the headline. Optional 1–3 sentences of context follow. Each entry ends with a **pointer line** citing the durable doc(s) by name and section + the commit hash. The fact lives in the spec; the journal points to it.

Headline test: a reader returning after three weeks should know from the headline alone whether to open the pointer or skip past. If the headline only makes sense to someone with full project context loaded, rewrite it.

Rotation: anything older than 30 days moves to a monthly archive. Pre-2026-05-30 entries archived at [`planning/done/2026-05-30-journal-pre-cleanup/`](planning/done/2026-05-30-journal-pre-cleanup/).

---

## 2026-09-02 — Ratified navigation architecture: compact bottom nav (b1) + category top slider in Home (b2)

Two UI-scope decisions via `weigh`. (1) Bottom nav shrinks from 52px to 44px — compact, TikTok-proportioned, icon-dominant. Ships at b1. (2) Home gains a category-based top slider at b2 — "Buy / Do / Learn" intent switcher, not a "For You / Following" feed-mode toggle. The three-tab bottom nav stays; the top slider supplements it within Home only. Also ratified: kind-filter pills stay fixed when nav hides on scroll-down (F046).

3 statements walked: 3 ratified, 0 deferred, 0 revised, 0 rejected.

- **Ratified:** `product/ui/design-research-thesis.md` §2 — nav height 52→44px, icon 24→20px, label 10→9px (Intent landed)
- **Ratified:** `product/ui/design-research-thesis.md` §2 — top slider as category-based Home sub-nav at b2 (Intent landed)
- **Ratified:** `planning/backlog/scenario-F046-member-scrolls-and-nav-hides.md` — pills stay fixed when nav hides (section closed)

→ design-research-thesis.md §2; decision-surfaces.md § TikTok top-slider; community-platform.md § T2 Home; scenario-F046; scenario-F047. Commit {pending}.

---

## 2026-06-16 — Reviewed F037 (Locally Owned claim) — PROCEED, all substrate shipped

Mandatory rebuild-phase review on the Locally Owned claim scenario. Architecture: every table, handler, function, and event type already exists (T075 S-jurisdictions substrate). The surface is a narrow owner-view widget on F035's Shop page — reads `member_business_jurisdictions`, writes via `member.business_jurisdiction.set/.remove`, badge derives at query time via `zip_is_proximal_to_location()`. Design: DLS needs an "owner-view section" pattern (role-gated management section on a public page); can land inline with the first ticket. Loop number discrepancy noted (scenario says Loop 7 = Buy close; spec says Loop 9).

→ `planning/now/review-F037.md` (verdict: PROCEED); next skill: `ticket`.

---

## 2026-06-15 — Reviewed F033 (venue page) — PROCEED, Host/Venue filtering is clean

Mandatory rebuild-phase review on the rewritten venue-page scenario. Architecture check: all required schema exists (anchor_location_id, item_locations, member_saved_searches, discoverable_items MV). The Host/Venue distinction — scoping "What's happening here" by `items.group_id` (Host) rather than `item_locations` (Venue attachment) — uses existing FKs cleanly. Design check: DLS § Venue page needs a CTA hierarchy update (Follow primary, Host secondary) before tickets open. Accessibility (M3): expandable nearby section needs ARIA, follow-button state needs screen-reader communication.

→ `planning/next/review-F033.md` (verdict: PROCEED); DLS update bundled with first ticket.

---

## 2026-06-06 — Deferred "Locally Made" badge — the definition of local depends too much on the product

The feature is fully built on branch `t-f039` (T099–T101, 6/6 eval GREEN, not merged). But the proximity model — whether lineage-based or radius-based — answers a geographic question when the real question is about provenance trust, and that varies by product type. Paused indefinitely. Branch can be revisited or discarded.

→ `planning/now/scenario-F039-maya-claims-locally-made.md` (status → deferred); branch `t-f039` (unmerged).

---

## 2026-06-02 — Newcomer signup + locality feed eval went green and merged; documented the local-Supabase recovery dance

The newcomer-signup feature's eval (anon locality feed, empty-state widen, email/password signup → onboarding → scoped feed, returning-member detection) had been blocked by a prior session's interrupted local-database reset. The block was environmental, not code: the local auth schema was left at an ancient revision (missing `email_confirmed_at`) and the post-signup hook's Vault secrets were wiped, so new signups never got a member row and onboarding's first write hit a foreign-key violation. Recovered without another reset — let the auth service replay its migrations, then re-created the two signup-hook Vault secrets to match `web/.env.local`. One real code fix: the eval fixture wasn't setting an item-location's schedule kind, so the discoverable-items view left the location geography null and the feed returned zero items; added the column + error-checking, and dropped a client-side password length minimum. 4/4 green, merged to main, pushed. Telemetry refreshed.

**Forward note:** the recovery procedure is now a runbook — read it before touching a wedged local eval env instead of reaching for a reset again. The pre-warm-the-dev-server tip lives there too (cold compile vs the 5s eval timeout).

→ [`operations/RUNBOOK.md`](operations/RUNBOOK.md) § Recover the local eval environment; `planning/STAGE-LEDGER.md` F030 row (`done`); `web` @ 07b35a0 (merge), T090 @ ea503b4.

---

## 2026-06-01 — Retired the project-scaffolding skill and cleaned up the last reorg path misses

The local `scaffold` skill taught the old 11-directory planning structure (`scenarios/`, `scenarios-backlog/`, `bundles/`, `DECISIONS.md`); keeping it would make any future scaffolded project start in the wrong shape and need the same migration we just did. Deleted the skill and pulled its routing rows from CLAUDE.md, AGENTS.md routing, REGISTRY, skills/README, and orient. Also swept the four straggler path cites the reorg missed: the Gate A rule in CLAUDE.md + AGENTS.md (now `backlog/` → `next/`) and two BUILD-LOG bundle links (now `planning/now/bundle-1.md`). **Forward note:** if we scaffold a new project later, start from a current snapshot of this repo's structure rather than the retired template.

→ `skills/` (scaffold dir removed); `CLAUDE.md` § Agent routing + rebuild rule 11 Gate A; `AGENTS.md` Gate A; `web/BUILD-LOG.md`.

---

## 2026-06-01 — Drafted three small-win scenarios to unblock the producer track post-F036

F035 (viewer finds Maya's Shop), F037 (Maya claims Locally Owned Tier 0), F039 (Maya claims Locally Made Tier 0). All three Gate A pre-flight to PASS at draft time. F035 has no substrate gate and can ratify immediately; F037 gates on S-jurisdictions; F039 gates on S-jurisdictions AND F038 (product composer). The community-Group flavor of F035 (Run Club viewer) defers to same F-number, different slug, after F034 lands.

Together these three green three of the four F036 forward-dep failures once their substrates + this work ship: F035 → `:167`, F037 → jurisdiction half of `:266`, F039 → provenance half of `:266`. Polygon-seed half of `:266` belongs to T058 substrate work, not these scenarios.

→ `planning/backlog/scenario-F035-rosa-finds-mayas-shop.md`, `planning/backlog/scenario-F037-maya-claims-locally-owned.md`, `planning/backlog/scenario-F039-maya-claims-locally-made.md`; STAGE-LEDGER F035 / F037 / F039 rows annotated with scenario-drafted dates + gate verdicts.

---

## 2026-06-01 — Shipped the Sell walkthrough surface; F036 evals at 5/9 with named forward-deps

T073 + T073b both merged to main. T073b expanded scope mid-loop — the two named bugs (composer accessible-name collision, `<Link>`-vs-`<button>` on `/you/sell`) sat upstream of three latent surface fixes (`sellCreateLocationAction` RLS bypass, `sellActivateAction` FK rewrite, AnchorLocationStep state) plus a `role="link"` skip — six fixes total instead of two. Eval surfaced the chain after the named ones unblocked. F036 evals now 5/9 passing; four remaining failures are all forward-deps (F035 Group public page, F038/F040/F034 composers, F037 Locally Owned claim, T058 polygon seed) logged as DEVIATIONS-accepted-as-is under T073's section.

→ `development/tickets/done/T073-…md`, `development/tickets/done/T073b-…md`; DEVIATIONS at `development/DEVIATIONS.md` § "T073 — forward-dep gaps surfaced 2026-06-01"; web commits per CC report; STAGE-LEDGER F036 row → `eval 2026-06-01` (partial-pass, gated on forward-deps).

## 2026-06-01 — Ratified: CC runs the merge with PM permission, same pattern as commits

Second instance of the commit-drift problem. CLAUDE.md and the build skill files said "PM merges from Mac terminal." Reality is the same shape as commits: CC asks, runs on `y`. Fixed CLAUDE.md § Commit Rules (new merge-permission paragraph), `playbooks/DEVELOPMENT-PATTERNS.md` § "Commit and merge code with PM permission" (extended), and both `skills/build/SKILL.md` + `skills/build/workflow.md` (new step 18 + handoff rewrite). Two prompts at ticket close — commit y/n, then merge y/n — because the remedies differ (amend vs. defer).

→ `CLAUDE.md` § Commit Rules; `playbooks/DEVELOPMENT-PATTERNS.md` § "Commit and merge code with PM permission"; `skills/build/SKILL.md`; `skills/build/workflow.md` step 18.

---

## 2026-06-01 — Picked "Shop" as the user-facing label for business Groups

The CLAUDE.md naming table already had it ratified — schema stays `groups.kind='business'`, URL stays `/g/[slug]`, CTA stays "Sell," only the noun in UI strings changes. T073 lands the Sell walkthrough with "Shop" everywhere ("Set up your Shop," "Your Shop is live," empty-state "You don't have a Shop yet"). F036 scenario body still reads "business Group" — schema-flavored drift, fix in a `tidy` pass after the bundle ships.

→ `planning/now/review-F036.md` § Decisions captured #2.

---

## 2026-05-31 — Shipped the inline "add a thing without leaving the composer" sub-flow

Third of the four Sell-walkthrough tickets. Generic single-form drawer that stacks above the multi-step composer so a Member can create a referenced entity (a Location, an Item, etc.) without losing the parent flow's state. **Nesting refusal** — a second drawer mounted inside the first throws at render with a load-bearing error message, encoding the DLS spec's "never nest deeper" rule as a runtime guard. Submit error is an `aria-live=assertive` alert region; ESC + X + Cancel all dismiss. Full focus-trap and the parent's "paused" visual (-8px / 60% opacity) deferred to a shared a11y follow-up with T071. 10/10 vitest GREEN.

→ `development/tickets/done/T072-add-entity-drawer-sub-flow.md`; M2 + M3 trail at `development/DEVIATIONS.md` § 2026-05-31 — T072; STAGE-LEDGER F036 row updated; web commit `3276666` merged as `08d7667`.

## 2026-05-31 — Shipped the generic multi-step composer that the Sell walkthrough and three sibling composers will share

Second of the four Sell-walkthrough tickets. Generic, presentational + control-flow component — consumers supply step definitions + persistence callbacks; the composer handles indicator / navigation / partial-state / submit-error UI. Two a11y gaps closed pre-commit (ESC dismissal + focus restore on unmount); full focus-trap and shared `<Drawer>` / `<Modal>` primitives flagged for a follow-up a11y cleanup. 13/13 vitest GREEN. Dev verify route at `/composer-demo`.

→ `development/tickets/done/T071-multistep-composer-base.md`; M2 + M3 trail at `development/DEVIATIONS.md` § 2026-05-31 — T071; STAGE-LEDGER F036 row stamped `building` with T070 + T071 done; web commit `d31f3ff` merged to main as `3c64571`.

## 2026-05-31 — Shipped the schema + handlers behind the Sell walkthrough's save-as-you-go composer

First of the four Sell-walkthrough tickets. Two critical issues caught by pre-commit code review landed in the same loop (concurrent-activate race in update-draft; slug collision on simultaneous draft creates); three smaller suggestions folded in via a new shared-constants file; four deferred with rationale in DEVIATIONS. 40/40 vitest GREEN.

→ `development/tickets/done/T070-groups-lifecycle-state-and-draft-handlers.md`; M2 trail at `planning/now/review-F036.md` § T070 M2 code-review; DEVIATIONS at `development/DEVIATIONS.md` § 2026-05-31 — T070; STAGE-LEDGER F036 row stamped `building` with T070 done; web commit `d8204c7` on branch `t070` (merge to main pending M4).

## 2026-05-31 — Propagated yesterday's business-Group ownership rules into locality and discovery

Locality query for kind='business' Groups now OR-aggregates across all active owners' jurisdiction rows (no founder-privileged source). Discovery defines "surfacing demotion" for inactive business Groups — they slide down promoted feeds and search defaults but are never hidden, archived, labeled, or notified. Closes the cascading work surfaced by yesterday's `groups.md` weigh.

→ `product/systems/business-jurisdiction.md` § Locality query; `product/systems/discovery.md` § Surfacing demotion for inactive kind='business' Groups; commit pending.

## 2026-05-31 — Wrote the Playwright test spec for the Sell walkthrough before any build code

8 tests covering all 5 acceptance criteria + 3 edge cases (anchor-Location inline-add, walkthrough abandonment with resume, existing-business-Group routing). Each non-mechanical assertion carries a `// Why:` comment anchored to the scenario clause it protects. Fixture file `web/evals/fixtures/F036-maya.ts` does not yet exist — build agent lands it before run-mode.

→ `web/evals/features/F036-member-creates-business-group-via-sell-walkthrough.spec.ts`; commit pending.

## 2026-05-31 — Broke the Sell walkthrough into four tickets: schema first, then three UI pieces

T070 lands the `groups.lifecycle_state` migration, RLS policy, action handlers, and `group.activated` event. T071 extracts a generic multi-step composer base consumed by F036 + the three other b1 composers (F034 / F038 / F040). T072 adds the secondary-drawer sub-flow pattern for inline "+ Add new" affordances. T073 composes the above into the Sell walkthrough surface itself. Sequence: T070 → T071 → T072 → T073.

→ `development/tickets/T070`–`T073`; STAGE-LEDGER stamped `ticketed 2026-05-31`.

## 2026-05-31 — Added a draft/active lifecycle field to Groups so partial composer state can persist before publishing

New `groups.lifecycle_state` column (`'draft' | 'active' | 'dissolved'`, default `'active'`). Public discovery surfaces filter to active only; RLS policy `groups_select_active_or_own_draft` carves out owner visibility for in-flight drafts. New `group.activated` event fires on draft → active promotion (final-step composer submit). Unblocks F036 ticket-writing.

→ `product/systems/groups.md` § Schema; commit pending.

## 2026-05-31 — Added a multi-step composer recipe to the design language — the Sell walkthrough is the first of four to use it

Canonical shape for guided multi-step flows (Sell walkthrough F036, gathering composer F034, product composer F038, service composer F040): step indicator, progressive validation, partial-state preservation via substrate writes on each Continue, draft → active promotion on final submit. Companion **secondary-drawer sub-flow** pattern: the picker step's "+ Add new" opens a stacked single-form drawer over the parent composer; never nest deeper. Cleared the EXTEND verdict on F036's pre-flight review.

→ `product/ui/design-language.md` § Component recipes → Multi-step composer; § Surface patterns → Add new entity inside a composer.

**Downstream patches surfaced for `explore` to drain:** `groups.md` lifecycle_state (landed in same session above); `business-jurisdiction.md` locality OR-aggregation (landed above); `discovery.md` surfacing demotion (landed above); "Shop" vs "business Group" copy convention (PM call still pending).

## 2026-05-31 — Approved the Sell walkthrough scenario — and decided how Groups handle business ownership

F036 cleared Gate A after the `groups.md` weigh session ratified the four cited absolutes. Scenario moved from `scenarios-backlog/` to `scenarios/`; one drift fix to the capabilities footer to match the new co-equal owner model. Ticket-writing remained blocked on the design-language EXTEND verdict (cleared in the entry above this one).

**Weigh outcome — `groups.md`.** Four absolutes walked: 2 revised + ratified, 2 ratified as drafted.

- **Revised + Ratified:** `product/systems/groups.md:88-93` — owners are now co-equal on member-management and dissolution; staff get producer-tool access (post on behalf, edit own Items) but can't manage roster or dissolve; `founder_member_id` is a historical label only. Locally-Owned badge sources from "any current owner is local → badge applies" (OR across owners). PM direction: the platform is not a CRM for business ownership; adding a Member is the only access-granting verb.
- **Ratified:** `product/systems/groups.md:114` — self-declaration over observation as the casual↔commercial trigger. Observation-path remains an open question without a Deferral trigger.
- **Revised + Ratified:** `product/systems/groups.md:124-131` — retired auto-dormancy and founder-only revival for kind='business'. Business Groups have no auto-dormancy or auto-dissolution; discovery (per `discovery.md`) handles surfacing of inactive Groups; only explicit `group.dissolve` by an owner ends a Group. Revival concept retained for community kinds only.
- **Ratified:** `product/systems/groups.md:365` — no auto-Group assignment; explicit-vs-soft_via_* source distinction holds.

Cascading work landed in the same day's entries above (business-jurisdiction locality query, discovery surfacing demotion). Action-handler catalog edits: dropped `group.transfer_operating_ownership`, `group.set_locality_source`, plus their two events; added `group.member_remove`; made several handlers owner-only.

→ `planning/now/scenario-F036-…md`; `product/systems/groups.md` § Ownership, § Lifecycle; STAGE-LEDGER `plan-approved 2026-05-31`.

## 2026-05-31 — Reviewed the Sell walkthrough scenario ahead of approval — verdict EXTEND on design-language gaps

Architecture clean — full Phase 1 substrate supports F036 with no new tables / columns / events. Design verdict EXTEND because `design-language.md` lacked a multi-step composer recipe and an inline "add new entity" pattern. F036 is the first of four b1 composers (F034 / F038 / F040 follow); the shared `<MultiStepComposer>` base should be extracted in F036's tickets. Sibling check flagged a "Shop" vs "business Group" copy mismatch between root `CLAUDE.md` naming table and the scenario body.

→ `planning/now/review-F036.md`; STAGE-LEDGER stamped `EXTEND 2026-05-31`.

## 2026-05-30 — Injected stable IDs into every narrative doc and rebuilt the registry

148 docs across `product/`, `planning/`, `development/`, `standards/`, `playbooks/`, `skills/` picked up `id:` frontmatter via `scripts/inject-doc-ids.py` (idempotent; `why-` / `what-` / `how-` prefixes by layer). REGISTRY rebuilt via `scripts/rebuild-registry.py` — 150 docs (5 why, 30 what, 115 how). 9 closed kanban items archived from `planning/done/` to `_attic/2026-05-30-kanban-done-batch/`. Reorg-12 Phases B + C (ref conversion + tidy check) remain deferred per spec. Pulled the b1 surface sequence to `now/`.

→ `REGISTRY.md`; `planning/now/`; commit c43101c.

## 2026-05-30 — Ratified two decisions by PM override: how to route work items, and Members default to private

PM exercised the AGENTS.md §3 override to ratify both decisions without running the `weigh` dialectic. Lane-routing rule lands in `playbooks/DEVELOPMENT-PATTERNS.md`; default-private Member discoverability lands in `playbooks/PLATFORM-PATTERNS.md`. Implementation follow-ups for the Member decision park in `member.md` spec work.

→ `playbooks/DEVELOPMENT-PATTERNS.md` § Route work items by ratification need; `playbooks/PLATFORM-PATTERNS.md` § Default Member discoverability to private.

## 2026-05-30 — Stood up `playbooks/` and migrated 19 ratified ADRs into pattern entries

New playbook docs: `DECISION-PATTERNS.md`, `PLATFORM-PATTERNS.md`, `DEVELOPMENT-PATTERNS.md`, `writing-docs.md`, `repo-tidying.md`. ADR-0001 → ADR-0025 absorbed: 12 into PLATFORM, 6 into DEVELOPMENT; ADR-0016 left alone for PM review-pass; ADR-0024 ratified inline. Absorbed `meta/cowork-pipeline/DEV-PATTERN.md` into DEVELOPMENT-PATTERNS § Pipeline patterns + § Pipeline anti-patterns. Multiple archives created (intent reviews, done sprints, pending ratifications, historical phase-2 strategy). Rewrote `CLAUDE.md` + `AGENTS.md` doc-maps. Demoted JOURNAL itself to pointer-log form (which today's session — 2026-05-31 — further refined to hybrid headline + pointer form).

→ `playbooks/`; root `CLAUDE.md`; root `AGENTS.md`; commit pending.
