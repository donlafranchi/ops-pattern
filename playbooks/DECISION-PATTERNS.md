---
purpose: How to make calls — the default, the tiebreaker order, the one absolute.
layer: how
status: active
---

# Decision patterns

How to make calls — for the PM, and for any agent acting on the PM's behalf. One default, one tiebreaker order, one absolute. Architect for reversibility, not for being right the first time.

> Sister docs: [PLATFORM-PATTERNS](PLATFORM-PATTERNS.md), [DEVELOPMENT-PATTERNS](DEVELOPMENT-PATTERNS.md), [writing-docs](writing-docs.md). The `weigh` skill is the runtime expression of this document.

---

## The default — mutual benefit, reversible

When the choice isn't close, pick the option that serves all affected parties (Members, the platform, third parties, future-us). Bias toward the option that stays editable later. A decision that can be revisited cheaply when the situation changes is worth more than a decision that's optimal today but expensive to reverse.

This is the working answer for the great majority of choices. It is not a rule with a single exception; it is a default with a tiebreaker order.

---

## The tiebreaker — when the call is close

A "close call" means the candidates score within roughly 10% on merit but differ materially in spirit, or the choice has irreversible consequences. Apply the tiebreakers lexicographically — only move to the next level if the prior level can't separate the options.

1. **Member safety.** Physical, financial, reputational, psychological. If one option exposes Members to harm and the other doesn't, the safe option wins. No matter what else.
2. **Platform health.** The continued existence and credibility of the platform. A choice that compromises the platform's ability to keep serving Members loses, even if it looks better in the short term.
3. **Member data protection.** Minimization, consent, control, deletion. Between two otherwise-tied options, the one that asks for less data or gives Members more control wins.
4. **Mutual benefit with reversibility.** Fall back to the default. Pick the option that serves the most parties and can be undone if the situation changes.

The order is meaningful. Member safety beats platform health beats data protection beats mutual benefit. Putting safety first is a stance — past framings put platform survival first; this one inverts that on close calls.

---

## The one absolute — wealth circulation over wealth extraction

There is exactly one categorical commitment in this project: **prefer wealth circulation over wealth extraction in every architectural, product, and business choice.**

When a design move would route value out of the local economy to a third party that isn't earning it, the move loses — even if it would be cheaper, faster, or more conventional. When a design move keeps value circulating among the people who created it, the move wins by default.

Worked applications:
- **Zero platform transaction fees on Member-to-Member commerce.** Payment rails earn their cost; the platform does not skim.
- **No platform self-custody of Member funds.** Custody belongs with chartered partners or the Members themselves.
- **Closed-loop ledger first; card and ACH as on-ramps.** Each rail picked against the wealth-circulation rubric: fees / float / rail-ownership / lock-in.
- **No advertising marketplace.** Ads route attention to the highest bidder; that's extraction by design.

Everything else in the project — including the tiebreakers above — is a default with named exceptions. Only wealth circulation over extraction is categorical, and it carries that status because it's the project's reason for existing.

---

## Architect for reversibility

The decision rule has a corresponding architectural commitment. Build so that today's call can be revisited tomorrow:

- **Schema columns over enums where the set might grow.** Easier to add a column than to migrate an enum.
- **Feature flags on anything Member-visible that's still being validated.** Reversible at runtime, not at deploy.
- **Versioned contracts on event payloads and API responses.** Yesterday's consumers keep working when today's producer changes.
- **Sub-routines over standalone skills until the sub-routine has earned standalone status.** A sub-routine can be promoted; a skill is expensive to retire.
- **Defaults with named exceptions over absolutes.** A default can be revised in one place; an absolute requires re-deriving the casework everywhere it was applied.

When a decision lands in `PLATFORM-PATTERNS.md` or `DEVELOPMENT-PATTERNS.md`, the Intent paragraph implicitly carries reversibility — what would have to change for this to come back out of the doc. If the answer is "we'd have to rebuild from scratch," the decision needs more scrutiny before it lands.

---

## How to spot an unearned absolute

Default-with-exception is the prose stance. An absolute is earned only when there's a rationale you'd defend out loud. Watch for these words in specs, pattern docs, and agent output:

> never · always · must · cannot · refuses · no X · only · purely · entirely · categorically · deliberately no

Each one is a flag. Either soften the statement to a default ("default to X; exceptions named below") or, if the absolute is genuine, attach a State-tagged Intent line — a one-sentence rationale plus a date — co-located with the bullet. Example:

```
- The platform never custodies Member funds for itself.
  Intent: Custody invites regulatory exposure that compromises platform health
  and creates extraction surface area that the wealth-circulation absolute forbids.
  (Ratified 2026-05-12)
```

Or, when the absolute isn't yet defensible:

```
- (Deferred) Whether the platform supports anonymous gifting.
  Intent: Deferred until b3; review by 2027-Q1 when the chartered-partner relationship is settled.
```

Absolutes without a State tag are unratified de-facto and block the pipeline. The `weigh` skill is the place to ratify or defer them; the `tidy` skill flags ones that slipped through.

---

## Worked examples — applying the rule

**Example 1: Should kind='business' Groups have an admin queue for verification?**
*Surface:* Adding an admin queue (one option) vs trust + downvote (other option).
*Close call?* Yes — both serve safety differently.
*Tiebreaker 1 (member safety):* Admin queue catches bad actors before they're visible. Wins on this dimension.
*Tiebreaker 2 (platform health):* Admin queue introduces operational cost the platform can't sustain at solo scale. Loses on this dimension.
*Resolution:* Conflicting tiebreakers at adjacent levels — escalate to PM. PM picked trust + downvote with the reversibility hook of "add admin queue later if abuse signal crosses threshold." Reversibility preserved.

**Example 2: Should we use Stripe or build a closed-loop ledger first?**
*Surface:* Stripe is faster to ship; closed-loop ledger is the wealth-circulation-aligned choice.
*Close call?* No — the wealth-circulation absolute decides it.
*Resolution:* Closed-loop ledger first. Stripe stays as an on-ramp for card payments only; never the system of record.

**Example 3: Should agent delegations expire after 90 days by default?**
*Surface:* 30 days (more friction, more safety) vs 90 days (less friction, more convenience) vs configurable per-Member.
*Close call?* Yes.
*Tiebreaker 1 (member safety):* 30 days is safest.
*Tiebreaker 2 (platform health):* Friction at 30 days might reduce adoption to the point the feature can't sustain itself.
*Tiebreaker 3 (data protection):* 30 days minimizes the window of compromise.
*Resolution:* Two tiebreakers favor 30 days; one favors 90. PM picks 30 with the reversibility hook of "configurable later if adoption signal demands."
