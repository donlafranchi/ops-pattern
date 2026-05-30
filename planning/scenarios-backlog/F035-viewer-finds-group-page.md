---
id: how-f035-viewer-finds-group-page
purpose: Backlog scenario — a viewer finds a Group's public page; covers both community-kind and business-kind Group rendering.
layer: how
status: draft
---

# F035: A viewer finds a group's public page

**Bundle:** b1
**Loops:** 1 (Find your people), 7 (Buy close), 9 (Make a living locally)
**Canonical example:** [O1 — Group that emerges from regulars](../../product/needs/use-cases.md#o1-a-group-meets-at-a-regular-time-and-place) (event_anchored / interest kind) + [P1 — Producer creates a profile](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services) (business kind).
**Primitive shape:** Person (viewer) → `groups` (read) + `group_memberships` (read, optional write for Join) + `items` filed under group (read).
**Status:** backlog
**New scenario** — split from F025 per ADR-20 reframe. F032 takes the Member page; this scenario takes the Group page. Covers both community-kind and business-kind Group rendering in one scenario, since the page template is shared and the conditionals are minimal.

## The Person

Two flavors:
- Someone tapping through from a gathering hosted by a kind='event_anchored' Group ("the Thursday Runners"), wanting to see who else runs and whether to join.
- Someone tapping through from a product listed under a kind='business' Group ("Oak Park Sourdough"), wanting to see the producer's brand, other products, and locality claim.

Both land on `/p/[…place]/g/[slug]`.

## The Story

Header: Group name, kind chip (e.g., "Business · Oak Park" or "Run club · Drake's"), anchor Location with map pin if set. For kind='business': `group_businesses.display_name` is the brand label and "Claimed local owner" badge surfaces if Tier 0 jurisdiction passes proximity test against the viewer's locality (F037 writes the claim). For community kinds: simple name + kind chip; no brand.

Sections:
- **Members** — listed memberships only (privacy gates hold). Member count visible.
- **Items** — Items filed under the Group (`items.group_id = group.id`), resolve-up rendered with the Group's brand for business kind.
- **Join** CTA for community kinds (`source='explicit'`). For business kinds, no Join CTA — only the founder + owner-role members exist at b1 (staff-confirmation flow b2).

## Surfaces

- **Entry point:** `/p/[…place]/g/[slug]` — reachable from Items filed under the Group, the Group browse index (`/g`, b1.x or b2), and direct link.
- **Primary action (community kinds):** "Join" (writes `group_memberships(source='explicit')`).
- **Primary action (business kinds):** Read-only at b1; b2 adds staff confirmation flow.
- **Composer / interaction:** Read-mostly; Join is the only write at b1 for community kinds.
- **Completion:** Stays on `/p/[…place]/g/[slug]`; CTA flips to "Member" with a leave affordance.
- **Discovery:** N/A — read surface.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Join this group | `group_memberships(group_id, member_id, role, source='explicit', joined_at)` | yes (write on tap, community kinds only) |

Read: `groups` spine + child tables (`group_businesses`, `group_event_anchored`), `group_memberships`, `items` filtered by `group_id`, `member_business_jurisdictions` (for the badge derivation per `business-jurisdiction.md`).

Implicit: `group.member_joined` event on Join; rendering uses `member_has_standing_presence` for Member badges in the Members section.

## Acceptance Criteria

### Anonymous visitor can read any listed Group page

**Given** a Group with `discoverability='listed'`
**When** an anonymous visitor loads `/p/[…place]/g/[slug]`
**Then** header (name, kind chip, anchor Location), Members section (listed memberships only), and Items section render; Join CTA visible but auth-gated.

### Business-kind Group surfaces brand + locality badge conditionally

**Given** a kind='business' Group with a Tier 0 jurisdiction claim in `member_business_jurisdictions` for the founder
**When** the viewer's locality proximity test against the jurisdiction ZIP passes
**Then** the page renders `group_businesses.display_name` as the brand label and "Claimed local owner" badge in the header; if the viewer is anon, IP-geolocated locality is used; if the viewer's locality fails the proximity test, no badge renders (the claim exists but doesn't render for that viewer per `business-jurisdiction.md` derivation rule).

### Authenticated Member joins a community-kind Group

**Given** an auth'd Member on a kind='interest' / 'practice' / 'event_anchored' / 'place' / 'family' Group's page
**When** they tap "Join"
**Then** a `group_memberships` row writes with `role` per the kind's default + `source='explicit'`; `group.member_joined` event logs; CTA flips to "Member" with a Leave affordance.

### Business-kind Group has no Join CTA at b1

**Given** an auth'd Member viewing a kind='business' Group
**When** the page loads
**Then** no Join CTA renders. The b2 staff-confirmation flow is the path; b1 read-only for non-founder viewers.

### Privacy gates hold on Member list

**Given** the Group has memberships with mixed visibility
**When** any viewer loads the page
**Then** only listed memberships appear in the Members section; private memberships are not visible at all; member count reflects listed only (with a note if visible-vs-total differs).

## Edge Cases

- **Group `discoverability='private'`:** 404 to non-member viewers.
- **Group `discoverability='unlisted'`:** page reachable by direct link but excluded from the `/g` browse index.
- **Group with no Items:** empty-state ("Nothing posted yet") in the Items section.
- **kind='family' Group:** `discoverability` defaults to `private` per `groups.md`; visible to members only.
- **kind='event_anchored' Group with `seeded_by_item_id` pointing at a deleted Item:** show the Group without the seeded-by link.

## Assumptions

- Phase 1 substrate: `groups`, `group_memberships`, `group_businesses`, `group_event_anchored`, `member_business_jurisdictions`, `member_has_standing_presence` view.
- ADR-20 place-scoped URL resolver for `/p/[…place]/g/[slug]` is wired.
- The "Claimed local owner" badge derivation per `business-jurisdiction.md` `public.zip_is_proximal_to_location()` is implemented.
- F037 (Locally Owned claim) ships before badge rendering can be tested end-to-end; F035 ships with badge UI in place but no claims to render against until F037 writes some.

## Out of Scope

- Group browse index `/g` and Group-create flow `/g/new` — covered separately (b1.1 work-map item or a later scenario).
- Staff-confirmation flow for business kinds — b2.
- Posting feed inside Groups (Group discussion / messages) — b2.
- Stewardship rotation, dormancy revival flows — b2 / b3.
- Capital-flow surfaces, cooperative governance — deferred indefinitely per `groups.md`.
- Edit-Group flow — separate scenario for owners.

## Capabilities unlocked

- **1. Presence & Findability** — business Group public page at place-scoped URL (`/p/.../g/[slug]`); brand resolve-up on filed Items.
- **3. Locality & Trust Signals** — "Claimed local owner" badge renders on the Group page when viewer's locality is proximal.
- **5. Customer & Community Relationships** — members can follow a business Group (writes `group_memberships`); follow counts visible on public page.
- **9. Reputation & Social Proof** — Group member count visible on the business Group page; standing-presence badge surfaces in Members section.
- **10. Collaboration & Staffing** — Founder = operating owner on the business Group is rendered.
