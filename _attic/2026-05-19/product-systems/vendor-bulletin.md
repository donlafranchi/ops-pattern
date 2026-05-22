# System: Vendor Bulletin

**Purpose:** Let vendors broadcast a message to all their followers — the "Substack-light" feature that makes following a vendor *worth doing*. Without it, follow is a passive bookmark; with it, follow becomes a subscription to a relationship.

**Bundles:** b2 (T1), b3 (T2/T3)

**Core Principle:** Following must produce real value to the follower or it's vanity. The bulletin is what closes that loop — vendors get a direct line to their audience, followers get insider knowledge that corporate competitors can't replicate. This is the asymmetry that lets a one-person operation outcompete a chain.

---

## Hypothesis

A local baker with 200 followers and a weekly bulletin ("sourdough back tomorrow, croissants Sunday") beats a chain bakery's billboard for that audience every time. The bulletin is the product feature that earns Main Street the right to say "we make small businesses competitive."

---

## Data model

```
vendor_bulletins
├── id (uuid)
├── vendor_id (uuid)
├── author_user_id (uuid — must be vendor owner or staff)
├── title (text, nullable)
├── body (text — markdown allowed in T2+)
├── cover_photo_url (text, nullable — T2)
├── attached_event_id (uuid, nullable — T2; bulletin can announce an event)
├── published_at (timestamptz)
├── audience (enum: 'all_followers' | 'segment_id' — T3 segments)
├── delivery_channels (jsonb — {in_app: true, email: true, push: false})
├── stats (jsonb — open_count, click_count, share_count, computed async)
└── created_at, updated_at
```

```
bulletin_deliveries
├── bulletin_id, user_id
├── delivered_at, opened_at, clicked_at
├── unsubscribed_at (nullable)
```

---

## T1 — Bulletin MVP (b2)

### Compose
- Plain-text body, optional title
- "Publish" button — no scheduling, no drafts in T1
- Preview before publish

### Delivery
- All followers receive an in-app card on their Home feed (top-pinned for 24h, then sorted in normally)
- All followers with email notifications enabled get an email (single bulletin per email — no batching)

### Author guardrails
- Rate limit: 3 bulletins per vendor per week (anti-spam — prevents the Nextdoor over-posting failure mode)
- Followers can mute a vendor's bulletins without unfollowing
- Followers can unsubscribe from email-only

### Stats (basic)
- Vendor sees: # delivered, # opened (email), # clicked-through (link in bulletin), # shared
- Surfaced in You → Business → Bulletin tab

---

## T2 — Core (b3)

### Rich composition
- Markdown / rich text editor
- Inline photo upload (1–5 photos per bulletin)
- Attach an event — bulletin announces a specific event with its details
- Attach a product / listing item (when product catalog exists)

### Scheduling
- Schedule for a future date/time
- Drafts save automatically
- "Best time to send" suggestion (based on follower open patterns)

### Welcome bulletin
- Auto-send on new follow: vendor's choice of welcome message
- Editable template per vendor

### Better insights
- Open rate (email)
- Click-through rate per link
- "Influence" metric: # followers who took action (visited profile, supported, shared) within 24h of bulletin

---

## T3 — Polish

### Audience segmentation
- Segment by: location, follow date (new followers vs longtime), past actions (shoppers who supported vs lurkers)
- "Send to followers in Sacramento only" / "Send to followers who supported in the last 30 days"

### Drip / series
- Auto-sequence: new follower → welcome → 3 days later → "here's our story" → 7 days later → "come visit us"
- Per-vendor template library

### Two-way comms
- Followers can reply to a bulletin (lightweight — not a full DM thread)
- Vendor sees reply inbox
- Optional: turn replies into a public thread under the bulletin (community Q&A)

### Cross-promotion
- Vendors can co-author a bulletin with another vendor ("we're collaborating on a pop-up")
- Bulletin appears in both vendors' follower feeds

### Performance benchmarks
- "Your open rate is 42% — average for similar vendors is 31%" (anonymized peer comparison)

---

## Integration Points

- **Connects to:** `businesses` (vendor), `follows` (audience), `users` (delivery), `events` (T2 attachment), `notifications` (delivery channel)
- **Used by:** Home Feed (delivery surface), You → Business tab (composer + stats)
- **Critical dependency:** Email infrastructure (transactional + digest), notification preferences system

---

## Open Questions

- Should bulletins appear on the *vendor's public profile* (visible to non-followers as recent posts) or only in followers' feeds? Public visibility is more discoverable but reduces the value of following.
- How do we prevent bulletin fatigue? Rate limit is a blunt instrument; "follower mute" gives users control but vendors don't see who muted.
- Do we ever charge for bulletins? Substack model: free to send, charge for email domain / advanced features. For Main Street, probably always free for vendors — the platform's value comes from vendors *staying*, not from bulletin fees.
- Should bulletin replies be public-by-default (community Q&A) or private-by-default (DMs)? T3 question.
