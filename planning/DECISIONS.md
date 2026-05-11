# DECISIONS.md — Architectural Decisions

> **Current shape only.** This file states what's true now. Context paragraphs ("why we considered this") and superseded entries are intentionally pruned — the decision body stands without rehearsing the problem.
>
> Archives:
> - [`archive/DECISIONS-superseded-2026-05-10.md`](archive/DECISIONS-superseded-2026-05-10.md) — full text of ADRs that have been superseded (3, 8, 11)
> - [`archive/DECISIONS-pre-mission-clarity-2026-05-08.md`](archive/DECISIONS-pre-mission-clarity-2026-05-08.md) — pre-mission-clarity decisions

## Mission anchor

Every decision below answers, ultimately, to one mission: **connecting people, joining forces, improving our lives socially and economically, and deciding our future with the strength and power of the many.**

Foundation reading before any new decision: [`loops.md`](../product/foundation/loops.md), [`primitives.md`](../product/foundation/primitives.md), [`people-first.md`](../product/foundation/people-first.md), [`policy-framework.md`](../product/foundation/policy-framework.md), [`canonical-examples.md`](../product/foundation/canonical-examples.md).

## Where decisions live

A decision lives where it is *read*. Three homes; pick the right one when writing a new ADR.

1. **System spec** (`product/systems/{spec}.md`) — when the decision shapes one primitive or one system. The spec's status banner *is* the load-bearing ratification when no formal ADR is written yet (precedent: `groups.md`, `location.md`). The spec carries a "Decisions encoded here" footer; this file carries only a one-line pointer.
2. **Foundation / UI / operations doc** (`product/foundation/{doc}.md`, `product/ui/{doc}.md`, `notes/{doc}.md`, `web/CLAUDE.md`) — when the decision *is* a foundational principle, a UI principle, a tech-stack reality, or an operational contract that the doc already exists to encode. Same pattern: the doc owns the decision in long form; this file carries only a pointer.
3. **Cross-cutting (this file)** — when the decision touches many specs and has no single owner. Keep it terse: Status + Decision + Consequences + Date. **No Context paragraph** — the decision body must stand on its own.

## Format (cross-cutting ADRs)

```markdown
### ADR-{N}: {Title}

**Status:** Accepted | Refined-by-ADR-N | Superseded (→ archive)

**Decision:** What we decided. Terse. No "we considered X, Y, Z."

**Consequences:** What downstream work and constraints this creates.

**Date:** YYYY-MM-DD
```

---

## Cross-cutting decisions (full text)

Decisions here have no single-spec home and no foundation/UI/ops doc carries them.

### ADR-16: Per-row privacy on `member_location_affinities`; algorithms via privileged paths

**Status:** Accepted

**Decision:**

All six `affinity_kind` values on `public.member_location_affinities` (`lives`, `works`, `plays`, `visits`, `follows`, `liked`) are **owner-only at the row level**. Only the owner (`member_id = auth.uid()`) can `SELECT` their own rows. No public user, anon visitor, or peer Member can `SELECT` another Member's affinity rows under any condition.

Privileged access to the underlying rows is provided through three named patterns:

1. **Aggregate count functions** (`SECURITY DEFINER`): `public.count_likes_for_location(location_id uuid) returns integer` and `public.count_followers_for_location(location_id uuid) returns integer`. Public-callable. Used by Location pages for "N Members liked / follow this place" rollups. Underlying rows remain private.

2. **Locality-derivation function** (`SECURITY DEFINER`): `public.member_is_local_to_location(member_id uuid, location_id uuid) returns boolean`. Reads `lives` and `works` rows internally. Used by `groups.md`'s locally-owned-and-operated derivation. Public-callable. The function is the only path; direct `SELECT` against another Member's `lives`/`works` rows remains blocked.

3. **Backend service reads** (`service_role`): the recommendation engine, embedding pipeline, and other backend services connect with the service-role key, which bypasses RLS. These reads compute over the full row set; outputs to users are anonymized aggregates (similarity-driven recommendations, taste-matched location lists), never per-Member attribution.

**Consequences:**

