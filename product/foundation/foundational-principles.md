# Main Street Market — Foundational Principles

> **Status:** Foundational constitution. The P1–P8 first principles + the Decision Test + categorical failures + monetization hypothesis + metrics baseline + privacy/security baseline that every proposal grades against. Read alongside [`community-design-philosophy.md`](community-design-philosophy.md) — the *structured measuring stick* — and the implementation-level commitments in [`people-first.md`](people-first.md), [`policy-framework.md`](policy-framework.md), [`platform-promise.md`](platform-promise.md), [`loops.md`](loops.md), and [`primitives.md`](primitives.md). When this document and `community-design-philosophy.md` conflict, prefer `community-design-philosophy.md` for the *what good looks like*; this document is the *binary pass/fail filter*. When this document and a system spec conflict on a structural mechanism, the system spec wins on the mechanism but the failure must still survive this document's tests.

**A grading rubric for every decision on this project.**

*Internal-use document. A public-facing version with neutral language is maintained separately.*

## Purpose

This document is the constitution. Designers, planners, architects, build agents, reviewers, and security personnel all grade their work against it. If a proposal cannot pass the Decision Test in Part 2, it does not ship — regardless of how well-crafted it is. Other system specs, scenarios, tickets, and code are subordinate to these principles. When they conflict, this wins.

The principles are written to be quotable. Each is short enough to drop into an agent prompt. Each test in Part 2 returns a binary answer. Each anti-pattern in Part 3 is a categorical fail.

---

## Part 1: First Principles

### The single "Never"

> **We will never support extractive wealth over circulative wealth.**

This is the only absolute commitment in this project. Every other use of "Never / Permanent / Categorical / Indefinite / Forever / Always" across the project is up for review. State design intent and mitigations; leave the door open for architecture to evolve as real Members express real needs.

### The central premise

> **Make communities wealthier and healthier.** That is the purpose of the platform. Every feature, decision, and design choice exists in service of this. Wealth means money that stays and compounds locally; healthier means stronger relationships, more capable Members, and greater collective agency.
>
> **Every community matters equally.** The platform does not prioritize one community over another — not by attention, not by ranking algorithms, not by feature availability, not by support resources, not by roadmap. A small rural community in central California has the same standing in the platform as Sacramento.

These two commitments sit directly under the single "Never" and above the eight principles below.

### P1. Serves people, not the other way around.
Members do not perform labor for the platform. The platform stays light, fast, and useful. When platform interest and member interest diverge, the member wins. This is the master principle; every other principle is subordinate to it.

### P2. Together, materially better off.
The platform exists to bring people into actions that improve their financial, social, health, and quality-of-life outcomes. A feature that moves none of these is decoration.

### P3. More agency, no externalities.
Every interaction expands the member's options, knowledge, or capability. Wins for one member or community do not come at the expense of others — inside the platform or outside it.

### P4. Circulate wealth. Strengthen the common person.
The platform exists to strengthen the common person — the household, the solo operator, the tradesperson, the small farmer, the neighborhood — by keeping more of what gets earned, spent, and built circulating among them. The line is extraction, not size: large actors that genuinely help the common person are welcome; small actors that squeeze them are not. The disposition is union-member, co-op-joiner, guild-member: ordinary people pooling effort to strengthen their own position. Independent producers and service providers should have access to world-class discovery, intelligence, and coordination capabilities — tools that match or exceed what large competitors have.

> **Intent:** Pre-empt the framing trap where "small business good, big business bad" gets read as anti-capitalism. The platform's enemy is extractive structure, not scale per se — a Mondragon-scale federation of cooperatives is squarely the goal. Use this to disarm "but X is big, so it must be bad" arguments and keep the focus on whether a given actor extracts from or strengthens the common person.

### P5. Federated, stakeholder-owned, locally run.
Growth shape is Mondragon-like: networks of locally-rooted, member-owned units sharing infrastructure but making their own decisions. Governance is AA-style: chapters run themselves; the platform responds to their needs and does not direct them. Members hold real stake.

### P6. Default-private, opt-in expansion.
Few hard rules. Most things default to off, quiet, or private. Participation expands by deliberate consent.

### P7. Built so bad actors fail.
Every system assumes adversarial use. Nefarious behavior is uneconomical, surfaced, or contained — without making the platform hostile to legitimate users.

### P8. Agent-native.
The platform is designed for a near future where AI assistants act on members' behalf. It must remain navigable, useful, and safe through that channel from day one.

---

## Part 2: The Decision Test

Every proposal — feature, spec, ticket, design, code change — passes through this checklist. If any answer is "no" or "unclear," the proposal is reworked or rejected.

