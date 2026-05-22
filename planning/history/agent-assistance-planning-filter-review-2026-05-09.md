# Planning-Filter Review: Agent-Assistance Substrate

**Date:** 2026-05-09
**Reviewer role:** pipeline-plan
**Artifacts reviewed:** delegation.md, member-self-record.md, skills.md, member-operations.md, ADR-6/7/8/9, policy.md
**Anchor:** [`planning/bundles/b1-primitives.md`](../bundles/b1-primitives.md)

## Verdict

**Defer to a new bundle b1.5; do not absorb into b1.** The four specs and four ADRs are coherent, primitives-respecting, and people-first — they are not the problem. The problem is *bundle physics*: b1-primitives.md already commits to seven non-negotiable build steps (Member, Location, Item across four kinds, locality index, vendor-booth QR, thesis page) and two b1-required-but-lower-priority steps (Service Provider, Community lightweight). Member Operations alone (declaration UI, capacity enum, brand_label autosuggest, profile rendering, standing-tier integration) is a tenth step that belongs adjacent to Member, not after it. The action-layer commitment in ADR-7 is the right architectural call but its consequences are *foundational* — it precedes b1's existing scope, not adds to it. Recommendation: **(a)** ship the schema-only / scope-vocabulary / audit-field / export-purge floor inside b1; **(b)** extract Member Operations + action-layer refactor + standing-tier wiring into a tightly-scoped **b1.5** that ships before b2; **(c)** explicitly cut the policy framework's opt-in *implementations* (anonymized aggregate, cross-Member sharing, recurring-payment) from any consideration before b2; **(d)** treat the three new system specs as canonical and stop adding to them until b1.5 ships.

## Per Deadly Sin

### 1. Scope creep

- **member-operations.md §T1** ships an entire user-facing surface (`/you/operations`, declaration UI, conditional profile section, brand_label autosuggest, "first commercial listing prompts Operation declaration" UX moment) that is nowhere in [`b1-primitives.md`](../bundles/b1-primitives.md). The b1 sequence steps 1–9 do not include Operations; ADR-8 introduces it as "required at b1" without amending the bundle doc. **The bundle and the system are now out of sync.**
- **delegation.md §T1** smuggles a live endpoint (`GET /api/me/delegations`) into the schema-reserved tier. A read endpoint is a surface, even if it returns empty. Either it ships (then say so in b1-primitives.md) or it defers to b2.
- **member-self-record.md §T1** ships two action handlers (`export()`, `purge()`) wired into a `/you/data` page that does not exist in b1-primitives.md. This requires building `/you/data` itself, plus copy on the privacy page describing the protective default. **Net new b1 surface area not budgeted.**
- **ADR-7's action-layer commitment** retroactively expands the cost of every b1 ticket already sequenced. Every existing write path in `web/` must be refactored before audit fields can be populated correctly (per the ADR's own consequences). This is creep against work that has already been planned.
- **skills.md §T1** publishes the manifest format as a versioned JSON schema and stands up `GET /api/skills` + `GET /api/me/skill-subscriptions` endpoints. Publishing a versioned external contract is a real maintenance commitment dressed as "schema reserved."

### 2. Gold plating

- **delegation.md scope vocabulary** publishes ~16 scopes at b1 (read, draft, confirm, recurring-payment, federation). Of those, only the audit fields and the enum *type* are needed at b1. Locking in `federation_handoff_identity` before any federation peer exists is anticipating a problem two tiers away.
- **skills.md §T3 features** (skill bundles, Operation-keyed Skill discovery, execution analytics, Self-Record-aware scoping) are described in implementation-ready detail. T3 specs at this resolution are the gold-plating signal — they constrain T2 design before T2 has shipped.
- **member-self-record.md** specifies five distinct sections (`voice`, `tastes`, `refusals`, `pinned_facts`, `current_focus`) plus three update pathways, "blind this session" toggle, section-level revoke, bulk re-confirm, and diff view. The b2 surface is over-specified for a system whose b1 ships only export+purge. T2's section count and update pathway count should be discoverable, not pre-committed.
- **delegation.md "recurring_payment" mitigations** spell out `max_per_transaction_cents`, `max_per_month_cents`, `recipient_allowlist`, `expires_at` as schema-enforced columns at b2. Correct posture, but the column shapes belong in the b2 spec, not the b1 commitment.
- **member-operations.md §T2/T3 capacity transitions** (`side_personal → sole_personal`, `staff → sole_personal`, `partner → cooperative_member` with `previous_operation_id` lineage) are designed before the first Operation has been declared. Defer.

