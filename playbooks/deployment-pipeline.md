---
id: how-deployment-pipeline
purpose: The go-live pipeline — local → staging → production promotion path for Next.js + Supabase + Vercel.
layer: how
status: draft
---

# Deployment Pipeline

How code and database changes move from a developer's laptop to production. Three environments, three gates.

## Environments

| Environment | App hosting | Database | Purpose |
|---|---|---|---|
| **Local** | `next dev` on localhost:3000 | Supabase CLI local (`supabase start`) | Development + unit tests + Playwright evals |
| **Staging** | Vercel preview deployment (branch `staging` or PR-based) | Second Supabase project (`mms-staging`) | Integration testing, migration dry-run, manual QA |
| **Production** | Vercel production (auto-deploy from `main`) | Primary Supabase project (`community`) | Live users |

## What needs to happen — step by step

### Phase 1: Wire up the Supabase CLI (do first)

The CLI is how migrations move from files to a running database. Right now you apply SQL by hand in the dashboard. This replaces that.

**Steps:**

1. Install the CLI if not already: `brew install supabase/tap/supabase`
2. Initialize in `web/`: `cd web && supabase init` — creates `supabase/config.toml`
3. Link to your production project: `supabase link --project-ref <your-project-ref>` (find the ref in your Supabase dashboard under Project Settings → General)
4. Verify the 34 existing migrations are recognized: `supabase db migrations list` — should show all 34 as applied (they are, since you ran them manually)
5. Test locally: `supabase start` boots a local Postgres + Auth + Realtime stack in Docker. Your app connects to it instead of the remote project during development.

**What this gets you:** `supabase db push` applies unapplied migrations to whichever project is linked. `supabase db reset` tears down and rebuilds local from scratch (useful for testing migration ordering).

### Phase 2: Create a staging Supabase project

A second Supabase project that mirrors production. Migrations land here before they touch live data.

**Steps:**

1. In the Supabase dashboard, create a new project: `mms-staging`, same region as production
2. Link to it from a separate config (or use `supabase link` with the staging ref when promoting): `supabase db push --linked` applies all migrations to the linked project
3. Set up the same extensions, same Auth providers, same RLS policies. The migration files handle schema + RLS; Auth config and extensions you verify manually the first time, then they stay in sync as long as migrations are the only schema-change path.
4. Add staging env vars to Vercel (see Environment Variables below)

**What this gets you:** A place to verify migrations work against a real Supabase instance before touching production. Catches issues like migration ordering bugs, missing grants, RLS policy conflicts.

### Phase 3: GitHub Actions CI

A workflow that runs on every push to `main` (or on PR, your call). Catches broken builds before Vercel deploys them.

**Create `.github/workflows/ci.yml`:**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        working-directory: web
        run: npm ci

      - name: Type check
        working-directory: web
        run: npx tsc --noEmit

      - name: Lint
        working-directory: web
        run: npx next lint

      - name: Unit tests
        working-directory: web
        run: npm test

      - name: Build
        working-directory: web
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ${{ secrets.STAGING_SUPABASE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_MAPBOX_TOKEN: ${{ secrets.MAPBOX_TOKEN }}
```

**What this gets you:** Every push runs tsc + lint + vitest + build. A red check on a PR means don't merge. Playwright evals can be added later (they need a running Supabase, which means either the Supabase CLI in CI or pointing at staging).

### Phase 4: Migration promotion workflow

The sequence for getting a database change to production safely.

```
1. Write migration in web/supabase/migrations/NNN_description.sql
2. Test locally:        supabase db reset  (rebuilds from scratch)
3. Push to staging:     supabase db push --linked  (with staging linked)
4. Verify staging:      Run the app against staging, confirm the surface works
5. Promote to prod:     supabase link --project-ref <prod-ref>
                        supabase db push --linked
6. Verify production:   Smoke test the live site
```

For now this is manual. A GitHub Action could automate steps 3–4 on PR merge and 5–6 on main push, but manual is fine for a solo founder through launch.

### Phase 5: Environment variables

Three sets, kept in sync.

| Variable | Local (`.env.local`) | Staging (Vercel) | Production (Vercel) |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://localhost:54321` | staging project URL | production project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | local anon key | staging key | production key |
| `SUPABASE_SECRET_KEY` | local service role key | staging secret | production secret |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | your token | same token | same token |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | staging Vercel URL | production domain |

Vercel supports per-environment env vars natively: Settings → Environment Variables → select Production / Preview / Development.

## Go-live checklist

Before flipping the switch for real users:

- [ ] Supabase CLI linked and all 34 migrations verified as applied on production
- [ ] Staging Supabase project exists with identical schema
- [ ] GitHub Actions CI passing on main
- [ ] Auth configured: email confirmation enabled, redirect URLs set for production domain
- [ ] RLS policies verified: run `supabase db lint` on production (checks for tables without RLS)
- [ ] Domain configured in Vercel + Supabase Auth redirect URLs
- [ ] Environment variables set in Vercel for both staging and production
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain (QR cards, share links, OG tags depend on it)
- [ ] Mapbox token scoped to production domain (prevents unauthorized usage)
- [ ] Rate limiting reviewed: Supabase has built-in API rate limits; verify defaults are sane
- [ ] Backups enabled: Supabase Pro plan includes daily backups; Free plan does not
- [ ] Error monitoring: consider Sentry or Vercel's built-in error tracking
- [ ] Analytics: Vercel Analytics and/or a lightweight alternative

## What this pipeline doesn't cover yet

- **Rollback strategy for migrations.** Supabase migrations are forward-only. If a migration breaks production, you write a new migration that reverses it. Worth having a playbook for this, but not blocking for launch.
- **Playwright evals in CI.** Requires either Supabase CLI running in the GitHub Action runner (adds Docker complexity) or pointing tests at staging (adds timing complexity). Solvable but not day-one.
- **Multi-developer branch isolation.** With one developer this isn't an issue. If you add contributors, each needs their own local Supabase or a per-branch staging strategy.
- **Seed data for staging.** Staging needs enough data to be useful for QA. The existing Folsom coffee seed is a start; the Sacramento crosswalk seed (90 rows) also needs to land.

## Related docs

- [`INFRASTRUCTURE.md`](../web/INFRASTRUCTURE.md) — the existing manual setup guide (predates this pipeline; still useful for first-time setup)
- [`playbooks/DEVELOPMENT-PATTERNS.md`](DEVELOPMENT-PATTERNS.md) — how we build; commit rules, branch-per-ticket, worktree conventions
- [`standards/`](../standards/) — safety, security, accessibility, performance requirements that the pipeline should enforce
