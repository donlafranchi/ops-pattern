# System: Member Operations

> **🚨 RETIRING (2026-05-10) — superseded by [`groups.md`](groups.md).**
>
> The Member Operations primitive is fully absorbed into Groups. Each commercial-capacity case maps to a kind='business' Group:
> - **Sole proprietor** → kind='business' Group of one with the Member as sole `owner`-role membership.
> - **Partnership** → kind='business' Group with multiple `owner`-role memberships (founder is the operating owner; others are co-equal in ownership but defer to founder for routine writes).
> - **Staff working for someone else** → `member`-role membership in another Member's kind='business' Group (b2 confirmation flow).
> - **Cooperative member** → deferred indefinitely per groups.md (cooperative-style coordination involves off-platform verbs the platform isn't ready to mirror).
>
> **Why.** Operations and Communities and Cooperatives all answered the same underlying question: how does the platform record people organized to do things together? Three primitives for one question was the duplication. Groups consolidates them with one spine + child architecture per `groups.md`.
>
> **What still applies from this doc.** The standing-tier reasoning carries forward: a Member with ≥1 active membership in a kind='business' Group (or a `steward`-role membership in any non-business Group) returns TRUE from `member_has_standing_presence`. The `member.maker_mode_enabled` toggle (ADR-12) is reinterpreted to apply to Group-membership-driven Maker surfaces. The "Become a Maker" CTA's underlying behavior is now: create or join a kind='business' Group with the Member as owner-role membership, set `maker_mode_enabled = true` in the same transaction.
>
> **Status of this file.** Stays in tree as historical reference until the migration plan rewrite folds the absorption into Phase 1 schema. Do not extend or cite as the live spec. Cross-references in `member.md`, `b1-primitives.md`, and `notes/migration-to-primitives.md` will be re-pointed during the migration plan rewrite. ADR-8 is fully superseded.

**Status:** RETIRING — see banner above.

**Purpose (retained for historical context):** Establish Member Operations as the explicit, Member-authored declaration of *what commercial work a Person is doing and in what capacity*. Replaces the derived, behavior-inferred maker_signal pattern from ADR-3 with a clean, declared, editable primitive that captures the distinctions ADR-3 couldn't carry — sole proprietor vs. side business vs. cooperative member vs. staff working for someone else's operation. Member Operations are how the platform recognizes commercial activity without modeling a Business entity, and how agent assistance, follower affordances, and producer-facing surfaces decide which Members get standing-tier treatment.

**Bundles:** b1 (T1 — schema, declaration UI, capacity enum, supersession of maker_signal), b2 (T2 — staff/cooperative relationships, brand-label integration), b3 (T3 — operations history, federation portability)

**North stars served:** Family 3 (Trade) directly — Operations are how Make-and-be-found, Find-a-pro, and Follow-what-you-love distinguish standing commercial Members from casual posters. Family 4 (Pooling) heavily — cooperative formation lands in `cooperative_member` capacity; partner declarations are how partnerships register without an LLC. Families 1 and 2 by exclusion — Members participating only in Gathering and Sharing loops do not declare Operations and are not pushed toward commercial framing.

## What an Operation Is and Why It Matters

A Member Operation is one row per *commercial thing the Member is doing*, in a stated capacity, optionally linked to another Member if the work is for or with someone else. A Member can hold multiple Operations: Maya runs Oak Park Sourdough as a sole personal business and is also a `cooperative_member` of the Sacramento Bakers Co-op. Sarah works `staff` for Maya's operation on Saturdays. Each row carries the label the Member chose, the capacity, the link (if any), and a lifecycle.

The argument for replacing the derived maker_signal pattern (per ADR-3) with explicit Operations is structural and was confirmed in conversation with the PM:

- **Derived signals are gameable, opaque, and drift-prone.** Inferring "Maker-ness" from posting frequency, recurrence, and follower count produces a number with no clean threshold, no stable meaning, and no explanation the Member can read. Operations are declared, dated, and obvious.
- **The capacity question is real and ADR-3 couldn't carry it.** Sarah selling at Maya's booth is doing commercial work but is *not the operator* — she should not be modeled as a Maker in her own right. The capacity enum captures this without inventing a Business entity.
- **Standing-tier agent context needs a clean gate.** The Self-Record (per `member-self-record.md`) and the Skills system (per `skills.md`) both gate behavior on standing presence. "Has at least one active Operation" is a clean, declared, ungameable gate. Anything more clever than that risks the same drift maker_signal had.
- **People-first holds.** The Operation is a label on the Member, not a row in a `businesses` table. Cooperatives are Communities of Members each holding `cooperative_member` Operations against the same `operating_label` — the Community is the cooperative, the Operations are the Members' relationships to it. Staff link Person-to-Person (`operating_for_member_id`), never Person-to-Business. The shell stays absent.

## Operations capacities

The capacity enum is small, opinionated, and additive:

- **`sole_personal`** — The Member runs this themselves, as their own personal business, full-time or as primary income. Maya at Oak Park Sourdough; the plumber operating under his own name; the candlemaker selling at three markets a week. Most "real businesses" on the platform land here.
- **`side_personal`** — The Member runs this themselves, on the side. Same shape as sole_personal but smaller commitment, lower expectations of frequency, often parallel to a day job. The Etsy-on-evenings baker; the weekend dog trainer.
- **`partner`** — The Member is a partner in this work with one or more named other Members. Each partner declares their own Operation against the same `operating_label`. The partnership exists as the set of partner Operations sharing a label; no separate partnership entity.
- **`cooperative_member`** — The Member is a member of a cooperative. The Operation links to two things: the affinity Community of `kind=cooperative` (per `community.md`) that operates this work socially, and the Cooperative legal entity (per [`cooperative.md`](cooperative.md)) that holds title to assets. Per ADR-11, those are two separate rows. The `member_operations` row carries `cooperative_id` (FK to `cooperatives`) for the legal-entity link, and `community_id` for the affinity Community link. Either may be present without the other; both are typical for a fully-formed cooperative.
- **`staff`** — The Member works for someone else's Operation. Links via `operating_for_member_id` to the operator (the Member running the operation, not a Business). Sarah-at-Maya's-booth; the apprentice plumber; the part-time dog walker working for a sole proprietor.
- **`volunteer_organizer`** — The Member convenes or organizes commercial-adjacent work without commercial relationship to it. The unpaid market manager who organizes the farmers market; the volunteer coordinator for a community-run event series. They get standing-tier agent context because they're doing standing organizing work, even though they're not paid.

The enum is extensible without schema migration. Likely future additions: `apprentice` (a more specific staff variant with explicit teaching relationship), `consultant` (intermittent paid work without standing presence), `seasonal` (full-time but bounded to part of the year). Add when the canonical examples warrant.

## T1 — MVP Tier

The b1 commitment is **schema + declaration UI + standing-tier integration.** Operations actually ship at b1 — they are the gate for several other systems and cannot be deferred.

- A Member can create one or more Operations from `/you/operations` (a new settings surface).
- **Per ADR-12, the entry point to Operation declaration is the "Become a Maker" CTA**, not the `/you/operations` settings surface directly. New Members onboard with `members.maker_mode_enabled = false` and don't see the Operations settings; they see a "Become a Maker" prompt on `/you` and as a secondary CTA on gathering / wonder composers. Tapping it opens the capacity picker → label → optional `operating_for_member_id` walkthrough. Completing the walkthrough creates the Operation row AND sets `maker_mode_enabled = true` in the same transaction (per the `member.operation.declare` action handler). After the first Operation, subsequent Operations are declared from `/you/operations` directly.
- Each Operation captures `operating_label`, `capacity`, optional `operating_for_member_id` (required for `staff`), `declared_at`.
- The capacity enum includes `sole_personal`, `side_personal`, `partner`, `cooperative_member`, `staff`, `volunteer_organizer`.
- A Member can end an Operation (`ended_at` set); ended Operations remain in the record but no longer grant standing tier.
- **Maker mode toggle (per ADR-12) is independent of Operations.** The Member can pause Maker surfaces from their profile (`members.maker_mode_enabled = false`) without ending Operations. Operations remain `active`; they simply don't surface user-facing until the toggle flips back. This is the deliberate split: Maker mode is a UI toggle; Operations are the data primitive. Standing-tier gate (`member_has_standing_presence`) reads from Operations — it is unaffected by the Maker-mode toggle.
- The Member's profile page conditionally renders an "Operations" section (and the Maker section more broadly) only when `maker_mode_enabled = true`. Hidden when paused; hidden when no Operations exist.
- **Standing-tier gate** — the Self-Record, the assistant context, and the Skill subscription affordance are all gated on "Member has ≥1 active Operation." This replaces the original ADR-3's derived `maker_signal` as the surface trigger. ADR-12 supersedes ADR-3 entirely; the implementation moves from inference to *explicit declaration via a user-facing CTA*. (The original ADR-3's framing of "no Maker onboarding distinct from doing the work" is rejected by ADR-12 — the Maker CTA is now first-class.)
- The `items.brand_label` field (per `item.md`) integrates with Operations: the Item composer's brand_label dropdown autosuggests from the Member's active Operation labels (creating a new label if not present), so the Item naturally inherits the Member's operating context.
- A `member_operations_active` view (or equivalent helper) returns the set of currently active Operations per Member, used by the standing-tier gate.

