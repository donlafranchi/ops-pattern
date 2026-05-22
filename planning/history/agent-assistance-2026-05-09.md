# Handoff: Agent-Assistance Architecture (Forward-Looking)

**Status:** Forward-looking architecture. **NOT b1 scope.** Captured for future bundles.

**PM scope reset (2026-05-09, end of session):**

> "Everything is still greenfield. The entirety of this conversation is only planning for future growth. Most of this is not necessary in the MVP (b1). B1 intention is to show users the kinds of items this app can handle — gathering, trading/selling, wondering. Let users communicate what they have and where they can meet. We don't necessarily need products and organizations for b1, only enough to signal we make and sell. **Operations can be b3 essentially.**"

This handoff doc captures what was drafted, what the reviewers said, and what decisions remain — so the work is preserved for the bundle in which it actually ships and does not contaminate b1 ticket writing.

## What got drafted

Four system specs, four ADRs, one foundation doc, and one prior architectural review — all of which sit upstream of the work the PM is actually doing in b1.

**Foundation:**
- [`product/foundation/policy-framework.md`](../product/foundation/policy-framework.md) — three-filter test (helpful? harmless? abuse-resistant?) + opt-out default. Useful immediately as a guiding doc; does not require b1 implementation.

**Systems (forward-looking — none ship at b1):**
- [`product/systems/delegation.md`](../product/systems/delegation.md) — agent permission grants
- [`product/systems/assistant-context.md`](../product/systems/assistant-context.md) — Member-owned context for the assistant
- [`product/systems/skills.md`](../product/systems/skills.md) — composable agent capability bundles
- ~~`product/systems/member-operations.md`~~ — **Archived 2026-05-11.** The Operation primitive was absorbed into kind='business' Group memberships per ADR-13. See [`product/systems/groups.md`](../product/systems/groups.md).

**ADRs (in [`planning/DECISIONS.md`](../planning/DECISIONS.md)):**
- ADR-6 — Agent assistance: three primitives, standing-derived persistence, privacy commitments
- ADR-7 — Action layer is a first-class architectural commitment
- ADR-8 — Member Operations supersedes ADR-3's `maker_signal` derivation
- ADR-9 — Policy framework: opt-out default, three-filter test

**Reviews (in [`planning/history/`](../planning/history/)):**
- [`agent-assistance-architecture-review-2026-05-09.md`](../planning/history/agent-assistance-architecture-review-2026-05-09.md) — independent architectural reviewer
- [`agent-assistance-planning-filter-review-2026-05-09.md`](../planning/history/agent-assistance-planning-filter-review-2026-05-09.md) — 5 Deadly Sins filter
- [`agent-assistance-security-privacy-review-2026-05-09.md`](../planning/history/agent-assistance-security-privacy-review-2026-05-09.md) — privacy/security teeth check
- [`agent-assistance-people-first-review-2026-05-09.md`](../planning/history/agent-assistance-people-first-review-2026-05-09.md) — foundational refusals + canonical examples

## What the reviewers converged on (preserve for the bundle in which this ships)

**1. The Operations gate has a hole at Loop 10/11.** The canonical Cafe Capricho operator-pre-reopening has *no* Operation to declare — none of the six capacities fits "trying to start a thing that doesn't exist yet." The standing-tier gate as drafted gives them scratch tier exactly when they need standing-tier help. Same for the unpaid Run Club organizer: gating an RSVP-digest Skill behind declaring `volunteer_organizer` is the wrong direction. **Likely fix:** broaden standing-tier to "any standing work" — Operations declared, recurring Gatherings hosted, active Initiatives led, ongoing Steward role. Operations stays the primitive for commercial declaration; it stops being the *only* gate.

**2. The capacity enum is a softer reintroduction of role-as-identity.** People-first reviewer flagged that `sole_personal` is functionally a Maker badge with one extra word — declared, displayed publicly, gates standing-tier tooling. The "first commercial listing prompts Operation declaration" UX moment is the highest-risk surface. Worth specific design care when this actually ships.

**3. Privacy commitments need structural teeth, not prose.** ~60% of the privacy commitments in the specs are policy-only. Specifically: "never visible to other Members" should be enforced via RLS + separate Postgres role + CI assertion; `recurring_payment` caps must be schema-enforced (not policy-only); cross-Member sharing of `voice` / `tastes` / `refusals` should be categorically removed (only `pinned_facts` should be shareable) to defeat the coercion vector.

**4. "Schema reserved" means four different things across the four specs.** delegation.md ships an endpoint, self-record ships handlers, skills publishes an external manifest contract, operations ships full UI. The phrase is doing too much work and the build agent will read inconsistent intent. Pick a consistent meaning for "shipped at b1" / "schema reserved" / "deferred to T2" — and use it the same way across all specs.