1. Does this make members materially better off (financial, social, health, quality-of-life)?
2. Does this expand the member's agency, or reduce it?
3. Could a benefit here harm another member or community? If so, has that been resolved?
4. Does this advantage the small operator over the large?
5. Does this respect default-private, opt-in expansion?
6. Has a bad actor's use of this been modeled and mitigated?
7. Does this stay lightweight and fast? Will it under realistic scale?
8. Does this work when an agent is acting on a member's behalf?
9. Does this preserve local control, or does it impose a central decision?
10. Does this treat the member as a stakeholder, not as a "user"?

---

## Part 3: Categorical Failures

These are not judgment calls. Any proposal exhibiting one of these fails by definition.

- **Engagement-as-goal metrics.** Time-on-platform, scroll depth, sessions-per-day, notification CTR. Optimizing for these violates P1.
  **Intent:** Time-on-platform is the metric of every directory and social network the platform is structurally refusing to become. Naming it as a categorical fail (not a debate) is the only way to keep it out of dashboards by inertia — once it's a number on a chart, the gravity of "improve the chart" makes the principle unenforceable. Pair this with a positive North-Star metric (member outcomes, not session counts) so the gap doesn't get filled by drift.
- **Dark patterns.** Streaks, loss aversion, faux-scarcity, hidden defaults, hard-to-cancel flows.
- **Engagement-shaped ad injection.** Ads inserted into the engagement stream to optimize for click-through, dwell time, behavioral targeting, or attention-capture — same failure mode as the engagement-as-goal-metrics entry above. Other forms of advertising are *not* categorically refused; see Part 8 for the revenue-design space where constrained non-engagement-shaped advertising forms (sponsorship, vetted local promotions, federation-partner placements, etc.) live as open design.
  **Intent:** The earlier "Ad injection. Of any kind, from any party." entry (revised 2026-05-12) was over-broad and conflated *advertising as a revenue category* with the specific *engagement-feed-injection* failure mode that's the load-bearing concern. What's categorically refused is the engagement-shape: ads that turn the platform into an attention-capture surface. Other ad shapes — community-vetted local sponsorship, federation-partner placements, verified-local-business promotion lines — are revenue-design space the platform may explore under the multi-source-revenue commitment (Part 8). The narrower refusal preserves the load-bearing principle while leaving the financial-durability door open.
- **Data-as-product.** Selling, sharing, or licensing member data to third parties for any purpose other than what the member explicitly directed.
- **Gatekeeping ratings.** Star-rating systems whose primary function becomes the platform's leverage over the small operator (Yelp / Angi pattern).
- **Founder-as-CEO patterns inside chapters.** Permanent admin / owner roles that calcify community governance.
- **Centralized override of local decisions.** The platform may set safety floors; it does not override chapter-level governance on community matters.
- **Charging the small to subsidize the large.** Any pricing structure where independent operators effectively pay so larger ones can win.
- **Lock-in.** Members must be able to leave, take their data with them, and not lose their relationships.
- **Hostile-to-leaving design.** Account deletion must be as easy as account creation.

---

## Part 4: How to Use This Document by Role

### Designer
Before drafting an interface, read Parts 1–3. Every screen, flow, and interaction is a small bet about which principle wins. Bring the Decision Test to design review.

### Planner / Scenario Writer
Scenarios must name which principles they advance and which they're at risk of violating. A scenario that doesn't engage with at least one principle is not yet a scenario worth approving.

### Architect
System designs must be checked against P5 (federation), P7 (adversarial use), and P8 (agent-native). These are architectural concerns, not feature concerns — they're decided at the system-shape level or not at all.

### Build Agent
Use Parts 2 and 3 as preflight checks. Tickets that cannot answer the Decision Test are not yet implementable; send them back.

### Reviewer / Evaluator
Grade work against principles, not just acceptance criteria. A spec that meets its acceptance criteria but violates a principle has failed.

### Security Personnel
P6 (default-private), P7 (bad actors fail), and the privacy / security baseline in Part 7 are your domain. Threat-model every system before launch.

---

## Part 5: Self-Assessment of Existing System Specs

This section assesses the four system specs visible in the working set: `community.md`, `initiatives.md`, `member.md`, `service-provider.md`, plus the supporting files `maker_outreach_list.md`, `Use_Cases`, and `Resources_`. Other project documents not visible in the working set are flagged in Part 9.

**Strong alignment.**

