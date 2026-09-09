---
id: why-policy
purpose: The three-filter test every privacy/revenue/data-sharing decision passes through, and the opt-out default.
layer: why
status: active
---

# Policy framework

Every proposed default, opt-in, or exception passes three questions, in order: **(1) Is this helpful, economically or socially, to members? (2) Does it harm anyone else — including non-participants?** Subtle harms (eroded norms, pressure to participate) count, not just obvious ones. **(3) Can this be abused by a bad actor** — a hostile member, a captured operator, a future owner? A policy that depends on good intentions to stay safe fails this filter; mitigations are the policy's burden, not the abused party's. Every prior wave of social platforms passed filters 1 and 2 at launch and failed filter 3 over time — threat-modeling at design time is cheaper by orders of magnitude than retrofitting after an abuse pattern ships.

## The opt-out default

Default posture for any non-essential data sharing, monetary flow, or relaxed protection: **off.** Anything that benefits a member at the cost of relaxed protection is opt-in — visible, granular (opting into one thing doesn't imply another), revocable at no cost to the member, and time-bounded where the stakes warrant it. This is a structural posture, not a UX preference — it's what makes "the law only requires X" arguments inadmissible, since the platform's floor is its own framework, not a regulatory minimum.

Every system spec that introduces a policy surface must state its default, its opt-ins, and walk each opt-in through the three filters explicitly, in the spec itself — not as a separate governance step.

## Accountable participation

The platform's answer to the anonymous-complaint-feed failure mode (no one accountable → people act with impunity): every action ties to a real identity. Messaging stays scoped to an Item or a Group, never a Location-as-constituency feed or a location-scoped DM list — Items have an author who chose to be the focal point; Locations don't have members who chose to be addressable. **The one hard architectural floor inside this, not a design conversation:** `member_place_interests` and `member_saved_searches` are owner-only RLS with no exception — no peer, no query path, can ever read another member's private geography. An aggregate ("how many members opted into this place") can only ever be a function returning a count, never a row-level join.

The platform pushes back on complaint-only content by offering — never forcing — a fix-it pairing in the same composer (a Wonder, an Ask, a Gathering that leads toward a solution). A complaint paired with a solution circulates fully; a bare complaint gets a nudge and reduced circulation, never silent deletion. Illegal, threatening, or child-safety content is a separate flow with human review, not this mechanism.

## Uploaded images — two standing constraints

**An uploaded image is stripped of embedded metadata (GPS included) before storage.** Three individually harmless facts combine into a doxxing vector: phone photos carry GPS, producers often work from home, and item locations are already public — an unstripped kitchen photo on a public listing publishes a home address nobody consented to showing. Enforcement is structural: the client re-encodes, and the bucket accepts exactly one format, so re-encoding is the only path in. A deliberately crafted file could still smuggle a metadata chunk — recorded as a residual risk, not claimed away.

**Nothing is published that can't be taken down** — a takedown path exists before the first upload is accepted. This is an operations argument, not an ethical promise to anyone: serving an image with no way to remove it is an unbounded liability with no recovery path.

## What this rules in and out

Rules in: opt-in cross-member sharing with granular scope, opt-in aggregate analysis, capped recurring-payment delegations. Rules out: any default-on sharing, any silent expansion of an existing opt-in, any "the ToS covers it" rationalization, any policy whose safety depends on nobody acting in bad faith.
