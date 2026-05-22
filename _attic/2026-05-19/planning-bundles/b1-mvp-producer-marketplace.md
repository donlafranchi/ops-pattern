# Bundle: b1 MVP — Producer Marketplace

**Release:** Beta (Sacramento farmers markets)

**North Stars Served:** N1 (producers get found, get paid, grow — via founder dashboard, follower analytics, bulletins), N2 (buyers find local options and stick with them — via follow + bulletin loop), N5 (wealth circulates locally — every follow → market visit converts a casual transaction into a recurring local relationship). See `product/foundation/north-stars.md` and `product/foundation/platform-promise.md` § Our Promise to Producers.

## Hypothesis

If buyers can follow local producers and hear from them between market days, they'll show up more often and spend more — and producers will treat Main Street as their growth tool, not just a directory.

The map was the original framing; it's now a second-class discovery view inside Explore. The marketplace is built around three loops:

1. **Buyer loop** — open the app → see what's happening at my market this week → follow a maker → hear from them between visits.
2. **Maker loop** — claim a listing → tell my story → broadcast to followers → see who's listening.
3. **Future hook (BI for makers)** — even at MVP, makers see follower count, growth, and profile views. This is the credibility commitment behind the recruitment pitch ("we'll help you compete with bigger players"). Full intelligence ships in b2.

## Success Metrics (post-launch, 60 days)

- ≥ 30 active producers across Sacramento markets (Folsom, Sacramento Central, Roseville)
- ≥ 40% of registered buyers follow ≥ 1 vendor
- ≥ 25% bulletin open rate (in-app + email combined)
- ≥ 60% of vendors who publish a bulletin publish a second within 30 days
- Median weekly active vendors (login + any action) ≥ 50% of registered

## Scope

### Shipped (T001–T018, T021–T024)

| Ticket | What |
|--------|------|
| T001–T011 | Project init, schema, auth, registration, share, support, report |
| T012 | Markets schema + Sacramento seed data |
| T013 | Bottom navigation shell |
| T014 | Home feed (Etsy-style, static rails — superseded by T024) |
| T015 | Explore — search + list/map toggle |
| T016 | Market selection modal |
| T017 | Vendor profile (slug routing, market schedule) |
| T018 | Follow vendor + nightly email notifications |
| T021 | Tide accent + CTA pattern rollout (auth gate modal, recruitment panel, sticky mobile CTA) |
| T022 | Foundational schema (events, bulletins, vendor analytics, follow soft-delete) |
| T023 | `/you` restructure (Saved, Following, Settings, Vendor entry point) |
| T024 | Events-driven Home feed (market sessions auto-render, pinned bulletin section, telemetry) |

### Remaining MVP work

These three tickets close the loop from "directory" to "marketplace." All are scoped lean — anything richer is b2.

| Ticket | What | Why MVP |
|--------|------|---------|
| T019 | Geocoding + pin confirmation during registration | Pin accuracy is non-negotiable even with map demoted — wrong pins erode trust on Explore map |
| T025 | Vendor bulletin compose + delivery (T1 only — text + photo, in-app card + email, rate limit) | This is "makers communicate with buyers." Without it, follow is hollow — and the pinned bulletin section in T024 has nothing to render. |
| T026 | Vendor founder dashboard (T1 only — followers, profile views, top tasks, listing health) | The elusion to the BI future. Backs the vendor pitch. |

### Explicitly deferred (b2 or later)

- T020 — Community pin flagging *(needs vendor volume to matter)*
- T027 — Event surfacing on profiles *(fast-follow after T025)*
- All T2 features in `vendor-bulletin.md`, `vendor-intelligence.md`, `events.md`
- Class / workshop / community project event types
- RSVP, comment, share-to-feed
- Two-tab "You" structure for vendors (current single tab + vendor link is enough at MVP)
- Admin moderation queue, claim-listing flow
- Travel mode / cross-market browsing
- Push notifications

## Migration Trigger (when to ship b2)

Ship b2 when **any two** of the following hold:

- 50+ active vendors across ≥ 3 cities
- 200+ buyers following ≥ 1 vendor
- 10+ vendors publishing bulletins weekly
- Pin-accuracy complaints or duplicate-listing reports become a daily occurrence

## Mission Tie-In

This MVP makes Main Street useful to existing producers. It does not yet *create* new makers — that surface (educational content, "become a maker" path, demand signaling, eventually crowdfunding) belongs in later bundles per `product/exploration/small-business-incubator.md`. The MVP earns the right to ask people to start a business by first proving we can grow one.
