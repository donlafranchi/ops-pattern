# Agent-Assistance People-First Review — 2026-05-09

**Reviewer hat:** Foundational-principles check — does the agent-assistance stack (member-operations, delegation, member-self-record, skills + ADRs 6-9) honor what `people-first.md`, `primitives.md`, `policy-framework.md`, and `canonical-examples.md` refuse?

**Specs reviewed:** `product/systems/member-operations.md`, `product/systems/delegation.md`, `product/systems/member-self-record.md`, `product/systems/skills.md`, `planning/DECISIONS.md` ADRs 6-9.

---

## Verdict

The architecture honors the foundational refusals at the schema layer with unusual discipline — there is no Business entity smuggled in, no role-as-identity badge, no engagement feed, no auto-assigned Community, and the Self-Record and Delegation models are genuinely Member-owned. The work is solid where the work is structural. It softens in two specific places that need attention before b2 design: (1) the **Operation declaration prompt on first commercial listing** is a platform-imposed commercial framing that risks pushing casual posters into a "you're a business now" identity moment ADR-3's spirit explicitly refuses, and (2) the **Skill-discovery-via-Operations T3 surface** plus the **standing-tier "badge" that surfaces tier visually on the Self-Record page** together create a soft conversion funnel that can drift into the engagement-loop pattern by another name. The canonical examples mostly survive but the Cafe Capricho successor case stresses the design; the Run Club case is fine without ever touching this stack at all (which is itself a good sign). Quietly reintroduced patterns are minimal, but the language around "asymmetric tooling" and "standing-tier" carries a tilt toward serving the digital-native baker over the canonical Members the platform exists for, and the docs should be honest about which user the architecture is currently optimized for.

---

## Refusal-by-refusal check

**1. No Business entity — HOLDS, with one careful seam.** No spec introduces a `businesses` table, an org shell, or a Skill author of `kind=organization`. `staff` Operations link Person-to-Person via `operating_for_member_id`. Cooperatives are Communities of `cooperative_member` Operations sharing an `operating_label`. Skills authored by "Communities" (T3) route through `author_community_id` — which is fine because Community is already a primitive, not a corporate shell. The careful seam is `operating_label` — a string field shared across partner Operations. It is a *display label*, not an entity, and the spec is explicit about this. As long as no future feature does `SELECT DISTINCT operating_label FROM member_operations` and treats the result as a discovery surface, the refusal holds. Flag for future review: if a `/businesses` or `/operations` browse page ever ships, that's where the shell sneaks in.

**2. No role-as-identity — SOFTENS.** ADR-8 explicitly preserves ADR-3's "no Maker badge" — Maya declares "Oak Park Sourdough," not Maker status. Good. But the capacity enum (`sole_personal`, `side_personal`, `partner`, `cooperative_member`, `staff`, `volunteer_organizer`) and especially the act of *declaring* it elevates capacity to a first-class identity claim in a way `maker_signal`'s derivation deliberately did not. `sole_personal` is functionally a Maker badge with one extra word — it is declared, displayed on the public profile, and gates standing-tier tooling. The platform pre-defines six capacities and asks the Member to pick one before listing their first commercial Item; that is closer to "tell us what you are" than ADR-3's "do the work, we'll notice." The spec mitigates this by (a) making declaration a one-time small step and (b) refusing to reward over-declaration, but the mitigation is thinner than the framing suggests. The right pressure-test: would Ferrari (multigenerational fisherman) recognize himself in `sole_personal` or feel he'd been categorized?

**3. No engagement-optimized feed — HOLDS at the architectural level, softens at the surface.** The Self-Record is explicitly never feed-fuel for other Members (permanent refusal, correctly stated). The Skill catalog has no algorithmic ranking — sort by subscriber count and recency only. Good. The softening is subtle: the assistant + subscribed Skills + Self-Record together produce a personalized stream of *suggestions to the Member* (Skills proposals, Self-Record proposals, drafted Items, "powered by Skill" annotations). That stream is by definition algorithmically curated to the Member, even if it never reaches another Member. The architecture says "feed input for the Member's own surface" is deferred to T3 with a separate three-filter check — that deferral is the right move. But the assistant's natural behavior — proposing Skills relevant to declared Operations, surfacing one inferred Self-Record proposal per session — already constitutes a low-volume personalized recommendation surface. The line is held in *what other Members see*, not in *what the Member experiences*.

**4. No auto-assigned Communities — HOLDS.** No spec creates a path from Operation declaration to Community auto-assignment. `cooperative_member` Operations *link to* a Community, but only if the Member chooses to declare that capacity and only if the Community already exists with the Member as a Member. Partner Operations grouping creates a soft "partners in [label]" surface but does not create a Community — partners are listed adjacent, not joined to a group. Skill catalog discovery uses subscriber count and recency, not community-shaped recommendations. Federation Skills surface the federation peer; they don't enroll the Member in anything. This refusal is the cleanest of the six.

