---
id: how-f036-member-creates-business-group-via-sell-walkthrough
purpose: Approved scenario — a member taps Sell and creates a kind='business' Group via the Sell walkthrough.
layer: how
status: approved
approved_on: 2026-05-31
---

# F036: A member creates a business Group through the Sell walkthrough

**Bundle:** b1
**Loops:** 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) — the baseline producer surface.
**Primitive shape:** Person → Group(kind='business', anchor Location, founder = creator with owner role).
**Status:** approved 2026-05-31
**Replaces:** F026 partially — the Group-creation half. Jurisdiction-claim half splits to F037.

## The Person

Maya is starting Oak Park Sourdough. She bakes from home, sells at a farmers market on weekends, and is starting to take pre-orders by text. She wants a public page where someone can find her — a clean URL, a brand label, a list of products, and eventually a Locally Owned badge. She doesn't think of herself as a "Maker" with a toggle; she's a baker who needs a place to be findable.

## The Story

From `/you`, Maya taps **"Sell."** The Sell walkthrough opens — a single guided flow that creates her business Group.

Steps:
1. **Brand name** — "Oak Park Sourdough" (writes `group_businesses.display_name`).
2. **Anchor Location** — pick from her saved Locations or add a new one (writes `groups.anchor_location_id`).
3. **About** — short public description (writes `group_businesses.public_description`).
4. **Locality claim (optional)** — Tier 0 self-attested ZIP step. She can fill it in now or skip (F037 covers the claim lifecycle). At b1 she can fill it in, but the badge UI rendering is tested in F037.
5. **Done.**

She lands on the new Group page (F035). The page shows her as founder (owner role), her brand name as the page title, and an empty Items section ("List a product" CTA visible). Selling-tool affordances now surface from her active kind='business' Group membership — no profile toggle, no maker_mode flag (per ADR-12 SUPERSEDED 2026-05-12).

The "Sell" CTA on `/you` and as a secondary CTA on gathering/wonder composers all route to this walkthrough for first-time Sellers; for Members with ≥1 active kind='business' Group, those CTAs route to "Add an Item" instead.

## Surfaces

- **Entry point:** `/you` "Sell" affordance (primary). Secondary entries on gathering/wonder composers ("Sell instead?").
- **Primary action:** "Sell" → walkthrough.
- **Composer / interaction:** Five-step walkthrough (brand · anchor · about · optional locality · done). Each step writes incrementally so a back-out preserves partial state.
- **Completion:** Lands on the new Group page `/p/[…place]/g/[slug-suffix]` with an "Add a product" CTA.
- **Discovery:** N/A for the walkthrough; the new Group becomes discoverable via the Group browse index (b1.x) and Items the founder lists later.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Brand name | `group_businesses.display_name` | yes |
| Anchor Location | `groups.anchor_location_id` (FK to `locations`) | yes |
| Public description | `group_businesses.public_description` | optional |
| Legal entity kind (optional) | `group_businesses.legal_entity_kind` enum | optional |
| State of formation | `group_businesses.state_of_formation` | optional |

Implicit: `groups` spine row with `kind='business'`, `founder_member_id=<member>`, `discoverability='listed'`. `group_memberships` row writes for the founder with `role='owner'`, `source='explicit'`. Events: `group.created`, `group.member_joined`.

## Acceptance Criteria

### "Sell" CTA visible on /you for any Member

**Given** an auth'd Member on `/you`
**When** the page loads
**Then** a "Sell" CTA is visible, regardless of whether they already have a business Group (CTA routes to walkthrough for first-time, to "Add an Item" for subsequent).

### Walkthrough creates Group + founder membership in one transaction

**Given** Maya completes the brand + anchor + about steps and taps Done
**When** the submit fires
**Then** in one transaction: a `groups` row writes (kind='business', founder_member_id, anchor_location_id, discoverability='listed'); a `group_businesses` row writes (display_name, public_description); a `group_memberships` row writes (group_id, member_id=founder, role='owner', source='explicit'); `group.created` + `group.member_joined` events log with `acting_member_id=founder`.

### Lands on the new Group page

**Given** the walkthrough completes
**When** Maya is redirected
**Then** she lands on `/p/[…place]/g/[slug-suffix]` (slug derived from display_name + random suffix per ADR-22); page renders her as founder + owner; empty Items section with "Add a product" CTA visible.

### Selling-tool affordances surface from Group membership

**Given** Maya now has ≥1 active kind='business' Group membership
**When** she returns to `/you` or any Item composer entry
**Then** selling-tool affordances (Add a product, Add a service, Add a gathering) appear from her active membership — no profile toggle. Per ADR-12 SUPERSEDED 2026-05-12.

### Locality step is skippable

**Given** Maya skips the Tier 0 locality step
**When** the walkthrough completes
**Then** the Group is created without any `member_business_jurisdictions` row; no badge surfaces on the Group page; she can return to the locality claim via Group settings later (F037 covers the claim lifecycle).

## Edge Cases

- **Anchor Location doesn't exist:** sub-flow opens to add a new Location; on save, returns to the walkthrough with the new Location selected.
- **Brand name collision:** slug suffix per ADR-22 makes collision-resistant; display_name has no uniqueness constraint.
- **Walkthrough abandoned mid-flow:** partial state preserved (the Group is created on step 1 with the brand name; later steps update). Resume on next "Sell" tap or via `/you`.
- **Member already has a business Group:** "Sell" routes to "Add an Item" picker; walkthrough is for first-time Sellers only. (Multi-business-Group case: b2 surface, but schema supports it.)

## Assumptions

- Phase 1 substrate: `groups`, `group_businesses`, `group_memberships`, `locations`, `members`.
- Action handlers: `group.create`, `group.member_join` (per Phase 2 plan).
- F035 (Group public page) ships alongside this scenario so the walkthrough completion has a destination.
- ADR-22 random-suffix slug pattern is wired for Group slug generation.

## Out of Scope

- Multi-owner / partnership business Groups — schema supports it; surface b2.
- Cooperative governance, voting, treasury — deferred indefinitely per `groups.md`.
- Edit-business-Group flow — separate scenario.
- Staff confirmation flow — b2.
- Profile-toggle "Maker mode" entry — explicitly retired per ADR-12 SUPERSEDED 2026-05-12.
- The Locally Owned claim lifecycle (set, edit, remove, out-of-metro) — F037.

## Capabilities unlocked

- **1. Presence & Findability** — Business Group public page at a clean, place-scoped URL (`/p/.../g/[slug]`).
- **2. Product & Service Listing** — Items filed under a business Group resolve-up with the Group's brand name.
- **10. Collaboration & Staffing** — Creator joins as `role='owner'` (founder = historical label per `groups.md` 2026-05-31 amendment); additional owners or staff can be added later via `group.member_join` / `group.role_change`. Sole-prop shape at creation = one owner; multi-owner partnerships and staff are b1-supported additions, not blocked.
