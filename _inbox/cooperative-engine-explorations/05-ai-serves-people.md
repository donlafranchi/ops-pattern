---
id: explore-ai-serves-people
purpose: The constitutional "AI serves the people it acts for — it does not replace them" clause, made operational through human-in-the-loop UX and a Member-published Skill catalog.
layer: what
status: draft
---

# 05 — AI Serves People (Operational Patterns)

> The constitutional AI-serves-not-replaces clause made concrete. The platform's agent surfaces are the proof-of-concept: agents make work more leveraged, never replace the human doing it.

---

## Practical-to-begin

Three concrete UX patterns that honor the constitutional clause from [`principles.md`](../../product/foundation/principles.md):

- **Propose-Ratify.** Agents propose actions; Members ratify. No agent action lands without a Member tap, except for actions the Member has pre-authorized in a clearly-scoped Delegation. The pre-authorization itself is a Member action with a clear scope (what the agent can do), a clear duration (how long), and a clear stop (one tap to revoke).
- **Human-in-the-Loop visibility.** Every agent action shows the human-in-the-loop confirmation gate before it fires for irreversible actions: spending money, posting publicly, sending messages outside the Member's existing trust network. Reversible actions (drafting, searching, summarizing) can proceed silently within the Delegation scope.
- **Audit-Undo-Replay.** Members can audit any agent action taken on their behalf, undo it within a defined reversal window, and replay the agent's reasoning trace. This makes agent activity *legible* to Members, not just *hidden behind a result*.

Six-to-twelve-month shipping inside [`agent-assistance.md`](../../product/systems/agent-assistance.md) looks like:

- Substrate first: the `delegations`, `member_self_records`, `skill_subscriptions`, `skills`, `skill_versions` tables already planned for b1.
- Surface next (b2+): the confirmation-gate UX, the audit log surface (`/you/audit`), the Delegation-scope creator (`/you/delegations`).
- One concrete vertical pilot: agent-assisted Initiative coordination. A Member starting an Initiative gets agent help on outreach, scheduling, and logistics — but the Member is the host, the Member ratifies every external message, and the Member can undo the agent's actions for 24 hours after each fires.

## Ambitious-for-the-goal

An entire industry of agent-mediated services where the question is never "did the AI take my job?" but "did the AI make my work more leveraged?"

- **Member-published Skill catalog.** Members who have mastered a workflow — hosting a farmers market, organizing a CSA, running a workshop series, forming a cooperative — publish that workflow as a Skill. Other Members subscribe to the Skill and get agent help that embodies the published expertise. The Member who published it earns patronage credits when their Skill is used; the Member who subscribed gains time leverage. Tacit knowledge becomes shareable.
- **No platform-side optimization.** The platform never gets an agent to optimize for Member time-on-platform, click-through, or engagement. Agents serve the Members who employ them; the platform's only role is to provide the substrate, the audit trail, and the Skill catalog.
- **Anti-extraction by design.** Agent-mediated services where the agent's incentives are aligned to the Member who employs it, not to any third party. Skills are vetted by Member-reviewers; published Skills carry transparent provenance (which Member wrote it, when it was last updated, what data it touches).
- **AI as collective intelligence.** The federation layer (Exploration 03) becomes the substrate for collective Member intelligence. A federation of childcare cooperatives shares a Skill that handles state-specific regulatory compliance. Each cooperative benefits from the shared Skill; the Skill stays accountable to the cooperatives that govern it.

The end state: Members spend dramatically less time on the work that agents can do well (research, scheduling, paperwork, compliance), and dramatically more time on the work that humans do best (relationships, judgment, presence, craft). The Flourishing Index moves up on both dimensions: more discretionary hours, better adequacy margin (because the work members do gets more leveraged).

## Why it serves the mandate

The constitutional clause itself ("AI serves the people it acts for — it does not replace them") sits at the top of [`principles.md`](../../product/foundation/principles.md). This exploration operationalizes it.

Treatment patterns from [`impact-diagnostic.md`](../../product/foundation/impact-diagnostic.md):
- *Information symmetry* (pattern 2). Agents make tacit expertise legible. Skills are auditable.
- *Anti-lock-in* (pattern 3). Skills are portable. Members own their Assistant Context. Members can revoke any Delegation at any time.
- *Realigning incentives* (pattern 1). Agents are aligned to Members who employ them, never to the platform's revenue model.

On the Flourishing Index: time and money both move up. Members spend less time on agent-suitable work (time), get more leveraged output from the work they do (money). The catch — and the constitutional discipline — is that the platform must not turn this into a way to *extract* from Members; agents are the Member's leverage, not the platform's leverage over the Member.

## Open questions

- **Confirmation gates.** Which actions are reversible-enough to proceed silently, which require a tap? Spending money: always tap. Posting publicly: always tap. Drafting, searching, summarizing: silent within scope. The middle ground (sending an in-platform message to another Member; signing the Member up for a workshop) needs explicit policy.
- **Skill publication.** How is a Skill vetted before it appears in the catalog? Member peer review? Federation-of-Skill-authors governance? Per-Skill liability disclaimer? Probably layered.
- **Compute cost.** Who pays for agent compute? Members directly (transparent, but excludes those who can't afford it), federation (shared via patronage), or platform (creates incentive for the platform to limit agent capability). Lean toward layered: a free tier for basic agent help, federation-shared compute for shared Skills, Member-paid for high-cost queries.
- **Anti-misuse.** Preventing agent-mediated extraction between Members. A Member using their agent to scrape another Member's data; a Member using their agent to manipulate another Member's decisions; bot-mediated activity disguised as Member activity. Probably: agent identity is always visible (every agent action is labeled as agent-on-behalf-of-Member), and agents follow the same anti-abuse rules as Members.
- **Skill compensation.** When a Member subscribes to another Member's Skill, what's the compensation model? Patronage credits within a federation; flat fee; usage-based fee; mixed?
- **Constitutional tension.** Can a Member ever delegate so much that they're no longer "the human in the loop" in any meaningful sense? Probably yes — Members can fully delegate routine work — but the audit trail and the easy revocation are the constitutional protection. The line is not "no delegation" but "no irrevocable delegation, no opaque delegation."
- **Cooperative Skill governance.** When a cooperative or federation publishes a Skill on behalf of its members, who governs the Skill? Member vote? Standing committee? This is downstream of the Federation Layer exploration but worth flagging early.

## Where this connects

- [`principles.md`](../../product/foundation/principles.md) — the AI-serves clause is constitutional.
- [`impact-diagnostic.md`](../../product/foundation/impact-diagnostic.md) — treatment patterns 1, 2, 3.
- [`agent-assistance.md`](../../product/systems/agent-assistance.md) — the system spec where this lives.
- [`action-layer.md`](../../product/systems/action-layer.md) — confirmation gates and scoped capability vending are already substrate.
- [03-federation-layer.md](03-federation-layer.md) — federations are the natural Skill-governance unit.
- Every other exploration becomes more practical when agents can help Members navigate it.
