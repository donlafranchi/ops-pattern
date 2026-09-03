---
purpose: Scenario — redesign You tab from management/recruitment panel to personalized return-visit surface, grounded in design-research-thesis.md.
layer: how
status: backlog
---

# F047: Member opens You and sees what's coming up from what they care about

**Bundle:** b1
**Sub-bundle:** integration-test prep (post b1.4 — rearchitects the You tab around the return-visit loop)
**Work-map item:** Extends the checked "See everything they follow" item (F042). The current F042 surface shows a list of followed entities; F047 replaces the You tab's dominant content with a feed of *upcoming content from* those entities plus RSVP'd events. Suggest updating the checklist with a "You tab shows what's coming up from follows + RSVPs" line.
**Loops:** 8 (Follow what you love — this is the primary return-visit loop), 3 (Land here — personalized locality), 4 (Gather regularly — return attendance)
**Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love)
**Primitive shape:** Person → `member_follows` + `item_responses` + `member_saved_searches` + `member_interests` → upcoming Items (no schema change — reads from existing b1 substrate)
**Spec contract:** design-research-thesis.md §2 (You — "My stuff"), §6 (Create lives on /you), appendix (You checklist); community-platform.md § You T1
**Status:** backlog

> **PM decision — navigation pattern (ratified 2026-09-02 via `weigh`).**
> PM ratified Option B: the three-tab bottom nav stays; a category-based top slider within Home ships at b2. This scenario proceeds as written — You tab redesign within the 3-tab bottom nav. The top slider is Home-only and does not affect the You tab. Nav proportions shrink from 52px to 44px (thesis §2 updated). See `decision-surfaces.md` § TikTok top-slider pattern for the full ratification.

> **Spec evolution note.** The thesis defines You as "My stuff. Identity, follows, Groups, selling tools, settings" (§2) and its appendix checklist specifies: profile section at top, follow strips with section headers and "More →" links, "Create something" card, Sell CTA, settings/sign-out at bottom. community-platform.md defines You as "Manage me" (settings, follows, seller tools). This scenario layers a "Coming up" feed on top of the thesis structure — the feed doesn't replace the thesis elements, it becomes the primary content that makes the tab worth opening daily. The recruitment pitch ("We're looking for makers…") is removed; it belongs on Explore's empty state, not the member's personal tab.

## The Person

A C1 member who has been on the platform for two weeks. They followed Maya's bakery (a kind='business' Group), RSVPed to the Run Club gathering at Drake's, and followed Drake's as a venue. They open the app on Thursday morning to see what's coming up.

## The Story

The member taps You. The page structure follows the thesis appendix:

**Profile section at top** — display name and avatar, not email. A gear icon at top-right opens settings.

**Coming-up feed** — the primary content. Cards for upcoming activity drawn from follows, RSVPs, and interests:
- "Run Club at Drake's — tonight, 6pm" — an RSVP'd gathering, rendered as a reminder.
- "Maya posted a new product: Rosemary Sourdough" — a followed producer's new Item.
- "New event at Drake's: Barn Movie Night, Saturday 8pm" — a followed venue's new gathering.

**Follow strips** — horizontal scroll rows with section headers ("FOLLOWING") and "More →" links per thesis appendix. The F042 surface, now secondary to the feed.

**Create-something entry point** — per thesis §6: a secondary-style card or button. If the member has no business Group, it reads "Start selling" or "Host an event." If they have a Group, it reads "Add a product" or "Host another event."

**Conditional Seller section** — renders when the member has ≥1 active kind='business' Group membership or product/service Items. List/edit Items, followers count.

**Settings/sign-out at bottom** — locality control, notification preferences, privacy, data export, sign out. Accessible via gear icon at top or by scrolling to the bottom.

The recruitment pitch is gone. Empty category slots are gone.

## Surfaces

- **Entry point:** You tab (`/you`)
- **Primary content:** "Coming up" feed of upcoming Items from followed entities + RSVP'd events, sorted by temporal proximity (soonest first)
- **Follow strips:** Horizontal card scroll rows per thesis appendix — "People," "Groups," "Venues" with "More →" links to the F042 management page
- **Create entry point:** Secondary-style card per thesis §6
- **Conditional Seller section:** Per community-platform.md C10
- **Settings:** Gear icon at top-right; full settings at bottom of page
- **Removed:** Email display at top, "Your Market" (not set), recruitment pitch, empty category slots

## Data Captured

No new data or tables. Reads from existing b1 substrate:

| Source | What it provides |
|---|---|
| `member_follows` | Members, Groups, Locations the member follows → fetch their recent/upcoming Items |
| `item_responses` (type='rsvp') | Gatherings the member RSVPed to → show upcoming ones as reminders |
| `member_saved_searches` | Venue follows → fetch new Items at those Locations |
| `member_interests` | Interest tags → rank/filter the feed by relevance |
| `discoverable_items` | The read surface for upcoming Items, filtered by follow graph |

## Acceptance Criteria

### Member identity replaces email display

