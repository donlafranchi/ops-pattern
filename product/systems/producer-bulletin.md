# System: Producer Bulletin

**Purpose:** Let a Member operating in producer capacity broadcast a message to all the Members who follow them — the "Substack-light" surface that makes following a producer *worth doing*. Without it, follow is a passive bookmark; with it, follow becomes a subscription to a relationship. A producer Member with 200 followers and a weekly bulletin ("sourdough back tomorrow, croissants Sunday") beats a chain's billboard for that audience every time; the bulletin is what closes that loop.

**Bundles:** b2 (T1), b3 (T2/T3). No b1 surface; the follow substrate (`member_follows` per [`member.md`](member.md)) lands at b1, the bulletin compose/deliver surface ships at b2.

**North stars served:** Loop 5 (Subscribe), Loop 7 (Recur), Loop 8 (Follow), Loop 12 (Trust at scale). The bulletin is the recurring contact that turns one-time discovery into a sustained relationship.

## What Producer Bulletin Is and Why It Matters

A bulletin is a Member-authored broadcast to that Member's followers. Authorship is always a Member, never a Group — relationships on this platform are between people, never between people and corporate shells (per [`people-first.md`](../foundation/people-first.md) and the Group is-not-an-actor commitment in [`groups.md`](groups.md)). When a Member operating in producer capacity authors a bulletin, the bulletin can be **branded** with the Member's kind='business' Group affiliation for display ("from Drake's Bakery"); the social connection — who is on the receiving end, who hits "follow," who can reply — is still Member-to-Member.

The argument for elevating the bulletin to its own system (rather than treating it as a special Item kind) is that a bulletin is shaped differently from an Item: it is push-delivered, audience-scoped to followers, ephemeral on the feed but persistent in the author's outbox, and gated on producer capacity rather than on Item-create permissions. Conflating bulletins with Items would either dilute Item semantics or attach broadcast machinery to surfaces that don't need it.

The bulletin is also the load-bearing surface for the producer recruitment pitch: "we'll help you compete with bigger players" depends on followers being a real audience the producer can reach. Without a bulletin, follow is a save-for-later; with it, follow is a subscription. The whole asymmetry — *a one-person operation can outcompete a chain because they have direct access to their audience the chain can't replicate* — runs through this system.

## T1 — MVP Tier (b2)

The minimum surface that lets us ship "follow a Member, receive their bulletins."

### Authorship
- Any Member with `maker_mode_enabled = true` OR active membership in a kind='business' Group (`member_has_standing_presence` = true per [`groups.md`](groups.md)) can compose and publish bulletins.
- Members without standing presence see a "Become a Maker" CTA in place of the compose surface (per [`member.md`](member.md) Maker mode).

### Compose
- Plain-text body, optional title.
- "Publish" button — no scheduling, no drafts in T1.
- Preview before publish.
- Optional **branding** field: the Member selects one of their active kind='business' Group memberships to display alongside their handle ("Aaron from Drake's Bakery"). Optional; Maker-mode-only Members publish under their own handle.

### Delivery
- Every Member in `member_follows` (where `followed_member_id = author.member_id` and `unfollowed_at IS NULL`) receives:
  - An in-app card on their Home feed (top-pinned for 24h, then sorted normally).
  - An email digest entry, if `member_privacy.email_notifications_bulletins = true` (defaults per Member onboarding).
- Delivery is per-recipient, recorded in `bulletin_deliveries` (one row per follower per bulletin).

### Author guardrails
- Rate limit: 3 bulletins per author per 7-day window. Anti-spam — prevents the Nextdoor over-posting failure mode. Enforced at the action handler.
- Followers can **mute** a producer's bulletins without unfollowing (`member_follows.bulletins_muted = true`). They keep the social tie; they just don't get the broadcast.
- Followers can unsubscribe from email delivery only (in-app card still appears).

### Stats (basic, author-visible only)
- Per bulletin: # delivered, # opened (email), # clicked-through, # shared.
- Surfaced in the producer-growth dashboard (per [`producer-growth.md`](producer-growth.md)), not on the bulletin itself.

## T2 — Core Tier (b3)

### Rich composition
- Markdown / lightweight rich text.
- Inline photo upload (1–5 photos per bulletin).
- Attach an **Item** — the bulletin announces a specific Item (a Gathering, a Product drop, a Service availability). Renders as a card linking to the Item's page (per [`item.md`](item.md)).
- Attach a **Location** — the bulletin references a permanent or recurring-temporary Location (per [`location.md`](location.md)). Renders as a map preview linking to the Location's page.

