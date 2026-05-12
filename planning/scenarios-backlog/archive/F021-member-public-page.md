# Scenario: Member Public Page — Person's declared Items grouped by brand label

**Feature:** F021
**Bundle:** b1
**System:** Member
**Loops:** 3, 7, 9
**Status:** backlog

## Summary

Any visitor views a Member's public page, which shows their profile, all active Items grouped by brand label, and explicitly joined Communities. The page is the face of the person behind every Item — not a business profile.

## Scenarios

### Member page renders for a visitor

**Given** a Member has at least one active Item
**When** any user navigates to `/p/[member-slug]`
**Then** the page shows: display name, avatar, bio (if set), contact/link section (if any links set), Items grouped by `brand_label`, and explicitly joined Communities as chips

**Given** Items share a `brand_label` under the same `member_id`
**When** the page renders
**Then** those Items appear under the brand label as a section heading — Items with no `brand_label` appear under the Member's display name

**Given** a Member has Items under multiple `brand_label` values
**When** the page renders
**Then** each brand label appears as a distinct section; a resolve-up note reads "Locally owned — [Member name] operates all locations under this label"

### Empty and partial states

**Given** a Member has no active Items
**When** the page renders
**Then** an empty state reads "Nothing listed yet"

**Given** a Member has no bio and no links
**When** the page renders
**Then** the bio and contact sections are hidden entirely — no empty-state placeholder copy

**Given** a Member has no explicitly joined Communities
**When** the page renders
**Then** the Communities section is hidden entirely

### Self-view

**Given** the authenticated Member views their own page
**When** the page renders
**Then** an "Edit profile" button and an "Add new Item" button (linking to `/new`) are visible; each Item card shows an "Edit" action

### OG metadata

**Given** the Member page is shared via direct URL
**When** a link preview is generated
**Then** OG title = "[Member display name] on Main Street Market", description = bio excerpt or first Item title, image = avatar or first Item photo

## Acceptance Criteria

- [ ] Page renders for authenticated and unauthenticated visitors without redirect
- [ ] Items are grouped by `brand_label`; Items with no brand label appear under the Member's display name
- [ ] Within each group, Items sorted by kind then `created_at` descending
- [ ] Only explicitly joined Communities (`source='explicit'`) appear in the Communities chips section
- [ ] Old `/vendors/[slug]` redirects to `/p/[member-slug]`
- [ ] Soft-deleted Items do not appear
- [ ] Self-view shows Edit profile, Add new Item, and per-Item Edit actions
- [ ] Bio, links, and Communities sections hidden (not empty-state) when not set
- [ ] OG metadata rendered server-side

## Out of Scope

- Member-to-Member direct messaging (b2)
- Endorsements (b2)
- Stakeholder dashboard / analytics (b3)
- Follow-the-Member surface (follows are on Items, not Members at b1)
