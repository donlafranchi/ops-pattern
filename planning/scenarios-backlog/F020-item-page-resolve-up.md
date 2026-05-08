# Scenario: Item Page — Public page with resolve-up rendering

**Feature:** F020
**Bundle:** b1
**System:** Item
**Loops:** 3, 7, 8, 9
**Status:** backlog

## Summary

Any visitor (logged in or not) views an Item's public page, which shows owner, kind-specific detail, response actions, and resolve-up rendering that reveals who owns this and how many other locations it appears at.

## Scenarios

### Basic Item page renders for a visitor

**Given** an Item exists with `state='active'`
**When** any user (authenticated or not) navigates to `/i/[item-slug]`
**Then** the page shows: title, kind chip, description, category and hashtag chips (hashtags link to `/h/[hashtag]`), kind-specific detail section, attached Location(s), and the appropriate response action

### Kind-specific detail sections

**Given** a Product Item page
**When** it renders
**Then** price, unit, composition/ingredients, photos (or placeholder if none), and available-until date are shown

**Given** a Gathering Item page
**When** it renders
**Then** date/time or recurrence label, capacity (if set), cost ("Free" if null), what to bring, and RSVP cutoff are shown

**Given** a Service Item page
**When** it renders
**Then** rate model and amount, hours, service area, accepts-new-clients status, and on-call status are shown

**Given** a Wonder Item page
**When** it renders
**Then** expiry date, interest count ("N people are in"), and conversion hint (if set) are shown; interest count shows "Be the first to say you're in" when 0

### Resolve-up: locally owned multi-location

**Given** an Item has a `brand_label` and the same `member_id` + `brand_label` matches other active Items
**When** the Item page renders
**Then** a resolve-up section reads "Locally owned. [Member display name] also operates: [linked sibling Item titles]" with a badge: **Local — one owner**

### Resolve-up: franchise pattern

**Given** an Item has a `brand_label` and different `member_id`s share the same `brand_label`
**When** the Item page renders
**Then** the resolve-up section reads "Part of [brand label]. Operated by [N] different local owners." with a badge: **Franchise — local operator**

### No resolve-up

**Given** an Item has no `brand_label` or no matching siblings
**When** the Item page renders
**Then** no resolve-up section is shown; owner line reads only "[Member display name]" linked to `/p/[member-slug]`

### Community scoping

**Given** an Item has `community_id` set
**When** the Item page renders
**Then** a chip reads "Posted in [Community Name]" linked to `/c/[slug]`

### Response actions

**Given** an unauthenticated visitor taps Follow / RSVP / "I'd be in"
**When** the auth gate modal opens
**Then** copy reads "Sign up to [follow / RSVP / say you're in] for [Item title]" and on sign-up completion the response is applied automatically

### Inactive Items

**Given** an Item's `state` is `withdrawn` or `fulfilled`
**When** the page renders
**Then** a banner reads "This [product / service / gathering / wonder] is no longer active", the response action is disabled, and the page remains at its URL (no 404)

### OG metadata

**Given** an Item page is shared via direct URL
**When** a link preview is generated
**Then** OG title = Item title, description = first 160 characters of description, image = first photo (Product) or platform default

## Acceptance Criteria

- [ ] Page renders for authenticated and unauthenticated visitors without redirect
- [ ] Kind-specific detail section shows the correct fields for each of the four kinds
- [ ] Resolve-up shows "Local — one owner" badge when `member_id` + `brand_label` matches siblings
- [ ] Resolve-up shows "Franchise — local operator" badge when `brand_label` matches across different `member_id`s
- [ ] No resolve-up section rendered when `brand_label` is null or no siblings exist
- [ ] Community chip shown only when `community_id` is set
- [ ] Response actions (Follow / Save / RSVP / "I'd be in") are kind-appropriate
- [ ] Unauthenticated response tap opens auth gate modal with item-specific copy
- [ ] Withdrawn/fulfilled Items show inactive banner; response action disabled; page does not 404
- [ ] OG metadata rendered server-side
- [ ] Hashtag chips link to `/h/[hashtag]`

## Out of Scope

- Follow streams and notification feeds (b2)
- Endorsements (b2)
- Wonder→Gathering conversion UI (b2 — schema reserved at b1 only)
- Reviews or ratings (permanently deferred)
