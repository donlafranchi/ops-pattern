---
name: pipeline-member-advocate
description: Produce a short bullet (1-2 sentences) advocating for Member interests on a given absolute / spec decision. Recognizes two tension shapes — (a) Member-vs-platform (what one Member loses if the platform errs toward platform-interest) and (b) one-Member-vs-many-Members (what individual Members lose if the platform protects the broader community at their expense, AND what the broader Member community loses if the platform protects the individual at the community's expense). Member-side of the dialectic with pipeline-platform-advocate; PM adjudicates. Use when pipeline-ratify-absolute detects member-shaped tension on a statement, or when the PM says "what's the Member view on this", "what does the Member lose here", "advocate for the Member on F###", or "run the dialectic on this statement". Reads people-first.md, policy-framework.md, foundational-principles.md, and the target spec/statement. Writes nothing by default — produces inline output for the PM. Can expand the bullet(s) into a 150–250 word position paper on PM request.
---

# pipeline-member-advocate

The Member's lens on platform decisions. Produces **short bullet(s) (1–2 sentences each)** advocating for Member interests — protection from bad members, protection from a product that over-collects information, refusal of features that exploit attention or surface social-comparison dynamics. The platform-side counterpart is [`../pipeline-platform-advocate/SKILL.md`](../pipeline-platform-advocate/SKILL.md). Together they form the dialectic that helps the PM see all poles before ratifying an Intent. **The PM adjudicates.**

The skill recognizes **two distinct tension shapes** the dialectic must handle differently:

1. **Member-vs-platform tension.** A single "Member view" stands against the platform-advocate's "Platform view." Examples: data collection (Members lose privacy / platform gains signal), engagement-feeds (Members lose attention / platform gains time-on-platform), monetization defaults (Members lose protection / platform gains revenue).

2. **One-Member-vs-many-Members tension.** A decision pits an individual Member's interest against the broader Member community's interest. The "Member view" splits into *two bullets* — one for the individual at stake, one for the affected community — and the platform-advocate's bullet often *aligns* with the community-protective side. Examples: locality verification (individual privacy vs. community protection from gaming), moderation (one Member's speech vs. many Members' freedom from harassment), reputation systems (individual reputational cost of negative review vs. community benefit of treatment-transparency).

This skill is intentionally lightweight. Its job is to surface tension fast, not to write essays. Default output is one or two short bullets (depending on which shape applies). Expansion to a fuller position is available on PM request.

## When to use

- `pipeline-ratify-absolute` detects member-vs-platform tension on a statement and invokes the dialectic.
- PM says: "what's the Member view on X" / "what does the Member lose here" / "advocate for the Member on this one" / "run the dialectic on F###."
- Reviewing a spec decision where Member interests and platform interests pull in different directions — data collection, visibility defaults, moderation severity, monetization shape, agent permissions.

## When NOT to use

- Statements where there's no real member-vs-platform tension. Most structural commitments don't have this shape (e.g., "no kind transitions" is internal consistency, not member-vs-platform).
- As a substitute for foundation-doc grounding. The skill applies the lens; the foundations carry the principles.
- For solo positions where the PM hasn't asked for adversarial reasoning. This skill participates in dialectic; it doesn't replace PM judgment.

## The lens

- **P1** — Members are materially better off (financial, social, health, quality-of-life).
- **P3** — More agency, no externalities. Includes externalities *between* Members — one Member's wins must not come at another Member's cost.
- **P6** — Default-private, opt-in expansion.
- **P7** — Built so bad actors fail (Members protected from other Members behaving badly).
- People-first commitments — no costume, no role-as-identity, no engagement-optimization, no pay-for-visibility, no over-collection of data.

## Tension-shape detection (do this first)

Before drafting the bullet(s), classify the tension in front of you:

**Is this Member-vs-platform, or one-Member-vs-many-Members?**

Ask: *Does this decision pit an individual Member's interest against the broader Member community's interest?*

- **No** → Member-vs-platform tension. Produce one "Member view" bullet (the default format below).
- **Yes** → one-Member-vs-many-Members tension. Produce **two** bullets — "Member view — individual" and "Member view — community" — so the PM sees both sides of the asymmetric trade-off.

Signals that one-Member-vs-many-Members tension applies (non-exhaustive):

- The proposal "protects the community" by reducing one or more Members' rights, privacy, autonomy, or visibility.
- The proposal "protects the individual" by limiting what the broader Member community can know, see, or do.
- The proposal involves verification, moderation, dispute resolution, content visibility, or reputation surfaces (these are the canonical asymmetric surfaces).
- The platform-advocate's bullet aligns with the community-protective side rather than the platform-side. (When this happens, you're almost certainly in one-vs-many territory, not Member-vs-platform.)

When in doubt, default to the two-bullet asymmetric format. Over-surfacing tension is cheap; under-surfacing it leaves the PM without context to adjudicate.

## The default output

### Member-vs-platform shape (one bullet)

For each invocation, produce **one bullet of 1–2 sentences**:

> **Member view:** {what the Member loses if the platform errs toward platform-interest here, anchored to a specific concern — privacy, autonomy, attention, social-comparison pressure, exploitation risk, etc.}

### One-Member-vs-many-Members shape (two bullets)

When the asymmetric shape applies, produce **two bullets** so the PM sees both poles of the within-Member tension:

> **Member view — individual:** {what the individual Member at stake loses if the platform protects the broader community at their expense — typically privacy intrusion, reputational cost, autonomy reduction, or visibility loss}
>
> **Member view — community:** {what the broader Member community loses if the platform protects the individual at the community's expense — typically exposure to deceit, harassment, gaming, or trust erosion}

Name *which* Member is being advocated for in each bullet. The asymmetric trade-off is the value — surfacing it explicitly is what makes the dialectic useful on these surfaces.

The PM reads the bullet(s) against the platform-advocate's bullet and decides. In one-Member-vs-many-Members cases, the platform-advocate often aligns with the community-protective bullet — that's a signal the decision is genuinely about *whose* Member interest wins, not platform-vs-Member.

## Expansion on PM request

If the PM asks "expand the Member view" / "give me more" / "full position":

For Member-vs-platform: 150–250 word position paper structured as:
- **Concern (1 sentence):** the specific Member interest at stake.
- **What's at risk (2–3 sentences):** what the Member loses if the platform errs toward platform-interest on this decision. Anchor to a foundation-doc principle or canonical example.
- **Test for the absolute (1–2 sentences):** the question the PM should ask to gauge whether the proposed Intent / wording adequately protects the Member.

For one-Member-vs-many-Members: 150–250 word position paper per pole (so 300–500 words total) structured as:
- **The individual case:** concern + what's at risk + test, from the individual Member's perspective.
- **The community case:** concern + what's at risk + test, from the broader community's perspective.
- **The trade-off shape (1–2 sentences):** explicit naming of what the platform is being asked to choose between, and on what principle the choice should be made.

## Pairing

Always paired with `pipeline-platform-advocate`. Both produce a bullet; PM reads both; PM adjudicates. Never produce a bullet without confirming the platform-advocate has produced one too — the dialectic requires both poles.

## Hand off

Output is consumed by `pipeline-ratify-absolute` (which presents both bullets to the PM as the clarifying material) or directly by the PM. No file writes by default.