- `member.md` RLS section adopts the owner-only posture for `member_location_affinities` and points to this ADR for the SECURITY DEFINER access patterns.
- `groups.md` locally-owned derivation switches from a direct `JOIN` against `member_location_affinities` to a call into `public.member_is_local_to_location()`. The function is the only path; the spec's pseudocode updates accordingly.
- `policy-framework.md` anti-doxxing section is upgraded — the no-Location-messaging commitment and the absence of per-Member location disclosure become structurally enforced by RLS, not by platform discipline.
- Public Location-page rollups call the two count functions. They do not `SELECT` rows.
- Cross-user similarity matching for recommendations operates at the backend-service layer. Raw affinity rows feed the embedding pipeline; embeddings (`member_embeddings`, T041) feed similarity search; outputs to users are anonymized lists of Locations. Per-Member identity never surfaces in a recommendation. **No per-Member opt-out for similarity matching ships** — similarity matching discloses no Member identity to any other Member; the benefit is to many and harms none.
- `product/exploration/locally-owned-verification.md` Tier 0 ZIP verification follows the same SECURITY DEFINER pattern when it ships.
- Performance: the `SECURITY DEFINER` function-call costs microseconds per locality check. A set-returning variant (`members_local_to_area(area)`) can land at T2+ if hot.
- This ADR forecloses a future per-row "who likes / follows this place" surface. If the platform ever wants to expose that, the change requires either a new SECURITY DEFINER function or relaxing the policy. Reversible but with cost; the foreclosure is the point.

**Date:** 2026-05-11

---

### ADR-4: Locality default — geolocate, then city-pick, mutable from any surface

**Status:** Accepted

**Decision:**
The default locality is the user's geolocation, if granted. If denied or unavailable, the platform prompts for a city pick (Sacramento metro and surrounding cities at launch, expandable). The chosen locality is mutable — the user can change it at any time, both for moves and travel. The change affordance is visible from surfaces that depend on locality (Home, Explore), not buried in `/you` only.

**Consequences:**
- Anonymous Home triggers a one-time geolocation prompt; decision persists in a cookie.
- Authenticated Members get the same flow on first sign-up; choice writes to `members.home_location_id` and remains editable.
- Locality affordance lives in or near the bottom-anchored search per ADR-2.
- Multi-locality ("home + while traveling") is a T3 concern; at b1 it's a single mutable scope.
- Privacy: geolocation is requested but never required. The city-pick fallback must always be available.
- Multi-Location belonging (member living/working/playing/following multiple Locations) is a separate substrate — `member_location_affinities` per [`member.md`](../product/systems/member.md). `home_location_id` is the locality default; affinities are additive.

**Date:** 2026-05-08

---

## Pointer index — decisions that live in their home doc

