---
id: how-f035-rosa-finds-mayas-shop
purpose: Viewer (Rosa) finds Maya's Shop via shared URL and lands on the public business-Group page.
layer: how
status: done
closed_on: 2026-06-02
---

# F035: Rosa finds Maya's Shop

**Bundle:** b1
**Sub-bundle:** b1.2 — Business Groups & makers
**Work-map item:** b1.2 → 🟢 "Find a Group's public page" (from `bundle-1-checklist.md`)
**Loops:** 7 (Buy close), 8 (Follow what you love)
**Canonical example:** [P1 — A producer creates a profile and lists their products or services](../../product/needs/use-cases.md#p1-a-producer-creates-a-profile-and-lists-their-products-or-services); secondary anchor [C1](../../product/needs/use-cases.md#c1-a-member-searches-for-whats-nearby-and-follows-what-they-love) (neighbor-of-Maya's-bakery archetype).
**Primitive shape:** Person(Rosa) → Group(kind='business', Maya's Shop) → read public surface → optional Person → `member_follows` → Group.
**Status:** backlog

> **Why this shape?** F036 ships the write side: Maya creates her Shop. F035 ships the read side: someone arrives at the public URL Maya can share. Without F035, Maya's Shop exists but no one can find it. The two scenarios are a write-side/read-side pair inside b1.2; both are required before the producer floor is shippable.

## The Person

**Rosa Mendez**, a longtime Oak Park resident who's lived three blocks from Maya for six years. She's heard about Maya's sourdough from a neighbor on the porch and got a text from Maya yesterday: "hey here's where i'm selling — [link]." Rosa wants to see what Maya makes, whether she's actually local, who's behind the Shop, and (if she likes what she sees) follow so she hears about new bakes.

Today she'd do this by clicking through Instagram, Yelp, Google, three different sites — and probably give up before she got a clear answer to "is Maya a real local baker?" The platform's answer is one page, one URL, one moment of recognition.

## The Story

Rosa taps the link in her text-message thread. The platform loads the public page for Oak Park Sourdough at `/p/sacramento/oak-park/g/oak-park-sourdough`. The page leads with the Shop name "Oak Park Sourdough" in brand voice, the "Claimed local owner" badge near the title, and Maya's name and avatar as the founder — tappable through to Maya's Member page.

Below the header, an Items section sits empty for now ("Maya hasn't listed anything yet — check back soon"). Rosa scrolls; there's a Follow CTA. She's logged in (she signed up last week via F030), so the CTA reads "Follow Oak Park Sourdough." She taps it. The button confirms her follow; she's now in Maya's follower set, ready to receive bulletins once Maya posts them (b2 surface).

If Rosa weren't logged in, the page would still render fully — the public surface is anonymous-readable. The Follow CTA would route her through a lightweight signup prompt before persisting the follow.

If Rosa pasted the URL while Maya's Shop was still in `lifecycle_state='draft'` (Maya hadn't completed the walkthrough), the page would 404 to Rosa but render the draft preview to Maya herself (per the RLS policy `groups_select_active_or_own_draft` from T070).

## Surfaces

- **Entry point:** Direct URL navigation to `/p/[…place path]/g/[slug]` — typically pasted from text, shared from a search result, or arrived via a future locality-feed surface card.
- **Primary action:** Read. The surface is the artifact; no composer.
- **Secondary action:** "Follow {Shop name}" CTA, scoped to logged-in viewers; anonymous viewers see "Sign up to follow."
- **Composer / interaction:** None. F035 is a read-only surface.
- **Completion:** The viewer either follows, navigates to a linked Member or Location page, or leaves. No required action.
- **Discovery:** This page is itself the discovery target — the canonical share URL Maya can text, post, or print on a flyer (QR codes ship at F041). Future surfaces (locality feed, search) will surface this page; F035 doesn't build those.

## Data Captured

| User-language field | Schema mapping | Required? |
|---|---|---|
| (none — read-only surface) | — | — |

Implicit (read by the surface, not asked of the viewer):
- `groups.id` resolved from the URL's `[slug]` + the place path
- `groups.lifecycle_state` (only `'active'` Groups render publicly to non-owners; `'draft'` renders to owners only per T070's RLS)
- `group_businesses.display_name` (the brand label that wins per `groups.md` line 260)
- `group_memberships` where `role='founder'` to find the founder Member
- `member_business_jurisdictions` joined via `public.zip_is_proximal_to_location()` to determine whether the "Claimed local owner" badge renders
- `items` where `group_id = $group_id` AND `kind='product' OR 'service'` AND `state='published'` for the Items section (empty at F035 ship — F038/F040 haven't shipped)

On Follow tap (logged-in viewer):
- `member_follows` row written via the action layer with `target_kind='group'`, `target_id=$group_id`
- `group.followed` event emitted same-transaction with `acting_member_id` = Rosa

## Acceptance Criteria

### Story beat 1 — Page loads and renders the Shop header

**Given** Maya has completed the Sell walkthrough (per F036), her Shop is `lifecycle_state='active'`, and the URL is `/p/sacramento/oak-park/g/oak-park-sourdough`
**When** Rosa navigates to that URL
**Then** the page loads and displays:
- The Shop's brand-label heading (sourced from `group_businesses.display_name`) as the primary `<h1>`. _Why: per `groups.md` line 260, the brand-label precedence rule says `group_businesses.display_name` wins over the Location's `brand_label` — eval should verify the rendered heading text matches the Group's display_name, not the anchor Location's._
- The founder Member's display name and avatar, linked to `/m/{handle}`. _Why: per `groups.md` § No-personhood guarantees (line 354+, `items.member_id NOT NULL`), the Group surface keeps a named human visible as the load-bearing accountability. The founder link is the structural commitment to person-anchoring; eval verifies the link target resolves to the founder's Member page._
- A short brand description if Maya set one in the walkthrough; absent gracefully if not.

### Story beat 2 — "Claimed local owner" badge renders for Tier 0 self-attested locality

**Given** Maya holds an active `member_business_jurisdictions` row with `verification_source='self_attested'` whose ZIP passes `public.zip_is_proximal_to_location()` against the Shop's `anchor_location_id`
**When** the page renders
**Then** a "Claimed local owner" badge displays near the Shop name. _Why: per `business-jurisdiction.md` T1 § Surfaces, Tier 0 surfaces the badge with the "Claimed" label — the public evidence tier is the transparency answer. Eval verifies both badge presence AND the "Claimed" qualifier text (not just "Locally Owned" — the tier label is load-bearing per `business-jurisdiction.md` Intent line 34)._

**And given** Maya holds no jurisdiction record OR her ZIP fails the proximity test
**Then** the badge does NOT render — the surface remains clean, no "not locally owned" negative space.

### Story beat 3 — Items section renders empty-state for now (forward-dep until F038/F040)

**Given** no `items` rows exist with this `group_id`
**When** the page renders
**Then** the Items section shows an empty-state copy ("Maya hasn't listed anything yet — check back soon") instead of a hidden section. _Why: visible-but-empty signals "Shop is real, products will come" — hidden signals "this is a half-built page." Eval verifies the empty-state heading + body text._

### Story beat 4 — Logged-in viewer sees Follow CTA and the follow persists

**Given** Rosa is logged in and not currently following Oak Park Sourdough
**When** the page renders
**Then** a "Follow Oak Park Sourdough" button displays prominently. _Why: per `member.md` § Follows substrate and the b1.2 work-map item, follow is the standing form of "tell me when this Shop has news." Eval verifies button presence and label._

**When** Rosa taps Follow
**Then** the action layer writes a `member_follows` row + emits `group.followed` event in the same transaction, and the button state flips to "Following" (with secondary "Unfollow" affordance).

### Story beat 5 — Anonymous viewer sees the same page minus the follow persistence

**Given** Rosa is not logged in
**When** the page renders
**Then** the page renders identically except the Follow CTA reads "Sign up to follow" and routes through the signup flow before persisting the follow. _Why: per the policy posture in `policy.md` and the opt-out default, public Group pages are publicly readable; gating on signup happens only at the write moment. Eval verifies both that anonymous viewers see the page (no 401/302) AND that the Follow CTA copy changes accordingly._

### Story beat 6 — Draft Groups return 404 to non-owners; render preview to the owner

**Given** Maya started the Sell walkthrough but hasn't activated the Group (Shop is `lifecycle_state='draft'`)
**When** Rosa navigates to the URL
**Then** the page returns 404 (per the RLS policy `groups_select_active_or_own_draft` from T070).

**When** Maya navigates to the same URL while logged in as the founder
**Then** the page renders a draft preview with a "Draft — not yet public" banner and a "Resume walkthrough" CTA. _Why: per the T070 schema decision, draft Groups are owner-visible so Maya can preview her own work-in-progress; non-owners see the page as if the Group doesn't exist, preventing leakage of half-finished surfaces. Eval verifies both the 404 to anonymous viewers AND the draft banner to the founder._

## Edge Cases

- **Dissolved Group:** A Group with `lifecycle_state='dissolved'` returns 404 to everyone, including the founder. The URL doesn't redirect — the page reads as if the Shop never existed (per `groups.md` line 365).
- **Group with no anchor Location:** Should not happen at F036 since the walkthrough requires an anchor; if encountered, render the page without the locally-owned badge and log a data-integrity warning. Do not 404.
- **Multi-owner Shop:** If Maya later adds a co-owner, the founder field still renders Maya (immutable per `groups.md`); the locally-owned badge sources from "any current owner's jurisdiction" per `business-jurisdiction.md` line 50 OR-aggregation rule.
- **Anchor Location renamed or moved:** Page renders with the current Location data; URL stays at the Shop's place path (per ADR-20 path stability).

## Assumptions

- F036 has shipped (the write surface that creates these Shops).
- T070's `groups.lifecycle_state` column and RLS policy are live.
- The action layer's follow handler (`member.follow` or equivalent) exists or is part of F042 substrate work. If not yet built, F035's Follow CTA defers to F042 ticket completion.
- The `public.zip_is_proximal_to_location()` function exists per S-jurisdictions substrate. If S-jurisdictions hasn't shipped, the Locally Owned badge step is held back as a downstream-dep DEVIATIONS entry — the rest of F035 ships independently.
- ADR-20 URL routing (`/p/[…place]/g/[slug]`) is operational from F036's ship.

## Out of Scope

- **Items rendering with real products/services** — depends on F038 (list a product) and F040 (list a service). F035 ships the empty-state copy; live Items light up when those scenarios ship.
- **Bulletins / posts inside the Group** — per `bundle-1.md`: "Posting surfaces inside Groups (feeds, discussion) → b2."
- **Locally Made badge on individual Items** — F039's scope; surfaces on Item pages, not the Group page.
- **Owner-edit affordances on the Shop page** — owner-side controls (edit name, change anchor, add product CTA-in-context) deferred to b2 producer dashboard.
- **Community-Group rendering** (Run Club, neighborhood interest group) — separate scenario, same F-number with a different slug, defer until F034 ships (community Groups want gatherings to be interesting to view).
- **QR card** — F041.
- **Search and locality-feed surfacing** — F035 builds the destination page; discovery surfaces are tracked separately.
- **Follow stream / notifications** — per `bundle-1.md`: "Follow streams, notifications, persistent feeds — stored at b1, surfaced at b2." Follow row writes at b1; rendering the resulting stream is b2.

## Capabilities unlocked

- **Producer presence & findability** — completes the P1 "public Group page at `/p/[…place path]/g/[slug]`" capability. Realizes the b1.2 "Business Group page with 'Claimed local owner' badge (Tier 0)" line from `bundle-1-themes.md`.
- **Consumer awareness foundation** — the destination half of the C1 follow loop. Follow CTA realizes the b1.2 follow-primitives line.
- **Discovery share target** — the canonical URL Maya texts, shares, or eventually prints (F041 QR). The producer's commitment of "if I do my work, the platform makes me findable" lands here.

## Gate A summary (Cowork pre-flight)

Spec sections cited and their absolutes' ratification state:

| Spec section | Absolute(s) cited | State |
|---|---|---|
| `groups.md` § Spine + child data model | schema constraints (line 354 `items.member_id NOT NULL`, 360 Groups can't hold Delegations, 364 action-layer refusal of corporate-shell shapes) | ✓ Ratified (Intent lines co-located, ratified during F036 weigh on 2026-05-31 and prior) |
| `groups.md` § Locality and promotion | locality derived not stored (Intent line 325, ratified) | ✓ Ratified |
| `groups.md` § Discoverability and visibility (lines 341–348) | working defaults — no absolute phrasing | ✓ N/A |
| `groups.md` § Policy posture (line 370+) | no auto-assignment | ✓ Ratified 2026-05-31 |
| `business-jurisdiction.md` § T1 § Behavior + OR-aggregation | Tier 0 self-attested at b1; OR-across-owners | ✓ Ratified 2026-05-23 + 2026-05-31 (Intent lines 34, 44, 50) |

**Gate A verdict: PASS.** All cited absolutes carry State-tagged Intent lines; no walk-the-PM step required before promotion to `planning/next/`.
