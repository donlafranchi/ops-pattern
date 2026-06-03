---
purpose: How to run + recover the local environment for evals and dev.
layer: how
status: active
---

# RUNBOOK

Operational procedures for the local dev + eval environment. Companion to [`DEPLOY.md`](DEPLOY.md) (production).

## Run the app + evals locally

```bash
cd web
supabase start                       # local Postgres + Auth + Realtime (127.0.0.1:54321)
npm run dev                          # Next.js on :3000
npx playwright test evals/features/F### --reporter=list --workers=1
```

`npm run eval` lets Playwright manage the dev server. The first `/` request triggers a
~5–6s Turbopack compile; a cold server can blow the 5s `toBeVisible` timeout on the
first page-render assertion and the run cascades to `ERR_CONNECTION_REFUSED`. **Pre-warm
before a serious run:** start `npm run dev` yourself, `curl` the routes under test once,
then run the eval (`reuseExistingServer` picks up the warm server).

## Recover the local eval environment after a broken `supabase db reset`

**Symptom set** (any of):
- Seed fails with `column "email_confirmed_at" of relation "users" does not exist`.
- Signup-driven evals fail with FK violation `member_place_interests_member_id_fkey` /
  `Key (member_id)=… is not present in table "members"`.
- Auth container stuck restarting / `health: starting`.

**Cause.** An interrupted `supabase db reset` can leave (a) the `auth` schema at an
ancient GoTrue revision (≈21-column `auth.users`, singular `email_change_token`, no
`email_confirmed_at`) while the running GoTrue image expects the modern ~35-column
schema, and (b) the Vault secrets that the post-signup hook ([`006_auth_signup_hook.sql`](../web/supabase/migrations/006_auth_signup_hook.sql))
reads **wiped** — so `handle_new_auth_user()` silently skips member creation and onboarding's first write hits the FK.

**Do NOT** re-run `supabase db reset` to fix this — it is the operation that wedged.
Recover surgically instead:

1. **Let GoTrue finish migrating the auth schema.** Restarting the auth container makes
   GoTrue replay its migrations. Wait for health, then verify:
   ```bash
   docker inspect --format '{{.State.Health.Status}}' supabase_auth_web      # → healthy
   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -tAc \
     "SELECT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='auth' AND table_name='users' AND column_name='email_confirmed_at');"   # → t
   ```

2. **Re-create the post-signup hook Vault secrets** (one-time after any reset — documented
   in `006_auth_signup_hook.sql`). The secret must match `AUTH_SIGNUP_HOOK_SECRET` in
   `web/.env.local`:
   ```bash
   psql postgresql://postgres:postgres@127.0.0.1:54322/postgres <<'SQL'
   select vault.create_secret('http://host.docker.internal:3000/api/internal/auth-signup',
     'auth_signup_hook_url', 'post-signup hook URL (T044)');
   select vault.create_secret('<value of AUTH_SIGNUP_HOOK_SECRET from web/.env.local>',
     'auth_signup_hook_secret', 'HMAC signing key for the auth-signup hook (T044)');
   SQL
   ```
   Verify: `SELECT name FROM vault.decrypted_secrets WHERE name LIKE 'auth_signup%';` → 2 rows.

The fixtures are idempotent (lookup-or-create by stable handle/slug/title), so no manual
data cleanup is needed once the schema + secrets are restored — just re-run the eval.
