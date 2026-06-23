---
id: what-rising-tide-civic-pride
purpose: Exploration of Place-level civic pride as a community vitality surface.
layer: what
status: exploration
---

# Rising Tide — Civic Pride as Community Vitality

**Status:** Exploration. Not a system spec — this doc names the concept, sketches the design space, and identifies what could ship when. No decisions encoded here.

## The concept

"Oak Park has 47 local businesses on the platform, Midtown has 32."

That sentence is civic pride. It is not gamification. The difference is structural: gamification rewards individual behavior with points, badges, and leaderboards. Civic pride is the collective recognition that *our place is alive and we are the reason*. The unit of measurement is the Place, not the Person. The feeling is "we take care of our own" — and the implied challenge is that neighbors do too.

The Rising Tide concept makes community vitality visible at the Place level. The platform already captures the event log that represents a place coming alive — Members landing, Items declared, Gatherings recurring, Groups forming, Offers extended, Wonders floated. Today that activity is visible only as individual surfaces. Rising Tide aggregates it into a *Place-level pulse* that answers one question: **how alive is this place?**

The name is the philosophy. A rising tide lifts all boats. One neighborhood thriving does not come at another's expense — it demonstrates what's possible and creates spillover. Oak Park's Saturday market draws people from Midtown; Midtown's run club draws runners from Curtis Park. The energy is generative, not zero-sum. Competition exists — neighborhoods have always competed — but the competition is "we show up for each other better than you show up for each other," and the proof is visible activity, not a scoreboard.

This concept also serves the platform's structural thesis. The loops in `member-journey.md` describe individual arcs. Rising Tide is the *collective* version of the same trajectory: a Place moves from dormant → stirring → active → thriving as its Members move through the loops. The Place's vitality is the emergent property of its Members' participation — not something the platform manufactures.

## What gets measured

Community health indicators at the Place level. These are aggregate counts and rates derived from the existing event log — no new data collection, no new Member-facing inputs. The Place doesn't "do" anything; its people do, and the Place reflects what they've done.

**Vitality indicators** (working set — not final):

The indicators split into three families. Commerce is the obvious one — producers, items for sale, local businesses. But a place that only measures commerce is a marketplace, not a community. The second family — social gathering — is equally important: are people getting together for non-commercial reasons? The run clubs, the sewing circles, the chess meetups, the parent groups, the Wonders that are just "I'm curious if anyone else..." The third family — mutual aid — captures interdependence: neighbors showing up for each other without money changing hands.

A Place where all three families are active is alive in the way that matters. A Place with high commerce and no social gathering is a strip mall. A Place with high social gathering and no commerce is a park. Neither is the whole picture.

| Indicator | What it captures | Family | Rubric alignment |
|---|---|---|---|
| Active producers | Members with ≥1 active Item (any commercial kind) anchored in this Place | Commerce | 1.2 Visibility, 1.4 Agency |
| Items declared | Total active Items (all kinds) anchored in this Place | Commerce | 1.2 Visibility, 1.4 Agency |
| Social gatherings | Gathering Items in this Place that are non-commercial — run clubs, skill-shares, meetups, circles. Excludes kind='product' and kind='service' Items. | Social | 1.1 Belonging, 1.12 Rhythm |
| Recurring social gatherings | Subset of social gatherings with active recurring schedules | Social | 1.12 Rhythm (the heartbeat) |
| Affiliate groups active | Non-business Groups (place, interest, practice, event_anchored, family) anchored in this Place with ≥1 member activity in trailing 30 days | Social | 1.10 Shared identity, 1.9 Bridging |
| New Members | Members whose home Location landed in this Place within the trailing 30 days | Social | 1.1 Belonging |
| Wonders floated | Active Wonder Items in this Place | Social | 1.4 Agency (ideas bubbling) |
| Mutual aid activity | Offers + Asks created in this Place in the trailing 30 days | Mutual aid | 1.9 Bridging |
| Events this month | Distinct Gathering occurrences (all kinds) scheduled in the next 30 days | Social + Commerce | 1.12 Rhythm |
| Groups formed | Active Groups (all kinds) anchored in this Place | Social + Commerce | 1.10 Shared identity |

The social-gathering family is the one that answers "are people finding each other here?" — which is Loop 1's question at the Place level. A neighborhood where 30 people gather weekly for non-commercial reasons is a neighborhood where people click. That signal is as important as the producer count, maybe more — commerce follows connection, not the other way around.

