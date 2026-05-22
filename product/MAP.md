# Movers, Makers & Shakers — Architecture Map

> **100k-foot view.** One sentence per system. Scan top-to-bottom to verify everything fits together. If a line conflicts with another line, something is misaligned.
>
> Read alongside [`../CLAUDE.md`](../CLAUDE.md) (router), [`../AGENTS.md`](../AGENTS.md) (pipeline), [`../JOURNAL.md`](../JOURNAL.md) (current state), [`../planning/DECISIONS.md`](../planning/DECISIONS.md) (decisions register).

## Mission

Connecting people, joining forces, improving our lives socially and economically, and deciding our future with the strength and power of the many.

## Foundation (the why and the how)

- **[`design-philosophy.md`](foundation/design-philosophy.md)** — the structured measuring stick; 5 sections of platform-decision rubric grounded in Dunbar / Ostrom / Putnam / Oldenburg / ICA / Cleveland Model / Mondragon. Score every decision against the checklists.
- **[`principles.md`](foundation/principles.md)** — the constitution; P1–P8 first principles + Decision Test + categorical failures + monetization hypothesis + metrics baseline + privacy/security baseline. Binary pass/fail filter.
- **[`member-journey.md`](needs/member-journey.md)** — north star; 13 loops in 5 families (Gathering → Sharing → Trade → Pooling → Federation); activation energy ascends, belief ascends, stake accumulates.
- **[`primitives.md`](foundation/primitives.md)** — the data spine: Person · Item · Location · Group; everything the platform does is one of these acting on another.
- **[`principles.md`](foundation/principles.md)** — the platform serves people, not businesses; no Business entity in the schema; personal businesses first-class via kind='business' Groups.
- **[`policy.md`](foundation/policy.md)** — owns ADR-9: the three-filter test (helpful? harmless? abuse-resistant?), opt-out default, and anti-Nextdoor commitments.
- **[`agent-assistance.md`](systems/agent-assistance.md)** — owns ADR-6: agents are loop-shaped not role-shaped; persistence is standing-derived; read-automatable, write-confirmed; Member-owned; federation-portable.
- **[`use-cases.md`](needs/use-cases.md)** — the 12 real situations the platform exists to make better; the working test-case set for every feature.
- **[`platform-promise.md`](foundation/platform-promise.md)** — what the platform commits to and refuses to do, in plain language for the thesis page.

## Primitives (the data spine, T1 floor)

- **Person** ([`member.md`](systems/member.md)) — the anchor; one real human, no role column, no Business shell; holds multi-Location affinities + DM substrate. Selling tools surface from Group / Item state (kind='business' Group membership OR kind='product'/'service' Item presence), not from a profile toggle.
- **Item** ([`item.md`](systems/item.md)) — anything declared (product, service, gathering, wonder); one schema, kind-varying child tables; public pages at kind-specific URLs (`/e/`, `/p/`, `/s/`, `/i/`, `/o/`, `/a/`, `/initiative/`) — see [`item.md`](systems/item.md) naming table.
- **Location** ([`location.md`](systems/location.md)) — a physical place; spine + child architecture (permanent / recurring-temporary / area); PostGIS on spine; never the home of messaging or feeds.
- **Group** ([`groups.md`](systems/groups.md)) — a named, intentional, self-selected set of people; six kinds at b1 (place, interest, practice, event_anchored, family, business); supersedes Community / Member Operations / Cooperative.

## Live system specs (substrate at b1, surfaces shipping b1+)

- **[`discovery.md`](systems/discovery.md)** — the locality-first index across Items / Members / Locations; one materialized view at b1, vector search at T3.
- **[`action-layer.md`](systems/action-layer.md)** — owns ADR-7: single canonical write surface (named, schema-validated, transactional handlers); same-transaction row+event commit. **Also the home of the event-log substrate** — `item_events`, `member_events`, `group_events`, `location_events` are partitioned monthly, carry audit fields on every row, and are written in the same transaction as their primitive row by the action handler. The runtime trust substrate (scoped capabilities, closed-world catalog, unbypassable approval gates, network-layer credential injection, per-turn capability selection, sandboxed Skill execution) lives here too.
- **[`agent-assistance.md`](systems/agent-assistance.md)** — agent assistance primitive #1: scoped, expiring, revocable permission grants from a Person to a non-human actor.
- **[`agent-assistance.md`](systems/agent-assistance.md)** — agent assistance primitive #2: Member-owned context document carrying voice, tone, tastes, refusals, focus; standing-derived persistence.
- **[`agent-assistance.md`](systems/agent-assistance.md)** — agent assistance primitive #3: composable, versioned, distributable capability bundles the assistant subscribes to.
- **[`producer-tools.md`](systems/producer-tools.md)** — Member-authored broadcast to Member-followers (Substack-light); optional kind='business' Group branding; ships at b2.
- **[`producer-tools.md`](systems/producer-tools.md)** — the BI dashboard backing the producer recruitment pitch: followers, activity, profile health, bulletin analytics, peer benchmarks; substrate at b1 (event log), surface at b2 (T1) → b3 (T2/T3).
- **[`business-jurisdiction.md`](systems/business-jurisdiction.md)** — the locality-verification ladder for kind='business' Groups (Tier 0 self-attested ZIP → Tier 1 SOS-verified → Tier 2 document-uploaded); the public floor of evidence behind the "locally owned and operated" claim; separates locality (ZIP) from address (street) by design — promoted from exploration on 2026-05-11. Tier 0 ships at b1; Tier 1/2 defer to b2+.
- **[`payments.md`](systems/payments.md)** — money movement primitive: Member→Member, Member→Group, Member→external-identified-recipient. Closed-loop ledger + ACH via chartered partner at b2; card with friction; stablecoin gated at T3. Wealth-circulation rubric drives every rail/custody/fee decision. Zero platform transaction fees on Member commerce. Substrate at b1 (4 tables, audit fields, handler stubs); rail goes live at b2. Drafted 2026-05-12 with `agent-commerce-and-project-amendments.md`. The rail that honors `bounded_purchase` (ADR-17).