### Scheduling
- Schedule for a future date/time.
- Drafts save automatically (per-author, not shared).
- "Best time to send" suggestion at T3 (based on follower open patterns).

### Welcome bulletin
- Auto-send on new follow: producer's editable welcome message template.
- One per producer; configurable from the producer-growth dashboard.

### Better insights
- Open rate (email), click-through rate per link, "influence" metric (followers who took action — visited profile, supported, shared — within 24h of bulletin). All surfaced in producer-growth, not on the bulletin itself.

## T3 — Polish Tier

### Audience segmentation
- Segment by: locality (followers in Sacramento vs elsewhere), follow date (new followers vs longtime), past actions (supported recently vs lurkers). Anonymized aggregates only — the producer sees segment sizes and behavior, never individual follower identity beyond what `member_follows` already exposes.
- Geographic segments use the follower's `home_location_id` (per [`location.md`](location.md) and ADR-4), not a stored address.

### Drip sequences
- Auto-sequence on new follow: welcome → 3 days later → "here's our story" → 7 days later → "come visit us." Per-producer template library.

### Two-way comms
- Followers can reply to a bulletin. Reply lands in the bulletin's thread, scoped to (bulletin, follower) — a thread per follower, owned by the bulletin's author.
- Replies use the existing `member_threads` DM substrate (per [`member.md`](member.md)) with `bulletin_id` as the conversation anchor; the bulletin is the addressable scope, consistent with the messaging-scope commitment (item-or-group-scoped, never Location-scoped — see [`policy-framework.md`](../foundation/policy-framework.md)).
- Optional: producer surfaces replies as a public Q&A thread under the bulletin.

### Cross-promotion
- A producer can co-author a bulletin with another producer (collaborating pop-up, joint event). The bulletin appears in both producers' follower feeds; both authorships are stamped on the row.

### Performance benchmarks
- "Your open rate is 42% — average for similar producers is 31%." Anonymized peer comparison; never names another producer. (Belongs to producer-growth surface; bulletin system writes the underlying data.)

## Data model implications

**Required at b2:**

**The spine — `bulletins`** (one row per published bulletin):

- `id` (uuid)
- `author_member_id` (FK to `members`) — required, never null
- `branding_group_id` (FK to `groups`, nullable) — the kind='business' Group displayed alongside the author handle; null = author handle only
- `co_authors` (uuid[], nullable — T3) — additional `author_member_id` values for co-authored bulletins
- `title` (text, nullable)
- `body` (text — markdown allowed in T2+)
- `cover_photo_url` (text, nullable — T2)
- `attached_item_id` (uuid, FK to `items`, nullable — T2)
- `attached_location_id` (uuid, FK to `locations`, nullable — T2)
- `published_at` (timestamptz)
- `scheduled_for` (timestamptz, nullable — T2 scheduling)
- `audience` (enum: `all_followers` | `segment_id` — T3 segmentation)
- `delivery_channels` (jsonb — `{in_app: true, email: true, push: false}`)
- `stats_cache` (jsonb — `{delivered, opened, clicked, shared}`, refreshed async)

**Delivery — `bulletin_deliveries`** (one row per follower per bulletin):

- `bulletin_id`, `recipient_member_id` (composite PK)
- `delivered_at`, `opened_at` (nullable), `clicked_at` (nullable), `shared_at` (nullable)
- Soft unsubscribe lives on `member_follows.bulletins_muted` and `member_privacy.email_notifications_bulletins`, not here.

**Event log entries:** `bulletin.published`, `bulletin.scheduled`, `bulletin.delivered` (per recipient — high volume, partition aggressively), `bulletin.opened`, `bulletin.clicked`, `bulletin.shared`, `bulletin.replied` (T3).

**Action handlers** (per [`action-layer.md`](action-layer.md)): `bulletin.publish` (rate-limited at the handler; requires the author to have producer capacity), `bulletin.schedule` (T2), `bulletin.mute_for_self` (follower action, writes to `member_follows`), `bulletin.reply` (T3).

## Policy posture

Per [`policy-framework.md`](../foundation/policy-framework.md) — protective defaults, opt-in expansions.

**Defaults:**
- Bulletins are author-scoped (Member or co-author Members), never Location-scoped. The messaging-scope commitment is upheld structurally: there is no `bulletin.location_id` field, no Location-scoped bulletin surface, and no handler that accepts a Location as a delivery target.
- Email delivery is opt-in at Member sign-up; defaults to on for follower-bulletins of producers the Member has followed (the follow is the act of opting in to broadcast).
- Mute is one-tap from any bulletin card and from the producer's profile.
- Rate limit (3/week) is unconditional at T1; producers with proven low-complaint history may receive a higher cap at T3 (open question).