These map to the community health rubric's Section 1 (Healthy Community Attributes) and Section 5.9 (Community health dashboards). They are not scores. They are counts. "Oak Park has 12 recurring gatherings" is a fact; "Oak Park scores 87" is gamification. The distinction is load-bearing.

**What is deliberately NOT measured:**

- Individual contribution counts. No "Maya posted 14 items this month." The unit is the Place.
- Engagement metrics. No time-on-platform, no session counts, no click-through rates.
- Growth rates presented as rankings. "Oak Park grew 23% this month" is fine. "#1 fastest-growing neighborhood" is not.
- Transaction volumes or dollar amounts. Money is private. The platform surfaces activity, not revenue.
- Quality judgments. No "best" anything. Counts are objective; quality rankings are editorial.

## How it surfaces

Three surfaces, in ascending order of build cost.

**Surface 1 — Place page vitality section.** The Place landing page (T2 per `places.md`) already exists as a scope-for-discovery surface. Add a vitality section: a small, factual summary of the indicators above. Not a dashboard — a paragraph. "Oak Park has 47 local businesses, 12 recurring gatherings, and 8 new Members this month. 3 Wonders are looking for interest." The tone is a neighbor telling you what's happening on the block, not a metrics dashboard.

**Surface 2 — Periodic "State of Place" summary.** A digest — weekly or monthly — visible on the Place page and optionally delivered to Members whose home Location is in that Place. "This month in Oak Park: 4 new Groups formed, the Sunday Market added 3 vendors, and someone floated a Wonder about a tool library." This is editorial in shape — the platform selects what's interesting from the indicators and presents it as a narrative, not a table. The editorial voice is the platform's; the facts are the community's.

**Surface 3 — Neighboring-place visibility.** When a Place crosses a threshold (first 10 producers, first 5 recurring gatherings, first mutual-aid cycle), neighboring Places get a visibility nudge. Not "you're behind" — "your neighbors in Oak Park just crossed 50 local businesses. Here's what they're doing." The mechanism is geographic proximity in the Place hierarchy: sibling Places under the same parent city, or adjacent neighborhoods by polygon. The nudge is informational, not competitive. It answers "what's happening nearby" — the same question Loop 3 (Land here) answers for individuals.

**b1 scope:** Surface 1 only, in its simplest form — aggregate counts on the Place page. No narrative, no digest, no neighbor nudges. The substrate (count queries against the event log, grouped by Place) ships; the richer surfaces are b2+.

## The friendly challenge

The challenge is real but structurally non-zero-sum. Here's why:

**Geographic spillover is the mechanism.** A thriving Oak Park draws foot traffic, curiosity, and new Members from adjacent neighborhoods. Midtown's residents discover Oak Park's Saturday market and start attending. Some of them come back to Midtown and start something there. The platform's locality-first index makes this cross-pollination visible — browsing "what's near me" naturally surfaces activity in neighboring Places.

**Milestones are celebratory, not comparative.** "Oak Park reached 50 local businesses" is a milestone. It doesn't say "and Midtown only has 32." The neighboring-place nudge (Surface 3) frames the milestone as inspiration: "Here's what Oak Park is doing — what could your neighborhood start?" The implicit comparison exists — neighbors always compare — but the platform never makes the comparison explicit.

**The "how" is visible, not just the "what."** When a Place is thriving, the platform can surface *what's working there* — the Groups that formed, the Gatherings that recur, the Wonders that became real. This is the "playbook" that other Places can learn from. Rising tide means the success is replicable, not proprietary.

**No rankings. Ever.** The platform never produces a "top neighborhoods" list, a "most active Places" ranking, or any sorted comparison of Places by vitality. Each Place sees its own indicators. Neighboring Places see each other's milestones. Nobody sees a leaderboard.

## The inclusion question

A rising tide that only lifts some boats isn't a rising tide. It's a yacht club.

This is the hardest design problem in the exploration, and it is unsolved. The vitality indicators measure *who's showing up*. They do not measure *who isn't*. A Place can look thriving — 50 producers, 20 gatherings, active mutual aid — while an entire demographic, income bracket, or neighborhood pocket never finds the platform at all. The aggregate counts are blind to distribution. That blindness is the failure mode.