### 3. Missing requirements

- **The "first commercial listing prompts Operation declaration" UX moment** (member-operations.md, ADR-8) is named but not specified. Where in the Item composer? Modal or inline? What if the Member declines? Does the Item still post? This is the load-bearing connection between Items and Operations and it has no acceptance criteria.
- **`/you/data` page surface** is referenced by member-self-record.md and the policy framework but not defined anywhere in b1-primitives.md or as its own spec. Build agent has no source of truth for what it contains beyond export+purge buttons.
- **No spec covers what happens when a Member with active Operations ends them all.** Standing-tier collapses; do affordances vanish silently? Does the Self-Record degrade? Skills get unsubscribed? This is the inverse of the standing-tier gate and isn't addressed.
- **Anonymous Loop 3 traffic + assistant** is listed as "open question" in delegation.md but is the most common b1 traffic shape. Newcomer browses, no Member exists, no Delegation possible. The spec waves at a working answer; b1 needs a yes/no.
- **policy.md governance** says "policy changes that affect existing Members' opt-in state require explicit re-confirmation." No spec defines the re-confirmation surface, the cadence, or the failure mode (what happens to a Delegation while re-confirmation is pending). At b1 this is hypothetical; before b2 ships it must be real.
- **member-operations.md §T1** says active Operations render on the Member profile. The Member profile spec for b1 ([`b1-primitives.md`](../bundles/b1-primitives.md) lines 18–20) does not describe an Operations section. Cross-spec gap.

### 4. Unrealistic schedules

The b1-primitives.md commitments are already a full bundle. Loading the agent-assistance b1 substrate on top crowds out the existing scope:

- **Member Operations as full ship** (declaration UI + composer integration + profile rendering + standing-tier wiring) is realistically 3–5 tickets and adds two cross-cutting integrations to Item composer and Member profile — both already in b1's critical path.
- **Action-layer refactor (ADR-7)** is correctly described as "front-loaded" and "real." It must precede the audit-field work, which must precede every other ticket that writes. This is foundational engineering, not parallel-track work.
- **Three new system specs + four ADRs landing simultaneously** is a documentation surface ~6× the baseline ADR cadence (ADRs 1–5 spanned a month; ADRs 6–9 landed in a single day). The build agent reading-cost is real; the cross-spec consistency-cost (every spec references every other) is realer.

**Verdict: not shippable as part of b1.** The schema-and-audit-fields floor is shippable inside b1. The Member Operations user surface, the action-layer refactor, and the standing-tier wiring need their own bundle (b1.5) sequenced before b2.

### 5. Poor communication

