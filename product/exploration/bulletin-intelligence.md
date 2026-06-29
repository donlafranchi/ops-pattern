---
id: what-bulletin-intelligence
purpose: Exploration of proactive bulletin prompts — the platform helps business members post timely bulletins by surfacing what's happening.
layer: what
status: exploration
---

# Bulletin Intelligence — Proactive Prompts for Business Members

**Status:** Exploration. Not a system spec — this doc names the concept, sketches the intelligence sources, and maps the tier plan. No decisions encoded here.

## The question

How do we help local businesses offer timely bulletins? Is there a way to leverage business intelligence for our business members?

The current bulletin spec ([`../systems/producer-tools.md`](../systems/producer-tools.md)) gives producers a broadcast surface — compose, publish, deliver. But it waits for the producer to think of something to say. Most small-business owners don't have a content calendar. They're too busy running the business to notice that the World Cup semifinal is Thursday and their followers might want to know they're showing it.

The concept: instead of waiting for business owners to think of what to post, the platform — via the agent-assistance layer ([`../systems/agent-assistance.md`](../systems/agent-assistance.md)) — proactively suggests timely bulletin topics. The assistant nudges: *"The World Cup semifinal is Thursday — want to let your followers know you're showing it?"*

The producer always writes and sends. The platform just says: *here's something worth talking about right now.*

## Why this matters

The bulletin's value depends on producers using it. A broadcast channel nobody broadcasts on is dead infrastructure. The gap between "you can post" and "you do post" is where most small-business communication tools fail. Mailchimp, Constant Contact, Substack — all assume the business owner knows what to say and when. Most don't. They're making the thing, not marketing it.

Bulletin intelligence closes that gap without turning the platform into a content-generation service. It answers the simpler question: *what's happening right now that your followers would want to hear about from you?*

## Intelligence sources

Five families. Each is a different kind of signal the platform can surface to the right business at the right time.

### 1. Calendar intelligence

The most obvious source. Things that are scheduled, public, and relevant to category-matched businesses.

**Sports schedules** — World Cup, NFL, March Madness, NBA playoffs, local teams (Sacramento Kings, Republic FC, River Cats). Bars, restaurants, sports pubs, pizza shops. *"The Kings play the Lakers Friday night — want to let your followers know you're showing it?"*

**Holidays** — Federal (Memorial Day, Labor Day, July 4th), cultural (Lunar New Year, Diwali, Juneteenth, Día de los Muertos), religious (Easter, Eid, Hanukkah). Restaurants, bakeries, florists, gift shops, cultural venues. *"Mother's Day is next Sunday — time to post your brunch special?"*

**Seasonal transitions** — First day of spring, harvest season, back-to-school, daylight saving. Farms, outdoor venues, service providers, seasonal producers. *"Back-to-school starts in two weeks — your followers with kids might be looking for what you sell."*

**Local event calendar** — City festivals, parades, farmers market openings, street fairs, art walks. Any business near the event or selling into it. *"the Farm-to-Fork festival is next weekend and you're a mile from the route — let your followers know you're open."*

Calendar intelligence is the highest-value, lowest-complexity source. Most of these events are public, dated, and predictable years in advance.

### 2. Weather intelligence

Weather is universal, timely, and triggers real consumer behavior.

**Heat** — *"It's going to be 105° Saturday"* → prompt ice cream shops, pool venues, bars with patios, smoothie makers. Followers want to know who's open and what's cold.

**Rain** — *"First rain of the season this weekend"* → prompt cozy cafes, bookstores, indoor venues. The first rain is a moment in Sacramento; people want a place to go.

**Cold snap** — *"Frost advisory tonight"* → prompt farms (what survived), bakeries (soup-and-bread weather), firewood sellers.

**Perfect weather** — *"72° and clear Saturday"* → prompt outdoor venues, farmers market vendors, food trucks. The nice weekend is the prompt.

Weather-triggered suggestions are genuinely useful to consumers. A bulletin that says "105° Saturday — we'll have iced horchata and the patio misters on" is a service, not marketing.

### 3. Peer signals

Not competitive pressure — awareness that a moment is happening and the business could participate.

*"3 other bars in your metro posted about the World Cup semifinal — your followers might want to know if you're showing it too."*

*"Several farms in the region posted about peach season this week — your followers might be looking for peaches."*

The framing matters. This is Rising Tide ([`rising-tide-civic-pride.md`](rising-tide-civic-pride.md)) at the bulletin level. The more businesses posting about the same moment, the more alive the community feels. Peer signals say *there's a moment happening* — not *you're falling behind*.

