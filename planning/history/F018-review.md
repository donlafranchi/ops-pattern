---
purpose: Architecture and design pre-flight verdict on F018.
layer: how
status: reference
---

# F018 review — Brian declares the Run Club

**Scenario:** [`planning/scenarios-backlog/F018-brian-declares-run-club.md`](../scenarios-backlog/F018-brian-declares-run-club.md)
**Reviewer:** pipeline-review
**Date:** 2026-05-18
**Bundle:** b1
**Verdict:** **REVISE** (scenario-side fixes) + small **EXTEND** notes on `item.md` and `design-language.md`

> **Status update 2026-05-18 — scenario deferred.** Per PM decision: F018 moved back to `planning/scenarios-backlog/` and will not be promoted until the b1 implementation plan recommends pulling it in. The REVISE/EXTEND punch list below stands as the rewrite spec. T045–T049 (Phase 1 schema tickets) do not depend on F018; they open against system specs directly.

> **Supersedes the 2026-05-08 PROCEED review** (preserved in git history). That review predated the 2026-05-11 platform-wide naming pass (gathering → Event, `/i/` → `/e/`), the Groups consolidation (ADR-13, 2026-05-10), the Location spec landing (ADR-14, 2026-05-10), and the clean-slate rebuild (ADR-19, 2026-05-10). F018's body text was not refreshed against the naming pass; this review names the deltas.

## Verdict summary

The scenario fits the Item primitive, the gathering child table, the Location primitive, and the venue-page surface pattern cleanly — the architecture-side substrate is in place. Two scenario-text inconsistencies need correction before tickets land (URL prefix and one user-language label), and two small doc-extends close gaps that the original 2026-05-08 review did not yet surface.

**Next skill:** `pipeline-plan` for the scenario REVISE (URL prefix, one label); a quick `pipeline-product` pass on `item.md` (state-enum reconciliation) and `design-language.md` (Share-link + kind-picker + gathering Item-page render). Then re-confirm here.

## Architecture check

### Systems touched

- [`product/systems/item.md`](../../product/systems/item.md) — spine + `item_gatherings` child + `item_locations` + `item_hashtags` + event log (`item.created`, `item.published`).
- [`product/systems/location.md`](../../product/systems/location.md) — Drake's as a `kind='permanent'` Location; venue-page primary CTA path.
- [`product/systems/member.md`](../../product/systems/member.md) — authenticated Member; `items.member_id` ownership.
- [`product/systems/groups.md`](../../product/systems/groups.md) — explicit `group_id = null` (Run Club is not a Group at b1; emergent later via `kind='event_anchored'`).
- [`product/capabilities/event-host.md`](../../product/capabilities/event-host.md) — the T1 capability F018 is the canonical example of.

### Schema fit