- **"Schema reserved" means different things across the four specs.** delegation.md ships an endpoint; member-self-record.md ships two actions and a page reference; skills.md publishes an external manifest contract; member-operations.md ships a full UI. The phrase is doing too much work; build agent will read inconsistent intent.
- **"Standing-tier gate" appears in three specs** (self-record, skills, operations) with the gate definition migrating between drafts (`maker_signal` → `member_standing_signal` → `member_has_standing_presence`). The current resting place is correct, but member-self-record.md still contains the *historical* explanation in §"Persistence is Operation-gated" — a build agent reading it linearly will see two superseded names and one current name.
- **ADR-6's Consequences were amended in-place by ADR-9** with parenthetical annotations. This is fine for now, but a third amendment will make ADR-6 unreadable. Establish a "supersedes/amended-by" header pattern before the next ADR.
- **`brand_label` integration with Operations** is described in member-operations.md and referenced in ADR-8 but item.md (the source of truth for the field) has not been updated. Build agent will discover the gap mid-ticket.
- **"Action layer" and "action handlers"** are used interchangeably with no glossary. Distinguish: the *layer* is the architectural pattern; *handlers* are the named functions. Otherwise tickets will be written ambiguously.
- **Canonical-example coverage is asserted but not traced.** None of the four specs walks Run Club, Ferrari Fisheries, or Cafe Capricho through their flows. The PM's pressure-test question deserves an answer in the specs, not in the reviewer's head.

## Recommended b1 scope (agent-assistance substrate only)

In strict order:

1. **Audit fields on every existing write path.** `acting_member_id`, `via_delegation_id` (nullable, default NULL) on the event log shape. Populate from session at every existing handler. **No action-layer refactor yet** — populate inline.
2. **`delegations` table created** with all columns from delegation.md §"The spine." No endpoints, no UI, no scope vocabulary as a published enum yet — just the table.
3. **`member_self_records` + `member_self_record_entries` tables created.** Schema-only. No actions, no `/you/data` page.
4. **`skills` + `skill_subscriptions` + `skill_versions` tables created.** Schema-only. No catalog, no endpoints, no manifest contract published.
5. **Scope vocabulary lives in code as a TypeScript enum + Postgres enum.** Stable but *internal*; not published as an external contract.
6. **policy.md adopted as foundational reading.** No opt-in implementations land at b1. The protective defaults are the platform's behavior because the opt-ins do not exist.

This floor is real ticket work (4–6 tickets) but does not crowd out the b1-primitives.md sequence and gives the b2/b1.5 work a clean substrate to land on.

## Recommended deferrals (to b1.5 unless noted)

**To b1.5 (new bundle, sequenced after b1, before b2):**

- Member Operations full ship (declaration UI at `/you/operations`, capacity enum, brand_label autosuggest in Item composer, conditional profile section, `member_has_standing_presence` view, "first commercial listing prompts declaration" UX moment).
- Action-layer refactor per ADR-7 — every existing write becomes a named handler. Audit fields move from inline population to handler-enforced.
- Self-Record export/purge actions + `/you/data` page (the page itself, not just the actions).
- `GET /api/me/delegations` endpoint (returns empty until b2).

**To b2:**

- Delegation grant/revoke flow + `/you/agents` page.
- Self-Record three update pathways + `/you` editor.
- Skills catalog + subscription flow + platform-curated seed Skills.
- Skill manifest format as a published, versioned external contract.
- All policy-framework opt-ins (anonymized aggregate, cross-Member sharing, recurring-payment Delegation, platform-mediated Skill payment).

**To b3 or defer indefinitely:**

- Federation kinds across all four primitives.
- All §T3 sections of all four specs (revisit when b2 has shipped and there is data to design against).

## Two questions that would change the verdict

1. **Is the action-layer refactor (ADR-7) already partially complete in `web/`, or is it green-field?** If existing write paths already route through a thin shared handler, b1.5 collapses into 2–3 tickets and the case for absorbing it into b1 becomes plausible. If every write is currently a controller-behind-a-form, b1.5 is mandatory and may itself be too small a bundle for the work — could need to be its own b1.0-action-layer foundation pass.

2. **What is the realistic time budget between b1 ship and b2 design start?** If the gap is weeks, b1.5 is the right shape. If b2 design starts immediately on b1 ship, the agent-assistance substrate fragments across two bundles for no operational benefit and should land as a single coherent b1.5-or-b2-foundation pass. The question is logistical, not architectural — but it changes whether to recommend b1.5 as a real bundle or as the first work of b2.
