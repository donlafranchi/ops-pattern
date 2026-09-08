---
purpose: Decision awaiting PM ruling — does the standing badge require real activity, or does holding the right role alone earn it? Surfaced as a promise collision by T132's role-vocabulary fix, not new scope.
layer: how
status: backlog
---

# Decision — does "Active in the community" require activity?

**Raised:** 2026-09-07, during T132 (founder membership role branches by Group kind). Not new scope — T132 fixed a bug (every Group founder was incorrectly assigned `role='owner'`); this decision is about a pre-existing badge whose correct behavior T132's fix exposed for the first time.

## What's true in the code today

`public.member_has_standing_presence` (`web/supabase/migrations/014_groups.sql:344-350`) is **role-only**:

```sql
where (g.kind = 'business' and gm.role in ('owner','staff'))
   or (g.kind <> 'business' and gm.role = 'steward')
```

No activity count, no published Item, no elapsed time — only an active membership (`left_at is null`) on a non-dissolved Group with the right role. `web/src/lib/member/resolve-member-page.ts:176-182` reads this view; `web/src/components/member/MemberPublicPage.tsx:37-44` renders it as a chip, "Active in the community," on the public Member page (`/m/[handle]`).

**Before T132:** every Group founder — business and non-business alike — was assigned `role='owner'` (a bug). Non-business founders never matched the view's `steward` branch, so the badge never rendered for them. The badge only ever fired for business owners/staff.

**After T132:** non-business founders correctly hold `role='steward'`. The moment `group.create` runs, the founder satisfies the view's condition — the badge appears on their public page having done nothing beyond typing a name and clicking create.

## The collision

`product/foundation/principles.md`'s People-First Principle and the platform's own "never rates, ranks, or labels a person" line — the same reasoning that killed ownership tiers and sourced-values badges — applies directly here. A badge every founder holds on day one, before publishing a single Item or hosting a single gathering, doesn't distinguish anything. Worse, it's the platform attaching a label to a person rather than a person's own activity speaking for itself.

**This is not hypothetical for business founders either** — the same role-only gate has always applied to them; T132 didn't touch that branch. Whatever gets decided here likely applies to both branches of the view, not just the non-business one T132 exposed.

## Options

1. **Require activity.** Gate the view on at least one published Item, or a gathering hosted, or some minimum tenure — not role alone. Closes the collision; needs a migration (the view's `where` clause) and a decision on what "activity" means (one Item? a time threshold? something else).
2. **Leave it role-only, accept the badge means "has a Page," not "is active."** Requires rewriting the badge's copy/framing so it doesn't imply activity it doesn't measure — "Active in the community" would need to become something more honest, e.g. naming the Page's existence rather than its activity.
3. **Retire the badge.** Consistent with the ownership-tier and sourced-values precedent — if a durable, honest signal can't be cheaply defined, don't ship a label at all.

## Not decided here

T132 shipped and merged regardless of this decision — the role-vocabulary bug fix is correct on its own terms and the badge behavior it exposes is a pre-existing gap, not something T132 introduced net-new (the same gate has always governed business founders). This stub exists so the badge question gets its own ruling rather than riding through unnoticed.
