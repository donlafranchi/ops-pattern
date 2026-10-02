# SocialUs — Who to Copy & Design Resources

> **Reference, 2026-10-01 — research notes.** Rulings drawn from it live in `DECISIONS.md`.

Oct 1, 2026 · @don

## Summary

Copy Airbnb for browse, Luma for the Page components and Google Business Profile for inline owner editing; tags show [OBSERVED] = seen live on 2026-10-01, signed out; [ARTICLE] = help docs or articles; [ESTIMATE] = arithmetic.

- **Top 3 to copy:** Airbnb (list/map, detail page, "View" as guest) · Luma (follow + member tiers with approval + events/RSVP on one page) · Google Business Profile (edit on the public listing, "Suggest an edit", products & services). AllTrails is 4th: its floating "Get directions" bar suits sending traffic to venues.
- **Owner tools:** a 360px panel that pushes the Page over (doesn't cover it) from 1280px; an overlay below that; on phones a bottom bar opening one sheet at a time, with long flows on full pages.
- **List/Map:** a floating bottom-centre pill on phones and tablets; side by side from 1024 with the control on the seam; when the owner panel squeezes the map out (1280–1439), a List | Map switch docks in the sticky filter bar.
- **Breakpoints:** 640 / 744 / 1024 / 1280 / 1536, content capped at ~1680.
- **Top 5 resources (all free):** WCAG 2.2 + ARIA patterns · NN/g · GOV.UK Design System · Baymard free tier · Apple HIG sheets + Material 3.

## Who to copy

Airbnb, Luma and Google Business Profile cover every SocialUs surface between them; every product checked keeps browse and detail open signed out and asks for sign-in only when someone saves, follows or registers.

| Product | Named pattern | SocialUs component | Tag |
| --- | --- | --- | --- |
| [Airbnb](https://www.airbnb.com/s/Sacramento--CA/homes) | List and map side by side (~50/50), sticky map, "Show fullscreen map" | List/Map browse ≥1024 | [OBSERVED] |
| Airbnb | "Show map" floating pill; map with draggable list sheet on phone | List/Map phone | [OBSERVED] |
| [Airbnb listing](https://www.airbnb.com/rooms/728226172522865341) | Sticky section links + right-rail action card; fixed bottom action bar on phone | Page detail, "Get directions" / "Visit site" | [OBSERVED] |
| [Airbnb Listings tab](https://www.airbnb.com/resources/hosting-homes/a/introducing-the-listings-tab-638) | "View" = see the listing exactly as guests do | The Page as seen | [ARTICLE] |
| [Airbnb Today](https://www.airbnb.com/resources/hosting-homes/a/reservations-redesigned-765) | Accept/Decline and message right on each item (May 2026) | People queue | [ARTICLE] |
| [AllTrails](https://www.alltrails.com/us/california/sacramento) | Sticky map ~52/48; map position saved in the URL | Desktop browse, shareable map | [OBSERVED] |
| [AllTrails trail](https://www.alltrails.com/trail/us/california/american-river-bike-trail-and-levee-path-loop) | Floating bar "Save \| Get directions \| Send to phone" | Page detail → venue traffic | [OBSERVED] |
| [AllTrails pins](https://support.alltrails.com/hc/en-us/articles/46153616589204-Updated-Explore-Pins) | Saved/completed marks on map pins (Feb 2026) | Followed/visited Pages on map | [ARTICLE] |
| [Luma memberships](https://help.luma.com/p/calendar-memberships) | One page: Follow, member tiers above, events below; per-tier "require approval" with pending count → Approve/Decline | Followers, members with approval | [ARTICLE] |
| [Luma event](https://luma.com/5sdsz3uc) | "N Going" with names, one Register button, map; Waitlist / Sold Out / Near Capacity labels; UTM-tagged host links | Events + RSVP; venue traffic | [OBSERVED] |
| [Eventbrite](https://www.eventbrite.com/help/en-us/articles/811539/how-to-set-up-an-event-waitlist/) | Waitlist auto-offers freed spots with a claim deadline | Event waitlist | [ARTICLE] |
| [Meetup](https://help.meetup.com/hc/en-us/articles/360002878091-Controlling-who-joins-a-Meetup-group) | One approval checkbox + up to 5 questions | Simplest approval settings | [ARTICLE] |
| [Facebook Groups](https://www.facebook.com/help/android-app/214260548594688) | Up to 3 questions, request filters, Approve all, auto-approve rules | Bulk approval (later) | [ARTICLE, search snippet] |
| [Patreon](https://support.patreon.com/hc/en-us/articles/16433886029325-How-free-memberships-can-help-grow-your-community) | Posts scoped Public / Free members / All members; cancelled paid member stays free | Announcements audience; member → follower | [ARTICLE] |
| [Substack](https://support.substack.com/hc/en-us/articles/18261513315348-How-does-following-work-on-Substack) | Follow (feed) vs Subscribe (inbox) | Light follow that feeds recommendations | [ARTICLE] |
| [Nextdoor](https://help.nextdoor.com/s/article/Business-Page-Faves?language=en_US) | "Fave" (support + follow) separate from a written recommendation | Recommend, don't force, follows | [ARTICLE, search snippet] |
| [Google Business Profile](https://support.google.com/business/answer/3039617?hl=en) | Owner hits Edit profile → Save on the public listing; others get "Suggest an edit"; products & services | Inline owner editing; products & services | [ARTICLE] |

## Owner tools

Use a Shopify-style live Page with a push panel, entered from the Page itself as Google Business Profile does; this fits our right panel and phone bar as planned.

| Approach | Examples | Fit for SocialUs |
| --- | --- | --- |
| Live preview + side panel beside it | [Shopify theme editor](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/features-overview) [OBSERVED], Wix, Ghost | Best fit; Shopify drops to settings sliding up from the bottom on narrow screens, like our sheets |
| Edit from the public listing | Google Business Profile [ARTICLE] | Adopt the entry point; skip Google's review-before-live delay |
| Separate hosting mode + "View" | Airbnb [ARTICLE] | Borrow "View as visitor" and the action queue only |
| Switch identity + separate dashboard | Facebook [ARTICLE] | Only for analytics and bulk work behind Page settings |

- **Panel:** 360px from 1280, 400px from 1536, collapsible; becomes an overlay at 1024 and below, as [Atlassian's layout panel](https://atlassian.design/components/navigation-system/layout/usage) does [OBSERVED]; Material 3 side sheets max out at 400 [ARTICLE].
- **The Page as seen:** one-tap "View as visitor" that hides owner controls; show two cues you're editing (tinted bar + "You're editing" chip), per [NN/g on modes](https://www.nngroup.com/articles/modes/) [OBSERVED].
- **People:** Luma's queue: pending count, Approve/Decline with optional message, bulk approve.
- **Tell people:** full-height compose sheet on phones (Apple skips half-height for compose) [ARTICLE].
- **Add to your Page / Page settings:** full pages on phones; [NN/g](https://www.nngroup.com/articles/bottom-sheet/) says no stacked sheets, a visible Close, Back dismisses, and sheets don't replace page flows [OBSERVED].
- **Everywhere:** a Save/Discard bar and a leave-with-unsaved-changes prompt, like [Shopify's Save Bar](https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/save-bar-api); keep the panel plain so it isn't ignored as ad-like right-rail content ([NN/g](https://www.nngroup.com/articles/fight-right-rail-blindness/)).

## List/Map

The toggle floats on small screens and disappears once list and map fit side by side; its fixed home on large screens is the seam between them, or the sticky filter bar when the owner panel forces one view.

| Site | ~390 | ~768 | ~1280 | ~1440 |
| --- | --- | --- | --- | --- |
| Airbnb | Map behind a draggable list sheet; "Show map" pill bottom-centre above tab bar, stays fixed [OBSERVED] | One view, list default; "Show map" pill fixed bottom-centre while scrolling [OBSERVED] | Side by side, no toggle [OBSERVED] | Side by side; "Show fullscreen map" icon on map [OBSERVED] |
| Google Maps | Map default; "View list" bar at bottom [OBSERVED] | 408px list panel over map, collapse chevron [OBSERVED] | Same + left rail [OBSERVED] | Same [OBSERVED] |
| Zillow | List default; floating "Map \| Sort" pill bottom-centre [OBSERVED] | Blocked by bot check | Blocked | Not checked |
| AllTrails | Blocked | Blocked | Blocked this pass; earlier load showed list left, sticky map right [OBSERVED] | Not checked |
| Yelp | Blocked | Blocked | Blocked | Not checked |

Airbnb switches to side by side between 851 and 950px [OBSERVED]. Widths under 768 ran with a phone user agent, so those results may be the sites' phone builds.

| Band | A | B | C | Pick |
| --- | --- | --- | --- | --- |
| Phone 360–743 | Floating "Map"/"List" pill bottom-centre — thumb reach; covers a little content | Map with draggable list sheet — richest; costly, drag fights scroll | List \| Map switch in sticky filter bar — always visible; hard to reach | **A**, list default |
| Tablet 744–1023 | Same pill — consistent; wastes width | List panel over map — both visible; cramped portrait | Side by side from ~950 like Airbnb — best use of width; a third layout | **A**, revisit C if tablet traffic is landscape |
| Laptop 1024–1279 | Side by side, collapse chevron on the seam, expand icon on map — the seam is the home | Side by side + List \| Map \| Both switch — redundant | One view only — wastes width | **A** |
| ≥1280, owner panel open | List, map, panel as three columns — all visible; map ~400px at 1280 [ESTIMATE] | Map collapses, List \| Map switch docks in sticky filter bar — list readable; map hidden while editing | Panel covers the map — list stable; pins hidden | **B at 1280–1439, A from 1440**, switched by the browse area's width |

All floating and sticky controls must meet [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/): never hide keyboard focus (2.4.11), at least 24×24px (2.5.8), and a non-drag alternative to map panning (2.5.7).

## Design resources

Five free resources cover most decisions; pay only for a month of a screenshot library if we need competitor flows.

| # | Resource | Take this | Tag |
| --- | --- | --- | --- |
| 1 | WCAG 2.2 ([new in 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)) + ARIA patterns ([Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)) | Rules for pill, sheets, pins; RSVP can't ask twice (3.3.7); email-link login is fine (3.3.8); keyboard/focus behaviour for sheets | [OBSERVED] |
| 2 | NN/g: [Bottom sheets](https://www.nngroup.com/articles/bottom-sheet/), [Mobile maps](https://www.nngroup.com/articles/mobile-maps-locations/), [Modes](https://www.nngroup.com/articles/modes/) | No stacked sheets, visible Close; list default on mobile; two cues for edit mode | [OBSERVED] (maps study is 2014) |
| 3 | [GOV.UK Design System](https://design-system.service.gov.uk/components/) | Tested owner forms: error summary, date input, summary list, task list (Page setup checklist), character count; MIT code | [OBSERVED] |
| 4 | Baymard free tier: [Map listings](https://baymard.com/ecommerce-design-examples/map-listings), [Applied filters](https://baymard.com/blog/how-to-design-applied-filters) | Map-listing examples; sticky Filter button, removable chips, "Show X results"; paid plans from $200/mo not worth it pre-launch | [OBSERVED] / [ARTICLE] |
| 5 | [Apple HIG Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) + Material 3 ([bottom sheets](https://m3.material.io/components/bottom-sheets/guidelines), [side sheets](https://m3.material.io/components/side-sheets/specs)) | Half/full-height sheets, grab handle, swipe to dismiss; side sheet 320–400 wide | [OBSERVED] HIG; M3 [ARTICLE] |

- **Also take:** [Atlassian](https://atlassian.design/components) Inline edit and Layout panel (closest to our owner panel); Shopify Save Bar.
- **Skip:** Shopify Polaris React, deprecated [OBSERVED].
- **Pattern libraries:** [Page Flows](https://pageflows.com/pricing/) $39/quarter [OBSERVED]; Mobbin or Refero ~$10–16/mo [ARTICLE]; [UI-Patterns](https://ui-patterns.com/) still updated but screenshots are old.

## Breakpoints

Use Tailwind's set with md moved to 744 and the persistent owner panel from 1280; phones run 360–440 CSS px ([StatCounter](https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide)) and 13–16" laptops 1280–1728 [OBSERVED].

| Name | From (px) | Devices | Browse | Owner tools |
| --- | --- | --- | --- | --- |
| base | 0 | Phones 360–440 | List default, floating Map pill | Bottom bar → one sheet at a time; long flows full page |
| sm | 640 | Phone landscape, foldables | 2-column cards allowed | Same; sheets max ~560 wide |
| md | 744 | iPad mini, iPad, iPad Air 13 portrait | Pill, one view at a time | Overlay side sheet ≤400 |
| lg | 1024 | iPad landscape, narrow windows | List and map side by side | Panel as overlay, 360 |
| xl | 1280 | 1920@150%, 1366, 13" Air 1470, 14" Pro 1512 | Side by side; with panel open, List \| Map in filter bar | Persistent push panel, 360 |
| 2xl | 1536 | 1920@125%, 15" Air 1710, 16" Pro 1728 | Side by side + panel fit | Panel 400 |
| cap | ~1680 | 24–27" desktops | Centred, map may run full width | Reading text ≤ ~760 |

At 1280 a ~380px panel leaves ~880px for content vs ~620 at 1024 [ESTIMATE], which is why the panel only stays open from 1280. Use container queries for cards (94.8% browser support, [caniuse](https://caniuse.com/css-container-queries)). Test at 360, 393, 440, 744, 820, 1024, 1280, 1470, 1536, 1728, 1920.

## Gaps and sources

Nothing was signed up for, logged into or submitted; owner screens were never seen signed in.

- AllTrails, Yelp and Zillow larger widths were blocked by bot checks (not bypassed).
- Google Business Profile's inline panel, Airbnb's desktop listing editor and Facebook/Nextdoor flows are from help docs or search snippets.
- Material 3 spec numbers and Airbnb's breakpoints are unverified; NN/g's map study is from 2014.
- The 1280 panel threshold is arithmetic, not a usability study; check against our own analytics.

**Sources:** [Airbnb search](https://www.airbnb.com/s/Sacramento--CA/homes) · [Airbnb listing](https://www.airbnb.com/rooms/728226172522865341) · [AllTrails Sacramento](https://www.alltrails.com/us/california/sacramento) · [Luma memberships](https://help.luma.com/p/calendar-memberships) · [Luma waitlist](https://help.luma.com/p/waitlist) · [Google Business Profile edit](https://support.google.com/business/answer/3039617?hl=en) · [Shopify theme editor](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/features-overview) · [Atlassian layout](https://atlassian.design/components/navigation-system/layout/usage) · [NN/g bottom sheets](https://www.nngroup.com/articles/bottom-sheet/) · [WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) · [Tailwind breakpoints](https://tailwindcss.com/docs/responsive-design) · [Android window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes) · [StatCounter desktop US](https://gs.statcounter.com/screen-resolution-stats/desktop/united-states-of-america). Full research notes are in my working folder.
