---
id: F095
title: Where I work — a Page component for routine routes and response areas
status: draft
date: 2026-09-30
depends: [F094]
---
## Story

Rosa runs a landscaping crew that already mows lawns in East Sacramento and Land Park every week. On her Page she adds "where I work", names those two neighbourhoods as her **routine route**, and says in her own words that she has clients there. Sam, in Land Park, wants someone nearby to cut his lawn and finds Rosa. His neighbour Ana, who uses Rosa, chooses to vouch for her. Luis is a plumber who takes a call from anywhere; he sets a **response area** instead — where he will come out to — which says nothing about where he already works. Don, 2026-09-30: *"a Landscaper who already does work in the neighborhood and perhaps on their page they can say which neighborhoods they already working and then that can be found by people nearby ... in contrast to say a plumber who can get a call from anywhere ... or they can say the area that they will respond in as opposed to someone who regularly comes out for routine work in areas."* And: *"This isn't about showing neighbors other neighbors. It's about the service provider saying others in this neighborhood have a contract with me."*

## Acceptance

1. **Any Page owner can add a "where I work" component**, with its short explanation (2026-09-30 components ruling), and choose routine route or response area.
2. **A routine route names places where the owner already works regularly;** a response area names where they will come out to. The Page shows which it is.
3. **"I have clients in these neighbourhoods" is the owner's own statement.** No customer is named, listed or counted from transactions.
4. **A neighbour can vouch for a provider, by their own choice.** Nothing vouches for them by default.
5. **A member looking for a service can find Pages whose routine route or response area covers a place they name, with no distance shown and nothing narrowed below the metro** (F094).

## Not this

Not launch. Not approved. Not a booking system. No customer list, no map radius, no "near you".

## Why

Don: *"It's a good use case to help build out the usefulness of the platform."* **Now, as dispatch recommended:** an owner states their neighbourhoods as plain text on the Page, which "where it usually shows up" already allows; "near me" discovery stays deferred with nearness (F094), and vouching waits in `ROADMAP.md` § Later.

[open-question owner=don raised=2026-09-30] When "near me" returns, how does finding by neighbourhood fit "local = the whole metro" and "no distance shown"? A) **A place filter the member types, not a ranking by nearness:** the route is where the Page is, which F094 allows at any grain, and nothing is sorted by distance. B) A nearness ranking, once there is critical mass. *Recommend A;* it is the "where it usually shows up" rule applied to a service.