## T2 — Core Tier

Staff/cooperative relationships ship in full; brand-label integration deepens.

- **Staff confirmation flow.** When a Member declares a `staff` Operation linking to another Member, the linked operator receives a confirmation prompt. Without confirmation, the staff Operation is shown on the staff Member's record as "claimed but unconfirmed" and does not grant the staff Member edit rights on the operator's Items. With confirmation, the staff Member can be granted scoped Item-edit Delegations by the operator (per `delegation.md` — likely a new `staff_edit_items` scope).
- **Cooperative Operation rollup.** A Community of kind=cooperative (per `community.md`) surfaces the list of Members holding `cooperative_member` Operations against its label, on the cooperative's public page. The Community remains the source of truth for cooperative membership; Operations are the Members' commercial-relationship view of the same fact.
- **Partner Operations** auto-link to each other when multiple Members declare `partner` against the same `operating_label`, surfacing as a "partners in [label]" group on each partner's profile.
- **Brand-label resolve-up rendering** (per `item.md`): an Item by Sarah carrying brand_label=Oak Park Sourdough resolves up to Maya's Operation (Maya is the `operating_for_member_id` for Sarah's `staff` Operation against Oak Park Sourdough), so the Item displays attribution correctly: "by Sarah, working for Oak Park Sourdough (Maya)."
- Operations editor surfaces an "ended" toggle and a re-activate flow without losing history.

