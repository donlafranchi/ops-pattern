---
purpose: Decision — whether per-branch preview deployments are worth standing up, given that they need a non-production database and preview-scoped env vars.
layer: how
status: backlog
---

# Decision: preview deployments

**Raised by:** the 2026-09-03 retrospective. Pushing more often is decided; preview deployments are **not**, and this stub exists so the second doesn't arrive disguised as the first.

## What pushing gets us, and what it doesn't

Pushing `main` after every merge closes the feedback gap that let 20 web commits and 32 parent-repo commits accumulate unseen. It does **not** give per-branch previews, because branches are created, merged and deleted locally and never reach GitHub at all.

## The constraint

`web/.vercel/project.json` links this repo to a Vercel project, so **`git push origin main` deploys to production.** That is the cost of the push decision and it should be stated plainly rather than discovered.

Per-branch previews are a separate build. `web/.env.vercel.local` already carries a header reading *"Scope: Preview + Development"* — the intent existed — but the values in it point at the **same Supabase project as production**. So previews as currently configured would either fail on missing env vars or write against the production database. Neither is acceptable.

## The decision to make

1. **Is a second Supabase project (a preview/staging database, seeded from the showcase seed) worth the cost?** That is the real work — the env vars are trivial once a database exists to point them at.
2. **If yes, do branches start being pushed?** Previews only exist for branches that reach GitHub. That changes the worktree/branch lifecycle in `build` and `close`, both of which currently delete branches locally.
3. **If no, what stands in?** Production-push-per-merge plus a local screenshot at 375×812 in the ticket's Completion section is the cheap substitute, and it is what checklist 4 in `playbooks/process-checklists.md` already asks for.

## Recommendation

Defer. Push-to-production per merge plus screenshots closes most of the 2026-09-03 feedback gap at zero infrastructure cost. Revisit when there are real users on production and deploying an unreviewed surface to them stops being free.