## Surfaces (the consumer product)

- **[`community-platform.md`](ui/community-platform.md)** — Home / Explore / You consumer architecture; the surfaces a Member sees.

## UI + operations + process

- **[`ui/design-language.md`](ui/design-language.md)** — owns ADR-2: DLS tokens, six principles (one accent · hairlines · photography · whitespace · one typeface · bottom-anchored thumb-reachable), surface patterns per page type.
- **[`../planning/bundles/b1-primitives.md`](../planning/bundles/b1-primitives.md)** — the MVP scope; what ships at b1, what defers to b2/b3, what's reserved at the schema layer.
- **[`../planning/rebuild-plan.md`](../planning/rebuild-plan.md)** — clean-slate rebuild plan; four phases (0=floor, 1=schema, 2=core surfaces, 3=index+thesis); replaces the prior migration-shaped plan.
- **[`../planning/DECISIONS.md`](../planning/DECISIONS.md)** — active ADRs (cross-cutting + pointer index for spec-resident decisions); superseded entries in [`../_attic/2026-05-19/planning/`](../_attic/2026-05-19/planning/).
- **[`../AGENTS.md`](../AGENTS.md)** — agent pipeline (product → plan → review → eval → ticket → build → eval); firewalls, gates, escalation contacts.
- **[`../CLAUDE.md`](../CLAUDE.md)** — root router; skill routing table; solo-team multiplier gates (M1 ADR, M2 code-review, M3 a11y, M4 deploy-checklist).

## Retired (archived 2026-05-11 — Phase 4 cleanup)

- **`community.md`** → [`systems/archive/community.md`](systems/archive/community.md). Absorbed by Groups (kind='place'/'interest'/'practice'/'event_anchored'/'family').
- **`member-operations.md`** → [`systems/archive/member-operations.md`](systems/archive/member-operations.md). Absorbed by kind='business' Group memberships.
- **`cooperative.md`** → [`systems/archive/cooperative.md`](systems/archive/cooperative.md). Deferred indefinitely; cooperative-shape served at b1 by kind='business' Groups with multiple owner-role memberships.
- **`vendor-bulletin.md`** → rewritten as [`producer-tools.md`](systems/producer-tools.md); original at [`systems/archive/vendor-bulletin.md`](systems/archive/vendor-bulletin.md).
- **`vendor-intelligence.md`** → rewritten as [`producer-tools.md`](systems/producer-tools.md); original at [`systems/archive/vendor-intelligence.md`](systems/archive/vendor-intelligence.md).
- **`vendor-self-service.md`** → retired as superseded (Location concerns in [`location.md`](systems/location.md); profile-completeness in `producer-tools.md` T1; community pin flagging in `location.md` T2). Original at [`systems/archive/vendor-self-service.md`](systems/archive/vendor-self-service.md).

## Forward-looking (not gated on b1)

- **Agent assistance surfaces** — ship at b2 (assistant chat, Skill catalog, Assistant Context editor) / b3 (federation-grade Delegations, community-authored Skills, Assistant Context portability). Substrate lands at b1.
- **Federation (Loop 13)** — the spawned-platform handoff; not yet specced; will read from the existing primitives via federation peers transacting through the action layer.

## Capabilities + exploration (deeper layers)

- **[`capabilities/`](capabilities/)** — atomic user-facing capabilities (one file per surface); the unit `pipeline-plan` operates on when authoring scenarios.
- **[`exploration/`](exploration/)** — raw ideas, incubation, alternative framings; deliberately freeform; not load-bearing on any active decision.

---

## Alignment checks

When this map is up to date, the following should all be true. If any of them isn't, the misalignment is a real problem to surface.

1. Every Item ultimately FKs to a Member. No corporate shells.
2. Every Group's owner-role members are Persons. Groups can't own; they organize.
3. Every messaging surface is item-scoped or group-scoped, never Location-scoped.
4. Every Member becomes a Seller by joining a kind='business' Group or declaring a kind='product'/'service' Item; no Maker-mode toggle, no role column, no Business entity. (Producer = the agricultural/food variant of Seller in `producer-tools.md` / `producer-tools.md`. Maker survives only as a self-identified UI label for craftspeople/artisans.)
5. Every write goes through a named action handler with `(acting_member_id, via_delegation_id)` audit fields populated.
6. Every event row commits in the same transaction as the primitive row it describes.
7. Every system spec that touches privacy/revenue/data sharing carries a "Policy posture" section walking each opt-in through the three filters.
8. Every spec touching primitives is reviewed via `pipeline-review` until the rebuild's Phase 4 closes.
9. The locality-first index is one query against one materialized view across Items / Members / Locations.
10. Federation is the lens, not a separate stack — agents are federation peers; cooperative-services platforms (b3+) are federation peers.

If you can read this file end to end without contradiction surfacing, the architecture is internally consistent at this snapshot.