## T3 — Polish Tier

Operations history, federation portability, and richer relationships.

- **Operations history view** for the Member: every Operation they've held, in chronological order, with capacity changes, partner additions/removals, periods of activity. Member-facing only; not a public Yelp-history surface.
- **Capacity transitions** with explicit lineage: `side_personal` → `sole_personal` (the side hustle going full-time), `staff` → `sole_personal` (apprentice opening their own shop, optionally linking back to the former operator as a teacher), `partner` → `cooperative_member` (formal cooperative formation).
- **Federation portability** — when a Member moves identity to a federated platform (per Loop 13), Operations carry over with the same shape; partner and staff links resolve against the federation peer's identity protocol.
- **Cross-Operation analytics for the Member** (not the platform) — "your Saturday booth Operation produced 60% of your follower growth this quarter" — Member-facing only.
- **Operation-scoped Delegations** — a Member with multiple Operations can scope a Skill subscription to a specific Operation (the bakery-inventory skill applies to Oak Park Sourdough only, not to my evening dog-training side gig).

## Data model implications

**Required at MVP — this primitive ships at b1, not just its schema.**

**The spine — `member_operations`:**

- `id` (uuid)
- `member_id` (FK to `members`)
- `operating_label` (text — the label the Member chose: "Oak Park Sourdough", "Cafe Capricho Cooperative", "weekend dog walking")
- `capacity` (enum: `sole_personal`, `side_personal`, `partner`, `cooperative_member`, `staff`, `volunteer_organizer`)
- `operating_for_member_id` (FK to `members`, nullable — required for `staff`; optional for `volunteer_organizer` if organizing on behalf of a named operator)
- `community_id` (FK to `communities`, nullable — set for `cooperative_member`, links to the cooperative Community)
- `declared_at` (timestamptz)
- `ended_at` (timestamptz nullable)
- `confirmed_by_operator_at` (timestamptz nullable — for `staff` Operations, set when the operator confirms)
- Indexes: `(member_id, ended_at)` for active-Operations lookup; `(operating_label)` for partner/cooperative grouping; `(operating_for_member_id, ended_at)` for "who works for me."

