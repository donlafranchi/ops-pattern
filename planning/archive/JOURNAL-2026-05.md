# JOURNAL — May 2026 archive

> Archived from the active [`../../JOURNAL.md`](../../JOURNAL.md) on 2026-05-10 as part of the journal/decisions weight-reduction. The active JOURNAL keeps only the current top entry and a pinned "Next session pickup." Older entries live here for trace.

For pre-mission-clarity entries, see [`JOURNAL-pre-mission-clarity-2026-05-08.md`](JOURNAL-pre-mission-clarity-2026-05-08.md).

---

## 2026-05-10 — Groups ratified · Location spec landed · anti-Nextdoor reframed · QR cards become Item-level · multi-Location belonging · spec-tree cleanup · journal/decisions weight-reduction

**The big move.** Two sessions today closed three architectural decisions that had been pending, one foundational reframe, and one process refactor on how decisions and journal entries are stored. The b1 spec triplet (`groups.md`, `location.md`, `member.md`) is now internally consistent with each other, with `item.md`, `b1-primitives.md`, `CLAUDE.md`, and `DECISIONS.md`. The migration plan rewrite (`notes/migration-to-primitives.md`) is the next session.

**1. Groups ratified — Community / Member Operations / Cooperative retire.** `groups.md` flipped from DRAFT to Approved 2026-05-10. The Group primitive absorbs all three predecessors with one spine + child architecture (mirroring `item.md`): six kinds at b1 — five affiliate (`place`, `interest`, `practice`, `event_anchored`, `family`) and one operate (`business`). The kind='business' Group covers sole-prop / partnership / staff / cooperative-shape commercial relationships via owner-role and member-role memberships; co-owner-style coordination (voting, distributions, off-platform legal verbs) is **deferred indefinitely** — no `cooperative_*` schema lands at b1. ADR-13 pending formal write-up; the `groups.md` status banner carries the decision. ADR-8 fully superseded; ADR-11 fully superseded; ADR-12 reinterpreted (the "Become a Maker" CTA now creates/joins a kind='business' Group rather than declaring an Operation). `community.md`, `member-operations.md`, `cooperative.md` carry RETIRING banners.

**2. `product/systems/location.md` written (T1/T2/T3, ~340 lines).** The third foundational primitive finally has a spec. Spine + child architecture (`location_permanent`, `location_recurring_temporary`, `location_areas`), PostGIS geography on the spine (Point for all kinds; centroid for area), three kinds locked at create. Encodes ADR-2 / 4 / 5 / 6 / 7 / 9; ADR-14 (kind-split) pending formal write-up. Status: "Drafted 2026-05-10 — pending PM final read."

**3. Anti-Nextdoor reframed (load-bearing correction).** Nextdoor's failure is location-scoped commenting/messaging that attracts complaint posts — not Member-Location relationships per se. The corrected stance lives in two places, both *outside* Location structure: messaging-scope (item-or-group only, never Location-scoped) and complaint downvote/removal (with affirmative replacement: "create an Item to lead the fix"). Both commitments now live in `policy-framework.md`.