**Guard rails:**
- Never name specific peers. "3 other bars" — never "Drake's and Bike Dog posted about the game."
- Never frame as competitive. "Your followers might want to know" — never "you're missing out on engagement."
- Minimum N≥3 peers before the signal surfaces (prevents inference of specific businesses).

### 4. Seasonal prompts

Category-specific, calendar-adjacent, but tied to the rhythms of the business rather than external events.

**Produce seasonality** — *"Peach season just started — post what's available this week."* For farms, growers, food producers. Driven by regional crop calendars.

**Holiday prep for makers** — *"Small Business Saturday is in 2 weeks — time to post your holiday lineup."* For craftspeople, artisans, gift-oriented producers.

**Back-to-school for service providers** — *"School starts August 15 — your followers with kids might be looking for after-school programs."* For tutors, music teachers, childcare, activity providers.

**Seasonal menu / inventory transitions** — *"Fall starts next week — if you're switching your menu or inventory, your followers want to know."* For restaurants, cafes, seasonal retailers.

Seasonal prompts work because they match the business's own operational rhythm. The farm knows it's peach season — the prompt just reminds them to tell their followers.

### 5. Trend awareness

What's happening in the community feed right now that a business could respond to.

*"Interest in 'hot sauce' is spiking in your area — your followers might want to know about your hot sauce selection."*

*"Gatherings in Land Park are up 40% this month — if you're near Land Park, your followers might want to know you're open late."*

Trend awareness is the most complex source and the most likely to produce noise. It requires real-time signal processing over the community feed — what items are getting attention, what search terms are spiking, what neighborhoods are heating up. This is b3 territory at the earliest.

**Guard rails:**
- Trends surface only when they cross a significance threshold (not every minor fluctuation).
- Category matching is required — a hot sauce trend doesn't prompt a plumber.
- Trend signals never expose individual member behavior. Always aggregate, always anonymized.

## How it works technically

This is agent-assistance territory. The assistant ([`../systems/agent-assistance.md`](../systems/agent-assistance.md)) is the delivery surface; bulletin intelligence is a class of prompts the assistant can surface.

**b1 — Substrate (no surface).** The intelligence layer doesn't need to be AI-powered at first. A curated calendar of events + a weather API + simple category matching gets 80% of the value.

- **Event calendar table** — `prompt_events` or similar. Rows like `{type: 'sports', name: 'World Cup Semifinal', date: '2026-07-14', categories: ['bar', 'restaurant', 'sports_pub']}`. Curated by the platform team initially; community-contributed at b2+.
- **Prompt templates** — simple text templates keyed to event type and business category. "The {event} is {day} — want to let your followers know you're {action}?" No LLM required.
- **Category matching** — map business Groups to categories (food, drink, outdoor, entertainment, etc.) using the Group's declared Item kinds and tags.
- **Delivery** — email digest. The weekly Growth digest email ([`../systems/producer-tools.md`](../systems/producer-tools.md) § Growth T1) already ships at b2. Bulletin prompts ride the same email: *"This week's moments: the Kings play Friday, Small Business Saturday is next week. Want to post about either?"*

**b2 — Assistant-powered prompts.** The assistant chat panel ships at b2 (per `agent-assistance.md`). Bulletin prompts surface as assistant suggestions in the producer dashboard or the bulletin compose screen.

- Weather API integration — NWS or similar. Prompts trigger on forecast thresholds (>100°F, first rain, freeze warning).
- Peer signals — aggregate bulletin counts by category + metro, surfaced when N≥3 peers have posted about the same event/topic.
- Calendar enrichment — local event calendar integration (city open-data feeds, community calendar APIs).
- The assistant surfaces one prompt at a time in context. *"Before you go — the forecast says 105° Saturday. Want to tell your followers what you're doing about it?"*

**b3 — Full intelligence.** Trend awareness, cross-category signals, predictive timing ("your followers open bulletins most on Thursday evening — schedule this for Thursday 5pm").

- Trend detection over the community feed (item engagement spikes, search term clustering).
- Predictive send-time optimization (per `producer-tools.md` Bulletin T3 "best time to send").
- Seasonal prompt learning — which prompts led to bulletins, which bulletins performed well, feed that signal back into prompt ranking.

## Anti-patterns

What bulletin intelligence must NOT become.

**NOT spam.** Prompts are suggestions, never auto-posted. The business always writes and sends. The platform never posts on a member's behalf without explicit per-action confirmation (per the agent-assistance umbrella commitment: read can be automated, write requires human confirmation).