**Active-Operations view — `member_operations_active`:**

A read-only view returning Members with their currently-active Operations (`ended_at IS NULL` AND, for staff, `confirmed_by_operator_at IS NOT NULL` at b2). Used by the standing-tier gate, the Item composer's brand_label autosuggest, and the assistant's context bootstrap.

**Standing-tier gate — `member_has_standing_presence` view:**

```sql
-- Conceptual; final SQL TBD at b1 ticket time
SELECT member_id
FROM member_operations
WHERE ended_at IS NULL
GROUP BY member_id
```

Replaces the `member_standing_signal` view referenced in `member-self-record.md` and ADR-6. Simpler, declared, ungameable. The Self-Record affordance prominence and the assistant's behavior tier read this view, not a behavioral signal.

**Event log entries (required at MVP):** `operation.declared`, `operation.ended`, `operation.capacity_changed`, `operation.staff_confirmed` (T2), `operation.partner_linked` (T2), `operation.cooperative_linked` (T2).

## Integration with existing systems

- **`item.md`** — `items.brand_label` autosuggests from the Member's active Operation labels at composer time. Items inherit Operation context for resolve-up rendering. The `item.created` event records which Operation (if any) the Item belongs to via the brand_label match.
- **`member-self-record.md`** — replaces the standing-tier gate from `member_standing_signal` (undefined) to `member_has_standing_presence` (Operation-derived). Self-Record affordances appear when the Member has ≥1 active Operation.
- **`skills.md`** — same standing-tier gate. Skill catalog discovery and subscription flow surface to Members with active Operations; casual Members see a smaller skill set or no surface at all (TBD at b2 design).
- **`delegation.md`** — `staff` Operations enable a future `staff_edit_items` Delegation scope at b2.
- **`community.md`** — Communities of kind=cooperative integrate with `cooperative_member` Operations; partner Operations grouping is its own surface.
- **`member.md`** (forthcoming) — Operations are a sub-record of Member; the Member spec when written will reference Operations as the canonical commercial-relationship layer.

## Supersession of ADR-3's maker_signal

ADR-3 (Maker profile is implicit, not claimed) introduced the `member.maker_signal` derived view as the mechanism for surfacing Maker affordances based on behavior (post frequency, Item count, recurrence, followers). The derivation was deferred to a separate ticket and never specified.

This system **supersedes that mechanism** while preserving ADR-3's intent. ADR-3's commitments that remain in force:

- No separate "Become a Maker" onboarding step.
- No identity claim distinct from the work.
- Maker affordances appear conditionally (when the Member has product Items + an Operation under which they sell them); they vanish when none.
- The Member's profile renders sections conditionally based on what they actually do.

What changes:

- The trigger for affordances moves from *behavioral inference* to *declared Operation*. A Member who has declared an Operation (any capacity) and has product Items gets Maker affordances. No threshold, no signal score, no derivation.
- The CTA to "list a product" (per ADR-3) is preserved; it now also prompts the Member to declare an Operation if they don't have one. The first Item from a new commercial Member becomes a small two-step: declare what you're operating, then list the Item. After that, listing is one step.
- The standing-tier gate for agent context, Skill subscription, and Self-Record affordance prominence is "≥1 active Operation," replacing the never-specified `member_standing_signal`.

ADR-8 (forthcoming, drafted alongside this spec) formalizes the supersession and amends ADR-3.

