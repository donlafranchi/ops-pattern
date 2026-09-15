---
id: what-member
purpose: Anchor primitive — one row per real human — and why it carries no role, no business shell, no stored address.
layer: what
status: active
---

# Member

A Member is the platform's record of one real human — one row, lifetime-stable. Every Item is created by a Member, every Group founded and joined by Members, every event attributed to one. A Member is not a role: the platform models verbs, not identities — a Member posting products is acting as a seller, the same Member organizing a gathering is acting as a host, and neither is a stored column. A Member is not a business — a personal business is a `kind='business'` Group (a Group of one, for a sole proprietor), never a flag on the Member row. A Member is not a Location — geography lives across three purpose-owned, mostly-private substrates rather than one fused table, because they answer genuinely different questions (a locality default, a private awareness scope, a public seller-locality claim) and fusing them once already produced a table that leaked private signals through a public derivation.

**No street address is stored for any Member, by default.** ZIPs, Places, and radius queries cover every locality feature in scope, and not having an address store keeps the doxxing blast radius small. This isn't a categorical refusal — if a defined Member benefit ever needs one, the column can be added with a stated safety mechanism — but the default is no, and adding it without naming the benefit and the mitigation is refused.

## A legal name is required to the platform; a display name is what the public sees

**Nobody is anonymous to the platform.** Every Member gives their full legal name at signup, alongside email — self-attested, not document-verified, but required, never optional. This is the accountability floor: content the platform can't trace to a real person is a report-and-takedown path with nothing behind it. (2026-09-14, reverses the earlier "real names encouraged, never required" rule.)

**Nobody is required to be identifiable to other members on a public surface.** A separate display name is what a Member's posts, Page, and responses show everyone else — it can be a first name, a nickname, anything. The safety reasoning the old rule was protecting — a domestic-violence survivor, someone whose physical safety depends on not being findable by name — is unchanged: pseudonymity at the peer layer still covers it. What changed is that the platform itself always knows who someone is, even when other members don't.

**A counterparty is the exception, and it is not a default.** *(2026-09-14, Don's ruling.)* Someone who bought what a Member sold, or showed up to something they hosted, learns that Member's legal name — accountability is being known to the people you are accountable to, and a seller who is a handle to their own buyer is accountable to nobody. The disclosure follows a named transaction or a recorded attendance, reaches only the person on the other side of it, and never widens into a public surface. The enforcement mechanism is visibility and peer pressure (`../foundation/policy.md` § How good faith is enforced) — not an ID check, a selfie, an approval queue, or a badge.

## A second, stronger-verified tier is referenced, not yet built

F080 gates one content category (anything about a child) behind a tier beyond the self-attested legal name every Member has — ID plus a selfie match, unbuilt as of 2026-09-14. This is a personal-identity tier, distinct from the producer trust ladder in `ROADMAP.md` (self-attest → community-attest → document-verify, which is about a *business's* claims, not a person's identity). Two different nouns; don't conflate them into one "tier" concept.

## Discoverability defaults to off; a member's outputs don't

`is_discoverable` gates whether a Member surfaces in search, directory listings, autocomplete, or external indexing — default **false**. This is separate from whether a Member's *outputs* are visible: posting an Item, hosting a gathering, or founding a Group publicly is itself consent to attribution, and every one of those surfaces still carries the acting Member's name. What stays gated is the *link* from that attribution back to the personal profile — a shop's "Founded by" line always names the founder, but links to their profile only if they've separately opted into discoverability. This lets someone run a publicly findable shop without their personal identity being publicly searchable.

**The platform never auto-flips the bit**, even when a Member becomes a producer or organizer — acquiring a business Group or a steward role triggers a one-time, dismissible prompt offering the opt-in, never an automatic change. Role acquisition is a data state; discoverability is a consent decision, and the two must never be conflated.

## Geography lives in three separate, mostly-private substrates

**A locality default** (a soft pointer, never an address, never shared). **A private awareness scope** — one primary home Place plus a handful of secondary ones, read by the discovery feed's candidate generation and never consulted for messaging targets. **Saved searches** — a general subscription shape ("anything at Drake's," "sourdough drops in Oak Park") that subsumes what would otherwise be a per-venue follow row. Both the awareness scope and saved searches are **owner-only at the row level** — no peer Member, no anonymous visitor, can read another Member's rows under any condition. If a future surface needs an aggregate ("how many Members care about Sacramento"), it's a named function returning a count, never a row-level join. Follow relationships between people, by contrast, ship public-by-default — the privacy investment is spent where it protects against cross-community reconnaissance by a bad actor, not against neighbors who already know each other seeing who follows whom.

**Neither substrate is ever a send-to target.** No feature sends a message, a post, or any content to "Members with place-interest in X." This is the same accountable-participation commitment that shapes Locations and Groups, applied here — private geographic signal that becomes addressable is exactly the anonymous-complaint-feed failure mode arriving through a new door.

## Direct messaging

The DM substrate hangs off the Member, but its shape — the same-Group constraint, the no-location rule, what the first migration carries — is specified in `../foundation/messaging-problem.md`.

## No role column, no business shell — the two things never to add

The temptation will be a `role` enum on the Member row (Maker, Organizer, Founder) so routing is easy. Refuse it — the moment a stored role lands, the primitive collapses back into a directory-of-types, and the same holds for any "is this a business" boolean. A Member who runs a business is captured entirely by their Group memberships and their Items, never by a flag that could drift out of sync with what's actually true.

Business and creator status is a Group-membership fact, never a Member column — how selling, hosting, and organizing derive from that membership is `creator.md`.

The Group member-vs-follower distinction is not re-derived here: it's in `../foundation/verbs.md` and `groups.md`.

## Substrate reserved at launch for agent assistance, with no surface yet

Member-owned context storage and scoped, expiring permission grants to non-human actors (Delegations) both exist as tables from day one, with no UI. This is the one decision that keeps a later agent-assistance surface from being a multi-month retrofit — the cost now is a couple of empty tables and two audit columns on every event row; the cost of skipping it would be rewriting every write handler later to retroactively populate an audit trail that should have existed from the start. Delegation-granted writes populate the audit trail at the handler, never trusted from the caller.

## What this rules out

Any surface that sends content to a private geographic signal as its target. Auto-flipping a Member's discoverability on any state change, including acquiring a business Group. A stored street address without a named benefit and a stated safety mechanism attached. Row-level read access to another Member's awareness scope or saved searches, under any condition. A legal name on a public or discovery surface, or visible to an anonymous visitor. *(Amended 2026-09-14 — this read "anywhere a peer member or anonymous visitor can see it," which forbade the counterparty disclosure above.)* A Member account existing without a legal name on file. (The stored-role and Business-entity refusals live with the pattern they constrain — `creator.md`.)
