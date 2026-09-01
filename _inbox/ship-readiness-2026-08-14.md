---
purpose: Ship-readiness assessment for weekend deployment Aug 16–17, 2026.
layer: how
status: active
---

# Ship Readiness — Aug 14, 2026

**Target:** First live deployment, weekend of Aug 16–17.

---

## 1. MVP Feature Status

### Complete — built, evals green, merged to main

| Feature | Evals | Status |
|---|---|---|
| F030 — Newcomer signup + locality feed | green | done |
| F032 — Member public page + follow | green | done |
| F033 — Venue page + follow | 14/14 green | done |
| F034 — Host recurring gathering | green | done |
| F035 — Group public page | green | done |
| F036 — Sell walkthrough (create business) | 9/9 green | done |
| F037 — Locally Owned badge claim | 8/8 green | done |
| F038 — List a product | 6/6 green | done |
| F040 — List a service | green | done |
| F041 — QR card generator | green | done |
| F042 — Unified follows page | green | done |

**All foundations complete:** extensions, members, locations, items, groups, geography, metro polygons, follow-venue wiring, jurisdiction badges substrate. 89 tickets closed. Zero open tickets.

### Not complete

| Item | State | Ship-blocking? |
|---|---|---|
| F031 — Adjust near-me reach | backlog (not scoped) | No — feed works, just defaults to a fixed radius |
| F039 — Locally Made badge | deferred indefinitely | No — deliberate cut |
| F043 — Integration test (newcomer journey) | backlog | Soft — manual walkthrough can substitute |
| F043 — Integration test (producer journey) | backlog | Soft — manual walkthrough can substitute |

**Bottom line:** Every user-facing surface in the MVP is built and merged. The only gap is F031 (near-me slider), which is a nice-to-have — the feed works without it.

---

## 2. Infrastructure Readiness

### What exists

- **34 SQL migrations** in `web/supabase/migrations/` (001 through 034), covering the full schema
- **`.env.example`** documenting all required env vars (Supabase, Mapbox, Resend, cron secret, admin emails, database URL)
- **`vercel.json`** with a cron job for follow-notification emails
- **`package.json`** with working `build`, `test`, `lint`, `eval` scripts
- **Deployment pipeline playbook** (`playbooks/deployment-pipeline.md`) — a complete step-by-step plan (status: draft, never executed)
- **Next.js 16.2.3** + Supabase SSR + Mapbox GL JS stack

### What does NOT exist

- **No GitHub Actions CI** — `.github/workflows/` doesn't exist. The `ci.yml` spec is written in the playbook but never created.
- **No staging Supabase project** — only local + production described.
- **No evidence Supabase CLI is linked** to the production project.
- **No error monitoring** (Sentry, etc.)
- **Web repo has 2 unpushed commits** on main.
- **Parent repo has 17 unpushed commits** on main + 3 untracked files.

---

## 3. Blockers — What Must Happen Before Sunday

### Critical path (do these in order)

**Friday evening:**

1. **Push unpushed commits.**
   ```bash
   cd web && git push origin main
   cd .. && git add -A && git commit -m "docs: pre-launch sync" && git push origin main
   ```

2. **Verify Supabase production project exists and is on a paid plan** (Free plan has no daily backups). Get the project ref from Dashboard → Project Settings → General.

3. **Link Supabase CLI to production and verify migrations.**
   ```bash
   cd web
   brew install supabase/tap/supabase  # if not installed
   supabase link --project-ref <YOUR_PROJECT_REF>
   supabase db migrations list          # all 34 should show as applied
   ```
   If migrations aren't applied yet: `supabase db push` — **this is the highest-risk step.** Test against a fresh local instance first (`supabase db reset`) to verify ordering.

4. **Set Vercel environment variables** (Settings → Environment Variables → Production):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | from Supabase Dashboard → API |
   | `SUPABASE_SECRET_KEY` | service role key from same page |
   | `SUPABASE_SERVICE_ROLE_KEY` | same value as above |
   | `NEXT_PUBLIC_MAPBOX_TOKEN` | your Mapbox public token |
   | `MAPBOX_GEOCODING_TOKEN` | server-side Mapbox token |
   | `NEXT_PUBLIC_SITE_URL` | your production URL |
   | `RESEND_API_KEY` | from resend.com |
   | `FOLLOW_EMAIL_FROM` | `CDP <onboarding@resend.dev>` (or verified domain) |
   | `CRON_SECRET` | `openssl rand -hex 32` |
   | `DATABASE_URL` | Supabase connection string (Settings → Database → Connection string) |