**NOT generic marketing advice.** Every prompt is specific, timely, and tied to something real. "Post more often to increase engagement" is Mailchimp. "The World Cup semifinal is Thursday — want to let your followers know?" is bulletin intelligence.

**NOT competitive intelligence.** Competitive intelligence is T3 Growth per `producer-tools.md` — "your open rate vs. similar producers." Bulletin intelligence is simpler: *here's what's happening, do you want to tell your followers?* The two surfaces are complementary but distinct.

**NOT a content calendar service.** One prompt at a time, when it matters. Not a weekly content plan, not an editorial calendar, not a "post 3x per week for optimal engagement" prescription. The prompt is a nudge, not a system.

**NOT a content generation service.** The platform suggests the topic; the producer writes the bulletin. The assistant may help draft (that's the bulletin compose surface at b2), but the intelligence layer's job is *what to talk about*, not *what to say*.

**NOT pressure.** Prompts are dismissible, never repeated after dismissal for the same event, and never framed as "you should" or "you're missing out." The tone is informational: *here's what's happening*. The producer decides if it's relevant to them and their followers.

## Connection to seeding

This is a killer onboarding tool for the market unlock strategy.

When seeding a new market, the pitch to a bar owner today is: "Sign up and post about your business." That's a content-creation ask — and most bar owners don't think of themselves as content creators.

The bulletin intelligence pitch is different: *"Sign up and we'll tell you when there's a moment your followers should know about."* That's a notification service — much closer to how a bar owner thinks. They're not producing content; they're responding to what's happening.

The onboarding sequence:
1. Bar owner signs up, creates business Group, gets followers.
2. Thursday morning: email says *"The World Cup semifinal is tonight — want to let your followers know you're showing it?"*
3. Bar owner taps through, writes "Semifinal tonight, 5pm, $5 pitchers, big screen" in 30 seconds, publishes.
4. Followers get the bulletin. Some show up. The bar owner sees the value immediately.

The first bulletin is the hardest. Bulletin intelligence makes the first bulletin easy by answering the question every new producer asks: *"What do I post about?"*

## Tier mapping

| Tier | What ships | Intelligence sources | Delivery surface |
|---|---|---|---|
| b1 substrate | Event calendar table, prompt templates, category matching | Curated calendar only | None (substrate only) |
| b2 | Assistant prompts in producer dashboard + bulletin compose screen | Calendar + weather + peer signals + seasonal | Weekly digest email + assistant panel |
| b3 | Full intelligence with learning | Calendar + weather + peer signals + seasonal + trend awareness + predictive timing | Assistant panel + contextual nudges + smart compose |

## Open threads

- **Prompt frequency cap.** How many prompts per week before they become noise? Working hypothesis: max 2 per week, with the producer able to set their own cadence preference.
- **Category taxonomy.** The matching between events and businesses depends on a category system for business Groups. The current schema doesn't have a formal category field — it has Item kinds and tags. Is that sufficient, or does this need a lightweight business-category enum?
- **Local event calendar sourcing.** Curated by the platform team is fine for 3 seed markets. At scale, this needs community contribution or API integration with city event calendars. What's the bridge?
- **Prompt dismissal memory.** If a producer dismisses "post about the World Cup," do we remember that for the next World Cup? For all sports? The dismissal signal is valuable but the inference is ambiguous.
- **Cross-category moments.** Some moments (July 4th, a heat wave, a local festival) are relevant to many categories. How to avoid every business in a metro getting the same prompt on the same day? Stagger by relevance score? Time of day?
- **Measurement.** How do we know bulletin intelligence is working? Metric candidates: bulletin publish rate among prompted producers vs. unprompted, follower engagement on prompted-topic bulletins, producer retention among those who receive prompts vs. those who don't.

## Related docs

- [`../systems/producer-tools.md`](../systems/producer-tools.md) — Bulletin and Growth specs (the surfaces these prompts feed into)
- [`../systems/agent-assistance.md`](../systems/agent-assistance.md) — the assistant layer that delivers prompts (umbrella commitments, Delegation, Skills)
- [`rising-tide-civic-pride.md`](rising-tide-civic-pride.md) — the community vitality concept (peer signals and the "more businesses posting = more alive" dynamic)
- [`../needs/producer-roadmap.md`](../needs/producer-roadmap.md) — producer capabilities roadmap (Marketing & Outreach category)
- [`../needs/use-cases.md`](../needs/use-cases.md) — P2 (producer posts bulletins) is the use case this intelligence layer supports
