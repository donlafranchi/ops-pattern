# Bundle: b2 — Community Depth & Vendor Intelligence

**Release:** Post-MVP, after migration triggers in `b1-mvp.md` are met.

**North Stars Served:** N1 (deepen producer growth — T2 vendor intelligence, peer benchmarks, weekly digest), N2 (make following a daily habit — richer bulletins, comments), N3 (the onramp opens — first "create new makers" surface: educational landing + demand signaling), N4 (communities can organize and signal demand — demand signaling is the first community-organizing surface). See `product/foundation/north-stars.md` and `product/foundation/platform-promise.md` § Our Promise to Producers.

## Hypothesis

Once the marketplace loop is real, two things compound:

1. **Vendors stay because the platform makes them smarter.** Engagement insights, peer benchmarks, and a weekly digest turn Main Street from a posting tool into a growth tool.
2. **Buyers stay because the feed gets richer.** Beyond market sessions, the feed carries classes, community projects, and longer vendor stories — making the platform a real local-life surface, not just a shopping app.

This bundle also adds the trust scaffolding (community pin flagging, claim-listing, admin moderation) that becomes necessary at volume.

## Success Metrics (60 days post-b2)

- ≥ 70% of vendors visit their dashboard weekly
- ≥ 40% bulletin open rate (up from MVP target of 25%)
- ≥ 5 community projects or classes posted per market per month
- < 5% of pins flagged as inaccurate by community (signal of healthy data)
- ≥ 20% of new vendor signups arrive via "claim your listing" flow (community seeding working)

## Scope

### Polish & accuracy (deferred from b1)

| Ticket | What |
|--------|------|
| T020 | Community pin flagging — flag wrong pins, owners notified, resolve flow |
| T027 | Event surfacing on vendor profiles |

### Vendor Bulletin — T2

Per `product/systems/vendor-bulletin.md`:

- Markdown / rich text + inline photos
- Scheduling and drafts
- Welcome bulletin auto-send when someone follows
- Subject-line A/B testing
- Per-bulletin analytics drill-down (delivered → opened → clicked → shared funnel)
- Filter chips on Home: All / Markets / Vendor Specials / Bulletins

### Vendor Intelligence — T2 (Engagement Insights)

Per `product/systems/vendor-intelligence.md`:

- Follower segmentation (new / long-time / active / lapsing) with re-engagement CTA
- Discovery insights — referrer breakdown, top search terms, category rank
- Anonymized peer benchmarks ("your open rate vs similar vendors")
- Event insights (views, RSVPs)
- Weekly digest email (Monday: "Last week at [Vendor]…")

### Events — T2

Per `product/systems/events.md`:

- New event types: classes / workshops, community projects, vendor specials
- RSVP / "I'm going" with attendee count
- Event detail pages (replaces "tap → host profile" shortcut)
- Calendar view in Explore
- Recurring event templates

### Community trust at scale

| Capability | Source doc |
|------------|------------|
| Claim-listing flow | `product/capabilities/business-registration.md` |
| Community nominations (suggest a vendor / market) | `product/exploration/` |
| Ownership filters / saved lists in Explore | `product/products/ownership.md` |
| Full-text search across vendor names + descriptions | `product/products/business-data.md` |
| Admin moderation queue (review reports, flagged pins) | `product/products/community-platform.md` C10/staff |
| Travel / cross-market browsing | Active location header pill (deferred from MVP) |

### Two-tab You for vendors

Promote the vendor mode link from b1 to a full second tab on `/you`:

- **Shopper** — everything from b1
- **Business** — full founder dashboard surface from `vendor-intelligence.md` T2

### Mission expansion: seeding new makers

First in-app surface for the "create new makers" mission — still lightweight, but visible:

- "Become a maker" landing page with educational content
- Mailing list signup for prospective producers
- Demand signaling (consumers indicate "I'd buy this if someone made it locally") per `product/exploration/small-business-incubator.md` — read-only aggregate at b2; crowdfunding deferred to b3.

## Out of Scope (b3+)

- Crowdfunding for new makers
- Customer LTV / repeat supporter analytics
- Predictive recommendations / posting time suggestions
- Multi-location vendor tools
- Inbox / DMs between buyers and makers
- Push notifications
- Personalized feed ranking (beyond chronological + scope)
- Class / workshop *booking and payment* (b3 — needs commerce layer)

## Build-for-Future Reminder

Per the platform's "build-for-future" principle, every b2 ticket must extend — never replace — the schema laid down in T022. If a feature requires a new table, it must include the same forward-looking columns (event sourcing, soft-delete timestamps, referrer tracking) as the b1 foundational schema.