- `community.md` — the absence of admin / owner roles, the AA chapter pattern, the verb-first composer (anti-Nextdoor), default-private interest matching, cross-community visibility (anti-tribalism). Multiple principles structurally enforced rather than rhetorically claimed.
- `initiatives.md` — the initiator ↔ supporter primitive, in-person-meeting-as-default, the deliberate T1 minimalism, private interest matching, the trust-not-platform-enforcement stance on pledges.
- `member.md` — Member-as-foundational-primitive (vs. "user"), stake accumulation framing, soft delete preserving credit, privacy-first interests.
- `service-provider.md` — the **Saved-not-Follow** distinction (avoids notification-treadmill engagement traps), endorsements over star ratings (avoids gatekeeping), community-anchored trust.

**Weak coverage relative to principles.**

- **P8 (agent-native) — absent in all specs.** No system doc currently considers an agent acting on a member's behalf. Largest blind spot.
- **P7 (bad actors fail) — partial.** Flag-and-hide moderation is in place. No threat model, no abuse-vector enumeration, no system-level adversarial design.
- **P1 lightweight / performant — undefined.** No performance targets, no bundle-size budget, no guardrail against feature bloat.
- **No metrics.** No definition of what success looks like in-app.

These are not failures of the existing specs — they are gaps that need to be filled by separate documents (see Part 9).

---

## Part 6: Default Platform Metrics

**Operating principle: measure what happens inside the app.** The platform cannot honestly measure local economic impact, multiplier effects, or community health outside the app's own surface. Those are downstream consequences the movement claims philosophically; they are not metrics the platform reports until and unless the data exists to support the claim.

The platform measures: did members find each other, and did something happen?

There are no users yet, so the metrics below are generic best-practice categories with a Slow Economy lens. Their job is to keep the wrong metrics from installing themselves by default. Real thresholds will be set after 90 days of real usage.

### Discovery & Matchmaking — the core success question
- **Search-to-find rate.** Of searches a member runs, how many result in landing on a maker, service provider, or community page? *Discovery is happening.*
- **Find-to-engage rate.** Of pages landed on, how many result in a follow, save, encouragement, or message? *Discovery is converting to relationship.*
- **Initiative match rate.** Of Initiatives posted, how many get at least one Encouragement and one Pledge from members not already known to the initiator? *The platform is making strangers into collaborators.*
- **Ask-to-fulfill rate.** Of Asks posted, what percentage are marked fulfilled? *Needs are being met.*
- **Wonder conversion rate.** Of Wonders posted, what percentage convert to a Host or Initiative? *The activation-energy slot is working.*

### Member Engagement (per member)
- **Time-to-first-action.** New member to first Offer / Ask / Host / Wonder / Follow / Save / Encouragement.
- **Repeat-action rate.** Percentage of new members who take a second meaningful action within 30 days.
- **Active member ratio.** Members who took ≥1 meaningful action in the last 30 days, divided by total members.
- **Action diversity.** Average distinct action types per active member per month. (Members who only do one thing are at risk of churning.)

### Community Health
- **Communities forming vs. dormant.** New communities created vs. communities with no activity in 30+ days.
- **Membership growth per community.** Median and distribution.
- **Posts per active community per month.** Tracked separately by post type.
- **Cross-community participation.** Average communities per member; share of members in ≥2.
- **Initiative throughput.** Number of Initiatives moving through `thinking → refining → active → funded → closed` per community per quarter.

### Platform Growth
- New members per week.
- New communities per week.
- Net retention at 30 / 60 / 90 days.
- Geographic footprint (cities, neighborhoods).

### Anti-Metrics — explicitly never optimized for
Listed so they cannot be smuggled in.

- Daily active users as a goal in itself
- Time-on-platform
- Scroll depth or session length
- Push-notification open rate or click-through rate
- Streaks, gamified retention, engagement loops
- Anything that resembles social-media metrics applied to local commerce

The rule: measure interactions that produce real-world meetings, transactions, or fulfillment. Do not measure attention.

---

## Part 7: Privacy & Security Baseline

What a regular person should be able to assume about this platform without reading the privacy policy.

### Data handling
- Encryption in transit (TLS) and at rest for sensitive fields (PII, contact methods, private interest tags, messages).
- **Member interests and experience flags are never publicly visible.** Per the Member system, they're used only by platform alerting and facilitator suggestions.
- Data minimization: collect only what's needed for the feature. New fields require a documented purpose.
- No selling, sharing, or licensing of member data to third parties. Period.
- Soft delete preserves community history; hard delete on member request honors data deletion within 30 days where legally possible.
- Plain-language privacy policy. Legal version available; readable summary primary.

### Account safety
- Strong password requirements; password-manager friendly.
- Two-factor authentication available, encouraged for community starters and Initiative initiators.
- Account recovery flows that resist social engineering.
- Notification when a new device or location signs in.
- Members can see and export their full activity history.

