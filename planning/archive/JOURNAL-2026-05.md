# JOURNAL — May 2026 archive

> Archived from the active [`../../JOURNAL.md`](../../JOURNAL.md) on 2026-05-10 as part of the journal/decisions weight-reduction. The active JOURNAL keeps only the current top entry and a pinned "Next session pickup." Older entries live here for trace.
>
> Subsequent rotations: **2026-05-18** appended the May 11–17 entries (ADR organization restructured, payments.md walk, Intent-audit pass, agent-commerce amendment, ADR-15/16 ratification, root-level philosophy moves, action-layer graduation, producer-* re-anchor, Phase 4 doc cleanup, platform-wide naming pass).

For pre-mission-clarity entries, see [`JOURNAL-pre-mission-clarity-2026-05-08.md`](JOURNAL-pre-mission-clarity-2026-05-08.md).

---

## 2026-05-17 — ADR organization restructured: `planning/adrs/` directory, full-text ADRs migrated, pending ADRs resolved, ADR-18 + ADR-19 landed, `pipeline-adr` skill drafted

**What changed.** ADRs now live in `planning/adrs/`, one file per ADR. `DECISIONS.md` is pure pointer index. `notes/eval-helpers-architecture.md` retired (left as a redirect stub) → `ADR-0018-eval-helpers.md`. Pending banners (ADR-13 Groups consolidation, ADR-14 Location spine + child) now have canonical files. Rebuild plan promoted to `ADR-0019-clean-slate-rebuild.md` (the prior `notes/migration-to-primitives.md` long-form phase plan remains as ADR-19's home doc).

**New scaffolding.** `planning/adrs/README.md` (format, lifecycle, "what belongs here" guidance). `planning/adrs/_template.md` (copyable shell). `skills/pipeline-adr/` (SKILL.md + workflow.md + templates/adr.md) — the canonical workflow for writing/ratifying/superseding ADRs. Routing entry added to root `CLAUDE.md`.

**Cross-cutting full-text moved out of DECISIONS.md.** ADR-4 (locality default), ADR-15 (auth PK equality), ADR-16 (affinity row privacy), ADR-17 (bounded_purchase). DECISIONS.md keeps pointer rows; the canonical record lives in `adrs/`.

**Stale references fixed in T052.** Three references to "ADR-10's same-transaction invariant" updated to "ADR-7's same-transaction invariant" (ADR-10 was consolidated into ADR-7 on 2026-05-10). T052 Status flipped: Draft → Accepted (ADR-18 ratified).

**Pending file creation** (low priority — spec banners are sufficient until then): ADR-1, ADR-2, ADR-5, ADR-6, ADR-7, ADR-9 each need a summary file in `adrs/` cross-referencing their home doc. *(Closed 2026-05-18 — all six stubs landed.)*

**Why this matters.** Documentation discipline scales with friction at write-time and discoverability at read-time. The new structure collapses write-time friction (one path, one filename convention, one ratification flow) without changing read-time discoverability (DECISIONS.md is still the canonical index). The `pipeline-adr` skill makes the workflow runnable rather than informal.

---

## 2026-05-17 — `payments.md` walk completed (15 of 15 statements) — two material PM reframes mid-walk

**Walk completed via `pipeline-clarify-absolutes`** (PM-directed: straight to clarify, no dialectic pre-pass). 15 Category-2 absolutes ratified; the walk produced more design content than annotation because **two of the three load-bearing commitments in the spec turned out to be PM-misframed** as categorical when the actual stance is conditional.

**Major design content surfaced (two material reframes):**

> **Reframe #1 — Custody (statement 2, §1/§2/§6/§7/§18).** The spec's "platform never custodies for itself — the one absolute" was retracted as categorical. PM clarified: the platform-as-deposit-bank shape is refused (chartered partner's job), but the platform-as-operating-entity holding funds for its own operations or specific mission-aligned use cases (grants pools, escrows, success-fee accruals) is allowed. Two-prong test landed at §1: (1) not a deposit-taking arrangement, AND (2) holding produces a concrete platform-sustainability benefit consistent with the mission per the §3 rubric. Cascading rewrites at §2 rules-out preamble + bullet, §6 opening, §7 stablecoin invariant, §18 closing.

> **Reframe #2 — Fees (statement 10, §9/§7/§18).** Two PM corrections in one statement walk. First pass: revised "zero transaction fees" → "default zero, fees admissible as last-resort sustainability mechanism." Then PM reversed: **default is to collect fees if possible, non-extractively.** Final five-prong test landed at §9: (1) doesn't gate access, (2) transparent disclosure, (3) doesn't punish small operators, (4) revenue funds mission-aligned operations, AND (5) excess revenue routes back to communities per §3 rubric (member dividends, community grants, CDFI lending, federation reserves). **Major messaging shift:** the platform's contrast with Yelp/Etsy/Stripe is no longer "no fees" — it's *"fees compound in, not out."* §18 closing rewritten. L54 rules-out narrowed to extractive shapes only. The L270 line that previously listed "transaction fees on M2M commerce" as categorically excluded was rewritten to refuse only extractive shapes.

**Cross-spec implications (open for future sessions):**

- **Public-facing copy.** The "no fees" framing has propagated to `producer-bulletin.md`, `producer-growth.md`, `platform-promise.md`, the surface specs (`community-platform.md` et al.), and `foundational-principles.md` Part 8 (the 2026-05-12 monetization rewrite). All need a consistency pass against the new "non-extractive fees, default collect" framing. Major messaging delta: the contrast with extractive platforms is *where the fees go*, not whether they exist.
- **Status banner at top of `payments.md`** still lists "pending user ratification on... the fee commitment (§9)." This walk reframed §9 substantively but did not formally close the ratification — the banner stays. PM may want to formally ratify the new §9 framing and update the banner.
- **`foundational-principles.md` Part 8** (revised 2026-05-12, "multi-source revenue platform — not VC-funded, not member-fee-only") is broadly consistent with the new §9 framing but should be cross-checked for any residual "no transaction fees" assumption.

**Walk count.** 15 statements processed: 4 with bullet revision + Intent (statements 2, 10, plus the L47 preamble and L54 rules-out as cascading cleanup), 11 with Intent-only. Zero "no-change" decisions. Dialectic skills not invoked (PM directed straight to clarify-absolutes at session start).

---

## 2026-05-12 — Intent-audit pass landed across foundation + systems (high-value targets) · Agent-commerce amendment integrated · Payments spec drafted · clarify-absolutes / dialectic skills landed · groups.md walk completed (15/15)

> Multi-thread session. Several same-day sub-entries consolidated below.

**Intent-audit pass.** Applied the audit's proposed `Intent:` annotations across foundation/ and systems/ docs — inline form for short statements, block-quoted for structural decisions. Annotated foundation docs (`foundational-principles.md`, `people-first.md`, `loops.md`, `primitives.md`, `policy-framework.md`, `agent-assistance.md`) and system docs (`groups.md`, `item.md`, `location.md`, `discovery.md`, `action-layer.md`, `member.md`). Same-day revision: `people-first.md` Intent lines on "no Business entity" and "no reviews, no ratings" rewritten after PM noted both are shape-specific (impersonality is the extractive vector; reviews exist for *treatment of publicly-offering Members*). New skill `pipeline-intent-check` (out-of-band quality gate; CLEAN / PROPOSE / BLOCK / ESCALATE verdicts) added; registered in `CLAUDE.md` + `AGENTS.md` as rebuild-phase rule #9.

**F13 in PIPELINE-AUDIT.md.** "Two failure modes every gate guards against" landed as a new finding: over-fit on literal wording vs. reconstruct intent and drift. The *co-locate why with what* discipline propagated into `pipeline-plan` / `pipeline-ticket` / `pipeline-build` / `pipeline-eval` workflows (Approach C: discipline section + checklist enforcement). Each producing skill now carries a "Co-locate `why` with `what`" section + verification step before hand-off. `DEVIATIONS.md` entries gain `**Why:** …` and `**Disposition:** …` lines.

**Framework correction + new skills.** PM correction during the `groups.md` walk: **there is no purely-categorical refusal in this project.** Every "Never / won't / doesn't / cannot / refuses / always / must / no X" carries a *why*, co-located with the *what*. Three landings: revised `intent-audit.md` addendum (later archived 2026-05-12 to `planning/archive/intent-audit-2026-05-12.md`); revised `pipeline-intent-check` verdicts (added ESCALATE for Category-2 candidates); rebuild-phase rule #10 in `CLAUDE.md` + new "Meta. Clarify Absolutes" section in `AGENTS.md`. New skill `skills/pipeline-clarify-absolutes/` (conversational, per-statement, PM-ratification gated, adaptive question style). Member/platform dialectic skills landed (`pipeline-member-advocate`, `pipeline-platform-advocate`) — two adversarial skills + PM as adjudicator; default one-bullet output, expandable to 150–250 word position paper on PM request. Platform-advocate carries two equal weights: utility + financial durability (no VC, multi-source revenue early). Skills registered in `CLAUDE.md` + `AGENTS.md`. T2/T3 deferral sweep parked (post-T1) per `planning/pending-ratifications.md`.

**`groups.md` walk completed (15/15).** Statements 1–3 ratified earlier; statements 4–7 surfaced mid-walk pivot: **Member-anchored social capital** ratified (closing the three-framings uncertainty from #4 + #6); transfer/appointment design deferred to "substantial-scale" Groups. Statements 8–15 landed in the final pass — door-open framing for SECURITY DEFINER (wall stays up, doors open *through* it); locality-verification gaming gap surfaced (new OQ #5, peer-verification direction, one-Member-vs-many-Members tension framing → Task #19 queued); `items.member_id NOT NULL` Intent'd as schema-level enforcement of no-impersonal-business-entity; Group-coordination agents are valuable but platform-curated at b1 (new OQ #6); action-layer rejects corporate-shell shapes (runtime guardrail counterpart to #10); no auto-assignment to Groups Intent'd against Nextdoor failure mode; no Group discovery feed Intent'd against engagement-optimization categorical failure → Task #20 (foundational-principles ad-policy softening); statement 15 bullet revised (affinity-vs-membership distinction). **Final state:** 12 substantive new Intent annotations + 5 new OQs + 1 bullet rewrite. `pipeline-member-advocate` updated for one-Member-vs-many-Members tension shape (Task #19 done).

**Agent-commerce amendment integrated.** `agent-commerce-and-project-amendments.md` walked through five corrections plus new monetary-flow Delegation scope. Maker rename: **Seller** (generic) + **Producer** (ag/food). Group C `bounded_purchase` shape ratified. Cooperative coordination softened across `groups.md` ("deferred indefinitely" → "deferred until real-world need + explicit user prioritization"). Reviews / social capital in `member.md`: "permanently deferred" rescinded. Anti-Nextdoor in `policy-framework.md` §1/§2/§3: categorical "Never" softened to design intent; complaint-handling reframed from "downvote-and-remove" to "push back on complaint-only, offer (not force) fix-it path." Money flow in `groups.md` + cross-spec pointers: "Member-to-Member directly" → "visible and accountable" framing. **Maker mode retired** per §6 (ADR-12 SUPERSEDED): `members.maker_mode_enabled` column dropped; toggle handlers retired; selling tools surface from kind='business' Group membership / kind='product'/'service' Item presence. **`bounded_purchase` Delegation scope ratified as ADR-17** (cross-cutting): schema-enforced caps + recipient_scope + category_scope + reversibility window + first-recipient confirmation. **`product/systems/payments.md` created** — full system spec for money-movement primitive (closed-loop ledger + chartered-partner ACH as b2 rail; wealth-circulation rubric §3; zero platform transaction fees on Member commerce; platform never custodies for itself; stablecoin path gated at T3). **`planning/pending-ratifications.md` created** — Group A2 + D output; ~170 commitment-bearing occurrences flagged.

**Foundation-doc coordinated revision pass (Tasks #16, #17, #20).** `people-first.md`: Line 27 sharpened to **"no *impersonal* Business entity in our schema — no business on its own without a person, no business without human social capital behind it."** New section **"The question business Groups exist to answer"** landed (is this local / does it support my community / should I support it?). `foundational-principles.md` Part 3: Categorical failure entry softened from "Ad injection. Of any kind, from any party." to **"Engagement-shaped ad injection."** Community-vetted sponsorship, vetted local promotions, federation-partner placements, verified-local badges = revenue-design space, not categorically refused. `foundational-principles.md` Part 8: Comprehensive monetization-section rewrite. Working hypothesis: **"A multi-source revenue platform — not VC-funded, not member-fee-only."** Three commitments: (1) no venture capital — VC alignment with exit is misaligned with Member-better-off purpose; (2) multi-source revenue from early on — Member fees are *one small part*; (3) Free core participation is non-negotiable. New refusals: Venture capital funding; Over-reliance on a single revenue line (>50–60% concentration triggers re-evaluation).

**Memory hygiene.** `intent-audit.md` archived to `planning/archive/intent-audit-2026-05-12.md` with pointer to live skills + AGENTS.md preamble + PIPELINE-AUDIT F13. ~10 references updated across `CLAUDE.md`, `AGENTS.md`, `PIPELINE-AUDIT.md`, `pending-ratifications.md`, four skill workflow files. T050 Intent annotations landed (four `_Intent: ..._` lines on acceptance criteria). `pipeline-review-absolute` skill exists (built between sessions) — registered in CLAUDE.md rebuild-rule #11 and AGENTS.md sections.

---

## 2026-05-11 (latest) — ADR-15 + ADR-16 ratified; verification-ladder promoted

**What.** Three product-agent moves landed in one session:

1. **ADR-15 written up** — `public.members.id = auth.users.id`; Supabase Auth post-signup trigger is the only path to Member creation. Documents the decision that T042 + T043 + T044 implemented during Phase 0. The PK-equality coupling, the trigger → Next.js route → action-handler flow, the `login_disabled = true` system-Member exception, the failure modes (hook unreachable / signature invalid / handler error), and the Supabase-replacement foreclosure cost are all captured. Lives cross-cutting in [`planning/DECISIONS.md`](../DECISIONS.md) since the auth model shapes RLS across every spec.

2. **ADR-16 propagated to the three load-bearing specs** — `member.md` (RLS sketch now declares `member_location_affinities` owner-only; substrate section adds the three SECURITY DEFINER function paths and the no-similarity-matching-opt-out note); `groups.md` (Locality and promotion now calls `public.member_is_local_to_location()` instead of JOINing against affinities directly; reference pseudocode added); `policy-framework.md` (anti-Nextdoor commitment §1 upgraded from three-layer to four-layer enforcement — RLS is now the third layer; the structural-enforcement-not-discipline framing made explicit). Decisions-encoded footers updated in all three files.

3. **Verification-ladder doc promoted** — `product/exploration/locally-owned-verification.md` → new `product/systems/business-jurisdiction.md` (T1/T2/T3 tiered, with the `member_business_jurisdictions` schema, the `public.zip_is_proximal_to_location()` derivation path, the four `member.business_jurisdiction.*` action handlers, and the full three-filter policy-posture analysis). The exploration doc retains its source-conversation context but is now marked PROMOTED. The locality-derivation question that ADR-16 left open (how does the platform know a business is local without exposing the home address?) is structurally answered by the jurisdiction ladder — affinity is owner-only and serves the Member's own surfaces; jurisdiction is public and serves the Group's locality claim. CLAUDE.md and MAP.md updated with the new spec.

**Why.** ADR-16 changed the locality-derivation contract — `groups.md`'s previous "JOIN against `member_location_affinities`" approach no longer typechecks against owner-only RLS. Two patches needed in sequence: (a) replace the JOIN with the SECURITY DEFINER function path (ADR-16's prescribed access pattern); (b) introduce the public floor of evidence so the locally-owned claim survives the loss of affinity as a public signal (the jurisdiction ladder). ADR-15 was written up separately because the auth coupling is its own load-bearing decision and was previously documented only in ticket bodies — the ADR makes it discoverable in the cross-cutting register.

---

## 2026-05-11 (later) — Root-level philosophy docs moved into `product/foundation/`; `product/products/` renamed to `product/surfaces/`; partial notes/ distribution

**What.** Two root-level docs (`community-design-philosophy.md` brand-new, `foundational-principles.md` existing) didn't belong at the root — both are foundation-grade. Decision: keep all of them, make CDP the top-level measuring stick, cross-link aggressively, no deletions. Moves: `community-design-philosophy.md` → `product/foundation/community-design-philosophy.md` with cross-links into loops/people-first/policy-framework/platform-promise/groups/item/action-layer; `foundational-principles.md` → `product/foundation/foundational-principles.md` paired with CDP (CDP wins on "what good looks like"; foundational-principles wins on "does this proposal pass"); `product/products/` → `product/surfaces/` (the directory's one live file `community-platform.md` is a consumer-surface description, not a "PM dashboard"); `notes/agent-assistance-handoff-2026-05-09.md` → `planning/handoffs/`; `notes/idea-intake-template.md` → `product/templates/idea-intake.md`. The biggest remaining move — `notes/migration-to-primitives.md` → `planning/` — was deferred to the Phase 1 → Phase 2 boundary (after T049 closes) to avoid mid-phase reference breakage. The CDP banner asserts conflict-resolution order: CDP wins on principle/rubric; system specs win on structural mechanism; foundational-principles wins on binary pass/fail.

---

## 2026-05-11 — Action layer graduated · vendor-* re-anchored as producer-* on Members · vendor-self-service retired · Phase 4 doc cleanup completed · platform-wide naming pass

**Part 1 — Action layer graduation.** A conversation about a Vercel talk on agent safety surfaced a real gap: the runtime enforcement story for agent assistance had no clean home. ADR-7 (action layer) lived as inline full-text in `DECISIONS.md`; individual primitive specs gestured at "the action layer enforces"; nothing pulled it together. **`product/systems/action-layer.md` created** — owns ADR-7 in full. The b1 commitment (handler invariant, audit fields, system Member, same-transaction commit) is unchanged. The expansion is the T2/T3 substrate: scoped capability vending, closed-world permission catalog, unbypassable approval gates, network-layer credential injection (the agent never holds credentials — the edge mints and applies per turn), per-turn capability selection, sandboxed Skill execution. **Member-facing vs platform-substrate split clarified:** `delegation.md` = "what the Member does"; `action-layer.md` = "what the platform does to make that safe." `agent-assistance.md` commitment #3 refined with one paragraph on per-turn credential vending as the *enforcement* of read/write asymmetry. `DECISIONS.md`, `MAP.md`, `CLAUDE.md` updated.

**Part 2 — vendor-* re-anchor on Members.** After the action-layer.md graduation, `product/` tree audit produced a category list of stale / load-bearing-but-stale-framed / correctly retired files. Critical finding: `vendor-intelligence.md` is the only home for the BI monetization story — `platform-promise.md` line 49 points at it as the home of "the founder dashboard, bulletins, follower analytics, listing health, peer benchmarks, weekly digest." Archiving without re-anchoring would have severed a load-bearing platform promise. Re-anchored instead. **`producer-bulletin.md` written** (rewrite of `vendor-bulletin.md`): Member-authored bulletin; optional kind='business' Group branding; T1 (b2) plain text + in-app + email + rate limit + mute + unsubscribe; T2 (b3) rich composition + scheduling + segmentation; T3 segmentation (geographic via `home_location_id`, never demographic). **`producer-growth.md` written** (rewrite of `vendor-intelligence.md`): the BI monetization story anchored on Members + kind='business' Groups; producer-recruitment pitch routes through here; T1 Founder dashboard / T2 bulletin analytics + peer benchmarks / T3 LTV proxy + automation; categorical refusals retained (no ad sales, no demographic targeting, no data sales, no named-competitor benchmarks). **`vendor-self-service.md` retired as superseded** — overlapping with `location.md`; surviving fragments absorbed (community pin flagging to `location.md` T2; profile-completeness already in `producer-growth.md` T1). References updated across `platform-promise.md`, `community-platform.md`, `design-language.md`, `MAP.md`, root `CLAUDE.md`, `notes/migration-to-primitives.md`. Four archive moves: `vendor-bulletin.md`, `vendor-intelligence.md`, `vendor-self-service.md` → `product/systems/archive/`; `pin-accuracy-verification.md` → `product/capabilities/archive/`.

**Part 3 — Phase 4 doc cleanup completed.** Five workstreams ran end to end. Three retiring specs archived (`community.md`, `cooperative.md`, `member-operations.md` → `product/systems/archive/`). `primitives.md` Community section rewritten as Group section (six kinds at b1). `community-platform.md` broader rewrite: "Nextdoor-style location-locked feed" → "locality-aware-but-not-Location-scoped"; "Shopper tab" / "Business tab" → "Member tab" / "Producer panel"; "vendor" → "Member operating in producer capacity"; C2/C3 capability rows archived; data export added to T1 You-tab. Four capabilities rewritten on primitives: `consumer-feed.md` → "Locality Feed" (Item-primitive anchored); `landing-page.md` → Member-primitive anchored with anonymous Loop 3 path; `shareable-listing.md` → "Shareable Entity Pages" generalized across `/i/`, `/m/`, `/l/`, `/g/`; `community-create-join.md` → `group-create-join.md` (Group primitive, six-kind list, `/c` → `/g`, `community_memberships` → `group_memberships`). **F001–F017 scenarios archived** as pre-primitives → `planning/scenarios-backlog/archive/`; new `PRE-PRIMITIVES-AUDIT-2026-05-11.md` documents the mapping. Live `planning/scenarios/` now contains only F018. Cross-reference cleanup: `MAP.md`, `canonical-examples.md`, `discovery.md`, `F018-brian-declares-run-club.md`, `agent-assistance-handoff-2026-05-09.md`, `reciprocity-and-goodwill.md`, `skills.md`, `item-view.md`, `gathering-host.md` — all live broken pointers fixed.

**Part 4 — Platform-wide naming pass.** Three-layer naming convention codified: **schema (durable code)** / **URL (public route)** / **UI label (user-facing copy)** / **UI verb (CTA)**. Root `CLAUDE.md` gained Naming conventions section with canonical mapping table. Key rules: schema names are durable and don't migrate; "declare" stays as spec/conceptual verb but never appears in UI; "Item" is the database term and never appears in user copy; kind-specific verbs (Host, Sell, Offer, Wonder, Ask, Lead) replace any generic "create an item" CTA. **`member-self-record.md` → `assistant-context.md`** (UI label "Assistant Context"; schema `member_self_records` preserved — two-name pattern). Rename propagated across 16 live files. **Kind-specific URLs for all Items:** `/e/` Event (schema `gathering`), `/p/` Product, `/s/` Service, `/i/` Idea (schema `wonder`), `/o/` Offer, `/a/` Ask, `/initiative/` Initiative. The unified `/i/[slug]` Item URL retires; `/i/` slot is reused exclusively for Idea. **`gathering-host.md` → `event-host.md`** (title "Event Host"; `/i/` → `/e/`). **`community-platform.md` user-facing labels:** "Gatherings / Wonders" → "Events / Ideas." **UI verbs locked per kind.** Loop names stay as conceptual spec language; they don't migrate to UI labels.

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
