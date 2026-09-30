---
id: F095
title: Where I work — a Page component for routine routes and response areas
status: draft
date: 2026-09-30
depends: [F094]
---
## Story

Rosa runs a landscaping crew that already mows lawns in East Sacramento and Land Park every week. On her Page she adds "where I work" and names those two neighbourhoods as her **routine route**. Sam, in Land Park, wants someone to cut his lawn who is already nearby, finds Rosa, and can see she is right among others who use her. Luis is a plumber who takes a call from anywhere; he sets a **response area** instead — the area he will come out to — which says nothing about where he already is. Don, 2026-09-30: *"a Landscaper who already does work in the neighborhood and perhaps on their page they can say which neighborhoods they already working and then that can be found by people nearby ... in contrast to say a plumber who can get a call from anywhere ... or they can say the area that they will respond in as opposed to someone who regularly comes out for routine work in areas."*

## Acceptance

1. **Any Page owner can add a "where I work" component**, with its short explanation (2026-09-30 components ruling), and choose routine route or response area.
2. **A routine route names places where the owner already works regularly;** a response area names where they will come out to. The Page shows which it is.
3. **A member looking for a service can find Pages whose routine route or response area covers a place they name.**
4. **Nothing shows a distance, and nothing narrows what a member sees below the metro** (2026-09-30, F094).
5. **"Others nearby who use them" reveals nobody's transaction** unless that person chose to show it.

## Not this

Not launch. Not booking or calendar sync (ROADMAP Won't). No map radius, no "near you". No per-customer list. Not approved.

## Why

[open-question owner=don raised=2026-09-30] How does finding by neighbourhood fit "local = the whole metro", "no distance shown" and nearness deferred until critical mass (F094)? A) **A place filter the member types, not a ranking by nearness:** the route is where the Page is, which F094 allows at any grain, and nothing is sorted by distance. B) Wait until nearness returns with critical mass. *Recommend A;* it is the "where it usually shows up" rule applied to a service.

[open-question owner=don raised=2026-09-30] How does "others nearby who use them" work when transactions are visible only to their parties? A) **An aggregate count per neighbourhood, shown only at or above the floor of ten distinct members** (F089), e.g. "10+ neighbours in Land Park". B) Opt-in: a customer chooses to show they use Rosa. C) Both. *Recommend A;* B needs a consumer visibility setting, which is parked with messaging.

[open-question owner=don raised=2026-09-30] Does a launch-size version already fit a Page's "where it usually shows up" (2026-09-30, no-distance ruling) as plain text, with no new component? A) **Yes:** Rosa writes "Mowing weekly in East Sac and Land Park" and the text search finds it. B) No: the routine/response distinction needs the structured component. *Recommend A for launch, this scenario after.*
