---
purpose: Backlog scenario — a member tunes their awareness scope by adding/removing/promoting secondary Place-interests.
layer: how
status: draft
---

# F031: A member manages their place-interest scope

**Bundle:** b1
**Loops:** 1 (Find your people), 3 (Land here), 4 (Gather regularly), 8 (Follow what you love)
**Canonical example:** [C2 — A member organizes awareness across multiple Places](../../product/needs/use-cases.md#c2-a-member-organizes-awareness-across-multiple-places) — the Oak-Park-resident-who-works-in-Folsom situation.
**Primitive shape:** Person → `member_place_interests`(primary + ≤5 secondary) × `member_interests` → community-awareness feed × Place-hierarchy traversal. Per ADR-21.
**Status:** backlog
**Replaces:** F029 (archived 2026-05-28 — drop persona; structurally sound, mostly a name scrub).

## The Person

Someone who lives in one Sacramento neighborhood and routinely cares about another — works in Folsom and lives in Oak Park, or weekends at the river and weekdays downtown. They want their awareness feed to reflect both, without manually following every venue, Group, and producer in each.

## The Story

From any page, they tap their avatar → "Locality." The `/you/locality` page shows their `primary_home` Place at the top with a granularity control (neighborhood ↔ city), and below that, a list of secondary Place-interests with add/remove controls. Up to five secondaries; the action layer enforces the cap.

They tap "Add a Place," search for "Folsom," and select it. The feed now includes Folsom Items the next time they visit `/`. To promote Folsom to their primary, they tap "Make primary" — Oak Park atomically demotes to secondary, the unique-primary-home invariant holds. To change Oak Park's granularity from neighborhood to city, they tap the granularity control on the primary row.

The page also shows their current metro-polygon (per ADR-24) and a "Show me everything in Greater Sacramento" opt-in — when on, the feed widens to the metro CSA; when off, it stays at Place-interest scope only.

## Surfaces

- **Entry point:** `/you/locality` — reachable from any page via the You / avatar menu.
- **Primary action:** "Add a Place" (writes a secondary `member_place_interests` row).
- **Composer / interaction:** Place search picker (typeahead over `places`), granularity selector on primary row, metro-polygon opt-in toggle, promote/demote/remove controls on each row.
- **Completion:** Stays on `/you/locality` after each action; feed at `/` reflects the new scope.
- **Discovery:** N/A — surface is private to the Member.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| Home (primary) Place | `member_place_interests(scope_kind='primary_home', place_id=...)` (unique partial index) | yes (one row) |
| Other Places I care about | `member_place_interests(scope_kind='secondary', place_id=...)` × N | optional (cap 5) |
| Wider-scope opt-in | `members.metro_scope_opt_in` (or equivalent — wire to `home_metro_id` lookup) | optional, default off |

Implicit: `member.place_interest_added` / `.removed` / `.promoted` / `.demoted` events with `acting_member_id`.

## Acceptance Criteria

### Add a secondary Place

**Given** a Member with one `primary_home` Place
**When** they search a Place and tap "Add"
**Then** a new `member_place_interests` row writes with `scope_kind='secondary'`; the row count for that Member's secondaries is now N+1; `member.place_interest_added` event logs.

### Cap on secondaries enforced

**Given** a Member with 5 secondary Places already
**When** they attempt to add a 6th
**Then** the UI blocks the add with a clear message ("You can follow up to 5 other Places — remove one first to add this one"); no row writes; no event logs.

### Promote a secondary to primary (atomic swap)

**Given** a Member with primary Oak Park and secondary Folsom
**When** they tap "Make primary" on Folsom
**Then** in a single transaction: Folsom row flips to `scope_kind='primary_home'` + Oak Park row flips to `scope_kind='secondary'`; unique-primary-home invariant holds throughout; two events log (`.promoted` + `.demoted`); the feed re-renders on next visit.

### Change primary granularity

**Given** a Member with primary `primary_home = Oak Park (neighborhood)`
**When** they tap granularity control → "City: Sacramento"
**Then** the `place_id` on the primary row updates to the parent `places` row of kind='city'; feed widens accordingly.

### Metro-polygon opt-in widens the feed

**Given** a Member whose home coordinates resolve into a `metro_polygons` row (`members.home_metro_id` populated)
**When** they toggle "Show me everything in Greater Sacramento" on
**Then** the feed query union-includes Items whose Locations are ST_Contains'd by the metro polygon, in addition to Place-interest scope.

### Metro opt-in graceful fallback for rural Members

**Given** a Member whose home coordinates do NOT resolve into any `metro_polygons` row (`home_metro_id` IS NULL)
**When** they view the `/you/locality` page
**Then** the metro-opt-in control surfaces a disabled state with an explanation ("Your home isn't inside any of our metro areas — try widening your primary scope to your county or state").

## Edge Cases

- **Promote with no secondaries:** "Make primary" control hidden; nothing to swap.
- **Last secondary removed:** primary remains; no row goes to zero count for primary_home.
- **Secondary added that's already the primary:** rejected at write — same Place can't be both primary and secondary for one Member.
- **Member changes primary Place that's the parent of an existing secondary:** secondary stays as-is (the data model allows redundancy; the feed dedupes at query time).

## Assumptions

- ADR-24 ratified → `metro_polygons` table + `members.home_metro_id` + Census CSA seed shipped (substrate ticket).
- Phase 1 `member_place_interests` table + action handlers shipped (T058–T066).
- `places` table populated to neighborhood depth for Sacramento at minimum.

## Out of Scope

- Cross-Place navigation filters in the feed (e.g., "show me only Items from Oak Park, not Folsom this morning") — deferred to b2.
- Place-interest aggregate insights ("you spent the most attention on Folsom this month") — deferred to b2.
- Sharing Place-interest scope between Members — never planned.
- The saved-search composer surface (`/you/saved-searches`) — b2 per ADR-21 + use-cases.md C2 deferral note.

## Capabilities unlocked

- **1. Presence & Findability** — Items appear in the awareness feed via place-interest × interest-tag matching, now scoped to multiple Places + optional metro polygon.
- (Consumer-facing — the capability shape lives in the Consumer baseline note in `use-cases.md`, not in the producer taxonomy.)