**4. Multi-Location belonging (new substrate).** New `member_location_affinities` table (b1 substrate, surface b2): `(member_id, location_id, affinity_kind)` with enum `lives` / `works` / `plays` / `visits` / `follows` / `liked`. `members.home_location_id` stays as the locality default per ADR-4; the affinity table is additive. The Concerts-in-the-Park surface (canonical example #12) is the load-bearing test case.

**5. QR cards reframed as Item-level on demand.** Any Member can request a QR card for any Item they own (`item.qr_card.request` action handler; `items.qr_card_url` column). The QR resolves to the Item's page. No Location gating, no participating-market enum, no kind restriction. Migration plan T045 (vendor-booth QR onboarding) is fully obsolete.

**6. Spec-tree cleanup (the unblocker for the migration plan rewrite).** Five must-fix edits across `item.md`, `b1-primitives.md`, `member.md`, `CLAUDE.md`, `DECISIONS.md`. Cooperative_cohort dropped from items.kind; pledge_intent dropped from response_kind; `community_id` → `group_id` rename; `qr_card_url` added to items spine; `primary_community_id` → `primary_group_id` rename; CLAUDE.md routing table updated; ADR-8/11/12 supersession banners landed.

**7. Journal + Decisions weight-reduction.** PM noticed both files were getting heavy. Audit confirmed real duplication (DECISIONS.md ↔ system spec status banners for ADR-3/8/11/12) and dense-history accretion (JOURNAL.md). New pattern adopted:
- **DECISIONS.md is state-only** — cross-cutting ADRs stay full but trimmed (no Context paragraph); single-system ADRs become one-line pointers to their spec's status banner. Superseded ADRs (3, 8, 11) moved to `planning/archive/DECISIONS-superseded-2026-05-10.md`.
- **JOURNAL.md keeps only the top entry plus a pinned "Next session pickup"** — older entries rotate to monthly archives (`planning/archive/JOURNAL-2026-05.md` is the first).
- **System specs gain a "Decisions encoded here" footer** so reverse-lookup works ("this spec is the home of ADR-X, Y").
- Net effect: DECISIONS.md ~520 lines → ~250; JOURNAL.md ~234 → ~80. Reading either file now gives you current shape in under a minute.

**Memory hygiene.** Three feedback memories saved earlier today: `feedback_qr_codes_vendor_only.md` rewritten end-to-end (QR-cards-are-Item-level); `feedback_anti_nextdoor_framing.md` new (the load-bearing distinction); `feedback_multi_location_belonging.md` new (people belong to many places).

The session's net effect: the b1 spec floor is internally consistent and migration-plan-ready. Three architectural decisions that had been pending all closed. The PM-facing surface (this file + DECISIONS.md) is now lighter and scannable. Next session opens cleanly on the migration plan rewrite.

---

## 2026-05-09 — ADR-12: Maker is now explicit and toggle-able (supersedes ADR-3)

**What.** PM revisited the Maker pattern and walked back the implicit-from-behavior posture from the original ADR-3. New decision: Maker is an **explicit, declared, toggle-able role.**

**ADR-12 appended to `planning/DECISIONS.md`.** Status: Accepted. Supersedes ADR-3 entirely. Refines ADR-8 (Operations remain the data primitive; ADR-12 adds the user-facing toggle layer on top). Three commitments:

1. **`members.maker_mode_enabled` boolean (default `false`).** A user-facing toggle, not a derived signal. New Members onboard with it off. The gathering and wonder composers are visible to everyone; the product / service composers and the Operation declaration walkthrough only appear when `maker_mode_enabled = true`.
2. **The "Become a Maker" CTA is the friendly entry to Operation declaration.** Per ADR-8, the underlying primitive is the Member Operation. The CTA walks the Member through capacity picker → label → optional `operating_for_member_id`. Completing the walkthrough creates the Operation row AND sets `maker_mode_enabled = true` in one transaction.
3. **Three distinct off-states, three distinct user actions:**
   - **Pause** — profile toggle. `maker_mode_enabled = false`. Operations + Items unchanged. Reversible instantly. (The user's stated requirement: "they can turn off being a maker in their profile.")
   - **End an Operation** — per-Operation `ended_at` set. Items remain.
   - **Stop being a Maker entirely** — composite action. Ends every commerce-shaped Operation + flips toggle off. Items remain published unless the Member separately withdraws them.

**Standing-tier gate (`member_has_standing_presence` per ADR-8) is unaffected by the Maker-mode toggle.** A Member who pauses Maker mode keeps their accumulated standing-tier surfaces (Self-Record, Skills, agent-assistance affordances). Maker mode is a *UI toggle*; standing-tier is a *data state*. The separation is deliberate — pausing during a vacation or a season shouldn't retract a year of accumulated context.

**Affected docs updated:** `member.md` (column added to DDL, action handlers `member.maker_mode.toggle` + `member.maker.full_stop`, event kind `member.maker_mode_changed`, Policy posture section walks the three filters); `member-operations.md` (T1 section clarifies Operation declaration is the user-facing CTA, profile rendering gated on `maker_mode_enabled`); `cooperative.md` (decisions-encoded line); `community-platform.md` (C7/C9/C10 rows updated; C13 retired; "Maker update" feed-card gated on the toggle; "Become a Maker" CTA added to /you); `member-self-record.md` (three references reframed); `b1-primitives.md` (column listed, ADR-3 "RESOLVED" line in Open questions rewritten under ADR-12); `migration-to-primitives.md` (`007_members.sql` ticket scope expanded to enumerate the column, action handlers, and event kind).

**Independent verification** caught one critical (b1-primitives.md still asserted the rejected implicit model in its Open questions resolution) and one significant (migration plan T028 ticket scope didn't enumerate the new column / handlers / event). Both fixed in-place.

**What this means for the build.** No new ticket count — the column lands in the existing 007_members.sql ticket; the two new action handlers land in the same ticket as the other Member action handlers. The "Become a Maker" CTA UX work joins the Phase 3 Member-page ticket set (currently STALE-banned, pending re-write per the broader migration audit). The Pause toggle UX is also a Phase 3 ticket. Nothing in Phase 0–2 changes.

**The walk-back is honest.** The original ADR-3's "no toggle, no claim flow, behavior-derived" posture was elegant but didn't survive contact with the canonical examples. Maya doesn't drift into being a Maker; she decides. The platform now treats that decision as load-bearing UX. People-first holds: still no Business entity, still no `role` column, still Maker-as-verb (declared via Operation) — the change is just that the *act of declaring* is now an explicit, named, toggle-able CTA rather than something the platform infers.

---

## 2026-05-09 — Migration plan audited + ratified, ADR-10/11 + cooperative.md landed, foundation gates hardened, tickets dispositioned

**What.** A second sweep this session to set up the migration to actually open. Five parallel agents ran an independent re-architecture of the entire pre-T028 surface; their findings folded back into the project as the following deltas:

**ADR-10 — Migration transactional model.** Drafted by the engineering:architecture skill, appended to `planning/DECISIONS.md`. Codifies the dual-write strategy (action layer is the only write surface; per-handler `dual_write` flag driven by a phase setting), event-row atomicity (row write + event write commit in same transaction or both fail; system Member as `acting_member_id` for backfilled events), discoverable_items refresh semantics (synchronous `REFRESH MATERIALIZED VIEW CONCURRENTLY` via AFTER INSERT trigger on `item_events.event_kind='item.published'` at b1; b1→T2 transition criterion p99 > 30s for one week), per-phase rollback (Phases 1–4 reversible; Phase 5 no-rollback after the 2-week zero-read verification window), and observability (dual-write divergence checker, event-row backlog, view staleness, action-handler latency, ticket revert rate).

**ADR-11 — Cooperative is a separate entity from Community.** Resolves the orphan `cooperatives.md` file at project root by moving it to `product/systems/cooperative.md` and ratifying the three-row separation: `cooperative_cohort` Item (formation-period posting) + `cooperatives` row (registered legal entity) + `member_operations` row with `cooperative_id` FK (Member's per-capacity declaration of co-ownership). Replaces the spec's old `cooperative_memberships` table with extensions to `member_operations` per ADR-8. b1 = schema reservation only (`cooperative_cohort` reserved as `items.kind` value, `cooperatives` and `cooperative_assets` empty); b3 surfaces the cohort posting / pledge flow / governance / federation. Cross-references added in `community.md` (kind=cooperative line) and `member-operations.md` (cooperative_member capacity description). *(Note: ADR-11 was superseded on 2026-05-10 — cooperative-style coordination deferred indefinitely.)*

**Migration plan rewrite.** `notes/migration-to-primitives.md` ratified ("Approved 2026-05-09" in the header), restructured into seven phases (Phase 0 = AI-native floor — pgvector, system Member, action layer scaffold, audit fields on existing event tables, embedding tables, auth post-signup hook — must merge **before T028**). Phase 1 expanded with all 11 Member b1 tables (007a–j) per `member.md`. Item event log gets `acting_member_id` + `via_delegation_id` per ADR-6. New tables `community_events`, `cooperative_events`. Community kind enum corrected from old `(general/neighborhood/interest/market_regular)` to new `(place/interest/practice/event_anchored/family/cooperative)`. The unified `/new` composer framing is dropped per the user's `feedback_unified_item_picker.md` memory — replaced with surface-specific composers per loop. Observability commitments and per-phase eval coverage sections added.

**Foundation principles hardened into pipeline gates.** Eight specific edits across the project skills made foundation alignment a hard check, not aspirational: pipeline-product templates now require a Policy posture section per ADR-9; pipeline-plan adds `people-first.md` and `policy-framework.md` to its mandatory-reads list; pipeline-review's architecture check grew three new sub-checks (Loop fidelity, Shell-entity smell, Policy posture present); the review template gets matching Schema-fit table rows; pipeline-ticket's template expands the Serves block (Loop / Canonical example / Primitive shape — must not be TODO placeholders) and adds a Workflow gates section (M2 code-review / M3 a11y-review / M4 deploy-checklist / DEVIATIONS.md entry); pipeline-router's session-start check grew from 5 to 7 steps (added stuck-scenario detection and stale-BUILD-LOG flagging).

**Existing tickets dispositioned.** T019 (geocoding), T020 (community pin flagging), T027 (event surfacing on vendor profiles) — all pre-mission-clarity, vendor-shaped, doomed by the migration — moved to `development/tickets/archive/` with ARCHIVED banners explaining what survives and where it re-emerges in the new plan. T028–T040 marked with STALE banners pointing at the corrected migration plan and the audit; they pre-date ADR-6/7/8/9/10/11 and the `member.md` spec, and need to be re-ticketed by `pipeline-ticket` against the corrected plan once Phase 0 lands. Critical operational fix: **F018-brian-declares-run-club.md moved from `scenarios-backlog/` to `scenarios/`** — closes the firewall violation that was blocking T036–T040.

**`b1-primitives.md`** updated: `cooperative_cohort` reserved in items.kind, "AI-native floor at b1" subsection added (pgvector, embedding tables, action layer, system Member, audit fields, MCP-ready handler shape).

**Internal-consistency verification pass** caught two critical inconsistencies (item.md kind enum was missing `cooperative_cohort`; item.md response_kind was missing `pledge_intent`), one significant (CLAUDE.md still listed `member-operations.md` as "NOT b1" despite ADR-8 making it b1-required), and two nits — all five fixed in-place.

---

## 2026-05-09 — Pipeline audited, AGENTS.md relocated, knowledge-work plugins wired, member.md drafted

**What.** Four moves landed in one session, all upstream of T028:

1. **Pipeline audit.** Independent re-architecture of the agent pipeline against the migration's risk profile (top stated risk: architectural mistakes). Twelve findings (4 critical, 5 significant, 3 polish), four solo-team multipliers added as gates (M1 ADR before plan · M2 code-review after build · M3 a11y-review on every new surface · M4 deploy-checklist before merge). The pipeline shape doesn't change; the operational rigor does. See [`planning/PIPELINE-AUDIT.md`](../PIPELINE-AUDIT.md).

2. **`AGENTS.md` moved to root.** It defines agents that work across `product/`, `planning/`, `development/`, `web/` — putting it under `planning/` was a category error. New location matches `CLAUDE.md` and `JOURNAL.md` (project-wide concerns at root). All references fixed across `CLAUDE.md`, `PIPELINE-AUDIT.md`, the F018 walkthrough, and the `pipeline-router` + `pipeline-scaffold` skill workflows. The scaffold skill now also tells future projects to put AGENTS.md at root, not under `planning/`.

3. **Cowork plugin skills wired up locally.** The pipeline now calls in `engineering:*`, `design:*`, `product-management:*` skills from the `anthropics/knowledge-work-plugins` marketplace. `skills/install.sh --with-plugins` registers the marketplace and installs the three plugins so bare Claude Code sessions can invoke them, not just Cowork. `skills/EXTERNAL-SKILLS.md` documents what's installed and why.

4. **`product/systems/member.md` drafted (T1/T2/T3).** The anchor primitive of the platform finally has a spec. Encodes ADR-3, 4, 6, 7, 8, 9. Real name encouraged + chosen handle, Magic-link + Google + Apple OAuth via Supabase Auth, DM substrate at b1 with surface in b2, no `role` column, no Business shell, opt-out default on every privacy field with a Policy posture section walking each through the three filters. Self-Record + Delegation substrate reserved at b1; surfaces are b2/b3. Independent verification verdict: **PROCEED** with two significant findings (both fixed in-place: `member_messages.sender_member_id ON DELETE RESTRICT` + a partition-setup note pointing to ADR-10) and four nits (all addressed). The single edit landed outside `member.md`: `b1-primitives.md`'s required-tables list had a stale `member_roles` reference left over from before ADR-8 — replaced with the Operations-derived list.

**`CLAUDE.md` rewritten** with explicit "Agent routing" table (project skill per intent) and "Solo-team multipliers" table (Cowork plugin skill per stage gate). Migration-phase rules now make `pipeline-review` mandatory, ADRs required before any new schema/event, code-review mandatory at ticket close, deploy-checklist mandatory before any merge to main on T028+, accessibility-review mandatory on every new surface, and DEVIATIONS.md entry mandatory at every ticket close (even "no deviations").

**Operational fixes called out by the audit:** F018 still in `scenarios-backlog/` despite tickets T036–T040 referencing it (firewall violation — move it before opening any of those). T028–T040 drafted before `notes/migration-to-primitives.md` was approved (rubber-stamp risk — approve the migration plan, then keep the tickets). `web/BUILD-LOG.md` two weeks stale and points to an archived bundle path. `DEVIATIONS.md` empty across 24 shipped tickets. Action plan with all of these is in PIPELINE-AUDIT.md §"Action plan, sequenced" — about a working day of cleanup before T028 opens.

---

## 2026-05-09 — Agent-assistance architecture drafted (forward-looking; NOT b1)

**What.** A long planning session explored how to make the platform agent-friendly natively rather than as a bolted-on feature. Produced a coherent forward-looking architecture: three primitives (Delegation, Member Self-Record, Skills), a fourth primitive (Member Operations) that supersedes ADR-3's derived `maker_signal` pattern, a foundational policy framework, and four ADRs (6–9). Spawned four reviewers (independent architectural, planning-filter / 5 Deadly Sins, security/privacy, people-first + canonical examples) — all useful, all converged on a small set of findings.

**PM scope reset at end of session.** Everything drafted today is **forward-looking, not b1.** B1's intention is to show users the kinds of items the app can handle (gathering, trading/selling, wondering) and let them communicate what they have and where they can meet — only enough to signal we make and sell. Member Operations and the agent-assistance stack move to b3 territory.

**Capture.** Full handoff at [`../../notes/agent-assistance-handoff-2026-05-09.md`](../../notes/agent-assistance-handoff-2026-05-09.md), with the seven open decisions to take up in a future session, the reviewers' convergent findings preserved, and explicit "what NOT to do" guardrails so b1 tickets don't pick up forward-looking references.

**New artifacts in tree:**
- `product/foundation/policy-framework.md` (three-filter test + opt-out default — useful immediately as guidance)
- `product/systems/delegation.md`, `member-self-record.md`, `skills.md`, `member-operations.md` (forward-looking, do not gate b1)
- `planning/DECISIONS.md` ADR-6, ADR-7, ADR-8, ADR-9
- `planning/reviews/agent-assistance-*-review-2026-05-09.md` (four review files)

---

## 2026-05-08 (continued) — F018 unblocked: five doc additions landed, review re-verdicted PROCEED

**What.** The five EXTEND items the F018 review surfaced are now in tree. Re-review verdict: PROCEED. Tickets T036–T040 unblocked.

**Three additions to [`../../product/systems/item.md`](../../product/systems/item.md):**

1. **`item.published` event semantics** — distinct-from-`item.created` paragraph naming the state transition (`draft`/`withdrawn` → `published`), the two listeners (discovery refresh + follower fan-out), and the helper `publish_item(item_id uuid)` SQL function that performs transition + event append + (sync) view refresh in one transaction.
2. **`discoverable_items` refresh trigger** — synchronous `REFRESH MATERIALIZED VIEW CONCURRENTLY` on `item.published` at b1; async (NOTIFY/LISTEN with a worker, or pg_cron) at T2. Triggering event-row stays the contract; only the refresh mechanism changes between tiers. The `unique_idx_discoverable_items` index requirement for `CONCURRENTLY` is noted.
3. **`GET /api/hashtags/suggest?q={prefix}` endpoint** — response shape `{ hashtags: [{ hashtag, item_count }] }`, top-10 cap, requires non-empty prefix (400 on empty), 60s edge cache keyed on the normalized prefix.

**Two additions to [`../../product/ui/design-language.md`](../../product/ui/design-language.md):**

4. **Recurrence picker** component recipe — friendly inputs (frequency / day(s) / time / until), emits an RRULE plus a human-readable preview line.
5. **Surface patterns → Venue page** — new section. Header layout, primary-CTA placement, sections below the CTA in order, anti-patterns named.

**Re-review:** [`../reviews/F018-review.md`](../reviews/F018-review.md) verdict updated from EXTEND → **PROCEED**.

---

## 2026-05-08 — The mission, named.

**Connecting people, joining forces, improving our lives socially and economically, and deciding our future with the strength and power of the many.**

That is what Main Street Market is for. Everything else — the loops, the primitives, the b1 bundle, the rebuild on People / Item / Location — exists to serve that mission.

The earlier work circled it. The Slow Economy thesis named the squeeze. The loops named the entry points. The primitives named the data shape. The people-first stance named the constraint. None of those were wrong, but none of them stated the *why* with this clarity. Today the mission is named. The PM journal and the architectural decision log start fresh from here.

**What carries forward, unchanged, because it already serves the mission:** loops.md, primitives.md, people-first.md, canonical-examples.md, b1-primitives.md, item.md, community.md, discovery.md, community-platform.md, design-language.md.

**Active architectural decisions at this moment** (now archived/superseded — see active [`../DECISIONS.md`](../DECISIONS.md) for current state):
- ADR-1 — Tech stack (Next.js + Tailwind + Supabase + Mapbox).
- ADR-2 — Bottom-anchored mobile-first UI.
- ADR-3 — Maker profile is implicit, not claimed. *(Later REJECTED — see ADR-12 and Groups ratification.)*
- ADR-4 — Locality default is geolocate, then city-pick, mutable from any surface.
- ADR-5 — A market is a Gathering Item; "gathering" is broad and varied.

**Strong feedback from this session worth keeping in front:**
- **QR codes are vendor-booth-only.** *(Later REVISED — QR is Item-level Member-requestable per 2026-05-10.)*
- **Distinguish the actual need from the surface someone currently uses.**
- **Surface-specific CTAs over a unified picker.**
