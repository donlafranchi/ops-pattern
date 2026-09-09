---
id: what-member
purpose: Anchor primitive — one row per real human — and why it carries no role, no business shell, no stored address.
layer: what
status: active
---

# Member

A Member is the platform's record of one real human — one row, lifetime-stable. Every Item is created by a Member, every Group founded and joined by Members, every event attributed to one. A Member is not a role: the platform models verbs, not identities — a Member posting products is acting as a seller, the same Member organizing a gathering is acting as a host, and neither is a stored column. A Member is not a business — a personal business is a `kind='business'` Group (a Group of one, for a sole proprietor), never a flag on the Member row. A Member is not a Location — geography lives across three purpose-owned, mostly-private substrates rather than one fused table, because they answer genuinely different questions (a locality default, a private awareness scope, a public seller-locality claim) and fusing them once already produced a table that leaked private signals through a public derivation.

**No street address is stored for any Member, by default.** ZIPs, Places, and radius queries cover every locality feature in scope, and not having an address store keeps the doxxing blast radius small. This isn't a categorical refusal — if a defined Member benefit ever needs one, the column can be added with a stated safety mechanism — but the default is no, and adding it without naming the benefit and the mitigation is refused.

## Real names are encouraged, never required

Requiring a real name raises trust among neighbors who recognize each other, but it also blocks exactly the people who most need this platform to protect them — a domestic-violence survivor, someone whose physical safety depends on not being findable by name. Encourage-not-require keeps both groups onboardable: the trust signal is available to whoever can safely offer it, and nobody is gatekept on a credential the platform can't verify or protect anyway.

## Discoverability defaults to off; a member's outputs don't

`is_discoverable` gates whether a Member surfaces in search, directory listings, autocomplete, or external indexing — default **false**. This is separate from whether a Member's *outputs* are visible: posting an Item, hosting a gathering, or founding a Group publicly is itself consent to attribution, and every one of those surfaces still carries the acting Member's name. What stays gated is the *link* from that attribution back to the personal profile — a shop's "Founded by" line always names the founder, but links to their profile only if they've separately opted into discoverability. This lets someone run a publicly findable shop without their personal identity being publicly searchable.

**The platform never auto-flips the bit**, even when a Member becomes a producer or organizer — acquiring a business Group or a steward role triggers a one-time, dismissible prompt offering the opt-in, never an automatic change. Role acquisition is a data state; discoverability is a consent decision, and the two must never be conflated.

## Selling tools have no toggle

There's no "maker mode." Selling surfaces (composers, dashboard, agent-assistance affordances) are present exactly when a Member holds an active `kind='business'` Group membership or has posted a product/service Item — never behind a Member-level flag. To start selling, join or create a business Group; to stop, end that membership. The signal is declared, dated, and ungameable because it lives in the Group event log, not a boolean anyone could silently toggle.

## Standing presence is a data state, not a mode

A Member has "standing presence" — the gate for fuller agent-assistance surfaces — when they hold an active business-Group membership of any role, or a steward role in any non-business Group. It's computed from membership rows, never stored as a flag, and a Member without either is still fully functional: they can browse, RSVP, follow, save, and post ideas. Joining or founding a Group is what shifts them into the tier, and it happens because they took the deliberate "Sell" action, never by accident.

## Geography lives in three separate, mostly-private substrates

**A locality default** (a soft pointer, never an address, never shared). **A private awareness scope** — one primary home Place plus a handful of secondary ones, read by the discovery feed's candidate generation and never consulted for messaging targets. **Saved searches** — a general subscription shape ("anything at Drake's," "sourdough drops in Oak Park") that subsumes what would otherwise be a per-venue follow row. Both the awareness scope and saved searches are **owner-only at the row level** — no peer Member, no anonymous visitor, can read another Member's rows under any condition. If a future surface needs an aggregate ("how many Members care about Sacramento"), it's a named function returning a count, never a row-level join. Follow relationships between people, by contrast, ship public-by-default — the privacy investment is spent where it protects against cross-community reconnaissance by a bad actor, not against neighbors who already know each other seeing who follows whom.

**Neither substrate is ever a send-to target.** No feature sends a message, a post, or any content to "Members with place-interest in X." This is the same accountable-participation commitment that shapes Locations and Groups, applied here — private geographic signal that becomes addressable is exactly the anonymous-complaint-feed failure mode arriving through a new door.

## Direct messaging ships substrate before surface, deliberately constrained

The message tables exist at launch so a later surface doesn't need a retrofit, but no UI ships, and the schema is constrained to same-Group threads only — relaxed later with an explicit opt-in for messages from outside a Member's Groups. This keeps the moderation surface area at zero for a solo team while the schema is still landing. The thread table carries no location column at all, by the same no-Location-messaging commitment that shapes every other system.

## No role column, no business shell — the two things never to add

The temptation will be a `role` enum on the Member row (Maker, Organizer, Founder) so routing is easy. Refuse it — the moment a stored role lands, the primitive collapses back into a directory-of-types, and the same holds for any "is this a business" boolean. A Member who runs a business is captured entirely by their Group memberships and their Items, never by a flag that could drift out of sync with what's actually true.

## Substrate reserved at launch for agent assistance, with no surface yet

Member-owned context storage and scoped, expiring permission grants to non-human actors (Delegations) both exist as tables from day one, with no UI. This is the one decision that keeps a later agent-assistance surface from being a multi-month retrofit — the cost now is a couple of empty tables and two audit columns on every event row; the cost of skipping it would be rewriting every write handler later to retroactively populate an audit trail that should have existed from the start. Delegation-granted writes populate the audit trail at the handler, never trusted from the caller.

## Social capital — a planned feature, not yet designed

Members will eventually earn recognition through participation — hosting, fulfilling, sharing, showing up — that's Member-owned (follows them across every Group, portable through federation), never a ranking signal that changes what other Members see, and always optionally surfaced. The shape isn't settled yet; this is the standing intent, not a shipped design.

## What this rules out

A stored role or account-type column of any kind. A Business entity anywhere in the ownership chain. Any surface that sends content to a private geographic signal as its target. Auto-flipping a Member's discoverability on any state change, including acquiring a business Group. A stored street address without a named benefit and a stated safety mechanism attached.
