# ROADMAP

Now / Next / Later / Won't, one line each. Detail and days: `socialus-web` Issues (was `planning/now/initiative-launch.md`).

## Now — Fortnight 1, in build

- Page composer: address-or-neighbourhood location step, category step, photo step + takedown, default art, resume fix. Gated on Don making his own Page.
- Dead producer page fix — approved, ticketed, buildable today.
- Producer entry point (`/you/create`, no shop required to host) — reviewed, ticketed.
- Report path + image takedown — approved; no photo goes to production until this ships.
- Legal name required, display name in public, real names exchanged mutually between people who actually interacted and reachable no other way (F077, amended 2026-09-14); flagged content auto-hides with an immediate reason and appeal (F078); no child content without a stronger-verified tier (F080) — approved, gates launch alongside the report path.
- Metro waitlist at signup — pick a metro, say creator or patron, see a count in a popup. **Added 2026-09-14 at Don's direction; nothing was removed to make room.** F076.
- Patron signup (legal name, email, zip; zip suggests a metro shortlist; the no-sale line as published copy) and the one-time self-attestation before a first Page, selling and hosting alike — F081, F082. **Added 2026-09-14 at Don's direction; nothing was removed to make room. Both approved 2026-09-14.**

## Next — Fortnights 2–3

- Person-noun lint in `socialus-web` — fails the build on a person-noun in a user-facing string. Spec in `product/foundation/nouns.md`; a chore, opened as an Issue. **~16 strings fail today, plus the retired vendor routes.**

- Search (Pages only) + Browse rebuilt around Pages and gatherings.
- Popularity ordering with a reserved share for new Pages.
- Metadata rewrite; retired vendor routes redirected or removed.
- RSVP / response path — one per person.
- Follows simplification — one table, three subjects.
- Bulletins (`page_posts`, member audience) — first item on the cut list if slack runs out.
- Onboarding, empty states, copy pass — Fortnight 4.
- Seed content, synthetic and display-only — Fortnight 4.

## Later — deferred past launch, priced

- ID + selfie verification tier (unblocks child-related content per F080) and bulk actions on the review queue (F079) — both written, unscheduled; wait on real volume/demand.

- Item-level photos — substrate built, ~half a day when resumed.
- Volunteering (offer/ask composer) — blocked on messaging, not on the composer.
- The idea mechanic (wonder composer) — specced and substrate shipped, composer/page missing.
- Metro scoping — ticket written, returns with a second metro.
- Page-level appearances at venues — ~1.5 days, scoped.
- Follow-substrate merge and the map's area rendering — both scoped.
- Member-to-member messaging — no substrate at all; blocks a volunteering reply channel.
- Structured recurring-location scheduling — priced v2 buy-back for the free-text "where they'll be next" line.
- Paid visibility / advertising mechanic — gated on passing the member-benefit test; not designed.
- Cooperative coordination tooling (voting, distributions) — waits on documented demand.
- LLM-enhanced natural-language search ("sourdough near me Saturday") and SEO-structured public pages.
- Saved-search subscriptions ("notify me: new products in Oak Park").
- Richer service-listing fields (appointment availability, scope of work), item lifecycle states (draft/paused/archived), stock indicators, bundled items.
- Community-attested (Tier 1) and document-verified (Tier 2) locality/provenance badges — Tier 0 self-attestation is all that ships at launch.
- Follow-stream notifications, item-level customer inquiry, follower-list management for a producer.
- Producer growth dashboard, weekly digest email, peer benchmarks.
- Hours-of-operation display, multi-location/ambulatory-route management, sub-venue support (e.g. "Drake's barn" under Drake's).
- On-platform payments — closed-loop ledger + ACH via a chartered partner, zero platform transaction fees on member commerce (the wealth-circulation rubric), a stablecoin path long-horizon.
- Treatment-review surface (reviews the treatment, never the person) and member references.
- Multi-owner/partnership business Pages, staff-confirmation flows, community-stewardship-to-business transition.

## Won't

- Platform-generated QR codes — a producer's own business QR stays open as an unbuilt idea; the platform doesn't generate any.
- Activity badges, reputation scores, star ratings, ownership tiers — the platform never rates, ranks, or labels a person.
- Business-entity modeling — ownership transfer, succession, corporate shells. Membership is the only access-granting verb.
- Geofenced or auto-assigned group membership.
- Engagement-optimized ranking, infinite feeds, streaks, pull-back notifications.
- Venture capital funding.
- Legal or tax language, or entity-type/formation data, in any user-facing copy.
- Full e-commerce catalog (variants, SKUs, cart), automated/dynamic pricing, inventory or warehouse management, POS/checkout, appointment-booking or calendar sync — the platform coordinates, it isn't a storefront or a booking system.
- Automated government-API verification of producer claims — the trust ladder is human-driven (self-attest → community-attest → document-upload) only.
- Mass-email marketing tooling, push notifications to non-followers, individual visitor-tracking analytics for a producer.
- Platform-custodied funds held for the platform's own benefit, lending, or credit.
- Payroll, HR, or employee management — the platform records who's associated with a Page, it doesn't manage employment.
