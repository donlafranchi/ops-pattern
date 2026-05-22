---
purpose: Ticket T018 — follow vendor.
layer: how
status: reference
---

# T018: Follow Vendor + Following List

**Scenario:** planning/scenarios/F012-follow-vendor.md
**Status:** Complete
**Completed:** 2026-04-24T09:40:49-07:00

## Acceptance Criteria

- [ ] `FollowButton` component — toggles state on tap without page reload; shows "Follow" (outline) or "Following" (filled)
- [ ] Uses `follows` table (from T012): insert on follow, delete on unfollow
- [ ] Optimistic UI update + rollback on server error
- [ ] Toast/snackbar confirms "Following [Name]" on successful follow
- [ ] Unfollow requires confirm: "Unfollow [Name]?" (Confirm / Cancel)
- [ ] Guest tap: prompt "Sign up to follow [Name] and get updates when they're at the market" with Sign Up / Maybe Later; on sign-up, follow is applied post-auth
- [ ] Route `/following` — authenticated users only; lists followed vendors with photo, name, tagline, next market appearance ("Next: [Market] · [Day] [Date]")
- [ ] List sorted by next upcoming market date (soonest first); vendors with no upcoming appearances at the bottom
- [ ] Unfollow from list with confirm prompt
- [ ] Empty state: "You're not following anyone yet — browse vendors to find makers you love" with CTA to `/`
- [ ] Wire follow button into: vendor profile (T017), home feed vendor cards (T014), search result cards (T015)
- [ ] **Email notification (b1)**: nightly cron (Supabase Edge Function or Vercel Cron) finds vendors with market appearances in next 3 days whose followers haven't been notified; sends email "[Vendor] will be at [Market] this [Day]!" with profile link
- [ ] Notification dedupe: track sent notifications in `follow_notifications(user_id, vendor_id, market_id, sent_at)` to avoid duplicates
- [ ] Opt-out: toggle in `/you` profile screen disables follow emails
- [ ] Tests: follow/unfollow idempotent, optimistic update + rollback, guest prompt, /following sort correct, cron picks right vendors, dedupe works
- [ ] BUILD-LOG.md updated

## Notes

Use Supabase email via Resend or the built-in SMTP. Email template is plain: subject + one paragraph + CTA button.

Cron schedule: daily at 9am local (Pacific) — use Vercel Cron Job (`vercel.json`) or Supabase pg_cron.

The old "Support" button (T010) stays as-is for now. It lives on the vendor profile alongside Follow but serves a different purpose (endorsement, not save). Consider deprecating in b2 if follow replaces it conceptually.

## Completion

Date: 2026-04-24
Commit: 8c6b2bd