### Communication safety
- Messaging is between members who share at least one community context.
- Block and report are first-class actions, not buried.
- Two flags hide a post pending review (per Community).
- A blocked member cannot see the blocker's posts, profile, or new activity.

### Moderation and trust
- Community-level moderation by trusted servants (T2), not platform-imposed.
- Platform-level moderation is reserved for safety floors: harassment, illegal content, spam, impersonation.
- All moderation actions are logged and appealable.

### Transparency
- Members can see what data the platform holds on them.
- Profile-view counts are aggregate-only — never identity-revealing — to discourage stalker-style surveillance.
- Public commitments to data handling are versioned; changes are announced before they take effect.

### What this baseline does not yet include
A formal threat model, a security audit cadence, and a coordinated disclosure / bug-bounty program. These are flagged in Part 9.

---

## Part 8: Monetization (Working Hypothesis)

Stated for the constitution because how the platform makes money determines whether it can honor every other principle.

### Working hypothesis

**A multi-source revenue platform — not VC-funded, not member-fee-only.** Revenue comes from a diversified set of lines, all of which must be earned through the platform actually serving Members and communities.

**The platform will not raise venture capital.** VC funding optimizes for exit, and an exit-aligned platform is misaligned with the load-bearing purpose (Members materially better off, durable community wealth). VC pressure on growth metrics also creates structural pressure toward the engagement-optimization failure modes the platform exists to refuse. The platform earns its revenue from product use, not from raising rounds.

**Multi-source revenue is required from early on.** Member fees are *one small part* of the revenue picture, not the primary source. Over-reliance on any single revenue line — including Member fees — is a vulnerability the platform structurally avoids. The platform needs several revenue lines operating from early in its life so no one source can capture the platform's incentives.

Free participation in core community functions is non-negotiable. Members must be able to use the platform meaningfully without paying.

> **Intent:** The "no VC + multi-source-early" commitments (ratified 2026-05-12) are structural protections for the platform's purpose. VC alignment with exit makes the platform's purpose (Members better off long-term) unenforceable against board pressure for exit-shaped growth. Single-source-revenue dependence (whether on Member fees, on a single sponsor, on a single advertiser, or on any single contract) creates a structural lever any one party can pull to redirect platform decisions. Multi-source-from-early-on is the financial-durability discipline: no single contract or category can hold the platform's incentives hostage. Test for future proposals: does this proposal create over-reliance on any single revenue line, or accept VC? If yes, refuse — the structural protection is multi-source-self-funded, full stop.

### Revenue lines under consideration

The platform needs several of these operating from early on. Reliance on any single line is structurally avoided.

- **Member dues.** Voluntary or tiered membership contributions, possibly community-level (community dues paid into a community fund) and platform-level (small contribution to platform sustainability). *One of several lines, not the primary.*
- **Vendor success-fees.** Vendors pay only after their participation crosses a defined success threshold — e.g., a percentage of revenue above a floor, or a fee triggered by sustained sales volume. **Earn-before-extract is the design intent.**
- **Constrained advertising (design space open).** Non-engagement-shaped advertising forms are revenue-design space — community-vetted local-business sponsorship, sponsored verified-local badges, federation-partner placements, sponsored community gatherings, etc. **Engagement-shaped ad injection** (feed-injection, behavioral targeting, attention-capture surfaces) remains categorically refused per Part 3. The specific constrained forms acceptable are an open question — see below.
- **Federated services revenue (long-horizon).** When the cooperative-services layer (bookkeeping, insurance pool, legal templates) ships, members may pay for those services; margin sustains the platform.
- **Sponsored federation handoffs (long-horizon).** When the platform spawns federated infrastructure (banking, insurance, BI), the federation partners may pay placement-shaped fees that don't compromise Member-side experience.

### What is forbidden

- **Engagement-shaped ad injection.** Ads optimized for click-through, dwell time, behavioral targeting, or attention-capture. Categorical fail per Part 3.
- **Venture capital funding.** Refused as a funding model. VC alignment with exit is misaligned with the platform's purpose; VC pressure on growth metrics creates structural pressure toward the engagement-optimization failure modes. Revenue must come from product use.
- **Data sales or licensing.** Categorical fail.
- **Charging the small operator before they succeed.** Any vendor-fee structure that taxes a struggling operator violates P4.
- **Subscriptions disguised as gates** that prevent core community participation. Members must be able to participate meaningfully without paying.
- **Over-reliance on a single revenue line.** Structural vulnerability; multi-source diversification is the discipline. Any plan that puts >50–60% of revenue through a single line should trigger re-evaluation.