| ADR | Status | Lives in | Shape now |
|---|---|---|---|
| ADR-1 | Accepted | [`web/CLAUDE.md`](../web/CLAUDE.md) — "Tech Stack" section | Next.js (App Router) + TypeScript + Tailwind v4 + Supabase + Mapbox GL JS. Playwright for evals, Vitest for unit. Deploy on Vercel. |
| ADR-2 | Accepted | [`design-language.md`](../product/ui/design-language.md) — Principles #6 + Surface patterns | Bottom-anchored, mobile-first, thumb-reachable. Primary controls anchor to viewport bottom; search bar expands upward; detail cards slide up; nav (when present) sits at the bottom. No top-anchored toolbars. Follow Google Maps / Apple Maps interaction patterns. |
| ADR-3 | **SUPERSEDED** — [archive](archive/DECISIONS-superseded-2026-05-10.md#adr-3-maker-profile-is-implicit-not-claimed) · live successor: [`member.md`](../product/systems/member.md) | (rejected) | The implicit-from-behavior Maker model. Now superseded by ADR-12 (explicit, toggle-able) + the 2026-05-10 Groups ratification (underlying primitive is kind='business' Group memberships). |
| ADR-5 | Accepted | [`item.md`](../product/systems/item.md) — gathering kind | A market is a Gathering Item; categories distinguish kinds (farmers-market, swap, class, run-club, movie-night, etc.) via `item_tags`. |
| ADR-6 | Accepted, refined by ADR-9 | [`agent-assistance.md`](../product/foundation/agent-assistance.md) — umbrella · [`delegation.md`](../product/systems/delegation.md) / [`assistant-context.md`](../product/systems/assistant-context.md) / [`skills.md`](../product/systems/skills.md) — per-primitive | Agent assistance is first-class. Three primitives (Delegation, Assistant Context, Skills). Five umbrella commitments: loop-shaped not role-shaped · standing-derived persistence · read-automatable, write-confirmed · Member-owned · federation-portable. b1 ships substrate only. |
| ADR-7 | Accepted (graduated to spec-resident 2026-05-11) | [`action-layer.md`](../product/systems/action-layer.md) — entire document | The action layer is the single canonical write surface. Named, schema-validated, transactional handlers; same-transaction row+event commit; audit fields populated inside the handler; system Member as the platform actor. The runtime trust substrate (scoped capabilities, closed-world catalog, unbypassable approval gates, network-layer credential injection, per-turn capability selection, sandboxed Skill execution) is enforced here. Web composer, in-app assistant, MCP server, and federation peers are all thin clients over the same handlers. |
| ADR-8 | **SUPERSEDED** — [archive](archive/DECISIONS-superseded-2026-05-10.md#adr-8-member-operations-supersedes-adr-3s-derived-maker_signal) · live successor: [`groups.md`](../product/systems/groups.md) | (retired) | `member_operations` primitive retires. Capacities (sole-prop / partner / staff / cooperative-member / volunteer-organizer) are now kind='business' Group memberships. |
| ADR-9 | Accepted | [`policy-framework.md`](../product/foundation/policy-framework.md) — entire document | Three-filter test (helpful? harmless? abuse-resistant?) · opt-out default · "Policy posture" required on every spec touching privacy/revenue/data sharing · anti-Nextdoor commitments (messaging-scope item-or-group-only; complaint downvote/removal; "create an Item to lead the fix"). |
| ADR-10 | Consolidated into ADR-7 (2026-05-10) | ADR-7 (action layer + atomicity) · [`item.md`](../product/systems/item.md) (view refresh) · [`migration-to-primitives.md`](../notes/migration-to-primitives.md) (system Member, observability) | The original ADR-10 (migration transactional model — dual-write, backfill, rollback, 2-week verification window) was retired when the 2026-05-10 PM decision flipped to a clean-slate rebuild. Surviving invariants moved to ADR-7. |
| ADR-11 | **SUPERSEDED** — [archive](archive/DECISIONS-superseded-2026-05-10.md#adr-11-cooperative-is-a-separate-entity-from-community) · live successor: [`groups.md`](../product/systems/groups.md) | (deferred indefinitely) | Cooperative-style coordination deferred indefinitely. No `cooperatives` / `cooperative_assets` tables, no `cooperative_cohort` Item kind, no `pledge_intent` response_kind. Cooperative-shape use cases ship at b1 as kind='business' Groups with multiple owner-role memberships. |
| ADR-12 | Accepted, reinterpreted 2026-05-10 | [`member.md`](../product/systems/member.md) status banner; [`groups.md`](../product/systems/groups.md) | Maker is **explicit, declared, toggle-able**. `members.maker_mode_enabled` boolean default false. "Become a Maker" CTA creates/joins a kind='business' Group via `member.maker_mode.activate`. Three off-states: Pause · End a Group · Stop entirely. |
| ADR-13 | **Pending formal write-up** — banner is the ratification | [`groups.md`](../product/systems/groups.md) status banner | Group consolidation. Community / Member Operations / Cooperative absorbed into one Group primitive (spine + child architecture, six kinds at b1: five affiliate + one operate). |
| ADR-14 | **Pending formal write-up** — banner is the ratification | [`location.md`](../product/systems/location.md) status banner | Location spine + child architecture. `location_permanent`, `location_recurring_temporary`, `location_areas`. PostGIS geography on spine. Three kinds locked at create. |

When a "pending" ADR gets its formal write-up, it can either (a) collapse into the spec's banner (preferred — the spec is already the load-bearing ratification) or (b) join the cross-cutting section above if its reach turns out to be broader than one spec.

---

## What was archived

- 2026-05-11 — ADR-7 graduated from cross-cutting full-text to spec-resident in [`action-layer.md`](../product/systems/action-layer.md). The graduation expanded ADR-7 with the runtime trust substrate (scoped capabilities, closed-world catalog, unbypassable approval gates, network-layer credential injection, per-turn capability selection, sandboxed Skill execution) — the new content describes how the action layer *enforces* Delegation and Skill primitives at runtime, complementing the Member-facing primitive specs.
- 2026-05-10 — ADR-3, ADR-8, ADR-11 moved to [`archive/DECISIONS-superseded-2026-05-10.md`](archive/DECISIONS-superseded-2026-05-10.md). Active ADRs trimmed of Context paragraphs; live single-system decisions moved to spec banners; live foundation/UI/ops decisions moved to their existing home docs (ADR-1 → `web/CLAUDE.md`, ADR-2 → `design-language.md`, ADR-6 → triple-homed across `delegation.md`/`assistant-context.md`/`skills.md`, ADR-9 → `policy-framework.md`, ADR-10 surviving invariants consolidated into ADR-7).
- 2026-05-08 — Pre-mission-clarity DECISIONS.md preserved at [`archive/DECISIONS-pre-mission-clarity-2026-05-08.md`](archive/DECISIONS-pre-mission-clarity-2026-05-08.md). The dropped decision was the prior "Build b1 for Local Food Network Extensibility" framing.
