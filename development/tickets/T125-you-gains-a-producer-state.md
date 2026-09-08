# T125: You gains a producer state, and the invitation becomes its pre-producer state

**Scenario:** `planning/next/scenario-F057-someone-who-isnt-selling-yet-finds-the-way-in.md`
**Status:** Open
**Bundle:** b1 (v1 workstream 4 — the You half)
**Depends on:** nothing
**Blocks:** T126 (Edit shop hangs off the shop row this creates)

**Serves:**
- **Loop:** 2 (Declare something) — the only door to declaring is currently behind a page that asks whether you are a business owner.
- **Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
- **Primitive shape:** Person → their own Groups and Items. **No new entity, table, or column.**

> **Rescoped 2026-09-04.** The first draft of this ticket rebuilt `/you`. The PM's read — that You is largely fine and the producer parts belong behind a deliberate act — is correct, and this is now a **modification**. Materially smaller: two states over one page, one query that already exists, and a component that is already on disk.

## Checklist 2 — writing tickets

- [x] **Gate C — review present.** `planning/next/review-F055-F058-self-serve-producer.md`. PROCEED on F057.
- [x] **Gate B — clear.** `decision-surfaces.md` § *You is not the account page* carries `Intent (Ratified 2026-09-03)`.
- [x] **All three `Serves` lines resolve.**
- [x] **Cited spec last-changed dates.** `product/foundation/principles.md` and `product/ui/design-language.md` — `Fri Sep 4 02:16:26 2026 -0700`.
- [x] **Governing DLS recipe named.** `design-language.md` § *Card*, § *Button*, § *Empty state*. **No new component** — composition and copy over shipped recipes, plus one component adapted from disk (see § Prior art).

## Prior art — read before writing code

[`planning/backlog/audit-vendor-prior-art.md`](../../planning/backlog/audit-vendor-prior-art.md) §§ 2.4, 2.5, 3.1.

**`src/components/RecruitmentGrid.tsx` is the reference for the pre-producer state and it is on disk.** Read it first. It already: computes the right condition on `/you` (`{!hasVendor && <RecruitmentGrid />}`), renders dashed open-spot cards that make emptiness read as vacancy, ships one worked example per category plus a full-fidelity featured example, and sets expectations numerically (*"Free · 90 seconds · No fees, ever"*).

**What it gets wrong for this model:** ten hardcoded Sacramento categories, all of them selling. **Reuse the card design and the page structure; replace the array.**

**Do not carry `ownership_tier` or `OwnershipBadge` in any form** (§ 3.1) — that is the previous thesis, and it is the platform grading people, which the never-sourced constraint forbids.

## What changes

`src/app/you/page.tsx` — two states over one page. One redirect in `next.config.ts`. One dead read removed from `AuthCtaButtons`.

**Kept, load-bearing, `/you/page.tsx` is their only importer:** `SellCta` (T073 / F036) and `FollowingSummary` (T108 / F042).
**Removed from the page, not from disk:** the seven dead-table reads, *"Your Market"*, `MarketSelector`, the vendor saved/following tabs, the vendor-mode link, the email toggle.

## Acceptance Criteria

- [ ] **Grep-verifiable:** `src/app/you/page.tsx` contains no `vendor`, `market`, or `business owner`, and no `.from('businesses'|'markets'|'market_vendors'|'vendor_categories'|'supports'|'follows'|'user_preferences')`.
- [ ] **Producer condition** derived from the existing `/you/sell` query (`group_memberships` × `groups`, `kind='business'`, `lifecycle_state='active'`, `left_at is null`). **One query, reused — do not write a second.** An in-flight draft counts as producer state.
- [ ] **Pre-producer state:** the Member's own things, then the invitation as the page's second half — **not appended under a stack of other sections.** One primary **Start something** control. **No shop rows, no composer controls, no listings section.**
- [ ] Invitation cards read as vacancies (dashed open-spot treatment) and include **at least one worked example** of a good listing.
- [ ] Invitation categories span **products, services, and gatherings**, and locality copy derives from the Member's place — not a hardcoded city. *(The old grid was ten selling categories hardcoded to Sacramento; the concrete failure it papers over is that the gathering composer is only reachable through `/you/sell`, which redirects unless you already have a business Group.)*
- [ ] **Producer state:** one row per shop with **Edit shop** (slot; T126 fills it — render it disabled or omit cleanly until then) and **Add a product / Add a service / Host a gathering**; plus **Your listings** grouping the Member's Items by shop, each linking to its public page.
- [ ] **`SellCta`'s three branches behave exactly as today.** F036's evals pass **unmodified**. If an eval needs editing, the routing changed — escalate, do not edit.
- [ ] `FollowingSummary` behaves exactly as shipped. **Sign-out stays reachable** — it currently lives in a settings tab that is otherwise being emptied and must not leave with it.
- [ ] Signed-out shell explains what You is for and offers sign-in. No vendor vocabulary, no *"List your business →"*.
- [ ] `/following` → `/you/following` redirect in `next.config.ts`.
- [ ] `AuthCtaButtons`' dead `businesses` read and `hasVendor` branch removed. *(Fixes the live defect where "List your business →" shows to **every** signed-in Member because the suppression query fails.)*
- [ ] **The app builds with every vendor-era file still on disk. No deletions in this ticket.**
- [ ] Screenshots at 375×812: signed out, pre-producer, producer-with-a-listing.
- [ ] `BUILD-LOG.md` updated.

## Workflow gates

- [ ] **Checklist 4** — fires. All five items, no bare N/A.
- [ ] **M2 `engineering:code-review`** before commit.
- [ ] **M3 `design:accessibility-review`** — fires. New primary control and two page states. **Each state must be independently coherent to a screen reader** — not one state with the other's content hidden.
- [ ] **M4** — does not fire. No migration. Stated, not waived.
- [ ] **DEVIATIONS entry**, including one line on appearance.
- [ ] **Close-out reconciliation.** `audit-vendor-market-retirement.md` § 3.1 and § 7 Phase 2 describe a rebuild — **correct them in place to a modification**, and record that Phases 3–5 are now gated on T126 rather than on a date.

## Notes

- **Do not delete the vendor-era files, and specifically do not delete `RecruitmentGrid.tsx`, `VendorCard.tsx`, `/vendors/[slug]`, or `/you/vendor` — they are T125's and T126's reference material.** With `MarketProvider` already unhooked from the root layout, the dead subtree is orphaned and harmless after this ticket.
- **There is no separate "become a producer" toggle.** Creating a shop is the act; the state is derived. A second switch in front of the walkthrough is a step that teaches nothing.
- **`design:ux-copy` is worth running here.** Almost all of this ticket is words, and it is where the PM's stated v1 priority — teach and guide simply, do not get in the way — is most directly testable.
- Drafts and responses sections are part of the full You definition and are **not** v1.

## Completion

Date: {YYYY-MM-DD}
Commit: {pending}