The platform's constitution (`principles.md`) measures Member Flourishing on two dimensions — time to live and money to live — and requires both to rise *together*. Rising Tide must honor the same demand at the Place level: vitality that accrues to some Members while others are invisible is not vitality. It's consolidation with better PR.

**Why this is hard:** The platform can count who's present. It cannot easily count who's absent. Measuring inclusion requires either (a) knowing who *should* be present and isn't, which the platform has no basis for at b1, or (b) detecting patterns in who *is* present that suggest structural gaps.

**Initial thinking — proxy signals, not solutions:**

**Newcomer landing rate.** Of Members who sign up with a home Location in this Place, how many find a Group or attend a Gathering within 30 days? A high sign-up rate with a low landing rate means the Place is visible but not welcoming — people arrive and bounce. This is the closest thing to a "who's not benefitting" signal the event log can produce at b1.

**Group-kind diversity.** Is the Place's Group ecosystem varied — place groups, interest groups, practice groups, event-anchored groups, business groups — or is it all one kind? A Place with 15 business Groups and zero interest or practice Groups is a marketplace, not a community. A Place with diverse Group kinds is more likely serving diverse needs. This isn't conclusive but it's a signal.

**Geographic coverage within a Place.** At the neighborhood level, are Locations and Items distributed across the geography or clustered in one pocket? A "thriving" neighborhood where all activity is on one commercial block and the residential streets are empty has a distribution problem. Requires Location-coordinate analysis, which is b2+ work.

**Dormant-to-active ratio.** Of Members with a home Location in this Place, what fraction have any platform activity in the trailing 90 days? A Place with 200 Members and 20 active ones has 180 people the platform isn't serving. The denominator matters as much as the numerator.

**Who's declaring vs. who's responding.** If the same small group of Members produces all the Items and everyone else only consumes, the "community" is actually a few organizers serving an audience. Participation breadth — how many distinct Members are *creating* Items, not just viewing them — is a signal of whether the rising tide is broad or narrow.

**What this is NOT:** It is not demographic profiling. The platform does not collect race, income, age, or any other demographic data, and Rising Tide does not propose that it should. The inclusion signals above are behavioral — they measure patterns of engagement and non-engagement without requiring the platform to know *why* someone isn't engaging. The "why" is a community conversation, not a platform metric.

**The anti-pattern this guards against:** A platform that works great for an in-group and is invisible to everyone else. Every successful community platform eventually discovers it has a core of active Members surrounded by a much larger ring of people who signed up, looked around, and left. If Rising Tide only celebrates the core, it becomes a mirror for the already-engaged — civic pride for the people who were already proud. The question is whether the platform can detect and surface the gap between the core and the ring, and whether that visibility changes anything.

**Honest status:** This is an unsolved design problem. The proxy signals above are the best the exploration can offer. None of them are clean. Newcomer landing rate conflates "the Place isn't welcoming" with "this person just isn't interested." Group-kind diversity is a weak proxy for demographic inclusion. Geographic coverage requires spatial analysis the platform doesn't have at b1. The dormant-to-active ratio doesn't explain *why* people go dormant. All of them are better than nothing, and none of them are the answer.

The commitment is that Rising Tide will not ship a vitality surface without at least one inclusion signal alongside it — even if the signal is crude. "Oak Park has 47 local businesses and 8 new Members this month" next to "12 Members signed up this month but haven't found a Group yet" is a more honest picture than the first number alone. The second number is uncomfortable. That's the point.

## Seeding mechanics

The three seed markets — Madison WI, Boise ID, Savannah GA — each face the cold-start problem. Rising Tide can be the hook that gets the first champions excited, because civic pride pre-dates the platform.

**The pitch to neighborhood champions:** "We're building a way for [your neighborhood] to show the world what's happening here. You already know who the makers, the organizers, the people-who-show-up are. Help us get them on the platform, and [your neighborhood] will be the first place in [city] where that vitality is visible."

**Why this works for cold start:**

- Civic pride is pre-existing motivation. People who already care about their neighborhood don't need to be convinced that neighborhood vitality matters — they need a tool that makes it visible.
- The first champion doesn't need critical mass. "Willy Street in Madison has 8 local businesses on the platform" is meaningful at 8. It doesn't need 80 to feel real.
- Place-level framing creates a recruitment loop. Each producer a champion onboards visibly increases the Place's count. The champion sees the number go up and is motivated to onboard more — not for points, but because the neighborhood's vitality is their pride.
- Inter-neighborhood awareness creates FOMO that serves the platform. When Willy Street has 15 producers and Atwood has 3, someone in Atwood will care. That person becomes the next champion. The platform didn't manufacture this — neighborhoods have always watched each other.