5. **Connect web repo to Vercel.** If not already connected: `vercel link` in `web/`, or connect via Vercel dashboard → Import Git Repository. Set framework to Next.js, root directory to `web/` if the repo root is `community/`.

**Saturday morning:**

6. **Configure Supabase Auth for production:**
   - Dashboard → Authentication → URL Configuration → set Site URL to production domain
   - Add production domain to Redirect URLs
   - Verify email templates render correctly
   - Confirm email confirmation is enabled (it should be by default)

7. **Scope Mapbox token to production domain** (Mapbox account → Tokens → URL restrictions).

8. **RLS audit:**
   ```bash
   supabase db lint --linked  # checks for tables without RLS
   ```

9. **Manual smoke test on the deployed site:**
   - Sign up with a new email
   - Complete onboarding (set location)
   - See the locality feed
   - Create a business via Sell walkthrough
   - List a product
   - View the public shop page
   - View a venue page
   - Follow a member
   - Check `/you/following`

**Saturday afternoon (nice-to-haves):**

10. **Create `.github/workflows/ci.yml`** from the spec in `playbooks/deployment-pipeline.md`. Not blocking for launch but protects against regressions from day one.

11. **Set up error monitoring** — Vercel has built-in error tracking; enable it in project settings. Sentry is better but not day-one critical.

---

## 4. What Can Ship vs What Should Wait

### Ship this weekend — the full b1 MVP minus F031

Everything built and merged constitutes a meaningful product: signup, locality feed, member profiles, groups (all six kinds), items (product/service/gathering/wonder), venue pages, follows, Sell walkthrough, Locally Owned badge, QR cards. This is the complete hypothesis test surface.

### Should wait

- **F031 (near-me slider)** — needs scoping. The feed defaults work without it.
- **Staging environment** — useful for future development, not needed for initial deploy.
- **GitHub Actions CI** — add in the first week post-launch.
- **Integration test automation** — manual smoke test covers the same ground for launch.

---

## 5. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| **34 migrations against production DB** — never been run against a real Supabase project | **High** | Run `supabase db reset` locally first to verify ordering. Then `supabase db push` to production. Have the Supabase dashboard open to inspect if anything fails mid-migration. |
| **RLS policies untested in production** — all development was local | **High** | Run `supabase db lint`. Then manually test: sign up as a new user, verify you can only see your own drafts, can't access other members' private data. |
| **Auth redirect URLs** — if not configured, signup confirmation emails link to localhost | **High** | Set Site URL + Redirect URLs in Supabase Auth config before inviting any real users. |
| **No rollback plan** — Supabase migrations are forward-only | **Medium** | Accept the risk for launch. The schema is well-tested locally. If something breaks, write a forward-fix migration. |
| **No error monitoring** — silent failures won't surface | **Medium** | Enable Vercel error tracking. Add Sentry in week one. |
| **No backups on Free plan** — data loss risk | **Medium** | Upgrade to Supabase Pro ($25/mo) before inviting real users. |
| **Resend email not configured** — follow notifications won't send | **Low** | The cron job will fail silently. Not blocking for launch — notifications are a nice-to-have. Configure in week one. |
| **Mapbox token unscoped** — anyone could use your token | **Low** | Scope to production domain Saturday morning. Low risk for a soft launch. |
| **`NEXT_PUBLIC_SITE_URL` wrong** — QR cards, share links, OG tags break | **Low** | Set correctly in Vercel env vars. Easy to fix if missed. |

### The one thing that could ruin the weekend

Running 34 migrations against production Supabase for the first time. If migration 17 fails because of a dependency on something migration 16 assumed, you're debugging SQL at midnight. **Mitigate by running `supabase db reset` locally Saturday morning and verifying a clean build from scratch.** If that passes, production push should be safe — the migrations were authored incrementally and tested locally.

---

## Summary

The app is feature-complete for the b1 MVP. Zero open tickets, all evals green, everything merged to main. The gap is entirely infrastructure: Vercel deployment, Supabase production configuration, and env vars. A focused Friday evening + Saturday morning gets this live. The highest-risk step is the first production migration push — test locally first, then push.