**Given** the member opens the You tab
**When** the page renders
**Then** the top of the page shows the member's display name and avatar (not their email address). A gear icon at top-right opens settings. _Why: thesis appendix specifies "Profile section at top." Email is an auth credential, not an identity._

### Coming-up feed shows upcoming Items from follows

**Given** the member follows at least one producer, Group, or venue
**When** the You tab renders
**Then** a "Coming up" section shows cards for upcoming Items (gatherings with future dates, recently posted products/services) from followed entities, sorted by temporal proximity (soonest event first, then most-recent posts). _Why: Loop 8 (Follow what you love) is the return-visit loop. The You tab is where follows pay off — "here's what's new from the people and places you chose to care about." The thesis defines You as "My stuff" — the feed surfaces what the member's stuff is doing._

### RSVP'd events appear as reminders

**Given** the member has RSVPed to a gathering that hasn't happened yet
**When** the You tab renders
**Then** a card for that gathering appears in the Coming-up feed with its next occurrence date/time, styled as a reminder (e.g., "Tonight, 6pm" or "This Saturday"). _Why: RSVP'd events are the highest-intent signal. Surfacing them as reminders reinforces Loop 4 (Gather regularly)._

### Follow strips render as horizontal scroll rows

**Given** the member has followed entities
**When** the You tab renders
**Then** below the Coming-up feed, follow strips render as horizontal card scroll rows with section headers in Micro style (11px/600, uppercase, charcoal-500, 0.3px tracking per thesis §4) and "More →" links. _Why: thesis appendix specifies "Follow strips (horizontal scroll) with section headers and 'More →' links." The strips are the reference surface ("who do I follow"); the feed is the payoff ("what they're doing")._

### Create-something entry point is present

**Given** the You tab is loaded
**When** the page renders
**Then** a "Create something" entry point (secondary button style, no accent fill) appears in the appropriate section. If the member has no business Group, copy reads "Start selling" or "Host an event." If they have a Group, copy reads "Add a product" or "Host another event." _Why: thesis §6 — "The /you page gets a prominent 'Create something' card... CTA copy is kind-aware." Create left the bottom nav (thesis §6); this is one of its two new homes._

### Empty state invites action, not recruitment

**Given** the member follows nobody and has no RSVPs
**When** the You tab renders
**Then** the Coming-up section shows: "Follow producers, groups, or venues to see what's coming up here." with a CTA linking to Explore. No recruitment pitch, no empty category slots. _Why: the empty state guides the member toward the behavior that populates this surface (following), not toward becoming a seller. Thesis §9 #9: "Calm over engagement. No engagement bait."_

### Recruitment pitch is removed from You

**Given** the You tab is loaded
**When** the page renders
**Then** no "We're looking for makers in Sacramento" pitch, no Clara's Kitchen example, no open category grid appears anywhere on the You tab. _Why: the recruitment pitch serves platform supply-side goals, not the member's return-visit goal. Principles.md people-first commitment._

### Seller section renders conditionally (unchanged)

**Given** the member has ≥1 active kind='business' Group membership or any product/service Item
**When** the You tab renders
**Then** the conditional Seller section renders between the Coming-up feed and the follow strips. _Why: per community-platform.md C10 — selling tools appear when the member is selling. Position in page hierarchy shifts but behavior is unchanged._

### Settings move behind gear icon

**Given** the You tab is loaded
**When** the member taps the gear icon at top-right
**Then** a settings page or drawer opens with: locality control, notification preferences, privacy controls, data export, and sign out. _Why: thesis appendix — "Settings/sign-out at the bottom." Settings are used infrequently; a gear icon keeps them accessible without consuming daily-visit space._

## Edge Cases

- **No upcoming Items from follows:** feed shows the most recent Items from follows (falling back to recency) with a note: "Nothing upcoming — here's what's recent."
- **Many follows, many Items:** paginate the Coming-up feed to 20 Items, with "Show more" at bottom.
- **Member follows only venues:** feed shows upcoming events at those venues — works for any follow type.
- **Desktop viewport:** same layout, wider cards and follow strips.

## Assumptions

- `member_follows`, `item_responses`, `member_saved_searches`, and `discoverable_items` are all shipped at b1.
- The F042 Following list surface is already built and merged.
- The conditional Seller section logic exists (per community-platform.md C10).
- The Coming-up feed is a simple query — reads from follows + RSVPs + saved searches, sorted by date. No ML ranking at b1.

## Out of Scope

- TikTok-style top-slider navigation pattern (ratified 2026-09-02 as Home-only category sub-nav at b2 — separate scenario when b2 scoping begins).
- Personalized ranking algorithm (b3 per community-platform.md T3).
- Push notifications for upcoming events (b2).
- "Producers you repeatedly buy from" as a distinct section — commerce is off-platform at b1; follows are the b1 proxy for affinity.
- DM inbox on You (b3).
- Activity log / participation history (b3).

## Capabilities unlocked

- **Presence & Findability** — the return-visit surface makes follows actionable. A member who followed a producer or venue now has a reason to open the app again (the b1 success metric: return-visit rate).