**Available opt-ins:**
- Producer opts in to **scheduling** (T2) — no opt-in required, just a UI affordance.
- Producer opts in to **drip sequences** (T3) — they choose to enable auto-sequence per template.
- Follower opts in to **bulletin replies as public Q&A** at the bulletin level — defaults to private (DM-shaped reply thread); producer can flip a bulletin to public-Q&A mode.

**Three-filter analysis for the audience-segmentation opt-in (T3):**
- *Helpful:* yes — lets producers reach the right people with the right message; raises bulletin quality and lowers unsubscribe risk.
- *Harm to others:* segmentation uses only data the follower has already opted into (follow, follow date, `home_location_id`, action history). No demographic targeting, no inferred profiling. Anonymized aggregates — the producer sees "12 followers in Sacramento" not "John from 9th & K Street."
- *Abusable:* mitigated by (a) audience minimum N≥10 per segment (consistent with `assistant-context.md` k-anonymity floor), (b) producer cannot see individual segment-membership status of any follower, (c) audit log entry on every segment-targeted send.

## What Producer Bulletin rules in and rules out

**Rules in:** a Member operating in producer capacity broadcasts to their Member-followers, with attribution to a kind='business' Group if they choose; followers receive in-app and (opt-in) email; the producer sees aggregate engagement; the follower can mute, unsubscribe-email, or reply (T3); co-authored bulletins (T3) appear in both producers' fans' feeds.

**Rules out:** Group-as-author (Groups don't broadcast; Members do, with optional Group branding). Location-scoped delivery (there is no surface that addresses "everyone in West Sac" — per the anti-Nextdoor commitment). Demographic targeting (geographic city-level via `home_location_id` is the limit; no age/gender/income segments exist). Selling delivery (no paid promotion of bulletins; the platform never charges to deliver). Surveying non-followers (only followers receive; non-followers cannot be reached via bulletin).

## Integration Points

- **Connects to:**
  - **Member** (author identity; follower relationships via `member_follows`; per [`member.md`](member.md))
  - **Groups** (optional branding via `branding_group_id`; producer capacity gating via `member_has_standing_presence`; per [`groups.md`](groups.md))
  - **Item** (T2 attachment via `attached_item_id`; per [`item.md`](item.md))
  - **Location** (T2 attachment via `attached_location_id`; per [`location.md`](location.md))
  - **Action layer** (publish/schedule/mute/reply through named handlers; per [`action-layer.md`](action-layer.md))
- **Used by:**
  - Producer-growth dashboard (per [`producer-growth.md`](producer-growth.md) — bulletin analytics live there, not here)
  - Home feed surfaces (per [`../products/community-platform.md`](../products/community-platform.md) — followers see bulletin cards inline)
  - Email digest infrastructure (per the notification system, b2)
- **Critical dependencies:** the b1 follow substrate (`member_follows`), the b1 action layer, the b2 notification + email-delivery infrastructure.

## Open questions

- **Public visibility on producer profile.** Should bulletins appear on the producer's `/m/[handle]` page (visible to non-followers as recent posts) or only in followers' feeds? Public visibility is more discoverable; hidden makes follow more valuable. Working answer: hidden by default; producer can opt a bulletin into public ("featured on profile") at publish time.
- **Bulletin fatigue.** Rate limit is a blunt instrument; mute gives followers control but producers can't see who muted. Should we surface aggregate mute counts so producers can self-correct? T2/T3 design call.
- **Paid bulletins.** Substack model: free to send, charge for email-domain / advanced features. For Main Street the answer is probably always free; the platform's value comes from producers staying, not from bulletin fees. Confirm at b3.
- **Reply default visibility.** Private (DM-shaped) or public (Q&A under bulletin)? T3 surface design will decide; the data model supports both via the same thread substrate.

## Decisions encoded here

This spec does not own any ADR. It *consumes*:
- **ADR-6** ([`agent-assistance.md`](../foundation/agent-assistance.md)) — producer-capacity gating uses `member_has_standing_presence` (standing-derived).
- **ADR-7** ([`action-layer.md`](action-layer.md)) — every publish/schedule/mute/reply is a named handler with same-transaction row+event commit.
- **ADR-9** ([`policy-framework.md`](../foundation/policy-framework.md)) — protective defaults, anti-Nextdoor messaging-scope commitment, three-filter test on segmentation opt-in.
- **ADR-13** ([`groups.md`](groups.md)) — branding attribution via kind='business' Group memberships; Groups are decoration on bulletins, not authors.
