# IMAGINE

Nothing here is a commitment. A heading and a few lines per idea, distilled from `product/exploration/` (23 files, now deleted — git history holds the full drafts). Scenarios may not cite this file.

**A waiting room, not a parallel library.** This file holds only ideas that do **not yet have a noun, a verb, or a surface**. The moment an idea acquires one, it **moves** into the spine — `product/foundation/nouns.md`, `product/foundation/verbs.md`, `product/ui/surfaces.md` — and leaves this file. **Entries move out; they are never copied out.** A copy is two descriptions of one concept, which is what this rule exists to prevent.

The test: does it have a shape — a noun, a verb, or a surface? Then the spine. If not, here. The Ticketmaster thesis below is the worked example of something staying: it is a claim about a market, not a shape.

`product/exploration/` is not coming back — it was deleted deliberately and distilled into this file, and a new idea folder would be the next thing to clean up.

## House rules, so this doesn't become a graveyard

Every entry added from 2026-09-12 carries three things:

1. **A date and who it came from.** "Don, 2026-09-12" or "agent analysis, 2026-09-12". An idea with no owner is one nobody will defend or retire.
2. **One line: what would make this real.** The observable thing that would move it out of here. Not "when we have time" — a fact about the world or the product that would change the answer.
3. **A separation of claim from analysis** where both exist. Don's framing is recorded in his terms; anything an agent adds is marked as analysis. A thesis that overstates itself is worse than no thesis.

**A `Priority: higher` line, where an entry has one.** It means Don has said this matters more than the rest of the room — nothing more. **Its absence says nothing**: most entries here have never been ranked against each other, and inventing a full ordering would be a hand-maintained index of the kind this repo keeps killing. Added 2026-09-19 at Don's direction.

**Retiring is the normal outcome.** An entry leaves when it ships, when its trigger fires, or when someone reads it and says it's dead — and the last of those is a good day, not a failure. Entries above this line predate the rule and are distillations with git history behind them; they are not retro-fitted.

## Ideas

*Every entry below was distilled from `product/exploration/` on **2026-09-09** (commits `b75cfbb`, `66ddc9b`, `c4226d0`) — dated by the distillation, not by when each idea was first had, which git does not record per-entry. None predates the house rules above, so none is retro-fitted with a trigger; each stays until someone gives it a shape or retires it.*



