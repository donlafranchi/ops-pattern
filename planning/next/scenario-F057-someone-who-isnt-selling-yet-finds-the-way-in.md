---
purpose: Scenario — becoming a producer is a deliberate act. You keeps its shape; the producer surface appears behind a become-a-producer action, and the recruitment grid becomes the pre-producer state of the page rather than a footer stapled under it.
layer: how
status: next
---

# F057: Someone who isn't selling yet finds the way in

**Bundle:** b1 (SocialUs v1)
**Sub-bundle:** v1 workstream 4 — **the You half, as a modification.** See § Scope boundary.
**Work-map item:** [`bundle-1.md`](../now/bundle-1.md) § What ships in v1 — workstream 4, and [`audit-vendor-market-retirement.md`](../backlog/audit-vendor-market-retirement.md) § 7 Phase 2. **Prior art: [`audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) §§ 2.4, 2.5, 3.1.**
**Loops:** 2 (Declare something), 7 (Make and be found), 9 (Make a living locally)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services)
**Primitive shape:** Person → (their own Groups and Items). **No new entity, no new table, no new column.**
**Spec contract:** [`decision-surfaces.md`](../backlog/decision-surfaces.md) § *You is not the account page* · [`audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) · [`principles.md`](../../product/foundation/principles.md) § People-First Principle
**Status:** next — **approved 2026-09-07** (PM approved the six removals and the one repurpose in § Table disposition). Review: [`review-F057.md`](review-F057.md).

> **Revised 2026-09-04 after the PM's read that You is largely fine as-is.** The earlier version of this scenario scoped a rebuild. That was wrong on two counts: it treated a working page as broken, and it put producer machinery in front of every Member whether or not they had asked for it. **Becoming a producer is a deliberate act, and the producer surface lives behind it.**

## The Person

Devon signed up ten minutes ago because a neighbour sent a link. He makes hot sauce. He is not a farmers-market vendor, does not think of himself as a business, and would not describe what he does as *listing*.

**And most people who tap You are not Devon.** They are people checking what they follow. **The page is mostly right for them already** — it holds your own things, and it should keep doing that. What it does wrong is show the producer machinery to everyone and speak the previous product's language while doing it: *"Your Market · Not set,"* saved and followed **vendors**, *"Are you a business owner? List your business →."*

## The Story

**Devon, who has not asked to sell anything.** He taps **You**. It is about him: his name, what he follows, his settings. Below that, where the page has room, is an invitation — not a button hidden in a corner, but the page's own empty half: *"We're looking for makers in Oak Park."* Rows of dashed open-spot cards — *Home Baker · Bicycle Mechanic · Fermentation Workshop · No one listed yet* — each with **List here — it's free**, and one worked example showing what a good listing looks like. At the top, one clear control: **Start something.**

He taps it. He picks *Sell something*. The shop walkthrough opens — the same five steps that already ship.

**Devon, ten minutes later.** He is a producer now. **You looks different, because he did something.** Where the invitation was, there are shop rows — one per Page he holds, starting with *Devon's Hot Sauce*: **Edit shop**, and **Add a product · Add a service · Host a gathering**. Below it, **Your listings**. His following and his settings are exactly where they were.

**Rae, who has no interest in selling.** She taps You and sees what she follows and her settings, and one quiet invitation below it that she scrolls past. **Nothing asks her to be a business.**

## Surfaces

- **Entry point:** the **You** tab.
- **The state that changes:** *pre-producer* — the invitation is the page's second half; *producer* — the shop rows, the create path, and the Member's listings occupy that half instead.
- **The act that switches it:** completing the shop walkthrough. **There is no separate "become a producer" toggle** — creating a shop is the act, and the surface follows from state that already exists.
- **Unchanged:** following, settings, sign-out. **The Member's non-producer half of You is not rebuilt.**

## Data Captured

**None.** No new table, no new column, no new event. The producer/pre-producer condition is the same query `/you/sell` already runs — `group_memberships` joined to `groups` on `kind='business'` and `lifecycle_state='active'` — and the old page already computed an equivalent flag (`hasVendor`) to decide whether to show recruitment. **The condition was already right; only its placement was wrong.**

## Scope boundary — read this before scoping

**This is a modification, not a rebuild.** What actually changes:

1. Seven dead-table reads come out (`businesses`, `markets`, `market_vendors`, `vendor_categories`, `supports`, `follows`, `user_preferences`) and the surfaces they fed — *"Your Market"*, `MarketSelector`, the vendor saved/following tabs, the vendor-mode link, the email toggle.
2. The recruitment grid moves from a footer to the page's pre-producer state, and its content is rewritten off Sacramento-and-selling.
3. A producer state is added: shop rows, create path, listings.
4. Vendor vocabulary leaves, including from the signed-out shell.

**What is kept as-is:** `SellCta`'s three-branch routing (F036, evals green), `FollowingSummary` (T108, F042), the tab pattern, sign-out.

### Relationship to workstream 4

