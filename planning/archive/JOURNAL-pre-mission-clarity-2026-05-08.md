# JOURNAL.md — PM Reverse-Chronological Log

**Latest entries at top.** Start here every session to understand project state.

---

## 2026-05-08 — Scope decisions: QR codes are vendor-booth-only; Bumble BFF added as canonical example #7

**Why now.** Walking the UX of the three-plus use cases (newcomer / event-poster / vendor / community-creator) surfaced two scope decisions worth recording.

**Decision 1 — QR codes are vendor-booth-only.** QR was previously woven through gathering-host flows, Run Club scenario, Item-page actions, and the locality discovery thesis. PM call: erase QR from every non-vendor surface. Rationale: people share URLs over QR for almost everything. If a user sees a group/event in the wild, they'll search the app by location, day, time, kind — not scan a QR. The vendor-booth case (Loop 7 — Maker scans a card at their farmers market booth, gets the Location pre-filled, creates a product Item in 90 seconds) is the *only* QR surface that survives.

Files updated to reflect the scope change:

- `product/foundation/loops.md` — Loop 1 reframed to URL+search; Loop 7 keeps booth QR; activation-energy paragraph reframed.
- `product/foundation/canonical-examples.md` — Run Club (#1) updated: chalkboard + URL-share, no QR card.
- `product/capabilities/qr-onboarding.md` — rescoped explicitly to vendor booth only; added "Explicitly NOT in scope" section listing surfaces that don't get QR.
- `product/capabilities/gathering-host.md` — QR PDF replaced with "Share link" (clipboard + native share sheet); Brian's acceptance signal rewritten.
- `planning/bundles/b1-primitives.md` — Location section, Loop 7 row, build sequence step 6, open-questions section, and Cluster 4 creep paragraph all reframed.
- `notes/migration-to-primitives.md` — T045 narrowed to vendor-booth onboarding only.
- `planning/scenarios-backlog/F018-brian-declares-run-club.md` — QR mentions stripped; replaced with URL-share and search-the-locality framing.
- `development/tickets/T039-item-page-and-qr.md` — QR PDF action removed from acceptance criteria; replaced with share-link affordance (clipboard + `navigator.share()` on mobile). `@react-pdf/renderer` dep no longer needed.
- `planning/reviews/F018-review.md` and `planning/walkthroughs/F018-pipeline-trace.md` — review-stage records updated to mark the QR PDF format gap as resolved-by-scope-change.

Note: T039's filename still contains "qr" — left as-is for git history continuity; the ticket's title and contents reflect the new scope.

**Decision 2 — Bumble BFF added as canonical example #7.** Use case: a set of women in Sacramento who fled Bumble BFF's one-on-one swiping for a Facebook Group. Earlier in the session I argued this didn't earn its keep at b1 because b1 doesn't ship a discussion feed. PM correction: the underlying need is real-world coordination among an affinity set, not online chat. b1 fully delivers that — Community gives them a roster + addressable scope, members declare gathering Items attached to the Community, others see them on the page. Example added to `canonical-examples.md`. Notable for being the inverse pattern of #1 and #5: every other example has Community emerging *out of* a recurring Gathering; this one has Community-first, before any gathering exists.

**What's next.**

All three open decisions resolved later in the same session:

- **ADR-4 — Maker profile is implicit, not claimed.** Posting product Items makes you a Maker. No toggle, no claim flow, no separate onboarding. Frequency is the bona-fide signal — derived view, not a column. The /you Maker section renders conditionally on product activity. Existing `vendor-*` legacy systems pending re-anchor in Phase 6 of the migration.
- **ADR-5 — Locality default is geolocate-then-city-pick, mutable from any surface.** Supersedes the earlier `community-platform.md` decision to keep the locality control on /you only. The earlier reasoning ("people don't travel enough") understated moves and visits. Affordance is visible on locality-dependent surfaces, not buried in settings.
- **ADR-6 — A market is a Gathering Item; "gathering" is broad and varied.** Farmers markets, swap meets, clothes swaps, classes, workshops, community projects, run clubs — all the same Item kind, distinguished by category/hashtag. The `community-platform.md` "Market session" distinct feed-card type is removed. C4 (Class/Workshop) and C5 (Community Project) capabilities are resolved as gathering categories, not separate event types.

ADRs 4, 5, 6 written to [`planning/DECISIONS.md`](planning/DECISIONS.md). [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) open questions updated to mark these resolved. [`product/products/community-platform.md`](product/products/community-platform.md) capabilities table reflows to match (C4/C5/C6 struck through, C9 renamed Member tab, C10 reframed conditional, C13 added for derived Maker signal).

**Now-open decisions for next session.**

- Vendor-at-market modeling (per ADR-6 consequences). Two options: (a) the Maker declares a separate Item ("I'll be at Saturday's Folsom market") or (b) the Maker RSVPs as vendor to the market's Gathering Item with a vendor-list surface. Both shapes plausible; pick one in `item.md`.
- Initial gathering category vocabulary. Per ADR-6 the controlled list (farmers-market, swap-meet, clothes-swap, class, workshop, run-club, movie-night, trivia, community-project, etc.) needs to be sized before the first gathering is created. Lives in `item_tags`.
- Re-anchor the legacy `vendor-*` systems on Members per ADR-4. Phase 6 of [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md).
- Write `member.md` system spec (currently referenced everywhere, missing from `product/systems/`). The maker-signal derived view spec lives here.

---

## 2026-05-08 (continued) — F018 walked end-to-end through the rewired pipeline; review stage added; legacy scenarios cleaned up

**Why now.** PM asked to walk one feature through the pipeline soup-to-nuts to make sure nothing gets dropped between roles. F018 (Brian declares the Run Club) was the test case. The exercise surfaced seven concrete drops the pipeline was missing, justified a new `pipeline-review` skill, and produced a worked example future scenarios can model on.

**What was added.**

- **New skill: `pipeline-review`.** Architecture + design pre-flight on an approved scenario. Optional but strongly recommended for any scenario that introduces a new surface, component, event type, or schema. Verdicts: **PROCEED** (continue), **REVISE** (back to plan), **EXTEND** (back to product to grow a system or design doc). Lives at [`skills/pipeline-review/`](skills/pipeline-review/SKILL.md). Output: `planning/reviews/F{NNN}-review.md` that the ticket writer reads alongside the scenario.
- **Eval template gap closed.** `pipeline-eval` now has [`templates/playwright-spec.md`](skills/pipeline-eval/templates/playwright-spec.md) and [`templates/results.md`](skills/pipeline-eval/templates/results.md). Was the only skill missing templates.
- **Inputs/Outputs cheatsheet on every skill workflow.** Every `skills/pipeline-*/workflow.md` now starts with a Cheat sheet table — Reads / Writes / Templates / Does NOT read / Hands to. Skills no longer have to search the project to know what they consume and produce.
- **New capability: [`gathering-host.md`](product/capabilities/gathering-host.md).** Loop-specific replacement for the deprecated unified `item-create.md`. Anchored on Run Club at Drake's. The path forward: split the legacy item-create capability by loop (`gathering-host`, future `product-make-and-sell`, `service-offer`, `wonder-float`) — each with its own surface and persona.
- **The walk-through itself: [`planning/walkthroughs/F018-pipeline-trace.md`](planning/walkthroughs/F018-pipeline-trace.md).** Traces F018 from capability to eval-run, with real artifacts at every stage. Identifies the seven drops the pipeline now catches, and the six gaps it still doesn't (cross-feature consistency, perf budget, accessibility, i18n, migration safety, release notes).

**Real artifacts produced by walking F018:**

- Capability: [`product/capabilities/gathering-host.md`](product/capabilities/gathering-host.md). Old `item-create.md` rewritten as a deprecation pointer to the loop-specific replacements.
- Architecture/design review: [`planning/reviews/F018-review.md`](planning/reviews/F018-review.md). Verdict: EXTEND. Six small additions to `item.md` and `design-language.md` are required before the ticket writer should start.
- Tickets: [T036](development/tickets/T036-item-published-event-and-refresh.md), [T037](development/tickets/T037-venue-page-host-cta.md), [T038](development/tickets/T038-gathering-composer.md), [T039](development/tickets/T039-item-page-and-qr.md), [T040](development/tickets/T040-gathering-discovery-surfaces.md). Five tickets, dependency-ordered, each references the scenario AND the review.
- Playwright spec sketch: [`web/evals/features/F018-brian-declares-run-club.spec.ts`](web/evals/features/F018-brian-declares-run-club.spec.ts). One describe per story beat; written from the scenario, no peeking at code.

**Cleanup done as part of this work:**

- Archived legacy [`scenarios-backlog/archive/F018-item-composer.md`](planning/scenarios-backlog/archive/F018-item-composer.md). Superseded by the persona-shaped trio (Brian, Aaron, Maya).
- Renumbered legacy `F019-community-create-join-browse.md` → `F023-community-create-join-browse.md`, legacy `F020-item-page-resolve-up.md` → `F024-item-page-resolve-up.md`. Frees up F019 and F020 slots taken by the new persona scenarios. Original journal-reserved numbers F021 (member-public-page) and F022 (locality-first-index) stay; both are persona-pending.
- `planning/scenarios-backlog/USER-STORY-TEMPLATE.md` overwritten with a redirect note pointing at `skills/pipeline-plan/templates/scenario.md` (this session's filesystem can't delete files; safe to remove manually).
- AGENTS.md updated to seven roles. README.md updated with new PM cycle diagram including review.
- pipeline-router workflow updated with the seven-stage cycle, including the parallel `eval-write` + `ticket` stage.

**The seven drops the new pipeline catches** (full enumeration in the walk-through):

1. `item.published` event was implicit; now declared in `item.md`.
2. `discoverable_items` refresh trigger was assumed; now specced.
3. Hashtag autocomplete endpoint was scenario-only; now in `item.md`.
4. Venue-page primary CTA pattern was missing from `design-language.md`; now to be added.
5. Recurrence picker component was missing from the design system; now to be added.
6. QR PDF format was unspecified; now to be specced.
7. Loading + network-failure states were absent from F018; now flagged for the ticket.

**The six gaps still open** (suggested fixes in the walk-through):

1. **Cross-feature consistency** — F018 + F019 + F020 each works alone, but no role checks that the three together produce a coherent component set. Suggested: extend `pipeline-review` with a "scenarios bundle" trigger.
2. **Performance budget** — F018 names a 60s SLA; no role owns a system-wide perf budget. Suggested: extend `pipeline-review` architecture check.
3. **Accessibility** — no role explicitly checks scenarios/designs against a11y. Suggested: a11y subsection in `pipeline-review` design check.
4. **Internationalization** — no role flags i18n implications. Suggested: i18n flag in design check.
5. **Migration safety** — no role explicitly checks reversibility / backfill safety. Suggested: invoke Anthropic `security-review` from `pipeline-build` for migration-touching tickets.
6. **Release notes / external comms** — nothing produces user-facing release notes after eval-run passes. Suggested: optional `pipeline-release` skill.

**What needs attention next:**

1. **Run `./skills/install.sh`** if you haven't yet — `pipeline-review` needs the symlink to load. Verify with `ls ~/.claude/skills/ | grep pipeline-`.
2. **F018 is currently EXTEND-blocked.** PM call: extend `product/systems/item.md` (event, autocomplete, refresh trigger) and `product/ui/design-language.md` (venue-page CTA, recurrence picker, QR PDF format). ~30 minutes of doc work each. Then rerun the review for PROCEED.
3. **PM review of F018, F019, F020 scenarios.** Currently in `scenarios-backlog/`. Approve and move to `scenarios/` once the EXTEND work clears for F018.
4. **Decide on the six open gaps** above. Each is its own small piece of pipeline work — most extend `pipeline-review`; one (release notes) might be a new skill.
5. **Decide on Cowork plugin packaging.** Per earlier research, `~/.claude/skills/` is shared between Claude Code and Cowork; install.sh covers both. Plugin packaging (`.claude-plugin/plugin.json`) is optional and only needed if you want to distribute these skills to other people / machines.

---

## 2026-05-08 (continued) — Pipeline rewired: skills now match the four-agent intent, scenarios go user-story-shaped

**Why now.** The cascade-agent-template flow was working; the skills migration broke the smooth handoff. Three concrete failures were biting at once: (1) `~/.claude/skills/` did not exist on the machine — none of the project's `pipeline-*` skills loaded into sessions, so trigger phrases never fired and the cascade flow was dead; (2) `pipeline-plan` and `pipeline-build` disagreed on who writes tickets, with no `pipeline-ticket` skill to own that role; (3) the scenario template was shape-blind — Given/When/Then with no persona, surfaces, or data captured, which is exactly what produced the F018 unified-Item-picker failure.

**What changed.**

- **Added `pipeline-ticket` skill** — owns ticket-writing per the AGENTS.md four-agent intent. Reads only approved scenarios + existing tickets, never code, never the backlog. Templates moved out of `pipeline-build/`. Escalates to `pipeline-plan` if a scenario produces 5+ tickets.
- **Replaced `pipeline-plan/templates/scenario.md`** with the user-story shape: Persona (anchored to `canonical-examples.md`), The Story, Surfaces (where the user starts — never `/new`), Data Captured (user-language → schema mapping table), BDD Acceptance Criteria, Edge Cases, Out of Scope. The template now refuses to be feature-shaped — the F018 failure mode is structurally guarded against.
- **`pipeline-plan` workflow** now mandates: read `canonical-examples.md` first; every scenario must anchor to a real person from canon; refuse to invent hypothetical "users." Calls Anthropic's `planning-filter` skill when ranking sprawling backlogs.
- **`pipeline-build`** stripped of ticket-writing. Only implements existing tickets via TDD. Cites `docx`/`pptx`/`xlsx`/`pdf` Anthropic skills explicitly for non-code deliverables.
- **Hand-off sections added** to every `pipeline-*` SKILL.md and workflow.md — "you produced X, next skill is Y, Y expects Z." Restores the cascade flow that was implicit in the old templates.
- **`pipeline-router/workflow.md`** now carries the full PM cycle (product → plan → eval-write → ticket → build → eval-run → loop), with the firewall rationale spelled out.
- **`planning/AGENTS.md`** rewritten to match — six roles (router + product + plan + eval-write + ticket + build + eval-run), each with explicit reads / writes / does-not-read.
- **Install script `skills/install.sh`** — idempotent, replaces the README's inline bash. Run it once: `./skills/install.sh`. Without this step, none of the above matters because skills don't load.

**Files updated:**

- New: [`skills/pipeline-ticket/SKILL.md`](skills/pipeline-ticket/SKILL.md), `workflow.md`, `templates/ticket.md`.
- New: [`skills/install.sh`](skills/install.sh).
- Replaced: [`skills/pipeline-plan/templates/scenario.md`](skills/pipeline-plan/templates/scenario.md) (user-story shape).
- Updated: [`skills/pipeline-plan/SKILL.md`](skills/pipeline-plan/SKILL.md), `workflow.md`.
- Updated: [`skills/pipeline-build/SKILL.md`](skills/pipeline-build/SKILL.md), `workflow.md` (no longer writes tickets).
- Updated: `skills/pipeline-product/SKILL.md`, `workflow.md`, `skills/pipeline-eval/SKILL.md`, `workflow.md`, `skills/pipeline-router/SKILL.md`, `workflow.md` (hand-off sections + PM cycle).
- Updated: [`skills/README.md`](skills/README.md) — pipeline-ticket added, PM cycle diagram added.
- Stub: `skills/pipeline-build/templates/ticket.md` — this session can't delete files; it's a redirect note pointing at `pipeline-ticket/templates/ticket.md`. Safe to remove manually.
- Updated: [`planning/AGENTS.md`](planning/AGENTS.md) — six-role pipeline with explicit firewalls.

**Side effect — three new scenario drafts in user-story shape, in `scenarios-backlog/`:**

- [`F018-brian-declares-run-club.md`](planning/scenarios-backlog/F018-brian-declares-run-club.md) — recurring gathering at a permanent venue.
- [`F019-aaron-posts-fish-drop.md`](planning/scenarios-backlog/F019-aaron-posts-fish-drop.md) — irregular product alert with follower push.
- [`F020-maya-finds-something-to-do.md`](planning/scenarios-backlog/F020-maya-finds-something-to-do.md) — anonymous newcomer on the locality-first feed.
- [`USER-STORY-TEMPLATE.md`](planning/scenarios-backlog/USER-STORY-TEMPLATE.md) — the same template that now lives in `skills/pipeline-plan/templates/`. Kept here as a quick reference; can be deleted once the skill is installed and the team is fluent.

**The previously-approved F018 (`F018-item-composer.md`)** stays in `scenarios-backlog/` for now. It is superseded by the three new stories. PM call: archive it to `scenarios-backlog/archive/` once you've confirmed the replacement set covers what F018 was meant to.

**Numbering caveat.** This entry took F019 and F020 (which the prior journal entry had reserved for Community create/join/browse and Item-page resolve-up). Those features still need scenarios — they will be F021 and F022 when written, and the new scenarios should be persona-anchored too (e.g., "Maya joins the West Sac Mutual Aid Community," "A visitor lands on Aaron's Item page and sees both pickup locations").

**What needs attention next:**

1. **Run the install script.** Without `~/.claude/skills/` symlinks, the rewired skills don't load. Command: `./skills/install.sh` from the project root.
2. **PM review of the three new scenarios.** Approve or annotate; if approved, move from `scenarios-backlog/` to `scenarios/`.
3. **PM call on old F018.** Archive `F018-item-composer.md` to `scenarios-backlog/archive/` once the replacement set is approved.
4. **Test the cycle on F018.** Run `pipeline-eval` (write mode) → `pipeline-ticket` → `pipeline-build` → `pipeline-eval` (run mode) for `F018-brian-declares-run-club.md` to validate that the new pipeline produces working code without drift.
5. **Renumber Community + Item-page scenarios.** When written, they take F021 and F022.

---

## 2026-05-08 (continued) — Hashtags added; Phase 6 doc list trimmed

**Hashtags decision.** `item_hashtags` joins the schema floor at Phase 1, alongside but distinct from `item_tags`. Categories (`item_tags`) stay controlled vocabulary — they bound the index facets and the LLM filter-mapping surface. Hashtags (`item_hashtags`) are free-form, user-generated, normalized (lowercased, leading-`#` stripped, whitespace stripped), and serve three jobs categories can't: long-tail differentiation (#avian, #pre1900plumbing), cross-category specificity (#beginnerfriendly for a fermentation skill-share that's gathering+class+foodprep), and trend emergence (#naturallyleavened).

**Composer UX:** autocomplete from existing hashtags as the user types — reduces noise without preventing new tags. **Item page UX:** hashtags render as clickable chips. **Discovery:** `/h/[hashtag]` shows a feed; trending hashtags surface as peripheral signal in the locality index, never as primary ranking. **At T3:** hashtags get included in embedding context for vector search.

Locations and Communities don't get hashtags at MVP. A Location's "vibe" is captured by the items hosted there; a Community's identity by its description and members. Either can layer hashtags later if the case appears.

**Phase 6 doc list trimmed.** PM replaced `mission.md` and `founding-scenarios.md` with `canonical-examples.md` ahead of Phase 6. The two `.DEPRECATED` files moved to `product/exploration/archive/` as part of this entry. The migration plan's Phase 6 list now strikes through both rewrites and adds a flag for `reciprocity-and-goodwill.md` (open design question, blocks Offer/Ask surfaces — b2 work, not Phase 6).

**Files updated:**
- [`product/systems/item.md`](product/systems/item.md) — `item_hashtags` added to shared join tables; AI/LLM section updated to distinguish controlled categories from free-form hashtags.
- [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) — `010_item_relations.sql` now creates both `item_tags` and `item_hashtags`. Phase 6 list reflects mission/founding-scenarios as done; .DEPRECATED files archived.
- [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) — tables-required list adds `item_hashtags` alongside `item_tags`.
- `product/foundation/mission.md.DEPRECATED` → `product/exploration/archive/mission.md`.
- `product/foundation/founding-scenarios.md.DEPRECATED` → `product/exploration/archive/founding-scenarios.md`.

---

## 2026-05-08 (continued) — Items: shared spine + kind-specific child tables (mental model and physical schema diverge by design)

**The realization.** The "one Item primitive, kind varies" framing in `primitives.md` is a *mental model* for product and PM thinking. It is not a contract about how data is stored. The instinct to translate the conceptual primitive directly into a single physical `items` table with kind-discriminator + JSONB metadata was cargo-culted — and on inspection it underperforms on three axes: weak typing (JSONB for everything kind-specific), indexing pain (one set of indexes serving four query patterns), and FK constraints (kind-specific child tables can't FK cleanly).

**The fix.** Spine + kind-specific child tables.

- **`items` (spine)** — shared columns queried across all kinds: `id`, `member_id`, `kind` enum, `title`, `description`, `state`, `community_id`, `brand_label`, `category`, `ambient_extras` (jsonb, *small*), timestamps, soft-delete, plus reserved columns (`parent_item_id`, `collection_id`, `federation_origin`, `embedding_id`).
- **`item_products`** — 1:1 where kind=product. `price_cents`, `price_unit`, `composition`, `photo_urls`, `available_until`.
- **`item_services`** — 1:1 where kind=service. `rate_model`, `rate_cents`, `service_area_geography`, `hours`, `license_info`, `on_call`, `accepts_new_clients`.
- **`item_gatherings`** — 1:1 where kind=gathering. `starts_at`, `ends_at`, `recurrence_rule`, `capacity`, `cost_cents`, `what_to_bring`, `host_member_id`, `rsvp_cutoff`.
- **`item_wonders`** — 1:1 where kind=wonder. `interest_count` (denormalized for sort), `expires_at`, `conversion_target_kind`, `converted_to_item_id`.
- **Shared joins** — `item_locations`, `item_responses`, `item_tags`, `item_events` (append-only log, partitioned monthly).
- **`discoverable_items` materialized view** — denormalized cross-kind index for the locality query. Anonymous Loop 3 traffic queries this view; never touches base tables in hot paths.

**Why this fits our query patterns:**

- **Locality index** (Loop 3) — one materialized view, sorted by proximity, filtered by kind / community / tags. Fast across all kinds.
- **Item page** — spine + the relevant child table by kind. 2 queries.
- **Member page** — groups Items by `brand_label` from the spine alone; no kind-specific joins needed.
- **Wonder→Gathering conversion** — two writes in one transaction. Insert into `items` (kind=gathering) with `parent_item_id` pointing at the Wonder, insert into `item_gatherings`. Wonder's `converted_to_item_id` updated.
- **Future kinds** (Offer, Ask, Initiative) — one new child table each. No migration of existing data.

**Wider performance criteria the platform commits to** (called out in chat for traceability):

(1) Index for the queries you actually run. (2) Materialize the locality index. (3) PostGIS for proximity (GIST on geography column). (4) Read replicas for anonymous traffic; aggressive caching by zip + filter combo. (5) Append-only event log, partitioned monthly. (6) JSONB only for genuinely variable, never-queried fields. (7) Asynchronous fan-out (bulletins, notifications, search index). (8) Soft deletes everywhere. (9) RLS at the DB layer. (10) Vector embeddings in a parallel table with HNSW or IVFFlat — reserved at MVP. (11) Slugs for URLs, UUIDs for FKs. (12) Composite indexes that match WHERE-clause column order. (13) No N+1 anywhere on the read path.

**Files updated:**

- [`product/systems/item.md`](product/systems/item.md) — Data model section rewritten. Spine + four kind-specific child tables documented with column lists. JSONB downgraded to "ambient extras"; per-kind typed columns are the primary store. `discoverable_items` materialized view named as the locality index source.
- [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) — Tables-required list reflects the spine + child tables. `discoverable_items` view added.
- [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) — Phase 1 schema floor split into `009_items.sql` (spine) + `009a–d` (child tables) + `013_discoverable_items.sql` (materialized view). Phase 2 backfill writes spine + product/service child rows for each `businesses` row, and spine + gathering child rows for each `events` row.

**What does not change:**

- The mental model in `primitives.md` is unchanged. We still talk about "Items" as one primitive in the four-primitives framing because that's how the loops, the composer, the Member page, and the index *think*. The physical schema underneath is a performance choice; the conceptual model is a clarity choice. Both are right at their layer.
- People-first, Communities-emergent, brand_label resolve-up — all unchanged.

**Ticket sequencing impact.** Phase 1 grows from six migrations to nine (007 members, 008 locations, 009 spine, 009a–d four child tables, 010 item-relations, 011 event log, 012 communities, 013 discoverable_items). Tickets T028–T036 cover them. Whether 009a–d become one ticket or four is a ticket-write call.

---

## 2026-05-08 (continued) — Foundation cleanup: founding-scenarios + mission deleted, replaced by canonical-examples

**Why.** Both `founding-scenarios.md` (Sarah/Jim/Priya/Darnell/Maya, framed against the old N1–N4 north stars) and `mission.md` (opening "producer marketplace built to rebuild local economies") predated the loops + primitives + people-first reframe. They were already flagged stale in JOURNAL and migration-to-primitives. PM decided to replace both rather than rewrite.

**What replaced them.**

- [`product/foundation/canonical-examples.md`](product/foundation/canonical-examples.md) — six real situations as the working test-case set: the Unofficial Run Club at Drake's, Ferrari Fisheries (irregular wild-caught fish drops), the Quarterly Dip Vendor (intermittent African-inspired condiments at the farmers market), the Food Truck Without a Calendar, Barn Movie Night at Drake's, and Cafe Capricho's Successor (the East Sacramento cafe that closed last month — reframed as an Initiative for community-backed succession, not as loss). Loops 2 (Wonder), 5/6 (Offer/Ask), 9 (find-a-pro), and 12 (Steward) are slotted as TODOs to be filled with real instances. Loop 13 deliberately not anchored — too far out for canon-set-1.
- [`product/exploration/reciprocity-and-goodwill.md`](product/exploration/reciprocity-and-goodwill.md) — open design question surfaced while drafting. Captures the tension between reciprocity-gating (legitimate abuse concern; every BuyNothing surface gets gamed) and the platform's commitments (activation energy ascends through families; Ask must serve people in low-capacity moments; quantified karma reproduces engagement-mechanic failure modes). Sketches paths (visible history without gate, soft nudges, new-member grace, community-scoped trust, asymmetric visibility, decay) without choosing one. Trigger for reopening: first Community asks for a tool, observed taker-pattern, or a real Loop 5/6 example surfaces.

**The mission content survives — distributed.** The Mondragon trajectory and federation thesis live in `loops.md`. The values posture (no business entity, no reviews, no pay-for-visibility, federation-not-consolidation) lives in `people-first.md`. The slogan ("Buy close. Build community. Build the future together.") survives in `people-first.md` and at the foot of `canonical-examples.md`. Nothing load-bearing was lost.

**References updated.**

- `CLAUDE.md` — table row swapped from founding-scenarios to canonical-examples.
- `notes/migration-to-primitives.md` — Phase 6 mission/founding-scenarios rewrite tasks struck through with "Done 2026-05-08" notes; T046 thesis-page ticket points to canonical-examples + people-first + loops.
- `product/foundation/platform-promise.md` — "See mission.md for the why" replaced with pointers to loops.md and canonical-examples.md, plus a note that producer-specific framing in this doc is still pending re-anchor on Members at Phase 6.

**What still needs attention.**

1. Fill the four canonical-example TODOs — Float an idea (Loop 2), Share/Ask paired (Loops 5/6), Find a local pro (Loop 9), Steward (Loop 12) — with real West Sac / East Sac / Sacramento situations as they surface.
2. `platform-promise.md` is the last producer-shaped foundation doc. Re-anchor on Members per migration-to-primitives Phase 6 — separate task.
3. Reciprocity question stays parked. Do not design a points system on speculation; ship Sharing without a gate at MVP and observe.

---

## 2026-05-08 (continued) — Discovery system landed: graph + place + time, not watch-time

**The question that prompted it.** "What kind of algorithm helps connect people with what they might love? TikTok is the gold standard but how do we get that?"

**The reframe.** TikTok is the wrong target. TikTok optimizes a single scalar (watch time) over infinite, ambient, low-stake content. Our Items have weight — people show up, pledge, buy, host. Each engagement is heavy and meaningful. Volume is local, not global. Copying TikTok would fight the platform's grain. The right shape is a **graph + place + time** engine: People→Item edges via verbs (the substrate), Location decay, time-to-event decay for gatherings, social proof through follows, loop-affinity from revealed preference. Hand-tuned scoring at T1, learned weights at T2, full ranker at T3.

**Why a system, not a capability.** Discovery is the substrate Home / Explore / search / "related" / notification ranking all sit on. One scoring core, multiple surfaces with per-surface weight overrides. Splitting it would invite drift.

**Hard constraints baked in (not just principles).**
- Never rank by business size or follower count alone.
- No "promoted Items," no payment-for-placement.
- Never auto-assign a Member to a Community-scoped feed (preserves the emergent-Community stance).
- T1 must log every ranking call — without it, T2 has no training data and we'd redo T1.

**Files written:**
- [`product/systems/discovery.md`](product/systems/discovery.md) — full T1/T2/T3 spec. T1 includes concrete scoring formula, initial weights, candidate-generation rules, cold-start handling, diversity rule, loop-adjacency seeding, surface-override mechanism, anti-patterns, integration points, and four open questions kicked to the PM.

**Bundle placement:** marked T1 → b2, T2 → b3, T3 deferred, with a "PM to confirm" tag. Discovery doesn't fit b1's primitives-rebuild scope. PM should confirm or move when b2 is shaped.

**What needs attention next:**
1. PM approval (or revision) of the discovery spec — particularly the four open questions in the doc (search candidate set, diversity aggressiveness, per-Location feeds, when Wonders/Asks surface).
2. Bundle assignment confirmation — is T1 b2, or earlier/later?
3. Commit the new file to the parent repo.
4. When approved and bundle-placed, send to Scenario Writer to break T1 into scenarios against the concrete formula.

---

## 2026-05-08 (continued) — Archive sweep: 42 superseded files moved out of the live tree

**Why now.** With loops + primitives + people-first + community now landed as the new authoritative framing, the residual product / system / capability docs from earlier pivots were creating ambient confusion. The migration plan's Phase 6 calls for cleanup; pulling the obviously-dead files out now (ahead of Phase 6) makes the live tree match the live framing.

**What got archived (42 files):**

- **product/products/** (6) → `product/products/archive/`: business-data, map, marketplace-format, ownership, platform, stays. All centered on `businesses` as primary entity, the 6-tier ownership badge system, or the Core+Verticals architecture — all directly contradicted by the primitives + people-first model.
- **product/systems/** (6) → `product/systems/archive/`: business-data, community-impact, map-system, ownership-classification, platform-core, stays. Same reasons.
- **product/capabilities/** (24) → `product/capabilities/archive/`: business-detail-view, business-events, business-promotions, business-registration, business-updates, community-impact-badge, community-questions, community-signals, map-search, platform-cross-vertical-links, platform-identity-verification, platform-map-discovery, platform-owner-profile, search-results-list, plus all 10 `stays-*`. Most predate the producer-marketplace pivot; none survives the primitives reframe.
- **planning/bundles/** (1) → `planning/bundles/archive/b2-community-pre-loops.md`: referenced N1–N5 north stars and the old b1-mvp hypothesis. Will be rewritten against loops as `b2-pooling-stewardship.md` in Phase 6.
- **planning/plans/** (1) → `planning/plans/archive/food-pivot-execution.md`: historical, executed, then re-pivoted past.
- **planning/scenarios-backlog/** (4) → `planning/scenarios-backlog/archive/`: F014–F017. Vendor-shaped proposals. Will be re-written as Member/Item-shaped scenarios when their concerns surface again (geocoding, pin confirmation, appearance management).
- **notes/** (1) → `notes/archive/skills-migration-plan.md`: completed 2026-05-07.
- **product/exploration/** (1) → `product/exploration/archive/community-signals.md`: superseded by `community-accountability-model.md`.

**What stays in the live tree but is flagged as stale (rewrite at Phase 6):**

- `product/foundation/mission.md` — producer-marketplace-shaped, narrower than loops.
- `product/foundation/founding-scenarios.md` — Buyer/Producer-shaped; needs Loop 1, 2, 3, 9 stories.
- `product/foundation/platform-promise.md` — producer covenant; producer-side becomes Loop 7 commentary, the spine becomes Member covenant.
- `product/products/community-platform.md` — Home/Explore/You page roles valid; primitives underneath migrating.
- `product/systems/events.md` — events are now Items of kind=gathering; harmonize with `item.md`.
- `product/systems/vendor-bulletin.md`, `vendor-intelligence.md`, `vendor-self-service.md` — re-anchor as `member-bulletin.md`, `producer-growth.md`, `member-self-service.md`. Already flagged in CLAUDE.md.
- `product/capabilities/consumer-feed.md`, `landing-page.md`, `pin-accuracy-verification.md`, `shareable-listing.md` — relevant content, vendor/business framing.

**What remained authoritative (no change):**

- `product/foundation/loops.md`, `primitives.md`, `people-first.md`
- `product/systems/item.md`, `community.md`
- `product/ui/design-language.md`
- `planning/bundles/b1-primitives.md`
- `planning/AGENTS.md`, `planning/DECISIONS.md`
- `notes/migration-to-primitives.md`, `notes/idea-intake-template.md`
- `development/DEVIATIONS.md`
- `operations/outreach-list.md`
- `planning/scenarios/F001–F013` — historical scenarios for shipped work; documents what was built.
- `product/exploration/*` — the project's idea ledger; historical thinking is a feature.

**Live tree counts after the sweep:**

- products: 1 live (community-platform), 6 archived
- systems: 6 live (community, events, item, vendor-bulletin, vendor-intelligence, vendor-self-service), 6 archived
- capabilities: 4 live, 24 archived
- scenarios-backlog: 0 live, 4 archived (next batch will be F018+ against the new framing)

**Dangling references resolved:**

- `product/foundation/people-first.md` referenced the now-archived `community-impact.md` for the no-reviews stance. Replaced with an inline description of the Customer / Employees / Community / Planet pillar reporting model.
- `notes/migration-to-primitives.md` Phase 6 doc-work list updated to reflect that the archive sweep was already executed; remaining doc work is rewriting the kept-stale files.

**What needs attention next:**

1. PM approval of the amended migration plan (now with archive sweep + community-as-emergent + brand_label resolve-up).
2. Open T028 (members migration). Phase 1 is now seven migrations: 007 members, 008 locations, 009 items, 010 item-relations, 011 item-event-log, 012 communities. Plus T019 (geocoding) folds in cleanly.
3. Write F018 (unified Item composer with kind picker + sibling-clone for multi-location), F019 (Community create / join / browse), F020 (Item page resolve-up rendering) in `planning/scenarios-backlog/`.
4. Update `web/CLAUDE.md` to drop vendor-shaped instructions during Phase 3 cutover.

---

## 2026-05-08 (continued) — Community sharpened: emergent, optional, never auto-assigned

**The shift.** Community is a primitive (fourth, alongside Person / Item / Location), but it is **emergent and optional, not infrastructure**. The platform never auto-assigns a Member to a Community based on geography, follows, or attendance. A Community is what a set of people *becomes* when they decide they are a group — never what the platform decides they already are.

**The Drake's Run Club captures it in miniature.** The Gathering Item lives at Drake's (a Location) with a recurring schedule. People show up. Nothing in the schema requires them to be a Community. If, six months in, the regulars decide they want to be addressable as *Folsom Thursday Run Club* — to pool money for vests, post Wonders to themselves, organize a winter route — that's when one of them creates a Community and the others join. The Gathering keeps working unchanged.

**Where Community matters structurally** — Loop 11 (Pool resources), Loop 12 (Steward), and addressable Wonders/Offers/Asks. Capital can't be pooled by an ambient set; ongoing care of a shared thing requires a "we" with a record; "post my Wonder to West Sac school parents" needs a target.

**Where it doesn't matter** — Loops 1, 3, 4, 7, 8, 9. Items at Locations carry these. A Member with zero Community memberships finds the Run Club, lists their service, follows a maker, and finds a plumber, all without joining anything.

**The Location/Community distinction is the explicit rejection of Nextdoor's polygon model.** West Sacramento is a Location of kind=area. It contains many possible Communities, none of which it equals. Living in a polygon does not enroll you anywhere.

**Multi-location single-owner resolves up via `brand_label`, not via a new primitive.** Each location is its own Item; same `member_id` + same `brand_label` = locally owned multi-location ("Locally owned. Dr. Park also operates 3 other clinics."). Different `member_id` + same `brand_label` = franchise pattern ("Operated by 12 different local owners across the region."). Schema encodes the truth; the Item page renders it. No `member_groups` and no `brands` table at MVP.

**Files written:**
- [`product/systems/community.md`](product/systems/community.md) — full system spec for the Community primitive at MVP scope.

**Files updated:**
- [`product/foundation/primitives.md`](product/foundation/primitives.md) — title now "The Primitives" (was "Three Primitives"). Community section added after Location, with explicit "not equal to a Location" stance. Relationships expanded to include Item↔Community and Location↔Community.
- [`product/foundation/people-first.md`](product/foundation/people-first.md) — new section "Communities, too, are people-first" — never auto-assigned, never owned by a corporate shell, the Drake's Run Club used as the canonical example.
- [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) — Community moved from "deferred to b2" to "ships at b1, lightweight." Specific deferred surfaces named (posting feeds, stewardship rotation, fund linkage). Build-sequence step 9 sharpened: schema + create/join/leave + page + index + soft-membership inference + geographic suggestion at onboarding. **No auto-creation at any point.**
- [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) — Phase 1 adds `012_communities.sql`, `members.primary_community_id`, `items.community_id`, `items.brand_label`. Phase 2 backfill explicitly does not create any Communities. Phase 3 adds resolve-up rendering on the Item page (Phase 3 requirement, not deferred). Phase 4 ships `/c/[slug]`, `/c`, create/join/leave, onboarding suggestion. Hard constraint #8 added: Communities never auto-assigned. Hard constraint #9 added: multi-location resolves via `brand_label`, no `member_groups` at MVP.
- [`CLAUDE.md`](CLAUDE.md) — primitives section updated to include Community as fourth, with the emergent/optional framing. `community.md` added to the pattern-docs table.

**What this resolves:**
- The West Sacramento problem (city ≠ Community).
- The Run Club question (Gatherings work without Communities).
- The franchise vs. local distinction (visible in the schema via `brand_label` matching).
- The Loop 11/12 prerequisite (Community exists as a record, ready for capital pooling and stewardship surfaces in b2/b3).
- The Nextdoor critique (polygon does not enroll you; consent is the substance).

**What still needs attention next:**
1. PM approval of the amended migration plan.
2. Open T028 (members migration), now part of the Phase 1 batch including `012_communities.sql`.
3. Resolve open questions in `community.md` before T029b: slug-collision handling at create, soft-membership decay function, multi-anchor Communities, kind-transition auditing.
4. Write F018 (unified Item composer) and F019 (Community create / join / browse) scenarios in `planning/scenarios-backlog/`.

---

## 2026-05-08 — North star supersession: loops + primitives + Item, b1 re-architected

**The shift.** The previous five north stars (producer-marketplace-shaped: N1–N5) are superseded by the **13 loops in five families** (Gathering, Sharing, Trade, Pooling, Federation). The Mondragon trajectory is now first-class. Trade — what we've been building — is one family of five, and explicitly not the family people enter through. People enter through Gathering (Loop 1: find the Run Club at Drake's, Loop 2: float a Wonder, Loop 3: land here as a newcomer).

**The data spine.** Three primitives — **Person (Member), Item, Location** — replace the `businesses`-centric schema. There is no Business entity in the new model; "Oak Park Sourdough" is a label on a Person's Items, not a record that owns Items. This is the structural enforcement of the people-first principle.

**Why this matters in plain language.** Business serves people, not the other way around. Personal businesses — owned, operated, accountable to a real human or small group — are first-class. Corporate shells are not modeled at all. Size doesn't matter; personality does. See [`product/foundation/people-first.md`](product/foundation/people-first.md).

**Files filed (from Downloads):**
- [`product/foundation/loops.md`](product/foundation/loops.md) — north star
- [`product/foundation/primitives.md`](product/foundation/primitives.md) — data-model spine
- [`product/systems/item.md`](product/systems/item.md) — keystone primitive spec
- [`planning/bundles/b1-primitives.md`](planning/bundles/b1-primitives.md) — new b1 scope

**Files written:**
- [`product/foundation/people-first.md`](product/foundation/people-first.md) — the values stake
- [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md) — phased re-architecture plan

**Files archived:**
- `product/foundation/north-stars.md` → `product/exploration/archive/north-stars-2026-04-26.md` (superseded by loops.md)
- `planning/bundles/b1-mvp.md` → `planning/bundles/archive/b1-mvp-producer-marketplace.md` (superseded by b1-primitives.md)

**Architecture-fit summary.** Of the 24 shipped tickets (T001–T026), the philosophy is on-track but the spine is wrong. The `events` table is structurally an Item-of-kind=gathering. `follows` is structurally an `item_response`. Vendor profile, market schedule, and follower count map cleanly to Member + Item + Location. But `businesses` as the primary entity directly contradicts the new model — and `vendor_*` route shapes encode role-as-identity, which the new model explicitly rejects.

**The plan.** Re-architect at the floor (option 2 from yesterday's analysis). Six phases: (1) schema floor — `members`, `locations`, `items`, `item_locations`, `item_responses`, `item_tags`, `item_events` — additive, no UI change; (2) backfill + dual-write existing data into new tables; (3) Cluster 1 (Standing presence) on the new schema with new routes `/p/`, `/i/`, `/l/`, and a unified `/new` Item composer; (4) locality-first index + Wonder + thesis page (closes the b1 hypothesis); (5) sunset old schema once two weeks of zero-read on legacy tables; (6) cleanup — re-anchor mission, founding scenarios, vendor-shaped systems on Members. Roughly 12–17 weeks. Plan is in [`notes/migration-to-primitives.md`](notes/migration-to-primitives.md).

**What ships ahead-of-schedule features (Bulletins, founder dashboard) means.** They were built at b1 ahead of the new MVP's stricter scope. We don't tear them out — they re-anchor on Members in Phase 6. They become "Member sends bulletin to followers" and "Member sees their own analytics," not vendor-only surfaces.

**Hard constraints that hold across every phase:**
1. The grammar is "Person declares Item at Location; other Persons respond." Every PR must read more like that grammar than the previous PR did.
2. No `businesses` table in the new schema. No `business_name` column on Members. The label is Item-level.
3. The kind enum reserves `offer`, `ask`, `initiative` at MVP. They do not surface at b1.
4. No-login locality view (Loop 3) is non-negotiable at the new b1 cutover.
5. Wonder ships at b1.

**Outstanding pre-migration work.** T019 (geocoding) is still open from the old b1. It can ship before or in parallel with Phase 1 — geocoding work translates directly to Locations.

**What needs attention next:**
1. PM approval of the migration plan in `notes/migration-to-primitives.md`.
2. Ticket T028 — `members` table extraction (Phase 1, first migration).
3. Scenario F018 — unified Item composer (in `scenarios-backlog/`, to be written).
4. Decide whether T019 ships before Phase 1 or folds into Phase 1's Location work.

**Open questions surfaced by the supersession:**
- `mission.md` is still producer-marketplace-shaped. Rewrite during Phase 6 or sooner?
- `founding-scenarios.md` is Buyer/Producer-shaped. Add Run Club organizer, Wonder-floater, newcomer scenarios — when?
- Stays and Harvest were modeled as architectural verticals. The new model collapses them into Item kinds + (eventually) Communities. Decide before Phase 6.
- The five north stars (N1–N5) still appear in `b2-community.md` and several systems. Sweep references to the loops during Phase 6.

---

## 2026-05-07 — Pipeline process moved into skills; nested CLAUDE.md files removed

**What changed.** The four-agent pipeline (Product → Planning → Development → Evaluation) used to live in five nested `CLAUDE.md` files plus `~/.claude/templates/`. It's now six project-agnostic skills under [`skills/`](skills/). Nested CLAUDE.md files have been deleted; only the thin root `CLAUDE.md` and `web/CLAUDE.md` remain.

**New skills (under `skills/`, six total):**

| Skill | Replaces | Triggers on |
|---|---|---|
| `pipeline-router` | Root CLAUDE.md (process portion) | "what's the state of this project", session start |
| `pipeline-product` | `product/CLAUDE.md` | "explore", "write a system / capability" |
| `pipeline-plan` | `planning/CLAUDE.md` | "write a scenario", "approve", "scope a bundle" |
| `pipeline-build` | `development/CLAUDE.md` | "implement T###", "TDD this" |
| `pipeline-eval` | Evaluator role from AGENTS.md | "write evals for F###", "run evals" |
| `pipeline-scaffold` | `~/.claude/templates/scaffold-new-project.md` | "scaffold a new project" |

**Files deleted:** `product/CLAUDE.md`, `planning/CLAUDE.md`, `development/CLAUDE.md`.

**Files trimmed:**
- Root `CLAUDE.md` — now thin (project facts only: stack, repo structure, north stars, architecture, pattern doc pointers). Process is gone.
- `web/CLAUDE.md` — tightened to tech stack + commands + design system non-negotiables.

**Skills are project-agnostic.** No "Main Street" references inside `skills/`. They read the root `CLAUDE.md` for project context. To use them in another project, drop a thin root CLAUDE.md describing that project's facts and the skills will work as-is.

**Install (run once on this machine, from project root):**

```bash
mkdir -p ~/.claude/skills
for skill in skills/pipeline-*; do
  ln -sfn "$(pwd)/$skill" "$HOME/.claude/skills/$(basename $skill)"
done
ls -la ~/.claude/skills/ | grep pipeline-
```

**Plan + acceptance criteria:** [`notes/skills-migration-plan.md`](notes/skills-migration-plan.md).

**What needs attention next:**
1. Run the install command above.
2. Open a fresh session in this project. Confirm `pipeline-*` skills auto-trigger on the right phrases without manually `Read`ing the root CLAUDE.md.
3. Test in another project — drop a thin root `CLAUDE.md` and run `pipeline-scaffold`.
4. If a skill description doesn't trigger reliably, refine via `skill-creator` (Anthropic skill).

**Open question:** the global `CLAUDE.md` at `~/.claude/CLAUDE.md` (private, in `~/.claude/templates/`) still describes the tiered agent pipeline as a doc-driven pattern. Worth simplifying it now that the pipeline is in skills — but that's a separate cleanup pass.

---

## 2026-04-26 — Foundation cleanup + b1 status correction

**Foundation reorganized.** `product/foundation/` is now four files, each with one job:

| File | Role |
|---|---|
| `mission.md` (new) | The why, the vision, the arc. Replaces `thesis.md`. |
| `north-stars.md` (rewritten) | Five litmus tests for every feature. Broadened beyond food. |
| `platform-promise.md` (tightened) | Member, producer, and aspiring-producer commitments. Trailing meta question stripped. New "Promise to Aspiring Producers" section added. |
| `founding-scenarios.md` (rewritten) | Five canonical user stories — Buyer, Producer, Aspiring Producer, Community Organizer, Maker-Teacher. Brief; the app is already built so these are reference material. |

**Reframed scope.** The mission is now framed as a **producer marketplace** (existing makers + people who want to become makers). Farmers markets are the wedge to prove the model. The long arc explicitly covers all local goods and services — broader market categories, off-market producers, services, lodging, rides. This matches the actual vision better than the previous food-first / business-second framing.

**Five north stars** (replace the previous three):
1. Producers get found, get paid, grow.
2. Buyers find local options and stick with them.
3. The onramp to producerhood is open.
4. Communities can organize and signal demand.
5. Wealth circulates locally.

**Files moved out of foundation:**
- `product-format.md` → `product/products/marketplace-format.md` (it's a system spec, not foundation).
- `thesis.md` → `product/exploration/archive/` (preserved for history).
- `slow-economy-movement.md` → `product/exploration/archive/` (preserved; best parts folded into mission.md).

**References updated:**
- Root `CLAUDE.md` — north-star summary, canonical pattern docs table.
- `planning/bundles/b1-mvp.md` and `b2-community.md` — north-star references re-pointed to N1–N5.

**B1 status correction.** Yesterday's entry below claims T025 and T026 are still remaining. They have shipped — both are in `development/tickets/done/`, and `web/BUILD-LOG.md` reflects this. Only **T019 (geocoding + pin confirmation)** remains for b1. F014 is still in `scenarios-backlog/` and needs PM approval before the build agent can pick it up.

**What's Next:**
1. Approve F014 (move from `scenarios-backlog/` → `scenarios/`).
2. Hand T019 to the build agent.
3. After T019 ships, run success-metric queries against Sacramento beta data; if migration triggers in `b1-mvp.md` are met, scope b2.

---

## 2026-04-25 — Reframe: Producer Marketplace (b1 hypothesis officially updated)

**What Changed:**
- Officially retired the original "ownership map" hypothesis. Map is now a **second-class discovery view** inside Explore. The product is a **marketplace for local producers anchored at farmers markets** — buyers find/follow makers, makers communicate with buyers, and even at MVP makers see follower count + growth as the elusion to the future BI platform.
- Rewrote `planning/bundles/b1-mvp.md` around the new hypothesis. New success metrics measure the marketplace loop (follow rate, bulletin opens, vendor return rate) instead of vanity registrations.
- Created `planning/bundles/b2-community.md` — first real b2 spec. Absorbs the deferred polish (T020, T027), the T2 tiers from vendor-bulletin / vendor-intelligence / events systems, the trust-at-scale features (claim, moderation, full-text search, ownership filters), and the first in-app surface for the "create new makers" mission (educational landing + demand signaling; crowdfunding stays in b3).
- Refreshed `web/BUILD-LOG.md` with current ticket states and a "Remaining b1 MVP Work" section.

**The full b1 vision in one line:**
*If buyers can follow local producers and hear from them between market days, they'll show up more often and spend more — and producers will treat Main Street as their growth tool, not just a directory.*

**Three loops the MVP has to close:**
1. **Buyer loop** — open the app → see what's at my market this week → follow a maker → hear from them between visits.
2. **Maker loop** — claim a listing → tell my story → broadcast to followers → see who's listening.
3. **BI elusion** — even at MVP, makers see follower count + growth. Backs the recruitment pitch ("we'll help you compete with bigger players"). Full intelligence is b2.

**State of MVP (as of today):**
- Shipped: T001–T018, T021, T022, T023, T024 (24 tickets).
- Remaining b1: **T025** (vendor bulletin compose — unblocks T024's pinned bulletin section), **T026** (founder dashboard — backs the vendor pitch), **T019** (pin accuracy via geocoding — trust hardening).
- Recommended order: T025 → T026 → T019 (T019 can run in parallel).

**Why this isn't scope creep:**
- T024 (already shipped) includes a "From vendors you follow" section that has nothing to render until T025 ships. The bulletin work isn't a new feature — it's completing what T024 started.
- T026 is scoped lean per `vendor-intelligence.md` T1 only — followers, profile views, top tasks, listing health. No segmentation, no benchmarks, no digest emails. Those are b2.
- "Create new makers / self-sufficiency / local prosperity" is the broader mission but lives in b2's mission-expansion section, not in MVP code. The MVP earns the right to ask people to start a business by first proving we can grow one.

**What's Next:**
1. Approve scenarios for T025 and T026 if any are still in `scenarios-backlog/` (F014 is in backlog — needed for T019).
2. Hand T025 to the build agent.
3. After T019/T025/T026 ship, run the success-metric queries against Sacramento beta data; if migration triggers from `b1-mvp.md` are met, scope b2.

---

## 2026-04-25 — Community Platform architecture + Vendor Intelligence roadmap

**What Changed:**
- Created `product/products/community-platform.md` — defines page roles (Home = local feed, Explore = catalog, You = identity), capabilities table with tier assignments, MVP boundary
- Created `product/systems/events.md` — unified Event object (market_session / class / community_project / vendor_special) tiered T1→T3, with full data model designed up-front
- Created `product/systems/vendor-bulletin.md` — vendor-to-follower broadcast (Substack-light), tiered T1→T3
- Created `product/systems/vendor-intelligence.md` — **the vendor BI roadmap.** This is the document for vendor recruitment conversations: "we'll help you compete with bigger players." Tiered T1 (founder dashboard) → T2 (engagement insights) → T3 (competitive intelligence). Includes data model implications to bake in from MVP.

**Key decisions:**
- Home page metaphor = Nextdoor-style local feed (most familiar pattern)
- Following list folds into /you — no dedicated `/following` route post-MVP
- Active market selector lives on /you (not a global header pill) — travel mode not worth MVP friction
- Vendors get a **two-tab You** in T2 (Shopper / Business) — Etsy / Airbnb pattern
- Vendor Bulletin deferred to T2 but **data model designed now** to avoid retrofit pain
- Event sourcing for vendor-side actions (`vendor_events` table) baked in from MVP — cheap to write, impossible to backfill

**What this unlocks:**
- PM can now scope MVP vs later by reading `community-platform.md` table and tier summaries
- Vendor pitch deck can quote directly from `vendor-intelligence.md` "The pitch" section
- Dev can plan the events / vendor_events / bulletin_deliveries schemas in the next ticket cycle so we don't bolt them on later

**Open questions captured in each system doc** — see "Open Questions" sections.

---

## 2026-04-25 — Design Language System (Tide accent + CTA patterns)

**What Changed:**
- Created `product/ui/design-language.md` — Main Street DLS: tokens, type scale, component recipes, CTA placement playbook
- Adopted Tide (`#0FAB8E`) as the single accent color — Caribbean green, Airbnb-Rausch register
- Documented eight CTA placement patterns from Airbnb (persistent top-right primary, two-track parallel entry, progressive commitment / peak-intent signup, one primary per screen, sticky mobile CTA, hero-as-search, trust microcopy, modal vs route auth)
- Updated ownership tier colors to a green→gray spectrum (coop deepest green → pe-corporate near-black). Added `[data-extractive="true"]` desaturation treatment for PE listings.
- Created ticket `T021-tide-accent-and-cta-patterns.md` — implementation of accent swap, two-track nav, auth-gate modal, recruitment section, sticky mobile CTA

**Status:** T021 ticket drafted, not implemented. Page-roles work above is a separate stream.

---

## 2026-04-24 — Vendor Self-Service & Pin Accuracy — Scenarios + Tickets

**Scenarios Written (in backlog — need approval):**
- F014: Vendor Pin Confirmation — geocode → map preview → confirm or drag-to-correct during registration (b1)
- F015: Community Pin Flagging — logged-in users flag wrong pins, owners notified and correct (b2)

**Tickets Written:**
- T019: Geocoding pipeline + pin confirmation UI (b1, extends F003 registration)
- T020: Community pin flagging table + UI + owner resolve flow (b2, depends on T019)

**Notes:**
- F014 extends the existing F003 registration flow — adds a pin confirmation step between address entry and submission
- T019 reuses Mapbox GL (already in the stack) for both geocoding API and map preview
- T020 is b2 scope but ticket is written now for completeness; depends on T019's draggable pin component

---

## 2026-04-24 — Vendor Self-Service & Pin Accuracy System

**What Changed:**
- Created `product/systems/vendor-self-service.md` — tiered system for self-service data entry, geocoding pipeline, and pin verification
- Created `product/capabilities/pin-accuracy-verification.md` — vendor pin confirmation (b1) and community flagging (b2)
- Core principle established: **the platform never manually enters businesses.** All data comes from vendors, community nominations, or verified bulk sources.
- Pin accuracy is layered: T1 = vendor confirms after geocode, T2 = community flags + address verification API, T3 = cross-reference + confidence scoring
- Geocoding service (Mapbox Geocoding) required from b1 launch

**Open Questions:**
- Which geocoding provider for b1? Mapbox Geocoding is default since we use Mapbox GL already — confirm.
- Address verification service for T2 — Smarty vs Lob vs USPS direct?
- Should community-flagged pins show any visual treatment to consumers, or only surface to the owner?

---

## 2026-04-24 — Pivot: Etsy-style Feed-First + Farmers Market Anchor

**What Changed:**
- Pivoted product framing per `refinement.md` — Sacramento-anchored "follow your vendors" app rooted at farmers markets. Core mechanic: feed + search, Etsy-style home, local-first via market selection.
- Map is NO LONGER the home screen. Map is a toggle view inside the Explore tab.
- Ownership-tier pin coloring deprecated for this product (all farmers market vendors are independent by definition). Pins now color by primary product category.
- Bottom nav introduced: Home · Explore · Following · You.

**Scenarios Approved (moved to planning/scenarios/):**
- F008: Home Feed — Etsy modular layout (hero, category grid, horizontal rails)
- F009: Market Selection — bottom-sheet picker with persistence
- F010: Explore — search + list/map toggle
- F011: Vendor Profile — added market schedule with next-appearance dates
- F012: Follow Vendor — email notifications for upcoming market appearances
- F013: Bottom Navigation — persistent tab bar + upward-opening menu rule

**Tickets Written (T012–T018):**
- T012: Market schema + seed data (markets, market_vendors, vendor_categories, follows, is_featured)
- T013: Bottom navigation shell
- T014: Home feed Etsy-style
- T015: Explore with list/map toggle (absorbs old `/map`)
- T016: Market selection modal
- T017: Vendor profile update (slug routing, market schedule)
- T018: Follow vendor + nightly email notifications

**Design Decisions Baked In:**
- Hero featured vendor: manual admin curation (`is_featured` flag + `featured_at` timestamp)
- Map pins: color by primary category (not ownership)
- "Favorites" renamed to "Following" to match our follow semantics
- Thesis statement "Every dollar you spend here stays here." shown only to first-time guests
- Upward-opening menus: any trigger in the lower half of the viewport opens its popover upward to avoid clipping behind bottom nav

**What's Testable Now:**
Existing b1 build (T001–T011) runs: `cd web && npm run dev`. Map with colored pins, business detail card, registration, share, support, report all work. This is what exists before the pivot lands.

**What Needs Attention:**
- Old business-oriented files (business-data.md, ownership.md systems) don't reflect the vendor/market framing — need product-level cleanup at some point
- Bundle b1-mvp.md hypothesis references ownership visibility as the core hypothesis — needs updating to "follow your vendors" hypothesis
- Market seed data is Sacramento-only (Folsom, Sacramento Central, Roseville) — ok for b1 launch

**What's Next:**
Start T012 (schema) — everything else depends on it.

---

## 2026-04-20 — Architecture Reframe: Core + Category Verticals

**Key Insight:** Main Street IS the platform. Business listings aren't a "vertical" — they're the core. Stays and Harvest are category verticals that extend the core with specialized listing types.

**Model:**
```
Main Street (core) → business listings, map, ownership, trust, profiles
  ├── Main Street Stays (vertical) → rentals
  ├── Main Street Harvest (vertical) → farms, ranches
  └── Future verticals
```

**Naming convention:** "Main Street ___" for verticals. Stays for rentals, Harvest for food/ranch.

**What Changed:**
- Rewrote `product/products/platform.md` — core + verticals model replaces sibling-verticals model
- Rewrote `product/systems/platform-core.md` — core = business discovery (existing app), T2 adds vertical extension layer
- Updated stays product/system files to say "extends core" not "shares with businesses"
- Updated all business product files (map, business-data, ownership) to say "Platform Layer: Core"
- Updated root CLAUDE.md with correct architecture table
- Updated shared capability files for core-plus-verticals language

**Implication for code:** No refactor needed now. When first vertical ships, extract shared code into `core/` and put vertical-specific code in `verticals/stays/`. Current codebase IS the core.

---

## 2026-04-20 — Platform Architecture + Main Street Stays

**Architecture Decision: One App, Multiple Verticals**
- MSM is now a **multi-vertical platform** with shared core services
- Businesses and Stays are the first two verticals, sharing identity, profiles, map, and community trust
- Not microservices — same Next.js app with feature-based directory structure (`core/`, `verticals/businesses/`, `verticals/stays/`)
- Rationale: 70% structural overlap (profiles, map, trust, reviews) makes splitting wasteful. Cross-vertical links (amenity → business) create network effects.

**What's New:**
- Added **Main Street Stays** — a short-term rental marketplace as a new vertical within MSM
- Core thesis: single-unit local hosts, total cost transparency, amenity-driven competition (not price), anti-deception by design
- Platform intentionally makes it hard for multi-unit operators (friction gate at 2 units, hard block at 3+)

**Artifacts Created:**
- `product/products/stays.md` — Product file with capabilities, tiers, community protection list, anti-deception features
- `product/systems/stays.md` — T1/T2/T3 tiered system design
- 10 capability files in `product/capabilities/stays-*.md`:
  - T1: host-onboarding, multi-unit-friction, total-cost-display, mandatory-disclosures, amenity-showcase, traveler-search, booking-flow, verified-photos
  - T2: neighborhood-context, local-recommendations

**Key Design Decisions:**
- No cleaning fees — ever. All-inclusive nightly rate.
- No algorithmic pricing suggestions. Hosts set their own prices.
- Hosts compete on amenities (gourmet coffee, bikes, curated guides), not on undercutting each other
- Natural person requirement — no LLCs, no property management companies
- Cross-links to Main Street Market business listings from amenity showcase and local recommendations

**Platform Artifacts Created:**
- `product/products/platform.md` — Platform architecture overview (shared core + verticals)
- `product/systems/platform-core.md` — Shared services: identity, profiles, map, community trust, data model
- 4 shared capability files: `platform-owner-profile`, `platform-identity-verification`, `platform-map-discovery`, `platform-cross-vertical-links`
- Updated all existing business product/system files to reference platform core
- Updated root CLAUDE.md with platform architecture section

**What Needs Attention:**
- Bundle assignment — stays needs its own bundle or integration into existing b1/b2/b3
- Scenarios need to be written for all T1 stays capabilities
- `web/` directory structure needs planning for verticals (`core/`, `verticals/businesses/`, `verticals/stays/`)
- Need to decide: does stays share the same b1 MVP or get its own launch bundle?
- Bottom nav design with multiple verticals (tab per vertical? unified with filters?)

---

## 2026-04-10 — Pivot: Local Business Promotion Platform

**What Changed:**
- Pivoting from consumer-map-first to **business promotion platform with map as discovery tool**
- Primary value prop shifts from "see who owns what" to "help local businesses get visibility"
- Home screen becomes a feed of nearby promotions/events/updates, not a full-screen map
- Map moves to a secondary discovery tab

**New Capabilities Written:**
- `business-promotions.md` — time-limited deals with start/end dates
- `business-events.md` — events at/by the business
- `business-updates.md` — general news and announcements
- `consumer-feed.md` — location-aware feed as home screen
- `community-impact-badge.md` — simplified badge system

**Badge System Overhaul:**
- 6-tier ownership classification → 2 community impact badges (Green = Community Builder, Gray = Listed)
- Focus on "how does this business help the community" not "who owns it"
- Third badge (Amber = Under Review) deferred to b2, let Report a Concern handle negative signals
- New system spec: `product/systems/community-impact.md`

**Exploration:** `product/exploration/pivot-local-business-platform.md` has the full thinking

**What Needs Attention:**
- Bundle b1 scope needs rewriting to reflect pivot
- Existing scenarios (F001-F005) need review — some still apply, some don't
- Database schema needs `community_badge` field, new tables for promotions/events/updates
- Home page route needs complete redesign (feed, not map)
- Bottom nav needs tabs: Home (feed), Map, Post (owner), Profile

**Open Questions:**
- Should business owners and consumers share the same home screen or get role-based routing?
- How do we verify "Community Builder" claims without creating bureaucracy?
- Do we seed promotions/events for the Folsom coffee shops to have launch content?

---

## 2026-04-09 — Community Accountability Model: BBB With Teeth

**What's Done:**
- Added `product/exploration/community-accountability-model.md` — the definitive interaction model
- Replaces "I visited here" entirely

**Key Decisions:**
- **❤️ Endorse** replaces visit/check-in. One tap, means "this business and its people are worth supporting." Not a visit, not a review — a stance.
- **Report a concern** replaces text notes. Structured around four pillars: Customers, Employees, Community, Planet. Private, never displayed individually. Pattern + volume triggers review.
- **Business Standing** system: Good Standing → Concerns Raised → Under Review → Questionable → Cleared. One person can never damage a business. Only verified concerns change standing.
- No public text, no reviews, no stars, no check-ins. Ever.

**b1 impact:** F005 "Visit Interaction" needs to become "Endorse + Report" in the bundle, capabilities, and scenarios. The founding scenarios (Maria's "I visited here" note) need updating to use the endorse model instead.

**Supersedes:** `community-signals.md` (earlier exploration, now outdated by this model)

---

## 2026-04-09 — Product Identity: We Are Not Yelp

**What's Done:**
- Added `product/exploration/business-accountability.md` — public record transparency (verifiable actions only, not opinions)
- Added `product/exploration/product-identity-what-we-are-not.md` — foundational product strategy doc

**Key Decision:**
Main Street Market classifies businesses by ownership structure and verifiable facts. It does NOT rate businesses on subjective experience. The one-line test: "Is this about structure/facts or opinions?" If opinions, it doesn't belong.

**Product Identity:**
- We are an ownership transparency platform, not a review platform
- Core unit = structure (who owns it), not opinion (was it good)
- No public reviews, no star ratings, no subjective comments — ever
- Behavior signals (if added in b3) must be private/aggregate or based on public records only
- Revenue must come from consumers, not businesses — selling visibility to businesses poisons trust

**Revenue direction:** Consumer subscription, city sponsorship, data licensing, incubator/food-network transaction fees. NOT Yelp-style pay-for-visibility.

---

## 2026-04-09 — New Ownership Tier: Mission-Driven

**What's Done:**
- Added 6th ownership tier: **Mission-driven** (warm purple) — for B Corps, public benefit corporations, and large companies with demonstrated commitment to customers/community (Patagonia, REI, Costco)
- Updated `product/systems/ownership-classification.md`, `product/products/ownership.md`, `product/foundation/founding-scenarios.md`

**Rationale:**
Not every big company is the enemy. Some are genuinely trying to do right — B Corp certified, registered as PBCs, or just consistently pro-customer. Consumers want to know about these too. They're not gold-pin independent, but they're not grey-pin extractive either. Warm purple = "honorable mention."

**Open Question:**
What qualifies? B Corp certification and PBC registration are verifiable. But companies like Costco have no formal certification — just reputation. Need clear criteria before b1 ships.

---

## 2026-04-09 — Exploration: Incubator + Local Food Network

**What's Done:**
- Added `product/exploration/small-business-incubator.md` — community demand signaling and crowdfunding for aspiring independent business owners. Demand signaling (no money) is b2, crowdfunding is b3.
- Added `product/exploration/local-food-network.md` — "know your farmer" infrastructure connecting consumers with local food producers. Strong b2 candidate.

**Key Decision:**
Local Food Network is a strategic priority for b2. The b1 data model and architecture MUST be built with extensibility toward food producers in mind. See ADR-2 in planning/DECISIONS.md. No b1 ticket should create a schema, category system, or business model that would require a rewrite to accommodate farms, ranches, and seasonal food producers.

**What Needs Attention:**
- Scenario Writer and Build Agent need to see ADR-2 so b1 implementation stays extensible
- Review b1 systems (business-data, ownership-classification) for food-network compatibility before writing scenarios

**What's Next:**
- Proceed to Scenario Writer for b1 MVP

---

## 2026-04-09 — Project Scaffolding

**What's Done:**
- Initialized project structure per agent pipeline template
- Created CLAUDE.md files (root, product, planning, development, web)
- Set up planning/AGENTS.md with four-agent pipeline
- Created planning/bundles/b1-mvp.md with MVP scope (F001–F005)
- Wrote 3 systems: map-system, business-data, ownership-classification
- Wrote 5 capabilities: map-search, business-detail-view, business-registration, shareable-listing, visit-interaction
- ADR-1: Tech stack — Next.js + Tailwind + Supabase + Mapbox + Vercel
- Copied founding scenarios to product/foundation/

**What Needs Attention:**
- Write product files to `product/products/` (one per major system)
- Populate product/foundation/ with mission and guiding principles
- Review systems and capabilities for completeness before scenario writing

**What's Next:**
1. Write product files for map, business data, ownership systems
2. Hand off to Scenario Writer to create scenarios for b1 MVP
3. PM reviews and approves scenarios (move to `planning/scenarios/`)
4. Evaluator writes tests
5. Ticket Writer creates tickets
6. Build Agent implements