**Seed-market tactics:**

- Identify 2-3 neighborhoods per city with existing civic-identity energy (neighborhood associations, established markets, active community orgs).
- Recruit one champion per neighborhood. The champion's job is simple: onboard local producers and organizers.
- Make the Place page vitality section the champion's feedback loop. Every onboarding lands visibly.
- Let the inter-neighborhood dynamic emerge on its own. Don't manufacture it. If the energy is real, it'll happen. If it's not, no amount of platform mechanics will create it.

## Anti-patterns

What Rising Tide must NOT become. Each anti-pattern names the failure mode it would reproduce.

**No individual leaderboards.** "Top contributors in Oak Park" is gamification. It rewards volume over quality, turns participation into performance, and creates a class system among Members. The platform refuses to rank people (per `principles.md` Part 2).

**No "top member" or "MVP" recognition.** Singling out individuals creates a caste of recognized contributors and a mass of invisible ones. Community vitality is collective; individual recognition is for the people who know each other's names, not for the platform to assign.

**No badges.** A badge is a gamification primitive. It converts qualitative participation into a collectible token. The platform's vitality indicators are facts about Places, not achievements earned by Members.

**No points.** Points are the purest form of gamification — they quantify behavior, create a balance, and imply that more is better. Rising Tide measures Places, not people, and counts are facts, not scores.

**No streaks.** Streaks reward consistency of behavior, which sounds healthy until it creates anxiety about breaking them. The platform refuses to create a mechanic that makes people feel bad for taking a week off.

**No quantity-over-quality incentives.** "Oak Park declared 200 items this month" means nothing if 180 of them are low-effort posts gaming a counter. Vitality indicators should resist inflation — recurring gatherings and active producers are harder to fake than raw item counts.

**No shame mechanics.** The neighboring-place nudge is inspiration, not shame. "Your neighbors are thriving — here's what they're doing" is generous. "Your neighborhood is falling behind" is toxic. The platform never frames one Place's activity as another Place's failure.

**No transactional reciprocity.** "You helped Oak Park reach 50 producers — here's your reward" turns civic pride into a transaction. The reward for a thriving neighborhood is a thriving neighborhood.

**No vitality-washing.** Celebrating a Place's aggregate numbers while ignoring who isn't benefitting is the community equivalent of greenwashing. If the vitality surface only shows the good numbers, it becomes propaganda for the in-group. Every vitality surface must ship with at least one inclusion signal — even a crude one — so the picture is honest. See "The inclusion question" above.

## Tier mapping

**b1 — Substrate + minimal surface.**

- Count queries against the event log grouped by `places.id`. No new tables.
- A `place_vitality_summary` view or function returning the indicator set per Place.
- Place page renders the vitality section (aggregate counts, plain language).
- No digests, no nudges, no cross-place dynamics.

**b2 — Richer surfaces.**

- "State of Place" periodic summary (Surface 2). Platform-generated narrative digest.
- Neighboring-place milestone nudges (Surface 3). Sibling-place visibility on threshold events.
- Vitality section on the Place page gets richer — trailing trends (this month vs. last month), recently formed Groups, upcoming Gatherings highlighted.
- Member-facing "What's happening in [my Place]" notification (opt-in).

**b3 — Cross-place dynamics.**

- Regional aggregation. "Sacramento Valley has 340 local businesses across 12 neighborhoods." Place hierarchy rolls up.
- Economic impact estimation. "Members in Oak Park circulated an estimated $X locally this month." Requires the payments substrate from `payments.md`.
- Cross-place discovery. "People in Curtis Park are also browsing Oak Park's producers." Aggregate, anonymized browse patterns surfacing geographic affinity.
- Federation-ready Place identity. A Place's vitality carries across federated platforms.

**The b1 rule:** Ship the substrate that makes all future surfaces possible. The event log already captures everything. The count queries are trivial. The Place page section is one component. Rising Tide at b1 costs almost nothing and establishes the frame that b2/b3 build on.

## Loop alignment

