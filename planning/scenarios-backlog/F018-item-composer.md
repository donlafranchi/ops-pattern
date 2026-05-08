# Scenario: Item Composer — Unified kind-picker with sibling-clone for multi-location

**Feature:** F018
**Bundle:** b1
**System:** Item
**Loops:** 1, 2, 4, 7, 9
**Status:** backlog

## Summary

A Member creates a new Item using a single composer with a kind picker, kind-specific metadata fields, Location attachment, and sibling-clone flow for multi-location same-owner.

## Scenarios

### Kind picker shown first; kind-specific fields appear below

**Given** an authenticated Member navigates to `/new`
**When** the composer loads
**Then** a kind picker is shown at the top with four options: Product, Service, Gathering, Wonder — no kind is pre-selected and no metadata fields are visible until a kind is chosen

**Given** the Member selects "Gathering"
**When** the kind is selected
**Then** shared fields appear (title, description, category, optional hashtags) plus gathering-specific fields: starts at, ends at, recurrence rule, capacity (optional), cost (optional; null = free), what to bring (optional), RSVP cutoff (optional)

**Given** the Member selects "Wonder"
**When** the kind is selected
**Then** shared fields appear plus wonder-specific fields: expiry (default 90 days), conversion hint (optional — "I'd turn this into a Gathering / Initiative if it gets traction")

### Item is created and reachable at a public URL

**Given** the Member has filled all required fields and submits
**When** the form is submitted
**Then** a spine row is written to `items`, a kind-specific child row is written to the matching child table, an `item.created` event is appended to the event log, the Member is redirected to `/i/[item-slug]`, and the item appears in the locality-first index within 60 seconds

### Sibling-clone for multi-location same-owner

**Given** the Member has existing Items sharing a `brand_label`
**When** the Member opens `/new`
**Then** a prompt appears: "Is this another location of [brand label]?" listing existing Items

**When** the Member selects a sibling
**Then** the new Item is pre-filled with the sibling's `brand_label`, `category`, `description`, and kind-specific metadata — the Member is prompted only for the new Location (and any fields they wish to change)

**When** submitted
**Then** the new Item is created with `brand_label` matching the sibling — sibling resolve-up rendering on the Item page shows both locations

### Optional Community scoping

**Given** the Member has a `primary_community_id`
**When** the form loads
**Then** that Community is pre-selected as the default in the optional "Community" field — the Member may clear it (defaults to `community_id = null`)

### Unauthenticated access

**Given** an unauthenticated visitor navigates to `/new`
**When** the page loads
**Then** they are redirected to the sign-in page with a return URL of `/new`

## Acceptance Criteria

- [ ] Kind picker is shown first; no metadata fields visible before kind selection
- [ ] Each kind reveals the correct kind-specific fields (Product: price/unit/composition/photos/available_until; Service: rate_model/rate_cents/service_area/hours/license_info/on_call/accepts_new_clients; Gathering: starts_at/ends_at/recurrence_rule/capacity/cost_cents/what_to_bring/rsvp_cutoff; Wonder: expires_at/interest_count/conversion_target_kind)
- [ ] Submitting writes one spine row to `items` and one child row to the correct kind table
- [ ] `item.created` event appears in `item_events` after submit
- [ ] Item is reachable at `/i/[slug]` immediately after creation
- [ ] Sibling-clone prompt appears when existing Items share a `brand_label` under the same `member_id`
- [ ] Sibling-clone pre-fills metadata; new Location is the only required new input
- [ ] Wonder does not require a Location attachment
- [ ] Switching kind after partial fill shows a confirmation warning before clearing kind-specific fields
- [ ] Incomplete required fields show inline validation, no submission
- [ ] Unauthenticated `/new` redirects to sign-in with return URL

## Out of Scope

- Offer, Ask, Initiative kinds (reserved at schema; no UI at b1)
- Community posting surfaces (b2)
- Payments / commerce rails (b3)
- Photo upload (referenced in schema but upload UI is a separate ticket)