| Concern | Status | Notes |
|---|---|---|
| New tables required? | none | All needed tables (`items`, `item_gatherings`, `item_locations`, `item_hashtags`, `item_events`, `discoverable_items` view) are in [`planning/rebuild-plan.md`](../../planning/rebuild-plan.md) Phase 1. |
| New columns required? | none | Every scenario field maps cleanly to columns in the spine + `item_gatherings` + relations tables. |
| New event types required? | none | `item.created` and `item.published` are both already specified in `item.md`. |
| Forward-tier impact | clear | T2 RSVP (`item_responses.response_kind='rsvp'` reserved at b1), T2 Group attachment via `items.group_id`, T2 sub-venue (Drake's barn via `parent_location_id`), T2 photo upload (column reserved), T2 follower fan-out on `item.published` — all sit cleanly on top of what F018 builds. |
| Shell-entity smell | clean | No `vendor`, `business`, `merchant`, or `operator` shell. The Item belongs to a Member (Brian); the Location belongs to a Member-of-record stewardship relation (not "owned" by Drake's the entity). People-first compliance is structural. ✓ |
| Loop fidelity | matched | Loop 1 pain: *"the Run Club that meets Thursdays at Drake's. Currently, the only way to find these groups is to physically be there and ask, then chase them across Strava, Instagram, and WhatsApp."* Loop 4 pain: *"an organizer who is already convening something... wants to make their group findable, persistent, and easy to point newcomers to."* F018 produces *exactly* the public, locality-first, URL-shareable gathering page both loops describe. ✓ |
| Policy posture present | n/a — no new surface | F018 publishes an Item (public-by-default at `state='published'`), attaches to a Location (`discoverability='listed'` default), and surfaces in the locality-first index. No new policy posture is introduced; the existing posture in `item.md` / `location.md` / `policy.md` covers this. ✓ |

**One spec-side inconsistency to flag (upstream, not blocking F018 by itself):** `item.md` line 99 declares `state` enum as (`active`, `fulfilled`, `withdrawn`, `closed`) — but lines 128–136 introduce `state='draft'` → `state='published'` semantics with a `publish_item()` helper. F018's acceptance criterion writes `state='published'`. The enum and the publish-event semantics need to be reconciled in `item.md` before T036/T038 can land a typed schema. **Recommend a quick `pipeline-product` micro-edit on `item.md`** to merge the two state shapes — e.g., enum becomes (`draft`, `published`, `fulfilled`, `withdrawn`, `closed`) or splits into two columns (`lifecycle_state` vs `operational_state`). This is a 10-minute doc fix; flagging here so ticket writing doesn't choke on it.

### Cross-system consistency

- **Item × Location.** F018 uses `item_locations` to attach Drake's. `location.md` line 188 confirms `item_locations` is the canonical join. ✓
- **Item × Member.** `items.member_id` references Brian; `member.md` is the home for the Member primitive; F018 expects authenticated Member. ✓
- **Item × Group.** F018 explicitly sets `group_id = null`. `groups.md` confirms `items.group_id` is nullable and emergent. The Run Club regulars can become a `kind='event_anchored'` Group later via a separate scenario; F018 correctly does not force this. ✓
- **Item × Discovery.** `discoverable_items` synchronous refresh on `item.published` is already specified in `item.md` lines 128–136. The 60-second locality-surface SLA F018 implies rides on this. ✓
- **Venue page CTA.** "Host something here" on `/l/[slug]` is now a documented `design-language.md` surface pattern (added in the 2026-05-08 review cycle; still present). ✓
- **Hashtag autocomplete.** `GET /api/hashtags/suggest?q={prefix}` is documented in `item.md` line 139. The composer uses this. ✓

### Architecture verdict

**PROCEED on F018**, with one upstream micro-fix flagged: reconcile `item.md`'s `state` enum with the publish-event semantics before tickets encode the schema.

## Design check

### Surfaces touched

- `/l/[slug]` (Drake's venue page) — existing, fully specced in `design-language.md` § Surface patterns: Venue page. ✓
- `/e/[slug]` (Event page, recurring gathering) — listed in `design-language.md` line 200 but only sketched ("quiet header, title in 26px slot, kind-specific detail rows below"). The recurring-gathering specifics (next-occurrence string, recurrence summary, map pin, hashtag chips, Share-link affordance) are not specced as components. **EXTEND.**
- `/h/[hashtag]` (hashtag page) — existing per `design-language.md` line 201. ✓
- Locality-first index home — out of F018's scope; the surface exists.

### Components required

| Component | Exists in design language? | Notes |
|---|---|---|
| Venue-page primary CTA "Host something here" | **yes** (Surface patterns: Venue page) | Reuse. |
| Recurrence picker | **yes** (Component recipes: Recurrence picker) | Reuse — emits RRULE, friendly inputs. |
| Gathering composer drawer | partial | The composer is *referenced* in `design-language.md` line 183, but the drawer's full layout (kind-picker row → fields-by-kind reveal → publish CTA) is not specced. **Add a "Gathering composer" component recipe** capturing layout, the three-option kind picker, the per-kind field reveal, and the publish CTA. |
| **Kind picker** (one-time / recurring / open meetup segmented control) | **no** | New component. Mirrors the existing Frequency segmented control pattern. **EXTEND** `design-language.md` Component recipes with a "Composer kind picker" entry: three options in user language, segmented-control treatment, drives field-reveal behavior. |
| **Share-link affordance** (Event page) | **no** | Referenced in `event-host.md` line 24 and in F018, but not specced in `design-language.md`. **EXTEND** with a "Share link" component recipe: button label, clipboard-copy on desktop, `navigator.share()` invocation on mobile when supported, toast confirmation on copy. |
| Hashtag chip (clickable, navigates to `/h/[hashtag]`) | partial | The chip recipe exists; navigation behavior on click should be documented in the chip recipe or in the Event-page surface pattern. Minor. |
| Map pin / mini-map on Event page | not in design-language.md | Used by the Event page header. Document the surface treatment (size, zoom, fallback) — could be a one-liner under the new Event-page surface pattern. |
| "What's happening here" list-row on venue page | partial (line 188 names the section + empty-state) | Row layout (title, next-occurrence chip, hairline separator) not specced. Minor — could be specced inside T037 if not landed first. |

### CTA placement

| Surface | CTA | Established pattern | Match? |
|---|---|---|---|
| Venue page (`/l/[slug]`) | "Host something here" | `design-language.md` Surface patterns: Venue page — single primary-accent button below the header. | **yes** |
| Event page (`/e/[slug]`) | "Share link" | No primary-CTA pattern for Event page documented in `design-language.md` beyond "kind-specific detail rows." The Share-link affordance needs a placement decision — sticky-bottom on mobile (per CTA pattern #5) or inline near the title? **Specify in the EXTEND pass.** | n/a (gap) |

### Copy & tone

- **"Host something here"** — verb-first, surface-anchored. ✓ Matches CLAUDE.md naming-conventions rule 3 + 4.
- **"Share link"** — utilitarian, clear. ✓
- **Kind-picker labels — REVISE.** F018 line 17 says: *"a one-time event, a recurring gathering, or an open meetup."* This mixes user-language nouns: "event" (matches the UI-label naming-table for `kind='gathering'`) and "gathering" (schema vocabulary that should not appear in UI per CLAUDE.md naming rule 1 + the 2026-05-11 platform-wide naming pass). The capability spec [`event-host.md`](../../product/capabilities/event-host.md) line 13 says *"one-time, recurring, open meetup"* — no umbrella noun, which is cleaner. **Recommend F018 harmonize with `event-host.md`: drop "event/gathering" from the picker labels and use "one-time / recurring / open meetup" (or "one-time event / recurring event / open meetup" if a noun is needed — but never "gathering").**
- No pro-competition vs. corporate-greed framing concerns here — F018 is feature-shaped, not framing-shaped. ✓

### URL prefix — REVISE

F018 references `/i/unofficial-run-club-drakes` (lines 21 and 28). Per CLAUDE.md § Naming conventions and `event-host.md` (renamed 2026-05-11), the canonical URL for a gathering Item is `/e/[slug]`. `/i/[slug]` is reserved for `kind='wonder'` (Idea). **Replace every `/i/` reference in F018 with `/e/`** — this is a stale-text artifact from before the 2026-05-11 naming pass; the underlying schema is unchanged.

### Empty / loading / error states

F018 covers slug collision, past-recurrence validation, and unauth-then-return — those are good. Not yet specified (recommend the ticket writer cover):

- **Composer submit loading state** (spinner + "Publishing…" copy) — Minor.
- **Network failure on publish** (retry + error toast) — Minor.
- **"What's happening here" empty state on Drake's venue page** — already specced in `design-language.md` line 188 ("Nothing scheduled here yet. Be the first."). The ticket should echo this string. ✓
- **Event page render between publish and view refresh** — `item.md` says synchronous at b1 (no gap), so no special handling needed. Worth a one-line confirmation in the ticket. ✓

### Design verdict

**EXTEND** — three small additions to `design-language.md` (Composer kind picker, Share-link affordance, Event-page recurring-gathering surface pattern) plus a copy/URL revise on F018 itself.

## Recommendations for the ticket writer

If verdict resolves to **PROCEED** after the small extends/revises:

- **Reuse, don't reinvent.** The venue-page surface pattern, the recurrence picker, the action button, the hashtag chip, and the composer drawer are all documented. Reference, don't redefine.
- **Honor the URL prefix** `/e/[slug]` — not `/i/[slug]`. The capability spec is the source of truth.
- **Tickets sequence (from the 2026-05-08 trace, still broadly correct — but `state` enum reconciliation lands first):**
  1. `T0XX` — `item.md` state enum reconciliation (`pipeline-product` micro-edit, then `pipeline-intent-check`).
  2. `T0XX` — `design-language.md` extensions (kind picker, Share-link, Event-page surface).
  3. `T0XX` — F018 scenario revise (URL `/i/` → `/e/`, kind-picker labels) via `pipeline-plan`.
  4. `T036` — `item.published` event handler + `discoverable_items` refresh trigger.
  5. `T037` — `/l/[slug]` venue page "Host something here" CTA wiring.
  6. `T038` — Gathering composer drawer (kind picker + recurrence picker + fields + slug + validation + `item.published` emit).
  7. `T039` — `/e/[slug]` Event-page render (title, recurrence summary, next-occurrence, map pin, hashtag chips, Share-link affordance).
  8. `T040` — `discoverable_items` filter on `kind='gathering'` for "this week" surfaces (venue-page "What's happening here" list, locality-index this-week filter).
- **Test data.** Add a fixture for a `kind='permanent'` Location named "Drake's" in West Sacramento so eval-write has a stable seed.
- **Mandatory gates per rebuild-phase rules in CLAUDE.md:** `engineering:code-review` on every shipped ticket *before* commit (M2 pulled left); `design:accessibility-review` on T037 and T039 (new surface render); `pipeline-intent-check` before the `item.md` state-enum micro-edit lands; `DEVIATIONS.md` entry on every ticket close.

## Decisions captured

No new ADR. Two small spec-doc edits to land before ticket writing — neither rises to ADR-grade:

1. `item.md` — reconcile the `state` enum at line 99 with the `draft`/`published` semantics introduced at lines 128–136. Pick one shape (either a unified enum that includes `draft` + `published`, or two columns split by concern), and update both passages to match.
2. `design-language.md` — add three component recipes:
   - **Composer kind picker** (segmented control with one-time / recurring / open meetup; drives per-kind field reveal in the composer).
   - **Share-link affordance** (button label, clipboard-copy on desktop, native share sheet on mobile, toast confirmation).
   - **Event-page (recurring gathering) surface pattern** — header (title, next-occurrence chip), recurrence-summary line, map-pin row, hashtag-chip row, Share-link CTA placement.

And one scenario-side edit:

3. F018 — replace `/i/` with `/e/` throughout (canonical URL for `kind='gathering'`); harmonize the kind-picker labels with `event-host.md` (`"one-time, recurring, open meetup"` — no "gathering" in UI copy).