### Open questions

- How are member dues structured — flat, tiered, voluntary, community-set?
- What is the success threshold that triggers vendor fees?
- What forms of advertising are acceptable under the "constrained, non-engagement-shaped" framing — sponsorship of community gatherings? Vetted local-business promotions? Verified-local badges? Federation-partner placements? Where does the line sit between "non-engagement-shaped" (acceptable) and "engagement-shaped" (refused)?
- How does the platform balance Member-side experience against revenue when the ad-design space is being explored?
- Is there a community-level revenue share — does the community where a sale happens get a portion?
- How is platform sustainability separated from community-fund accumulation?
- What threshold of single-source-concentration triggers the multi-source-discipline re-evaluation?

These questions must be answered before launch. The principles in Part 1 do not specify the answer; they constrain it.

---

## Part 9: Gaps This Document Cannot Yet Fill

This section names what is missing and offers direction for filling each gap.

### File-scope gaps
This document was written from a partial working set: `community.md`, `initiatives.md`, `member.md`, `service-provider.md`, `maker_outreach_list.md`, `Use_Cases`, `Resources_`. The full project likely contains additional files — north-star definitions, bundle definitions, scenarios, tier-specific CLAUDE.md files, design tokens — that were not visible to the author of this document.

**Suggestion.** Maintain a master index of project documents accessible to every agent and reviewer. Where this constitution and another document conflict, name explicitly which wins. The default rule should be: this constitution wins on principles; system specs win on system-level mechanics; tickets win on implementation detail.

### Agent-native design (P8)
No system spec currently addresses agent-mediated use. This is the largest single gap.

**Suggestion.** Draft an `agents.md` system doc. Topics: API surface for delegated action, scoped authorization (an agent can do X but not Y), member-visible audit log of agent actions, "your agent did this — confirm / undo" UX, agent-specific abuse vectors (bot armies, scraping, automated spam), how communities consent to agent participation, and whether a member who never opens the UI is a first-class case.

### Threat model (P7)
Current docs include flag-and-hide and soft delete. Neither is a threat model.

**Suggestion.** Draft a `threat-model.md`. Enumerate adversaries: state-actor astroturf, paid bots, individual stalkers, scammers, dropshippers LARPing as local makers, hostile-competitor scraping, retaliatory negative reviewers, social-engineering attempts on community starters. For each, name the designed-in mitigations vs. the moderated-in mitigations.

### Performance budgets (P1)
"Lightweight" without numbers drifts heavier with every release.

**Suggestion.** Set hard targets: time-to-interactive on a 3-year-old Android, API p95 latency, total bundle size ceiling, home-screen render budget. A feature that breaches any of these does not ship.

### Externalities operational test (P3)
The principle is clear. The test is not.

**Suggestion.** Define the test for the cases the platform will see in practice — overlapping or competing nearby communities, makers serving multiple cities, Service Providers whose service area expands. A feature passes if a benefit to one party cannot be shown to harm another within the platform. Out-of-platform externalities are not measurable but should still inform design.

### Metrics with real thresholds
Part 6 names categories and default metrics. It does not name pass / fail thresholds, because the platform has no users yet.

**Suggestion.** After 90 days of real usage, revisit each metric category and set thresholds (e.g., "find-to-engage rate ≥ 25% by month 3"). Until then, track trends, not targets. Resist the temptation to set thresholds before there is data; arbitrary targets become arbitrary product decisions.

### Detailed monetization plan
Part 8 is a working hypothesis, not a plan.

**Suggestion.** Before launch, write a separate `monetization.md` that resolves the open questions and is reviewable against this constitution.

### Bug bounty and security audit cadence
Part 7 names the privacy / security baseline. It does not specify how the platform proves it.

**Suggestion.** Plan for an independent security review before launch and on an annual cadence after. Establish a coordinated-disclosure policy and (post-launch) a small bug-bounty program.

### Governance for changes to this document
This document will need to change. How it changes matters.

**Suggestion.** Treat the constitution as versioned. Material changes (adding or removing a principle, weakening a categorical failure) require a written rationale and review. Tactical changes (clarifying language) can be made freely. Versions are tagged in the project repository.

---

## Closing

The principles in Part 1 are the answer to the question: *what is this project really about, when every other consideration is stripped away?* Everything else in this document is implementation discipline around those principles. If the principles are wrong, every downstream artifact is wrong. If the principles are right and the discipline holds, the platform stays the platform across thousands of decisions made by many people across many years.

When in doubt, return to P1: **the platform serves people.** Most failures of products like this have been failures to honor that single sentence.
