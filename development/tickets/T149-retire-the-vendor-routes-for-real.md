# T149: Retire the vendor routes in the app, not just in the docs

**Scenario:** substrate — no new user-facing surface. Removes surfaces that were retired on paper and left routable.
**Status:** Open — buildable.
**Bundle:** launch
**Depends on:** nothing. **Blocks:** nothing. **Related:** T148 (metadata) — if that lands first, two of its findings vanish with these files.

**Serves:**
- **Loop:** 9 (Make a living locally) — a producer who follows a live link into a retired surface lands somewhere the product no longer supports.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** none — route removal.

## What was found

**Three routes were retired in the documentation and left fully routable in the application**, each with its own page and its own metadata:

- `/vendors/[slug]` — the old vendor profile.
- `/business/[slug]` — the old business listing.
- `/register-vendor` — the old producer signup.

**No middleware, no redirect, no `next.config` rewrite sends any of them anywhere.** They render.

## What links to them — check before removing, per the ticket brief

**This is the reason the three routes get three different answers.**

| Route | Inbound links found in `src/` | Disposition |
|---|---|---|
| `/vendors/[slug]` | **Four live components** — the following list, `VendorCard`, `EventCard`, `BulletinFeedCard` | **Redirect, do not remove.** Something in the shipped app still points here. |
| `/business/[slug]` | **One** — `BusinessDetailCard` builds a share URL from it, so this address may already exist outside the app in someone's messages | **Redirect.** A share URL is the one kind of link we cannot see or fix. |
| `/register-vendor` | **Producer-tools surface only** (`/you/vendor`, itself retired), plus two comments already noting it as retired | **Remove.** Its only callers are on the same retirement list. |

**The rule this encodes: a route with live inbound links gets a redirect; a route whose only callers are themselves retired gets deleted.** Removing a linked route converts a working link into a 404, which is a worse outcome than an extra redirect.

## What changes

### 1. Redirect the two linked routes

`/vendors/[slug]` → the member page for that vendor's owner. `/business/[slug]` → the equivalent Page.

**Permanent redirects (308), in `next.config.ts`, not client-side.** A share URL that has left the building needs the server to answer it.

**If a slug cannot be mapped to a current Page** — the vendor rows are retired substrate — **redirect to browse rather than 404.** Someone following an old link should land somewhere useful, not on an error.

### 2. Delete `/register-vendor` and its page

**Read `src/app/register-vendor/page.tsx` before deleting it.** It is the prior art for address geocoding — it calls the geocoding module directly, which is the wiring **T142 needs**. **Do not delete it before T142 has taken what it needs.** Recorded as a sequencing constraint, not a suggestion.

### 3. Do not touch the four linking components in this ticket

They point at retired surfaces because they are themselves part of the retired vendor model. **They belong to the vendor sweep, which is its own scope.** This ticket makes their destinations safe; it does not rewrite them.

### 4. The stale worktree

**`web-t133/` is still on disk** with its own complete copy of `supabase/migrations/`, including 038 and 039.

**Remove it:** `git worktree remove ../web-t133` (with the lock pre-flight first). If the branch merged, delete the branch too.

**And add the hazard to the drift check** (`scripts/migration-conformance.sh`): a second copy of the migration set on disk is a real hazard, not tidiness. **A migration edited in the wrong copy is invisible to `db:push` and to every review** — the file that ships is the one in `web/`, and nobody looks at the other. **The check should report any `supabase/migrations/` directory outside `web/` and say why it matters.**

## Acceptance Criteria

- [ ] `/vendors/[slug]` and `/business/[slug]` issue a **308** to the current equivalent, or to browse when no mapping exists. **Server-side.**
- [ ] `/register-vendor` returns 404 and its page file is deleted — **after T142 has taken the geocoding wiring**, or with a note in the ticket saying it already had it.
- [ ] No link in `src/` resolves to a 404 as a result of this ticket. **Verified by following each of the five inbound links found above.**
- [ ] `web-t133/` is gone and its branch is deleted if merged.
- [ ] The drift check reports migration directories outside `web/`, with a message explaining the hazard rather than just naming the path.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3** — does not fire. No new surface; two redirects and a deletion. **Stated, not waived.**
- [ ] **M4** — does not fire. No migration.
- [ ] **DEVIATIONS entry**, including whether any inbound link could not be mapped to a current destination.

## Notes

- **The general lesson, worth one line somewhere permanent:** retiring a surface in the docs is not retiring it. **The route is retired when the route is gone or redirected**, and until then the documentation is describing an app that isn't the one running.
- **Do not add a blanket catch-all redirect.** Three routes, three deliberate answers.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
