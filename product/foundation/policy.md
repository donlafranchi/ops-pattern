---
id: why-policy
purpose: The three-filter test every privacy/revenue/data-sharing decision passes through, and the opt-out default.
layer: why
status: active
last-updated: 2026-09-12
---

# Policy framework

Every proposed default, opt-in, or exception passes three questions, in order: **(1) Is this helpful, economically or socially, to members? (2) Does it harm anyone else — including non-participants?** Subtle harms (eroded norms, pressure to participate) count, not just obvious ones. **(3) Can this be abused by a bad actor** — a hostile member, a captured operator, a future owner? A policy that depends on good intentions to stay safe fails this filter; mitigations are the policy's burden, not the abused party's. Every prior wave of social platforms passed filters 1 and 2 at launch and failed filter 3 over time — threat-modeling at design time is cheaper by orders of magnitude than retrofitting after an abuse pattern ships.

## The opt-out default

Default posture for any non-essential data sharing, monetary flow, or relaxed protection: **off.** Anything that benefits a member at the cost of relaxed protection is opt-in — visible, granular (opting into one thing doesn't imply another), revocable at no cost to the member, and time-bounded where the stakes warrant it. This is a structural posture, not a UX preference — it's what makes "the law only requires X" arguments inadmissible, since the platform's floor is its own framework, not a regulatory minimum.

Every system spec that introduces a policy surface must state its default, its opt-ins, and walk each opt-in through the three filters explicitly, in the spec itself — not as a separate governance step.

## Accountable participation

The platform's answer to the anonymous-complaint-feed failure mode (no one accountable → people act with impunity): every action ties to a real identity. Messaging stays scoped to an Item or a Group, never a Location-as-constituency feed or a location-scoped DM list — Items have an author who chose to be the focal point; Locations don't have members who chose to be addressable. **The one hard architectural floor inside this, not a design conversation:** `member_place_interests` and `member_saved_searches` are owner-only RLS with no exception — no peer, no query path, can ever read another member's private geography. An aggregate ("how many members opted into this place") can only ever be a function returning a count, never a row-level join.

The platform pushes back on complaint-only content by offering — never forcing — a fix-it pairing in the same composer (a Wonder, an Ask, a Gathering that leads toward a solution). A complaint paired with a solution circulates fully; a bare complaint gets a nudge and reduced circulation, never silent deletion. Illegal, threatening, or child-safety content is a separate flow with human review, not this mechanism.

## Who sees who is involved

**Involvement is the qualification, and membership is what makes someone involved.** Group members see who RSVP'd; only a business's owners see who bought; nobody else sees who is involved (Don, 2026-09-30). The full table: `nouns.md` § Who sees what. `member_place_interests` and `member_saved_searches` remain owner-only with no exception.

## Uploaded images — two standing constraints

**An uploaded image is stripped of embedded metadata (GPS included) before storage.** Three individually harmless facts combine into a doxxing vector: phone photos carry GPS, producers often work from home, and item locations are already public — an unstripped kitchen photo on a public listing publishes a home address nobody consented to showing. Enforcement is structural: the client re-encodes, and the bucket accepts exactly one format, so re-encoding is the only path in. A deliberately crafted file could still smuggle a metadata chunk — recorded as a residual risk, not claimed away.

**Nothing is published that can't be taken down** — a takedown path exists before the first upload is accepted. This is an operations argument, not an ethical promise to anyone: serving an image with no way to remove it is an unbounded liability with no recovery path.

## What this rules in and out

Rules in: opt-in cross-member sharing with granular scope, opt-in aggregate analysis, capped recurring-payment delegations. Rules out: any default-on sharing, any silent expansion of an existing opt-in, any "the ToS covers it" rationalization, any policy whose safety depends on nobody acting in bad faith.

## How good faith is enforced

*(Moved here from `promises.md`, 2026-09-12.)*

By community and peer pressure, not platform policing. This is a know-and-support-your-community platform, not an anonymous one — a vendor who claims to be somewhere they aren't is seen by their own followers, and the social cost lands immediately without the platform doing anything. That's why appearances are auto-approved rather than gatekept: an approval queue treats a false claim as something the platform must prevent, and where the claimant's neighbours can see the claim, prevention is work the community does better and faster.

**Peer pressure for good** *(Don, 2026-10-01)*. Members reward good creators and stop rewarding poorly behaving ones. We don't bully and we don't pile on; we press gently for people to do better. **This is how we operate, everywhere.**

**Feedback on a Page is like a business review, and it is not a rating of a person.** It is never published. It is anonymized and aggregated for the Page's owner, so they hear what neighbours like and don't, without knowing who said it and without a crowd watching. The same goes for every kind of feedback the platform collects.