Workstream 4 is two halves: **(a)** fold Explore into Home and retire the tab; **(b)** the You change. **This is (b).** [`decision-photo-upload.md`](../backlog/decision-photo-upload.md) § 7 recommends deferring (a) — it reverses three tickets merged inside 48 hours and strands F044/F045. **The nav stays at three tabs for v1** and the persistent **+** defers with the fold. If the PM keeps the full merge, only the create entry point moves.

## Table disposition — the seven dead reads

> **Added 2026-09-07 at PM instruction.** Each read on `/you` diagnosed individually: remove it if nothing needs it, repurpose an existing table if one fits, create only if launch requirement 1 or 2 genuinely needs it. **Bias to removing and repurposing.** Verified against the live production database on 2026-09-07 — none of the seven tables exists, and none appears in the migration lineage. Every read fails silently and returns empty, which is why the page renders as a signed-in shell with nothing in it.

**Result: create nothing, repurpose one, remove six.**

| Read | What it was for | Call | What replaces it |
|---|---|---|---|
| `businesses` — existence check, then row fetch | *Does this Member have a shop?*, then the shop's fields | **Repurpose** | `group_memberships` joined to `groups` on `kind='business'` and `lifecycle_state='active'` — the query `/you/sell` already runs, and the helper `hasActiveBusinessGroup` already wraps. This is the whole producer/pre-producer condition. |
| `user_preferences` — read + upsert | The follow-email opt-out toggle | **Remove** | Nothing. No notification email ships at launch, so the toggle governs a behaviour that does not exist. If email preferences return, they belong on the existing `member_privacy` row — **do not stand up a parallel preferences table.** |
| `supports` | The *Saved* tab — saved businesses | **Remove** | Nothing at launch. There is no save-a-shop primitive; `item_responses` with `response_kind='save'` saves **Items**, not shops, so this is not a repurpose. The Saved tab goes with it. |
| `follows` | The *Following* tab — followed vendors | **Remove** | Already shipped and already on the page. The follow summary reads the real substrate — `member_follows` for people, `group_memberships` for groups, `member_saved_searches` for venues. This read was redundant the day the new one landed. |
| `vendor_categories` | Primary-category label on each vendor card | **Remove** | Nothing. The category taxonomy is cut from launch, and no composer collects a category. |
| `markets` | The *"Your Market"* row and the market picker | **Remove** | Nothing. The markets mechanic is retired. `MarketContext`, `MarketSelector` and `useMarket` go with it — the provider was already unhooked from the layout, so this is the last tether. |
| `market_vendors` | *"Next: Saturday"* on each vendor card | **Remove** | Nothing at launch. The need it served — *when can I find you* — is answered instead by the free-text "where they'll be next" line on the shop editor (decided 2026-09-07, [`../DECISIONS.md`](../DECISIONS.md)). |

**Nothing is created.** No new table, no new column, no new event type, no new action handler. Launch requirements 1 and 2 are met by substrate that already exists — which is the finding, not a coincidence: the page was never missing data, it was reading the previous product's copy of it.

**Surfaces that leave with the reads:** the *"Your Market"* row and picker, the vendor cards, the Saved and Following tabs, the email toggle, the *"Switch to vendor mode"* link, and the signed-out *"Are you a business owner? List your business →"* block. **Sign-out survives** — it is the only thing the Settings tab does that anything still needs.

**One thing this scenario does not fix.** The producer entry point is still `/you/sell`, which means hosting a gathering still requires opening a shop. That is the companion scenario, and this one must not quietly absorb it — the create path it renders points wherever the entry point ends up.

## Acceptance Criteria

### You stops speaking vendor

**Given** `/you`, signed in or out
**When** it renders
**Then** it contains no occurrence of *vendor*, *market*, or *business owner*, and issues no query against the seven dead tables. _Why: **verifiable by grep, not judgment.** Those tables do not exist; every read fails silently and returns empty. The vocabulary is the worse half — a platform whose thesis is people declaring things where they live currently greets every signed-in Member with the previous product's language at a primary nav destination._

### A Member who has not become a producer is not shown producer machinery

**Given** a Member with no active business Group
**When** they open `/you`
**Then** they see their own things and one invitation. **No shop rows, no composer controls, no listings section, no drafts.** _Why: the PM's read, and it is the right one — producer tooling in front of someone who has not asked for it is the vendor-era mistake in a new vocabulary. Becoming a producer is a deliberate act and the surface should follow it, not precede it._

### The invitation is the page's pre-producer state, not a footer

**Given** the same Member
**When** the page renders
**Then** the recruitment surface occupies the page's second half as its own state — **not** appended below a stack of other sections. _Why: [`audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) § 2.4. The old code already computed the right condition (`!hasVendor`) and rendered the result in the wrong place. This corrects the placement and keeps the design._

### The invitation reads as opportunity, not as absence

**Given** the pre-producer state
**When** it renders
**Then** it shows open-spot cards naming specific kinds of maker in the Member's own locality, and at least one worked example of a good listing. _Why: the hardest problem a launch-density local platform has is that empty looks dead. Dashed "open spot" cards read as **vacancies**; a blank section reads as **nothing here**. And the journey audit's finding was that the one frame that teaches anything teaches by example — the old grid solved that once and the solution should not be thrown away with the code._

