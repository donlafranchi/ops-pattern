# T108: Unified follows reader + `/you` "Following" summary (card scroll)

**Scenario:** `planning/next/scenario-F042-member-follows-producer-group-venue.md`
**Status:** Complete
**Bundle:** b1
**Depends on:** none (all three follow substrates + handlers shipped: T091 member-follow, T102 saved-search, T070 group-membership)

**Serves:**
- **Loop:** 8 (Follow what you love) — "I found something I like — I want to stay connected without effort." This ticket delivers the at-a-glance surface that makes following visible on the Member's home base.
- **Canonical example:** [C1 — A member searches for what's nearby and follows what they love](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) — the follow-everything-you-love side of the search→follow loop.
- **Primitive shape:** Person → {Person (`member_follows`), Group (`group_memberships`), Location (`member_saved_searches`)}. No shell entity — each follow points at a real primitive.

## Workflow gates (mandatory during rebuild phase)

- [x] **M2 — `code-review` (high)** invoked on the diff before commit. Verdict: Approve.
- [x] **M3 — `design:accessibility-review`** — WCAG 2.1 AA PASS (card a11y; repeated-control fixes landed in T109's manager).
- [x] **M4 — `engineering:deploy-checklist`** — N/A; no migration (pure read + UI).
- [x] **DEVIATIONS entry** appended at ticket close — `development/deviations/T108.md` (3 deviations + 1 SPEC-PATCH).

## Acceptance Criteria

### Unified follows reader (shared by this ticket and T109)

- [ ] Create a server-side reader `getMemberFollows(memberId)` in `web/src/lib/follows/` returning a normalized list of `{ kind: 'person' | 'group' | 'venue', entityId, displayName, thumbnailUrl | null, createdAt, href, isTombstone }`, unioning three sources:
  - People: `member_follows` WHERE `follower_member_id = memberId` AND `unfollowed_at IS NULL` → join display data via the same Member-display resolver F032 uses (`member_public_discoverability` projection + members row).
  - Groups: `group_memberships` WHERE `member_id = memberId` AND `left_at IS NULL` AND `source = 'explicit'` → join `groups` (name, image).
  - Venues: `member_saved_searches` WHERE `member_id = memberId` AND `removed_at IS NULL` AND `location_id IS NOT NULL` → join `locations` (label, image).
  _Why: one reader, two surfaces — review-F042 § Recommendations notes `/you` and `/you/following` share the same data queries; centralizing the union prevents the substrate distinction from leaking into two divergent query paths. The `source = 'explicit'` filter on Groups encodes the ratified addressability distinction (groups.md:393, Ratified 2026-05-31) — soft-suggested memberships (`source='soft_via_*'`) are not follows._
- [ ] The reader runs as the authenticated Member reading their own rows — no SECURITY DEFINER / RPC needed.
  _Why: `member_saved_searches` is owner-only RLS (`member_id = auth.uid()`, member.md:368, Ratified 2026-05-23); `member_follows` is public-read (member.md:279); `group_memberships` readable by the member. All three are directly selectable by the owner — no privilege escalation required._
- [ ] A followed Person who is non-discoverable or soft-deleted resolves to a tombstone row (fallback display name + no thumbnail, `isTombstone: true`) — never an error, never a 404.
  _Why: scenario edge case "Followed Member soft-deletes → row stays as tombstone." Reuse the F032 attribution resolver's discoverability handling rather than rolling new logic._

### `/you` "Following" summary section

- [ ] Add a "Following" section to the existing `/you` page (the post-signup landing surface, F030). Renders a horizontal card scroll of follows from `getMemberFollows`, **mixed across kinds, most recent first** (`ORDER BY createdAt DESC`).
- [ ] Each card shows the entity's `displayName` + `thumbnailUrl` (or a kind-appropriate placeholder when null/tombstone). Card links to the entity's `href`.
- [ ] A "More" text link at the end of the scroll navigates to `/you/following`.
  _Why: matches existing `/you` section patterns (review-F042 § CTA placement) — standard text-link, no new DLS entry needed for the link itself._
- [ ] When the Member has zero follows, the "Following" section is omitted entirely from `/you` (the empty-state with explore CTA lives on `/you/following`, per T109).

### DLS recipe

- [ ] Add a **horizontal card scroll** recipe to `product/ui/design-language.md` (inline, not a blocking gate per review-F042 § Design verdict): scroll container, card dimensions, snap behavior, overflow affordance, "More" terminal link.
  _Why: review-F042 § Components flags the card scroll as a common pattern not yet in the DLS; capturing the recipe here keeps the next horizontal-scroll surface consistent._

### Tests

- [ ] Test: `getMemberFollows` unions all three substrates and orders by `createdAt DESC` (mixed kinds interleave correctly).
- [ ] Test: `getMemberFollows` excludes `unfollowed_at`/`left_at`/`removed_at` non-null rows and `source != 'explicit'` group rows.
- [ ] Test: `getMemberFollows` excludes saved-searches with `location_id IS NULL` (place-only / tag-only searches are not venue follows).
- [ ] Test: a non-discoverable followed Person renders as a tombstone (no thumbnail, fallback name, no throw).
- [ ] Test: `/you` "Following" section renders cards most-recent-first with a "More" link; omitted when zero follows.

### Build artifact

- [ ] BUILD-LOG.md updated with T108 status.

## Notes

- **Reuse, don't rewrite.** The follow/unfollow/leave writes already exist — this ticket is read-only plus the `/you` summary UI. The unfollow/leave affordances live in T109.
- **Member-display resolver:** F032/T092 already resolves a Member's public display data with discoverability + tombstone handling (post-T095 default-private). Reuse it for the People cards — don't re-implement the discoverability branch.
- **Venue follow rows** are `member_saved_searches` with `location_id` populated; `label` holds the venue name (set by T102's `<FollowVenueButton>`). Use `label` as the display name fallback, the joined `locations.label` as primary.
- **Encodes ratified absolutes:** `member.md:368` (owner-only saved-search RLS, Ratified 2026-05-23); `member.md:279` (follow public-read, ratified); `groups.md:393` (`source='explicit'` addressability, Ratified 2026-05-31). All read-only reuse — no new absolute introduced.
- **No migration.** Pure surface work over shipped substrate (review-F042 § Schema fit: no new tables/columns/events).

## Completion

Date: 2026-06-18
Commit: 16453ca (web) · merged to main via 7406384
Tests: 12 new vitest GREEN (get-member-follows ×9, FollowingSummary ×3). lint + tsc + check:action-layer clean.
Deviations: development/deviations/T108.md — (1) isomorphic reader (takes SupabaseClient, not server-only); (2) Group/Venue hrefs use slug-only short path `/p/g/[slug]` `/p/l/[slug]` (no forward place-path resolver exists) → SPEC-PATCH SP-2026-06-18-group-venue-canonical-href; (3) Group/Venue cards have no thumbnail (no image column in schema).
Gates: M2 Approve · M3 WCAG 2.1 AA PASS · M4 N/A (no migration).
Note: shipped together with T109 on branch t108 (shared reader; review-F042 recommended one ticket).