**5. Action layer (ADR-7) is foundational, not parallel.** Refactoring existing write paths through a single canonical handler precedes b1 substrate work, doesn't accompany it. Worth deciding separately whether `web/` is green-field or has a partial action layer — that single fact changes the work plan substantially.

## Decisions to take up tomorrow (ordered)

These are the open questions. Each is sized to be answered in a single session.

**1. Confirm the b1 scope reset in the bundle doc.** Update [`planning/bundles/b1-primitives.md`](../planning/bundles/b1-primitives.md) to make the new b1 framing explicit: "show users the kinds of items this app can handle — gathering, trading/selling, wondering — let users communicate what they have and where they can meet, signal we make and sell." Verify nothing in the current bundle implies Operations / Delegation / Skills / Assistant Context. If anything does, prune it.

**2. Reassign the agent-assistance work to a future bundle.** Decide which bundle it lands in. Likely b3 per PM's note ("Operations can be b3 essentially"). Either:
- Update each ADR's "Bundles" line and supersession references
- OR add a single ADR-10 that says "ADRs 6–9 and the four agent-assistance system specs are scoped to b3+; b1 ships only Person, Item, Location, Community per existing primitives spec"

The second is cleaner if you don't want to touch four documents.

**3. Decide what minimal Member-side concept ships at b1.** The b1 reset says "enough to signal we make and sell." That implies *some* signal of commercial intent without the full Operations primitive. Options:
- Nothing — the fact that a Member posts an Item of `kind=product` is itself the signal
- A simple boolean on Member ("I sell things here") with no capacity
- A free-text field on Member ("what I'm doing here") that's purely descriptive
- Something else

This is the actual b1-shaped question hiding inside the larger Operations design. Worth deciding before re-architecting touches the Member spec.

**4. Apply the policy framework to b1 surfaces.** The three-filter test and opt-out default are useful immediately. Walk the existing b1 surfaces (Item composer, locality index, gathering RSVP, etc.) through the framework once and ensure nothing in b1 already violates the defaults. This is low-cost and prevents drift.

**5. Decide on the action-layer commitment (ADR-7) for b1.** Two-part question:
   a. Is `web/` already partially action-layered, or does every write happen inside a controller? (Determines the size of the refactor.)
   b. If a refactor is needed, does it land before b1 ticket writing resumes, or in parallel? Affects the b1 timeline.

**6. Resolve the standing-tier gate hole (Loop 10/11) before any agent-assistance work resumes.** When the bundle that ships this work comes around, the "any standing work" broadening is the cleanest fix. Capture this decision now while the context is fresh; defer the implementation.

**7. Resolve the cross-Member sharing scope (security/privacy finding) before that opt-in ships.** Restrict to `pinned_facts` only, period. Capture this decision now.

## What NOT to do tomorrow

- **Do not rewrite the agent-assistance specs piecemeal.** They are forward-looking and substantially correct. When the bundle they ship in arrives, they get a single revision pass against the open decisions above. Drift-revising them now is wasted motion.
- **Do not let the agent-assistance scope leak into b1 tickets.** Watch for the build agent picking up Operations / Delegation / Skills / Assistant Context references when scoping b1 work. They are not b1.
- **Do not run more reviewers against the current draft.** Three reviewers landed today, all useful, all surfacing the same convergent findings. Diminishing returns.

## Pointers for the rearchitecting session

The PM mentioned "rearchitecting the app based off the new primitives" with newly installed skills. Two pointers:

- The active migration plan is [`notes/migration-to-primitives.md`](migration-to-primitives.md). That's the contract for the rearchitecture work — it sequences Cluster 1 (standing presence: Person + Item + Location + recurring schedule), the locality index (Cluster 3), and the response surface (Cluster 2 — Wonder is the candidate v1 verb).
- The agent-assistance work in this handoff is **downstream** of the rearchitecture. The action layer (ADR-7) is the bridge — once the rearchitecture lands the new primitives behind a clean action surface, the agent-assistance stack plugs in cleanly.

## End-state of this conversation

- All work above is captured.
- No agent-assistance work blocks b1.
- Tomorrow's session can pick up either (a) the b1 rearchitecture (the actual work) or (b) the seven open decisions above (the agent-assistance follow-up). They are independent.
- The reviewers' findings are preserved in `planning/history/`. They are read at the time the bundle ships, not before.

The agent-assistance architecture is a real piece of forward-looking design. It is not the work that ships next. The clean separation here is the win.
