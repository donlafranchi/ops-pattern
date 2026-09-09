---
id: why-what-this-is
purpose: The canonical description of what this product is and who it's for. The sentence every other description is checked against.
layer: why
status: active
owns:
  - canonical-product-description
---

# What this is

> **Written by the PM, 2026-09-07, for a physical sign at a farmers market.** It is the clearest statement of the product produced so far and it replaces every prior attempt at describing what this is for.
>
> **The model doc says what the nouns are. This says what the thing is for.** When a description, a piece of copy, a pitch or a metadata string needs checking, it is checked against this — not against the specs, which describe mechanics.
>
> **Internal until the PM says otherwise. Not published anywhere.**

## The sign

> **Better Together**
> **Not a~~nother~~ dating app.**
> **Help us shape the future.**

*The strikethrough on "nother" is deliberate: the line reads both ways — "Not another dating app" and "Not a dating app."*

## What it is

**A local discovery and community-building platform** — the organizing backbone for decent, caring people to find each other, meet up, trade, volunteer, and buy from and sell to their neighbors.

**Someone with a new idea — a workshop, something homemade, any idea at all — can put it to the community, and others signal real interest before it exists**, turning ideas into local economic activity.

## The elevator speech

> Better Together helps you find and support the people near you. Meet your neighbors. Trade what you make. Volunteer where it's needed. Got an idea — a workshop, something homemade? Share it. Your neighbors can show they want it before you even start. This is for people who care about each other and the place they live. Join us, and help shape the future — together.

## What this settles, by being said out loud

- **It is not a marketplace.** Meeting, volunteering and floating an idea sit alongside buying and selling, in that order. **The positioning defect the launch plan exists to correct is a defect against this paragraph.**
- **The audience is named by disposition, not demographic** — *people who care about each other and the place they live.* Not a segment, not an age, not an income.
- **The invitation is participatory.** *Help shape the future* asks people to build the thing, not to use it. That framing has to survive contact with the onboarding copy, which currently doesn't say it.
- **"Decent, caring people" is the trust model in three words**, and it matches how good faith is actually enforced here: community and peer pressure, not platform arbitration. See [`promises.md`](promises.md) § How good faith is enforced.

## Settled — the name and the tagline

**SocialUs is the name. *Better Together* is the tagline.** *(Ratified 2026-09-07.)*

Nothing is renamed. The name stands in the code, the metadata, the repo and the domain; the tagline goes on signs, headlines and openings. **The question is closed — do not reopen it on the strength of a good line.**

## The call to action is participatory — a positioning constraint

**"Help shape a better future."** *(Intent — Ratified 2026-09-07.)* The PM's framing: **he wants people to feel that they can, and that we do it together.**

**This is a constraint on copy, not decoration.** Everything user-facing reads as an invitation to build the thing, not an announcement of a finished product.

**The test, and it is a sharp one:** *an empty state that apologises for being empty contradicts this. One that invites you to be first serves it.*

**Three surfaces to check against it** — none has been:

- **The create flow.** Does it read as "fill in this form" or as "put something into your community"?
- **The sign-up copy.** Currently says nothing about what the platform is for at all. **A person finishes signup without ever being told.**
- **Every empty state.** At launch nearly every surface is empty, so **the empty states are the product on day one** — the same argument as the default Page art. *"Nothing here yet"* is an apology; *"be the first to put something here"* is the invitation.

**Why this is a constraint and not a style note:** a participatory promise made in the pitch and broken by the interface is worse than not making it. Someone recruited at a market with *help shape the future* who then meets copy that treats them as a consumer has been told two different things, and they will believe the interface.

## Two things this description implies that the model may not carry

Findings recorded 2026-09-07, checked against the schema and the shipped surfaces. **Neither is scoped into launch.**

### 1. "Volunteer" — a real gap

**There is no volunteering verb, kind, or surface.** The only occurrence of the word anywhere in the application is `volunteering` as a selectable *interest tag* in the onboarding vocabulary — a thing you can say you care about, not a thing you can do.

**The Item kinds are** product, service, gathering, wonder, offer, ask, initiative. **Volunteering is labour offered without price, usually to a group rather than a person**, and it does not sit cleanly in any of them:

- **`service`** carries a price and a provider posture — a wired-up composer exists, but it models paid work.
- **`offer`** is the closest shape by intent — *"I have this to give"* — but **no `offer` composer exists**, and `offer` has no child table of its own.
- **`ask`** would cover the other side (*"we need hands on Saturday"*), and **it has no composer either.**

**So the honest statement: the sign promises a verb the product cannot yet do.** Not a schema gap so much as a surface gap — `offer` and `ask` are declared kinds with no way to create one. **Nothing to decide now; this is what it would take.**

### 2. "Others signal real interest before it exists" — already specced, and it's the same mechanic

**This is not a gap. It is `kind='wonder'`, and the substrate is built.**

`item_wonders` ships with `interest_count`, a 90-day `expires_at`, `conversion_target_kind` (`gathering` or `initiative`), and `converted_to_item_id`. `item_responses` carries an `interest` response kind. The spec names the affordance in the PM's own words: ***"I'd be in"* taps.**

**What is missing is only the composer and the page** — both scoped as Phase 3 stubs, both deferred to b2+, and the deferral is recorded as a documented disagreement: an archived plan committed to shipping this at launch, the use-case set later tagged it deferred, and the stub followed the use-case set.

**Why this matters more than a status line.** The thing the PM describes to strangers at a market — *put an idea to the community and see who wants it before you build it* — **is the one mechanic in the sign that nothing else on the internet does well, it is designed, its substrate is shipped, and it is deferred.** That is a surfacing problem, not a design problem.

**Three design questions remain open** and are the reason it was deferred: how interest is surfaced beyond a count, what number tips an idea into action, and whether richer signals are needed (*"I'd host this," "I could help organize"*). **Real questions, and none of them require new substrate.**