## Policy posture

Per [policy-framework.md](../foundation/policy-framework.md):

- **Default:** Members do not have any Operations declared. The platform does not infer or auto-create them. Members opt in by declaring.
- **Visibility default:** A Member's active Operations are visible on their public profile under the "Operations" section. This default is *opt-in by declaration* — declaring an Operation is the act of saying "this is a public part of who I am here." A Member can mark a specific Operation as private (visible only to themselves and to its `operating_for_member_id` if set), useful for early-stage side work the Member isn't ready to publicize.
- **Three-filter analysis:**
  1. *Helpful?* Yes — Operations are how Members signal their commercial role honestly, get the right tools (standing-tier agents, Skills), and let the platform render their work clearly to neighbors.
  2. *Harms others?* No — declaring an Operation makes the Member's role visible; it does not impose obligations on anyone else. `staff` declarations require operator confirmation at T2 to prevent false claims; until confirmed, they're shown as unconfirmed.
  3. *Abusable?* Limited surface area. The main vectors are (a) false `staff` claims to ride on an operator's reputation — mitigated by operator confirmation; (b) inflated commercial framing of casual activity — mitigated by the absence of any reward for over-declaring; (c) social pressure to declare — mitigated by the always-available choice not to declare and the lack of any platform consequence for not declaring.

## What Operations rule in and rule out

Rules in: a Member who actually runs a business gets visibly recognized as such, with the tools (per `skills.md`) and the agent context (per `member-self-record.md`) that match the work. A staff Member working for an established operation gets recognized for their contribution without being modeled as an independent Maker. A cooperative is structurally legible without inventing a Business entity. Partnerships register without an LLC.

Rules out: any inference of commercial activity from behavior. Rules out: any platform-imposed "you've been promoted to Vendor" event. Rules out: false `staff` claims that grant unearned reputation (operator confirmation is required for any consequential surfacing). Rules out: a tier system where Members compete on Operation count or status.

## Integration Points

- **Connects to:**
  - **Member** (Operations are sub-records of Members; per `member.md` forthcoming)
  - **Item** (Items inherit Operation context via brand_label; per `item.md`)
  - **Member Self-Record** (standing-tier gate; per `member-self-record.md`)
  - **Skills** (subscription affordance + assistant-context tier; per `skills.md`)
  - **Delegation** (T2 — staff_edit_items scope; per `delegation.md`)
  - **Community** (cooperative_member Operations link to Communities of kind=cooperative; per `community.md`)
- **Used by:**
  - The Item composer (brand_label autosuggest)
  - The Member profile page (Operations section, conditional render)
  - The standing-tier gate (Self-Record, Skills, assistant context)
  - The cooperative Community page (member rollup)
  - The future Intelligence layer (Operation declarations are direct economic-activity signals)

## Open questions

- **Should `volunteer_organizer` grant standing tier?** Working answer: yes, because organizing recurring real-world work is standing presence even when unpaid. But the Skills surfaced for volunteer organizers are different (RSVP digest, pre-event reminder) than for commercial Operations. Confirm at first b2 design pass.
- **Multiple Operations under one label.** Maya has Oak Park Sourdough as both `sole_personal` and `cooperative_member` (she's part of a sourdough cooperative that operates under her brand)? Working answer: separate labels for separate operating arrangements, even if it costs some clarity. Revisit if real cases warrant.
- **Inactive vs. ended.** A seasonal baker pauses for summer — `ended_at` set or some "inactive" intermediate state? Working answer: `ended_at` set; re-activate creates a new row preserving prior history, with a `previous_operation_id` link at T3. Avoid intermediate state machines until needed.
- **Public discoverability of Operations.** Should the platform have a `/operations` browse surface (list active Operations in a locality)? Working answer: not at b1; locality discovery happens through Items, not through Operation listings. The Operation is a Member-attached fact, not its own discovery surface.
- **Capacity changes mid-Operation.** Maya's side gig becomes her full-time work — is that a capacity change on the same row, or end + new row? Working answer: capacity change in place at b1 (records `operation.capacity_changed` event); explicit transition lineage at T3.
