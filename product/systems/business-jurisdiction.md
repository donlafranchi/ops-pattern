---
id: what-business-jurisdiction
purpose: Three-tier locally-owned verification without exposing addresses.
layer: what
status: active
---

# Business jurisdiction

A "locally owned and operated" claim needs to anchor to something more than self-report, without forcing an owner to expose a home address. The answer is a verification ladder — self-attested → community-attested → document-verified — whose tier is itself a public signal: a Group can be "Says locally owned" (Tier 0, the owner's own claim, 2026-09-30), "Community-confirmed" (Tier 1), or "Documented" (Tier 2). Members aren't punished for sitting at Tier 0; the badge is honest about the evidence level instead of pretending every claim is equally strong. A Group with no jurisdiction record from any owner simply doesn't surface the badge — the platform doesn't punish absence, it just doesn't claim what hasn't been claimed.

**Locality is separated from address by design.** The platform stores a ZIP (or ZIP-equivalent), never a street address, as locality evidence — the ZIP proximity test runs against the Group's anchor location, but a safety-conscious owner can declare an accountant's ZIP or a PO box instead of their kitchen. This is the same reasoning already ratified twice elsewhere in the project (the locality-vs-address separation on Pages, the findability-follows-publication rule) — one commitment, applied a third time.

**OR-aggregation across all active owners, no founder privilege.** A business Group qualifies as locally owned if *any* active owner's jurisdiction record passes the proximity test — not all owners, not a designated "owner of record." A partnership with one local and two non-local owners is still locally-owned in the way that matters for a "should I support this" decision, and privileging the founder specifically would break the moment ownership transfers. The rule survives owner additions and removals automatically, because it's computed, not stored as a flag.

**Why Tier 1 is community-attestation, not a government-records lookup.** SOS-of-convenience filings (a Delaware LLC operating in Sacramento) are a known evasion path for record-based verification, and buyers who've actually transacted with a seller have ground-truth a public filing doesn't carry. This is peer pressure for the greater good, the same enforcement model the rest of the platform runs on — not an external integration. The tradeoff, accepted: Tier 1 needs the interaction graph to reach real density first, so it's a b2+ concern; Tier 0 self-attestation is the honest floor at launch.

**Document upload (Tier 2)** is the widest tier for sole props with no LLC — an EIN letter or business license, ZIP extracted, document never shown publicly, only the extracted ZIP and the tier label render.

## What this rules out

A parallel locality-derivation path that bypasses both signals — any future third signal (a federation peer's own verification, say) extends the ladder, it doesn't create a side channel around it. Auto-derivation from a Member's home location or affinities — the Member must explicitly declare a jurisdiction; the platform never infers one. Showing the underlying document publicly, ever — only the tier label and the ZIP.

## Companion badge

"Locally Made" is the sibling claim, on `items.made_at_place_id` — jurisdiction answers "does the money go to a local owner," provenance answers "was this made here." Same evidence-ladder shape, different signal, designed together so neither has to be retrofitted against the other.