| Rising Tide element | Loops served | How |
|---|---|---|
| Place page vitality section | Loop 3 (Land here) | A newcomer sees "this place is alive" and has a reason to stay. |
| Active producers count | Loop 7 (Make and be found), Loop 9 (Find a local pro) | Producers are visible as part of the Place's identity, not just individual listings. |
| Social gatherings count | Loop 1 (Find your people), Loop 4 (Gather regularly) | The non-commercial gathering count is the direct answer to "are people connecting here?" — the platform's front door. |
| Affiliate groups active | Loop 1 (Find your people), Loop 4 (Gather regularly), Loop 10 (Start something) | Non-business Groups are the organizing primitive for connection. Their presence says "people here do things together that aren't about money." |
| Recurring social gatherings | Loop 4 (Gather regularly) | Recurring non-commercial gatherings are the heartbeat of a Place — the Thursday run club, the Saturday chess game, the Tuesday sewing circle. |
| Groups formed (all kinds) | Loop 4 (Gather regularly), Loop 10 (Start something) | Groups are the organizing primitive; their presence signals a place where people do things together. |
| Wonders floated | Loop 2 (Float an idea) | Visible Wonders in a Place signal that this is somewhere ideas are welcome. |
| Mutual aid activity | Loop 5 (Share), Loop 6 (Ask for help) | Offers and Asks are the texture of interdependence; their presence signals neighbors who show up for each other. |
| Newcomer landing rate | Loop 3 (Land here), Loop 1 (Find your people) | The inclusion signal. Are people who arrive actually finding their place — or showing up and bouncing? |
| Neighboring-place nudges (b2) | Loop 3 (Land here), Loop 1 (Find your people) | Cross-place visibility helps Members discover adjacent communities. |
| State of Place digest (b2) | Loop 8 (Follow what you love) | The digest is a Place-level follow — stay connected to what's happening where you live. |
| Economic impact (b3) | Loop 7 (Trade), Loop 11 (Pool resources) | Visible economic circulation is the proof that buying close works. |

**The deepest alignment:** Rising Tide serves the platform's macro thesis — that collective action in a place is visible, repeatable, and durable. The vitality indicators are the *evidence* that the loops are working. A Place with high vitality is a Place where the loops are spinning. A Place with low vitality is a Place where they haven't started yet — and the neighboring-place nudge is how the platform gently says "they have, and you could too."

The social-gathering family is what keeps Rising Tide honest about what "alive" means. A Place where people gather, connect, and click — without commerce being the reason — is a Place where the loops can spin. Commerce follows connection; the platform measures both, and the social signal comes first.

## Open threads

- **Inclusion signals — the core unsolved problem.** See "The inclusion question" above. The proxy signals (newcomer landing rate, group-kind diversity, geographic coverage, dormant-to-active ratio, participation breadth) are initial thinking, not answers. The commitment is that vitality surfaces ship with at least one inclusion signal. Which one, how it's computed, and what the platform does with it are all open. This thread is the most important one in the doc.
- **Social-vs-commercial balance.** The three-family indicator structure (commerce, social, mutual aid) is a working hypothesis. Should the vitality surface weight the families equally? Should a Place with zero social gatherings but 50 producers look "thriving"? The answer is probably no — but how to represent that without producing a score is open.
- **Threshold design.** What counts trigger milestones? "First 10 producers" feels meaningful; "first 100 items declared" might not. The thresholds need to correlate with qualitative community vitality, not just raw counts.
- **Inflation resistance.** How to prevent a single prolific Member from inflating a Place's counts. Possible: cap per-Member contribution to any single indicator (e.g., one Member's items count as 1 toward the producer count, not N toward the item count).
- **Place granularity.** Vitality indicators at the neighborhood level work differently than at the city level. A neighborhood with 10 producers is thriving; a city with 10 is not. The indicator set may need Place-kind-aware thresholds.
- **Privacy.** All indicators are aggregates; no individual Member data surfaces. But small neighborhoods with few Members may make individual activity inferrable from aggregate counts. Consider a minimum-anonymity threshold (e.g., suppress indicator if fewer than 5 Members contribute to it).
- **Voice.** The "State of Place" digest (b2) has an editorial voice. Whose? The platform's? A designated Place steward's? This affects tone, trust, and the perception of whether the summary is objective or promotional.
- **When this becomes load-bearing.** Rising Tide is an exploration, not a commitment. It becomes load-bearing when the first seed market has enough activity that Place-level vitality is meaningful — probably 3-6 months after launch in the first market. Until then, the substrate (count queries) ships quietly and the surface waits.
