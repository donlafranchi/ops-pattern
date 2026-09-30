# ROADMAP

Now / Next / Later / Won't, one line each. Detail and days: `socialus-web` Issues (was `planning/now/initiative-launch.md`).

## Now — Fortnight 1, in build

- Page composer: address-or-neighbourhood location step, category step, photo step + takedown, default art, resume fix. Gated on Don making his own Page.
- Dead producer page fix — approved, ticketed, buildable today.
- Producer entry point (`/you/create`, no shop required to host) — reviewed, ticketed.
- Report path + image takedown — approved; no photo goes to production until this ships.
- Display name in public; flagged content auto-hides with an immediate reason and appeal, anything a member posts is reportable, and the reporter picks a reason the poster can rebut (F078, scope added 2026-09-30); no pictures of children from anyone, stated at posting with reports as the backstop (F080, 2026-09-30) — approved, gates launch alongside the report path.
- Metro waitlist at signup — pick a metro, say creator or patron, see a count in a popup. **Added 2026-09-14 at Don's direction; nothing was removed to make room.** F076.
- Patron signup (legal name, verified email, verified as a person — method open, zip; the zip determines the metro, every US zip known before launch; a line on what the app is for, 2026-09-30) and agreeing to the versioned rules before each new Page, selling and hosting alike — F081, F082. **Added 2026-09-14 at Don's direction; nothing was removed to make room. Both approved 2026-09-14.**

## Next — Fortnights 2–3

- Person-noun lint in `socialus-web` — fails the build on a person-noun in a user-facing string. Spec in `product/foundation/nouns.md`; a chore, opened as an Issue. **~16 strings fail today, plus the retired vendor routes.**

- Search (Pages only) + Browse rebuilt around Pages and gatherings.
- Popularity ordering with a reserved share for new Pages.
- Metadata rewrite; retired vendor routes redirected or removed.
- RSVP / response path — one per person.
- Follows simplification — one table, three subjects.
- **What's happening…** — a date, a time and a post-level address on an announcement (F072); **a series that repeats, weekly with optional bounds (F074, ruled 2026-09-20)**; the time lens rows (F091); narrowing in a modal that writes text (F092). The browse query shipped 2026-09-19 **and nothing calls it** — Explore still reads the old Item-grain view client-side. So it needs **two** things, a caller and a de-duplication rule, not the one change this line claimed until 2026-09-20. **The new cost is F073, recurrence, and the parser.** Recurrence is what makes the lens non-empty; Bulletins was cut to pay for it — see § Cut.
- Onboarding, empty states, copy pass — Fortnight 4.
- Seed content, synthetic and display-only — Fortnight 4.

## Later — deferred past launch, priced

- Real names between people who dealt with each other (F077, `socialus-web` #219) — **out of scope 2026-09-30; revisit with legal counsel.**
- Bulk actions on the review queue (F079) — written, unscheduled; waits on real volume. *(The ID + selfie tier left this line 2026-09-27: Don ruled none is being built, so F080 names no unlock.)*

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
- LLM-enhanced natural-language search ("sourdough near me Saturday") and SEO-structured public pages. **In-app answering is the next version after launch, not backlog for 2026-10-30** *(Don, 2026-09-21: "something I'd like to prepare for for the next version after")*. **What is wanted before launch is not building it but not foreclosing it** — five constraints in `planning/AGENT-ANSWERING.md`, each cheap now and expensive to retrofit. Paired with the crawler-blocking and thin-public-tier work in `socialus-web`.
- Saved-search subscriptions ("notify me: new products in Oak Park").
- Richer service-listing fields (appointment availability, scope of work), item lifecycle states (draft/paused/archived), stock indicators, bundled items.
- Community-attested (Tier 1) and document-verified (Tier 2) locality/provenance badges — Tier 0 self-attestation is all that ships at launch.
- Follow-stream notifications, item-level customer inquiry, follower-list management for a producer.
- Producer growth dashboard, weekly digest email, peer benchmarks.
- Hours-of-operation display, multi-location/ambulatory-route management, sub-venue support (e.g. "Drake's barn" under Drake's).
- On-platform payments — closed-loop ledger + ACH via a chartered partner, zero platform transaction fees on member commerce (the wealth-circulation rubric), a stablecoin path long-horizon.
- Treatment-review surface (reviews the treatment, never the person) and member references.
- Multi-owner/partnership business Pages, staff-confirmation flows, community-stewardship-to-business transition.

**Speculative, not ruled**
- When in-app purchasing exists, producer and purchaser see each other as far as the transaction needs *(Don, 2026-09-30)*.
- "Consumer" as a noun apart from patron. It currently has no separate meaning: someone who RSVP'd is inside the group, and nobody buys in the app yet *(2026-09-30)*.

## Cut — taken off the launch list, dated and reasoned

*Not the same as Won't. A cut thing is still wanted; it lost a trade against the deadline and may come back. A Won't thing is refused on principle and never comes back. Recorded here rather than quietly deleted, because a line that vanishes from Next leaves no trace of who decided or why.*

- **Bulletins — the member-audience half of a post** *(cut 2026-09-20, Don)*. **What left:** a post being delivered to the feed of everyone who follows a Page or belongs to its group. **What stayed:** the composer, and posts appearing in browse — both are what *What's happening…* runs on. **Why:** recurrence (F074) was ruled in the same day and is what makes the time lens non-empty; the launch list was already over, so something had to pay. **Cost of the cut:** a Page owner has no way to reach people who already follow them, which is the thing followers are for. **It comes back when** the time lens is shipped and the follower graph has enough density that delivery reaches more than a handful of people. **Re-examine this trade if F059 criterion 2b slips.** The cost above is survivable *only* because announcements from followed Pages are meant to surface on Explore for a signed-in reader — that is F059 criterion 2b, item 2 on Don's list, and **it is not built**. If it moves, a Page owner has no route to their own followers at all, and this stops being a deferral and becomes a hole. **Nothing built is discarded** — the subscription link exists in `group_memberships` and nothing reads it yet, so the cut removes unbuilt work. Reflected in F072 criterion 2.

## Won't

- Platform-generated QR codes — a producer's own business QR stays open as an unbuilt idea; the platform doesn't generate any.
- Activity badges, reputation scores, star ratings, ownership tiers — the platform never rates, ranks, or labels a person.
- Business-entity modeling — ownership transfer, succession, corporate shells. Membership is the only access-granting verb.
- Geofenced or auto-assigned group membership.
- Engagement-optimized ranking, infinite feeds, streaks, pull-back notifications.
- Venture capital funding.
- Legal or tax language between members or in Page creation; legal-entity information from anyone without a legal entity (2026-09-30).
- Full e-commerce catalog (variants, SKUs, cart), automated/dynamic pricing, inventory or warehouse management, POS/checkout, appointment-booking or calendar sync — the platform coordinates, it isn't a storefront or a booking system.
- Automated government-API verification of producer claims — the trust ladder is human-driven (self-attest → community-attest → document-upload) only.
- Mass-email marketing tooling, push notifications to non-followers, individual visitor-tracking analytics for a producer.
- Platform-custodied funds held for the platform's own benefit, lending, or credit.
- Payroll, HR, or employee management — the platform records who's associated with a Page, it doesn't manage employment.