### The invitation covers making, offering, and hosting — not just selling

**Given** the pre-producer state
**When** it renders
**Then** its categories span products, services, **and gatherings**, and its locality copy derives from the Member's place rather than a hardcoded city. _Why: the old grid was ten selling categories hardcoded to Sacramento. The new model's producer also hosts and offers services — and **the concrete failure is that the only route to the gathering composer is `/you/sell`, which redirects unless the Member has an active business Group, so a neighbour hosting a run club must open a shop first.** That is the People-First Principle inverted at the most visible surface in the product._

### The existing sell routing is preserved exactly

**Given** each of the three states — no shop and no draft, an in-flight draft, ≥1 active shop
**When** the Member uses the start control
**Then** they reach the walkthrough at step 1, the walkthrough resumed at its saved step, or their shop's controls. F036's evals stay green **unmodified**. _Why: this routing shipped and works. If an eval needs changing, the routing changed and that is an escalation, not an edit._

### A producer sees their own things

**Given** a Member with ≥1 active business Group
**When** they open `/you`
**Then** one row per shop with **Edit shop** and the three composer controls, and a **Your listings** section grouping their Items by shop. Reuse `/you/sell`'s existing query — **do not write a second one.** _Why: You is "what's mine, and what's happening with it." A producer who just listed something and cannot find it from their own tab cannot check that it worked — step 6 of the journey from the producer's side._

### Following and settings are untouched

**Given** either state
**When** the page renders
**Then** `FollowingSummary` behaves exactly as shipped and sign-out remains reachable. _Why: this scenario is a modification. The half of the page that works is not in scope, and sign-out currently lives inside a settings tab that is otherwise being emptied — it must not leave with it._

### The signed-out shell stops selling vendorhood

**Given** an anonymous visitor on `/you`
**When** it renders
**Then** it explains what You is for and offers sign-in, with no vendor vocabulary and no *"List your business →"* funnel. _Why: `/join` was repointed at `/you` on 2026-09-03, so this shell is now the destination of the platform's own recruitment link, and it answers with the previous product's pitch._

### The duplicate Following surface stops being reachable

**Given** a request to `/following`
**When** it resolves
**Then** it redirects to `/you/following`. _Why: two Following surfaces are live and both routable. It is the one user-perceivable item inside the deferred deletion phases, and a redirect deletes nothing._

## Edge Cases

- **In-flight draft shop** — resume branch keeps *"Continue setting up your shop."* Whether a draft counts as producer-state: **it does** — someone mid-walkthrough has made the deliberate act and should not be shown the invitation again.
- **Several shops** — one row each. `/you/sell` already handles it.
- **Follows things, creates nothing** — Following renders, pre-producer invitation renders. Both true at once.
- **A producer who dissolves their only shop** — reverts to pre-producer. Not a v1 path (no dissolve surface), but the condition is derived rather than stored, so it falls out correctly.
- **`hasVendor` / "Switch to vendor mode"** — removed with the dead query behind it, which also fixes the live defect where *"List your business →"* shows to **every** signed-in Member because the suppression query fails ([`audit-vendor-market-retirement.md`](../backlog/audit-vendor-market-retirement.md) § 1.3).
- **Accessibility** — M3 fires. Headings in order; the start control a real button with an accessible name; the two page states must each be coherent to a screen reader rather than one being the other with things hidden.

## Assumptions

- `SellCta` / `SellWalkthrough` shipped and green (F036). **Verified.**
- `FollowingSummary` shipped (T108) and self-omits when empty. **Verified.**
- `RecruitmentGrid` is on disk and readable as reference. **Verified — and it must not be deleted before this ships** ([`audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) § 6).
- Nav stays at three tabs for v1.

## Out of Scope

- **The Explore→Home fold and the persistent nav +.** Half (a).
- **Deleting the vendor-era files.** Gated on T126 now, not on a date. The `/following` redirect is the one carve-out.
- **A separate "become a producer" toggle or opt-in row.** Creating a shop **is** the act. A second switch in front of it is a step that teaches nothing.
- **`ownership_tier`, ownership badges, the extractiveness ramp.** [`audit-vendor-prior-art.md`](../backlog/audit-vendor-prior-art.md) § 3.1 — the previous thesis, deliberately left.
- **Producer analytics.** `producer-tools.md` § Growth, b2.
- **Member profile editing.** Gap, recorded in [F056](../next/scenario-F056-producer-gives-their-shop-a-face-and-says-what-they-stand-for.md).
- **Drafts and responses sections.** Part of the full You definition; not v1.

## Capabilities unlocked

- **Producer self-service** — steps 1→2 of the ratified journey. The walkthrough exists and cannot currently be found.
- **A cold-start surface that reads as opportunity** — the recruitment design, kept and repositioned rather than deleted with the code that held it.
- **The retirement's user-visible half**, without waiting on 51 file deletions.
