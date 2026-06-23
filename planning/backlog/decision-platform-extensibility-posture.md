---
purpose: Decide whether platform commits to API-first posture (b1 closed, b2 first-party app, b3 third-party API)
layer: how
status: draft
source: inbox drain 2026-06-21 (originally captured 2026-05-30)
---

# Platform extensibility — API-first posture

## Decision needed

Whether *Movers, Makers & Shakers* commits at the foundation level to being API-first: every Member-facing capability also exists as an action-layer endpoint, and external apps become first-class once the substrate hardens.

## Recommendation

Adopt the posture. Sequence three audiences across three phases.

- **b1 (now):** closed. Substrate hardens privately. No external surface.
- **b2:** **first-party producer app on shared substrate.** Be the platform's own first API customer. `producer-tools.md` already commits to Bulletin + Growth inside the main app; a separate full-suite power-user app for large operators (high-volume sellers, organizers, multi-Location operations) is the natural escalation. De-risks solo-build because both ends are owned, and it proves the API works before anyone external touches it.
- **b3:** **third-party app API.** OAuth-style scope grants, review process for published apps. Guardrails inherit from `policy.md` and `payments.md`: cannot custody Member funds, cannot place orders without confirmation gate, cannot harvest beyond scope, cannot platform-fee on Member commerce.
- **b3+:** **personal Skills SDK.** Each Member deploys custom code that runs in the platform sandbox. Aligns with the "future of software is personally customizable software" framing. The Skill primitive in `agent-assistance.md` is the seam; sandbox + audit story must be locked first.

## Substrate readiness — mostly already there

- `product/systems/action-layer.md` — same-transaction row+event invariant, scope catalog, scoped capability vending, credential injection at the network edge. This is the trust model any external app would need.
- `product/systems/agent-assistance.md` — Skills as Member-deployed code running against the action layer.
- `product/systems/payments.md` — wealth-circulation rubric (fees / float / rail-ownership / lock-in) as the selection process for any commerce surface.

Extending "Skill" to "application that runs on a Member's behalf with a scoped credential set" is a phase, not a redesign.

## The wealth-circulation check

Does opening the platform increase Member power or invite extraction? Lexicographic check from `playbooks/DECISION-PATTERNS.md`: member safety → platform health → data protection → mutual benefit reversible.

**Power-increase shape:**
- Producers using power-user apps to operate at scale without rebuilding on commodity SaaS.
- Members building their own tools for their specific use cases (small organizers, niche sellers, hyperlocal coordinators).
- Movement of integration logic from platform-owned to Member-owned.

**Extraction risks to guard against:**
- Third-party apps harvesting Member data outside their declared scope.
- Lock-in via proprietary app ecosystems (data formats, identity, follower graph).
- Hidden platform-fee skims by third-party apps on Member commerce.
- Ad-network monetization through third-party apps.

**Guardrail invariants:** every external app inherits the platform's no-platform-fee, no-Member-data-harvest, no-confirmation-bypass rules. If an app can't run under those, it can't ship.

## Open questions for PM

- **App review process:** who reviews, what's the bar, is there a tier for unaudited Member-personal apps (visible only to the Member who deployed them)?
- **Revenue model:** subscription for third-party app developers, free with substrate-as-service, or revenue-share on a per-call basis?
- **Sandbox technology:** WASM, isolate-per-Member, edge functions — what runs Member-deployed Skills safely at scale?
- **Producer power-user app distribution (b2):** separate codebase / repo, or a separate route within `web/`? Separate domain or `producer.[base].com`?
- **Identity bridge:** does a third-party app authenticate as the Member (delegated) or as itself with the Member's permission grant?
- **Scope catalog evolution:** the b1 action-layer scope catalog is for internal callers — what additional scopes does the third-party model require, and how do they degrade gracefully if revoked?

## Path

1. `explore` drafts a system spec at `product/systems/platform-extensibility.md` (or extends `action-layer.md` with a public-extension-point section).
2. New ADR records the posture commitment with State-tagged Intent.
3. Foundation-level statement lands in `principles.md` (PN: API-first as a commitment to Member power and against platform lock-in).
4. b2 plan adds a producer power-user app track; sub-bundles in `bundle-themes.md` sequence it after substrate hardening.

## Cross-references

- `product/systems/action-layer.md` — substrate
- `product/systems/agent-assistance.md` — Skill primitive
- `product/systems/payments.md` — wealth-circulation rubric, no platform fees
- `product/systems/producer-tools.md` — what the b2 producer app extends from
- `product/foundation/principles.md` — where the posture statement lands
- `product/foundation/policy.md` — guardrail invariants that bind external apps
- `playbooks/DECISION-PATTERNS.md` — lexicographic check
- `planning/now/bundle-1-themes.md` — sub-bundle sequencer for b2 / b3 / b3+

## Provenance

Captured 2026-05-30 during a parallel-agent session. PM ratified the BLUF approach in chat; full ratification deferred to `explore` + new ADR after the running agent clears.