- **Affinity-derived Group suggestions.** Surface emergent Group suggestions from Member taste-overlap on Items — without crossing the auto-assignment refusal. Needs Saves at real density and a mature discovery-overlap index first; earliest plausible b2+.
- **Apple platform integration.** What a native iOS build would want to use from Apple's platform strategy (Sign in with Apple, App Clips, widgets, etc.) versus what the web MVP already covers.
- **Brand strategy & naming.** A narrative spine, voice, mascot, and naming-territory brief — defines the target a name has to hit, not the name itself.
- **Bulletin intelligence.** The platform proactively prompts business Pages to post timely bulletins by surfacing what's happening nearby (weather, local events, seasonal cues).
- **Local stays.** Short-term rentals as a platform surface — an anti-Airbnb thesis built on the platform's existing Location/Group primitives instead of a new booking stack.
- **Locally Made badge.** A provenance badge distinct from Locally Owned, graduating from self-attestation to verified; varies by product category. A proximity model was built and shelved (branch `t-f039`) pending the trust-model question.
- **MEHKO home kitchens.** Microenterprise Home Kitchen Operations as an early-adopter producer segment; permit verification links to the vetting-and-vouching idea below.
- **The mighty oak.** A candidate visual symbol for the platform — "an oak tree is not a tree, it is a neighborhood."
- **Missing pets.** Whether there's a structural shape for "help me find my pet" that captures the community-rallying value without opening a freeform posting surface that becomes a vector for rants and scams. Pushes against the accountable-participation commitment; unresolved.
- **Project arc overview.** A durable one-page brief on the platform's story and mascot candidates, meant for design-tool briefing rather than product spec.
- **Reciprocity & goodwill.** Open question on how Offer/Ask exchanges track (or deliberately don't track) reciprocity between members.
- **Recruitment plan.** A solo-founder playbook for hiring, once AI agents stop covering most of the build.
- **Rising tide — civic pride.** A Place-level "community vitality" surface; unscoped design space, no decisions made.
- **Social capital.** Recognition earned through participation — hosting, fulfilling, sharing, showing up — Member-owned and portable, never a ranking signal that changes what others see, always optionally surfaced. Standing intent only; the shape was never designed. Pulled out of `product/systems/member.md` 2026-09-09.
- **Social integration.** How TikTok/Instagram/etc. could serve as distribution, credibility, or discovery channels into the platform. Not before b2 — needs feed, follows, and item surfaces first.
- **Vetting & vouching.** A community-powered trust signal for producer claims — "can I trust what this producer says, and is there something better nearby" — distinct from a behavior/accountability rating.
- **A scored community-health rubric.** A 0–3, five-section scoring instrument (Dunbar layers, Ostrom's commons governance, Oldenburg's third places, etc.) for periodically auditing platform decisions against community-health theory, as a complement to the binary Decision Test. Working defaults only — never load-bearing as written; whether it's actually used or purely aspirational was never confirmed.
- **The cooperative engine (5 sketches).** Pooled-commitment purchasing, cooperative-formation templates, a federation layer, member-owned insurance as a worked example, and "AI serves the people" as the guiding constraint on all four. Practical-to-begin, ambitious-for-the-goal; each sketch is near-term-shippable with a multi-year payoff. Waits on documented member demand per the standing decision against speculative cooperative tooling.

---

## Added under the house rules

### Ticketing, and what RSVPs have to do with Ticketmaster

*Don's thesis, 2026-09-12, in his terms:* Ticketmaster holds a monopoly over ticketing and events. **RSVPs are a way to lessen that.**

*Analysis, agent, 2026-09-12 — marked separately because the thesis is worth more stated honestly than stated large:*

**An RSVP is not a ticket.** No payment, no allocation, no scarcity, no guaranteed entry, no recourse if you turn up and it's full. Today it is the free end of the same need, not a substitute for the paid end, and describing it as competing with Ticketmaster head-on would be a claim the product cannot cash.

**What it does compete with is the reason a small organizer reaches for a ticketing platform at all.** For a run club, a market, a workshop, a supper — the whole requirement is usually *knowing who is coming*. Ticketing is what they buy because it is what was for sale. They pay a fee, and they hand over the relationship with their own attendees, to get a headcount. **That is the thing worth displacing**, and it is displaceable now rather than after a payments stack.

**Where it connects to what's already promised:** it is a direct instance of *not an extractive platform* — the fee and the surrendered attendee relationship are the extraction. It is also the clearest case of *not pricing out the small*: a per-ticket fee is regressive against exactly the neighbourhood-scale organizer this platform is for. The thesis is not a new commitment; it is an application of two that exist.

**What would have to become true for this to be more than a thesis:** capacity limits · payment · transfer between people · proof of entry at the door. Each is a real build, and the platform has none of them. A future reader can measure the distance by how many of those four exist.

### Blog posts and emails that explain what's what

*Don, 2026-09-15.* A channel for helping people understand the differences between the kinds of thing they can start, and what the product is for — alongside the in-app explainer, not instead of it.

**Unscoped, and deliberately so.** This is a marketing and education question, not a product surface, and it is **outside launch scope**. Recorded here so it is not lost.

**What would make it real:** somebody owning marketing, which nobody does today.

### Discovery that knows what a person is optimizing for

**Priority: higher.**

*Don's framing, 2026-09-19, in his terms:* *"I tend to regularly search for bars and restaurants with nice outdoor environments as opposed to outdoor tables next to a busy street. Whereas other times I don't really care about the ambiance and only want the best enchilada in the city."* And on reviews: *"yelp and google... lump all reviews from all people and that isn't really a useful way to do reviews when people have different expectations. For example some people are value oriented and want maximum say food for their dollar whereas I am willing to pay for quality and it'd be nice to be able to differentiate this."*

*Analysis, agent, 2026-09-19 — marked separately because the goal is one sentence and the mechanism is four systems:*

**The load-bearing obstacle is not filtering. It is that the product has no way for anyone to say anything about a Page they do not own.** Every description the platform holds today is creator-supplied — tags, the Page description, the composer's fields. A brewery will tag itself *patio*; it will never tag itself *patio beside a four-lane road*. **The distinction Don wants is inherently third-party, and third-party statements about a Page are a surface this product has never had.** Any first step that does not answer *may a member write about someone else's Page* is a step in a different direction.

**Four separable systems, smallest first, and none of them is a filter control:**

1. **A vocabulary for attributes**, distinct from the tags a creator types about themselves — quiet, patio, cheap, worth-the-price. Nothing exists. Tags are the nearest substrate and are creator-owned by rule.
2. **Member-supplied attributes** — the third-party surface above. Gated by [member-content-takedown]; the report path (F058) now exists, so the gate is passable for the first time.
3. **Reviewer segmentation** — knowing what a reviewer optimizes for. Either a declared axis on the member, or inferred from behaviour. **Inference is close to what `product/systems/discovery.md` refuses**, and a declared axis is a profile field nobody fills in.
4. **Reviews at all.** There is no review noun. `ROADMAP.md` § Won't bars star ratings and reputation scores **for people**; a treatment-review surface that reviews the treatment and never the person sits in § Later, unbuilt and unscoped.

**Cold start is the quiet killer.** One metro at launch means roughly zero reviews, and a review system segmented by reviewer type needs several times the volume of an unsegmented one to say anything at all. **A segmented review surface with no reviews is worse than none** — it advertises a promise the data cannot keep, which is the specific failure Don is describing in Yelp, arrived at from the opposite direction.

**The smallest honest first step is not to build any of it.** F064 — the not-built-yet signal capture — is approved and exists for exactly this: a person taps something marked not built yet, it is recorded once, no count, no date implied. Pointing that at *narrow by what I care about* costs approximately nothing and answers whether anyone but Don wants it. **The first real build afterwards is creator-declared attribute tags, and Don should know before it starts that it does not solve his stated problem** — self-reported attributes cannot make the distinction he opened with.

**What would make this real:** a ruling that members may publish statements about Pages they do not own, plus enough density in one metro that a second reader would see a first reader's words. Neither exists on 2026-09-19.

**Reframed in part, 2026-09-21, by the in-app answering strategy** (`planning/AGENT-ANSWERING.md`). **System 1 above largely dissolves**: nobody has to enumerate *quiet*, *patio*, *worth-the-price* as a vocabulary if a person can simply say it, so natural language is how this intent gets expressed without a taxonomy. **The obstacle is untouched.** An answering layer can only answer over what is written, and the load-bearing problem here is that **nothing lets anyone say anything about a Page they do not own**. A brewery will tag itself *patio* and will never write *patio beside a four-lane road*. **The entry stays, and its trigger is unchanged** — the interface half is answered, the data half is not.

**Related and deliberately not folded in:** *what's on* — the time-based half of the same conversation — is not here, because it has a noun, a verb and a surface already and belongs in the spine.

### The occasion — a thing people organize around, with no row of its own

*Don's ruling, 2026-09-19, recorded here because the ruling was that it stays here:* **there is no goal object type.** The app is a **finding mechanism**. The organizing happens in real life, and where it needs a legal form it happens in entities formed outside the platform.

**Why this is in the waiting room and not the spine.** It has no noun — that is the ruling. It has no verb of its own: what people actually do is make a Page and post a date, and both already exist. It has no surface. **It fails all three parts of the test at the top of this file**, which is the whole reason it stays rather than moving.

**What it is not:** an Idea (`wonder`) — that is someone putting a *new thing* to the neighbourhood and watching for interest, and it has a noun and substrate already. Not a Page — a Page is *who*. Not a dated post — that is *when*. The occasion would be *what for*, and nothing in the model holds that.

**What would make it real:** an occasion that a Page and a dated post cannot carry between them — something people need to find, join and come back to that is neither an organization nor a moment. Nobody has produced one yet, and until somebody does, the pair is the answer.
