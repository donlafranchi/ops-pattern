# T025 — Vendor bulletin compose + delivery (T1 MVP)

## Goal
Ship the T1 vendor bulletin from `vendor-bulletin.md`: vendors compose plain-text broadcasts, all followers see them in the Home feed (T024 already reads them), and email delivery happens for opted-in followers.

This is the "Substack-light" feature that makes following a vendor worth doing.

## References
- [product/systems/vendor-bulletin.md](../../product/systems/vendor-bulletin.md) — full system
- T022 — `vendor_bulletins`, `bulletin_deliveries` tables (hard prerequisite)
- T023 — `/you/vendor` routing (hard prerequisite)
- T024 — feed reads bulletins (already wired)

## Scope

### 1. Compose UI (`/you/vendor/bulletins/new`)
- Optional title input (single line)
- Body textarea (plain text only in T1; markdown is T2)
- Preview pane shows how the bulletin will look in the feed
- Buttons: `[Publish]` (primary), `[Cancel]`
- No drafts in T1 (per system doc)
- No scheduling in T1

### 2. Publish flow
On `[Publish]`:
1. Insert `vendor_bulletins` row with `published_at = now()`
2. Insert `bulletin_deliveries` rows for every active follower (`follows.unfollowed_at is null`)
3. Enqueue email send (one email per follower with `notif_email_bulletins=true`) — use existing transactional email setup; if none exists, use Supabase Edge Function with Resend (or document and TODO)
4. Insert `vendor_events` rows: `event_name='bulletin_published'` once per publish

### 3. Bulletin list (`/you/vendor/bulletins`)
- Table/list of published bulletins, newest first
- Per row: title, published date, delivered count, opened count, clicked count
- Tap row → bulletin detail (read-only view; no edit in T1)

### 4. Rate limit
- Reject publish if vendor has 3+ bulletins published in the last 7 days
- Friendly message: "You've sent 3 bulletins this week. Please wait before sending more — followers are more engaged when bulletins are rare."

### 5. Follower-side controls
- On any bulletin card in the Home feed, add a `⋯` menu with `Mute [Vendor]'s bulletins` (sets a row in a small `bulletin_mutes(user_id, vendor_id)` table — add to T022's schema or in this ticket as an addendum migration)
- Email footer includes `Unsubscribe from [Vendor]'s bulletins` link → sets `bulletin_deliveries.unsubscribed_at` and prevents future emails (in-app still appears unless muted)

### 6. Open / click tracking
- Email open: 1×1 pixel hitting an endpoint that updates `bulletin_deliveries.opened_at`
- In-app open: when bulletin card scrolls into view in Home feed, update `opened_at` for the (bulletin, user) row
- Click: any link click in the bulletin body updates `clicked_at`

### 7. Permissions
- Only `businesses.owner_user_id` (or staff role if it exists) can compose for a given vendor
- RLS policies on `vendor_bulletins`: insert/update gated by ownership

## Acceptance criteria
- [ ] Vendor at `/you/vendor/bulletins/new` can write title + body and publish.
- [ ] Publish creates `vendor_bulletins` row + `bulletin_deliveries` rows for every active follower.
- [ ] Follower email is sent (or queued; document if email infra is mocked in dev).
- [ ] `/you/vendor/bulletins` shows the vendor's published bulletins with delivered/opened/clicked counts.
- [ ] Bulletin appears in followers' Home feed under "From vendors you follow" (T024 surface already exists).
- [ ] 4th publish in 7 days is blocked with the rate-limit message.
- [ ] Mute on a bulletin card stops future bulletins from that vendor appearing in-app for that user.
- [ ] Email unsubscribe link sets `unsubscribed_at` and stops future emails.
- [ ] In-app and email opens correctly update `opened_at`.
- [ ] Non-owners cannot insert/edit bulletins (RLS enforced).
- [ ] `npm run build` and evals pass; new evals cover compose → publish → followers see it.

## Out of scope
- Markdown / rich text / inline photos (T2)
- Scheduling, drafts (T2)
- Welcome bulletin auto-send on follow (T2)
- A/B testing, segment audiences (T2/T3)
- Push notifications (separate notification system work)

## Notes
Keep the composer brutally simple. The point of T1 is to prove that vendors will write, not to give them a CMS. Resist adding image upload, link previews, or formatting in this ticket — those belong in T2 once we know the feature is used.

## Completion

Date: 2026-04-25
Status: Complete

**Delivered:**
- Compose UI at `/you/vendor/bulletins/new` — title (optional) + body textarea + live preview + Publish/Cancel.
- Server route `POST /api/vendor/bulletins/publish` — verifies ownership, enforces 3/7-day rate limit, inserts bulletin, fans out `bulletin_deliveries` rows for active followers via service role, inserts `vendor_events bulletin_published`.
- Bulletin list at `/you/vendor/bulletins` — newest first with delivered/opened/clicked counts per row.
- Bulletin detail at `/you/vendor/bulletins/[id]` — read-only view + 4 stat tiles (delivered / opened / clicked / unsubscribed).
- `/you/vendor` placeholder updated to link to bulletins.
- New `BulletinFeedCard` (used in HomeFeed pinned section): IntersectionObserver auto-marks `opened_at` at 50% visible; click on link sets `clicked_at`; `⋯` menu offers `Mute [Vendor]'s bulletins` (writes to new `bulletin_mutes` table).
- HomeFeed filters bulletins by mute set on load and after mute action (optimistic update).
- Email-side primitives: `GET /api/bulletins/[id]/open?u=` returns 1×1 GIF and stamps `opened_at`; `GET /api/bulletins/[id]/unsubscribe?u=` stamps `unsubscribed_at` and serves a confirmation HTML page.
- Migration 005: `bulletin_mutes(user_id, vendor_id)` with self-only RLS.

**Verification:**
- `npm run build` ✅ — new routes appear in build output (publish, list, detail, new, open pixel, unsubscribe)
- `npm run test` ✅ 51/51 passing

**Deployment notes:**
- Run `supabase db push` to apply migration 005.
- Email send is **stubbed**: TODO comment in `/api/vendor/bulletins/publish/route.ts` flags where to enqueue Resend (or whichever provider). Open-pixel + unsubscribe routes are in place and will start recording stats as soon as the email send is wired and emails reference `…/api/bulletins/[id]/open?u=<user>` and `…/unsubscribe?u=<user>`.
- Open-pixel and unsubscribe routes use plain `(bulletin_id, user_id)` URLs (no token). Add an HMAC signature before exposing externally if abuse becomes a concern.

**Out-of-scope deferred to T2 (per system doc):** markdown/rich text, drafts, scheduling, welcome bulletin, segmentation.