**5. No pay-for-visibility — HOLDS narrowly, with one risk to monitor.** ADR-9 introduces an opt-in platform-mediated payment for Skill authors with a published 5–10% cap. The cut funds maintenance, *not catalog ranking*. The spec is explicit: catalog sort is subscriber count and recency only, and platform Skills carry a "platform" badge but get no algorithmic favor. Holds. The risk to monitor: subscriber count is itself a discoverability signal, and a paid Skill that subsidizes early subscriptions (off-platform, the platform can't see it) effectively buys catalog position. The spec doesn't address this vector. Not a current break — a future-vigilance item.

**6. People-first at the relational layer — HOLDS.** Every Delegation is Person-to-non-human-actor, never granted to or by an entity. Staff link Person-to-Person. Cooperative integration runs through Community (which is itself Persons-deciding-they-are-a-group). Skill authors are Members or Communities, not orgs. Federation peers (T3) are external platforms, not businesses pretending to be Members. The asymmetry "Members can dissolve a Community; a Community cannot dissolve a Member" extends cleanly: Members can revoke any Delegation; no Delegation can survive a Member account deletion. Good.

---

## Canonical examples walkthrough

### 1. Run Club at Drake's (Loops 1, 4)
- **Operations:** None. The organizer convenes a recurring Gathering Item; that's Family 1 work and `member-operations.md` explicitly says Members participating only in Gathering and Sharing don't declare Operations.
- **Items:** One Gathering Item at Drake's, recurring Thursday.
- **Skills:** None at first. If the organizer eventually wants RSVP digest or weather check, they could declare a `volunteer_organizer` Operation to unlock standing tier — but they shouldn't *need* to.
- **Self-Record:** Scratch tier. Name, locality, optional pronouns. Assistant helps draft the Gathering description and not much else.
- **Delegations:** None required for the basic loop.
- **Where it breaks:** It doesn't break — but it exposes a subtle pull. The Run Club organizer who wants a simple RSVP-digest Skill is gated behind declaring `volunteer_organizer`, which means *the platform asks an unpaid civic organizer to declare commercial capacity to access useful tooling*. That's the wrong direction. The fix: standing tier should not be the only tier where Skills are available to organizers; gathering-organizer Skills (RSVP digest, weather check, recurring reminder) should be subscribable from scratch tier, with maker/service Skills gated to standing.

**Verdict: design holds, but reveals a Skills-gating edge case that should be addressed at b2 design.**

### 2. Ferrari Fisheries (Loops 7, 8)
- **Operations:** One — `operating_label="Ferrari Fisheries"`, `capacity=sole_personal`. Declared once.
- **Items:** Irregular product Items ("salmon, today only, here, until 4pm"), brand_label autosuggests Ferrari Fisheries.
- **Skills:** A "follower digest" or "intermittent-supply alert" Skill would help — exactly the kind of asymmetric tool the spec promises.
- **Self-Record:** Standing tier (Operation declared). Pinned facts: dock locations, peak season, kid's school district. Voice: terse. Tastes: not relevant.
- **Delegations:** `draft_product`, `draft_response`, `read_member_followers`. Confirm-publish stays human (he presses send when the boat docks).
- **Where it breaks:** The capacity enum forces him to pick `sole_personal` even though "fisherman who runs Ferrari Fisheries" is not really a category Ferrari thinks in — he's just doing what his family has done. The label is benign but the *act of categorizing* is mildly synthetic. More structurally: the design assumes Ferrari (or a child/grandchild) will use a phone-based assistant to draft alerts. Will the actual fisherman? Probably not. Will the family member who handles "the website" use it? Plausibly. The architecture is correct but the user it serves is one step removed from the canonical Person. This is a UX/onboarding question more than a foundational break — flag for the b2 design.

**Verdict: design holds, with the caveat that the assistant-using user may not be the Person on the boat.**

### 3. Cafe Capricho's Successor (Loops 10, 11)
- **Operations:** The aspiring operator declares an Operation only after the Initiative succeeds and the cafe reopens. Pre-reopening, *they have no commercial activity* — they're a Member with an Initiative Item.
- **Items:** One Initiative Item ("take over Cafe Capricho").
- **Skills:** Eventually — a "loan readiness" Skill from a federation CDFI, a "cooperative formation" Skill from a Community of cooperative experts. But none of these exist at b2; they're T3.
- **Self-Record:** Scratch tier (no Operation yet) — which means the assistant is *less* helpful exactly when the Member is doing the highest-stakes work. The Member preparing a community-pitch deck for Cafe Capricho gets a smaller assistant than Maya drafting a follower note.
- **Delegations:** Read-locality, draft-response, read-self-record. No money flow (pledges are categorically not delegable, correctly).
- **Where it breaks:** The standing-tier gate — "≥1 active Operation" — is the wrong gate for Loop 10. An aspiring operator pre-reopening has no Operation but is doing the most consequential work the platform supports. The design's response would presumably be "they can declare an Operation for the Initiative work itself" — but that's a stretch of the capacity enum (none of the six capacities fit "trying to start a thing that doesn't exist yet") and forces a premature commercial framing on what is still a community-pledge organizing job. **Real finding:** the standing-tier gate is calibrated for Family 3 (Trade) and pulls poorly for Family 4 (Pooling) Members in the Initiative-organizing phase.

**Verdict: design forces a square peg — the standing-tier gate doesn't accommodate Loop 10/11 organizers pre-Operation.**

### 4. Bumble BFF Refugees (Loop 1, affinity-first)
- **Operations:** None. Affinity-first Communities are Family 1 work.
- **Items:** Eventually, Gathering Items hosted by Community Members.
- **Skills:** None needed at the start. The Community needs only a name, a join button, and a way for Members to declare gatherings inside it.
- **Self-Record:** Scratch tier. Fine.
- **Delegations:** None.
- **Where it breaks:** Doesn't break. The agent-assistance stack is correctly invisible here — which is the right answer. Worth noting as evidence the architecture honors "the assistant is invisible when not needed."

**Verdict: design holds; agent stack is correctly absent.**

### 5. Quarterly Dip Vendor / Food Truck / Barn Movie Night
These compress to one finding: irregular Maker Operations (`sole_personal` or `side_personal`) and Gathering Items at Locations (Barn Movie Night) all fit the schema cleanly. The standing-tier gate works for the dip vendor and food truck (both have Operations); Barn Movie Night fits the Run Club pattern (Drake's would declare `volunteer_organizer` if and only if they want organizer Skills, with the same caveat as Run Club).

**Verdict: design holds.**

---

## Platform-as-instrument findings

1. **The "first commercial listing prompts Operation declaration" UX moment (ADR-8 consequences) is the highest-risk surface in the entire stack.** It is the moment the platform inserts itself between the Member and the work. ADR-3's spirit was "do the work, we notice"; the new pattern is "do the work, but first declare a category from a six-item enum." The mitigation is that it happens once. The risk is that it widens commercial framing onto activity the Member would have framed as casual. Ferrari might be fine. The first-time honey-jar seller at the Saturday market may experience this differently. The design should A/B (or at minimum carefully UX-test) whether a Member who lists one product and never returns is a casual gesture preserved — or a person scared off by the "what kind of business are you" prompt.

2. **Skill-discovery-via-Operations (T3) is exactly the surface where "the platform's instrument" becomes "the platform-the-business model's instrument."** The spec phrases it as helpful suggestion ("you've declared a `volunteer_organizer` Operation — want to try the RSVP-digest skill"), and it is — but the same architecture is one product decision away from "Members with more declared Operations see more suggestions, which leads to more subscriptions, which leads to more Operations declared." The spec's commitment to "suggestions, never auto-subscriptions" and "casual Members are not nudged toward Skills they don't need" is the right line. The fix: define "nudge" structurally — what's the per-session cap on Skill suggestions, what's the cooldown after dismissal, can a Member turn off suggestions entirely. Without those caps in the spec, "suggestion" can drift into "feed."

3. **The standing-tier badge on the Self-Record page** ("a small badge on the Self-Record page showing the current tier and the standing signals that promote it" — `member-self-record.md` T2) is a small UX surface with an outsized effect. Showing a Member their tier creates upward pressure to reach the next tier — which means declaring an Operation to unlock fuller assistant context. That's a conversion funnel by another name, particularly for Members in Gathering/Sharing loops who have no commercial activity but can see what they'd unlock. Recommendation: drop the badge, or replace it with a quieter "your assistant's memory: small / full" framing that doesn't telegraph a tier hierarchy.

4. **"Asymmetric tooling" framing in `skills.md`** ("turn the generic assistant into a baker's assistant") is correct as a competitive answer to chains, but it carries a tilt: the design language assumes the Member wants more capability, more Skills, more standing presence. For the Run Club organizer, the right posture is *fewer* tools, not more. The spec should explicitly name the cases where the right number of Skills is zero.

5. **The platform is currently optimized for the digital-native baker.** Maya (sourdough, Saturday market, comfortable with apps) is the user every spec implicitly designs for. Ferrari, the dip vendor, Drake's-running-the-Run-Club, and the aspiring Cafe Capricho operator are all canonical examples that would touch this stack lightly or awkwardly. This is not a foundational break — but it is a tilt the docs should be honest about, and the b2 design pass should explicitly test the awkward cases, not the comfortable one.

---

## Two questions that would change the verdict

1. **What happens to a Member who lists their first product Item, gets prompted to declare an Operation, and declines?** The spec implies they can decline, but doesn't say what the Item-creation flow does next, whether the Item still publishes, or whether the Member gets re-prompted on listing #2. The answer determines whether ADR-8 honors ADR-3's spirit (work-first, no claim required) or quietly pivots to a "you must categorize before you can act" pattern.

2. **For Loop 10/11 organizers (Cafe Capricho's successor), what gate gives them standing-tier assistant context?** If the answer is "declare an Operation called 'organizing the Cafe Capricho Initiative'," the capacity enum doesn't have a fitting value and forcing one is the square peg. If the answer is "Initiative Items grant their author standing tier," that's a different gate the spec doesn't currently define. Without a clean answer, Family 4 Members get the smaller assistant exactly when they need the larger one.
